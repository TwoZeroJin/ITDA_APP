import CommHeader from "@/components/comm/CommHeader";
import { COLOR, COMM_STYLES } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconRightArrow from "@/assets/images/icon_arrow_right_more.svg";
import IconMail from "@/assets/images/icon_mail.svg";
import IconPassword from "@/assets/images/icon_pwd.svg";

/**
 * 계정 찾기 화면 (계정, 비밀번호 찾기)
 */
export default function FindUserScreen() {
  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="계정 찾기"/>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>계정 정보를{"\n"}잊으셨나요?</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.navigate('/user/findId')}
          >
            <View style={styles.menuLeft}>
              <IconMail />
              <Text style={styles.menuText}>계정 찾기</Text>
            </View>
            <IconRightArrow width={8} height={13} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.navigate('/user/findPwd')}
          >
            <View style={styles.menuLeft}>
              <View style={{ marginStart: 2 }}>
                <IconPassword />
              </View>
              <Text style={styles.menuText}>비밀번호 찾기</Text>
            </View>
            <IconRightArrow width={8} height={13} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex              : 1,
    paddingHorizontal : 20,
  },
  title: {
    fontSize          : 24,
    fontFamily        : "Pretendard-Bold",
    color             : COLOR.COLOR_1A1A1A,
    lineHeight        : 34,
    marginBottom      : 36,
  },
  menuContainer: {
    gap               : 14,
  },
  menuItem: {
    flexDirection     : "row",
    alignItems        : "center",
    justifyContent    : "space-between",
    height            : 60,
    paddingVertical   : 18,
    paddingHorizontal : 18,
    borderWidth       : 1,
    borderColor       : COLOR.COLOR_E6E6E6,
    borderRadius      : 12,
  },
  menuLeft: {
    flexDirection     : "row",
    alignItems        : "center",
    gap               : 12,
  },
  menuText: {
    fontSize          : 16,
    fontFamily        : "Pretendard-Medium",
    color             : COLOR.TEXT_DEFAULT,
  },
});
