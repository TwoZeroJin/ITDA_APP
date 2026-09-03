import React, { useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { COLOR } from '@/constants';

/**
 * 카카오톡 공유 딥링크(kakaolink://) 수신 리다이렉트 핸들러
 */
export default function KakaoLinkRedirectScreen() {
  const params = useLocalSearchParams<{ groupId?: string; meetId?: string }>();

  useEffect(() => {
    const { groupId, meetId } = params;

    if (groupId) {
      router.replace({
        pathname: '/groups/detailView',
        params: { groupId },
      });
    } else if (meetId) {
      router.replace({
        pathname: '/meets/detailView',
        params: { meetId },
      });
    } else {
      router.replace('/');
    }
  }, [params]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLOR.COMM_WHITE }}>
      <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
    </View>
  );
}
