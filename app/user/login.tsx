import LogoMain from '@/assets/images/logo_main2.svg';
import CustomButton from '@/components/comm/CustomButton';
import IdInput from "@/components/inputs/IdInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import { COLOR } from "@/constants";
import { useAuth } from "@/hooks/queries/useAuth";
import usePushNotification from '@/hooks/usePushNotification';
import { User } from '@/types';
import { router } from 'expo-router';
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

export default function LoginScreen() {
  const { loginMutation } = useAuth();
  const { expoPushToken } = usePushNotification();
  const loginForm = useForm<User>({
    defaultValues: {
      // 테스트 고정 값
      login_id    : "ghong",
      login_pwd   : "1111",
    }
  });
  //const {expoPushToken} = usePushNotification();

  const onSubmit = (formValues: User) => {
    loginMutation.mutate({...formValues});
  }

  // 기본 로그인, ID / PASSWORD 입력
  const defaultLogin = (formValues: User) => {
    onSubmit({
      ...formValues,
      login_type: "D", // 일반 로그인 값, 추후 소셜 로그인 추가 시 해당 값으로 구분
      push_token: expoPushToken || "", // 푸시 토큰 추가
    });
  }

  // 카카오 / 구글 / 애플 등 추후에 추가 작업 필요
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {/* <Logo width={97} height={80.6}/> */}
          <LogoMain width={200} height={98}/>
        </View>
        <FormProvider {...loginForm}>
          <View style={styles.inputContainer}>
            <IdInput />
            <PasswordInput />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton label="로그인" onPress={loginForm.handleSubmit(defaultLogin)}/>
            <CustomButton label="회원가입" variant='filled' onPress={() => router.navigate('/user/signupTerm')}/>
          </View>
          <View style={styles.findUserContainer}>
            <Text style={styles.findIdText}>계정 정보를 잊으셨나요?</Text>
          </View>
          <View style={styles.snsLoginTextContainer}>
            <View style={styles.line}/>
            <Text style={styles.snsLoginText}>간편 로그인</Text>
            <View style={styles.line}/>
          </View>
          <View style={styles.snsLoginBtnContainer}>
            <CustomButton label="카카오톡으로 시작하기" onPress={() => {}}/>
            {/* <CustomButton label="애플로 시작하기" onPress={() => {}}/> */}
          </View>
        </FormProvider>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex                : 1,
    marginHorizontal    : 25,
  },
  imageContainer: {
    justifyContent  : "center",
    alignItems      : "center",
    marginTop       : 50,
    marginBottom    : 30
  },
  inputContainer: {
    gap             : 20,
    marginBottom    : 50
  },
  buttonContainer: {
    gap             : 10,
    marginBottom    : 16
  },
  findUserContainer: {
    alignItems      : "center",
    marginBottom    : 40
  },
  findIdText: {
    fontSize    : 14,
    color       : COLOR.TEXT_GRAY
  },
  line: {
    height          : 1,
    flex            : 2,
    backgroundColor : COLOR.COMM_GRAY_6
  },
  snsLoginTextContainer: {
    flexDirection   : "row",
    alignItems      : "center",
    marginBottom    : 5
  },
  snsLoginText: {
    fontSize            : 12,
    fontWeight          : 500,
    lineHeight          : 30,
    marginHorizontal    : 12
  },
  snsLoginBtnContainer: {
    gap : 10
  }
})