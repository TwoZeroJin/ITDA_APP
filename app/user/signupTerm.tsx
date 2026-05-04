import Logo from '@/assets/images/logo.svg';
import CheckboxField from '@/components/CheckboxField';
import CommBottomButton from '@/components/CommBottomButton';
import CommHeader from '@/components/CommHeader';
import CustomButton from '@/components/CustomButton';
import { COLOR } from '@/constants';
import { router } from "expo-router";
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Modal } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

/**
 * 회원 가입 - 약관 동의 화면
 */
export default function SignupTermScreen() {
    const [serviceChecked, setServiceChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [isWebViewVisible, setIsWebViewVisible] = useState(false);
    const [termUrl, setTermUrl] = useState<string>('');

    const openTermWebView = (url: string) => {
        setTermUrl(url);
        setIsWebViewVisible(true);
    };

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
                    <TouchableOpacity onPress={() => openTermWebView(process.env.EXPO_PUBLIC_TERMS_SERVICE_URL ?? '')}>
                        <Text style={styles.termViewText}>내용보기</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.termItemContainer}>
                    <CheckboxField 
                        label='개인정보 수집 및 이용 동의' 
                        value={privacyChecked} 
                        onChange={() => setPrivacyChecked(!privacyChecked)}
                    />
                    <TouchableOpacity onPress={() => openTermWebView(process.env.EXPO_PUBLIC_TERMS_PRIVACY_URL ?? '')}>
                        <Text style={styles.termViewText}>내용보기</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <CommBottomButton label="다음" onPress={() => (serviceChecked && privacyChecked) && router.navigate('/user/signupInfo')}
                disabled={!(serviceChecked && privacyChecked)}
                />

            {/* 웹뷰 */}
            <Modal
                visible={isWebViewVisible}
                animationType="slide"
                onRequestClose={() => setIsWebViewVisible(false)}
            >
                <SafeAreaView style={styles.webViewContainer}>
                    <WebView style={styles.webView} source={{ uri: termUrl }} startInLoadingState />
                    <View style={styles.webViewFooter}>
                        <CustomButton
                            label="닫기"
                            variant="filled"
                            style={styles.webViewCloseButton}
                            onPress={() => setIsWebViewVisible(false)}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
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
        paddingVertical     : 20,
        paddingStart        : 10,
        paddingEnd          : 10,
    },
    webViewContainer: {
        flex                : 1,
    },
    webView: {
        flex                : 1,
    },
    webViewFooter: {
        paddingTop          : 12,
        paddingHorizontal   : 20,
        paddingBottom       : 12,
        backgroundColor     : COLOR.COMM_WHITE,
    },
    webViewCloseButton: {
        height              : 52,
        borderRadius        : 12,
    },
})