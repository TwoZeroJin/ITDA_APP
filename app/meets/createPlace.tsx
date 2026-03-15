import { COLOR } from "@/constants";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import BottomPlaceSearchListModal, { BottomPlaceSearchListItem } from "@/components/BottomPlaceSearchListModal";
import DatePickerModal from "@/components/DatePickerModal";
import TimePickerModal, { TimeMeridiem } from "@/components/TimePickerModal";
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import IconPlace from '@/assets/images/icon_place.svg';
import IconTime from '@/assets/images/icon_time.svg';
import IconCalendar from '@/assets/images/icon_calendar.svg';
import { useRoute } from "@react-navigation/native";
import { MeetInfo } from "@/types";

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
 * 모임 생성 - 장소 및 날짜, 시간 설정 화면
 */
export default function MeetCreatePlaceScreen() {
  const params = useRoute();
  const prevMeetInfo = (params.params ?? {}) as Partial<MeetInfo>;
  const [placeType, setPlaceType] = useState<'F' | 'O'>('F');
  const [placeModalVisible, setPlaceModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [selectedDateValue, setSelectedDateValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timeMeridiem, setTimeMeridiem] = useState<TimeMeridiem>('오전');
  const [timeHour, setTimeHour] = useState('01');
  const [timeMinute, setTimeMinute] = useState('00');

  const canMoveNext = useMemo(() => {
    if (placeType === 'O') {
      return true;
    }

    return !!selectedPlace && !!selectedDateValue && !!selectedTime;
  }, [placeType, selectedPlace, selectedDateValue, selectedTime]);

  const openPlaceModal = () => {
    setPlaceModalVisible(true);
  };

  const openDateModal = () => {
    setDateModalVisible(true);
  };

  const openTimeModal = () => {
    const parsedTime = selectedTime.match(/^(오전|오후)\s(\d{1,2}):(\d{2})$/);

    if (parsedTime) {
      setTimeMeridiem(parsedTime[1] as TimeMeridiem);
      setTimeHour(parsedTime[2].padStart(2, '0'));
      setTimeMinute(parsedTime[3].padStart(2, '0'));
    }

    setTimeModalVisible(true);
  };

  const onConfirmTime = () => {
    setSelectedTime(`${timeMeridiem} ${timeHour}:${timeMinute}`);
    setTimeModalVisible(false);
  };

  const getSelectedTime24Format = () => {
    const hour12 = Number(timeHour);
    const normalizedHour = Number.isNaN(hour12) ? 0 : hour12 % 12;
    const hour24 = timeMeridiem === '오후' ? normalizedHour + 12 : normalizedHour;

    return `${`${hour24}`.padStart(2, '0')}:${timeMinute}`;
  };

  const onSelectPlace = (item: PlaceItem) => {
    setSelectedPlace(item);
    setPlaceModalVisible(false);
  };

  const modalItems: BottomPlaceSearchListItem[] = MOCK_PLACE_LIST.map((item) => ({
    id: item.id,
    title: item.name,
    description: item.address,
  }));

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'언제 어디서 만날까요?'}</Text>
          <Text style={styles.subtitle}>{'모임을 만날 장소와 시간을 기입해 주세요.'}</Text>
        </View>

        {/* 장소 설정 */}
        <View style={styles.commContainer}>

          <CustomRadioGroup
            items={[
              { label: '온라인', value: 'O' },
              { label: '오프라인', value: 'F' },
            ]}
            value={placeType}
            onChange={(value) => setPlaceType(value as 'O' | 'F')}
          />

          {/* 장소 설정에 따른 상세 입력 폼 노출 */}
          <View style={styles.placeContainer}>
            {placeType === 'F' && (
              <>
                <Text style={styles.commContainerSubTitle}>모임 장소</Text>
                <TouchableOpacity style={styles.placeInfoContainer} onPress={openPlaceModal}>
                  <IconPlace width={13} height={17}/>
                  <Text style={[styles.infoDesc, !selectedPlace && styles.placeholderText]}>
                    {selectedPlace ? selectedPlace.name : '어디서 만날까요?'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <Text style={[styles.commContainerSubTitle, { marginTop: 10 }]}>모임 날짜</Text>
            <TouchableOpacity style={styles.placeInfoContainer} onPress={openDateModal}>
              <IconCalendar width={15} height={13}/>
              <Text style={[styles.infoDesc, !selectedDate && styles.placeholderText]}>
                {selectedDate || '언제 만날까요?'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.commContainerSubTitle, { marginTop: 10 }]}>모임 시간</Text>
            <TouchableOpacity style={styles.placeInfoContainer} onPress={openTimeModal}>
              <IconTime width={14} height={14}/>
              <Text style={[styles.infoDesc, !selectedTime && styles.placeholderText]}>
                {selectedTime || '몇시에 만날까요?'}
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

      </ScrollView>

      <BottomPlaceSearchListModal
        visible={placeModalVisible}
        title="장소 선택"
        placeholder="어디서 만날까요?"
        defaultItems={modalItems}
        onClose={() => setPlaceModalVisible(false)}
        onSelectItem={(item) => onSelectPlace({ id: item.id, name: item.title, address: item.description })}
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

      <DatePickerModal
        visible={dateModalVisible}
        selectedValue={selectedDateValue}
        onChangeValue={setSelectedDateValue}
        onClose={() => setDateModalVisible(false)}
        onConfirm={(item) => {
          setSelectedDateValue(item.value);
          setSelectedDate(item.label);
          setDateModalVisible(false);
        }}
      />

      <CommBottomButton label="다음" onPress={() => canMoveNext && router.push({
            pathname: '/meets/createCategory',
            params: {
              ...prevMeetInfo,
              place_type: placeType,
              place_name: selectedPlace?.name ?? '',
              place_addr: selectedPlace?.address ?? '',
              meet_datetime: selectedDateValue && selectedTime ? `${selectedDateValue} ${getSelectedTime24Format()}` : '',
            } as Partial<MeetInfo>,
          })}
          disabled={!canMoveNext}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginTop: 12,
    marginBottom: 5,
    paddingStart: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLOR.COMM_GRAY_2,
  },
  commContainerTitle: {
    fontSize: 20,
    fontWeight: 'bold', 
    marginBottom: 8,
  },
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
  feeInfoDescInput: {
    minHeight: 86,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLOR.COLOR_323232,
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