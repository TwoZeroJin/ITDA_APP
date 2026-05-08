import { COLOR } from "@/constants";
import { Stack } from "expo-router";

export default function MyPageLayout() {
  return (
      <Stack screenOptions={{
        headerTintColor : COLOR.COMM_BLACK,
        contentStyle: {
          backgroundColor: COLOR.COMM_WHITE
        },
      }}>
        <Stack.Screen
          name="settings"
          options={{
            title: "설정",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notice"
          options={{
            title: "공지사항",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="feedbackCreate"
          options={{
            title: "피드백 작성",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="memUpdate"
          options={{
            title: "회원정보 수정",
            headerShown: false,
          }}
        />
    </Stack>
  )
}