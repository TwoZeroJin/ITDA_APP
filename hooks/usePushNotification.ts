import { Alert, Linking, Platform } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { getPushStatus, setPushStatus } from "@/utils/commUtil";

/**
 * 푸시 알림 관련 로직을 담당하는 커스텀 훅
 */
function usePushNotification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // forceAsk가 true면 pushYn 값과 무관하게 항상 권한 허용 안내를 띄움 (설정 화면에서 알림받기를 다시 켤 때 사용)
  const handleRegistrationError = async (errorMessage: string, canOpenSettings = false, forceAsk = false) => {
    setRegistrationError(errorMessage);

    // 취소한 경우가 있을 경우 저장하여 다시 물어보지 않도록 함
    const pushStatus = await getPushStatus();

    if (canOpenSettings && (forceAsk || pushStatus === 'A')) {
      Alert.alert("알림 권한 필요", errorMessage, [
        { text: "취소",
          style: "cancel",
          onPress: () => {
            // 취소 버튼 눌렀을 때 Storage에 푸시 알림 거부 상태 저장
            setPushStatus("N");
          },
        },
        {
          text: "설정 열기",
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]);
      return;
    }

    Alert.alert("알림 설정", errorMessage);
  };

  // forceAsk가 true면 이전에 거부(N)했더라도 권한 허용 안내를 다시 띄움
  const registerForPushNotificationsAsync = async (forceAsk = false) => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const pushStatus = await getPushStatus();

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        if (forceAsk || pushStatus !== 'N') {
          handleRegistrationError("푸시 권한을 허용해주세요.", true, forceAsk);
          setPushStatus("A");
          return;
        }
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID를 찾을 수 없습니다.");
        setPushStatus("A");
        return;
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
        setPushStatus("A");
        return;
      }
    } else {
      handleRegistrationError("실제 기기를 이용해주세요.");
      setPushStatus("A");
      return;
    }
  };

  // 설정 화면 등에서 알림 권한을 다시 요청할 때 사용하는 함수. 허용된 경우 토큰을 반환하고 상태를 갱신함
  const requestPushPermission = async (forceAsk = false) => {
    const token = await registerForPushNotificationsAsync(forceAsk);
    setExpoPushToken(token ?? "");
    return token ?? "";
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        handleRegistrationError(message);
      });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
      });

    return () => {
      notificationListener.current &&
        notificationListener.current.remove();
      responseListener.current &&
        responseListener.current.remove();
    };
  }, []);

  return { expoPushToken, notification, registrationError, requestPushPermission };
}

export default usePushNotification;
