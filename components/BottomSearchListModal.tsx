import { COLOR } from '@/constants';
import React, { ReactNode } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type BottomSearchListItem = {
  id: string;
  title: string;
  description: string;
};

interface BottomSearchListModalProps {
  visible: boolean;
  title: string;
  keyword: string;
  placeholder?: string;
  loading?: boolean;
  emptyText?: string;
  items: BottomSearchListItem[];
  onClose: () => void;
  onChangeKeyword: (value: string) => void;
  onSelectItem: (item: BottomSearchListItem) => void;
  renderItemIcon?: ReactNode;
}

function BottomSearchListModal({
  visible,
  title,
  keyword,
  placeholder = '검색어를 입력해 주세요.',
  loading = false,
  emptyText = '검색 결과가 없어요.',
  items,
  onClose,
  onChangeKeyword,
  onSelectItem,
  renderItemIcon,
}: BottomSearchListModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} />

        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.bottomSheetTitle}>{title}</Text>
            <View style={{ width: 20 }} />
          </View>

          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIconText}>⌕</Text>
            <TextInput
              value={keyword}
              onChangeText={onChangeKeyword}
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
        </View>
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
    fontSize: 24,
    color: COLOR.COLOR_323232,
  },
  bottomSheetTitle: {
    fontSize: 32,
    fontWeight: '700',
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
    fontSize: 24,
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
    fontSize: 29,
    fontWeight: '600',
    color: COLOR.COLOR_323232,
    marginBottom: 4,
  },
  itemDescriptionText: {
    fontSize: 24,
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

export type { BottomSearchListItem };
export default BottomSearchListModal;
