import { COLOR, COMM_CONSTANTS, COMM_STYLES } from "@/constants";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router } from "expo-router";
import IconSocial from '@/assets/images/icon_social.svg';
import IconClub from '@/assets/images/icon_club.svg';
import IconClass from '@/assets/images/icon_class.svg';

const MEET_OPTIONS = [
  {
    value       : COMM_CONSTANTS.MEET_SOCIAL,
    title       : '소셜링',
    description : '일회성 모임으로 번개처럼 가볍게 만나봐요.',
    color       : COLOR.COLOR_SOCIAL,
    Icon        : IconSocial,
  },
  {
    value       : COMM_CONSTANTS.MEET_CLUB,
    title       : '클럽',
    description : '정기적으로 만나면서 관계를 함께 만들어가요.',
    color       : COLOR.COLOR_CLUB,
    Icon        : IconClub,
  },
  // 클래스 주석
  // {
  //   value       : COMM_CONSTANTS.MEET_CLASS,
  //   title       : '클래스',
  //   description : '클래스를 열고, 함께 배우는 경험을 나눠보세요.',
  //   color       : COLOR.COLOR_CLASS,
  //   Icon        : IconClass,
  // },
];

/**
 * 모임 생성 - 모임 유형 선택 화면(소셜링/클럽/클래스)
 */
export default function MeetCreateScreen() {
  const [meet, setMeet] = useState<string | null>(null);

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
        {/* 소셜링 생성 타이틀 */}
        <View style={COMM_STYLES.titleContainer}>
          <Text style={styles.title}>{'잇다에서 함께 이어갈 모임을\n만들어주세요.'}</Text>
          <Text style={styles.subtitle}>어떤 유형의 모임인지 선택해주세요.</Text>
        </View>

        <View style={COMM_STYLES.typeContainer}>
          {MEET_OPTIONS.map(({ value, title, description, color, Icon }) => {
            const isSelected = meet === value;

            return (
              <TouchableOpacity
                key={value}
                style={[styles.meetContainer, isSelected && styles.meetSelected]}
                activeOpacity={0.6}
                onPress={() => setMeet(value)}
              >
                <Icon width={20} color={isSelected ? COLOR.COMM_WHITE : color} />
                <View style={styles.meetTypeSubContainer}>
                  <Text style={[styles.meetTypeTitle, isSelected && styles.meetSelectedText]}>{title}</Text>
                  <Text style={[styles.meetTypeDesc, isSelected && styles.meetSelectedText]}>{description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <CommBottomButton label="다음" onPress={() => meet && router.navigate(
            meet === COMM_CONSTANTS.MEET_CLUB ? '/groups/createDetail' : '/meets/createType',
          )}
          disabled={!meet}/>
    </View>
  );
}

const styles = StyleSheet.create({
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