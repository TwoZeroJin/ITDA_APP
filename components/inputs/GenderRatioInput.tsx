import { COMM_STYLES } from '@/constants';
import { MeetInfo } from '@/types';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import CommRadioGroup from '@/components/comm/CommRadioGroup';
import GenderSlider from '@/components/GenderSlider';

export default function GenderRatioInput() {
  const { control } = useFormContext<MeetInfo>();

  return (
    <View style={COMM_STYLES.commInputContainer}>
      <Text style={COMM_STYLES.commInputContainerTitle}>성비</Text>
      <Controller
        name="gender_ratio"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            {(() => {
              const genderType: 'none' | 'set' = value !== null && value !== undefined ? 'set' : 'none';

              return (
                <>
                  <CommRadioGroup
                    items={[
                      { label: '성비 무관', value: 'none' },
                      { label: '성비 지정', value: 'set' },
                    ]}
                    value={genderType}
                    onChange={(type) => {
                      if (type === 'none') {
                        onChange(null);
                      } else if (value === null || value === undefined) {
                        onChange(0.5);
                      }
                    }}
                  />
                  <GenderSlider
                    value={value ?? 0.5}
                    onChange={onChange}
                    disabled={genderType === 'none'}
                  />
                </>
              );
            })()}
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