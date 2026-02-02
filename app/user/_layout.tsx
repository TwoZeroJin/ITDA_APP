import { COLOR } from "@/constants";
import { Stack } from "expo-router";

export default function UserLayout() {
    return (
        <Stack screenOptions={{
            headerTintColor : COLOR.COMM_BLACK,
            contentStyle: {
                backgroundColor: COLOR.COMM_WHITE
            },
        }}>
            <Stack.Screen 
                name="login"
                options={{
                    title: "로그인",
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="signupTerm"
                options={{
                    title: "회원 가입",
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="signupInfo"
                options={{
                    title: "회원 가입",
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="signupInterest"
                options={{
                    title: "회원 가입",
                    headerShown: false,
                }}
            />
        </Stack>
    )
}