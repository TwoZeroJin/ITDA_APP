import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import React, { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';

/**
 * 참여 인원 입력 컴포넌트 (최소인원 ~ 최대인원)
 */
export default function MemberCountInput() {
  const { control, getValues } = useFormContext<MeetInfo>();
  const minMemberInputRef = useRef<TextInput>(null);
  const maxMemberInputRef = useRef<TextInput>(null);

  const filterNumeric = (value: string) => value.replace(/[^0-9]/g, '').slice(0, 2);

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>참여 인원(호스트 포함)</Text>
      <View style={styles.memberTitleContainer}>
        <Text style={styles.memberTitle}>최소인원</Text>
        <Text style={styles.memberTitle}>최대인원</Text>
      </View>
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
              <TouchableOpacity style={[styles.memberInputContainer, error && styles.memberInputContainerError]}
                activeOpacity={0.6}
                onPress={() => minMemberInputRef.current?.focus()}
              >
                <TextInput
                  ref={minMemberInputRef}
                  value={value?.toString()}
                  onChangeText={(text) => onChange(filterNumeric(text))}
                  keyboardType="number-pad"
                  maxLength={2}
                  returnKeyType="next"
                  onSubmitEditing={() => maxMemberInputRef.current?.focus()}
                  style={styles.memberInput}
                />
                <Text style={styles.memberSuffix}>명</Text>
              </TouchableOpacity>
              {error && <Text style={styles.errorText}>{error.message}</Text>}
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
              <TouchableOpacity style={[styles.memberInputContainer, error && styles.memberInputContainerError]}
                activeOpacity={0.6}
                onPress={() => maxMemberInputRef.current?.focus()}
              >
                <TextInput
                  ref={maxMemberInputRef}
                  value={value?.toString()}
                  onChangeText={(text) => onChange(filterNumeric(text))}
                  keyboardType="number-pad"
                  maxLength={2}
                  returnKeyType="done"
                  style={styles.memberInput}
                />
                <Text style={styles.memberSuffix}>명</Text>
              </TouchableOpacity>
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />
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
    fontWeight          : 'bold',
    marginBottom        : 8,
  },
  memberTitleContainer: {
    flexDirection       : 'row',
    justifyContent      : 'space-between',
    paddingHorizontal   : 4,
  },
  memberTitle: {
    flex                : 1,
    fontSize            : 14,
    color               : COLOR.TEXT_DEFAULT,
    marginStart         : 8,
  },
  memberInputRow: {
    flexDirection       : 'row',
    alignItems          : 'center',
    gap                 : 10,
  },
  memberInputWrap: {
    flex                : 1,
    height              : 50,
    gap                 : 6,
  },
  memberInputContainer: {
    flexDirection       : 'row',
    justifyContent      : 'space-between',
    alignItems          : 'center',
    flex                : 1,
    height              : 50,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    borderRadius        : 12,
    paddingHorizontal   : 16,
  },
  memberInputContainerError: {
    borderColor         : COLOR.TEXT_WARN,
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
    color               : COLOR.TEXT_DEFAULT,
  },
  errorText: {
    fontSize            : 12,
    color               : COLOR.TEXT_WARN,
    marginStart         : 4,
  },
  infoContainer: {
    marginTop           : 20,
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
