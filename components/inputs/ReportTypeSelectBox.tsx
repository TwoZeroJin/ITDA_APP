import SelectboxModal from "@/components/modal/SelectboxModal";
import { COLOR, COMM_STYLES } from "@/constants";
import { CodeInfo } from "@/types";
import { getReportList } from "@/utils/commUtil";
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

function ReportTypeSelectBox() {
  const { control } = useFormContext();
  const [reportList, setReportList] = useState<CodeInfo[]>([]);

  useEffect(() => {
    const loadReportList = async () => {
      setReportList(await getReportList());
    };

    loadReportList();
  }, []);

  const reportOptions = useMemo(() => {
    return reportList.map((report) => ({
      label: report.code_value,
      value: report.code_id,
    }));
  }, [reportList]);

  return (
    <Controller
        name='report_type'
        control={control}
        rules={{
          validate: (data: number | string) => {
            if (!data) {
              return '신고 분류를 선택하세요.';
            }
          }
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <View>
            <Text style={COMM_STYLES.label}>신고 분류</Text>
            <SelectboxModal
              options={reportOptions}
              value={value ?? null}
              onChange={(selectedValue) => {
                const selectedReport = reportList.find((report) => (
                  String(report.code_id) === String(selectedValue)
                  || report.code_value === String(selectedValue)
                ));

                onChange(selectedReport?.code_id ?? Number(selectedValue));
              }}
              placeholder="신고 분류를 선택하세요."
            />
            {Boolean(error?.message) && <Text style={styles.error}>{error?.message}</Text>}
          </View>
        )}
    />
  )
}

const styles = StyleSheet.create({
  error: {
    marginTop   : 5,
    marginStart : 5,
    fontSize    : 12,
    color       : COLOR.COMM_RED,
  },
});

export default ReportTypeSelectBox;