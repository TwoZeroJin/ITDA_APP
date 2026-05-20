import { COLOR, COMM_STYLES } from "@/constants";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { GroupInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import GroupPlaceInput from "@/components/inputs/GroupPlaceInput";

/**
 * 클럽 생성 - 장소 및 날짜, 시간 설정 화면
 */
export default function GroupCreatePlaceScreen() {
  const params = useRoute();
  const prevGroupInfo = (params.params ?? {}) as GroupInfo;
  const formValues = useForm<GroupInfo>({
    defaultValues: {
      place_type   : 'F',
      place_name   : '',
      place_addr   : '',
      group_datetime: '',
    },
  });

  const placeType = (formValues.watch('place_type') as 'F' | 'O' | undefined) || 'F';
  const placeName = formValues.watch('place_name');
  const groupDatetime = formValues.watch('group_datetime');

  const canMoveNext =
    !!prevGroupInfo.apply_type
    && (placeType === 'O' || (!!placeName && !!groupDatetime));

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/groups/createCategory',
      params: {
        ...prevGroupInfo,
        place_type: data.place_type,
        place_name: data.place_type === 'F' ? data.place_name : '',
        place_addr: data.place_type === 'F' ? data.place_addr : '',
        group_datetime: data.group_datetime,
        freq_type: data.freq_type,
        freq_desc: data.freq_desc,
      } as Partial<GroupInfo>,
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="클럽 생성"/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'모임의 정기 일정을 설정해 주세요.'}</Text>
            <Text style={styles.subtitle}>{'멤버들이 반복되는 일정을 확인하고 참여할 수 있습니다.'}</Text>
          </View>

          <GroupPlaceInput />

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