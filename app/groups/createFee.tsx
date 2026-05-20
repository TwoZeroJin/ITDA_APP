import { COLOR, COMM_STYLES } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { GroupInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import FeeInput from "@/components/inputs/FeeInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/**
 * 클럽 생성 - 참가비 설정 화면
 */
export default function GroupCreateFeeScreen() {
  const params = useRoute();
  const prevGroupInfo = (params.params ?? {}) as GroupInfo;
  const formValues = useForm<GroupInfo>({
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
    !!prevGroupInfo.apply_type
    && (feeYn === 'N' || (!!feeEntry && !!feeInfo));

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/groups/createPlace',
      params: {
        ...prevGroupInfo,
        fee_yn   : data.fee_yn,
        fee_entry: data.fee_yn === 'Y' ? data.fee_entry : undefined,
        fee_info : data.fee_yn === 'Y' ? data.fee_info : '',
        fee_desc : data.fee_yn === 'Y' ? data.fee_desc : '',
      } as Partial<GroupInfo>,
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="클럽 생성"/>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          enableOnAndroid={true}
          extraScrollHeight={24}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'참가비가 있다면 설정해주세요.'}</Text>
            <Text style={styles.subtitle}>{'모임 운영에 필요한 경우 참가비를 설정해 주세요.\n운영비, 공간 대관료 등 다양한 용도로 활용할 수 있습니다.'}</Text>
          </View>

          <FeeInput />

        </KeyboardAwareScrollView>

        <CommBottomButton label="다음" onPress={onNext} disabled={!canMoveNext}/>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
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