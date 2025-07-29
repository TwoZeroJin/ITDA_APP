import CommBottomButton from "@/components/CommBottomButton";
// import EmailInput from "@/components/EmailInput";
// import PasswordInput from "@/components/PasswordInput";
import useAuth from "@/hooks/queries/useAuth";
import { FormProvider, useForm } from "react-hook-form";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";

type FormValues = {
    email: string;
    password: string;
}

export default function LoginScreen() {
    const {loginMutation} = useAuth();
    const loginForm = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
        }
    });
    //const {expoPushToken} = usePushNotification();

    const onSubmit = (formValues: FormValues) => {
        // loginMutation.mutate({...formValues, expoPushToken});
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require('@/assets/images/icon.png')} style={styles.logo}/>
            </View>
            <FormProvider {...loginForm}>
                <View style={styles.container}>
                    {/* <EmailInput
                    />
                    <PasswordInput
                    /> */}
                </View>
                <CommBottomButton label="로그인" onPress={loginForm.handleSubmit(onSubmit)}/>
            </FormProvider>
            <View style={styles.buttonContainer}>
                {/* <CustomButton label="이메일 로그인" onPress={() => router.push('/auth/login')}/>
                <Link href={"/auth/signup"} style={styles.signUpText}>이메일로 가입하기</Link> */}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
        gap: 16
    },
    logo: {
        width: 112,
        height: 112
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 2
    },
    signUpText: {
         textAlign: "center",
         textDecorationLine: "underline",
         marginTop: 20,
    },
    buttonContainer: {
        paddingHorizontal: 32,
        flex: 1
    }
})