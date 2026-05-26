import { COMM_STYLES } from "@/constants";
import React from "react";
import { View, Text } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import IconClubCompl from '@/assets/images/icon_club_compl.svg';

/**
 * 클럽 생성 - 완료 화면
 */
export default function GroupCreateCompleteScreen() {
  const { group_id } = useLocalSearchParams();
  const handleComplete = () => {
    router.dismissAll();
    router.replace('/');
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} isBack={false} title={group_id ? '클럽 수정' : '클럽 생성'}/>

      <View style={{ flex: 1, marginTop: 120, alignItems: 'center' }}>
          <IconClubCompl width={120} height={120} />
        <Text style={COMM_STYLES.completeTitleText}>
          클럽 소셜링이 {group_id ? '수정' : '오픈'} 되었어요!
        </Text>
        <Text style={COMM_STYLES.completeDescText}>
          {`개설한 클럽이 ${group_id ? '수정' : '오픈'}되었어요.\n멤버 모집을 위해 클럽을 홍보해보세요.`}
        </Text>
      </View>
      <CommBottomButton label="완료" onPress={handleComplete}/>
    </View>
  );
}