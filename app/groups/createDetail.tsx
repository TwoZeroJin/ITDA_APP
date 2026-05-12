import { COLOR, COMM_CONSTANTS } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import DividingLine from "@/components/DividingLine";
import { GroupInfo } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import GroupMaxMemberInput from "@/components/inputs/GroupMaxMemberInput";
import ApplyTypeInput from "@/components/inputs/ApplyTypeInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/**
 * 클럽 생성 - 신청방식, 최대인원 설정 화면
 */
export default function GroupCreateDetailScreen() {
  const formValues = useForm<GroupInfo>({
    defaultValues: {
    },
  });

  const onNext = formValues.handleSubmit((data) => {
    router.navigate({
      pathname: '/groups/createCategory',
      params: {
        apply_type      : data.apply_type,
        group_question  : data.group_question,
        group_max       : data.group_max,
      } as Partial<GroupInfo>,
    });
  });

  return (
    <FormProvider {...formValues}>
      <View style={styles.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="클럽 생성"/>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          enableOnAndroid={true}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'어떻게 모임원을 모을까요?'}</Text>
            <Text style={styles.subtitle}>{`클럽을 선택했어요.\n모임에 맞는 모임원 구성을 정해주세요.`}</Text>
          </View>

          <DividingLine />

          <ApplyTypeInput questionFieldName="group_question"/>

          <DividingLine />

          <GroupMaxMemberInput />
          
          <DividingLine />

        </KeyboardAwareScrollView>

        <CommBottomButton 
          label="다음" 
          onPress={onNext} 
          disabled={!formValues.watch('apply_type') || !formValues.watch('group_max')
            || (formValues.watch('apply_type') === COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE && !formValues.watch('group_question'))
          } />
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
    marginBottom  : 30,
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