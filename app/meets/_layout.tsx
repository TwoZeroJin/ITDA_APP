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
                name="createType"
                options={{
                    title: "모임 생성",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="createSubType"
                options={{
                    title: "모임 생성",
                    headerShown: false,
                }}
            />
        </Stack>
    )
}