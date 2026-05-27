import CommBottomButton from "@/components/comm/CommBottomButton";
import IdInput from "@/components/inputs/IdInput";
import MemEmailInput from "@/components/inputs/MemEmailInput";
import NameInput from "@/components/inputs/NameInput";
import { COLOR } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

type FindPwdForm = {
  mem_name  : string;
  login_id  : string;
  mem_email : string;
};

export default function FindPwdScreen() {
  const [isSuccess, setIsSuccess] = useState(false);

  const findPwdForm = useForm<FindPwdForm>({
    defaultValues: {
      mem_name  : "",
      login_id  : "",
      mem_email : "",
    },
  });

  const onSubmit = (formValues: FindPwdForm) => {
    // TODO: API 연동 - 200 응답 시 setIsSuccess(true) 호출
    console.log(formValues);
    // setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>등록된 이메일로{"\n"}비밀번호 재설정 메일이 전송되었습니다.</Text>
        <CommBottomButton
          label="로그인 하기"
          onPress={() => router.dismissAll()}
        />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>이름, 아이디, 이메일을{"\n"}입력해 주세요.</Text>

        <FormProvider {...findPwdForm}>
          <View style={styles.inputContainer}>
            <NameInput />
            <IdInput />
            <MemEmailInput />
          </View>
        </FormProvider>
        <CommBottomButton
          label="다음"
          onPress={findPwdForm.handleSubmit(onSubmit)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex              : 1,
    marginHorizontal  : 25,
    paddingTop        : 36,
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
