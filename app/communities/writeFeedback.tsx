import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { FileInfo, MeetReview, MeetInfo } from '@/types';
import { COLOR, COMM_STYLES } from '@/constants';
import { useReviewInsert, useReviewUpdate } from '@/hooks/queries/useCommunity';
import CommHeader from '@/components/comm/CommHeader';
import CommMeetCard from '@/components/comm/CommCard';
import ReviewContentInput from '@/components/inputs/ReviewContentInput';
import CommImagePicker from '@/components/comm/CommImagePicker';

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
  const reviewMutation = useReviewInsert();
  const reviewUpdate = useReviewUpdate();
  const [uploadedImageList, setUploadedImageList] = useState<FileInfo[]>(updFeedData?.img_list || []);

  const { handleSubmit } = useForm<ReviewFormData>({
    defaultValues: {
      review_content: updFeedData?.review_content || '',
      tag: updFeedData?.tag || '',
      place_addr: updFeedData?.place_addr || '',
    }
  });

  const onSubmit = (data: ReviewFormData) => {
    const reviewData = {
      review_id       : updFeedData?.review_id || null,
      content_type    : meetData?.meet_id ? 'R' : 'F',
      review_content  : data.review_content,
      tag             : data.tag,
      place_addr      : data.place_addr,
      meet_id         : meetData?.meet_id || null,
      img_list        : uploadedImageList,
    };

    const mutation = updFeedData ? reviewUpdate : reviewMutation;

    mutation.mutate(reviewData as MeetReview, {
      onSuccess: () => {
        Alert.alert('성공', updFeedData ? '수정되었습니다.' : '저장되었습니다.');
        router.back();
      },
      onError: () => {
        Alert.alert('오류', '처리에 실패했습니다.');
      }
    });
  };

  const onInvalid = (errors: any) => {
    if (errors.review_content) {
      Alert.alert('알림', errors.review_content.message || '내용을 확인해주세요.');
    }
  };

  return (
    <View style={COMM_STYLES.container}>
      <View style={styles.header}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="커뮤니티 작성" />

        <TouchableOpacity style={styles.absoluteUploadButton} onPress={handleSubmit(onSubmit, onInvalid)}>
          <Text style={styles.uploadButton}>올리기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleBig}>{headerTitle}</Text>
        <FlatList
          data={meetData ? [meetData] : []}          
          renderItem={({ item }) => <CommMeetCard item={item as MeetInfo} backgroundColor="grey"/>}
          keyExtractor={(item) => item.meet_id?.toString() || ''}
        />
      </View>

      <View style={COMM_STYLES.commContainer}>
        <ReviewContentInput />
        <CommImagePicker imgList={uploadedImageList} onChangeImages={setUploadedImageList} />

        {/* 태그 입력 */}

        {/* 장소 입력 */}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  titleBig: {
    fontSize: 16,
    color: COLOR.COMM_BLACK,
    marginBottom: 4,
  },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'center',
    position: 'relative',
  },
  absoluteUploadButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 10,
  },
  uploadButton: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
});