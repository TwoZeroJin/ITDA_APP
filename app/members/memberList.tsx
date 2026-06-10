import CommHeader from '@/components/comm/CommHeader';
import CustomDialog from '@/components/modal/CustomDialog';
import MemberActionList from '@/components/members/MemberActionList';
import { COMM_CONSTANTS, COMM_STYLES } from '@/constants';
import { useMeetCancelApply } from '@/hooks/queries/useMeet';
import { useMemberApplyList } from '@/hooks/queries/useMember';
import { GroupApply, MeetApply, MemberApply } from '@/types';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuthRouter } from '@/components/comm/AuthRoute';
import { useGroupCancelApply } from '@/hooks/queries/useGroup';
import { getMemberInfo } from '@/utils/commUtil';
import { showToast } from '@/utils/commToast';

/**
 * 멤버 관리 리스트 화면
 */
export default function MemberListScreen() {
  const router = useAuthRouter();
  const { target_id, target_type } = useLocalSearchParams<{ target_id?: string; target_type?: string }>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ item: MemberApply } | null>(null);
  const [myMemId, setMyMemId] = useState<number>(0);
  const meetCancelApply = useMeetCancelApply();
  const groupCancelApply = useGroupCancelApply();
  const { results, refetch } = useMemberApplyList({
    target_id   : target_id ? Number(target_id) : 0,
    target_type : target_type || 'M',
    use_stat    : '1'
  });
  const [isHostYn, setIsHostYn] = useState<'Y' | 'N'>('N');

  useEffect(() => {
    const hostMember = results.find(member => member.host_yn === 'Y');
    setIsHostYn(hostMember?.mem_id === myMemId ? 'Y' : 'N');
  }, [results, myMemId]);

  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await getMemberInfo();
      setMyMemId(memberInfo.mem_id ?? 0);
    };

    fetchMyMemberInfo();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleMutationError = (error: unknown) => {
    const message = error instanceof Error ? error.message : '요청 처리중 오류가 발생했습니다.';
    showToast({ type: 'error', text1: message });
  };

  const handleConfirmPress = (item: MemberApply) => {
    if (target_type === 'M') {
      const body = {
        meet_id   : target_id ? Number(target_id) : 0,
        mem_id    : item.mem_id,
      } as MeetApply;
      meetCancelApply.mutateAsync(body, {
        onSuccess: () => {
          showToast({ text1: '회원을 내보냈습니다.' });
          refetch();
        },
        onError: handleMutationError,
      });
    } else if (target_type === 'G') {
      const body = {
        group_id : target_id ? Number(target_id) : 0,
        mem_id   : item.mem_id,
      } as GroupApply;
      groupCancelApply.mutateAsync(body, {
        onSuccess: () => {
          showToast({ text1: '회원을 내보냈습니다.' });
          refetch();
        },
        onError: handleMutationError,
      });
    }
  };

  const handleOpenDialog = (item: MemberApply) => {
    setPendingAction({ item });
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
    handleConfirmPress(pendingAction.item);
    setIsConfirmDialogVisible(false);
    setPendingAction(null);
  };

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
          if (item.my_yn === 'Y') {
            return [];
          }

          const actions: Array<{
            label: string;
            variant: 'solid' | 'outline';
            disabled: boolean;
            onPress: () => void;
          }> = [
            {
              label    : '채팅',
              variant  : 'solid',
              disabled : target_type === 'M' ? meetCancelApply.isPending : groupCancelApply.isPending,
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
          
          // 내가 호스트일 경우에만 내보내기
          if (isHostYn === 'Y') {
            actions.push({
              label    : '내보내기',
              variant  : 'outline',
              disabled : target_type === 'M' ? meetCancelApply.isPending : groupCancelApply.isPending,
              onPress  : () => handleOpenDialog(item),
            })
          }

          return actions;
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