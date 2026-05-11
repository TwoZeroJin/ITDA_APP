import { COLOR } from "@/constants";
import React from "react";
import { StyleSheet, View, Text } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import IconClubCompl from '@/assets/images/icon_club_compl.svg';

/**
 * 클럽 생성 - 완료 화면
 */
export default function GroupCreateCompleteScreen() {
  const handleComplete = () => {
    router.dismissAll();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} isBack={false} title="클럽 생성"/>

      <View style={{ flex: 1, marginTop: 120, alignItems: 'center' }}>
          <IconClubCompl width={120} height={120} />
        <Text style={styles.titleText}>
          클럽 소셜링이 오픈 되었어요!
        </Text>
        <Text style={styles.descText}>
          {`개설한 클럽이 오픈되었어요.\n멤버 모집을 위해 클럽을 홍보해보세요.`}
        </Text>
      </View>
      <CommBottomButton label="완료" onPress={handleComplete}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex        : 1,
  },
  titleText: {
    fontSize    : 24,
    fontWeight  : 'bold',
    color       : COLOR.TEXT_1C1C1C,
    marginTop   : 30,
  },
  descText: {
    fontSize    : 16,
    marginTop   : 12,
    color       : COLOR.TEXT_DEFAULT,
  },
});