import { COLOR, COMM_STYLES } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import { MeetInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FeeInput from "@/components/inputs/FeeInput";

/**
 * 모임 생성 - 참가비 설정 화면
 */
export default function MeetCreateFeeScreen() {
  // 수정화면에서 받아올 경우 meet_id 존재
  const prevMeetInfo = useLocalSearchParams();
  const formValues = useForm<MeetInfo>({
    defaultValues: {
      fee_yn   : prevMeetInfo.fee_yn as string || 'N',
      fee_entry: prevMeetInfo.fee_entry ? Number(prevMeetInfo.fee_entry) : undefined,
      fee_info : prevMeetInfo.fee_info as string || undefined,
      fee_desc : prevMeetInfo.fee_desc as string || undefined,
    },
  });

  const feeInfo = formValues.watch('fee_info');
  const canMoveNext =
    !!prevMeetInfo.apply_type
    && (formValues.watch('fee_yn') === 'N' || (!!formValues.watch('fee_entry') && (feeInfo === 'FEE_INFO_99' ? !!formValues.watch('fee_desc') : !!feeInfo)));

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/meets/createPlace',
      params: {
        ...prevMeetInfo,
        fee_yn   : data.fee_yn,
        fee_entry: data.fee_yn === 'Y' ? data.fee_entry : undefined,
        fee_info : data.fee_yn === 'Y' ? data.fee_info : undefined,
        fee_desc : data.fee_yn === 'Y' ? data.fee_desc : undefined,
      },
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`모임 ${prevMeetInfo.meet_id ? '수정' : '생성'}`}/>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          enableOnAndroid={true}
        >
          <View style={COMM_STYLES.detailTitleContainer}>
            <Text style={COMM_STYLES.commTitle}>{'참가비가 있다면 설정해주세요.'}</Text>
            <Text style={COMM_STYLES.commSubtitle}>{'모임 운영에 필요한 경우 참가비를 설정해 주세요.\n운영비, 공간 대관료 등 다양한 용도로 활용할 수 있습니다.'}</Text>
          </View>

          <FeeInput />

        </KeyboardAwareScrollView>

        <CommBottomButton label="다음" onPress={onNext} disabled={!canMoveNext}/>
      </View>
    </FormProvider>
  );
}