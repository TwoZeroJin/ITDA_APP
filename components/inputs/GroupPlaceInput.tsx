import CommRadioGroup from '@/components/comm/CommRadioGroup';
import { COLOR, COMM_STYLES } from '@/constants';
import { GroupInfo } from '@/types';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import IconPlace from '@/assets/images/icon_place.svg';
import MeetDateInput from '@/components/inputs/DateInput';
import TimeInput from '@/components/inputs/TimeInput';
import KakaoPostcodeModal, { PostcodeAddress } from '@/components/modal/KakaoPostcodeModal';
import useCombinedDateTime from '@/hooks/useCombinedDateTime';

/**
 * 클럽 모임 장소, 날짜, 시간 입력 컴포넌트
 */
export default function GroupPlaceInput() {
  const { control, setValue, watch } = useFormContext<GroupInfo>();

  const placeType = (watch('place_type') as 'F' | 'O' | undefined) || 'F';
  const freqType = (watch('freq_type') as 'R' | 'I' | undefined) || 'I';

  const [tempFreqType = '매주', setTempFreqType] = useState<'매주' | '격주' | '매월'>('매주');
  const [tempFreqDesc, setTempFreqDesc] = useState('');

  useEffect(() => {
    if (freqType === 'I') {
      setValue('freq_desc', '');
    } else {
      setValue('freq_desc', `${tempFreqType}${tempFreqDesc ? ' ' + tempFreqDesc : ''}`);
    }
  }, [tempFreqType, tempFreqDesc, freqType, setValue]);

  const [placeModalVisible, setPlaceModalVisible] = useState(false);
  const [postcodeKey, setPostcodeKey] = useState(0);

  const { handleDateChange, handleTimeChange } = useCombinedDateTime({
    onChangeCombined: (value) => setValue('group_datetime', value),
  });

  const freqDescInputRef = useRef<TextInput>(null);

  const selectedPlace = useMemo(() => {
    const placeName = watch('place_name');
    const placeAddr = watch('place_addr');

    if (!placeName) {
      return null;
    }

    return {
      name: placeName,
      address: placeAddr ?? '',
    };
  }, [watch('place_name'), watch('place_addr')]);

  const handleSelectPlacePress = () => {
    setPostcodeKey((prevKey) => prevKey + 1);
    setPlaceModalVisible(true);
  };

  const handlePostcodeComplete = (data: PostcodeAddress) => {
    const nextPlaceAddr = data.roadAddress || data.address || data.jibunAddress || '';
    const nextPlaceName = data.buildingName || nextPlaceAddr;

    setValue('place_name', nextPlaceName);
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
                  setValue('place_name', '');
                  setValue('place_addr', '');
                }
              }}
            />
          )}
        />

        <View style={styles.placeContainer}>
          {placeType === 'F' && (
            <>
              <Text style={styles.commContainerSubTitle}>주요 모임 장소</Text>
              <TouchableOpacity style={styles.placeInfoContainer} onPress={handleSelectPlacePress} activeOpacity={0.6}>
                <IconPlace width={13} height={17} />
                <Text style={[styles.infoDesc, !selectedPlace && styles.placeholderText]}>
                  {selectedPlace ? selectedPlace.name : '어디서 만날까요?'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <Controller
            name="freq_type"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CommRadioGroup
                items={[
                  { label: '정기적', value: 'R' },
                  { label: '비정기적', value: 'I' },
                ]}
                value={(value as 'R' | 'I') || 'I'}
                onChange={(nextValue) => {
                  const nextFreqType = nextValue as 'R' | 'I';
                  onChange(nextFreqType);
                  if (nextFreqType === 'I') {
                    setTempFreqType('매주');
                    setTempFreqDesc('');
                    setValue('freq_desc', '');
                  }
                }}
              />
            )}
          />

          {freqType === 'R' && (
            <View>
              <CommRadioGroup
                items={[
                  { label: '매주', value: '매주' },
                  { label: '격주', value: '격주' },
                  { label: '매월', value: '매월' },
                ]}
                value={tempFreqType}
                onChange={(nextValue) => {
                  const tempFreqType = nextValue as '매주' | '격주' | '매월';
                  setTempFreqType(tempFreqType);
                }}
              />
              <TouchableOpacity
                style={styles.memberInputContainer}
                activeOpacity={0.6}
                onPress={() => freqDescInputRef.current?.focus()}
              >
                <TextInput
                  ref={freqDescInputRef}
                  value={tempFreqDesc}
                  onChangeText={(text) => {
                    setTempFreqDesc(text);
                  }}
                  placeholder='주기 요일을 입력해 주세요. (ex)마지막주 월요일'
                  placeholderTextColor={COLOR.TEXT_GRAY}
                  style={styles.memberInput}
                />
              </TouchableOpacity>
            </View>
          )}

          <MeetDateInput onDateChange={handleDateChange} />

          <TimeInput onTimeChange={handleTimeChange} />

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
  infoDesc: {
    fontSize          : 16,
    fontWeight        : 'bold',
    color             : COLOR.COLOR_323232,
  },
  placeholderText: {
    fontSize          : 14,
    fontWeight        : 'normal',
    color             : COLOR.COMM_GRAY_7,
  },
  memberInputContainer: {
    flexDirection       : 'row',
    alignItems          : 'center',
    alignSelf           : 'flex-end',
    height              : 50,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    borderRadius        : 12,
    paddingHorizontal   : 16,
    marginTop           : 16,
  },
  memberInput: {
    flex                : 1,
    fontSize            : 16,
    color               : COLOR.COLOR_323232,
    padding             : 0,
  },
});