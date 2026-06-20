import CommHeader from '@/components/comm/CommHeader';
import CustomDialog from '@/components/modal/CustomDialog';
import MemberActionList from '@/components/members/MemberActionList';
import { COMM_STYLES } from '@/constants';
import { useMeetConfirm } from '@/hooks/queries/useMeet';
import { useMemberApplyList } from '@/hooks/queries/useMember';
import { MemberApply } from '@/types';
import { showToast } from '@/utils/commToast';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGroupConfirm } from '@/hooks/queries/useGroup';

/**
 * 가입승인 리스트 화면
 */
export default function ApplyListScreen() {
  const { target_id, target_type } = useLocalSearchParams<{ target_id?: string; target_type?: string }>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ item: MemberApply; use_stat: '1' | '2' } | null>(null);
  const meetConfirm = useMeetConfirm();
  const groupConfirm = useGroupConfirm();

  const { results, refetch } = useMemberApplyList({
    target_id   : target_id ? Number(target_id) : 0,
    target_type : target_type || 'M',
    use_stat    : '0'
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleMutationError = (error: unknown) => {
    const message = error instanceof Error ? error.message : '요청 처리중 오류가 발생했습니다.';
    showToast({ type: 'error', text1: message });
  };

  const handleConfirmPress = (item: MemberApply, use_stat: '1' | '2') => {
    if (target_type === 'M') {
      meetConfirm.mutate({
        meet_id   : target_id ? Number(target_id) : 0,
        mem_id    : item.mem_id,
        use_stat,
      }, {
        onSuccess: () => {
          showToast({ text1: use_stat === '1' ? '가입을 승인했습니다.' : '가입을 거절했습니다.' });
          refetch();
        },
        onError: handleMutationError,
      });
    } else if (target_type === 'G') {
      groupConfirm.mutate({
        group_id : target_id ? Number(target_id) : 0,
        mem_id   : item.mem_id,
        use_stat,
      }, {
        onSuccess: () => {
          showToast({ text1: use_stat === '1' ? '가입을 승인했습니다.' : '가입을 거절했습니다.' });
          refetch();
        },
        onError: handleMutationError,
      });
    }
  };

  const handleOpenConfirmDialog = (item: MemberApply, use_stat: '1' | '2') => {
    setPendingAction({ item, use_stat });
    setIsConfirmDialogVisible(true);
  };

  const handleCancelConfirmDialog = () => {
    setIsConfirmDialogVisible(false);
    setPendingAction(null);
  };

  const handleDialogConfirm = () => {
    if (!pendingAction) {
      return;
    }
    setIsConfirmDialogVisible(false);
    setPendingAction(null);
    handleConfirmPress(pendingAction.item, pendingAction.use_stat);
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader title={'가입 승인'} isBack={true} isLogo={false} isLike={false} isNoti={false} />

      <Text style={COMM_STYLES.sectionTitle}>가입요청</Text>

      <MemberActionList
        members={results}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        emptyText="대기 중인 가입 신청이 없습니다."
        showApplyAnswer={true}
        getActions={(item) => [
          {
            label    : '거절',
            variant  : 'outline',
            disabled : target_type === 'M' ? meetConfirm.isPending : groupConfirm.isPending,
            onPress  : () => handleOpenConfirmDialog(item, '2'),
          },
          {
            label    : '승인',
            variant  : 'solid',
            disabled : target_type === 'M' ? meetConfirm.isPending : groupConfirm.isPending,
            onPress  : () => handleOpenConfirmDialog(item, '1'),
          },
        ]}
      />

      <CustomDialog
        visible={isConfirmDialogVisible}
        title={pendingAction?.use_stat === '1' ? '가입 승인' : '가입 거절'}
        content={pendingAction?.use_stat === '1' ? '신청을 승인하시겠어요?' : '신청을 거절하시겠어요?'}
        cancelLabel="취소"
        confirmLabel="확인"
        onCancel={handleCancelConfirmDialog}
        onConfirm={handleDialogConfirm}
      />
    </View>
  );
}