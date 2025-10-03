import { COLOR } from "@/constants";
import { Stack } from "expo-router";

export default function TestLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            headerTintColor : COLOR.COMM_BLACK,
            contentStyle: {
                backgroundColor: COLOR.COMM_WHITE
            },
        }}>
            <Stack.Screen 
                name="index"
                options={{
                    title: "페이징 스크롤 테스트 화면",
                    headerShown: true,
                    headerBackButtonDisplayMode: "default"
                }}
            />
        </Stack>
    )
}