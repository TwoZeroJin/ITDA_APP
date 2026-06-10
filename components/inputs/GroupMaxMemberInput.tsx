import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import { COLOR, COMM_STYLES } from '@/constants';
import { GroupInfo } from '@/types';
import React, { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import InputField from '../InputField';

/**
 * 클럽 최대인원 입력 컴포넌트
 */
export default function GroupMaxMemberInput() {
  const { control } = useFormContext<GroupInfo>();
  const maxInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>참여 인원(호스트 포함)</Text>
      <Controller
        name="group_max"
        control={control}
        rules={{ validate: (v) => (v >= 2) || '최소 2인 이상이어야 합니다.' }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View style={styles.memberInputWrap}> 
            <InputField
              label='최대인원'
              ref={maxInputRef}
              value={value?.toString()}
              onChangeText={(text) => onChange((text))}
              keyboardType="number-pad"
              maxLength={3}
              error={error?.message}
              rightChild={<Text style={styles.memberSuffix}>명</Text>}
              style={styles.memberInput}
            />
          </View>
        )}
      />
      <View style={COMM_STYLES.infoContainer}>
        <View style={COMM_STYLES.infoTitleRow}>
          <IconInfoMark />
          <Text style={COMM_STYLES.infoTitle}>모임 설정시 참고해 주세요.</Text>
        </View>
        <Text style={COMM_STYLES.infoDesc}>· 모임에 맞는 최대 인원으로 설정해주세요.</Text>
        <Text style={COMM_STYLES.infoDesc}>· 최대 인원은 호스트를 포함한 숫자예요.</Text>
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
  memberInputWrap: {
    flex                : 1,
    alignSelf           : 'flex-start',
    width               : 150,
    minHeight           : 50,
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
});