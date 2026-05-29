import { COLOR } from "@/constants";
import React, { useState, useEffect, useRef } from 'react';
import { Alert, TextInput, Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchButton from '@/assets/images/search_button.svg';
import IconClose from '@/assets/images/icon_close.svg';

const STORAGE_KEY = '@recent_searches';

interface SearchInputProps {
  searchKey?: (searchKey: string) => void;
}

export default function SearchInput({ searchKey }: SearchInputProps) {
  const [inputText, setInputText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<TextInput>(null);

  // 💡 1. [로드] 앱이 켜질 때 로컬 스토리지에서 기존 검색어 가져오기
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const savedSearches = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedSearches !== null) {
          setRecentSearches(JSON.parse(savedSearches));
        }
      } catch (e) {
        console.error('최근 검색어 로드 실패:', e);
      }
    };
    loadRecentSearches();
  }, []);

  // 💡 실시간 글자 변경 감지 (다 지웠을 때 즉시 전체조회 유발)
  const handleInputChange = (text: string) => {
    setInputText(text);
    
    // ✅ 유저가 글자를 완전히 지우면 상위 컴포넌트에 빈 값을 보내 즉시 전체 조회가 되도록 만듭니다.
    if (text.trim() === '') {
      searchKey?.('');
    }
  };

  // 💡 2. [검색 기능 통합] 중복 제거 및 단일 요청 보장
  const handleSearch = async (keyword: string) => {
    const trimmedKeyword = keyword.trim();
    // 화면 입력창 동기화
    setInputText(trimmedKeyword);

    // ✅ 검색어가 아예 없는 빈 값 상태라면 유효성 검사를 건너뛰고 전체 조회를 처리합니다.
    if (!trimmedKeyword) {
      searchKey?.('');
      return;
    }

    // 🔍 검색어 보안 및 유효성 검사
    const validation = validateSearchKeyword(trimmedKeyword);
    if (!validation.isValid) {
      Alert.alert('안내', validation.message);
      return; // ❌ 조건 통과 못 하면 차단
    }

    
    // ✅ [핵심] 부모 컴포넌트의 페이징 리셋 및 API 요청은 여기서 '딱 한 번만' 호출합니다.
    console.log('Selected category1 :', trimmedKeyword); 
    searchKey?.(trimmedKeyword);

    // 로컬 스토리지 최근 검색어 저장 처리
    try {
      const filtered = recentSearches.filter(item => item !== trimmedKeyword);
      const newSearches = [trimmedKeyword, ...filtered].slice(0, 10);
      
      setRecentSearches(newSearches);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
    } catch (e) {
      console.error('최근 검색어 저장 실패:', e);
    }
  };

  // 💡 3. [삭제] 최근 검색어 개별 삭제
  const handleRemoveRecentSearch = async (keyword: string) => {
    try {
      const filtered = recentSearches.filter(item => item !== keyword);
      setRecentSearches(filtered);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      // ✅ 내가 검색해서 보고 있던 키워드를 최근 검색어 칩에서 삭제하면 
      // 입력창을 비워주고 리스트도 전체 조회 상태로 되돌립니다.
      if (inputText === keyword) {
        setInputText('');
        searchKey?.('');
      }
    } catch (e) {
      console.error('최근 검색어 삭제 실패:', e);
    }
  };

  // 보안 검증 로직
  const validateSearchKeyword = (keyword: string): { isValid: boolean; message: string } => {
    const trimmed = keyword.trim();
    if (trimmed.length === 0) {
      return { isValid: true, message: '' };
    }
    if (trimmed.length > 30) {
      return { isValid: false, message: '검색어는 최대 30자까지 입력 가능합니다.' };
    }

    const sqlInjectionRegex = /(union|select|insert|drop|alter|update|delete|where|\-\-|or\s+['"]?1['"]?\s*=\s*['"]?1)/i;
    if (sqlInjectionRegex.test(trimmed)) {
      return { isValid: false, message: '보안상 사용할 수 없는 단어가 포함되어 있습니다.' };
    }

    const xssRegex = /(<script.*?>|<\/script>|<|>|javascript:|onerror|onload)/i;
    if (xssRegex.test(trimmed)) {
      return { isValid: false, message: '특수기호나 스크립트 문구는 검색할 수 없습니다.' };
    }

    const validPattern = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]+$/;
    if (!validPattern.test(trimmed)) {
      return { isValid: false, message: '한글, 영문, 숫자만 입력해 주세요.' };
    }

    return { isValid: true, message: '' };
  };

  return (
    <View style={[styles.container, { paddingHorizontal: 16 }]}>
      <TouchableOpacity 
        style={styles.searchContainer}
        activeOpacity={0.6}
        onPress={() => {
          searchInputRef.current?.focus();
        }}
      >
        <TextInput
          ref={searchInputRef}
          style={styles.searchText}
          placeholder="참여하고 싶은 모임이나 클럽을 검색해 보세요."
          placeholderTextColor={COLOR.COMM_GRAY_2}
          value={inputText}
          onChangeText={handleInputChange} // ✅ 실시간 감지 핸들러로 변경
          onSubmitEditing={() => handleSearch(inputText)} // ✅ 엔터 칠 때도 정상 작동하도록 주석 해제
          returnKeyType="search"
        />
        <TouchableOpacity style={{zIndex: 1}} onPress={() => handleSearch(inputText)}>
          <SearchButton width={20} height={20}/>
        </TouchableOpacity>
      </TouchableOpacity>

      {recentSearches.length > 0 && (
        <View style={styles.recentSearchContainer}>
          <FlatList
            data={recentSearches}
            renderItem={({ item }) => (
              <View style={styles.recentSearchItem}>
                <TouchableOpacity onPress={() => handleSearch(item)}>
                  <Text style={styles.recentSearchText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveRecentSearch(item)}>
                  <IconClose width={12} height={12} style={{ marginStart: 4 }} />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </View>  
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.COMM_WHITE,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#F2A399', // 이미지 속 살구색 톤 예시 테두리
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 54,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  recentSearchContainer: {
    marginTop: 14,
    flexDirection: 'row',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
  },
  recentSearchText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});