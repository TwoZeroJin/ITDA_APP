import { COLOR, COMM_CONSTANTS, COMM_STYLES } from '@/constants';
import React from 'react';
import { Controller, useFormContext, FieldValues } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconApplyFirst from '@/assets/images/icon_apply_first.svg';
import IconApplyApprove from '@/assets/images/icon_apply_approve.svg';
import QuestionInput from './QuestionInput';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';

const APPLY_TYPE_OPTIONS = [
  {
    value      : COMM_CONSTANTS.MEET_APPLY_TYPE_FIRST,
    title      : '선착순',
    description: '선착순으로 모집되며 빠르게 자리가 채워져요.',
    Icon       : IconApplyFirst,
  },
  {
    value      : COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE,
    title      : '승인제',
    description: '호스트가 신청자를 검토 후 직접 승인해요.',
    Icon       : IconApplyApprove,
  },
];

export default function ApplyTypeInput({ questionFieldName = 'meet_question' }) {
  const { control, watch } = useFormContext<FieldValues>();
  const applyType = watch('apply_type');

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>신청방식</Text>
      <Controller
        name="apply_type"
        control={control}
        rules={{ required: '신청방식을 선택해주세요.' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            {APPLY_TYPE_OPTIONS.map(({ value: optValue, title, description, Icon }) => (
              <TouchableOpacity
                key={optValue}
                style={[styles.applyContainer, value === optValue && styles.applySelected]}
                onPress={() => onChange(optValue)}>
                <Icon width={20} color={value !== optValue ? COLOR.COLOR_373737 : COLOR.APP_ACTIVE_5} />
                <View style={styles.subContainer}>
                  <Text style={[styles.applyTypeTitle, value === optValue && styles.applySelectedText]}>{title}</Text>
                  <Text style={[styles.applyTypeDesc, value === optValue && styles.applySelectedText]}>{description}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />
      {/* 승인제 선택 시 질문 입력 */}
      {applyType === COMM_CONSTANTS.MEET_APPLY_TYPE_APPROVE && (
        <View style={{ marginTop: 10 }}>
          <QuestionInput name={questionFieldName} />
          <View style={COMM_STYLES.infoContainer}>
            <View style={COMM_STYLES.infoTitleRow}>
              <IconInfoMark />
              <Text style={COMM_STYLES.infoTitle}>질문 작성시 주의해 주세요.</Text>
            </View>
            <Text style={styles.infoDesc}>· 과도한 개인 정보를 요구하는 경우 가이드 위반으로 경고 및 제재를 받게 될 수 있어요.</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop           : 30,
    marginHorizontal    : 16,
    marginBottom        : 30,
    gap                 : 16,
  },
  containerTitle: {
    fontSize            : 20,
    fontWeight          : 'bold',
    marginBottom        : 8,
  },
  subContainer: {
    marginStart         : 6,
  },
  applyContainer: {
    flexDirection       : 'row',
    alignItems          : 'center',
    borderColor         : COLOR.COMM_GRAY_6,
    borderRadius        : 8,
    borderWidth         : 1,
    paddingStart        : 28,
    paddingVertical     : 16,
    gap                 : 12,
  },
  applyTypeTitle: {
    fontSize            : 16,
    fontWeight          : 'bold',
    marginBottom        : 8,
  },
  applyTypeDesc: {
    fontSize            : 14,
    color               : COLOR.COMM_GRAY_2,
  },
  applySelected: {
    borderColor         : COLOR.APP_ACTIVE_5,
    borderWidth         : 1,
  },
  applySelectedText: {
    color               : COLOR.APP_ACTIVE_4,
  },
  errorText: {
    fontSize            : 12,
    color               : COLOR.APP_ACTIVE_5,
  },
  infoDesc: {
    fontSize            : 12,
    color               : COLOR.TEXT_DEFAULT,
  },
});
