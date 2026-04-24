import { COLOR } from "@/constants";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import { CodeInfo } from "@/types";
import { getFeeList } from "@/utils/commUtil";
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import { useRoute } from "@react-navigation/native";
import { MeetInfo } from "@/types";

/**
 * 모임 생성 - 참가비 설정 화면
 */
export default function MeetCreateFeeScreen() {
  const params = useRoute();
  const prevMeetInfo = (params.params ?? {}) as Partial<MeetInfo>;
  const [feeYn, setFeeYn] = useState<'N' | 'Y'>('N');
  const [feeEntry, setFeeEntry] = useState('');
  const [feeInfo, setFeeInfo] = useState('');
  const [feeInfoDesc, setFeeInfoDesc] = useState('');
  const [feeList, setFeeList] = useState<CodeInfo[]>([]);

  useEffect(() => {
    (async () => {
      const feeList = await getFeeList();
      setFeeList(feeList);
    })();
  }, []);

  const onChangeFeeEntry = (value: string) => {
    const onlyNumber = value.replace(/[^0-9]/g, '');
    setFeeEntry(onlyNumber);
  };

  const canMoveNext =
    !!prevMeetInfo.meet_type
    && !!prevMeetInfo.apply_type
    && (feeYn === 'N' || (!!feeEntry && !!feeInfo));

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'참가비가 있다면 설정해주세요.'}</Text>
          <Text style={styles.subtitle}>{'모임 운영에 필요한 경우 참가비를 설정해 주세요.\n운영비, 공간 대관료 등 다양한 용도로 활용할 수 있습니다.'}</Text>
        </View>

        {/* 참가비 설정 */}
        <View style={styles.commContainer}>

          <CustomRadioGroup
            items={[
              { label: '없음', value: 'N' },
              { label: '있음', value: 'Y' },
            ]}
            value={feeYn}
            onChange={(value) => setFeeYn(value as 'N' | 'Y')}
          />

          {/* 참가비 있음 선택 시 상세 입력 폼 노출 */}
          {feeYn === 'Y' && (
            <View style={styles.feeContainer}>
              <Text style={styles.commContainerSubTitle}>참가비</Text>
              <TextInput
                value={feeEntry}
                onChangeText={onChangeFeeEntry}
                keyboardType="number-pad"
                placeholder="최소 1,000원 이상 입력해 주세요."
                placeholderTextColor={COLOR.TEXT_GRAY}
                style={styles.feeInput}
              />

              <Text style={[styles.commContainerSubTitle, { marginTop: 10 }]}>참가비 정보</Text>
              <View style={styles.feeInfoTypeContainer}>
                {feeList.map((item) => {
                  const selected = feeInfo === item.code_id;

                  return (
                    <TouchableOpacity
                      key={item.code_id}
                      style={[styles.feeInfoTypeBox, selected && styles.feeInfoTypeBoxSelected]}
                      onPress={() => setFeeInfo(item.code_id)}
                    >
                      <Text style={[styles.feeInfoTypeText, selected && styles.feeInfoTypeTextSelected]}>{item.code_value}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                value={feeInfoDesc}
                onChangeText={setFeeInfoDesc}
                multiline
                textAlignVertical="top"
                placeholder="참가비 정보를 자세하게 작성해 주세요."
                placeholderTextColor={COLOR.TEXT_GRAY}
                style={styles.feeInfoDescInput}
              />

              <View style={styles.infoContainer}>
                <View style={styles.infoTitleRow}>
                  <IconInfoMark />
                  <Text style={styles.infoTitle}>참가비 설정시 참고해 주세요.</Text>
                  </View>
                  <Text style={styles.infoDesc}>· 참가비와 관련된 입금 안내는 모임 소개시 작성해 주세요.</Text>
                  <Text style={styles.infoDesc}>· 참가비와 관련된 금전적 거래에 대해 잇다는 책임을 지지 않습니다.</Text>
                </View>
              </View>
          )}
          
        </View>

      </ScrollView>

      <CommBottomButton label="다음" onPress={() => canMoveNext && router.push({
            pathname: '/meets/createPlace',
            params: {
              ...prevMeetInfo,
              fee_yn: feeYn,
              fee_entry: feeEntry ? Number(feeEntry) : undefined,
              fee_info: feeInfoDesc ? `${feeInfo}:${feeInfoDesc}` : feeInfo,
            } as Partial<MeetInfo>,
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
  feeInfoTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  feeInfoTypeBox: {
    width: '30.5%',
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.COMM_WHITE,
  },
  feeInfoTypeBoxSelected: {
    borderColor: COLOR.APP_ACTIVE_4,
    backgroundColor: COLOR.COMM_WHITE,
  },
  feeInfoTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.COLOR_323232,
  },
  feeInfoTypeTextSelected: {
    color: COLOR.APP_ACTIVE_5,
  },
  feeInfoDescInput: {
    minHeight: 86,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLOR.COLOR_323232,
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