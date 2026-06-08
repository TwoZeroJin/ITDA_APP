import { COLOR } from '@/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface TopTabItem {
  label: string;
  value: string;
}

interface TopTabButtonProps {
  tabs: TopTabItem[];
  activeValue: string;
  onTabPress: (value: string) => void;
  rightAction?: {
    element: React.ReactNode;
    onPress: () => void;
  };
}

export default function TopTabButton({ tabs, activeValue, onTabPress, rightAction }: TopTabButtonProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        {tabs.map((tab) => {
          const isActive = activeValue === tab.value;

          return (
            <TouchableOpacity
              key={tab.value}
              style={styles.tabButton}
              activeOpacity={0.6}
              onPress={() => onTabPress(tab.value)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label}
              </Text>
              {isActive && <View style={[styles.activeIndicator]} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {rightAction && (
        <TouchableOpacity
          style={[styles.rightAction]}
          activeOpacity={0.6}
          onPress={rightAction.onPress}
        >
          {rightAction.element}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor       : COLOR.COMM_WHITE,
    flexDirection         : 'row',
    alignItems            : 'flex-end',
    justifyContent        : 'space-between',
    borderBottomWidth     : 2,
    borderBottomColor     : COLOR.COLOR_D9D9D9,
  },
  tabsWrapper: {
    flexDirection         : 'row', 
    alignItems            : 'center',
    justifyContent        : 'flex-start', 
  },
  tabButton: {
    width                 : 100,
    alignItems            : 'center',
    paddingVertical       : 12,
  },
  tabText: {
    fontSize              : 20,
    fontFamily            : 'Pretendard-Bold',
    color                 : COLOR.COLOR_838383,
  },
  activeTabText: {
    color                 : COLOR.APP_ACTIVE_5, 
  },
  activeIndicator: {
    position              : 'absolute',
    width                 : '100%', 
    bottom                : -2, 
    height                : 2, 
    backgroundColor       : COLOR.APP_ACTIVE_5, 
  },
  rightAction: {
    paddingRight          : 16,
    paddingBottom         : 12,
  },
});
