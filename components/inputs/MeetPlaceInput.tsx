import CommRadioGroup from '@/components/comm/CommRadioGroup';
import { COLOR, COMM_STYLES } from '@/constants';
import { MeetInfo } from '@/types';
import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import IconPlace from '@/assets/images/icon_place.svg';
import MeetDateInput from '@/components/inputs/DateInput';
import TimeInput from '@/components/inputs/TimeInput';
import KakaoPostcodeModal, { PostcodeAddress } from '@/components/modal/KakaoPostcodeModal';
import useCombinedDateTime from '@/hooks/useCombinedDateTime';

/**
 * 소모임 모임 장소, 날짜, 시간 입력 컴포넌트
 */
export default function MeetPlaceInput() {
  const { control, setValue, watch } = useFormContext<MeetInfo>();

  const placeType = (watch('place_type') as 'F' | 'O' | undefined) || 'F';
  const placeName = watch('place_name');
  const placeAddr = watch('place_addr');

  const [placeModalVisible, setPlaceModalVisible] = useState(false);
  const [postcodeKey, setPostcodeKey] = useState(0);

  const { handleDateChange, handleTimeChange } = useCombinedDateTime({
    onChangeCombined: (value) => setValue('meet_datetime', value, { shouldValidate: true, shouldDirty: true }),
  });

  const selectedPlace = useMemo(() => {
    if (!placeName) {
      return null;
    }

    return {
      name: placeName,
      address: placeAddr ?? '',
    };
  }, [placeName, placeAddr]);

  const handleSelectPlacePress = () => {
    setPostcodeKey((prevKey) => prevKey + 1);
    setPlaceModalVisible(true);
  };

  const handlePostcodeComplete = (data: PostcodeAddress) => {
    const nextPlaceAddr = data.roadAddress || data.address || data.jibunAddress || '';
    const nextPlaceName = data.buildingName || nextPlaceAddr;

    setValue('place_name', nextPlaceName, { shouldValidate: true, shouldDirty: true });
    setValue('place_addr', nextPlaceAddr);
    setPlaceModalVisible(false);
  };

  return (
    <>
      <View style={styles.commContainer}>
        <Controller
          name="place_type"
          control={control}
          render={({ field: { value, onChange } }) => (
            <CommRadioGroup
              items={[
                { label: '온라인', value: 'O' },
                { label: '오프라인', value: 'F' },
              ]}
              value={(value as 'O' | 'F') || 'F'}
              onChange={(nextValue) => {
                const nextPlaceType = nextValue as 'O' | 'F';
                onChange(nextPlaceType);

                if (nextPlaceType === 'O') {
                  setValue('place_name', '', { shouldValidate: true, shouldDirty: true });
                  setValue('place_addr', '');
                }
              }}
            />
          )}
        />

        <View style={styles.placeContainer}>
          {placeType === 'F' && (
            <Controller
              name="place_name"
              control={control}
              rules={{
                validate: (value) => {
                  if (placeType !== 'F') {
                    return true;
                  }

                  if (!value?.trim()) {
                    return '모임 장소를 선택해 주세요.';
                  }

                  return true;
                },
              }}
              render={({ fieldState: { error } }) => (
                <>
                  <Text style={styles.commContainerSubTitle}>모임 장소</Text>
                  <TouchableOpacity
                    style={[styles.placeInfoContainer, error && COMM_STYLES.errorBorder]}
                    onPress={handleSelectPlacePress}
                    activeOpacity={0.6}
                  >
                    <IconPlace width={13} height={17} />
                    <Text style={[COMM_STYLES.dataText, !selectedPlace && COMM_STYLES.placeholderText]}>
                      {selectedPlace ? selectedPlace.name : '어디서 만날까요?'}
                    </Text>
                  </TouchableOpacity>
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
            />
          )}

          <Controller
            name="meet_datetime"
            control={control}
            rules={{
              validate: (value) => {
                if (!value?.trim()) {
                  return '모임 날짜와 시간을 선택해 주세요.';
                }

                return true;
              },
            }}
            render={({ fieldState: { error } }) => (
              <>
                <MeetDateInput onDateChange={handleDateChange} />
                <TimeInput onTimeChange={handleTimeChange} />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </>
            )}
          />

          <View style={COMM_STYLES.infoContainer}>
            <View style={COMM_STYLES.infoTitleRow}>
              <IconInfoMark />
              <Text style={COMM_STYLES.infoTitle}>모임시간 1시간 전, 자동으로 신청이 마감돼요.</Text>
            </View>
          </View>
        </View>
      </View>

      <KakaoPostcodeModal
        visible={placeModalVisible}
        postcodeKey={postcodeKey}
        onClose={() => setPlaceModalVisible(false)}
        onComplete={handlePostcodeComplete}
      />

    </>
  );
}

const styles = StyleSheet.create({
  commContainer: {
    marginTop         : 30,
    marginHorizontal  : 16,
    marginBottom      : 30,
    gap               : 16,
  },
  placeContainer: {
    gap               : 14,
  },
  commContainerSubTitle: {
    fontSize          : 14,
    color             : COLOR.TEXT_DEFAULT,
  },
  placeInfoContainer: {
    height            : 50,
    borderRadius      : 12,
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    paddingHorizontal : 16,
    color             : COLOR.COMM_BLACK,
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 8,
  },
  errorText: {
    fontSize          : 12,
    color             : COLOR.TEXT_WARN,
    marginTop           : -4,
    marginStart       : 4,
  },
});