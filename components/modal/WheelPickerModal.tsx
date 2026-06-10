import { COLOR } from "@/constants";
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from "react";
import { FlatList, InteractionManager, Modal, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type WheelOption = {
  label     : string;
  value     : string;
};
export type WheelColumnConfig = {
  options           : WheelOption[];
  selectedValue     : string;
  onChange          : (value: string) => void;
};
type WheelPickerModalProps = {
  visible       : boolean;
  /** 각 휠 컬럼 설정을 배열로 전달 */
  columns       : WheelColumnConfig[];
  onClose       : () => void;
  onConfirm     : () => void;
  title?        : string;
  cancelLabel?  : string;
  confirmLabel? : string;
};

type WheelColumnItemProps = WheelColumnConfig & {
  visible: boolean;
};

const WHEEL_ITEM_HEIGHT = 35;
const WHEEL_VISIBLE_ROWS = 5;
const WHEEL_CONTAINER_HEIGHT = WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ROWS;

/**
 * 휠 형태의 선택 UI를 모달로 띄워주는 컴포넌트
 */
function WheelColumnItem({ options, selectedValue, onChange, visible }: WheelColumnItemProps) {
  const listRef = useRef<FlatList<WheelOption>>(null);
  const lastHapticValueRef = useRef<string | null>(null);

  useEffect(() => {
    lastHapticValueRef.current = selectedValue;
  }, [selectedValue]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const selectedIndex = options.findIndex((item) => item.value === selectedValue);

    if (selectedIndex < 0) {
      return;
    }

    const interactionTask = InteractionManager.runAfterInteractions(() => {
      listRef.current?.scrollToOffset({
        offset: selectedIndex * WHEEL_ITEM_HEIGHT,
        animated: true,
      });
    });

    return () => {
      interactionTask.cancel();
    };

  }, [options, selectedValue, visible]);

  const handleScrollFinish = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = Math.round(event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT);
    const normalizedIndex = Math.min(Math.max(rawIndex, 0), options.length - 1);
    const nextOption = options[normalizedIndex];

    if (!nextOption || nextOption.value === selectedValue) {
      return;
    }

    // 같은 값에 대한 중복 햅틱은 방지
    if (lastHapticValueRef.current !== nextOption.value) {
      Haptics.selectionAsync();
      lastHapticValueRef.current = nextOption.value;
    }

    onChange(nextOption.value);
  };

  // 휠이 도는 중에도 선택 칸이 바뀌면 햅틱 발생
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = Math.round(event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT);
    const normalizedIndex = Math.min(Math.max(rawIndex, 0), options.length - 1);
    const nextOption = options[normalizedIndex];

    if (!nextOption || lastHapticValueRef.current === nextOption.value) {
      return;
    }

    Haptics.selectionAsync();
    lastHapticValueRef.current = nextOption.value;
  };

  // 스크롤이 완전히 멈췄을 때 선택된 아이템을 확정
  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScrollFinish(event);
  };

  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const velocityY = event.nativeEvent.velocity?.y ?? 0;

    // 손을 놓은 뒤 관성 스크롤이 거의 없을 때만 즉시 확정
    if (Math.abs(velocityY) < 0.05) {
      handleScrollFinish(event);
    }
  };

  return (
    <View style={styles.column}>
      <View style={styles.wheelContainer}>
        <FlatList
          ref={listRef}
          data={options}
          keyExtractor={(item) => item.value}
          showsVerticalScrollIndicator={false}
          decelerationRate={0.995}
          snapToInterval={WHEEL_ITEM_HEIGHT}
          snapToAlignment="center"
          bounces={true}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}
          overScrollMode="never"
          getItemLayout={(_, index) => ({
            length: WHEEL_ITEM_HEIGHT,
            offset: WHEEL_ITEM_HEIGHT * index,
            index,
          })}
          contentContainerStyle={styles.wheelContent}
          renderItem={({ item }) => {
            const isSelected = item.value === selectedValue;

            return (
              <View style={styles.wheelItem}>
                <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                  {item.label}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

function WheelPickerModal({ visible, columns, onClose, onConfirm, cancelLabel = "취소", confirmLabel = "확인" }: WheelPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={0.6} onPress={onClose} />
        <View style={styles.container}>
          <View style={styles.pickerWrapper}>
            <View pointerEvents="none" style={styles.highlight} />
            {columns.map((col, index) => (
              <WheelColumnItem key={index} {...col} visible={visible} />
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.6}>
              <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm} activeOpacity={0.6}>
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex                : 1,
    justifyContent      : "center",
    paddingHorizontal   : 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor     : COLOR.COMM_MODAL_BG,
  },
  container: {
    borderRadius        : 10,
    backgroundColor     : COLOR.COMM_WHITE,
    overflow            : "hidden",
  },
  column: {
    width               : "15%",
  },
  wheelContainer: {
    height              : WHEEL_CONTAINER_HEIGHT,
    overflow            : "hidden",
  },
  wheelContent: {
    paddingVertical     : (WHEEL_CONTAINER_HEIGHT - WHEEL_ITEM_HEIGHT) / 2,
  },
  wheelItem: {
    height              : WHEEL_ITEM_HEIGHT,
    alignItems          : "center",
    justifyContent      : "center",
  },
  itemText: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COMM_GRAY_2,
  },
  itemTextSelected: {
    fontSize            : 20,
    fontFamily          : 'Pretendard-Medium',
    color               : COLOR.COMM_BLACK,
  },
  highlight: {
    position            : "absolute",
    top                 : 16 + (WHEEL_CONTAINER_HEIGHT - WHEEL_ITEM_HEIGHT) / 2,
    height              : WHEEL_ITEM_HEIGHT,
    width               : "100%",
    backgroundColor     : COLOR.COMM_GRAY_8,
  },
  pickerWrapper: {
    flexDirection       : "row",
    justifyContent      : "center",
    alignItems          : "center",
    gap                 : 8,
    paddingTop          : 16,
    paddingBottom       : 8,
  },
  buttonRow: {
    flexDirection       : "row",
  },
  cancelButton: {
    flex                    : 1,
    height                  : 55,
    borderBottomLeftRadius  : 10,
    justifyContent          : "center",
    alignItems              : "center",
    backgroundColor         : COLOR.COMM_GRAY_6,
  },
  cancelButtonText: {
    fontSize        : 16,
    fontFamily      : 'Pretendard-Medium',
    color           : COLOR.TEXT_DEFAULT,
    alignSelf       : "center",
  },
  confirmButton: {
    flex                    : 1,
    height                  : 55,
    borderBottomRightRadius : 10,
    justifyContent          : "center",
    alignItems              : "center",
    backgroundColor         : COLOR.APP_MAIN,
  },
  confirmButtonText: {
    fontSize        : 16,
    fontFamily      : 'Pretendard-Medium',
    color           : COLOR.COMM_WHITE,
    alignSelf       : "center",
  },
});

export default WheelPickerModal;
