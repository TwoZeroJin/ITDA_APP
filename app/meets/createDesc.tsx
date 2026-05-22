import { COLOR, COMM_STYLES } from "@/constants";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import MeetNameInput from "@/components/inputs/MeetNameInput";
import { FileInfo, MeetInfo } from "@/types";
import MeetDescInput from "@/components/inputs/MeetDescInput";
import CustomImagePicker from "@/components/comm/CustomImagePicker";
import TagInput from "@/components/inputs/TagInput";

/**
 * 모임 생성 - 모임 설명 및 이미지 등록 화면
 */
export default function MeetCreateDescScreen() {
  const prevMeetInfo = useLocalSearchParams();
  const [uploadedImageList, setUploadedImageList] = useState<FileInfo[]>([]);

  // 폼 관리를 위한 useForm 훅 초기화
  const formValues = useForm<MeetInfo>({
    defaultValues: {
      meet_name : '',
      meet_desc : '',
    }
  });

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
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'나의 소셜링을 소개해주세요.'}</Text>
        </View>

        {/* 소셜링 제목, 설명, 이미지 추가 */}
        <View style={styles.commContainer}>
          <FormProvider {...formValues}>
            <MeetNameInput />
            <MeetDescInput />
            <CustomImagePicker onChangeImages={setUploadedImageList} />
            <TagInput />
          </FormProvider>
          
        </View>

      </ScrollView>

      <CommBottomButton 
        label="미리보기" 
        onPress={onNext}
        disabled={!formValues.watch('meet_name') || !formValues.watch('meet_desc')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop     : 12,
    marginBottom  : 5,
    paddingStart  : 16,
  },
  title: {
    fontSize      : 22,
    fontWeight    : 'bold',
    color         : COLOR.COMM_BLACK,
    marginBottom  : 16,
  },
  commContainer: {
    marginHorizontal  : 16,
    marginBottom      : 30,
    gap               : 16,
  },
});