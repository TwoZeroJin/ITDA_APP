import { Stack } from "expo-router";

export default function ChatLayout() {
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
                        title:"채팅",
                        headerShown: false
                    }
                }
            />
        </Stack>
    )
}