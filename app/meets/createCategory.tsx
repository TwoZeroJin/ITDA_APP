import { COMM_STYLES } from "@/constants";
import React from "react";
import { ScrollView, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import { MeetInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import CategoryInput2 from "@/components/inputs/CategoryInput2";
import { getCategoryName } from "@/utils/commUtil";

/**
 * 모임 생성 - 카테고리 선택 화면
 */
export default function MeetCreateCategoryScreen() {
  const prevMeetInfo = useLocalSearchParams();

  const formValues = useForm<MeetInfo>({
    defaultValues: {
      meet_subj: prevMeetInfo.meet_subj as string || undefined,
    },
  });

  const meetSubj = formValues.watch('meet_subj');
  const canMoveNext = !!meetSubj;

  const onNext = formValues.handleSubmit(async (data) => {
    router.navigate({
      pathname: '/meets/createDesc',
      params: {
        ...prevMeetInfo,
        meet_subj      : data.meet_subj,
        meet_subj_name : data.meet_subj ? await getCategoryName(data.meet_subj) : '',
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
          <View style={COMM_STYLES.commTitleContainer}>
            <Text style={COMM_STYLES.commTitle}>{'만남 주제를 선택해볼까요?'}</Text>
            <Text style={COMM_STYLES.commSubtitle}>{'모임의 주제를 선택해보세요.'}</Text>
          </View>

          <CategoryInput2 name="meet_subj" />

        </ScrollView>

        <CommBottomButton label="다음" onPress={onNext} disabled={!canMoveNext} />
      </View>
    </FormProvider>
  );
}