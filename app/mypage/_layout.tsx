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
        </Stack>
    )
}