import React, { useMemo } from "react";
import CommBottomButton from "@/components/comm/CommBottomButton";
import InterestCategoryInput from "@/components/inputs/InterestCategoryInput";
import { useAuth } from "@/hooks/queries/useAuth";
import { SignupInfo } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import CommHeader from "@/components/comm/CommHeader";
import { COLOR, COMM_STYLES } from "@/constants";

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
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="회원 가입"/>
      <ScrollView style={{ marginBottom: 100, marginHorizontal: 20 }} keyboardShouldPersistTaps="handled">
        <FormProvider {...signupForm}>
          <Text style={styles.title}>관심분야</Text>
          <Text style={styles.subtitle}>
            관심있는 취미가 우선적으로 보여져요 {'\n'}(최소 2개)
          </Text>
          <InterestCategoryInput />
        </FormProvider>
      </ScrollView>
      <CommBottomButton label="회원가입" onPress={signupForm.handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize            : 23,
    fontWeight          : 'bold',
    color               : COLOR.TEXT_DEFAULT,
    textAlign           : 'left',
    marginTop           : 20,
    marginBottom        : 10,
  },
  subtitle: {
    textAlign           : 'left',
    color               : COLOR.COMM_GRAY_7,
    marginBottom        : 22,
    fontSize            : 16,
    lineHeight          : 28,
  },
});