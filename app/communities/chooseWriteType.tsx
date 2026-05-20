import React, { ReactNode, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import IconFeed from '@/assets/images/navi_community.svg';
import IconClub from '@/assets/images/icon_club.svg';

import { COLOR, COMM_CONSTANTS } from '@/constants';
import CommBottomButton from '@/components/comm/CommBottomButton';
import CommHeader from '@/components/comm/CommHeader';
import { SvgProps } from 'react-native-svg';

type OptionKey = 'feed' | 'review';

const OPTIONS: { key: OptionKey; title: string; desc: string; icon: React.FC<SvgProps> }[] = [
  {
    key: 'feed',
    title: '피드 작성',
    desc: '잇다 멤버들에게 커뮤니티에 공개할 글을 작성해요.',
    icon: IconFeed,
  },
  {
    key: 'review',
    title: '모임 후기',
    desc: '잇다에서 참여한 모임 후기를 작성해요.',
    icon: IconClub,
  },
];

export default function chooseWriteType() {
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const router = useRouter();

  const onNext = () => {
    if (!selected) return;
    // 1. 선택된 옵션이 '피드 작성'('feed')인 경우 이동 로직 추가
    if (selected === 'feed') {
      // 파일 구조가 app/community/writeFeedback.tsx 인 경우 아래와 같이 경로를 지정합니다.
      // 실제 프로젝트의 폴더 경로에 맞춰 수정해 주세요.
      router.navigate('/communities/writeFeedback'); 
    } else if (selected === 'review') {
      // 모임 후기 클릭 시 이동할 경로가 있다면 여기에 추가
      router.navigate('/communities/chooseMeet'); 
    }    
  };


  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="커뮤니티 작성"/>
        <View style={styles.meetTypeContainer}>
           {OPTIONS.map(opt => {
             const active = selected === opt.key;
             return (
              <TouchableOpacity style={[styles.meetContainer, active && styles.meetSelected]}
                key={opt.key}
                onPress={() => setSelected(opt.key)}
                activeOpacity={0.85}>
                  <View style={[styles.iconBox]}><opt.icon width={20} color={active ? COLOR.COMM_WHITE : COLOR.COMM_GRAY_7}/></View>
                <View style={styles.meetTypeSubContainer}>
                  <Text style={[styles.meetTypeTitle, active && styles.meetSelectedText]}>{opt.title}</Text>
                  <Text style={[styles.meetTypeDesc, active && styles.meetSelectedText]}>{opt.desc}</Text>
                </View>
              </TouchableOpacity >
              
             );
           })}
        </View>
      <CommBottomButton label="다음" onPress={() => onNext()}
        disabled={!selected}/>        
    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLOR.COMM_WHITE,
  },
  meetTypeContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 24,
    gap: 16,
  },
  meetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLOR.COMM_GRAY_6,
    borderRadius: 8,
    borderWidth: 1,
    paddingStart: 18,
    paddingVertical: 16,
    gap: 6,
  },
  meetSelected: {
    borderColor: COLOR.APP_MAIN,
    borderWidth: 1,
    backgroundColor: COLOR.APP_ACTIVE_4,
  },
  meetSelectedText: {
    color: COLOR.COMM_WHITE,
  },
  meetTypeSubContainer: {
    marginStart: 0,
  },
  meetTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold', 
    marginBottom: 8,
  },
  meetTypeDesc: {
    fontSize: 13,
    color: COLOR.COMM_GRAY_2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
//    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});