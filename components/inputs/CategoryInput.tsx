import { COLOR } from '@/constants';
import { CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import React, { useEffect, useState } from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CategoryInputProps = {
  name: string;
};

export default function CategoryInput({ name }: CategoryInputProps) {
  const { control } = useFormContext<FieldValues>();
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);

  useEffect(() => {
    (async () => {
      const nextCategoryList = await getCategoryList();
      setCategoryList(nextCategoryList);
    })();
  }, []);

  return (
    <View style={styles.commContainer}>
      <Controller
        name={name as Path<FieldValues>}
        control={control}
        render={({ field: { value, onChange } }) => (
          <View style={styles.categoryContainer}>
            {categoryList.map((item) => {
              const selected = value === item.code_id;

              return (
                <TouchableOpacity
                  key={item.code_id}
                  style={[styles.categoryBox, selected && styles.categoryBoxSelected]}
                  onPress={() => onChange(item.code_id)}>
                  <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{item.code_value}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  commContainer: {
    marginTop           : 30,
    marginHorizontal    : 16,
    marginBottom        : 30,
    gap                 : 16,
  },
  categoryContainer: {
    flexDirection       : 'row',
    flexWrap            : 'wrap',
    alignItems          : 'center',
    gap                 : 10,
  },
  categoryBox: {
    width               : '30.5%',
    height              : 42,
    borderRadius        : 12,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    justifyContent      : 'center',
    alignItems          : 'center',
    backgroundColor     : COLOR.COMM_WHITE,
  },
  categoryBoxSelected: {
    borderColor         : COLOR.APP_ACTIVE_4,
    backgroundColor     : COLOR.COMM_WHITE,
  },
  categoryText: {
    fontSize            : 16,
    fontWeight          : '600',
    color               : COLOR.COLOR_323232,
  },
  categoryTextSelected: {
    color               : COLOR.APP_ACTIVE_5,
  },
});