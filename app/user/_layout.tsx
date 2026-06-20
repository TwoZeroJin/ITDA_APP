import { COLOR } from "@/constants";
import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack screenOptions={{
      headerTintColor : COLOR.COMM_BLACK,
      contentStyle: {
        backgroundColor: COLOR.COMM_WHITE
      },
    }}>
      <Stack.Screen 
        name="login"
        options={{
          title: "로그인",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="signupTerm"
        options={{
          title: "회원 가입",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="signupInfo"
        options={{
          title: "회원 가입",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="signupInterest"
        options={{
          title: "회원 가입",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="findUser"
        options={{
          title: "계정 찾기",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="findId"
        options={{
          title: "계정 찾기",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="findPwd"
        options={{
          title: "계정 찾기",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="reportCreate"
        options={{
          title: "신고하기",
          headerShown: false,
        }}
      />
    </Stack>
  )
}