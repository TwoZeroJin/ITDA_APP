import { COLOR } from "@/constants";
import { Stack } from "expo-router";

export default function GroupLayout() {
  return (
    <Stack screenOptions={{
      headerTintColor : COLOR.COMM_BLACK,
      contentStyle: {
        backgroundColor: COLOR.COMM_WHITE
      },
    }}>
      <Stack.Screen
        name="createDetail"
        options={{
          title: "클럽 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createFee"
        options={{
          title: "클럽 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createPlace"
        options={{
          title: "클럽 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createCategory"
        options={{
          title: "클럽 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createDesc"
        options={{
          title: "클럽 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createPreView"
        options={{
          title: "클럽 미리 보기",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createComplete"
        options={{
          title: "클럽 생성",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="detailView"
        options={{
          title: "클럽 상세",
          headerShown: false,
        }}
      />
    </Stack>
  )
}