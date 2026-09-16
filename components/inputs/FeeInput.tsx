import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import CommRadioGroup from '@/components/comm/CommRadioGroup';
import InputField from '@/components/InputField';
import { COLOR, COMM_STYLES } from '@/constants';
import { CodeInfo, MeetInfo } from '@/types';
import { formatNumberWithComma, getFeeList } from '@/utils/commUtil';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FeeInput() {
  const { control, watch, setValue } = useFormContext<MeetInfo>();
  const [feeList, setFeeList] = useState<CodeInfo[]>([]);
  const feeEntryInputRef = useRef<TextInput>(null);

  useEffect(() => {
    (async () => {
      setFeeList(await getFeeList());
    })();
  }, []);

  const feeYn = watch('fee_yn') as 'N' | 'Y' | undefined;
  const feeType = watch('fee_info');
  const selectedFeeTypes = useMemo(
    () => (feeType ?? '').split('|').filter(Boolean),
    [feeType],
  );

  const isEtcSelected = useMemo(
    () => selectedFeeTypes.includes('FEE_INFO_99'),
    [selectedFeeTypes],
  );

  return (
    <View style={styles.container}>
      <Controller
        name="fee_yn"
        control={control}
        render={({ field: { value, onChange } }) => (
          <CommRadioGroup
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
            rules={{
              required: '최소 1,000원 이상 입력해 주세요.',
              validate: (value) => {
                if ((value ?? 0) < 1000) {
                  return '최소 1,000원 이상 입력해 주세요.';
                }
              }
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <InputField
                  ref={feeEntryInputRef}
                  value={formatNumberWithComma(value)}
                  onChangeText={(text) => {
                    const onlyNumber = text.replace(/[^0-9]/g, '');
                    onChange(onlyNumber ? Number(onlyNumber) : 0);
                  }}
                  maxLength={11}
                  keyboardType="number-pad"
                  placeholder="최소 1,000원 이상 입력해 주세요."
                  error={error?.message}
                />
              </>
            )}
          />

          <Text style={[styles.containerSubTitle, { marginTop: 10 }]}>참가비 정보</Text>
          <Controller
            name="fee_info"
            control={control}
            rules={{
              required: '참가비 정보를 선택해 주세요.',
              validate: (value) => {
                if (!value) {
                  return '참가비 정보를 선택해 주세요.';
                }
              }
            }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <>
                <View style={styles.feeInfoTypeContainer}>
                  {feeList.map((item) => {
                    const selected = selectedFeeTypes.includes(item.code_id);

                    return (
                      <TouchableOpacity
                        key={item.code_id}
                        style={[styles.feeInfoTypeBox, selected && styles.feeInfoTypeBoxSelected]}
                        activeOpacity={0.6}
                        onPress={() => {
                          const isEtc = item.code_id === 'FEE_INFO_99';
                          const nextSelectedFeeTypes = isEtc
                            ? selected ? [] : [item.code_id]
                            : selected
                              ? selectedFeeTypes.filter((codeId) => codeId !== item.code_id)
                              : [...selectedFeeTypes.filter((codeId) => codeId !== 'FEE_INFO_99'), item.code_id];

                          onChange(nextSelectedFeeTypes.join('|'));
                          if (!nextSelectedFeeTypes.includes('FEE_INFO_99')) setValue('fee_desc', '');
                        }}>
                        <Text style={[styles.feeInfoTypeText, selected && styles.feeInfoTypeTextSelected]}>{item.code_value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </>
            )}
          />

          {isEtcSelected && (
            <Controller
              name="fee_desc"
              control={control}
              rules={{
                validate: (value) => {
                  if (!isEtcSelected) {
                    return true;
                  }
                  if (!value?.trim()) {
                    return '참가비 정보를 자세하게 작성해 주세요.';
                  }
                }
              }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <>
                  <InputField
                    value={value}
                    onChangeText={onChange}
                    textArea
                    numberOfLines={4}
                    placeholder="참가비 정보를 자세하게 작성해 주세요."
                    error={error?.message}
                  />
                </>
              )}
            />
          )}

          <View style={COMM_STYLES.infoContainer}>
            <View style={COMM_STYLES.infoTitleRow}>
              <IconInfoMark />
              <Text style={COMM_STYLES.infoTitle}>참가비 설정시 참고해 주세요.</Text>
            </View>
            <Text style={COMM_STYLES.infoDesc}>· 참가비와 관련된 입금 안내는 클럽 소개시 작성해 주세요.</Text>
            <Text style={COMM_STYLES.infoDesc}>· 참가비와 관련된 금전적 거래에 대해 잇다는 책임을 지지 않습니다.</Text>
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
  errorText: {
    fontSize            : 12,
    color               : COLOR.TEXT_WARN,
    marginStart         : 4,
  },
});