import CommHeader from '@/components/comm/CommHeader';
import CustomDialog from '@/components/modal/CustomDialog';
import MemberActionList from '@/components/members/MemberActionList';
import { COMM_STYLES } from '@/constants';
import { useMeetConfirm } from '@/hooks/queries/useMeet';
import { useMemberApplyList } from '@/hooks/queries/useMember';
import { MemberApply } from '@/types';
import React, { useCallback, useState } from 'react';
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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // 함수 메모리 관리를 위한 useCallback 사용, 승인/거절 버튼 클릭 시 호출
  const handleConfirmPress = useCallback(async (item: MemberApply, use_stat: '1' | '2') => {
    if (target_type === 'M') {
      await meetConfirm.mutateAsync({
        meet_id   : target_id ? Number(target_id) : 0,
        mem_id    : item.mem_id,
        use_stat,
      });
    } else if (target_type === 'G') {
      await groupConfirm.mutateAsync({
        group_id : target_id ? Number(target_id) : 0,
        mem_id   : item.mem_id,
        use_stat,
      });
    }
    await refetch();
  }, [meetConfirm, groupConfirm, refetch]);

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
        onConfirm={async () => {
          await handleDialogConfirm();
        }}
      />
    </View>
  );
}