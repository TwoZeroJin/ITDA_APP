import { COLOR } from "@/constants";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { MeetInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import MeetFeeInput from "@/components/inputs/MeetFeeInput";

/**
 * 모임 생성 - 참가비 설정 화면
 */
export default function MeetCreateFeeScreen() {
  const params = useRoute();
  const prevMeetInfo = (params.params ?? {}) as MeetInfo;
  const formValues = useForm<MeetInfo>({
    defaultValues: {
      fee_yn   : 'N',
      fee_entry: 0,
      fee_info : '',
      fee_desc : '',
    },
  });

  const feeYn = formValues.watch('fee_yn') as 'N' | 'Y' | undefined;
  const feeEntry = formValues.watch('fee_entry');
  const feeInfo = formValues.watch('fee_info');

  const canMoveNext =
    !!prevMeetInfo.meet_type
    && !!prevMeetInfo.apply_type
    && (feeYn === 'N' || (!!feeEntry && !!feeInfo));

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/meets/createPlace',
      params: {
        ...prevMeetInfo,
        fee_yn   : data.fee_yn,
        fee_entry: data.fee_yn === 'Y' ? data.fee_entry : undefined,
        fee_info : data.fee_yn === 'Y' ? data.fee_info : '',
        fee_desc : data.fee_yn === 'Y' ? data.fee_desc : '',
      } as Partial<MeetInfo>,
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={styles.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'참가비가 있다면 설정해주세요.'}</Text>
            <Text style={styles.subtitle}>{'모임 운영에 필요한 경우 참가비를 설정해 주세요.\n운영비, 공간 대관료 등 다양한 용도로 활용할 수 있습니다.'}</Text>
          </View>

          <MeetFeeInput />

        </ScrollView>

        <CommBottomButton label="다음" onPress={onNext} disabled={!canMoveNext}/>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex                : 1,
  },
  titleContainer: {
    marginTop           : 12,
    marginBottom        : 5,
    paddingStart        : 16,
  },
  title: {
    fontSize            : 22,
    fontWeight          : 'bold',
    color               : COLOR.COMM_BLACK,
    marginBottom        : 16,
  },
  subtitle: {
    fontSize            : 16,
    color               : COLOR.COMM_GRAY_2,
  },
});