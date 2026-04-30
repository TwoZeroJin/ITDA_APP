import { COLOR } from "@/constants";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { FormProvider, useForm } from "react-hook-form";
import MeetNameInput from "@/components/inputs/MeetNameInput";
import { FileInfo, MeetInfo } from "@/types";
import MeetDescInput from "@/components/inputs/MeetDescInput";
import CustomImagePicker from "@/components/CustomImagePicker";
import TagInput from "@/components/inputs/TagInput";

// 다음 화면에 데이터를 넘기기 위한 Params 타입 정의
type MeetCreateRouteParams = {
  [key: string]: string | number | (string | number)[] | undefined;
  img_list_json?: string;
};

/**
 * 모임 생성 - 모임 설명 및 이미지 등록 화면
 */
export default function MeetCreateDescScreen() {
  const params = useRoute();
  const prevMeetInfo = (params.params ?? {}) as MeetCreateRouteParams;
  const [uploadedImageList, setUploadedImageList] = useState<FileInfo[]>([]);

  // 폼 관리를 위한 useForm 훅 초기화
  const meetForm = useForm<MeetInfo>({
    defaultValues: {
      meet_name : '',
      meet_desc : '',
    }
  });

  const canMoveNext = !!meetForm.watch('meet_name') && !!meetForm.watch('meet_desc');

  return (
    <View style={styles.container}>
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
          <FormProvider {...meetForm}>
            <MeetNameInput />
            <MeetDescInput />
            <CustomImagePicker onChangeImages={setUploadedImageList} />
            <TagInput />
          </FormProvider>
          
        </View>

      </ScrollView>

      <CommBottomButton label="미리보기" onPress={() => canMoveNext && router.push({
            pathname: '/meets/createPreView',
            params: {
              ...prevMeetInfo,
              ...meetForm.getValues(),
              img_list_json: JSON.stringify(uploadedImageList),
            } as MeetCreateRouteParams,
          })}
          disabled={!canMoveNext}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginTop: 12,
    marginBottom: 5,
    paddingStart: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 16,
  },
  commContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
    gap: 16,
  },
});