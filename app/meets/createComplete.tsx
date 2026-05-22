import { COLOR, COMM_STYLES } from "@/constants";
import React from "react";
import { StyleSheet, View, Text } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import IconSocialCompl from '@/assets/images/icon_social_compl.svg';
import IconClubCompl from '@/assets/images/icon_club_compl.svg';

/**
 * 모임 생성 - 완료 화면
 */
export default function MeetCreateCompleteScreen() {
  const { meet_type } = useLocalSearchParams();
  const handleComplete = () => {
    router.dismissAll();
    router.replace('/');
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} isBack={false} title="모임 생성"/>

      <View style={{ flex: 1, marginTop: 120, alignItems: 'center' }}>
        {meet_type === 'N' ? (
          <IconSocialCompl width={120} height={120} />
        ) : (
          <IconClubCompl width={120} height={120} />
        )}
        <Text style={styles.titleText}>
          {meet_type === 'N' ? '소셜링이 오픈 되었어요!' : '클럽 소셜링이 오픈 되었어요!'}
        </Text>
        <Text style={styles.descText}>
          {`개설한 소셜링이 오픈되었어요.\n멤버 모집을 위해 소셜링을 홍보해보세요.`}
        </Text>
      </View>
      <CommBottomButton label="완료" onPress={handleComplete}/>
    </View>
  );
}

const styles = StyleSheet.create({
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