import CommBottomButton from "@/components/CommBottomButton";
// import EmailInput from "@/components/EmailInput";
// import PasswordInput from "@/components/PasswordInput";
import useAuth from "@/hooks/queries/useAuth";
import usePushNotification from "@/hooks/usePushNotification";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

type FormValues = {
    email: string;
    password: string;
}

export default function LoginScreen () {
    const {loginMutation} = useAuth();
    const loginForm = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
        }
    });
    const {expoPushToken} = usePushNotification();

    const onSubmit = (formValues: FormValues) => {
        // loginMutation.mutate({...formValues, expoPushToken});
    }

    return (
        <FormProvider {...loginForm}>
            <View style={styles.container}>
                {/* <EmailInput
                />
                <PasswordInput
                /> */}
            </View>
            <CommBottomButton label="로그인" onPress={loginForm.handleSubmit(onSubmit)}/>
        </FormProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
        gap: 16
    },
})