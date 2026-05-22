import CommHeader from '@/components/comm/CommHeader';
import MemDefault from '@/assets/images/icon_mem_default.svg';
import { COLOR, COMM_STYLES } from '@/constants';
import { useMemberApplyList } from '@/hooks/queries/useMember';
import { MemberApply } from '@/types';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/**
 * 멤버관리 리스트 화면
 */
export default function MemberListScreen() {
  const { target_id, target_type } = useLocalSearchParams<{ target_id?: string; target_type?: string }>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const { results, refetch } = useMemberApplyList({
    target_id   : target_id ? Number(target_id) : 0,
    target_type : target_type || 'M',
    use_stat    : '1'
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const visibleMembers = useMemo(() => results, [results]);

  const renderMemberCard = ({ item }: { item: MemberApply }) => {
    const hasError = imageErrors[item.mem_id];
    const imageSource = item.mem_image_url && !hasError
      ? { uri: item.mem_image_url }
      : null;

    return (
      <View style={styles.cardContainer}>
        <View style={styles.memberCard}>
          <View style={styles.memberImageWrap}>
            {imageSource ? (
              <Image
                source={imageSource}
                style={styles.memberImage}
                onError={() => setImageErrors((prev) => ({ ...prev, [item.mem_id]: true }))}
              />
            ) : (
              <MemDefault width={52} height={52} />
            )}
          </View>

          <View style={styles.memberContent}>
            <View style={styles.memberTitleRow}>
              <Text style={styles.memberName}>{item.mem_nick}</Text>
              <Text style={styles.memberStatus}>'활성'</Text>
            </View>
            {!!item.mem_info && (
              <Text style={styles.memberInfo} numberOfLines={2}>{item.mem_info}</Text>
            )}
            {!!item.apply_answer && (
              <Text style={styles.memberAnswer} numberOfLines={2}>답변: {item.apply_answer}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader title={'멤버 관리'} isBack={true} isLogo={false} isLike={false} isNoti={false} />

      <FlatList
        data={visibleMembers}
        keyExtractor={(item) => `${item.target_type}-${item.target_id}-${item.mem_id}`}
        renderItem={renderMemberCard}
        contentContainerStyle={[
          styles.listContainer,
          visibleMembers.length === 0 && styles.listContainerEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>대기 중인 가입 신청이 없습니다.</Text>
          </View>
        }
      />
    </View>
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
  centerContainer: {
    flex              : 1,
    justifyContent    : 'center',
    alignItems        : 'center',
  },
  cardContainer: {
    marginBottom      : 12,
  },
  memberCard: {
    flexDirection     : 'row',
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 12,
    padding           : 12,
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    alignItems        : 'center',
  },
  memberImageWrap: {
    width             : 64,
    height            : 64,
    borderRadius      : 32,
    alignItems        : 'center',
    justifyContent    : 'center',
    backgroundColor   : COLOR.COMM_GRAY_4,
  },
  memberImage: {
    width             : 64,
    height            : 64,
    borderRadius      : 32,
  },
  memberContent: {
    flex              : 1,
    marginStart       : 12,
    justifyContent    : 'center',
    gap               : 4,
  },
  memberTitleRow: {
    flexDirection     : 'row',
    justifyContent    : 'space-between',
    alignItems        : 'center',
    gap               : 8,
  },
  memberName: {
    flex              : 1,
    fontSize          : 16,
    fontWeight        : 'bold',
    color             : COLOR.TEXT_3C3C3C,
  },
  memberStatus: {
    fontSize          : 13,
    color             : COLOR.APP_ACTIVE_3,
    fontWeight        : '600',
  },
  memberInfo: {
    fontSize          : 12,
    color             : COLOR.COMM_SHADOW,
  },
  memberAnswer: {
    fontSize          : 12,
    color             : COLOR.TEXT_DEFAULT,
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