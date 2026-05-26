import { COLOR, COMM_CONSTANTS, COMM_STYLES } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { useLocalSearchParams } from "expo-router";
import DividingLine from "@/components/DividingLine";
import { MeetInfo } from "@/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormProvider, useForm } from "react-hook-form";
import ApplyTypeInput from "@/components/inputs/ApplyTypeInput";
import MemberCountInput from "@/components/inputs/MemberCountInput";
import GenderRatioInput from "@/components/inputs/GenderRatioInput";
import AgeRangeInput, { AGE_MIN } from "@/components/inputs/AgeRangeInput";
import { useAuthRouter } from "@/components/comm/AuthRoute";

/**
 * 모임 생성 - 신청방식, 참여인원, 성비, 나이 설정 화면
 */
export default function MeetCreateDetailScreen() {
  const router = useAuthRouter();
  // 수정화면에서 받아올 경우 meet_id 존재
  const prevMeetInfo = useLocalSearchParams();
  const formValues = useForm<MeetInfo>({
    defaultValues: {
      apply_type    : prevMeetInfo.apply_type as string || undefined,
      meet_min      : prevMeetInfo.meet_min ? Number(prevMeetInfo.meet_min) : undefined,
      meet_max      : prevMeetInfo.meet_max ? Number(prevMeetInfo.meet_max) : undefined,
      meet_question : prevMeetInfo.meet_question as string || undefined,
      gender_ratio  : prevMeetInfo.gender_ratio ? Number(prevMeetInfo.gender_ratio) : 0.5,
      age_min       : prevMeetInfo.age_min ? Number(prevMeetInfo.age_min) : AGE_MIN,
      age_max       : prevMeetInfo.age_max ? Number(prevMeetInfo.age_max) : 30,
      group_id      : prevMeetInfo.group_id ? Number(prevMeetInfo.group_id) : 0,
    },
  });

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/meets/createFee',
      params: {
        ...prevMeetInfo,
        apply_type    : data.apply_type,
        meet_min      : data.meet_min,
        meet_max      : data.meet_max,
        meet_question : data.meet_question,
        gender_ratio  : data.gender_ratio,
        age_min       : data.age_min,
        age_max       : data.age_max,
        group_id      : data.group_id,
      },
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`모임 ${prevMeetInfo.meet_id ? '수정' : '생성'}`}/>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          enableOnAndroid={true}
          extraScrollHeight={24}
        >
          {/* 소모임 생성 타이틀 */}
          <View style={COMM_STYLES.detailTitleContainer}>
            <Text style={COMM_STYLES.commTitle}>{'어떻게 모임원을 모을까요?'}</Text>
            <Text style={COMM_STYLES.commSubtitle}>{`${prevMeetInfo.meet_type === COMM_CONSTANTS.MEET_TYPE_NORMAL ? '일반 소셜링' : '클럽 소셜링'}을 선택했어요.\n모임에 맞는 모임원 구성을 정해주세요.`}</Text>
          </View>

          <DividingLine />

          <ApplyTypeInput />

          <DividingLine />

          <MemberCountInput />

          <DividingLine />

          <GenderRatioInput />

          <DividingLine />

          <AgeRangeInput />

          <DividingLine />

        </KeyboardAwareScrollView>

        <CommBottomButton
          label="다음"
          onPress={onNext}
          disabled={!prevMeetInfo.meet_type || !formValues.watch('apply_type') || !formValues.watch('meet_min') || !formValues.watch('meet_max')
            || (formValues.watch('apply_type') === COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE && !formValues.watch('meet_question'))
          }
        />
      </View>
    </FormProvider>
  );
}