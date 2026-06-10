import { Stack } from "expo-router";

export default function MeetLayout() {
  return (
    <Stack
      screenOptions={
        {
          headerShown: false,
          contentStyle: {
          }
        }
      }
    >
      <Stack.Screen
        name="index"
        options={
          {
            title:"소셜링 보기",
            headerShown: false
          }
        }
      />
    </Stack>
  )
}