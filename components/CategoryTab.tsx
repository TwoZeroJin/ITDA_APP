import { COLOR, COMM_CONSTANTS } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CategoryTabProps {
  data: string;
  onPress: (key: string) => void;
}

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: '', label: '전체' },
  { key: COMM_CONSTANTS.CHAT_TYPE_MEET,  label: '소셜링' },
  { key: COMM_CONSTANTS.CHAT_TYPE_GROUP, label: '클럽' },
  { key: COMM_CONSTANTS.CHAT_TYPE_CLASS, label: '클래스' },
];

/**
 * 카테고리 탭 컴포넌트 (소셜링, 클럽, 클래스)
 */
export function CategoryTab({ data, onPress }: CategoryTabProps) {
  return (
    <View style={styles.categoryRow}>
      {CATEGORY_TABS.map((category) => {
        const isActive = data === category.key;
        return (
          <TouchableOpacity
            key={category.key}
            style={[styles.categoryChip, isActive && styles.categoryChipActive]}
            onPress={() => onPress(category.key)}
          >
            <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>{category.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryRow: {
    flexDirection     : "row",
    alignItems        : "center",
    gap               : 8,
    paddingHorizontal : 20,
    paddingTop        : 20,
    paddingBottom     : 18,
  },
  categoryChip: {
    borderRadius      : 18,
    backgroundColor   : COLOR.COMM_GRAY,
    paddingHorizontal : 14,
    paddingVertical   : 7,
  },
  categoryChipActive: {
    backgroundColor   : COLOR.APP_MAIN,
  },
  categoryChipText: {
    fontSize          : 16,
    fontWeight        : '600',
    color             : COLOR.TEXT_GRAY,
  },
  categoryChipTextActive: {
    color             : COLOR.COMM_WHITE,
  },
});
