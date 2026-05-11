import BottomPlaceSearchListModal, { BottomPlaceSearchListItem } from '@/components/BottomPlaceSearchListModal';
import CalendarModal from '@/components/CalendarModal';
import CustomRadioGroup from '@/components/CustomRadioGroup';
import TimePickerModal from '@/components/TimePickerModal';
import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconCalendar from '@/assets/images/icon_calendar.svg';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import IconPlace from '@/assets/images/icon_place.svg';
import IconTime from '@/assets/images/icon_time.svg';

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

export default function MeetPlaceInput() {
  const { control, setValue, watch } = useFormContext<MeetInfo>();

  const placeType = (watch('place_type') as 'F' | 'O' | undefined) || 'F';

  const [placeModalVisible, setPlaceModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const [selectedDateValue, setSelectedDateValue] = useState('');
  const [selectedDateLabel, setSelectedDateLabel] = useState('');
  const [selectedTimeLabel, setSelectedTimeLabel] = useState('');

  const [timeMeridiem, setTimeMeridiem] = useState('오전');
  const [timeHour, setTimeHour] = useState('01');
  const [timeMinute, setTimeMinute] = useState('00');

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

  const getSelectedTime24Format = () => {
    const hour12 = Number(timeHour);
    const normalizedHour = Number.isNaN(hour12) ? 0 : hour12 % 12;
    const hour24 = timeMeridiem === '오후' ? normalizedHour + 12 : normalizedHour;

    return `${`${hour24}`.padStart(2, '0')}:${timeMinute}`;
  };

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

  const onConfirmTime = () => {
    const nextLabel = `${timeMeridiem} ${timeHour}:${timeMinute}`;
    setSelectedTimeLabel(nextLabel);
    updateMeetDatetime(selectedDateValue, nextLabel);
    setTimeModalVisible(false);
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
              <TouchableOpacity style={styles.placeInfoContainer} onPress={() => setPlaceModalVisible(true)}>
                <IconPlace width={13} height={17} />
                <Text style={[styles.infoDesc, !selectedPlace && styles.placeholderText]}>
                  {selectedPlace ? selectedPlace.name : '어디서 만날까요?'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={[styles.commContainerSubTitle, { marginTop: 10 }]}>모임 날짜</Text>
          <TouchableOpacity style={styles.placeInfoContainer} onPress={() => setDateModalVisible(true)}>
            <IconCalendar width={15} height={13} />
            <Text style={[styles.infoDesc, !selectedDateLabel && styles.placeholderText]}>
              {selectedDateLabel || '언제 만날까요?'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.commContainerSubTitle, { marginTop: 10 }]}>모임 시간</Text>
          <TouchableOpacity
            style={styles.placeInfoContainer}
            onPress={() => {
              const parsedTime = selectedTimeLabel.match(/^(오전|오후)\s(\d{1,2}):(\d{2})$/);

              if (parsedTime) {
                setTimeMeridiem(parsedTime[1]);
                setTimeHour(parsedTime[2].padStart(2, '0'));
                setTimeMinute(parsedTime[3].padStart(2, '0'));
              }

              setTimeModalVisible(true);
            }}>
            <IconTime width={14} height={14} />
            <Text style={[styles.infoDesc, !selectedTimeLabel && styles.placeholderText]}>
              {selectedTimeLabel || '몇시에 만날까요?'}
            </Text>
          </TouchableOpacity>

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

      <TimePickerModal
        visible={timeModalVisible}
        meridiem={timeMeridiem}
        hour={timeHour}
        minute={timeMinute}
        onChangeMeridiem={setTimeMeridiem}
        onChangeHour={setTimeHour}
        onChangeMinute={setTimeMinute}
        onClose={() => setTimeModalVisible(false)}
        onConfirm={onConfirmTime}
      />

      <CalendarModal
        visible={dateModalVisible}
        selectedValue={selectedDateValue}
        onChangeValue={setSelectedDateValue}
        onClose={() => setDateModalVisible(false)}
        onConfirm={(item) => {
          setSelectedDateValue(item.value);
          setSelectedDateLabel(item.label);
          updateMeetDatetime(item.value, selectedTimeLabel);
          setDateModalVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  commContainer: {
    marginTop: 30,
    marginHorizontal: 16,
    marginBottom: 30,
    gap: 16,
  },
  placeContainer: {
    gap: 14,
  },
  commContainerSubTitle: {
    fontSize: 14,
    color: COLOR.TEXT_DEFAULT,
  },
  placeInfoContainer: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    paddingHorizontal: 16,
    color: COLOR.COMM_BLACK,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoContainer: {
    marginTop: 10,
    borderRadius: 12,
    borderColor: COLOR.COMM_GRAY_6,
    borderWidth: 1,
    backgroundColor: COLOR.COMM_GRAY_5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLOR.COLOR_323232,
  },
  infoDesc: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.COLOR_323232,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLOR.COMM_GRAY_7,
  },
});