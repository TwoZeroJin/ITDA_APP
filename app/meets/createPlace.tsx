import { COLOR, COMM_STYLES } from "@/constants";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import { MeetInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import MeetPlaceInput from "@/components/inputs/MeetPlaceInput";

/**
 * 모임 생성 - 장소 및 날짜, 시간 설정 화면
 */
export default function MeetCreatePlaceScreen() {
  // 수정화면에서 받아올 경우 meet_id 존재
  const prevMeetInfo = useLocalSearchParams();
  const formValues = useForm<MeetInfo>({
    defaultValues: {
      place_type   : prevMeetInfo.place_type as string || 'F',
      place_name   : prevMeetInfo.place_name as string || '',
      place_addr   : prevMeetInfo.place_addr as string || '',
      meet_datetime: prevMeetInfo.meet_datetime as string || '',
    },
  });

  const placeType = formValues.watch('place_type');
  const placeName = formValues.watch('place_name');
  const meetDatetime = formValues.watch('meet_datetime');

  const canMoveNext =
    !!prevMeetInfo.meet_type
    && !!prevMeetInfo.apply_type
    && (placeType === 'O' || (!!placeName && !!meetDatetime));

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/meets/createCategory',
      params: {
        ...prevMeetInfo,
        place_type: data.place_type,
        place_name: data.place_type === 'F' ? data.place_name : '',
        place_addr: data.place_type === 'F' ? data.place_addr : '',
        meet_datetime: data.meet_datetime,
      },
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`모임 ${prevMeetInfo.meet_id ? '수정' : '생성'}`}/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'언제 어디서 만날까요?'}</Text>
            <Text style={styles.subtitle}>{'모임을 만날 장소와 시간을 기입해 주세요.'}</Text>
          </View>

          <MeetPlaceInput />

        </ScrollView>

        <CommBottomButton label="다음" onPress={onNext} disabled={!canMoveNext} />
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop         : 12,
    marginBottom      : 5,
    paddingStart      : 16,
  },
  title: {
    fontSize          : 22,
    fontWeight        : 'bold',
    color             : COLOR.COMM_BLACK,
    marginBottom      : 16,
  },
  subtitle: {
    fontSize          : 16,
    color             : COLOR.COMM_GRAY_2,
  },
});