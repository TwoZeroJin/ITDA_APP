import React, { useMemo } from "react";
import CommBottomButton from "@/components/CommBottomButton";
import InterestCategoryInput from "@/components/inputs/InterestCategoryInput";
import { useAuth } from "@/hooks/queries/useAuth";
import { SignupInfo } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View, ScrollView } from "react-native";
import CommHeader from "@/components/CommHeader";
import { COLOR } from "@/constants";

/**
 * 회원가입 - 관심분야 선택
 */
export default function SignupInterestScreen() {
  const { signupMutation } = useAuth();
  const { signupInfo } = useLocalSearchParams<{ signupInfo: string }>();

  // 이전 화면에서 가져온 회원정보
  const parsedSignupInfo = useMemo(() => {
    return JSON.parse(signupInfo) as SignupInfo;
  }, [signupInfo]);
  const signupForm = useForm<SignupInfo>({
    defaultValues: parsedSignupInfo
  });

  const onSubmit = (formValues: SignupInfo) => {
    signupMutation.mutate(formValues);
  };

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="회원 가입"/>
      <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
        <FormProvider {...signupForm}>
          <InterestCategoryInput />
        </FormProvider>
      </ScrollView>
      <CommBottomButton label="회원가입" onPress={signupForm.handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex            : 1,
    backgroundColor : COLOR.COMM_WHITE,
  },
});