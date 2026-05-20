import { COLOR } from '@/constants';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import CustomRadioGroup from '@/components/comm/CustomRadioGroup';
import AgeSlider from '@/components/AgeSlider';
import { MeetInfo } from '@/types';

const AGE_MIN = 10;

export default function AgeRangeInput() {
  const { control } = useFormContext<MeetInfo>();
  const [ageType, setAgeType] = useState<'none' | 'set'>('set');

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>나이</Text>
      <Controller
        name="age_max"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <CustomRadioGroup
              items={[
                { label: '나이 무관', value: 'none' },
                { label: '나이 지정', value: 'set' },
              ]}
              value={ageType}
              onChange={(type) => {
                setAgeType(type as 'none' | 'set');
                if (type === 'none') onChange(-1);
              }}
            />
            <AgeSlider
              value={value < 0 ? 30 : value}
              onChange={onChange}
              disabled={ageType === 'none'}
            />
          </>
        )}
      />
      <View style={styles.infoContainer}>
        <View style={styles.infoTitleRow}>
          <IconInfoMark />
          <Text style={styles.infoTitle}>동그라미 바를 움직여 나이를 지정할 수 있어요.</Text>
        </View>
      </View>
    </View>
  );
}

export { AGE_MIN };

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
