import { Stack } from "expo-router";

export default function CommunityLayout() {
  return (
    <Stack screenOptions={
      {
        headerShown: false,
        contentStyle: {
        }
      }
    }>
      <Stack.Screen
        name="index"
        options={
          {
            title:"커뮤니티",
            headerShown: false
          }
        }
      />

    </Stack>
  )
}