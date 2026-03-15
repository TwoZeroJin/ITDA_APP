import { COLOR } from '@/constants';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type BottomPlaceSearchListItem = {
  id: string;
  title: string;
  description: string;
};

type KakaoPlaceDocument = {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
};

type KakaoKeywordSearchResponse = {
  documents?: KakaoPlaceDocument[];
};

interface BottomPlaceSearchListModalProps {
  visible: boolean;
  title: string;
  placeholder?: string;
  emptyText?: string;
  defaultItems?: BottomPlaceSearchListItem[];
  onClose: () => void;
  onSelectItem: (item: BottomPlaceSearchListItem) => void;
  renderItemIcon?: ReactNode;
}

/**
 * 장소 검색 모달 컴포넌트
 */
function BottomPlaceSearchListModal({
  visible,
  title,
  placeholder = '검색어를 입력해 주세요.',
  emptyText = '검색 결과가 없어요.',
  defaultItems = [],
  onClose,
  onSelectItem,
  renderItemIcon,
}: BottomPlaceSearchListModalProps) {
  const sheetTranslateY = useRef(new Animated.Value(560)).current;
  const [isModalVisible, setIsModalVisible] = useState(visible);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BottomPlaceSearchListItem[]>(defaultItems);
  const isClosingRef = useRef(false);

  const searchPlaceByKeyword = useCallback(async (value: string) => {
    const trimmedKeyword = value.trim();
    const kakaoRestApiKey = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;

    if (!trimmedKeyword) {
      setItems(defaultItems);
      return;
    }

    if (!kakaoRestApiKey) {
      const fallbackList = defaultItems.filter((item) => (
        item.title.includes(trimmedKeyword) || item.description.includes(trimmedKeyword)
      ));

      setItems(fallbackList);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(trimmedKeyword)}&size=10`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `KakaoAK ${kakaoRestApiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Kakao place search failed: ${response.status}`);
      }

      const data: KakaoKeywordSearchResponse = await response.json();

      const searchedPlaceList: BottomPlaceSearchListItem[] = (data.documents ?? []).map((item, index) => {
        const address = item.road_address_name || item.address_name || '';

        return {
          id: item.id || `${index}`,
          title: item.place_name || '장소명 없음',
          description: address,
        };
      });

      setItems(searchedPlaceList.length > 0 ? searchedPlaceList : []);
    } catch (error) {
      const fallbackList = defaultItems.filter((item) => (
        item.title.includes(trimmedKeyword) || item.description.includes(trimmedKeyword)
      ));

      setItems(fallbackList);
      console.log('장소 검색 실패', error);
    } finally {
      setLoading(false);
    }
  }, [defaultItems]);

  const animateOpen = useCallback(() => {
    isClosingRef.current = false;
    sheetTranslateY.setValue(560);
    Animated.timing(sheetTranslateY, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [sheetTranslateY]);

  const animateClose = useCallback((onComplete?: () => void) => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    Animated.timing(sheetTranslateY, {
      toValue: 560,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      isClosingRef.current = false;
      onComplete?.();
    });
  }, [sheetTranslateY]);

  const handleClose = useCallback(() => {
    animateClose(() => {
      setIsModalVisible(false);
      onClose();
    });
  }, [animateClose, onClose]);

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      setKeyword('');
      setItems(defaultItems);
      requestAnimationFrame(() => {
        animateOpen();
      });
      return;
    }

    if (isModalVisible) {
      animateClose(() => {
        setIsModalVisible(false);
      });
    }
  }, [animateClose, animateOpen, defaultItems, isModalVisible, visible]);

  useEffect(() => {
    if (!isModalVisible) {
      return;
    }

    const timer = setTimeout(() => {
      searchPlaceByKeyword(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [isModalVisible, keyword, searchPlaceByKeyword]);

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={handleClose} />

        <Animated.View style={[styles.bottomSheetContainer, { transform: [{ translateY: sheetTranslateY }] }]}>
          <View style={styles.bottomSheetHeader}>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.bottomSheetTitle}>{title}</Text>
            <View style={{ width: 20 }} />
          </View>

          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIconText}>⌕</Text>
            <TextInput
              value={keyword}
              onChangeText={setKeyword}
              placeholder={placeholder}
              placeholderTextColor={COLOR.TEXT_GRAY}
              style={styles.searchInput}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={COLOR.APP_ACTIVE_5} />
              </View>
            )}

            {!loading && items.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyText}</Text>
              </View>
            )}

            {!loading && items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemRow}
                onPress={() => onSelectItem(item)}
              >
                {renderItemIcon ?? null}
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemTitleText}>{item.title}</Text>
                  <Text style={styles.itemDescriptionText}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  modalBackdrop: {
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: COLOR.COMM_WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    minHeight: '62%',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeIconText: {
    fontSize: 20,
    color: COLOR.COLOR_323232,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.COLOR_323232,
  },
  searchInputContainer: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchIconText: {
    fontSize: 24,
    color: COLOR.COLOR_323232,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLOR.COLOR_323232,
    padding: 0,
  },
  listContainer: {
    marginTop: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.COMM_GRAY_6,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.COLOR_323232,
    marginBottom: 4,
  },
  itemDescriptionText: {
    fontSize: 14,
    color: COLOR.TEXT_DEFAULT,
    lineHeight: 32,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLOR.TEXT_GRAY,
  },
});

export type { BottomPlaceSearchListItem };
export default BottomPlaceSearchListModal;
