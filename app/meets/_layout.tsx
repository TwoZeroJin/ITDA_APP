import { COLOR } from "@/constants";
import { Stack } from "expo-router";

export default function MeetLayout() {
  return (
    <Stack screenOptions={{
      headerTintColor : COLOR.COMM_BLACK,
      contentStyle: {
        backgroundColor: COLOR.COMM_WHITE
      },
    }}>
      <Stack.Screen
        name="create"
        options={{
          title: "모임 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createType"
        options={{
          title: "모임 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="selectGroup"
        options={{
          title: "클럽 선택",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createDetail"
        options={{
          title: "모임 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createFee"
        options={{
          title: "모임 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createPlace"
        options={{
          title: "모임 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createCategory"
        options={{
          title: "모임 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createDesc"
        options={{
          title: "모임 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createPreView"
        options={{
          title: "미리 보기",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createComplete"
        options={{
          title: "모임 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="meetDetailPage"
        options={{
          title: "모임 상세",
          headerShown: false,
        }}
      />
    </Stack>
  )
}