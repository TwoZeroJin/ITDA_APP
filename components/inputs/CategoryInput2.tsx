import { COLOR } from '@/constants';
import { CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CategoryInput2Props = {
  name: string;
};

/**
 * 2depth 카테고리 선택 컴포넌트
 */
export default function CategoryInput2({ name }: CategoryInput2Props) {
  const { control } = useFormContext<FieldValues>();
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);

  useEffect(() => {
    (async () => {
      const nextCategoryList = await getCategoryList();
      setCategoryList(nextCategoryList);
    })();
  }, []);

  return (
    <Controller
      name={name as Path<FieldValues>}
      control={control}
      rules={{
        validate: (value?: string) => {
          if (!value?.trim()) {
            return '카테고리를 선택해 주세요.';
          }
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.commContainer}>
          {categoryList.map((category) => {
            const subItems = category.sub_list?.length
              ? category.sub_list
              : [category];

            return (
              <View key={category.code_id} style={styles.categoryBox}>
                <Text style={styles.categoryTitle}>{category.code_value}</Text>
                <View style={styles.buttonGroup}>
                  {subItems.map((item) => {
                    const selected = value === item.code_id;

                    return (
                      <TouchableOpacity
                        key={item.code_id}
                        style={[styles.itemButton, selected && styles.itemButtonSelected]}
                        activeOpacity={0.6}
                        onPress={() => onChange(item.code_id)}
                      >
                        <Text style={[styles.itemText, selected && styles.itemTextSelected]}>{item.code_value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  commContainer: {
    marginTop           : 30,
    marginHorizontal    : 16,
    marginBottom        : 30,
    gap                 : 4,
  },
  categoryBox: {
    backgroundColor     : COLOR.COMM_GRAY_5,
    borderRadius        : 12,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    padding             : 16,
    marginBottom        : 14,
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
  errorText: {
    marginTop           : -6,
    marginHorizontal    : 4,
    marginBottom        : 4,
    color               : COLOR.TEXT_WARN,
    fontSize            : 12,
  },
});