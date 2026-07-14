import { COLOR } from '@/constants';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import IconCreate from '@/assets/images/icon_create.svg';
import { useAuthRouter } from '@/components/comm/AuthRoute';

/**
 * 소셜링/클럽 생성 버튼 컴포넌트
 */
export default function CommFloatingButton() {
  const router = useAuthRouter();
  return (
    <TouchableOpacity
      style={styles.floatingButton}
      activeOpacity={0.6}
      onPress={() => router.navigate('/meets/create')}
    >
      <IconCreate width={54} height={54} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position        : 'absolute',
    width           : 40,
    height          : 40,
    borderRadius    : 55,
    backgroundColor : COLOR.APP_ACTIVE_2,
    justifyContent  : 'center',
    alignItems      : 'center',
    elevation       : 6,
    shadowColor     : COLOR.COMM_BLACK,
    shadowOpacity   : 0.2,
    shadowOffset    : { width: 0, height: 4 },
    shadowRadius    : 6,
    zIndex          : 999,
    bottom          : 30,
    right           : 16,
  },
});
