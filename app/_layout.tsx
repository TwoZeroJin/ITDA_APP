import queryClient from '@/api/queryClient';
import AuthRoute from '@/components/AuthRoute';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { COLOR } from '@/constants';
import { useAutoLogin } from '@/hooks/queries/useAuth';
import useMainEntry from '@/hooks/queries/useMain';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import LoadingLayout from '@/components/LoadingLayout';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     // shouldPlaySound: true,
//     // shouldSetBadge: true,
//     // shouldShowAlert: true,
//     // shouldShowBanner: true,
//     // shouldShowList: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [loadedFonts] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
          source={require('../assets/images/splash_screen.png')}
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
              <SafeAreaView style={styles.container}>
                <RootNavigator />
              </SafeAreaView>
              <LoadingLayout/>
              <Toast config={{
                customToast: ({text1, text2}) => (
                  <View style={[styles.toastContainer, { marginTop: insets.top}]}>
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

  // console.log('autoLogin : ', autoLogin)


  return (
      <Stack>
        <Stack.Screen name="(tabs)"   options={{ headerShown: false }} />         
        <Stack.Screen name="user"     options={{ headerShown: false }} />
        <Stack.Screen name="chats"    options={{ headerShown: false }} />
        {/* <Stack.Screen name="group"    options={{ headerShown: false }} />
        <Stack.Screen name="meet"     options={{ headerShown: false }} />
        <Stack.Screen name="review"   options={{ headerShown: false }} /> */}
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.COMM_WHITE,
  },
  toastContainer: { 
    backgroundColor : COLOR.APP_MAIN, 
    padding         : 16, 
    borderRadius    : 16,
  },
  toastText: {
    color       : 'white',
    fontSize    : 16, 
    fontWeight  : 'bold',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  splashImage: {
    width: '110%',
    height: '110%',
  },  
});