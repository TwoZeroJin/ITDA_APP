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
                        title:"소모임 생성",
                        headerShown: false
                    }
                }
            />
        </Stack>
    )
}