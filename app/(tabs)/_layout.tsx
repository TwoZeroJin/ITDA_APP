import CommBottomTabBar from '@/components/comm/CommBottomTabBar';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CommBottomTabBar {...props}/>}
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
        name="meet"
        options={{
            title: '소셜링',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
            title: '커뮤니티',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
            title: '홈',
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
