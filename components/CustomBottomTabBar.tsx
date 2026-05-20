import Chat from '@/assets/images/navi_chat.svg';
import Community from '@/assets/images/navi_community.svg';
import Main from '@/assets/images/navi_main.svg';
import Meet from '@/assets/images/navi_meet.svg';
import My from '@/assets/images/navi_my.svg';
import { COLOR } from '@/constants';
import { useAuthRouter } from '@/components/AuthRoute';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 탭 이름 → 경로 매핑 (EXCLUDE_PATHS 기준으로 protected 여부 판단)
const TAB_PATHS: Record<string, string> = {
  index     : '/',
  community : '/community',
  meet      : '/meet',
  chat      : '/chat',
  my        : '/my',
};

/**
 * 
 * @param param
 * @returns 공통 바텀 고정 컴포넌트
 */
function CustomBottomTabBar({state, descriptors, navigation}: BottomTabBarProps)  {
  const { checkAndNavigate } = useAuthRouter();
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index
        const name = route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!isFocused && !event.defaultPrevented) {
            checkAndNavigate(() => navigation.navigate(name), TAB_PATHS[name] ?? `/${name}`);
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              {getIcon(name, isFocused)}
              <Text style={[styles.tabButtonText, { color: isFocused ? COLOR.APP_MAIN : COLOR.TEXT_DEFAULT }]}>
                {options.title}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const getIcon = (name: string, isFocused: boolean) => {
  switch (name) {
    case 'index':
      return <Main color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW} />;
    case 'community':
      return <Community color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW} />;
    case 'meet':
      return <Meet color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW}/>;
    case 'chat':
      return <Chat color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW} />;
    case 'my':
      return <My color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW} />;
    default:
      return <></>;
  }
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection     : 'row',
    justifyContent    : 'space-between',
    alignItems        : 'center',
    height            : 60,
    paddingHorizontal : 10,
    elevation         : 10,
    shadowOffset      : { width: 0, height: -12 },
    shadowOpacity     : 0.2,
    shadowRadius      : 6,
    backgroundColor   : COLOR.COMM_WHITE,
    shadowColor       : COLOR.COMM_SHADOW,
  },
  iconContainer : {
    alignItems    : 'center',
  },
  tabButton: {
    flex        : 1,
  },
  tabButtonText: {
    marginTop   : 6,
  },
  plusButtonWrapper: {
    top     : -9,
    zIndex  : 10,
  },
})

export default CustomBottomTabBar;