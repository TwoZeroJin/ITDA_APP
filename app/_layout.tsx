import queryClient from '@/api/queryClient';
import AuthRoute from '@/components/comm/AuthRoute';
import CustomDialog from '@/components/modal/CustomDialog';
import LoadingLayout from '@/components/comm/LoadingLayout';
import { COLOR, COMM_STYLES } from '@/constants';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { useAutoLogin } from '@/hooks/queries/useAuth';
import { useMainEntry } from '@/hooks/queries/useMain';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldPlaySound: true,
    // shouldSetBadge: true,
    // shouldShowAlert: true,
    // shouldShowBanner: true,
    // shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [loadedFonts] = useFonts({
    'Pretendard-Black'     : require('@/assets/fonts/Pretendard-Black.ttf'),
    'Pretendard-Bold'      : require('@/assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-Light'     : require('@/assets/fonts/Pretendard-Light.ttf'),
    'Pretendard-Medium'    : require('@/assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-Regular'   : require('@/assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-SemiBold'  : require('@/assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Thin'      : require('@/assets/fonts/Pretendard-Thin.ttf'),
  });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if(loadedFonts) {
    }

    async function prepare() {
      // 최소 1.5초 강제 유지
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 준비 완료
      setAppIsReady(true);
    }

    prepare();    
  }, [loadedFonts]);

  if (!loadedFonts) {
    return null; 
  }

  if (!appIsReady) {
    // 앱 준비 전에는 splash 유지 (Expo Go에서는 app.json splash 이미지 표시)
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('../assets/images/splash_screen2.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <ActionSheetProvider>
      <SafeAreaProvider>
        <LoadingProvider>
          <QueryClientProvider client={queryClient}>
            <AuthRoute>
              <SafeAreaView style={COMM_STYLES.container}>
                <RootNavigator />
              </SafeAreaView>
              <LoadingLayout/>
              <Toast config={{
                customToast: ({text1, text2}) => (
                  <View style={[styles.toastContainer, { marginTop: insets.top + 12 }]}>
                    <Text style={{ fontSize: 18, color: 'white' }}>{text1}</Text>
                    {text2 && <Text style={{ color: 'white' }}>{text2}</Text>}
                  </View>
                ),
              }}/>
            </AuthRoute>
          </QueryClientProvider>
        </LoadingProvider>
      </SafeAreaProvider>
    </ActionSheetProvider>
  );
}

function RootNavigator() {
  // API 순차 처리
  const mainData = useMainEntry();
  const autoLogin = useAutoLogin({
    enabled : mainData.data?.ret_code === 200 // API 순차처리를 위한 enabled 처리
  }); 
  
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)"       options={{ headerShown: false }} />         
        <Stack.Screen name="user"         options={{ headerShown: false }} />
        <Stack.Screen name="chats"        options={{ headerShown: false }} />
        <Stack.Screen name="meets"        options={{ headerShown: false }} />
        <Stack.Screen name="groups"       options={{ headerShown: false }} />
        <Stack.Screen name="communities"  options={{ headerShown: false }} /> 
        <Stack.Screen name="mypage"       options={{ headerShown: false }} /> 
        <Stack.Screen name="members"      options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <CustomDialog
        visible={mainData.isErrorDialogVisible}
        title="연결 실패"
        content="메인 정보를 불러오지 못했어요."
        cancelLabel="다시 시도"
        confirmLabel="앱 재시작"
        onCancel={mainData.handleRetryMainEntry}
        onConfirm={mainData.handleRestartApp}
      />
    </>
  );
}

const styles = StyleSheet.create({
  toastContainer: { 
    backgroundColor : COLOR.APP_MAIN, 
    padding         : 16, 
    borderRadius    : 16,
  },
  toastText: {
    color           : 'white',
    fontSize        : 16, 
    fontWeight      : 'bold',
  },
  splashContainer: {
    flex            : 1,
    justifyContent  : 'center',
    alignItems      : 'center',
    backgroundColor : COLOR.COMM_WHITE,
  },
  splashImage: {
    width           : '110%',
    height          : '110%',
  },  
});