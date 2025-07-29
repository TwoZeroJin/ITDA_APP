import { COLOR } from "@/constants";
import Foundation from "@expo/vector-icons/Foundation";
import { Link, Stack } from "expo-router";

export default function UserLayout() {
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
                    title: "로그인",
                    headerShown: true,
                    headerLeft: () => (
                        <Link href={"/"} replace style={{paddingRight : 5}}> 
                            <Foundation name="home" size={20} color="black"/>
                        </Link>
                    )
                }}
            />
            <Stack.Screen 
                name="login"
                options={{
                    title: "이메일 로그인",
                    headerShown: true,
                    headerBackButtonDisplayMode: "minimal"
                }}
            />
            <Stack.Screen 
                name="signup"
                options={{
                    title: "회원 가입",
                    headerShown: true,
                    headerBackButtonDisplayMode: "minimal"
                }}
            />
        </Stack>
    )
}