import { COMM_STYLES } from "@/constants";
import React from "react";
import { View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { Report } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { showToast } from "@/utils/commToast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useReportInsert } from "@/hooks/queries/useReport";
import ReportContentInput from "@/components/inputs/ReportContentInput";
import ReportTypeSelectBox from "@/components/inputs/ReportTypeSelectBox";

/**
 * 신고하기 화면
 */
export default function ReportCreateScreen() {
  const reportInsert = useReportInsert();
  const { target_id, target_type } = useLocalSearchParams();
  const formValues = useForm<Report>({
    defaultValues: {
      report_type     : '',
      report_content  : '',
      target_id       : target_id   ? Number(target_id)   : undefined,
      target_type     : target_type ? String(target_type) : undefined,
    },
  });

    const onSubmit = (formValues: Report) => {
    reportInsert.mutate({ ...formValues }, {
      onSuccess: (result) => {
          showToast({ text1: result.ret_code === 200 ? '신고가 등록되었습니다.' : '신고 등록에 실패했습니다.' });
          router.back();
        },
        onError: () => {
          showToast({ text1: '신고 등록 중 오류가 발생했습니다.' });
        },
      },
    );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="신고하기"/>
      <KeyboardAwareScrollView
        style={{ marginBottom: 100 }}
        contentContainerStyle={COMM_STYLES.formContainer}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        <FormProvider {...formValues}>
          <ReportTypeSelectBox />
          <ReportContentInput />
        </FormProvider>
      </KeyboardAwareScrollView>
      <CommBottomButton label="등록" onPress={formValues.handleSubmit(onSubmit)} />
    </View>
  );
}