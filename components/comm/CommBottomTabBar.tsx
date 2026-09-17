import Chat from '@/assets/images/navi_chat.svg';
import Community from '@/assets/images/navi_community.svg';
import Main from '@/assets/images/navi_main.svg';
import Meet from '@/assets/images/navi_meet.svg';
import My from '@/assets/images/navi_my.svg';
import { COLOR, STORE_KEY } from '@/constants';
import { useAuthRouter } from '@/components/comm/AuthRoute';
import { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getAsyncStore, saveAsyncStore } from '@/utils/asyncStoreUtil';
import { MqttUtil } from '@/utils/mqttUtil';
import { getMemberInfo, parseChatPayload } from '@/utils/commUtil';

// 탭 이름 → 경로 매핑 (EXCLUDE_PATHS 기준으로 protected 여부 판단)
const TAB_PATHS: Record<string, string> = {
  index     : '/',
  community : '/community',
  meet      : '/meet',
  chat      : '/chat',
  my        : '/my',
};

/**
 * 
 * @param param
 * @returns 공통 바텀 고정 컴포넌트
 */
function CommBottomTabBar({state, descriptors, navigation}: BottomTabBarProps)  {
  const { checkAndNavigate } = useAuthRouter();
  const [isChatYn, setIsChatYn] = useState('N');

  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await getMemberInfo();
      if (memberInfo) {
        // 로그인한 경우 Topic 구독
        MqttUtil.subscribeTopicList(memberInfo.topic_list ?? [], 'CommBottomTabBar', (msg) => {
          const payload = parseChatPayload(msg);
          // sender_id가 본인이 아닐 경우에만 뱃지 ON
          if (memberInfo.mem_id !== Number(payload.sender_id)) {
            setIsChatYn('Y');
          }
          else {
            setIsChatYn('N');
          }
        });
        // 푸시 카운트 있을 경우 뱃지 ON
        const val = await getAsyncStore(STORE_KEY.PUSH_COUNT);
        if (val && Number(val) > 0) {
          setIsChatYn('Y');
        }
        else {
          setIsChatYn('N');
        }
      }
      else {
        MqttUtil.unsubscribeAll('CommBottomTabBar');
      }

    }
    fetchMyMemberInfo();

    return () => {
      MqttUtil.unsubscribeAll('CommBottomTabBar');
    };
  }, []);

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index
        const name = route.name;

        const onPress = () => {
          if (name === 'chat') {
            saveAsyncStore(STORE_KEY.CHAT_BADGE, 'N').then(() => {
              setIsChatYn('N');
            });
          }
          Haptics.selectionAsync();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!isFocused && !event.defaultPrevented) {
            checkAndNavigate(() => navigation.navigate(name), TAB_PATHS[name] ?? `/${name}`);
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.iconContainer}>
              {getIcon(name, isFocused, isChatYn)}
              <Text style={[styles.tabButtonText, { color: isFocused ? COLOR.APP_MAIN : COLOR.TEXT_DEFAULT }]}>
                {options.title}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const getIcon = (name: string, isFocused: boolean, isChatYn: string) => {
  switch (name) {
    case 'index':
      return <Main color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW} />;
    case 'community':
      return <Community color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW} />;
    case 'meet':
      return <Meet color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW}/>;
    case 'chat':
      return (
        <View style={{ position: 'relative' }}>
          <Chat color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW} />
          {isChatYn === 'Y' && (
            <View style={{
              position: 'absolute',
              top: -4,
              right: 0,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLOR.APP_MAIN,
            }} />
          )}
        </View>
      );
    case 'my':
      return <My color={isFocused ? COLOR.APP_ACTIVE_3 : COLOR.COMM_SHADOW} />;
    default:
      return <></>;
  }
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection     : 'row',
    justifyContent    : 'space-between',
    alignItems        : 'center',
    height            : 60,
    paddingHorizontal : 10,
    backgroundColor   : COLOR.COMM_WHITE,
    shadowOffset      : { width: 0, height: -6 },
    shadowOpacity     : 0.1,
    shadowRadius      : 6,
    shadowColor       : COLOR.COMM_SHADOW,
    elevation         : 10,
  },
  iconContainer : {
    alignItems        : 'center',
  },
  tabButton: {
    flex              : 1,
  },
  tabButtonText: {
    marginTop         : 6,
  },
})

export default CommBottomTabBar;