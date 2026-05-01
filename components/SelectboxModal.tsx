import { COLOR } from '@/constants';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Option = {
  label : string;
  value : string | number;
};

interface SelectboxModalProps {
    options       : Option[];
    value         : string | number | null;
    onChange      : (value: string | number) => void;
    placeholder?  : string;
}

function SelectboxModal({ options, value, onChange, placeholder = "선택하세요", }: SelectboxModalProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View>
      {/* 트리거 버튼 */}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected ? selected.label : placeholder}
        </Text>
      </TouchableOpacity>

      {/* 모달 */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <FlatList
            data={options}
            keyExtractor={(item) => `${item.value}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
                {value === item.value && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    borderRadius      : 12,
    paddingVertical   : 12,
    paddingHorizontal : 16,
    height            : 49,
    flexDirection     : "row",
    justifyContent    : "space-between",
    alignItems        : "center",
  },
  triggerText: {
    fontSize    : 16,
    color       : COLOR.TEXT_DEFAULT,
  },
  placeholder: {
    color       : COLOR.TEXT_GRAY,
  },
  backdrop: {
    flex            : 1,
    backgroundColor : COLOR.COMM_MODAL_BG,
  },
  sheet: {
    position        : "absolute",
    left            : 20,
    right           : 20,
    top             : "30%",
    backgroundColor : COLOR.COMM_WHITE,
    borderRadius    : 12,
    paddingVertical : 8,
    maxHeight       : 300,
  },
  option: {
    flexDirection     : "row",
    justifyContent    : "space-between",
    paddingVertical   : 14,
    paddingHorizontal : 16,
  },
  optionText: {
    fontSize    : 16,
    color       : COLOR.TEXT_DEFAULT,
  },
  check: {
    fontSize    : 16,
    color       : COLOR.APP_MAIN,
  },
});


export default SelectboxModal;