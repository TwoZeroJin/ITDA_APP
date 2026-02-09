import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // 라이브러리 임포트
import CommunityMeet from '@/components/CommunityMeet';
import { MeetInfo } from '@/types';
import { COLOR } from '@/constants';

export default function writeFeedback() {
  const params = useLocalSearchParams(); // 전달받은 데이터 추출  
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]); // 선택된 이미지들을 저장할 상태
  const router = useRouter();

  // --- 추가된 저장 함수 ---
  const handleUpload = () => {
    // 유효성 검사: 글자 수가 10자 미만이면 경고
    if (content.length < 10) {
      Alert.alert('알림', '글을 10글자 이상 입력해 주세요.');
      return;
    }

    // 실제로는 여기서 서버 API를 호출합니다. (예: axios.post...)
    console.log('업로드 데이터:', { content, tag, location, images });

    // 성공 메시지 띄우기
    Alert.alert('성공', '저장했습니다.', [
      {
        text: '확인',
        onPress: () => {
          // 확인을 누르면 입력창을 초기화하거나 이전 화면으로 이동할 수 있습니다.
          setContent('');
          setImages([]);
          setTag('');
          setLocation('');
        }
      }
    ]);
  };

// 사진 업로드 버튼 클릭 시 실행될 함수
  const pickImage = async () => {
    // 갤러리 접근 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('권한 거부', '사진에 접근하려면 권한이 필요합니다.');
      return;
    }

    // 이미지 선택기 열기
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // 수정: 열거형 사용 권장
        allowsMultipleSelection: true,
        selectionLimit: 10 - images.length, // 남은 개수만큼만 선택 가능하게 제한
        quality: 1,
    });

    // 취소하지 않았고, 자산(assets)이 존재하는 경우에만 처리
    if (!result.canceled && result.assets) {
        // 1. 새로 선택된 URI들 추출
        const pickedUris = result.assets.map(asset => asset.uri);
        
        // 2. 기존 이미지와 합치기
        const combinedImages = [...images, ...pickedUris];
        
        // 3. 최대 10장까지만 자르기
//        setImages(combinedImages.slice(0, 10));
    }
  };

  // 후기 작성할 모임의 정보 (전달받은 데이터)
  const meetData = params.data ? JSON.parse(params.data as string) : null;
  const headerTitle = meetData ? '후기 작성' : '피드 작성';

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>피드 작성</Text>
        <TouchableOpacity onPress={handleUpload}>
          <Text style={styles.uploadButton}>올리기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleBig}>{headerTitle}</Text>

          {/* ✅ 피드 리스트 출력 부분 */}
          <FlatList 
          data={meetData ? [meetData] : []}
          renderItem={({item}) => <CommunityMeet data={item as MeetInfo} />}
          keyExtractor={(item) => item.meet_id.toString()}
          />
      </View>

      {meetData && (
        <>
        {/* ✅ 추가: 회색 분리선 */}
        <View style={styles.divider} />
        </>
      )}      
      
      {/* 본문 입력창 */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textArea}
            placeholder="글을 입력해 주세요 (10글자 이상)"
            multiline
            value={content}
            onChangeText={setContent}
          />
        </View>

        {/* 사진 영역: 선택된 사진 미리보기와 업로드 버튼 */}
        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Ionicons name="camera-outline" size={32} color="#888" />
            <Text style={styles.photoCount}>({images.length}/10)</Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.deleteBadge}
                  onPress={() => setImages(images.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close-circle" size={20} color="rgba(0,0,0,0.6)" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* 태그 입력 */}
        <Text style={styles.label}>태그</Text>
        <View style={styles.inputField}>
          <TextInput
            placeholder="#태그입력"
            value={tag}
            onChangeText={setTag}
          />
        </View>

        {/* 장소 입력 */}
        <Text style={styles.label}>장소</Text>
        <View style={styles.inputField}>
          <Ionicons name="location-sharp" size={18} color="black" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1 }}
            placeholder="장소를 입력해 주세요"
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  divider: {
    marginTop: 10, 
    height: 5,                // 선의 굵기 (스크린샷 느낌은 약 8~10)
    backgroundColor: '#F2F2F2', // 연한 회색 (구분선 표준 색상)
    width: '100%',            // 화면 전체 너비
  },  
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    // marginBottom: 20,
    alignItems: 'flex-start',
    paddingHorizontal: 20,    // ✅ 아래 ScrollView(content)의 padding과 동일하게 설정
    marginTop: 20,            // 상단 헤더와의 간격
    marginBottom: 10,         // FlatList와의 간격    marginBottom: 20,
  },
  titleBig: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 4,
  },
  backButton: { width: 40, justifyContent: 'center', alignItems: 'flex-start' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  uploadButton: {
    fontSize: 16,
    color: '#ff6b6b', // 스크린샷의 붉은 계열 색상
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    marginTop: 15,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 250,
    padding: 15,
    gap: 10,
  },
  textArea: {
    fontSize: 16,
    textAlignVertical: 'top',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
// 사진 관련 스타일 추가
  photoContainer: { flexDirection: 'row', marginTop: 20 },
  photoButton: { width: 80, height: 80, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  photoCount: { fontSize: 12, color: '#aaa', marginTop: 4 },
  imageWrapper: { marginRight: 10, position: 'relative' },
  previewImage: { width: 80, height: 80, borderRadius: 8 },
  deleteBadge: { position: 'absolute', top: -5, right: -5 },  
});