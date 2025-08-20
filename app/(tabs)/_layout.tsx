import CustomTabBar from '@/components/CustomTabBar';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props}/>}
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          android: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
            title: '메인',
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
            title: '게시판',
        }}
      />
      <Tabs.Screen
        name="meet"
        options={{
            title: '소모임 만들기',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
            title: '채팅',
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
            title: '마이페이지',
        }}
      />
    </Tabs>
  );
}
