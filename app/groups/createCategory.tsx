import { COLOR } from "@/constants";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import CategoryInput from "@/components/inputs/CategoryInput";
import { FormProvider, useForm } from "react-hook-form";
import { GroupInfo } from "@/types";

/**
 * 클럽 생성 - 카테고리 선택 화면
 */
export default function GroupCreateCategoryScreen() {
  const params = useRoute();
  const prevGroupInfo = (params.params ?? {}) as Partial<GroupInfo>;
  const formValues = useForm<GroupInfo>({
    defaultValues: {
      group_subj: '',
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
      } as Partial<GroupInfo>,
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={styles.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="클럽 생성"/>
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