import { COMM_STYLES } from '@/constants';
import { MeetInfo } from '@/types';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import CommRadioGroup from '@/components/comm/CommRadioGroup';
import GenderSlider from '@/components/GenderSlider';

export default function GenderRatioInput() {
  const { control } = useFormContext<MeetInfo>();
  const [genderType, setGenderType] = useState<'none' | 'set'>('none');

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>성비</Text>
      <Controller
        name="gender_ratio"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <CommRadioGroup
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
      <View style={COMM_STYLES.infoContainer}>
        <View style={COMM_STYLES.infoTitleRow}>
          <IconInfoMark />
          <Text style={COMM_STYLES.infoTitle}>동그라미 바를 움직여 성비를 지정할 수 있어요.</Text>
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
});
