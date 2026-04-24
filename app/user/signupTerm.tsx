import Logo from '@/assets/images/logo.svg';
import CheckboxField from '@/components/CheckboxField';
import CommBottomButton from '@/components/CommBottomButton';
import CommHeader from '@/components/CommHeader';
import { COLOR } from '@/constants';
import { router } from "expo-router";
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

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
                <View style={styles.termItemContainer}>
                    <CheckboxField 
                        label='서비스 이용약관 동의' 
                        value={serviceChecked} 
                        onChange={() => setServiceChecked(!serviceChecked)}
                    />
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.termViewText}>내용보기</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.termItemContainer}>
                    <CheckboxField 
                        label='개인정보 수집 및 이용 동의' 
                        value={privacyChecked} 
                        onChange={() => setPrivacyChecked(!privacyChecked)}
                    />
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.termViewText}>내용보기</Text>
                    </TouchableOpacity>
                </View>
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
        alignItems      : "stretch",
        marginHorizontal: 20,
        gap             : 10
    },
    termItemContainer: {
        flexDirection   : "row",
        justifyContent  : "space-between",
        alignItems      : "center",
    },
    termViewText: {
        color               : COLOR.COMM_GRAY_2,
        textDecorationLine  : "underline",
        textDecorationColor : COLOR.COMM_GRAY_2,
        fontSize            : 14,
        lineHeight          : 19,
    },
})