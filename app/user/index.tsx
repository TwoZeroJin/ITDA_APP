import { Image, SafeAreaView, StyleSheet, View } from "react-native";

export default function AuthScreen () {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require('@/assets/images/icon.png')} style={styles.logo}/>
            </View>
            <View style={styles.buttonContainer}>
                {/* <CustomButton label="이메일 로그인" onPress={() => router.push('/auth/login')}/>
                <Link href={"/auth/signup"} style={styles.signUpText}>이메일로 가입하기</Link> */}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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