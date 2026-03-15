import { COLOR } from "@/constants";
import Slider from "@react-native-community/slider";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type AgeSliderProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

const AGE_VALUES = [10, 15, 20, 25, 30, 35, 40, 45, 50];

function AgeSlider({ value, onChange, disabled = false }: AgeSliderProps) {
  const normalizedValue = useMemo(() => {
    const rounded = Math.round(value / 5) * 5;
    return Math.max(10, Math.min(rounded, 50));
  }, [value]);

  const THUMB_LEFT_PERCENT_OFFSET = 3;

  const thumbLeftPercent = useMemo(() => {
    const linearPercent = ((normalizedValue - 10) / 40) * 100;
    return Math.max(
      0,
      Math.min(
        linearPercent + (linearPercent > 50 ? -THUMB_LEFT_PERCENT_OFFSET : linearPercent === 50 ? 0 : THUMB_LEFT_PERCENT_OFFSET),
        100,
      ),
    );
  }, [THUMB_LEFT_PERCENT_OFFSET, normalizedValue]);

  return (
    <View style={[styles.sliderContainer, disabled && styles.sliderDisabled]}>
      <View style={[styles.badge, { left: `${thumbLeftPercent}%` }]}>
        <Text style={styles.badgeText}>{normalizedValue === 50 ? '50+' : `${normalizedValue}`}</Text>
      </View>

      <View style={styles.sliderRow}>
        <Slider
          value={normalizedValue}
          onValueChange={(nextValue) => onChange(Math.round(nextValue / 5) * 5)}
          minimumValue={10}
          maximumValue={50}
          step={5}
          disabled={disabled}
          minimumTrackTintColor={COLOR.APP_ACTIVE_5}
          maximumTrackTintColor={COLOR.COMM_GRAY_4}
          thumbTintColor={COLOR.APP_ACTIVE_5}
          style={styles.slider}
        />
      </View>

      <View style={styles.valueRow}>
        {AGE_VALUES.map((age) => (
          <Text key={age} style={styles.valueText}>{age === 50 ? '50+' : String(age)}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    marginTop: 6,
  },
  sliderDisabled: {
    opacity: 0.45,
  },
  badge: {
    position: 'absolute',
    top: -2,
    transform: [{ translateX: -25 }],
    minWidth: 50,
    height: 25,
    borderRadius: 17,
    backgroundColor: COLOR.APP_ACTIVE_5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  badgeText: {
    fontSize: 14,
    color: COLOR.COMM_WHITE,
  },
  sliderRow: {
    marginTop: 26,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueRow: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 16,
    color: COLOR.TEXT_GRAY,
  },
});

export default AgeSlider;
