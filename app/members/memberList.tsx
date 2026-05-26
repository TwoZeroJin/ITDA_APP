import CommHeader from '@/components/comm/CommHeader';
import CustomDialog from '@/components/modal/CustomDialog';
import MemberActionList from '@/components/members/MemberActionList';
import { COMM_CONSTANTS, COMM_STYLES } from '@/constants';
import { useMeetCancelApply } from '@/hooks/queries/useMeet';
import { useMemberApplyList } from '@/hooks/queries/useMember';
import { MeetApply, MemberApply } from '@/types';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuthRouter } from '@/components/comm/AuthRoute';

/**
 * 멤버 관리 리스트 화면
 */
export default function MemberListScreen() {
  const router = useAuthRouter();
  const { target_id, target_type } = useLocalSearchParams<{ target_id?: string; target_type?: string }>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ item: MemberApply } | null>(null);
  const meetCancelApply = useMeetCancelApply();

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

  // 함수 메모리 관리를 위한 useCallback 사용, 승인/거절 버튼 클릭 시 호출
  const handleConfirmPress = useCallback(async (item: MemberApply) => {
    const body = {
      meet_id   : target_id ? Number(target_id) : 0,
      mem_id    : item.mem_id,
    } as MeetApply;
    await meetCancelApply.mutateAsync(body);
    await refetch();
  }, [meetCancelApply, refetch]);

  const handleOpenDialog = useCallback((item: MemberApply) => {
    setPendingAction({ item });
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
    await handleConfirmPress(pendingAction.item);
    setIsConfirmDialogVisible(false);
    setPendingAction(null);
  }, [handleConfirmPress, pendingAction]);

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader title={'멤버 관리'} isBack={true} isLogo={false} isLike={false} isNoti={false} />

      <Text style={COMM_STYLES.sectionTitle}>참여 멤버</Text>

      <MemberActionList
        members={results}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        emptyText="참여 중인 멤버가 없습니다."
        getActions={(item) => {
          if (item.my_yn !== 'N') {
            return [];
          }

          return [
            {
              label    : '내보내기',
              variant  : 'outline',
              disabled : meetCancelApply.isPending,
              onPress  : () => handleOpenDialog(item),
            },
            {
              label    : '채팅',
              variant  : 'solid',
              disabled : meetCancelApply.isPending,
              onPress  : () => router.push({
                pathname: '/chats',
                params: {
                  room_id   : item.room_id,
                  room_name : item.mem_nick,
                  room_type : COMM_CONSTANTS.CHAT_TYPE_MEMBER,
                  mem_id    : item.mem_id,
                },
              }),
            },
          ];
        }}
      />

      <CustomDialog
        visible={isConfirmDialogVisible}
        content="이 멤버를 내보내시겠어요?"
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