import { Stack } from "expo-router";
import { COLOR } from "@/constants";

export default function CommunitiesLayout() {
  return (
    <Stack screenOptions={
      {
            headerTintColor : COLOR.COMM_BLACK,
            contentStyle: {
                backgroundColor: COLOR.COMM_WHITE
            },
        }    }>
      <Stack.Screen
        name="chooseWriteType"
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
            title:"커뮤니티 작성",
            headerShown: false
          }
        }
      />
    </Stack>
  )
}