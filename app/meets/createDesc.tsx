import { COMM_STYLES } from "@/constants";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import MeetNameInput from "@/components/inputs/MeetNameInput";
import { FileInfo, MeetInfo } from "@/types";
import MeetDescInput from "@/components/inputs/MeetDescInput";
import CommImagePicker from "@/components/comm/CommImagePicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/**
 * 모임 생성 - 모임 설명 및 이미지 등록 화면
 */
export default function MeetCreateDescScreen() {
  const prevMeetInfo = useLocalSearchParams();
  const [uploadedImageList, setUploadedImageList] = useState<FileInfo[]>([]);

  // 폼 관리를 위한 useForm 훅 초기화
  const formValues = useForm<MeetInfo>({
    defaultValues: {
      meet_name: prevMeetInfo.meet_name as string || undefined,
      meet_desc: prevMeetInfo.meet_desc as string || undefined,
    }
  });

  // 이미지 있을 경우 세팅
  useEffect(() => {
    setUploadedImageList(JSON.parse(prevMeetInfo.img_list_json as string || '[]') || []);
  }, []);

  const onNext = formValues.handleSubmit((data) => {
      router.navigate({
        pathname: '/meets/createPreView',
        params: {
          ...prevMeetInfo,
          meet_name     : data.meet_name,
          meet_desc     : data.meet_desc,
          img_list_json : JSON.stringify(uploadedImageList),
        },
      });
    });

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`모임 ${prevMeetInfo.meet_id ? '수정' : '생성'}`}/>
      <KeyboardAwareScrollView 
        showsVerticalScrollIndicator={false}
      >
        {/* 소셜링 생성 타이틀 */}
        <View style={COMM_STYLES.commTitleContainer}>
          <Text style={COMM_STYLES.commTitle}>{'나의 소셜링을 소개해주세요.'}</Text>
        </View>

        {/* 소셜링 제목, 설명, 이미지 추가 */}
        <View style={COMM_STYLES.commContainer}>
          <FormProvider {...formValues}>
            <MeetNameInput />
            <MeetDescInput />
            <CommImagePicker imgList={uploadedImageList} onChangeImages={setUploadedImageList} />
            {/* <TagInput /> */}
          </FormProvider>
          
        </View>

      </KeyboardAwareScrollView>

      <CommBottomButton 
        label="미리보기" 
        onPress={onNext}
        disabled={!formValues.watch('meet_name') || !formValues.watch('meet_desc')}
      />
    </View>
  );
}