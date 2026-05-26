import MemDefault from '@/assets/images/icon_mem_default.svg';
import { COLOR } from '@/constants';
import { MemberApply } from '@/types';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type MemberCardAction = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'outline' | 'solid';
};

interface MemberActionListProps {
  members: MemberApply[];
  isRefreshing: boolean;
  onRefresh: () => Promise<void> | void;
  emptyText: string;
  showApplyAnswer?: boolean;
  getActions?: (item: MemberApply) => MemberCardAction[];
}

export default function MemberActionList({ members, isRefreshing, onRefresh, emptyText, showApplyAnswer = false, getActions }: MemberActionListProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});

  const data = useMemo(() => members, [members]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => `${item.target_type}-${item.target_id}-${item.mem_id}`}
      renderItem={({ item }) => {
        const hasError = imageErrors[item.mem_id];
        const imageSource = item.mem_image_url && !hasError
          ? { uri: item.mem_image_url }
          : null;
        const isExpanded = !!expandedMap[item.mem_id];
        const actions = getActions ? getActions(item) : [];

        return (
          <View style={styles.cardContainer}>
            <View style={styles.memberCard}>
              <View style={styles.topRow}>
                <View style={styles.profileRow}>
                  <View style={styles.memberImageWrap}>
                    {imageSource ? (
                      <Image
                        source={imageSource}
                        style={styles.memberImage}
                        onError={() => setImageErrors((prev) => ({ ...prev, [item.mem_id]: true }))}
                      />
                    ) : (
                      <MemDefault width={40} height={40} />
                    )}
                  </View>
                  <View style={styles.memberContent}>
                    <Text style={styles.memberName}>{item.mem_nick}</Text>
                    <Text style={styles.memberInfo} numberOfLines={1}>{item.mem_info}</Text>
                  </View>
                </View>

                {actions.length > 0 && (
                  <View style={styles.buttonRow}>
                    {actions.map((action, index) => {
                      const isOutline = action.variant === 'outline';

                      return (
                        <TouchableOpacity
                          key={`${action.label}-${index}`}
                          style={isOutline ? styles.rejectButton : styles.approveButton}
                          activeOpacity={0.6}
                          disabled={action.disabled}
                          onPress={action.onPress}
                        >
                          <Text style={isOutline ? styles.rejectText : styles.approveText}>{action.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {showApplyAnswer && (
                <View style={styles.descriptionWrap}>
                  <Text style={styles.memberAnswer} numberOfLines={isExpanded ? undefined : 2}>
                    {item.apply_answer}
                  </Text>
                  {!isExpanded && !!item.apply_answer && (
                    <TouchableOpacity onPress={() => setExpandedMap((prev) => ({ ...prev, [item.mem_id]: true }))}>
                      <Text style={styles.moreText}>더보기</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <View style={styles.bottomDivider} />
            </View>
          </View>
        );
      }}
      contentContainerStyle={[
        styles.listContainer,
        data.length === 0 && styles.listContainerEmpty,
      ]}
      showsVerticalScrollIndicator={false}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal : 16,
    paddingVertical   : 16,
  },
  listContainerEmpty: {
    flexGrow          : 1,
  },
  cardContainer: {
    marginBottom      : 12,
  },
  memberCard: {
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 12,
    paddingVertical   : 10,
  },
  topRow: {
    flexDirection     : 'row',
    justifyContent    : 'space-between',
    alignItems        : 'center',
    gap               : 10,
  },
  profileRow: {
    flexDirection     : 'row',
    alignItems        : 'center',
    flex              : 1,
  },
  memberImageWrap: {
    width             : 40,
    height            : 40,
    borderRadius      : 20,
    alignItems        : 'center',
    justifyContent    : 'center',
    backgroundColor   : COLOR.COMM_GRAY_4,
  },
  memberImage: {
    width             : 40,
    height            : 40,
    borderRadius      : 20,
  },
  memberContent: {
    flex              : 1,
    marginStart       : 12,
    justifyContent    : 'center',
  },
  memberName: {
    fontSize          : 18,
    fontFamily        : 'Pretendard-Bold',
    color             : COLOR.TEXT_DEFAULT,
  },
  memberInfo: {
    fontSize          : 12,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_GRAY,
    marginTop         : 2,
  },
  buttonRow: {
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 10,
  },
  rejectButton: {
    width             : 80,
    height            : 36,
    borderRadius      : 8,
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    alignItems        : 'center',
    justifyContent    : 'center',
    backgroundColor   : COLOR.COMM_WHITE,
  },
  approveButton: {
    width             : 80,
    height            : 36,
    borderRadius      : 8,
    alignItems        : 'center',
    justifyContent    : 'center',
    backgroundColor   : COLOR.APP_ACTIVE_4,
  },
  rejectText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
  },
  approveText: {
    fontSize          : 14,
    color             : COLOR.COMM_WHITE,
    fontFamily        : 'Pretendard-Regular',
  },
  descriptionWrap: {
    marginTop         : 12,
    flexDirection     : 'row',
    alignItems        : 'flex-end',
    gap               : 6,
    paddingHorizontal : 6,
  },
  memberAnswer: {
    flex              : 1,
    fontSize          : 16,
    fontFamily        : 'Pretendard-Regular',
    lineHeight        : 22,
    color             : COLOR.TEXT_DEFAULT,
  },
  moreText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Medium',
    color             : COLOR.COLOR_BABABA,
  },
  bottomDivider: {
    marginTop         : 16,
    borderBottomWidth : 1,
    borderBottomColor : COLOR.COMM_GRAY_6,
  },
  emptyContainer: {
    flex              : 1,
    justifyContent    : 'center',
    alignItems        : 'center',
    paddingBottom     : 80,
  },
  emptyText: {
    color             : COLOR.TEXT_GRAY,
    fontSize          : 14,
  },
});
