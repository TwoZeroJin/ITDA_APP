import Chat from '@/assets/images/navi_chat.svg';
import Community from '@/assets/images/navi_community.svg';
import Main from '@/assets/images/navi_main.svg';
import Meet from '@/assets/images/navi_meet.svg';
import My from '@/assets/images/navi_my.svg';
import { COLOR } from '@/constants';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function CustomTabBar({state, descriptors, navigation}: BottomTabBarProps)  {
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
            navigation.navigate(name);
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
              {getIcon(name)}
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

const getIcon = (name: string) => {
  switch (name) {
    case 'index':
      return <Main/>;
    case 'community':
      return <Community/>;
    case 'meet':
      return <Meet/>;
    case 'chat':
      return <Chat/>;
    case 'my':
      return <My/>;
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
    gap: 6
  },
  tabButton: {
    flex        : 1,
    alignItems  : 'center',
  },
  tabButtonText: {
    //
  },
  plusButtonWrapper: {
    top     : -9,
    zIndex  : 10,
  },
})

export default CustomTabBar