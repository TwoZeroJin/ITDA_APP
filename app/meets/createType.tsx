import { COLOR, COMM_CONSTANTS } from "@/constants";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router } from "expo-router";
import IconSocial from '@/assets/images/icon_social.svg';
import IconClub from '@/assets/images/icon_club.svg';

/**
 * 모임 생성 - 모임 유형 세부 선택 화면(소셜링 - 일반, 클럽 - 일반/클럽 클래스 - 일반)
 */
export default function MeetCreateTypeScreen() {
  const [meetType, setMeetType] = useState<string | null>(null);

  const MEET_TYPE_OPTIONS = [
    {
      value       : COMM_CONSTANTS.MEET_TYPE_NORMAL,
      title       : '일반 소셜링',
      description : '일회성 모임으로 번개처럼 가볍게 만나봐요.',
      Icon        : IconSocial,
      color       : COLOR.COLOR_SOCIAL,
    },
    {
      value       : COMM_CONSTANTS.MEET_TYPE_GROUP,
      title       : '클럽 소셜링',
      description : '정기적으로 만나면서 관계를 함께 만들어가요.',
      Icon        : IconClub,
      color       : COLOR.COLOR_CLUB,
    },
  ];

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'어떤 소셜링을 열어볼까요?'}</Text>
          <Text style={styles.subtitle}>{'소셜링은 번개처럼 원데이로 만나는 자유로운 활동입니다.\n장기간 함께하는 활동은 \'클럽\'으로 개설해 주세요.'}</Text>
        </View>

        <View style={styles.meetTypeContainer}>
          {MEET_TYPE_OPTIONS.map(({ value, title, description, Icon, color }) => (
            <TouchableOpacity
              key={value}
              style={[styles.meetContainer, meetType === value && styles.meetSelected]}
              activeOpacity={0.6}
              onPress={() => setMeetType(value)}>
              <Icon width={20} color={meetType !== value ? color : COLOR.COMM_WHITE} />
              <View style={styles.meetTypeSubContainer}>
                <Text style={[styles.meetTypeTitle, meetType === value && styles.meetSelectedText]}>{title}</Text>
                <Text style={[styles.meetTypeDesc, meetType === value && styles.meetSelectedText]}>{description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <CommBottomButton label="다음" onPress={() => meetType && router.navigate({
            pathname: '/meets/createDetail',
            params: {
              meet_type : meetType
            },
          })}
          disabled={!meetType}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex              : 1,
  },
  titleContainer: {
    marginTop         : 12,
    marginBottom      : 30,
    paddingStart      : 16,
  },
  title: {
    fontSize          : 22,
    fontWeight        : 'bold',
    color             : COLOR.COMM_BLACK,
    marginBottom      : 16,
  },
  subtitle: {
    fontSize          : 16,
    color             : COLOR.COMM_GRAY_2,
  },
  meetTypeContainer: {
    marginHorizontal  : 16,
    marginBottom      : 24,
    gap               : 16,
  },
  meetTypeSubContainer: {
    marginStart       : 6,
  },
  meetContainer: {
    flexDirection     : 'row',
    alignItems        : 'center',
    borderColor       : COLOR.COMM_GRAY_6,
    borderRadius      : 8,
    borderWidth       : 1,
    paddingStart      : 28,
    paddingVertical   : 16,
    gap               : 12,
  },
  meetTypeTitle: {
    fontSize          : 16,
    fontWeight        : 'bold', 
    marginBottom      : 8,
  },
  meetTypeDesc: {
    fontSize          : 14,
    color             : COLOR.COMM_GRAY_2,
  },
  meetSelected: {
    borderColor       : COLOR.APP_MAIN,
    borderWidth       : 1,
    backgroundColor   : COLOR.APP_ACTIVE_4,
  },
  meetSelectedText: {
    color             : COLOR.COMM_WHITE,
  },
});