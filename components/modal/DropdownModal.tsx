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
                <Text style={[styles.menuText, { color: item.color || COLOR.TEXT_DEFAULT }]}>
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
    width               : 200,
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
  },
  menuItem: {
    paddingVertical     : 12,
    paddingHorizontal   : 16,
  },
  menuText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_1A1A1A,
  },
  menuDivider: {
    height              : 1,
    width               : '85%',
    backgroundColor     : COLOR.COLOR_E6E6E6,
    alignSelf           : 'center',
  },
});
