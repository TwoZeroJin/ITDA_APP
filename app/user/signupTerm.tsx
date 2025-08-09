import Logo from '@/assets/images/logo.svg';
import CheckboxField from '@/components/CheckboxField';
import CommBottomButton from '@/components/CommBottomButton';
import { router } from "expo-router";
import { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupTermScreen() {
    const [serviceChecked, setServiceChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
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
                <CommBottomButton label="다음" onPress={() => router.navigate('/user/signupInfo')}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex                : 1,
        marginHorizontal    : 10,
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