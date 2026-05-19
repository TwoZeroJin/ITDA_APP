import { COLOR } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface MenuItem {
  label: string;
  onPress: () => void;
  color?: string;
}

interface DropdownMenuProps {
  items: MenuItem[];
  position?: 'left' | 'right';
}

/**
 * 드롭다운 메뉴 컴포넌트
 */
export default function DropdownMenu({ items, position = 'right' }: DropdownMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleItemPress = (onPress: () => void) => {
    onPress();
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuTrigger}
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color={COLOR.COMM_BLACK} />
      </TouchableOpacity>

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
    position            : 'absolute',
    top                 : 40,
    right               : 0,
    backgroundColor     : COLOR.COMM_WHITE,
    borderRadius        : 8,
    minWidth            : 120,
    shadowColor         : COLOR.COMM_BLACK,
    shadowOpacity       : 0.15,
    shadowOffset        : { width: 0, height: 2 },
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
    fontWeight          : '500',
  },
  menuDivider: {
    height              : 1,
    backgroundColor     : COLOR.COMM_GRAY_6,
  },
});
