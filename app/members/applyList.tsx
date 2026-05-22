import CommHeader from '@/components/comm/CommHeader';
import CustomDialog from '@/components/modal/CustomDialog';
import MemDefault from '@/assets/images/icon_mem_default.svg';
import { COLOR, COMM_STYLES } from '@/constants';
import { useMeetConfirm } from '@/hooks/queries/useMeet';
import { useMemberApplyList } from '@/hooks/queries/useMember';
import { MemberApply } from '@/types';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/**
 * 가입승인 리스트 화면
 */
export default function ApplyListScreen() {
  const { target_id, target_type } = useLocalSearchParams<{ target_id?: string; target_type?: string }>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ item: MemberApply; use_stat: '1' | '2' } | null>(null);
  const meetConfirm = useMeetConfirm();

  const { results, refetch } = useMemberApplyList({
    target_id   : target_id ? Number(target_id) : 0,
    target_type : target_type || 'M',
    use_stat    : '0'
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // 함수 메모리 관리를 위한 useCallback 사용, 승인/거절 버튼 클릭 시 호출
  const handleConfirmPress = useCallback(async (item: MemberApply, use_stat: '1' | '2') => {
    await meetConfirm.mutateAsync({
      meet_id   : target_id ? Number(target_id) : 0,
      mem_id    : item.mem_id,
      use_stat,
    });
    await refetch();
  }, [meetConfirm, refetch]);

  const handleOpenConfirmDialog = useCallback((item: MemberApply, use_stat: '1' | '2') => {
    setPendingAction({ item, use_stat });
    setIsConfirmDialogVisible(true);
  }, []);

  const handleCancelConfirmDialog = useCallback(() => {
    setIsConfirmDialogVisible(false);
    setPendingAction(null);
  }, []);

  const handleDialogConfirm = useCallback(async () => {
    if (!pendingAction) {
      return;
    }
    await handleConfirmPress(pendingAction.item, pendingAction.use_stat);
    setIsConfirmDialogVisible(false);
    setPendingAction(null);
  }, [handleConfirmPress, pendingAction]);

  const visibleMembers = useMemo(() => results, [results]);

  const renderMemberCard = ({ item }: { item: MemberApply }) => {
    const hasError = imageErrors[item.mem_id];
    const isExpanded = !!expandedMap[item.mem_id];
    const imageSource = item.mem_image_url && !hasError
      ? { uri: item.mem_image_url }
      : null;

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

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.rejectButton}
                activeOpacity={0.6}
                disabled={meetConfirm.isPending}
                onPress={() => handleOpenConfirmDialog(item, '2')}
              >
                <Text style={styles.rejectText}>거절</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.approveButton}
                activeOpacity={0.6}
                disabled={meetConfirm.isPending}
                onPress={() => handleOpenConfirmDialog(item, '1')}
              >
                <Text style={styles.approveText}>승인</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.descriptionWrap}>
            <Text style={styles.memberAnswer} numberOfLines={isExpanded ? undefined : 2}>
              {item.apply_answer}
            </Text>
            {!isExpanded && (
              <TouchableOpacity onPress={() => setExpandedMap((prev) => ({ ...prev, [item.mem_id]: true }))}>
                <Text style={styles.moreText}>더보기</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.bottomDivider} />
        </View>
      </View>
    );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader title={'가입 승인'} isBack={true} isLogo={false} isLike={false} isNoti={false} />

      <Text style={styles.sectionTitle}>가입요청</Text>

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

      <CustomDialog
        visible={isConfirmDialogVisible}
        title={pendingAction?.use_stat === '1' ? '가입 승인' : '가입 거절'}
        content={pendingAction?.use_stat === '1' ? '신청을 승인하시겠어요?' : '신청을 거절하시겠어요?'}
        cancelLabel="취소"
        confirmLabel="확인"
        onCancel={handleCancelConfirmDialog}
        onConfirm={async () => {
          await handleDialogConfirm();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-light',
    color             : COLOR.TEXT_DEFAULT,
    marginTop         : 16,
    marginHorizontal  : 16,
  },
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