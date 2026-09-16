import { COLOR } from "@/constants";
import Slider from "@react-native-community/slider";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type AgeSliderProps = {
  minAge: number;
  maxAge: number;
  onMinAgeChange: (value: number) => void;
  onMaxAgeChange: (value: number) => void;
  disabled?: boolean;
};

const AGE_VALUES = [10, 15, 20, 25, 30, 35, 40, 45, 50];

/**
 * @react-native-community/slider 모듈을 활용한 나이대 레인지 슬라이더
 */
function AgeSlider({ minAge, maxAge, onMinAgeChange, onMaxAgeChange, disabled = false }: AgeSliderProps) {
  const [activeThumb, setActiveThumb] = useState<'min' | 'max'>('min');

  const normalizedMin = useMemo(() => {
    const rounded = Math.round(minAge);
    return Math.max(10, Math.min(rounded, 50));
  }, [minAge]);

  const normalizedMax = useMemo(() => {
    const rounded = Math.round(maxAge);
    return Math.max(10, Math.min(rounded, 50));
  }, [maxAge]);

  const minPercent = ((normalizedMin - 10) / 40) * 100;
  const maxPercent = ((normalizedMax - 10) / 40) * 100;

  const rangeText = useMemo(() => {
    if (disabled) return '나이 제한 없음';
    const minStr = `${normalizedMin}세`;
    const maxStr = normalizedMax === 50 ? '50세 이상' : `${normalizedMax}세`;
    if (normalizedMin === normalizedMax) return minStr;
    return `${minStr} ~ ${maxStr}`;
  }, [normalizedMin, normalizedMax, disabled]);

  const handleMinChange = (val: number) => {
    const rounded = Math.round(val);
    const nextMin = Math.min(rounded, normalizedMax);
    onMinAgeChange(nextMin);
  };

  const handleMaxChange = (val: number) => {
    const rounded = Math.round(val);
    const nextMax = Math.max(rounded, normalizedMin);
    onMaxAgeChange(nextMax);
  };

  return (
    <View style={[styles.sliderContainer, disabled && styles.sliderDisabled]}>
      {/* 선택된 나이 범위 배지 */}
      <View style={styles.rangeHeaderContainer}>
        <View style={styles.rangeBadge}>
          <Text style={styles.rangeBadgeText}>{rangeText}</Text>
        </View>
      </View>

      {/* 슬라이더 트랙 영역 */}
      <View
        style={styles.trackWrapper}
        onTouchStart={(evt) => {
          if (disabled) return;
          const touchX = evt.nativeEvent.locationX;
          const midX = ((minPercent + maxPercent) / 2 / 100) * 300;
          setActiveThumb(touchX <= midX ? 'min' : 'max');
        }}
      >
        {/* 비활성 트랙 바 (연연보라/연회색 트랙) */}
        <View style={styles.inactiveTrack} />

        {/* 활성 구간 트랙 바 (붉은 색상 라인) */}
        {!disabled && (
          <View
            style={[
              styles.activeTrack,
              {
                left: `${5 + (minPercent / 100) * (100 - 8)}%`,
                width: `${((maxPercent - minPercent) / 100) * (100 - 8)}%`,
              },
            ]}
          />
        )}

        {/* 최소 나이 Slider (@react-native-community/slider) */}
        <View style={[styles.sliderOverlay, { zIndex: activeThumb === 'min' ? 2 : 1 }]}>
          <Slider
            value={normalizedMin}
            onValueChange={handleMinChange}
            onSlidingStart={() => setActiveThumb('min')}
            minimumValue={10}
            maximumValue={50}
            upperLimit={normalizedMax}
            step={1}
            disabled={disabled}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor={COLOR.APP_ACTIVE_5}
            style={styles.slider}
          />
        </View>

        {/* 최대 나이 Slider (@react-native-community/slider) */}
        <View style={[styles.sliderOverlay, { zIndex: activeThumb === 'max' ? 2 : 1 }]}>
          <Slider
            value={normalizedMax}
            onValueChange={handleMaxChange}
            onSlidingStart={() => setActiveThumb('max')}
            minimumValue={10}
            maximumValue={50}
            lowerLimit={normalizedMin}
            step={1}
            disabled={disabled}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor={COLOR.APP_ACTIVE_5}
            style={styles.slider}
          />
        </View>
      </View>

      {/* 하단 나이 눈금 */}
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
    marginTop         : 10,
    paddingHorizontal : 4,
  },
  sliderDisabled: {
    opacity           : 0.45,
  },
  rangeHeaderContainer: {
    alignItems        : 'center',
    marginBottom      : 16,
  },
  rangeBadge: {
    paddingHorizontal : 18,
    paddingVertical   : 6,
    borderRadius      : 20,
    backgroundColor   : COLOR.APP_ACTIVE_5,
  },
  rangeBadgeText: {
    fontSize          : 15,
    fontFamily        : 'Pretendard-Bold',
    color             : COLOR.COMM_WHITE,
  },
  trackWrapper: {
    height            : 56,
    justifyContent    : 'center',
    position          : 'relative',
  },
  inactiveTrack: {
    position          : 'absolute',
    left              : 14,
    right             : 14,
    height            : 3,
    borderRadius      : 1.5,
    backgroundColor   : '#ECEEF2',
  },
  activeTrack: {
    position          : 'absolute',
    height            : 3,
    borderRadius      : 1.5,
    backgroundColor   : COLOR.APP_ACTIVE_5,
  },
  sliderOverlay: {
    position          : 'absolute',
    left              : 0,
    right             : 0,
    top               : 0,
    bottom            : 0,
    justifyContent    : 'center',
  },
  slider: {
    width             : '100%',
    height            : 56,
  },
  valueRow: {
    marginTop         : 4,
    flexDirection     : 'row',
    justifyContent    : 'space-between',
    paddingHorizontal : 8,
  },
  valueText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_GRAY,
  },
});

export default AgeSlider;
