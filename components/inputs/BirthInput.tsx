import IconCalendar from '@/assets/images/icon_calendar.svg';
import DatePickerModal from '@/components/DatePickerModal';
import { COLOR } from '@/constants';
import { formatDisplayBirthDate, getDefaultBirthDate } from '@/utils/commUtil';
import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function BirthInput() {
  const { control } = useFormContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [draftValue, setDraftValue] = useState('');
  const defaultBirthDate = useMemo(() => getDefaultBirthDate(), []);

  return (
    <Controller
      name="mem_birth"
      control={control}
      rules={{
        validate: (value: string) => {
          if (!value) {
            return '생년월일을 선택해주세요.';
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const displayValue = formatDisplayBirthDate(value);

        return (
          <View>
            <Text style={styles.label}>생년월일</Text>
            <TouchableOpacity
              style={[styles.inputContainer, Boolean(error?.message) && styles.inputError]}
              activeOpacity={0.8}
              onPress={() => {
                setDraftValue(value || defaultBirthDate);
                setModalVisible(true);
              }}
            >
              <IconCalendar width={18} height={18} />
              <Text style={[styles.inputText, !displayValue && styles.placeholderText]}>
                {displayValue || '생년월일'}
              </Text>
            </TouchableOpacity>

            {Boolean(error?.message) && <Text style={styles.error}>{error?.message}</Text>}

            <DatePickerModal
              visible={modalVisible}
              selectedValue={draftValue}
              onChangeValue={setDraftValue}
              onClose={() => setModalVisible(false)}
              onConfirm={(nextValue) => {
                onChange(nextValue);
                setModalVisible(false);
              }}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize            : 14,
    fontWeight          : 400,
    lineHeight          : 22,
    color               : COLOR.TEXT_DEFAULT,
    marginStart         : 5,
    marginBottom        : 7,
  },
  inputContainer: {
    height              : 49,
    borderRadius        : 12,
    paddingHorizontal   : 16,
    flexDirection       : 'row',
    alignItems          : 'center',
    borderColor         : COLOR.COMM_GRAY_6,
    borderWidth         : 1,
  },
  inputText: {
    fontSize            : 16,
    color               : COLOR.TEXT_DEFAULT,
    marginStart         : 8,
  },
  placeholderText: {
    color               : COLOR.TEXT_GRAY,
  },
  error: {
    marginTop           : 5,
    fontSize            : 12,
    color               : COLOR.COMM_RED,
  },
  inputError: {
    borderWidth         : 1,
    borderColor         : COLOR.COMM_RED,
    backgroundColor     : COLOR.COMM_GRAY,
  },
});

export default BirthInput;
