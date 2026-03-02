import { COLOR } from "@/constants";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";

export default function MeetCreateDescScreen() {
  const params = useRoute();
  const [meetName, setMeetName] = useState('');
  const [meetDesc, setMeetDesc] = useState('');
  const {
    meetType,
    meetSubType,
    applyType,
    ageMin,
    ageMax,
    genderRatio,
    feeYn,
    feeEntry,
    feeInfoType,
    feeInfoDesc,
    category,
  } = (params.params ?? {}) as {
    meetType?: string,
    meetSubType?: string,
    applyType?: string,
    ageMin?: number,
    ageMax?: number,
    genderRatio?: number,
    feeYn?: string,
    feeEntry?: string,
    feeInfoType?: string,
    feeInfoDesc?: string,
    category?: string,
  };

  const canMoveNext = !!category;

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'나의 소셜링을 소개해주세요.'}</Text>
        </View>

        {/* 참가비 설정 */}
        <View style={styles.commContainer}>

          
        </View>

      </ScrollView>

      <CommBottomButton label="다음" onPress={() => canMoveNext && router.push({
            pathname: '/meets/createPlace',
            params: { 
              meetType: meetType, 
              meetSubType: meetSubType,
              applyType: applyType, 
              ageMin : ageMin,
              ageMax : ageMax,
              genderRatio : genderRatio,
              feeYn : feeYn,
              feeEntry : feeEntry,
              feeInfoType : feeInfoType,
              feeInfoDesc : feeInfoDesc,
              category : category,
             },
          })}
          disabled={!canMoveNext}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginTop: 12,
    marginBottom: 5,
    paddingStart: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 16,
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
  feeContainer: {
    gap: 14,
  },
  commContainerSubTitle: {
    fontSize: 14,
    color: COLOR.TEXT_DEFAULT,
  },
  feeInput: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLOR.COMM_BLACK,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  categoryBox: {
    width: '30.5%',
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.COMM_WHITE,
  },
  categoryBoxSelected: {
    borderColor: COLOR.APP_ACTIVE_4,
    backgroundColor: COLOR.COMM_WHITE,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.COLOR_323232,
  },
  categoryTextSelected: {
    color: COLOR.APP_ACTIVE_5,
  },
});