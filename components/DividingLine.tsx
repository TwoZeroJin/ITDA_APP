import { COLOR } from '@/constants';
import React from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * 
 * @returns 공통 구분 라인선 컴포넌트
 */
function DividingLine() {
  return (
    <View style={styles.line} />
  )
}

const styles = StyleSheet.create({
    line: {
        height          : 8,
        backgroundColor : COLOR.COMM_GRAY_4
    },
});

export default DividingLine;