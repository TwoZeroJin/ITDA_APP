import { COLOR, COMM_STYLES } from '@/constants';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GENDER_OPTIONS = [
  { label: '남', value: 'M' },
  { label: '여', value: 'F' },
];

function GenderInput() {
  const { control } = useFormContext();

  return (
    <Controller
      name="mem_gender"
      control={control}
      // rules={{
      //   validate: (value: string) => {
      //     if (!value) {
      //       return '성별을 선택해주세요.';
      //     }
      //   },
      // }}
      render={({ field: {onChange, value}, fieldState: { error } }) => (
        <View>
          <Text style={COMM_STYLES.label}>성별</Text>
          <View style={styles.container}>
            {GENDER_OPTIONS.map((option) => {
              const selected = value === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionButton, selected && styles.optionButtonActive]}
                  activeOpacity={0.6}
                  onPress={() => {
                    if (value == option.value) {
                      onChange(null);
                    } else {
                      onChange(option.value)
                    }}}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {Boolean(error?.message) && <Text style={styles.error}>{error?.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection   : 'row',
    gap             : 8,
  },
  optionButton: {
    flex            : 1,
    height          : 40,
    borderRadius    : 6,
    backgroundColor : COLOR.COMM_WHITE,
    borderWidth     : 1,
    borderColor     : COLOR.COMM_GRAY_6,
    justifyContent  : 'center',
    alignItems      : 'center',
  },
  optionButtonActive: {
    backgroundColor : COLOR.APP_MAIN,
    borderColor     : COLOR.APP_MAIN,
  },
  optionText: {
    fontSize        : 14,
    color           : COLOR.TEXT_DEFAULT,
    fontWeight      : '500',
  },
  optionTextActive: {
    color           : COLOR.COMM_WHITE,
  },
  error: {
    marginTop       : 5,
    fontSize        : 12,
    color           : COLOR.COMM_RED,
  },
});

export default GenderInput;
