import { COLOR, COMM_CONSTANTS } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CategoryTabProps {
  data      : string;
  onPress   : (key: string) => void;
  isMember? : boolean;
  isMyTab?  : boolean;
}

const TABS_SOCIAL: { key: string; label: string }[] = [
  { key: '', label: '전체' },
  { key: COMM_CONSTANTS.COMM_MEET,  label: '소셜링' },
  { key: COMM_CONSTANTS.COMM_GROUP, label: '클럽' },
  // { key: COMM_CONSTANTS.COMM_CLASS, label: '클래스' },
  { key: COMM_CONSTANTS.COMM_MEMBER, label: '회원' },
];

const TABS_MY: { key: string; label: string }[] = [
  { key: COMM_CONSTANTS.TYPE_APPLY, label: '내가 참여한' },
  { key: COMM_CONSTANTS.TYPE_MY, label: '내가 만든' },
];

/**
 * 카테고리 탭 컴포넌트 (소셜링, 클럽, 클래스, 회원)
 */
export function CategoryTab({ data, onPress, isMember = false, isMyTab = false }: CategoryTabProps) {
  return (
    <View style={styles.categoryRow}>
      {(isMyTab ? TABS_MY : TABS_SOCIAL).map((category) => {
        // 채팅방 카테고리탭에는 회원 추가
        if (!isMember && category.key === COMM_CONSTANTS.COMM_MEMBER) {
          return null;
        }
        const isActive = data === category.key;
        return (
          <TouchableOpacity
            key={category.key}
            style={[styles.categoryChip, isActive && styles.categoryChipActive]}
            activeOpacity={0.6}
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
    backgroundColor   : COLOR.COMM_WHITE,
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
    fontSize          : 14,
    fontFamily        : 'Pretendard-Medium',
    color             : COLOR.TEXT_GRAY,
  },
  categoryChipTextActive: {
    color             : COLOR.COMM_WHITE,
  },
});
