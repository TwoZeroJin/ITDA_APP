import CommBottomButton from "@/components/CommBottomButton";
import IdInput from "@/components/inputs/IdInput";
import NameInput from "@/components/inputs/NameInput";
import NickNameInput from "@/components/inputs/NickNameInput";
import PasswordConfirmInput from "@/components/inputs/PasswordConfirmInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import useAuth from "@/hooks/queries/useAuth";
import { SignupInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

export default function SignupInfoScreen() {
    const { signupMutation } = useAuth();
    const signupForm = useForm<SignupInfo>({
        defaultValues: {
            login_id: "",
            login_pwd: "",
            mem_name: "",
            mem_nick: "",
            mem_team: "",
            mem_birth: "",
            mem_gender: "",
            mem_interest: "",
            mem_telno: "",
            mem_addr: "",
        }
    })

    const onSubmit = (formValues: SignupInfo) => {
        const { login_id, login_pwd, mem_name, mem_nick, mem_team, mem_birth, mem_addr, mem_interest, mem_gender, mem_telno } = formValues;
        signupMutation.mutate({ login_id, login_pwd, mem_name, mem_nick, mem_team, mem_birth, mem_addr, mem_interest, mem_gender, mem_telno });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <FormProvider {...signupForm}>
                    <View style={styles.container}>
                        <NameInput/>
                        <NickNameInput/>
                        <IdInput/>
                        <PasswordInput/>
                        <PasswordConfirmInput/>
                    </View>
                    <CommBottomButton label="다음" onPress={signupForm.handleSubmit(onSubmit)}/>
                </FormProvider>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex                : 1,
        marginHorizontal    : 10,
        gap                 : 16
    },
})