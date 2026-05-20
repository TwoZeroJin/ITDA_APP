import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import { COLOR } from '@/constants';
import { GroupInfo } from '@/types';
import React, { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

/**
 * 클럽 최대인원 입력 컴포넌트
 */
export default function GroupMaxMemberInput() {
  const { control } = useFormContext<GroupInfo>();
  const maxInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>참여 인원(호스트 포함)</Text>
      <View style={styles.memberTitleContainer}>
        <Text style={styles.memberTitle}>최대인원</Text>
      </View>
      <Controller
        name="group_max"
        control={control}
        rules={{ validate: (v) => (v >= 2) || '최소 2인 이상이어야 합니다.' }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <TouchableOpacity
              style={[styles.memberInputContainer, error && styles.memberInputContainerError]}
              activeOpacity={0.6}
              onPress={() => maxInputRef.current?.focus()}
            >
              <TextInput
                ref={maxInputRef}
                value={value?.toString()}
                onChangeText={(text) => {
                  const nextValue = text.replace(/[^0-9]/g, '').slice(0, 3);
                  onChange(nextValue ? Number(nextValue) : 0);
                }}
                keyboardType="number-pad"
                maxLength={3}
                style={styles.memberInput}
              />
              <Text style={styles.memberSuffix}>명</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />
      <View style={styles.infoContainer}>
        <View style={styles.infoTitleRow}>
          <IconInfoMark />
          <Text style={styles.infoTitle}>모임 설정시 참고해 주세요.</Text>
        </View>
        <Text style={styles.infoDesc}>· 모임에 맞는 최대 인원으로 설정해주세요.</Text>
        <Text style={styles.infoDesc}>· 최대 인원은 호스트를 포함한 숫자예요.</Text>
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
    textAlign           : 'right',
  },
  memberInputContainer: {
    flexDirection       : 'row',
    alignItems          : 'center',
    alignSelf           : 'flex-end',
    height              : 50,
    width               : 150,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    borderRadius        : 12,
    paddingHorizontal   : 16,
  },
  memberInputContainerError: {
    borderColor         : COLOR.TEXT_WARN,
  },
  errorText: {
    alignSelf           : 'flex-end',
    fontSize            : 12,
    color               : COLOR.TEXT_WARN,
    marginTop           : -8,
  },
  memberInput: {
    flex                : 1,
    fontSize            : 16,
    color               : COLOR.COLOR_323232,
    textAlign           : 'right',
    padding             : 0,
  },
  memberSuffix: {
    fontSize            : 14,
    color               : COLOR.TEXT_DEFAULT,
    marginStart         : 10,
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