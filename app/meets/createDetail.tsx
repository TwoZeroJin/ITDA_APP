import { COLOR, COMM_CONSTANTS } from "@/constants";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import IconApplyFirst from '@/assets/images/icon_apply_first.svg';
import IconApplyApprove from '@/assets/images/icon_apply_approve.svg';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import DividingLine from "@/components/DividingLine";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import GenderSlider from "@/components/GenderSlider";
import AgeSlider from "@/components/AgeSlider";
import { useRoute } from "@react-navigation/native";
import { MeetInfo } from "@/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/**
 * 모임 생성 - 신청방식, 참여인원, 성비, 나이 설정 화면
 */
export default function MeetCreateDetailScreen() {
  const [applyType, setApplyType] = useState<string | null>(null);
  const [minMemberCnt, setMinMemberCnt] = useState('2');
  const [maxMemberCnt, setMaxMemberCnt] = useState('99');
  const [genderType, setGenderType] = useState<'none' | 'set'>('set');
  const [genderRatio, setGenderRatio] = useState(0.5);
  const [ageType, setAgeType] = useState<'none' | 'set'>('set');
  const ageMin = 10;
  const [ageMax, setAgeMax] = useState(45);
  const params = useRoute();
  const prevMeetInfo = (params.params ?? {}) as MeetInfo;

  const onChangeMemberCnt = (value: string, isMin: boolean) => {
    const nextValue = value.replace(/[^0-9]/g, '').slice(0, 2);

    if (isMin) {
      setMinMemberCnt(nextValue);
      return;
    }

    setMaxMemberCnt(nextValue);
  };

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
      <KeyboardAwareScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        enableOnAndroid={true}
        extraScrollHeight={24}
      >
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'어떻게 모임원을 모을까요?'}</Text>
          <Text style={styles.subtitle}>{`${prevMeetInfo.meet_question === 'social' ? '일반 소셜링' : '클럽 소셜링'}을 선택했어요.\n모임에 맞는 모임원 구성을 정해주세요.`}</Text>
        </View>

        <DividingLine />
        
        {/* 신청방식 */}
        <View style={styles.commContainer}>
          <View>
            <Text style={styles.commContainerTitle}>신청방식</Text>
          </View>
          <TouchableOpacity style={[styles.applyContainer, applyType === COMM_CONSTANTS.MEET_APPLY_TYPE_FIRST && styles.applySelected]}
            onPress={() => setApplyType(COMM_CONSTANTS.MEET_APPLY_TYPE_FIRST)}>
            <IconApplyFirst width={20} color={applyType !== COMM_CONSTANTS.MEET_APPLY_TYPE_FIRST ? COLOR.COLOR_373737 : COLOR.APP_ACTIVE_5} />
            <View style={styles.meetTypeSubContainer}>
              <Text style={[styles.applyTypeTitle, applyType === COMM_CONSTANTS.MEET_APPLY_TYPE_FIRST && styles.applySelectedText]}>선착순</Text>
              <Text style={[styles.applyTypeDesc, applyType === COMM_CONSTANTS.MEET_APPLY_TYPE_FIRST && styles.applySelectedText]}>일회성 모임으로 번개처럼 가볍게 만나봐요.</Text>
            </View>
          </TouchableOpacity >

          <TouchableOpacity style={[styles.applyContainer, applyType === COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE && styles.applySelected]}
            onPress={() => setApplyType(COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE)}>
            <IconApplyApprove width={20} color={applyType !== COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE ? COLOR.COLOR_373737 : COLOR.APP_ACTIVE_5} />
            <View style={styles.meetTypeSubContainer}>
              <Text style={[styles.applyTypeTitle, applyType === COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE && styles.applySelectedText]}>승인제</Text>
              <Text style={[styles.applyTypeDesc, applyType === COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE && styles.applySelectedText]}>일회성 모임으로 번개처럼 가볍게 만나봐요.</Text>
            </View>
          </TouchableOpacity >

        </View>
        
        <DividingLine />

        {/* 참여 인원 */}
        <View style={styles.commContainer}>
          <View>
            <Text style={styles.commContainerTitle}>참여 인원(호스트 포함)</Text>
          </View>
          <View style={styles.memberTitleContainer}>
            <Text style={styles.memberTitle}>최소인원</Text>
            <Text style={styles.memberTitle}>최대인원</Text>
          </View>
          <View style={styles.memberInputRow}>
            <View style={styles.memberInputContainer}>
              <TextInput
                value={minMemberCnt}
                onChangeText={(text) => onChangeMemberCnt(text, true)}
                keyboardType="number-pad"
                maxLength={2}
                style={styles.memberInput}
              />
              <Text style={styles.memberSuffix}>명</Text>
            </View>
            <Text style={styles.memberRangeText}>~</Text>
            <View style={styles.memberInputContainer}>
              <TextInput
                value={maxMemberCnt}
                onChangeText={(text) => onChangeMemberCnt(text, false)}
                keyboardType="number-pad"
                maxLength={2}
                style={styles.memberInput}
              />
              <Text style={styles.memberSuffix}>명</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoTitleRow}>
              <IconInfoMark />
              <Text style={styles.infoTitle}>모임 설정시 참고해 주세요.</Text>
            </View>
            <Text style={styles.infoDesc}>· 실제 모임 진행에 필요한 최소 인원으로 설정해주세요.</Text>
            <Text style={styles.infoDesc}>· 모임 시간 1시간 전까지 최소 인원이 모집되지 않으면 모임이 자동으로 취소돼요.</Text>
          </View>
        </View>

        <DividingLine />

        {/* 성비 */}
        <View style={styles.commContainer}>
          <View>
            <Text style={styles.commContainerTitle}>성비</Text>
          </View>

          <CustomRadioGroup
            items={[
              { label: '성비 무관', value: 'none' },
              { label: '성비 지정', value: 'set' },
            ]}
            value={genderType}
            onChange={(value) => setGenderType(value as 'none' | 'set')}
          />

          <GenderSlider
            value={genderRatio}
            onChange={setGenderRatio}
            disabled={genderType === 'none'}
          />

          <View style={styles.infoContainer}>
            <View style={styles.infoTitleRow}>
              <IconInfoMark />
              <Text style={styles.infoTitle}>동그라미 바를 움직여 성비를 지정할 수 있어요.</Text>
            </View>
          </View>
        </View>

        <DividingLine />

        {/* 나이 */}
        <View style={styles.commContainer}>
          <View>
            <Text style={styles.commContainerTitle}>나이</Text>
          </View>

          <CustomRadioGroup
            items={[
              { label: '나이 무관', value: 'none' },
              { label: '나이 지정', value: 'set' },
            ]}
            value={ageType}
            onChange={(value) => setAgeType(value as 'none' | 'set')}
          />

          <AgeSlider
            value={ageMax}
            onChange={setAgeMax}
            disabled={ageType === 'none'}
          />

          <View style={styles.infoContainer}>
            <View style={styles.infoTitleRow}>
              <IconInfoMark />
              <Text style={styles.infoTitle}>동그라미 바를 움직여 나이를 지정할 수 있어요.</Text>
            </View>
          </View>
        </View>

        <DividingLine />

      </KeyboardAwareScrollView>

      <CommBottomButton label="다음" onPress={() => applyType && router.navigate({
            pathname: '/meets/createFee',
            params: {
              ...prevMeetInfo,
              meet_min    : Number(minMemberCnt),
              meet_max    : Number(maxMemberCnt),
              apply_type  : applyType,
              age_min     : ageMin,
              age_max     : ageMax,
              gender_ratio: genderRatio,
            },
          })}
          disabled={!prevMeetInfo.meet_type || !applyType}/>
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
  commContainerTitle: {
    fontSize: 20,
    fontWeight: 'bold', 
    marginBottom: 8,
  },
  commContainer: {
    marginTop: 30,
    marginHorizontal: 16,
    marginBottom: 30,
    gap: 16,
  },
  meetTypeSubContainer: {
    marginStart: 6,
  },
  applyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLOR.COMM_GRAY_6,
    borderRadius: 8,
    borderWidth: 1,
    paddingStart: 28,
    paddingVertical: 16,
    gap: 12,
  },
  applyTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold', 
    marginBottom: 8,
  },
  applyTypeDesc: {
    fontSize: 14,
    color: COLOR.COMM_GRAY_2,
  },
  applySelected: {
    borderColor: COLOR.APP_ACTIVE_5,
    borderWidth: 1,
  },
  applySelectedText: {
    color: COLOR.APP_ACTIVE_4,
  },
  memberTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  memberTitle: {
    flex: 1,
    fontSize: 14,
    color: COLOR.TEXT_DEFAULT,
    marginStart: 8,
  },
  memberInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberInputContainer: {
    flex: 1,
    height: 68,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    borderRadius: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInput: {
    flex: 1,
    fontSize: 16,
    color: COLOR.COLOR_323232,
    padding: 0,
  },
  memberSuffix: {
    fontSize: 14,
    color: COLOR.TEXT_DEFAULT,
    marginStart: 10,
  },
  memberRangeText: {
    fontSize: 16,
    color: COLOR.TEXT_DEFAULT,
  },
  infoContainer: {
    marginTop: 10,
    borderRadius: 12,
    borderColor: COLOR.COMM_GRAY_6,
    borderWidth: 1,
    backgroundColor: COLOR.COMM_GRAY_5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLOR.COLOR_323232,
  },
  infoDesc: {
    fontSize: 12,
    color: COLOR.TEXT_DEFAULT,
  },
});