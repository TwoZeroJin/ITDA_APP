import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import { FileInfo, MeetReview, MeetInfo } from '@/types';
import { COLOR, COMM_STYLES } from '@/constants';
import { useReviewInsert, useReviewUpdate } from '@/hooks/queries/useCommunity';
import CommHeader from '@/components/comm/CommHeader';
import CommMeetCard from '@/components/comm/CommCard';
import ReviewContentInput from '@/components/inputs/ReviewContentInput';
import CommImagePicker from '@/components/comm/CommImagePicker';
import PlaceInput from '@/components/inputs/PlaceInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DividingLine from '@/components/DividingLine';
import { showToast } from '@/utils/commToast';

export default function WriteFeedback() {
  const params = useLocalSearchParams();
  const meetData = params.data ? JSON.parse(params.data as string) : null;
  const updFeedData = params.updFeedData ? JSON.parse(params.updFeedData as string) : null;
  const router = useRouter();
  const reviewMutation = useReviewInsert();
  const reviewUpdate = useReviewUpdate();
  const [uploadedImageList, setUploadedImageList] = useState<FileInfo[]>(updFeedData?.img_list || []);

  const formValues = useForm<MeetReview>({
    defaultValues: {
      review_content  : updFeedData?.review_content || '',
      tag             : updFeedData?.tag || '',
      place_addr      : updFeedData?.place_addr || '',
    }
  });

  const onHandleSubmit = formValues.handleSubmit((data) => {
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
        showToast({ text1: `${meetData ? '후기' : '커뮤니티'} 글이 ${updFeedData ? '수정' : '작성'}되었습니다.` });
        router.back();
      },
      onError: () => {
        Alert.alert('오류', '후기 등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    });
  });

  return (
    <View style={COMM_STYLES.container}>
        <View style={styles.header}>
          <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`${meetData ? '후기' : '커뮤니티'} ${updFeedData ? '수정' : '작성'}`} />

          <TouchableOpacity 
            style={styles.absoluteUploadButton} 
            onPress={onHandleSubmit}
            activeOpacity={0.6}
          >
            <Text style={styles.uploadButton}>올리기</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView 
          showsVerticalScrollIndicator={false}
        >
          {meetData && (
            <View>
              <CommMeetCard item={meetData as MeetInfo} preventEvt={true} />
              <DividingLine />
            </View>
          )}

          <View style={[COMM_STYLES.commContainer, {marginVertical : 8}]}>
            <FormProvider {...formValues}>
              <ReviewContentInput />
              <CommImagePicker imgList={uploadedImageList} onChangeImages={setUploadedImageList} />
              <PlaceInput />
            </FormProvider>
          </View>
        </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position        : 'relative',
  },
  absoluteUploadButton: {
    position        : 'absolute',
    right           : 16,
    top             : 0,
    bottom          : 0,
    justifyContent  : 'center',
    zIndex          : 999,
    paddingStart    : 8,
  },
  uploadButton: {
    fontSize        : 14,
    fontFamily      : 'Pretendard-Medium',
    color           : COLOR.APP_ACTIVE_5,
  },
});