import { Stack } from "expo-router";

export default function ReviewLayout() {
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
                        title:"게시글 후기",
                        headerShown: false
                    }
                }
            />
        </Stack>
    )
}