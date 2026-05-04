import SelectboxModal from "@/components/SelectboxModal";
import { COLOR } from "@/constants";
import { ChurchData } from "@/types";
import { getChurchList } from "@/utils/commUtil";
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

function ChurchSelectBox() {
  const {control} = useFormContext();
  const [churchList, setChurchList] = useState<ChurchData[]>([]);

  useEffect(() => {
    const loadChurchList = async () => {
      setChurchList(await getChurchList());
    };

    loadChurchList();
  }, []);

  const churchOptions = useMemo(() => {
    return churchList.map((church) => ({
      label: church.church_name,
      value: church.church_id,
    }));
  }, [churchList]);

  return (
    <Controller
        name='mem_church_id'
        control={control}
        rules={{
          validate: (data: number | string) => {
            if (!data) {
              return '교회를 선택해주세요.';
            }
          }
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
      <View>
        <Text style={styles.label}>교회</Text>
        <SelectboxModal
          options={churchOptions}
          value={value ?? null}
          onChange={(selectedValue) => {
            const selectedChurch = churchList.find((church) => (
              String(church.church_id) === String(selectedValue)
              || church.church_name === String(selectedValue)
            ));

            onChange(selectedChurch?.church_id ?? Number(selectedValue));
          }}
          placeholder="교회를 선택하세요."
        />
        {Boolean(error?.message) && <Text style={styles.error}>{error?.message}</Text>}
      </View>
        )}
    />
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize        : 14,
    fontWeight      : 400,
    lineHeight      : 22,
    color           : COLOR.TEXT_DEFAULT,
    marginStart     : 5,
    marginBottom    : 7,
  },
  error: {
    marginTop   : 5,
    marginStart : 5,
    fontSize    : 12,
    color       : COLOR.COMM_RED,
  },
});

export default ChurchSelectBox;