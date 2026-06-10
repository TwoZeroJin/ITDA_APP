import { COLOR, COMM_STYLES } from '@/constants';
import InputField from '@/components/InputField';
import { MeetInfo } from '@/types';
import React, { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';

/**
 * 참여 인원 입력 컴포넌트 (최소인원 ~ 최대인원)
 */
export default function MemberCountInput() {
  const { control, getValues } = useFormContext<MeetInfo>();
  const minMemberInputRef = useRef<TextInput>(null);
  const maxMemberInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>참여 인원(호스트 포함)</Text>
      <View style={styles.memberInputRow}>
        <Controller
          name="meet_min"
          control={control}
          rules={{
            required: '최소인원을 입력해주세요.',
            validate: (value) => {
              const minValue = Number(value ?? 0);
              const maxValue = Number(getValues('meet_max') ?? 0);

              if (maxValue && minValue > maxValue) {
                return '최소인원은 최대인원보다 작거나 같아야 해요.';
              }

              return true;
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={styles.memberInputWrap}>
              <InputField
                label='최소인원'
                ref={minMemberInputRef}
                value={value?.toString()}
                onChangeText={(text) => onChange((text))}
                keyboardType="number-pad"
                maxLength={2}
                returnKeyType="next"
                onSubmitEditing={() => maxMemberInputRef.current?.focus()}
                error={error?.message}
                rightChild={<Text style={styles.memberSuffix}>명</Text>}
                style={styles.memberInput}
              />
            </View>
          )}
        />
        <Text style={styles.memberRangeText}>~</Text>
        <Controller
          name="meet_max"
          control={control}
          rules={{
            required: '최대인원을 입력해주세요.',
            validate: (value) => {
              const maxValue = Number(value ?? 0);
              const minValue = Number(getValues('meet_min') ?? 0);

              if (minValue && maxValue < minValue) {
                return '최대인원은 최소인원보다 크거나 같아야 해요.';
              }

              return true;
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={styles.memberInputWrap}>
              <InputField
                label='최대인원'
                ref={maxMemberInputRef}
                value={value?.toString()}
                onChangeText={(text) => onChange((text))}
                keyboardType="number-pad"
                maxLength={2}
                returnKeyType="done"
                error={error?.message}
                rightChild={<Text style={styles.memberSuffix}>명</Text>}
                style={styles.memberInput}
              />
            </View>
          )}
        />
      </View>
      <View style={COMM_STYLES.infoContainer}>
        <View style={COMM_STYLES.infoTitleRow}>
          <IconInfoMark />
          <Text style={COMM_STYLES.infoTitle}>모임 설정시 참고해 주세요.</Text>
        </View>
        <Text style={COMM_STYLES.infoDesc}>· 실제 모임 진행에 필요한 최소 인원으로 설정해주세요.</Text>
        <Text style={COMM_STYLES.infoDesc}>· 모임 시간 1시간 전까지 최소 인원이 모집되지 않으면 모임이 자동으로 취소돼요.</Text>
      </View>
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
  containerTitle: {
    fontSize            : 20,
    fontFamily          : 'Pretendard-SemiBold',
    marginBottom        : 8,
  },
  memberInputRow: {
    flexDirection       : 'row',
    alignItems          : 'center',
    gap                 : 10,
    marginBottom        : 16,
  },
  memberInputWrap: {
    flex                : 1,
    minHeight           : 50,
  },
  memberInput: {
    flex                : 1,
    fontSize            : 16,
    textAlign           : 'right',
    color               : COLOR.COLOR_323232,
    padding             : 0,
  },
  memberSuffix: {
    fontSize            : 14,
    color               : COLOR.TEXT_DEFAULT,
    marginStart         : 10,
  },
  memberRangeText: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-Medium',
    color               : COLOR.TEXT_DEFAULT,
    alignSelf           : 'center',
    marginTop           : 25,
  },
});
