import queryClient from '@/api/queryClient';
import useNotificationObserver from '@/hooks/useNotificationObserver';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Notifications from "expo-notifications";
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

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
  const [loaded] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

useEffect(() => {
    if(loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; 
  }
  
  return (
    
    <ActionSheetProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
        <Toast />
      </QueryClientProvider>
    </ActionSheetProvider>
  );
}

function RootNavigator() {
  // const { auth } = useAuth();
  useNotificationObserver();
  
  // useEffect(() => {
  //   auth.id && Toast.show({
  //     type: 'success',
  //     text1: `${auth.nickname ?? "회원"}님 환영합니다.`,
  //     position: 'bottom'
  //   });
  // }, [auth.id]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}