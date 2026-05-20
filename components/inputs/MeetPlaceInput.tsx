import BottomPlaceSearchListModal, { BottomPlaceSearchListItem } from '@/components/BottomPlaceSearchListModal';
import CustomRadioGroup from '@/components/comm/CustomRadioGroup';
import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import IconPlace from '@/assets/images/icon_place.svg';
import MeetDateInput from '@/components/inputs/DateInput';
import TimeInput from '@/components/inputs/TimeInput';

type PlaceItem = {
  id: string;
  name: string;
  address: string;
};

const MOCK_PLACE_LIST: PlaceItem[] = [
  { id: '1', name: '한성교회', address: '서울 양천구 신정로13길 21' },
  { id: '2', name: '세븐일레븐 신정백암점', address: '서울 양천구 신정로13길 22' },
  { id: '3', name: '백암고등학교', address: '서울 양천구 신정로 13길 16 백암고등학교' },
  { id: '4', name: '금옥여자중학교', address: '서울 양천구 신정로 213' },
];

/**
 * 소모임 모임 장소, 날짜, 시간 입력 컴포넌트
 */
export default function MeetPlaceInput() {
  const { control, setValue, watch } = useFormContext<MeetInfo>();

  const placeType = (watch('place_type') as 'F' | 'O' | undefined) || 'F';

  const [placeModalVisible, setPlaceModalVisible] = useState(false);
  const [selectedDateValue, setSelectedDateValue] = useState('');
  const [selectedTimeLabel, setSelectedTimeLabel] = useState('');

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

  const modalItems: BottomPlaceSearchListItem[] = useMemo(() => {
    return MOCK_PLACE_LIST.map((item) => ({
      id: item.id,
      title: item.name,
      description: item.address,
    }));
  }, []);

  const updateMeetDatetime = (dateValue: string, timeLabel: string) => {
    if (!dateValue || !timeLabel) {
      setValue('meet_datetime', '');
      return;
    }

    const parsedTime = timeLabel.match(/^(오전|오후)\s(\d{1,2}):(\d{2})$/);

    if (!parsedTime) {
      setValue('meet_datetime', '');
      return;
    }

    const meridiem = parsedTime[1];
    const hour = parsedTime[2].padStart(2, '0');
    const minute = parsedTime[3].padStart(2, '0');

    const hour12 = Number(hour);
    const normalizedHour = Number.isNaN(hour12) ? 0 : hour12 % 12;
    const hour24 = meridiem === '오후' ? normalizedHour + 12 : normalizedHour;

    setValue('meet_datetime', `${dateValue} ${`${hour24}`.padStart(2, '0')}:${minute}`);
  };

  const handleDateChange = (dateValue: string, dateLabel: string) => {
    setSelectedDateValue(dateValue);
    updateMeetDatetime(dateValue, selectedTimeLabel);
  };

  const handleTimeChange = (timeLabel: string) => {
    setSelectedTimeLabel(timeLabel);
    updateMeetDatetime(selectedDateValue, timeLabel);
  };

  return (
    <>
      <View style={styles.commContainer}>
        <Controller
          name="place_type"
          control={control}
          render={({ field: { value, onChange } }) => (
            <CustomRadioGroup
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
              <Text style={styles.commContainerSubTitle}>모임 장소</Text>
              <TouchableOpacity style={styles.placeInfoContainer} onPress={() => setPlaceModalVisible(true)} activeOpacity={0.6}>
                <IconPlace width={13} height={17} />
                <Text style={[styles.infoDesc, !selectedPlace && styles.placeholderText]}>
                  {selectedPlace ? selectedPlace.name : '어디서 만날까요?'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <MeetDateInput onDateChange={handleDateChange} />

          <TimeInput onTimeChange={handleTimeChange} />

          <View style={styles.infoContainer}>
            <View style={styles.infoTitleRow}>
              <IconInfoMark />
              <Text style={styles.infoTitle}>모임시간 1시간 전, 자동으로 신청이 마감돼요.</Text>
            </View>
          </View>
        </View>
      </View>

      <BottomPlaceSearchListModal
        visible={placeModalVisible}
        title="장소 선택"
        placeholder="어디서 만날까요?"
        defaultItems={modalItems}
        onClose={() => setPlaceModalVisible(false)}
        onSelectItem={(item) => {
          setValue('place_name', item.title);
          setValue('place_addr', item.description);
          setPlaceModalVisible(false);
        }}
        renderItemIcon={<IconPlace width={13} height={17} />}
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
  infoContainer: {
    marginTop         : 10,
    borderRadius      : 12,
    borderColor       : COLOR.COMM_GRAY_6,
    borderWidth       : 1,
    backgroundColor   : COLOR.COMM_GRAY_5,
    paddingVertical   : 12,
    paddingHorizontal : 16,
    gap               : 6,
  },
  infoTitleRow: {
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 8,
  },
  infoTitle: {
    fontSize          : 12,
    fontWeight        : 'bold',
    color             : COLOR.COLOR_323232,
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
});