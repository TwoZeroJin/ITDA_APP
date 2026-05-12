import { COLOR, COMM_CONSTANTS } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import DividingLine from "@/components/DividingLine";
import { useRoute } from "@react-navigation/native";
import { MeetInfo } from "@/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormProvider, useForm } from "react-hook-form";
import ApplyTypeInput from "@/components/inputs/ApplyTypeInput";
import MemberCountInput from "@/components/inputs/MemberCountInput";
import GenderRatioInput from "@/components/inputs/GenderRatioInput";
import AgeRangeInput, { AGE_MIN } from "@/components/inputs/AgeRangeInput";

/**
 * 모임 생성 - 신청방식, 참여인원, 성비, 나이 설정 화면
 */
export default function MeetCreateDetailScreen() {
  const params = useRoute();
  const prevMeetInfo = (params.params ?? {}) as MeetInfo;

  const formValues = useForm<MeetInfo>({
    defaultValues: {
      apply_type  : '',
      gender_ratio: 0.5,
      age_min     : AGE_MIN,
      age_max     : 20,
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
      } as Partial<MeetInfo>,
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={styles.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          enableOnAndroid={true}
          extraScrollHeight={24}
        >
          {/* 소모임 생성 타이틀 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'어떻게 모임원을 모을까요?'}</Text>
            <Text style={styles.subtitle}>{`${prevMeetInfo.meet_type === COMM_CONSTANTS.MEET_TYPE_NORMAL ? '일반 소셜링' : '클럽 소셜링'}을 선택했어요.\n모임에 맞는 모임원 구성을 정해주세요.`}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex          : 1,
  },
  titleContainer: {
    marginTop     : 12,
    marginBottom  : 30,
    paddingStart  : 16,
  },
  title: {
    fontSize      : 22,
    fontWeight    : 'bold',
    color         : COLOR.COMM_BLACK,
    marginBottom  : 16,
  },
  subtitle: {
    fontSize      : 16,
    color         : COLOR.COMM_GRAY_2,
  },
});