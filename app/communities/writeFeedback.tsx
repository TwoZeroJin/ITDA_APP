import React, { useState, useEffect } from 'react';
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
import { useForm, Controller } from 'react-hook-form'; // 추가

import IconCamera from '@/assets/images/icon_camera.svg';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import CommunityMeet from '@/components/CommunityMeet';
import { FileInfo, MeetReview, MyMeetInfo } from '@/types';
import { COLOR } from '@/constants';
import { useImagesUpload } from "@/hooks/queries/useImageUpload";
import { useReviewInsert, useReviewUpdate } from '@/hooks/queries/useCommunity';
import { getFormDataImages } from '@/utils/imageUtil';
import CommHeader from '@/components/comm/CommHeader';

// 폼 데이터 타입 정의
interface ReviewFormData {
  review_content: string;
  tag: string;
  place_addr: string;
}

export default function WriteFeedback() {
  const params = useLocalSearchParams();
  const meetData = params.data ? JSON.parse(params.data as string) : null;
  const updFeedData = params.updFeedData ? JSON.parse(params.updFeedData as string) : null;
  const headerTitle = meetData ? '후기 작성' : '피드 작성';

  const router = useRouter();
  const imageMutation = useImagesUpload();
  const reviewMutation = useReviewInsert();
  const reviewUpdate = useReviewUpdate();

  // 이미지 관련 상태는 폼 외부에서 관리하는 것이 제어가 편합니다.
  const [images, setImages] = useState<string[]>(updFeedData?.fileInfoVO?.map((file: FileInfo) => file.file_path) || []);
  const [uploadedImageList, setUploadedImageList] = useState<FileInfo[]>(updFeedData?.fileInfoVO || []);

  // 1. React Hook Form 초기화
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      review_content: updFeedData?.review_content || '',
      tag: updFeedData?.tag || '',
      place_addr: updFeedData?.place_addr || '',
    }
  });

  // 2. 제출 함수 (검증 통과 시 실행)
  const onSubmit = (data: ReviewFormData) => {
    const reviewData = {
      review_id: updFeedData?.review_id || null,
      content_type: meetData?.meet_id ? 'R' : 'F',
      review_content: data.review_content,
      tag: data.tag,
      place_addr: data.place_addr,
      meet_id: meetData?.meet_id || null,
      mem_id: meetData?.mem_id || 3,
      fileInfoVO: uploadedImageList,
    };

    const mutation = updFeedData ? reviewUpdate : reviewMutation;

    mutation.mutate(reviewData as MeetReview, {
      onSuccess: () => {
        Alert.alert('성공', updFeedData ? '수정되었습니다.' : '저장되었습니다.');
        router.back();
      },
      onError: (error) => {
        console.error('실패:', error);
        Alert.alert('오류', '처리에 실패했습니다.');
      }
    });
  };

  // 3. 검증 실패 시 호출 (Alert 띄우기)
  const onInvalid = (errors: any) => {
    if (errors.review_content) {
      Alert.alert('알림', errors.review_content.message || '내용을 확인해주세요.');
    }
  };

  // --- 기존 사진 관련 로직 (동일) ---
  const compressImage = async (uri: string) => {
    return await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1024 } }], {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 거부', '사진 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10 - images.length,
      quality: 1,
    });

    if (result.canceled || !result.assets) return;

    const compressedAssets = [];
    for (const asset of result.assets) {
      const compressed = await compressImage(asset.uri);
      compressedAssets.push({ ...asset, uri: compressed.uri });
    }

    const pickedUris = compressedAssets.map(asset => asset.uri);
    setImages(prev => [...prev, ...pickedUris].slice(0, 10));

    const formData = getFormDataImages('upfiles', compressedAssets);
    imageMutation.mutate(formData, {
      onSuccess: (res) => {
        res.data?.forEach((file: FileInfo) => {
          file.file_name = `${file.sav_name}|${file.org_name}`;
          setUploadedImageList(prev => [...prev, file]);
        });
      },
      onError: () => Alert.alert('경고', '이미지 업로드에 실패했습니다.')
    });
  };

  const handleDeleteImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setUploadedImageList(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="커뮤니티 작성" />
        {/* 4. handleSubmit 연결 */}
        <TouchableOpacity style={styles.absoluteUploadButton} onPress={handleSubmit(onSubmit, onInvalid)}>
          <Text style={styles.uploadButton}>올리기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleBig}>{headerTitle}</Text>
        <FlatList
          data={meetData ? [meetData] : []}
          renderItem={({ item }) => <CommunityMeet data={item as MyMeetInfo} />}
          keyExtractor={(item) => item.meet_id?.toString() || ''}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputBox}>
          {/* 5. Controller를 통한 입력창 관리 */}
          <Controller
            control={control}
            name="review_content"
            rules={{ 
              required: '내용을 입력해 주세요.', 
              minLength: { value: 10, message: '글을 10글자 이상 입력해 주세요.' } 
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.textArea}
                placeholder="글을 입력해 주세요 (10글자 이상)"
                multiline
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* 사진 영역 */}
        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <IconCamera />
            <Text style={styles.photoCount}>({images.length}/10)</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => (
              <View key={`${uri}-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.deleteBadge} onPress={() => handleDeleteImage(index)}>
                  <Ionicons name="close-circle" size={20} color="rgba(0,0,0,0.6)" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 태그 입력 */}
        <Text style={styles.label}>태그</Text>
        <View style={styles.inputField}>
          <Controller
            control={control}
            name="tag"
            render={({ field: { onChange, value } }) => (
              <TextInput placeholder="#태그입력" value={value} onChangeText={onChange} />
            )}
          />
        </View>

        {/* 장소 입력 */}
        <Text style={styles.label}>장소</Text>
        <View style={styles.inputField}>
          <Ionicons name="location-sharp" size={18} color="black" style={{ marginRight: 8 }} />
          <Controller
            control={control}
            name="place_addr"
            render={({ field: { onChange, value } }) => (
              <TextInput style={{ flex: 1 }} placeholder="장소를 입력해 주세요" value={value} onChangeText={onChange} />
            )}
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
    fontSize: 16,
//    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 4,
  },
  backButton: { width: 40, justifyContent: 'center', alignItems: 'flex-start' },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'center',
    position: 'relative',
  },
  absoluteUploadButton: {
    position: 'absolute',
    right: 16,               // 우측 여백
    top: 0,
    bottom: 0,
    justifyContent: 'center', // 세로 중앙 정렬
    zIndex: 10,              // 제목보다 위에 오도록 설정
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


