import { COLOR } from "@/constants";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { MeetInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import CategoryInput from "@/components/inputs/CategoryInput";

/**
 * 모임 생성 - 카테고리 선택 화면
 */
export default function MeetCreateCategoryScreen() {
  const params = useRoute();
  const prevMeetInfo = (params.params ?? {}) as MeetInfo;
  const formValues = useForm<MeetInfo>({
    defaultValues: {
      meet_subj: '',
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
      } as Partial<MeetInfo>,
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={styles.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
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
  container: {
    flex          : 1,
  },
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