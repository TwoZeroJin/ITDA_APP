import { COLOR, COMM_CONSTANTS, COMM_STYLES } from "@/constants";
import React from "react";
import { Platform, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import DividingLine from "@/components/DividingLine";
import { GroupInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import GroupMaxMemberInput from "@/components/inputs/GroupMaxMemberInput";
import ApplyTypeInput from "@/components/inputs/ApplyTypeInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuthRouter } from "@/components/comm/AuthRoute";
import { useLocalSearchParams } from "expo-router";

/**
 * 클럽 생성 - 신청방식, 최대인원 설정 화면
 */
export default function GroupCreateDetailScreen() {
  const router = useAuthRouter();
  // 수정화면에서 받아올 경우 group_id 존재
  const prevGroupInfo = useLocalSearchParams();
  const formValues = useForm<GroupInfo>({
    defaultValues: {
      apply_type      : prevGroupInfo.apply_type as string || undefined,
      group_max       : prevGroupInfo.group_max ? Number(prevGroupInfo.group_max) : undefined,
      group_question  : prevGroupInfo.group_question as string || undefined,
    },
  });

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/groups/createFee',
      params: {
        ...prevGroupInfo,
        apply_type      : data.apply_type,
        group_question  : data.group_question,
        group_max       : data.group_max,
      },
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`클럽 ${prevGroupInfo.group_id ? '수정' : '생성'}`}/>
        <KeyboardAwareScrollView
          style={{ marginBottom: 80 }}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
        >
          <View style={COMM_STYLES.detailTitleContainer}>
            <Text style={COMM_STYLES.commCreateTitle}>{'어떻게 모임원을 모을까요?'}</Text>
            <Text style={COMM_STYLES.commCreateSubTitle}>{`클럽을 선택했어요.\n모임에 맞는 모임원 구성을 정해주세요.`}</Text>

            {prevGroupInfo.group_id ? <Text style={[COMM_STYLES.commCreateSubTitle, { marginTop: 8, marginBottom: -16, fontSize: 14, fontWeight: 'bold', color : COLOR.COMM_GRAY_7 }]}>{'모임 시작 1시간 전에는 수정할 수 없습니다.'}</Text> : null}
          </View>

          <DividingLine />

          <ApplyTypeInput questionFieldName="group_question"/>

          <DividingLine />

          <GroupMaxMemberInput />
          
          <DividingLine />

        </KeyboardAwareScrollView>

        <CommBottomButton 
          label="다음" 
          onPress={onNext} 
          disabled={!formValues.watch('apply_type') || !formValues.watch('group_max')
            || (formValues.watch('apply_type') === COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE && !formValues.watch('group_question'))
          } />
      </View>
    </FormProvider>
  );
}