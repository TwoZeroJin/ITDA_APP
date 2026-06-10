import { COLOR } from "@/constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CustomRadioItem = {
  label: string;
  value: string;
}

interface CommRadioGroupProps {
  items: CustomRadioItem[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * @returns 모임 생성시 사용하는 공통 라디오 그룹 컴포넌트
 */
function CommRadioGroup({ items, value, onChange }: CommRadioGroupProps) {
  return (
    <View style={styles.commRadioBoxContainer}>
      {items.map((item) => {
        const selected = value === item.value;

        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.commRadioBox, selected && styles.commRadioBoxActive]}
            activeOpacity={0.6}
            onPress={() => onChange(item.value)}
          >
            <Text style={[styles.commRadioBoxText, selected && styles.commRadioBoxTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  commRadioBoxContainer: {
    flexDirection     : 'row',
    gap               : 12,
  },
  commRadioBox: {
    justifyContent    : 'center',
    alignItems        : 'center',
    flex              : 1,
    height            : 50,
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    borderRadius      : 12,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  commRadioBoxActive: {
    borderColor       : COLOR.APP_ACTIVE_4,
    backgroundColor   : COLOR.APP_ACTIVE_4,
  },
  commRadioBoxText: {
    fontSize          : 16,
    fontWeight        : 'bold',
    color             : COLOR.COLOR_373737,
  },
  commRadioBoxTextActive: {
    color             : COLOR.COMM_WHITE,
  },
});

export default CommRadioGroup;