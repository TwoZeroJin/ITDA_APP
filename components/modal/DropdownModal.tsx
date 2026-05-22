import { COLOR } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

interface MenuItem {
  label   : string;
  onPress : () => void;
  color?  : string;
}

interface DropdownModalProps {
  items             : MenuItem[];
  position?         : 'left' | 'right';
  visible?          : boolean;
  onVisibleChange?  : (visible: boolean) => void;
}

/**
 * 드롭다운 메뉴 컴포넌트
 */
export default function DropdownModal({ items, position = 'right', visible, onVisibleChange }: DropdownModalProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const menuVisible = visible ?? internalVisible;

  const setMenuVisible = (nextVisible: boolean) => {
    if (visible === undefined) {
      setInternalVisible(nextVisible);
    }
    onVisibleChange?.(nextVisible);
  };

  const handleItemPress = (onPress: () => void) => {
    onPress();
    setMenuVisible(false);
  };
  
return (
    <View style={styles.container}>
      {menuVisible && (
        <View style={[styles.menuPopup, position === 'left' && styles.menuPopupLeft]}>
          {items.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleItemPress(item.onPress)}
              >
                {/* ✅ numberOfLines={1}로 글자가 절대 아래로 줄바꿈되지 않게 방어 */}
                <Text 
                  numberOfLines={1} 
                  style={[styles.menuText, { color: item.color || COLOR.TEXT_DEFAULT }]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
              {index < items.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position            : 'relative',
  },
  menuTrigger: {
    padding             : 8,
  },
  menuPopup: {
    backgroundColor     : COLOR.COMM_TRANSPARENT,
    borderRadius        : 16,
    // width: 200,       <-- ❌ 기존 고정 너비 삭제
    
    // ✅ 텍스트 길이에 맞게 자동으로 크기가 조절되도록 하는 핵심 속성들
    alignSelf           : 'flex-end', // 내용물 크기만큼 너비가 쪼그라들게 만듦
    minWidth            : 100,        // 글자가 너무 짧을 때 모달이 너무 얇아지지 않게 최소 너비 보장
    
    shadowColor         : COLOR.COMM_BLACK,
    shadowOpacity       : 0.2,
    shadowOffset        : { width: 0, height: 4 },
    shadowRadius        : 4,
    elevation           : 5,
    zIndex              : 1000,
  },
  menuPopupLeft: {
    right               : 'auto',
    left                : 0,
    alignSelf           : 'flex-start', // 왼쪽 정렬일 때는 쪼그라드는 방향을 왼쪽 기준으로
  },
  menuItem: {
    paddingVertical     : 12,
    paddingHorizontal   : 18, // ✅ 글자 양옆 여백을 살짝 늘려주면 텍스트 맞춤형일 때 더 예쁩니다.
  },
  menuText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_1A1A1A,
    textAlign           : 'center', // ✅ 모달 내부에서 텍스트가 가운데 정렬되도록 처리
  },
  menuDivider: {
    height              : 1,
    width               : '85%',
    backgroundColor     : COLOR.COLOR_E6E6E6,
    alignSelf           : 'center',
  },
});  