import { COLOR } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";

export default function MeetCreateScreen() {

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성2"/>
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'잇다에서 함께 이어갈 모임을\n만들어주세요.'}</Text>
          <Text style={styles.subtitle}>어떤 유형의 모임인지 선택해주세요.</Text>
        </View>

        <CommBottomButton label="다음" onPress={() => router.navigate('/user/signupInterest')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.COMM_WHITE,
  },
  titleContainer: {
    marginTop: 12,
    marginBottom: 20,
    paddingStart: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLOR.COMM_GRAY_2,
  },
  buttonContainer: {
    marginHorizontal    : 16,
    marginBottom    : 16,
  },
});