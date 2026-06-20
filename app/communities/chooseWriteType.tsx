import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import IconFeed from '@/assets/images/navi_community.svg';
import IconClub from '@/assets/images/icon_club.svg';
import { COLOR, COMM_STYLES } from '@/constants';
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
    if (selected === 'feed') {
      router.navigate('/communities/writeFeedback'); 
    } else if (selected === 'review') {
      router.navigate('/communities/chooseMeet'); 
    }    
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="커뮤니티 작성"/>
      <View style={[COMM_STYLES.typeContainer, { marginTop: 26 }]}>
          {OPTIONS.map(opt => {
            const active = selected === opt.key;
            return (
            <TouchableOpacity 
              style={[styles.meetContainer, active && styles.meetSelected]}
              key={opt.key}
              onPress={() => setSelected(opt.key)}
              activeOpacity={0.6}
            >
              <View style={[styles.iconBox]}>
                <opt.icon width={20} color={active ? COLOR.COMM_WHITE : COLOR.COMM_GRAY_7}/>
              </View>
              <View style={styles.meetTypeSubContainer}>
                <Text style={[styles.meetTypeTitle, active && styles.meetSelectedText]}>{opt.title}</Text>
                <Text style={[styles.meetTypeDesc, active && styles.meetSelectedText]}>{opt.desc}</Text>
              </View>
            </TouchableOpacity >
            );
          })}
      </View>
      <CommBottomButton 
        label="다음" 
        onPress={onNext}
        disabled={!selected}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  meetContainer : {
    flexDirection       : 'row',
    alignItems          : 'center',
    borderColor         : COLOR.COMM_GRAY_6,
    borderRadius        : 8,
    borderWidth         : 1,
    paddingStart        : 18,
    paddingVertical     : 16,
    gap                 : 6,
  },
  meetSelected: {
    borderColor         : COLOR.APP_MAIN,
    borderWidth         : 1,
    backgroundColor     : COLOR.APP_ACTIVE_4,
  },
  meetSelectedText: {
    color               : COLOR.COMM_WHITE,
  },
  meetTypeSubContainer: {
    marginStart         : 0,
  },
  meetTypeTitle: {
    fontSize            : 16,
    fontWeight          : 'bold', 
    marginBottom        : 8,
  },
  meetTypeDesc: {
    fontSize            : 13,
    color               : COLOR.COMM_GRAY_2,
  },
  iconBox: {
    width               : 44,
    height              : 44,
    borderRadius        : 8,
    justifyContent      : 'center',
    alignItems          : 'center',
    marginRight         : 12,
  },
});