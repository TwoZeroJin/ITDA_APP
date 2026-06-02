import { COMM_STYLES } from "@/constants";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { FileInfo, GroupInfo } from "@/types";
import CommImagePicker from "@/components/comm/CommImagePicker";
import TagInput from "@/components/inputs/TagInput";
import GroupDescInput from "@/components/inputs/GroupDescInput";
import GroupNameInput from "@/components/inputs/GroupNameInput";

/**
 * 클럽 생성 - 클럽 설명 및 이미지 등록 화면
 */
export default function GroupCreateDescScreen() {
  const prevGroupInfo = useLocalSearchParams();
  const [uploadedImageList, setUploadedImageList] = useState<FileInfo[]>([]);

  // 폼 관리를 위한 useForm 훅 초기화
  const formValues = useForm<GroupInfo>({
    defaultValues: {
      group_name: prevGroupInfo.group_name as string || undefined,
      group_desc: prevGroupInfo.group_desc as string || undefined,
    }
  });

  // 이미지 있을 경우 세팅
  useEffect(() => {
    setUploadedImageList(JSON.parse(prevGroupInfo.img_list_json as string || '[]') || []);
  }, []);

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/groups/createPreView',
      params: {
        ...prevGroupInfo,
        group_name    : data.group_name,
        group_desc    : data.group_desc,
        img_list_json : JSON.stringify(uploadedImageList),
      },
    });
  });


  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`클럽 ${prevGroupInfo.group_id ? '수정' : '생성'}`}/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 클럽 생성 타이틀 */}
        <View style={COMM_STYLES.commTitleContainer}>
          <Text style={COMM_STYLES.commTitle}>{'나의 클럽을 소개해주세요.'}</Text>
        </View>

        {/* 클럽 제목, 설명, 이미지 추가 */}
        <View style={COMM_STYLES.commContainer}>
          <FormProvider {...formValues}>
            <GroupNameInput />
            <GroupDescInput />
            <CommImagePicker imgList={uploadedImageList} onChangeImages={setUploadedImageList} />
            {/* <TagInput /> */}
          </FormProvider>
          
        </View>

      </ScrollView>

      <CommBottomButton 
        label="미리보기" 
        onPress={onNext} 
        disabled={!formValues.watch('group_name') || !formValues.watch('group_desc')}
      />
    </View>
  );
}