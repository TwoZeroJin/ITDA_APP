import { Stack } from "expo-router";

export default function ReviewLayout() {
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
            title:"게시글 후기",
            headerShown: false
          }
        }
      />
      <Stack.Screen
        name="chooseWriteMeet"
        options={
          {
            title:"커뮤니티 작성",
            headerShown: false
          }
        }
      />
      <Stack.Screen
        name="chooseMeet"
        options={
          {
            title:"커뮤니티 작성",
            headerShown: false
          }
        }
      />
      <Stack.Screen
        name="writeFeedback"
        options={
          {
            title:"커뮤니티/피드 작성",
            headerShown: false
          }
        }
      />
    </Stack>
  )
}