import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import CustomRadioGroup from '@/components/CustomRadioGroup';
import { COLOR } from '@/constants';
import { CodeInfo, MeetInfo } from '@/types';
import { getFeeList } from '@/utils/commUtil';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function MeetFeeInput() {
  const { control, watch, setValue } = useFormContext<MeetInfo>();
  const [feeList, setFeeList] = useState<CodeInfo[]>([]);

  useEffect(() => {
    (async () => {
      setFeeList(await getFeeList());
    })();
  }, []);

  const feeYn = watch('fee_yn') as 'N' | 'Y' | undefined;
  const feeType = watch('fee_info');

  const isEtcSelected = useMemo(
    () => feeList?.find((item) => item.code_id === feeType)?.code_id === 'FEE_INFO_99',
    [feeList, feeType],
  );

  return (
    <View style={styles.container}>
      <Controller
        name="fee_yn"
        control={control}
        render={({ field: { value, onChange } }) => (
          <CustomRadioGroup
            items={[
              { label: '없음', value: 'N' },
              { label: '있음', value: 'Y' },
            ]}
            value={(value as 'N' | 'Y') || 'N'}
            onChange={(nextValue) => {
              const selectedValue = nextValue as 'N' | 'Y';
              onChange(selectedValue);

              if (selectedValue === 'N') {
                setValue('fee_entry', 0);
                setValue('fee_info', '');
                setValue('fee_desc', '');
              }
            }}
          />
        )}
      />

      {feeYn === 'Y' && (
        <View style={styles.feeContainer}>
          <Text style={styles.containerSubTitle}>참가비</Text>
          <Controller
            name="fee_entry"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value ? String(value) : ''}
                onChangeText={(text) => {
                  const onlyNumber = text.replace(/[^0-9]/g, '');
                  onChange(onlyNumber ? Number(onlyNumber) : 0);
                }}
                keyboardType="number-pad"
                placeholder="최소 1,000원 이상 입력해 주세요."
                placeholderTextColor={COLOR.TEXT_GRAY}
                style={styles.feeInput}
              />
            )}
          />

          <Text style={[styles.containerSubTitle, { marginTop: 10 }]}>참가비 정보</Text>
          <Controller
            name="fee_info"
            control={control}
            render={({ field: { onChange } }) => (
              <>
                <View style={styles.feeInfoTypeContainer}>
                  {feeList.map((item) => {
                    const selected = feeType === item.code_id;

                    return (
                      <TouchableOpacity
                        key={item.code_id}
                        style={[styles.feeInfoTypeBox, selected && styles.feeInfoTypeBoxSelected]}
                        onPress={() => {
                          onChange(item.code_id);
                          if (item.code_id !== 'FEE_INFO_99') setValue('fee_desc', '');
                        }}>
                        <Text style={[styles.feeInfoTypeText, selected && styles.feeInfoTypeTextSelected]}>{item.code_value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

              </>
            )}
          />

          {isEtcSelected && (
            <Controller
              name="fee_desc"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  multiline
                  textAlignVertical="top"
                  placeholder="참가비 정보를 자세하게 작성해 주세요."
                  placeholderTextColor={COLOR.TEXT_GRAY}
                  style={styles.feeInfoDescInput}
                />
              )}
            />
          )}

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
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop           : 30,
    marginHorizontal    : 16,
    marginBottom        : 30,
    gap                 : 16,
  },
  feeContainer: {
    gap                 : 14,
  },
  containerSubTitle: {
    fontSize            : 14,
    color               : COLOR.TEXT_DEFAULT,
  },
  feeInput: {
    height              : 50,
    borderRadius        : 12,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    paddingHorizontal   : 16,
    fontSize            : 14,
    color               : COLOR.COMM_BLACK,
  },
  feeInfoTypeContainer: {
    flexDirection       : 'row',
    flexWrap            : 'wrap',
    alignItems          : 'center',
    gap                 : 10,
  },
  feeInfoTypeBox: {
    justifyContent      : 'center',
    alignItems          : 'center',
    width               : '30.5%',
    height              : 42,
    borderRadius        : 12,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    backgroundColor     : COLOR.COMM_WHITE,
  },
  feeInfoTypeBoxSelected: {
    borderColor         : COLOR.APP_ACTIVE_4,
    backgroundColor     : COLOR.COMM_WHITE,
  },
  feeInfoTypeText: {
    fontSize            : 16,
    fontWeight          : '600',
    color               : COLOR.COLOR_323232,
  },
  feeInfoTypeTextSelected: {
    color               : COLOR.APP_ACTIVE_5,
  },
  feeInfoDescInput: {
    minHeight           : 86,
    borderRadius        : 12,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    paddingHorizontal   : 16,
    paddingVertical     : 14,
    fontSize            : 16,
    color               : COLOR.COLOR_323232,
  },
  infoContainer: {
    marginTop           : 10,
    borderRadius        : 12,
    borderColor         : COLOR.COMM_GRAY_6,
    borderWidth         : 1,
    backgroundColor     : COLOR.COMM_GRAY_5,
    paddingVertical     : 12,
    paddingHorizontal   : 16,
    gap                 : 6,
  },
  infoTitleRow: {
    flexDirection       : 'row',
    alignItems          : 'center',
    gap                 : 8,
  },
  infoTitle: {
    fontSize            : 12,
    fontWeight          : 'bold',
    color               : COLOR.COLOR_323232,
  },
  infoDesc: {
    fontSize            : 12,
    color               : COLOR.TEXT_DEFAULT,
  },
});