import CommBottomButton from "@/components/CommBottomButton";
import ChurchNmInput from "@/components/inputs/ChurchNmInput";
import ChurchTmNmInput from "@/components/inputs/ChurchTmNmInput";
import IdInput from "@/components/inputs/IdInput";
import NameInput from "@/components/inputs/NameInput";
import NickNameInput from "@/components/inputs/NickNameInput";
import PasswordConfirmInput from "@/components/inputs/PasswordConfirmInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import { useAuth } from "@/hooks/queries/useAuth";
import { SignupInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignupInfoScreen() {
    const { signupMutation } = useAuth();
    const signupForm = useForm<SignupInfo>({
        defaultValues: {
            // 두개는 테스트 값
            login_type : "D",
            mem_gender : "M",
        }
    })

    const onSubmit = (formValues: SignupInfo) => {
        console.log("formValues",formValues);
        const { login_id, login_pwd, login_type, mem_name, mem_nick, mem_gender, mem_team, mem_birth, mem_telno, mem_addr, mem_interest, mem_church_nm,  mem_church_tm_nm} = formValues;
        signupMutation.mutate({ login_id, login_pwd, login_type, mem_name, mem_nick, mem_gender, mem_team, mem_birth, mem_telno, mem_addr, mem_interest, mem_church_nm, mem_church_tm_nm });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <FormProvider {...signupForm}>
                    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                        <ChurchNmInput/>
                        <NameInput/>
                        <IdInput/>
                        <NickNameInput/>
                        <ChurchTmNmInput/>
                        <PasswordInput/>
                        <PasswordConfirmInput/>
                    </KeyboardAwareScrollView>
                    <CommBottomButton label="다음" onPress={signupForm.handleSubmit(onSubmit)}/>
                </FormProvider>
            </View>
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