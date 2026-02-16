import { COLOR } from "@/constants";
import React, { useState } from "react";
import { LayoutChangeEvent, PanResponder, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import IconApplyFirst from '@/assets/images/icon_apply_first.svg';
import IconApplyApprove from '@/assets/images/icon_apply_approve.svg';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import { useRoute } from "@react-navigation/native";
import DividingLine from "@/components/DividingLine";
import CustomRadioGroup from "@/components/CustomRadioGroup";

export default function MeetCreateDetailScreen() {
  const [applyType, setApplyType] = useState<string | null>(null);
  const [minMemberCnt, setMinMemberCnt] = useState('2');
  const [maxMemberCnt, setMaxMemberCnt] = useState('99');
  const [genderType, setGenderType] = useState<'none' | 'set'>('set');
  const [genderRatio, setGenderRatio] = useState(5);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [ageType, setAgeType] = useState<'none' | 'set'>('set');
  const [ageMin, setAgeMin] = useState(10);
  const [ageMax, setAgeMax] = useState(45);
  const [ageSliderWidth, setAgeSliderWidth] = useState(0);
  const params = useRoute();
  const { meetType, meetSubType } = (params.params ?? {}) as { meetType?: string, meetSubType?: string };

  const onChangeMemberCnt = (value: string, isMin: boolean) => {
    const nextValue = value.replace(/[^0-9]/g, '').slice(0, 2);

    if (isMin) {
      setMinMemberCnt(nextValue);
      return;
    }

    setMaxMemberCnt(nextValue);
  };

  const onSliderLayout = (event: LayoutChangeEvent) => {
    setSliderWidth(event.nativeEvent.layout.width);
  };

  const onChangeGenderRatio = (locationX: number) => {
    if (sliderWidth <= 0) {
      return;
    }

    const clampedX = Math.max(0, Math.min(locationX, sliderWidth));
    const ratio = Math.round((clampedX / sliderWidth) * 10);
    console.log('Calculated ratio:', ratio);
    setGenderRatio(ratio);
  };

  const onAgeSliderLayout = (event: LayoutChangeEvent) => {
    setAgeSliderWidth(event.nativeEvent.layout.width);
  };

  const onChangeAgeMax = (locationX: number) => {
    if (ageSliderWidth <= 0) {
      return;
    }

    const clampedX = Math.max(0, Math.min(locationX, ageSliderWidth));
    const nextAge = Math.round((clampedX / ageSliderWidth) * 8) * 5 + 10;
    setAgeMax(Math.max(10, Math.min(nextAge, 50)));
  };

  const sliderPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => genderType === 'set',
    onMoveShouldSetPanResponder: () => genderType === 'set',
    onPanResponderGrant: (event) => onChangeGenderRatio(event.nativeEvent.locationX),
    onPanResponderMove: (event) => onChangeGenderRatio(event.nativeEvent.locationX),
  });

  const ageSliderPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => ageType === 'set',
    onMoveShouldSetPanResponder: () => ageType === 'set',
    onPanResponderGrant: (event) => onChangeAgeMax(event.nativeEvent.locationX),
    onPanResponderMove: (event) => onChangeAgeMax(event.nativeEvent.locationX),
  });

  const femaleRatio = genderRatio;
  const maleRatio = 10 - genderRatio;
  const thumbLeftPercent = sliderWidth > 0 ? (genderRatio / 10) * 100 : 50;
  const ageThumbLeftPercent = ageSliderWidth > 0 ? ((ageMax - 10) / 40) * 100 : 87.5;
  const ageValues = [10, 15, 20, 25, 30, 35, 40, 45, 50];

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'어떻게 모임원을 모을까요?'}</Text>
          <Text style={styles.subtitle}>{`${meetSubType === 'social' ? '일반 소셜링' : '클럽 소셜링'}을 선택했어요.\n모임에 맞는 모임원 구성을 정해주세요.`}</Text>
        </View>

        <DividingLine />
        
        {/* 신청방식 */}
        <View style={styles.commContainer}>
          <View>
            <Text style={styles.commContainerTitle}>신청방식</Text>
          </View>
          <TouchableOpacity style={[styles.applyContainer, applyType === 'F' && styles.applySelected]}
            onPress={() => setApplyType('F')}>
            <IconApplyFirst width={20} color={applyType !== 'F' ? COLOR.COLOR_373737 : COLOR.APP_ACTIVE_5} />
            <View style={styles.meetTypeSubContainer}>
              <Text style={[styles.applyTypeTitle, applyType === 'F' && styles.applySelectedText]}>선착순</Text>
              <Text style={[styles.applyTypeDesc, applyType === 'F' && styles.applySelectedText]}>일회성 모임으로 번개처럼 가볍게 만나봐요.</Text>
            </View>
          </TouchableOpacity >

          <TouchableOpacity style={[styles.applyContainer, applyType === 'A' && styles.applySelected]}
            onPress={() => setApplyType('A')}>
            <IconApplyApprove width={20} color={applyType !== 'A' ? COLOR.COLOR_373737 : COLOR.APP_ACTIVE_5} />
            <View style={styles.meetTypeSubContainer}>
              <Text style={[styles.applyTypeTitle, applyType === 'A' && styles.applySelectedText]}>승인제</Text>
              <Text style={[styles.applyTypeDesc, applyType === 'A' && styles.applySelectedText]}>일회성 모임으로 번개처럼 가볍게 만나봐요.</Text>
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

          <View style={[styles.sliderContainer, genderType === 'none' && styles.sliderDisabled]}>
            <View style={[styles.genderRatioBadge, { left: `${thumbLeftPercent}%` }]}>
              <Text style={styles.genderRatioBadgeText}>{`${femaleRatio}:${maleRatio}`}</Text>
            </View>

            <View style={styles.genderLabelRow}>
              <Text style={styles.genderLabelText}>여성</Text>
              <Text style={styles.genderLabelText}>남성</Text>
            </View>

            <View
              style={styles.genderTrackArea}
              onLayout={onSliderLayout}
              {...sliderPanResponder.panHandlers}
            >
              <View style={styles.genderTrackBase} />
              <View style={[styles.genderTrackLeft, { width: `${thumbLeftPercent}%` }]} />
              <View style={[styles.genderTrackRight, { left: `${thumbLeftPercent}%`, width: `${100 - thumbLeftPercent}%` }]} />
              <View style={[styles.genderThumb, { left: `${thumbLeftPercent}%` }]} />
            </View>
          </View>

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

          <View style={[styles.sliderContainer, ageType === 'none' && styles.sliderDisabled]}>
            <View
              style={styles.ageTrackArea}
              onLayout={onAgeSliderLayout}
              {...ageSliderPanResponder.panHandlers}
            >
              <View style={styles.ageTrackBase} />
              <View style={[styles.ageTrackActive, { width: `${ageThumbLeftPercent}%` }]} />

              <View style={styles.ageTrackStartDot} />

              {ageValues.slice(1, -2).map((value) => (
                <View
                  key={value}
                  style={[
                    styles.ageTrackTickDot,
                    {
                      left: `${((value - 10) / 40) * 100}%`,
                      opacity: value < ageMax ? 1 : 0,
                    },
                  ]}
                />
              ))}

              <View style={[styles.ageTrackThumb, { left: `${ageThumbLeftPercent}%` }]} />
            </View>

            <View style={styles.ageValueRow}>
              {ageValues.map((value) => (
                <Text key={value} style={styles.ageValueText}>{value === 50 ? '50+' : String(value)}</Text>
              ))}
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoTitleRow}>
              <IconInfoMark />
              <Text style={styles.infoTitle}>동그라미 바를 움직여 나이를 지정할 수 있어요.</Text>
            </View>
          </View>
        </View>

        <DividingLine />

      </ScrollView>

      <CommBottomButton label="다음" onPress={() => applyType && router.push({
            pathname: '/meets/createFee',
            params: { 
              meetType: meetType, 
              meetSubType: meetSubType,
              applyType: applyType, 
              ageMin : ageMin,
              ageMax : ageMax,
              genderRatio : genderRatio,
             }
          })}
          disabled={!meetType || !meetSubType || !applyType}/>
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
  sliderContainer: {
    marginTop: 6,
  },
  sliderDisabled: {
    opacity: 0.45,
  },
  genderRatioBadge: {
    position: 'absolute',
    top: -2,
    transform: [{ translateX: -25 }],
    minWidth: 50,
    height: 25,
    borderRadius: 17,
    backgroundColor: COLOR.APP_ACTIVE_5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  genderRatioBadgeText: {
    fontSize: 14,
    color: COLOR.COMM_WHITE,
  },
  genderLabelRow: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderLabelText: {
    fontSize: 14,
    color: COLOR.TEXT_DEFAULT,
  },
  genderTrackArea: {
    marginTop: 12,
    marginHorizontal: 10,
    height: 30,
    justifyContent: 'center',
  },
  genderTrackBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLOR.COMM_GRAY_6,
  },
  genderTrackLeft: {
    position: 'absolute',
    left: 0,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLOR.APP_ACTIVE_4,
  },
  genderTrackRight: {
    position: 'absolute',
    height: 8,
    borderRadius: 4,
    backgroundColor: COLOR.COMM_GRAY_4,
  },
  genderThumb: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLOR.COMM_WHITE,
    borderColor: COLOR.COMM_GRAY_6,
    borderWidth: 1,
    transform: [{ translateX: -15 }],
  },
  ageTrackArea: {
    marginTop: 8,
    height: 26,
    justifyContent: 'center',
  },
  ageTrackBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLOR.COMM_GRAY_4,
  },
  ageTrackActive: {
    position: 'absolute',
    left: 0,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLOR.APP_ACTIVE_5,
  },
  ageTrackStartDot: {
    position: 'absolute',
    left: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLOR.APP_ACTIVE_5,
    transform: [{ translateX: -1 }],
  },
  ageTrackTickDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLOR.COMM_WHITE,
    top: 10,
    transform: [{ translateX: -3 }],
  },
  ageTrackThumb: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLOR.APP_ACTIVE_5,
    transform: [{ translateX: -13 }],
  },
  ageValueRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ageValueText: {
    fontSize: 16,
    color: COLOR.TEXT_GRAY,
  },
});