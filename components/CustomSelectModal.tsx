import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Option = {
  label : string;
  value : string | number;
};

interface CustomSelectModalProps {
    options       : Option[];
    value         : string | number | null;
    onChange      : (value: string | number) => void;
    placeholder?  : string;
}

function CustomSelectModal({ options, value, onChange, placeholder = "선택하세요", }: CustomSelectModalProps) {
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
        <Text style={styles.chevron}>▾</Text>
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  triggerText: {
    fontSize: 16,
    color: "#111",
  },
  placeholder: {
    color: "#888",
  },
  chevron: {
    fontSize: 16,
    color: "#888",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#111",
  },
  check: {
    fontSize: 16,
    color: "#2563eb",
  },
});


export default CustomSelectModal;