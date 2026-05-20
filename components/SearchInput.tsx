import CustomButton from "@/components/comm/CustomButton";
import { COLOR } from "@/constants";
import React from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchButton from '@/assets/images/search_button.svg';
import IconClose from '@/assets/images/icon_close.svg';

const recentSearches = ['축구', '등산', '독서', '영화', '요리']; // 예시 최근 검색어 데이터

export default function SearchInput() {
  const inset = useSafeAreaInsets();
  return (
    <View style={[styles.container, { flex : 1, paddingHorizontal: 16}]}>
      {/* 검색 조건 부분 */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchText}>참여하고 싶은 모임이나 클럽을 검색해 보세요.</Text>
        <TouchableOpacity
          // onPress={() => router.push('/search')}
          >
          <SearchButton width={20} height={20}/>
        </TouchableOpacity>
      </View>
      {/* 최근 검색어 */}
      <View style={styles.recentSearchContainer}>
        <FlatList
          data={recentSearches}
          renderItem={({ item }) => (
            <View style={styles.recentSearchItem}>
              <TouchableOpacity
                // onPress={() => handleSearch(item)}
              >
                <Text style={styles.recentSearchText}>{item}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => handleRemoveRecentSearch(item)}
              >
                <IconClose width={12} height={12} style={{ marginStart: 4 }} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

    </View>  
  )
}

const styles = StyleSheet.create({
container: {
    backgroundColor: COLOR.COMM_WHITE,
  },
// 검색 섹션
  searchContainer: {
    marginTop: 16,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: COLOR.APP_ACTIVE_3,
    borderWidth: 2,
    borderRadius: 25,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  searchText: {
    fontSize: 14,
    color: COLOR.COMM_GRAY_2,
  },
  recentSearchContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  recentSearchItem: {
    backgroundColor: COLOR.COMM_GRAY,
    borderRadius: 20,
    paddingHorizontal: 10,
    color: COLOR.TEXT_DEFAULT,
    marginEnd: 6,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  recentSearchText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLOR.COMM_SHADOW,
  },
});

