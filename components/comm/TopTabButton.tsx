import { COLOR, COMM_CONSTANTS } from '@/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface TopTabItem {
  label: string;
  value: string;
}

interface TopTabButtonProps {
  activeValue   : string;
  onTabPress    : (value: string) => void;
  rightAction? : {
    element: React.ReactNode;
    onPress: () => void;
  };
  isSocialTab? : boolean;
}

const TABS_SOCIAL: Array<{ label: string; value: string }> = [
  { label: '소셜링', value: COMM_CONSTANTS.COMM_MEET },
  { label: '클럽', value: COMM_CONSTANTS.COMM_GROUP },
  // { label: '클래스', value: 'class' },
];

const TABS_REVIEW: Array<{ label: string; value: string }> = [
  { label: '피드', value: 'latest' },
  { label: '모임 후기', value: 'review' },
  { label: '내가 쓴 글', value: 'mypost' },
];

export default function TopTabButton({ activeValue, onTabPress, rightAction, isSocialTab = true }: TopTabButtonProps) {
  const tabs = isSocialTab ? TABS_SOCIAL : TABS_REVIEW;

  return (
    <View style={styles.container}>
      <View style={[styles.tabsWrapper, isSocialTab && styles.socialTabsWrapper]}>
        {tabs.map((tab) => {
          const isActive = activeValue === tab.value;

          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.tabButton, isSocialTab && styles.socialTabButton]}
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
  socialTabsWrapper: {
    flex: 1,
  },
  tabButton: {
    width                 : 100,
    alignItems            : 'center',
    paddingVertical       : 12,
  },
  socialTabButton: {
    flex: 1,
    width: undefined,
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
