import { COLOR } from "@/constants";
import { Stack } from "expo-router";

export default function ChatLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor : COLOR.COMM_BLACK,
            contentStyle: {
                backgroundColor: COLOR.COMM_WHITE
            },
        }}>
            <Stack.Screen 
                name="index"
                options={{
                    title: "채팅하기",
                    headerShown: false,
                    headerBackButtonDisplayMode: "default"
                }}
            />
        </Stack>
    )
}