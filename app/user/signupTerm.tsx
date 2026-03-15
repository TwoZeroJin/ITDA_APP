import Logo from '@/assets/images/logo.svg';
import CheckboxField from '@/components/CheckboxField';
import CommBottomButton from '@/components/CommBottomButton';
import CommHeader from '@/components/CommHeader';
import { router } from "expo-router";
import { useState } from 'react';
import { StyleSheet, View } from "react-native";

/**
 * 회원 가입 - 약관 동의 화면
 */
export default function SignupTermScreen() {
    const [serviceChecked, setServiceChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);

    return (
        <View style={styles.container}>
            <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="회원 가입"/>
            <View style={styles.imageContainer}>
                <Logo width={97} height={80.6}/>
            </View>
            <View style={styles.termContainer}>
                <CheckboxField 
                    label='서비스 이용약관 동의' 
                    value={serviceChecked} 
                    onChange={() => setServiceChecked(!serviceChecked)}
                    />
                <CheckboxField 
                    label='개인정보 수집 및 이용 동의' 
                    value={privacyChecked} 
                    onChange={() => setPrivacyChecked(!privacyChecked)}
                    />
            </View>
            <CommBottomButton label="다음" onPress={() => (serviceChecked && privacyChecked) && router.navigate('/user/signupInfo')}
                disabled={!(serviceChecked && privacyChecked)}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex                : 1,
    },
    imageContainer: {
        justifyContent  : "center",
        alignItems      : "center",
        marginTop       : 50,
        marginBottom    : 100
    },
    termContainer: {
        justifyContent  : "center",
        alignItems      : "flex-start",
    },
})