import queryClient from '@/api/queryClient';
import AuthRoute from '@/components/AuthRoute';
import { COLOR } from '@/constants';
import useMainEntry from '@/hooks/queries/useMain';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

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
  const [loadedFonts] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if(loadedFonts) {
    }
  }, [loadedFonts]);

  if (!loadedFonts) {
    return null; 
  }
  
  return (
    <ActionSheetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthRoute>
          <RootNavigator />
          <Toast config={{
            customToast: ({text1, text2}) => (
              <View style={[styles.container, { marginTop: insets.top}]}>
                <Text style={{ fontSize: 18, color: 'white' }}>{text1}</Text>
                {text2 && <Text style={{ color: 'white' }}>{text2}</Text>}
              </View>
            ),
          }}/>
        </AuthRoute>
      </QueryClientProvider>
    </ActionSheetProvider>
  );
}

function RootNavigator() {
  // API 처리 작업

  // 1. Main Data 처리
  // 2. 자동 로그인 처리
  const mainData = useMainEntry();

  if (mainData.data?.ret_code == 200) {
    SplashScreen.hideAsync();
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)"   options={{ headerShown: false }} />
      <Stack.Screen name="user"     options={{ headerShown: false }} />
      {/* <Stack.Screen name="group"    options={{ headerShown: false }} />
      <Stack.Screen name="meet"     options={{ headerShown: false }} />
      <Stack.Screen name="review"   options={{ headerShown: false }} /> */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor : COLOR.APP_MAIN, 
    padding         : 16, 
    borderRadius    : 16,
  },
  toast_text: {
    color       : 'white',
    fontSize    : 16, 
    fontWeight  : 'bold',
  }
});