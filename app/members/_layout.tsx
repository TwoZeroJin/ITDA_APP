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
          name="applyList"
          options={{
            title: "가입 승인",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="memberList"
          options={{
            title: "멤버 관리",
            headerShown: false,
          }}
        />
    </Stack>
  )
}