import { COLOR, COMM_STYLES } from "@/constants";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import { MeetInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import CategoryInput from "@/components/inputs/CategoryInput";

/**
 * 모임 생성 - 카테고리 선택 화면
 */
export default function MeetCreateCategoryScreen() {
  const prevMeetInfo = useLocalSearchParams();
  const formValues = useForm<MeetInfo>({
    defaultValues: {
      meet_subj: prevMeetInfo.meet_subj as string || '',
    },
  });

  const meetSubj = formValues.watch('meet_subj');
  const canMoveNext = !!meetSubj;

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/meets/createDesc',
      params: {
        ...prevMeetInfo,
        meet_subj: data.meet_subj,
      },
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`모임 ${prevMeetInfo.meet_id ? '수정' : '생성'}`}/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'만남 주제를 선택해볼까요?'}</Text>
            <Text style={styles.subtitle}>{'모임의 주제를 선택해보세요.'}</Text>
          </View>

          <CategoryInput name="meet_subj" />

        </ScrollView>

        <CommBottomButton label="다음" onPress={onNext} disabled={!canMoveNext} />
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop     : 12,
    marginBottom  : 5,
    paddingStart  : 16,
  },
  title: {
    fontSize      : 22,
    fontWeight    : 'bold',
    color         : COLOR.COMM_BLACK,
    marginBottom  : 16,
  },
  subtitle: {
    fontSize      : 16,
    color         : COLOR.COMM_GRAY_2,
  },
});