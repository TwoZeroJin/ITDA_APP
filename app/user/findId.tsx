import CommBottomButton from "@/components/comm/CommBottomButton";
import CommHeader from "@/components/comm/CommHeader";
import MemEmailInput from "@/components/inputs/MemEmailInput";
import NameInput from "@/components/inputs/NameInput";
import { COLOR, COMM_STYLES } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

/**
 * 계정 아이디 찾기 화면
 */
export default function FindIdScreen() {
  const [isSuccess, setIsSuccess] = useState(false);

  const findIdForm = useForm({
    defaultValues: {
      mem_name  : "",
      mem_email : "",
    },
  });

  const onSubmit = (formValues: any) => {
    // TODO: API 연동 - 200 응답 시 setIsSuccess(true) 호출
    console.log(formValues);
    setIsSuccess(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="계정 찾기"/>
          {isSuccess ? (
            <View style={styles.contentContainer}>
              <Text style={styles.title}>등록된 이메일로{"\n"}계정 아이디가 전송되었습니다.</Text>
            </View>
          ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>등록된 이메일을{"\n"}입력해 주세요.</Text>

            <FormProvider {...findIdForm}>
              <View style={styles.inputContainer}>
                <NameInput />
                <MemEmailInput />
              </View>
            </FormProvider>
          </View>
          )}

        <CommBottomButton
          label={isSuccess ? "로그인 하기" : "다음"}
          onPress={isSuccess ? () => router.dismissAll() : findIdForm.handleSubmit(onSubmit)}
          />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex              : 1,
    paddingHorizontal : 20,
  },
  title: {
    fontSize          : 24,
    fontFamily        : "Pretendard-Bold",
    color             : COLOR.COLOR_1A1A1A,
    lineHeight        : 34,
    marginBottom      : 36,
  },
  inputContainer: {
    gap               : 20,
  },
});
