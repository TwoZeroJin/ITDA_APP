import { COLOR } from "@/constants";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import IconSocial from '@/assets/images/icon_social.svg';
import IconClub from '@/assets/images/icon_club.svg';
import IconClass from '@/assets/images/icon_class.svg';

export default function MeetCreateTypeScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'잇다에서 함께 이어갈 모임을\n만들어주세요.'}</Text>
          <Text style={styles.subtitle}>어떤 유형의 모임인지 선택해주세요.</Text>
        </View>

        <View style={styles.meetTypeContainer}>
          <TouchableOpacity style={[styles.meetContainer, selectedType === 'social' && styles.meetSelected]}
            onPress={() => setSelectedType('social')}>
            <IconSocial width={20} color={selectedType !== 'social' ? COLOR.COLOR_SOCIAL : COLOR.COMM_WHITE} />
            <View style={styles.meetTypeSubContainer}>
              <Text style={[styles.meetTypeTitle, selectedType === 'social' && styles.meetSelectedText]}>소셜링</Text>
              <Text style={[styles.meetTypeDesc, selectedType === 'social' && styles.meetSelectedText]}>일회성 모임으로 번개처럼 가볍게 만나봐요.</Text>
            </View>
          </TouchableOpacity >
          <TouchableOpacity style={[styles.meetContainer, selectedType === 'club' && styles.meetSelected]}
            onPress={() => setSelectedType('club')}>
            <IconClub width={20} color={selectedType !== 'club' ? COLOR.COLOR_CLUB : COLOR.COMM_WHITE} />
            <View style={styles.meetTypeSubContainer}>
              <Text style={[styles.meetTypeTitle, selectedType === 'club' && styles.meetSelectedText]}>클럽</Text>
              <Text style={[styles.meetTypeDesc, selectedType === 'club' && styles.meetSelectedText]}>정기적으로 만나면서 관계를 함께 만들어가요.</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.meetContainer, selectedType === 'class' && styles.meetSelected]}
            onPress={() => setSelectedType('class')}>
            <IconClass width={20} color={selectedType !== 'class' ? COLOR.COLOR_CLASS : COLOR.COMM_WHITE} />
            <View style={styles.meetTypeSubContainer}>
              <Text style={[styles.meetTypeTitle, selectedType === 'class' && styles.meetSelectedText]}>클래스</Text>
              <Text style={[styles.meetTypeDesc, selectedType === 'class' && styles.meetSelectedText]}>클래스를 열고, 함께 배우는 경험을 나눠보세요.</Text>
            </View>
          </TouchableOpacity>
        </View>

        <CommBottomButton label="다음" onPress={() => router.navigate('/meets/createSubType')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginTop: 12,
    marginBottom: 30,
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
  meetTypeContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 16,
  },
  meetTypeSubContainer: {
    marginStart: 6,
  },
  meetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLOR.COMM_GRAY_6,
    borderRadius: 8,
    borderWidth: 1,
    paddingStart: 28,
    paddingVertical: 16,
    gap: 12,
  },
  meetTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold', 
    marginBottom: 8,
  },
  meetTypeDesc: {
    fontSize: 14,
    color: COLOR.COMM_GRAY_2,
  },
  meetSelected: {
    borderColor: COLOR.APP_MAIN,
    borderWidth: 1,
    backgroundColor: COLOR.APP_ACTIVE_4,
  },
  meetSelectedText: {
    color: COLOR.COMM_WHITE,
  },
});