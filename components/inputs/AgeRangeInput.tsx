import { COMM_STYLES } from '@/constants';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import CommRadioGroup from '@/components/comm/CommRadioGroup';
import AgeSlider from '@/components/AgeSlider';
import { MeetInfo } from '@/types';

const AGE_MIN = 10;

export default function AgeRangeInput() {
  const { control, watch, setValue } = useFormContext<MeetInfo>();

  const ageMinVal = watch('age_min');
  const ageMaxVal = watch('age_max');

  const isAgeSet = ageMaxVal !== null && ageMaxVal !== undefined;
  const ageType: 'none' | 'set' = isAgeSet ? 'set' : 'none';

  return (
    <View style={COMM_STYLES.commInputContainer}>
      <Text style={COMM_STYLES.commInputContainerTitle}>나이</Text>
      <CommRadioGroup
        items={[
          { label: '나이 무관', value: 'none' },
          { label: '나이 지정', value: 'set' },
        ]}
        value={ageType}
        onChange={(type) => {
          if (type === 'none') {
            setValue('age_min', 10);
            setValue('age_max', null as any);
          } else {
            const currentMin = typeof ageMinVal === 'number' ? ageMinVal : 20;
            const currentMax = typeof ageMaxVal === 'number' ? ageMaxVal : 30;
            setValue('age_min', currentMin);
            setValue('age_max', currentMax);
          }
        }}
      />
      <Controller
        name="age_min"
        control={control}
        render={({ field: { onChange: onMinChange, value: minVal } }) => {
          const minAge = typeof minVal === 'number' ? minVal : 10;
          const maxAge = typeof ageMaxVal === 'number' ? ageMaxVal : 30;        
          return (
            <AgeSlider
              minAge={minAge}
              maxAge={maxAge}
              onMinAgeChange={(newMin) => {
                onMinChange(newMin);
                if (newMin > maxAge) {
                  setValue('age_max', newMin);
                }
              }}
              onMaxAgeChange={(newMax) => {
                setValue('age_max', newMax);
                if (newMax < minAge) {
                  onMinChange(newMax);
                }
              }}
              disabled={ageType === 'none'}
            />
          );
        }}
      />
      <Controller
        name="age_max"
        control={control}
        render={() => <></>}
      />
      <View style={COMM_STYLES.infoContainer}>
        <View style={COMM_STYLES.infoTitleRow}>
          <IconInfoMark />
          <Text style={COMM_STYLES.infoTitle}>최소/최대 나이 슬라이더를 움직여 범위를 지정할 수 있어요.</Text>
        </View>
      </View>
    </View>
  );
}

export { AGE_MIN };