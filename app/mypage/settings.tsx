import { COLOR, COMM_STYLES } from "@/constants";
import React, { useEffect, useState } from "react";
import { Alert, Linking, Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import CustomButton from "@/components/comm/CustomButton";
import CustomDialog from "@/components/modal/CustomDialog";
import { useAuth } from "@/hooks/queries/useAuth";
import IconMore from '@/assets/images/arrow_right.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from "react-native-webview";
import { router } from "expo-router";
import { useMemberUpdate, useMemberWithdrawl } from "@/hooks/queries/useMember";
import { getMemberInfo, getPushStatus, saveMemberInfoForUpdate, setPushStatus } from "@/utils/commUtil";
import { MemberInfo } from "@/types";
import usePushNotification from "@/hooks/usePushNotification";

type SettingsMenuItem = {
  label   : string;
  onPress : () => void;
};

/**
 * 마이페이지 - 설정 화면
 */
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [isLogoutDialogVisible, setIsLogoutDialogVisible] = useState(false);
  const [isMemberWithdrawalDialogVisible, setIsMemberWithdrawalDialogVisible] = useState(false);
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const [termUrl, setTermUrl] = useState<string>('');
  const { expoPushToken, requestPushPermission } = usePushNotification();
  const memberUpdate = useMemberUpdate();
  const memberWithdrawl = useMemberWithdrawl();
  const [localPushStatus, setLocalPushStatus] = useState('');

  // 회원정보 조회 및 없을 경우 로그인 화면으로 이동
  useEffect(() => {
    const fetchData = async () => {
      const memberInfo = await getMemberInfo();
      if (memberInfo) {
        setIsNotificationEnabled(memberInfo.push_send_yn === 'Y');
      }
      setLocalPushStatus(await getPushStatus());
    };
  
    fetchData();
  }, []);
  
  const onHandleNotificationToggle = async (value: boolean) => {
    let pushToken = expoPushToken;

    // 이전에 권한 요청을 거부(N)한 상태에서 다시 켜는 경우, 권한 허용 안내를 다시 띄움
    if (value && localPushStatus === 'N') {
      pushToken = await requestPushPermission(true);
      if (!pushToken) {
        // 여전히 권한이 없으면 스위치를 켜지 않고 종료
        setLocalPushStatus(await getPushStatus());
        return;
      }
    }

    await setPushStatus('A');
    setLocalPushStatus('A');
    setIsNotificationEnabled(value);

    const submitValues = {
      push_send_yn      : value ? 'Y' : 'N',
      push_token        : pushToken,
    } as MemberInfo;
    memberUpdate.mutate(submitValues, {
      onSuccess: async (result) => {
        await saveMemberInfoForUpdate(result.data);
        await setPushStatus('Y');
      },
    });
  }

  const openTermWebView = (url: string) => {
    setTermUrl(url);
    setIsWebViewVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutDialogVisible(false);
    logout();
  };

  const handleConfirmMemberWithdrawal = () => {
    setIsMemberWithdrawalDialogVisible(false);
    memberWithdrawl.mutate();
  };

  const SETTINGS_MENU: SettingsMenuItem[] = [
    {
      label: '회원정보 수정',
      onPress: () => router.navigate('/mypage/memUpdate'),
    },
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
    //   label: '멤버 목록',
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
    {
      label: '회원 탈퇴',
      onPress: () => setIsMemberWithdrawalDialogVisible(true),
    },
  ];

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="설정"/>

      <View style={styles.menuContainer}>
        <View style={styles.switchRow}>
          <Text style={styles.menuText}>알림받기</Text>
          <Switch
            value={isNotificationEnabled}
            onValueChange={onHandleNotificationToggle}
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
              paddingTop      : insets.top,
              paddingBottom   : insets.bottom + 25,
              paddingLeft     : insets.left,
              paddingRight    : insets.right,
            },
          ]}
        >
          <WebView style={styles.webViewContainer} source={{ uri: termUrl }} startInLoadingState />
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

      <CustomDialog
        visible={isMemberWithdrawalDialogVisible}
        content="회원 탈퇴를 진행하시겠습니까?"
        cancelLabel="취소"
        confirmLabel="확인"
        onCancel={() => setIsMemberWithdrawalDialogVisible(false)}
        onConfirm={handleConfirmMemberWithdrawal}
      />
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
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
  },
  webViewContainer: {
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