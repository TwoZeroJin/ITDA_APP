import { COLOR, COMM_STYLES } from "@/constants";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { router, useLocalSearchParams } from "expo-router";
import CategoryInput from "@/components/inputs/CategoryInput";
import { FormProvider, useForm } from "react-hook-form";
import { GroupInfo } from "@/types";

/**
 * 클럽 생성 - 카테고리 선택 화면
 */
export default function GroupCreateCategoryScreen() {
  const prevGroupInfo = useLocalSearchParams();
  const formValues = useForm<GroupInfo>({
    defaultValues: {
      group_subj: prevGroupInfo.group_subj as string || '',
    },
  });

  const groupSubj = formValues.watch('group_subj');
  const canMoveNext = !!groupSubj;

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/groups/createDesc',
      params: {
        ...prevGroupInfo,
        group_subj: data.group_subj,
      },
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title={`클럽 ${prevGroupInfo.group_id ? '수정' : '생성'}`}/>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* 클럽 생성 타이틀 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'클럽 주제를 선택해볼까요?'}</Text>
            <Text style={styles.subtitle}>{'클럽의 주제를 선택해보세요.'}</Text>
          </View>

          <CategoryInput name="group_subj" />

        </ScrollView>

        <CommBottomButton label="다음" onPress={onNext}
            disabled={!canMoveNext}/>
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