import { COLOR } from '@/constants';
import { CodeInfo, SignupInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InterestCategoryInput() {
  const { control } = useFormContext<SignupInfo>();
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setCategoryList(await getCategoryList());
    };

    fetchData();
  }, []);

  return (
    <Controller
      name="mem_interest"
      control={control}
      rules={{
        validate: (value?: string) => {
          const selectedIds = value ? value.split('|').filter(Boolean) : [];
          if (selectedIds.length < 2) {
            return '관심분야를 최소 2개 이상 선택해주세요.';
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedCategoryIds = value ? value.split('|').filter(Boolean) : [];

        const toggleSelect = (item: CodeInfo) => {
          const currentIds = value ? value.split('|').filter(Boolean) : [];
          const isAlreadySelected = currentIds.includes(item.code_id);

          const nextIds = isAlreadySelected
            ? currentIds.filter((codeId) => codeId !== item.code_id)
            : [...currentIds, item.code_id];

          onChange(nextIds.join('|'));
        };

        return (
          <>
            <Text style={styles.title}>관심분야</Text>
            <Text style={styles.subtitle}>
              관심있는 취미가 우선적으로 보여져요 {'\n'}(최소 2개)
            </Text>

            {categoryList.map((category, idx) => (
              <View key={idx} style={styles.categoryBox}>
                <Text style={styles.categoryTitle}>{category.code_value}</Text>
                <View style={styles.buttonGroup}>
                  {category.sub_list?.map((item) => {
                    const isSelected = selectedCategoryIds.includes(item.code_id);
                    return (
                      <TouchableOpacity
                        key={item.code_id}
                        style={[styles.itemButton, isSelected && styles.itemButtonSelected]}
                        activeOpacity={0.6}
                        onPress={() => toggleSelect(item)}
                      >
                        <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                          {item.code_value}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            {Boolean(error?.message) && <Text style={styles.error}>{error?.message}</Text>}
          </>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize            : 23,
    fontWeight          : 'bold',
    color               : COLOR.TEXT_DEFAULT,
    textAlign           : 'left',
    marginTop           : 20,
    marginBottom        : 10,
    marginHorizontal    : 20,
  },
  subtitle: {
    textAlign           : 'left',
    color               : COLOR.COMM_GRAY_7,
    marginBottom        : 22,
    marginHorizontal    : 20,
    fontSize            : 16,
    lineHeight          : 28,
  },
  categoryBox: {
    backgroundColor     : COLOR.COMM_GRAY_5,
    borderRadius        : 12,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    padding             : 16,
    marginBottom        : 14,
    marginHorizontal    : 16,
  },
  categoryTitle: {
    fontSize            : 20,
    fontFamily          : 'Pretendard-SemiBold',
    color               : COLOR.TEXT_1C1C1C,
    marginBottom        : 12,
  },
  buttonGroup: {
    flexDirection       : 'row',
    flexWrap            : 'wrap',
    gap                 : 10,
  },
  itemButton: {
    justifyContent      : 'center',
    alignItems          : 'center',
    width               : '31%',
    height              : 40,
    paddingHorizontal   : 8,
    paddingVertical     : 5,
    borderWidth         : 1,
    borderRadius        : 8,
    borderColor         : COLOR.COMM_GRAY_6,
    backgroundColor     : COLOR.COMM_WHITE,
  },
  itemButtonSelected: {
    borderColor         : COLOR.APP_ACTIVE_5,
  },
  itemText: {
    color               : COLOR.COMM_GRAY_7,
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
  },
  itemTextSelected: {
    color               : COLOR.APP_ACTIVE_5,
  },
  error: {
    marginHorizontal    : 20,
    marginBottom        : 16,
    color               : COLOR.COMM_RED,
    fontSize            : 12,
  },
});
