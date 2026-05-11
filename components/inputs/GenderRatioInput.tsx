import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import CustomRadioGroup from '@/components/CustomRadioGroup';
import GenderSlider from '@/components/GenderSlider';

export default function GenderRatioInput() {
  const { control } = useFormContext<MeetInfo>();
  const [genderType, setGenderType] = useState<'none' | 'set'>('set');

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>성비</Text>
      <Controller
        name="gender_ratio"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <CustomRadioGroup
              items={[
                { label: '성비 무관', value: 'none' },
                { label: '성비 지정', value: 'set' },
              ]}
              value={genderType}
              onChange={(type) => {
                setGenderType(type as 'none' | 'set');
                if (type === 'none') onChange(-1);
              }}
            />
            <GenderSlider
              value={value < 0 ? 0.5 : value}
              onChange={onChange}
              disabled={genderType === 'none'}
            />
          </>
        )}
      />
      <View style={styles.infoContainer}>
        <View style={styles.infoTitleRow}>
          <IconInfoMark />
          <Text style={styles.infoTitle}>동그라미 바를 움직여 성비를 지정할 수 있어요.</Text>
        </View>
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
});
