import { COLOR, COMM_STYLES } from "@/constants";
import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import FeedContentInput from "@/components/inputs/FeedContentInput";
import FeedSubjectInput from "@/components/inputs/FeedSubjectInput";
import { useFeedbackInsert } from "@/hooks/queries/useFeedback";
import { FeedbackData } from "@/types";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { showToast } from "@/utils/commToast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/**
 * 마이페이지 - 개선사항 등록 화면
 */
export default function FeedbackCreateScreen() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const feedbackInsert = useFeedbackInsert();

  const feedbackForm = useForm<FeedbackData>({
    defaultValues: {
      feed_subject: '',
      feed_content: '',
    },
  });

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onSubmit = (formValues: FeedbackData) => {
    feedbackInsert.mutate(formValues, {
      onSuccess: (result) => {
          showToast({ text1: result.ret_code === 200 ? '피드백이 등록되었습니다.' : '피드백 등록에 실패했습니다.' });
          router.back();
        },
        onError: () => {
          showToast({ text1: '피드백 등록 중 오류가 발생했습니다.' });
        },
      },
    );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="피드백 작성"/>
      <KeyboardAwareScrollView
        contentContainerStyle={[
        styles.formContainer,
          { paddingBottom: isKeyboardVisible ? 0 : 120 }, // 키보드가 올라올 경우 하단 패딩 제거
        ]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        >
          <FormProvider {...feedbackForm}>
            <FeedSubjectInput />
            <FeedContentInput />
          </FormProvider>
      </KeyboardAwareScrollView>
      <CommBottomButton label="등록" onPress={feedbackForm.handleSubmit(onSubmit)} />
    </View>

  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginHorizontal  : 20,
    gap               : 16,
  },
});