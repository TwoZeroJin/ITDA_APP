import { COLOR, COMM_STYLES } from "@/constants";
import React, { useState } from "react";
import { Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import CustomButton from "@/components/comm/CustomButton";
import CustomDialog from "@/components/modal/CustomDialog";
import { useAuth } from "@/hooks/queries/useAuth";
import IconMore from '@/assets/images/arrow_right.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from "react-native-webview";
import { router } from "expo-router";

type SettingsMenuItem = {
  label   : string;
  onPress : () => void;
};

/**
 * 마이페이지 - 알림 화면
 */
export default function NotiListScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [isLogoutDialogVisible, setIsLogoutDialogVisible] = useState(false);
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const [termUrl, setTermUrl] = useState<string>('');

  const openTermWebView = (url: string) => {
    setTermUrl(url);
    setIsWebViewVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutDialogVisible(false);
    logout();
  };

  const SETTINGS_MENU: SettingsMenuItem[] = [
    {
      label: '공지사항',
      onPress: () => router.navigate('/mypage/notice'),
    },
    // {
    //   label: '상세 설정',
    //   onPress: () => {},
    // },
    // {
    //   label: '자주 묻는 질문',
    //   onPress: () => {},
    // },
    {
      label: '개선 및 의견 남기기',
      onPress: () => router.navigate('/mypage/feedbackCreate'),
    },
    // {
    //   label: '호스트 가이드',
    //   onPress: () => {},
    // },
    // {
    //   label: '멤버 관리',
    //   onPress: () => {},
    // },
    // {
    //   label: '계정 관리',
    //   onPress: () => {},
    // },
    {
      label: '서비스 이용 약관',
      onPress: () => openTermWebView(process.env.EXPO_PUBLIC_TERMS_SERVICE_URL ?? ''),
    },
    {
      label: '개인정보 처리방침',
      onPress: () => openTermWebView(process.env.EXPO_PUBLIC_TERMS_PRIVACY_URL ?? ''),
    },
  ];

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="알림"/>

      <View style={styles.menuContainer}>
        <View style={styles.switchRow}>
          <Text style={styles.menuText}>알림받기</Text>
          <Switch
            value={isNotificationEnabled}
            onValueChange={setIsNotificationEnabled}
            trackColor={{ false: COLOR.COMM_GRAY_6, true: COLOR.APP_MAIN }}
            thumbColor={COLOR.COMM_WHITE}
          />
        </View>

        {SETTINGS_MENU.map((item) => (
          <TouchableOpacity 
            key={item.label} 
            style={styles.menuRow} 
            activeOpacity={0.6} 
            onPress={item.onPress}
          >
            <Text style={styles.menuText}>{item.label}</Text>
            <IconMore width={11} height={16} />
          </TouchableOpacity>
        ))}
      </View>

      <CommBottomButton label="로그아웃" onPress={() => setIsLogoutDialogVisible(true)} />

      <CustomDialog
        visible={isLogoutDialogVisible}
        title="로그아웃"
        content="로그아웃 하시겠어요?"
        cancelLabel="취소"
        confirmLabel="로그아웃"
        onCancel={() => setIsLogoutDialogVisible(false)}
        onConfirm={handleConfirmLogout}
      />
      <Modal
        visible={isWebViewVisible}
        animationType="slide"
        onRequestClose={() => setIsWebViewVisible(false)}
      >
        <View
          style={[
            styles.webViewContainer,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 25,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          <WebView style={styles.webView} source={{ uri: termUrl }} startInLoadingState />
          <View style={styles.webViewFooter}>
            <CustomButton
              label="닫기"
              variant="filled"
              style={styles.webViewCloseButton}
              onPress={() => setIsWebViewVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex              : 1,
    paddingHorizontal : 16,
  },
  switchRow: {
    borderBottomWidth : 1,
    borderBottomColor : COLOR.COMM_GRAY_6,
    flexDirection     : 'row',
    alignItems        : 'center',
    justifyContent    : 'space-between',
    paddingBottom     : 12,
    marginVertical    : 12,
  },
  menuRow: {
    borderBottomWidth : 1,
    borderBottomColor : COLOR.COMM_GRAY_6,
    flexDirection     : 'row',
    alignItems        : 'center',
    justifyContent    : 'space-between',
    marginVertical    : 12,
    paddingBottom     : 12,
  },
  menuText: {
    fontSize          : 16,
    fontWeight        : 'medium',
    color             : COLOR.TEXT_DEFAULT,
  },
  webViewContainer: {
    flex              : 1,
  },
  webView: {
    flex              : 1,
  },
  webViewFooter: {
    paddingTop        : 12,
    paddingHorizontal : 20,
    paddingBottom     : 12,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  webViewCloseButton: {
    height            : 52,
    borderRadius      : 12,
  },
});