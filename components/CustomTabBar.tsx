import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'

const { width } = Dimensions.get('window')

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel ?? route.name
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        // 중앙 버튼 (+)
        if (index === 2) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.plusButtonWrapper}
              activeOpacity={0.8}
            >
              <View style={styles.plusButton}>
                <Text style={styles.plusText}>＋</Text>
              </View>
            </TouchableOpacity>
          )
        }

        // 일반 버튼
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Text style={{ color: isFocused ? '#FF6C5C' : '#666' }}>
              {getLabelText(route.name)}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const getLabelText = (name: string) => {
  switch (name) {
    case 'index':
      return '메인'
    case 'board':
      return '게시판'
    case 'chat':
      return '채팅'
    case 'mypage':
      return '마이페이지'
    default:
      return name
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  plusButtonWrapper: {
    position: 'absolute',
    top: -30,
    left: width / 2 - 30,
    zIndex: 10,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6C5C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  plusText: {
    fontSize: 30,
    color: '#fff',
  },
})

export default CustomTabBar