import { COLOR } from "@/constants";
import Slider from "@react-native-community/slider";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type GenderSliderProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

function GenderSlider({ value, onChange, disabled = false }: GenderSliderProps) {
  const normalizedValue = useMemo(() => Math.max(0, Math.min(Math.round(value), 10)), [value]);
  const THUMB_LEFT_PERCENT_OFFSET = 3;

  const thumbLeftPercent = useMemo(() => {
    const linearPercent = (normalizedValue / 10) * 100;
    return Math.max(0, Math.min(linearPercent + (linearPercent > 50 ? -THUMB_LEFT_PERCENT_OFFSET : linearPercent === 50 ? 0 : THUMB_LEFT_PERCENT_OFFSET), 100));
  }, [THUMB_LEFT_PERCENT_OFFSET, normalizedValue]);

  const femaleRatio = normalizedValue;
  const maleRatio = 10 - normalizedValue;

  return (
    <View style={[styles.sliderContainer, disabled && styles.sliderDisabled]}>
      <View style={[styles.badge, { left: `${thumbLeftPercent}%` }]}>
        <Text style={styles.badgeText}>{`${femaleRatio}:${maleRatio}`}</Text>
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.labelText}>여성</Text>
        <Text style={styles.labelText}>남성</Text>
      </View>

      <View style={styles.sliderRow}>
        <Slider
          value={normalizedValue}
          onValueChange={(nextValue) => onChange(Math.round(nextValue))}
          minimumValue={0}
          maximumValue={10}
          step={1}
          disabled={disabled}
          minimumTrackTintColor={COLOR.APP_ACTIVE_4}
          maximumTrackTintColor={COLOR.COLOR_5537CD}
          thumbTintColor={COLOR.COMM_WHITE}
          style={styles.slider}
        />
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
  labelRow: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 14,
    color: COLOR.TEXT_DEFAULT,
  },
  sliderRow: {
    marginTop: 6,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default GenderSlider;
