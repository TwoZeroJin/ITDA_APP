import CommHeader from "@/components/CommHeader";
import { COLOR } from "@/constants";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MeetApply from '@/assets/images/meet_apply.svg';

export default function MeetCreateScreen() {

  return (
    <>
      <CommHeader isNoti={false} isSetting={false} isLike={false}/>
      <ScrollView
        contentContainerStyle={{
          padding: 16,          // 내부 여백
          paddingBottom: 40,    // 하단 safe area 여유
        }}
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>설레는 모임 만들기</Text>
          <Text style={styles.subtitle}>어떤 유형의 모임인가요?</Text>
        </View>
        {/* 소모임 유형 선택 */}
        <View style={styles.meetTypeContainer}>
          <View style={styles.meetType}>
            <Text style={styles.meetTypeTitle}>모임형</Text>
            <Text style={styles.meetTypeDesc}>관심사와 취향으로 멤버들과 만나요. 멤버들과 함께 특별한 일상을 만들어 보세요.</Text>
          </View>
          <View style={styles.meetType}>
            <Text style={styles.meetTypeTitle}>클래스형</Text>
            <Text style={styles.meetTypeDesc}>나의 재능과 노하우를 멤버들에게 공유해요. 다양한 주제로 소셜링을 열어보세요.</Text>
          </View>
        </View>
        {/* 신청 방식 선택 */}
        <View style={styles.meetApplyContainer}>
          <View style={styles.sectionTitleRow}>
            <MeetApply width={19} height={14} />
            <Text style={styles.sectionTitle}>신청방식</Text>
          </View>
          <View style={styles.meetApplyContainer}>
            <View style={[styles.meetApply, styles.meetApplyActive]}>
              <Text style={styles.meetApplyTitle}>선착순</Text>
              <Text style={styles.meetApplyDesc}>멤버들의 신청과 동시에 참여가 완료돼요. 누구나 참여할 수 있어서 신청률이 높아요.</Text>
            </View>
            <View style={styles.meetApply}>
              <Text style={styles.meetApplyTitle}>승인제</Text>
              <Text style={styles.meetApplyDesc}>호스트가 직접 멤버를 수락하거나 거절할 수 있어요. 질문을 통해 취향이 통하는 사람들과 만날 수 있어요.</Text>
            </View>
          </View>
        </View>
        {/* 참여 인원 */}
        <View style={styles.meetApplyContainer}>
          <View style={styles.sectionTitleRow}>
            <MeetApply width={19} height={14} />
            <Text style={styles.sectionTitle}>참여 인원 (호스트 포함)</Text>
          </View>
          <View style={styles.memberInputRow}>
            <View style={styles.memberInputBox}>
              <Text style={styles.memberInputLabel}>최소</Text>
              <TextInput style={styles.memberInput} placeholder="명" keyboardType="numeric" />
            </View>
            <Text style={{marginHorizontal: 8}}>~</Text>
            <View style={styles.memberInputBox}>
              <Text style={styles.memberInputLabel}>최대</Text>
              <TextInput style={styles.memberInput} placeholder="명" keyboardType="numeric" />
            </View>
          </View>
        </View>
        {/* 성비 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>성비</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.COMM_WHITE,
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLOR.COMM_GRAY_2,
  },
  meetTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  // 모임 유형 CSS
  meetType: {
    flex: 1,
    backgroundColor: COLOR.COMM_GRAY,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  meetTypeActive: {
    backgroundColor: COLOR.APP_ACTIVE_1,
  },
  meetTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 8,
  },
  meetTypeDesc: {
    fontSize: 12,
    color: COLOR.COMM_GRAY_3,
    textAlign: 'center',
  },
  // 신청 방식 CSS
  meetApplyContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
  },
  meetApply: {
    flex: 1,
    backgroundColor: COLOR.COMM_GRAY,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  meetApplyActive: {
    backgroundColor: COLOR.APP_ACTIVE_1,
  },
  meetApplyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 8,
  },
  meetApplyDesc: {
    fontSize: 13,
    color: COLOR.COMM_BLACK,
  },
  // 참여 인원 CSS
  memberInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  memberInputBox: {
    flex: 1,
    alignItems: 'center',
  },
  memberInputLabel: {
    fontSize: 13,
    color: COLOR.COMM_BLACK,
    marginBottom: 4,
  },
  memberInput: {
    width: 60,
    height: 32,
    borderWidth: 1,
    borderColor: COLOR.BTN_BORDER,
    borderRadius: 8,
    textAlign: 'center',
    backgroundColor: COLOR.COMM_GRAY,
  },
});