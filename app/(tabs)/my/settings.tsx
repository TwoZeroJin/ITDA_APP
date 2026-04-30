import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/**
 * 반복되는 설정 리스트 아이템을 위한 공통 컴포넌트
 */
type SettingItemProps = {
  title: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
};

function SettingItem({
  title,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      disabled={hasSwitch} // 스위치가 있는 항목은 터치 이벤트 대신 스위치 이벤트를 사용합니다.
      activeOpacity={0.7}
    >
      <Text style={styles.itemText}>{title}</Text>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#e4e4e4", true: "#ff8c8c" }}
          thumbColor={"#ffffff"}
          ios_backgroundColor="#e4e4e4"
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#b0b0b0" />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [isPushEnabled, setIsPushEnabled] = useState(true); // 알림받기 상태

  return (
    <SafeAreaView style={styles.container}>
      {/* 커스텀 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.headerRight} /> {/* 타이틀 중앙 정렬을 위한 빈 공간 */}
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* 설정 리스트 */}
        <SettingItem
          title="알림받기"
          hasSwitch={true}
          switchValue={isPushEnabled}
          onSwitchChange={setIsPushEnabled}
        />
        <SettingItem title="공지사항" onPress={() => console.log("공지사항 클릭")} />
        <SettingItem title="상세 설정" onPress={() => console.log("상세 설정 클릭")} />
        <SettingItem title="자주 묻는 질문" onPress={() => console.log("자주 묻는 질문 클릭")} />
        <SettingItem title="개선 및 의견 남기기" onPress={() => console.log("개선 및 의견 남기기 클릭")} />
        <SettingItem title="호스트 가이드" onPress={() => console.log("호스트 가이드 클릭")} />
        <SettingItem title="멤버 관리" onPress={() => console.log("멤버 관리 클릭")} />
        <SettingItem title="계정 관리" onPress={() => console.log("계정 관리 클릭")} />
        <SettingItem title="서비스 이용 약관" onPress={() => console.log("서비스 이용 약관 클릭")} />
        <SettingItem title="개인정보 처리방침" onPress={() => console.log("개인정보 처리방침 클릭")} />

        {/* 로그아웃 버튼 */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            console.log("로그아웃 클릭");
            // 로그아웃 로직 추가 필요
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  // 헤더 스타일
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
  },
  backButton: {
    width: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  headerRight: {
    width: 24, // backButton과 동일한 너비를 주어 타이틀을 완벽한 중앙으로 맞춤
  },

  // 콘텐츠 영역
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  // 리스트 아이템 스타일
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  // 로그아웃 버튼 스타일
  logoutButton: {
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  logoutText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
});