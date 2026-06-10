import { COMM_STYLES } from "@/constants";
import React from "react";
import { ScrollView, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { GroupInfo } from "@/types";
import CategoryInput2 from "@/components/inputs/CategoryInput2";
import { getCategoryName } from "@/utils/commUtil";

/**
 * 클럽 생성 - 카테고리 선택 화면
 */
export default function GroupCreateCategoryScreen() {
  const prevGroupInfo = useLocalSearchParams();

  const formValues = useForm<GroupInfo>({
    defaultValues: {
      group_subj: prevGroupInfo.group_subj as string || undefined,
    },
  });

  const groupSubj = formValues.watch('group_subj');
  const canMoveNext = !!groupSubj;

  const onNext = formValues.handleSubmit(async (data) => {
    router.navigate({
      pathname: '/groups/createDesc',
      params: {
        ...prevGroupInfo,
        group_subj      : data.group_subj,
        group_subj_name : data.group_subj ? await getCategoryName(data.group_subj) : '',
      },
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`클럽 ${prevGroupInfo.group_id ? '수정' : '생성'}`}/>
        <ScrollView 
          style={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 클럽 생성 타이틀 */}
          <View style={COMM_STYLES.commTitleContainer}>
            <Text style={COMM_STYLES.commTitle}>{'클럽 주제를 선택해볼까요?'}</Text>
            <Text style={COMM_STYLES.commSubtitle}>{'클럽의 주제를 선택해보세요.'}</Text>
          </View>

          <CategoryInput2 name="group_subj" />

        </ScrollView>

        <CommBottomButton label="다음" onPress={onNext}
            disabled={!canMoveNext}/>
      </View>
    </FormProvider>
  );
}