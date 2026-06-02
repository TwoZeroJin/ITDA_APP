import { COMM_STYLES } from '@/constants';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import CommRadioGroup from '@/components/comm/CommRadioGroup';
import AgeSlider from '@/components/AgeSlider';
import { MeetInfo } from '@/types';

const AGE_MIN = 10;

export default function AgeRangeInput() {
  const { control } = useFormContext<MeetInfo>();
  const [ageType, setAgeType] = useState<'none' | 'set'>('none');

  return (
    <View style={COMM_STYLES.commInputContainer}>
      <Text style={COMM_STYLES.commInputContainerTitle}>나이</Text>
      <Controller
        name="age_max"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <CommRadioGroup
              items={[
                { label: '나이 무관', value: 'none' },
                { label: '나이 지정', value: 'set' },
              ]}
              value={ageType}
              onChange={(type) => {
                setAgeType(type as 'none' | 'set');
                if (type === 'none') {
                  onChange(null);
                } else {
                  onChange(30);
                }
              }}
            />
            <AgeSlider
              value={value ?? 30}
              onChange={onChange}
              disabled={ageType === 'none'}
            />
          </>
        )}
      />
      <View style={COMM_STYLES.infoContainer}>
        <View style={COMM_STYLES.infoTitleRow}>
          <IconInfoMark />
          <Text style={COMM_STYLES.infoTitle}>동그라미 바를 움직여 나이를 지정할 수 있어요.</Text>
        </View>
      </View>
    </View>
  );
}

export { AGE_MIN };