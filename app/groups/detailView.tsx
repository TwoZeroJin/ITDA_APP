import { COLOR, COMM_CONSTANTS, COMM_STYLES } from "@/constants";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, ActivityIndicator, ScrollView, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { useGroupApply, useGroupCancelApply, useGroupDelete } from "@/hooks/queries/useGroup";
import {  FileInfo, GroupApply, GroupInfo } from "@/types";
import {  useLocalSearchParams } from "expo-router";
import ImageCarousel from "@/components/comm/ImageCarousel";
import CommLabel from "@/components/comm/CommLabel";
import IconCalendar from '@/assets/images/icon_calendar.svg';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import IconDetailMarker from '@/assets/images/icon_detail_marker.svg';
import IconDetailCategory from '@/assets/images/icon_detail_category.svg';
import IconDetailMembers from '@/assets/images/icon_detail_members.svg';
import IconDetailFee from '@/assets/images/icon_detail_fee.svg';
import CustomDialog from "@/components/modal/CustomDialog";
import DividingLine from "@/components/DividingLine";
import { useGroupDetailView, useGroupMemberList } from "@/hooks/queries/useGroup";
import { useAuthRouter } from "@/components/comm/AuthRoute";
import DropdownModal from '@/components/modal/DropdownModal';
import { router as expoRouter } from 'expo-router';
import DetailInfoRow from "@/components/comm/DetailInfoRow";
import { formatNumberWithComma } from "@/utils/commUtil";
import PlaceLocationBox from "@/components/PlaceLocationBox";
import HostMemberSection from "@/components/comm/HostMemberSection";
import { showToast } from "@/utils/commToast";

type DialogType = 'none' | 'apply' | 'cancelApply' | 'delete' | 'error';

/**
 * 클럽 상세보기 화면
 */
export default function GroupDetailViewScreen() {
  const { groupId } = useLocalSearchParams();
  const { results : groupInfo } = useGroupDetailView(Number(groupId));  
  const groupApply = useGroupApply();
  const groupCancelApply = useGroupCancelApply();
  const groupDelete = useGroupDelete();
  const [activeDialog, setActiveDialog] = useState<DialogType>('none');
  const router = useAuthRouter();
  const { results : memberList, refetch: refetchMemberList, isLoading : isMemberLoading, isError : isMemberError } = useGroupMemberList(Number(groupId));  
  const [errorMessage, setErrorMessage] = useState('');
  const [isDetailMenuVisible, setIsDetailMenuVisible] = useState(false);
  const [applyStatus, setApplyStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    setApplyStatus(groupInfo?.apply_stat);
  }, [groupInfo?.apply_stat]);

  const handleDeleteSubmit = () => {
    setActiveDialog('none');

    if (!groupInfo?.group_id) {
      setErrorMessage('삭제할 클럽 정보가 없습니다.');
      setActiveDialog('error');
      return;
    }

    groupDelete.mutate(Number(groupInfo.group_id), {
      onSuccess: (result) => {
        if (result.ret_code !== 200) {
          setErrorMessage(result.ext_msg ? result.ext_msg : result.ret_msg);
          setActiveDialog('error');
          return;
        }

        expoRouter.back();
      },
      onError: (error) => {
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setActiveDialog('error');
      },
    });
  };

  if (isMemberLoading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
        <Text style={{ marginTop: 10, color: COLOR.COMM_GRAY_2 }}>클럽 정보를 불러오고 있어요...</Text>
      </View>
    );
  }
  if (isMemberError) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
        <Text style={{ marginTop: 10, color: COLOR.COMM_GRAY_2 }}>클럽 정보를 불러오지 못했습니다...</Text>
      </View>
    );
  }

  //모임 신청처리
  const handleApplySubmit = (answer: string) => {
    setActiveDialog('none');

    if(groupInfo?.apply_type === 'A' && (!answer || answer.trim() === '')) {
      showToast({ text1: '신청 답변을 입력해주세요.' });
      return;
    }

    const requestBody = {
      group_id: Number(groupInfo?.group_id),
      group_answer: answer,
      use_stat: (answer.trim() !== '' && groupInfo?.apply_type === 'A') ? '0' : '1',
    } as GroupApply;

    groupApply.mutate(requestBody, {
      onSuccess: (result) => {
        if(result.ret_code != 200){
          setErrorMessage(result.ext_msg? result.ext_msg : result.ret_msg);
          setActiveDialog('error');
        } else {
          showToast({ text1: '클럽에 신청되었습니다.' });
          setApplyStatus('0');
          refetchMemberList();
        }
        
      },
      onError: (error) => {
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setActiveDialog('error');
      }
    });
  }

  //모임 신청 취소처리
  const handleNotApplySubmit = () => {
    setActiveDialog('none');

    const requestBody = {
      group_id: Number(groupInfo?.group_id),
    } as GroupApply;

    groupCancelApply.mutate(requestBody, {
      onSuccess: () => {
        showToast({ text1: '클럽에 취소되었습니다.' });
        setApplyStatus('-1');
        refetchMemberList();
      },
      onError: (error) => {
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setActiveDialog('error');
      }
    });
  }

  const DETAIL_MENU_ITEMS = [
    {
      label: '클럽 수정',
      onPress: () => {
        const { img_list, ...tmpGroupInfo } = groupInfo as GroupInfo & { img_list?: FileInfo[] };

        router.navigate({
          pathname: '/groups/createDetail',
          params: {
            ...tmpGroupInfo,
            img_list_json: JSON.stringify(img_list ?? []),
          }
        });
      },
    },
    {
      label: '가입 승인',
      onPress: () => {
        router.navigate({
          pathname: '/members/applyList',
          params: {
            target_id: groupInfo?.group_id,
            target_type: 'G',
          }
        });
      }
    },
    {
      label: '멤버 관리',
      onPress: () => {
        router.navigate({
          pathname: '/members/memberList',
          params: {
            target_id: groupInfo?.group_id,
            target_type: 'G',
          }
        });
      },
    },
    {
      label: '클럽 삭제',
      onPress: () => {
        setIsDetailMenuVisible(false);
        setActiveDialog('delete');
      },
    },
  ];  

  const dialogConfig = (() => {
    switch (activeDialog) {
      case 'apply':
        return {
          visible     : true,
          title       : '클럽 가입 질문',
          content     : groupInfo?.apply_type === 'A' && groupInfo.group_question ? groupInfo.group_question : '이 모임에 신청하시겠어요?',
          textInput   : groupInfo?.apply_type === 'A' && groupInfo.group_question ? '답변을 작성해주세요.' : undefined,
          cancelLabel : '취소',
          confirmLabel: '완료',
          onCancel    : () => setActiveDialog('none'),
          onConfirm   : handleApplySubmit,
        };
      case 'cancelApply':
        return {
          visible     : true,
          title       : '클럽 참여 취소',
          content     : '이 모임에 참여를 취소하시겠어요?',
          cancelLabel : '취소',
          confirmLabel: '완료',
          onCancel    : () => setActiveDialog('none'),
          onConfirm   : () => handleNotApplySubmit(),
        };
      case 'delete':
        return {
          visible     : true,
          title       : '클럽 삭제',
          content     : '정말 삭제하시겠습니까?',
          cancelLabel : '아니오',
          confirmLabel: '예',
          onCancel    : () => setActiveDialog('none'),
          onConfirm   : () => handleDeleteSubmit(),
        };
      case 'error':
        return {
          visible     : true,
          title       : '처리 실패',
          content     : `정상 처리되지 않았습니다. \n${errorMessage}`,
          cancelLabel : '닫기',
          onCancel    : () => {
            setActiveDialog('none');
            refetchMemberList();
          },
          onConfirm   : () => setActiveDialog('none'),
        };
      default:
        return {
          visible: false,
          content: '',
        };
    }
  })();

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader 
        isLogo={false} 
        isNoti={false} 
        isSetting={false} 
        isLike={false} 
        isDetail={groupInfo?.host_yn === 'Y'} 
        onPressDetail={() => setIsDetailMenuVisible((prev) => !prev)}
      />      
      {isDetailMenuVisible && (
        <TouchableOpacity
          style={COMM_STYLES.detailMenuBackdrop}
          activeOpacity={1}
          onPress={() => setIsDetailMenuVisible(false)}
        />
      )}

      {isDetailMenuVisible && (
        <View style={COMM_STYLES.detailMenuLayer} pointerEvents="box-none">
          <View style={COMM_STYLES.detailMenuAnchor}>
            <DropdownModal
              items={DETAIL_MENU_ITEMS}
              position="right"
              visible={isDetailMenuVisible}
              onVisibleChange={setIsDetailMenuVisible}
            />
          </View>
        </View>
      )}

      <ScrollView 
        style={{ marginBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 이미지 캐러슬 */}
        <View>
          <ImageCarousel
            images={groupInfo?.img_list?.length ? groupInfo.img_list.map((file) => file.file_path) : []}
            height={280}
          />
        </View>

        {/* 클럽 정보 */}
        <View style={COMM_STYLES.commContainer}>
          {/* 클럽 라벨 */}
          <View style={COMM_STYLES.labelContainer}>
              <CommLabel variant={COMM_CONSTANTS.COMM_GROUP as "GROUP"} />
              <CommLabel variant="category" category={groupInfo?.group_subj_name} />
          </View>

          {/* 클럽 제목 */}
          <Text style={COMM_STYLES.commContainerTitle}>{groupInfo?.group_name}</Text>

          {/* 설명 */}
          <Text style={COMM_STYLES.contentDesc}>{groupInfo?.group_desc}</Text>
        </View>
        
        <DividingLine />
        
        {/* 모임장 및 참여 멤버 */}
        <HostMemberSection
          hostImageUrl={groupInfo?.mem_image_url}
          hostName={groupInfo?.mem_nick}
          hostInfo={groupInfo?.mem_info}
          members={memberList}
        />

        <DividingLine />

        {/* 클럽 상세 소개 */}
        <View style={COMM_STYLES.detailContainer}>
          {/* 상단 타이틀 */}
          <Text style={COMM_STYLES.detailSubTitle}>클럽 상세 소개</Text>
          <Text style={COMM_STYLES.detailMainTitle}>클럽에 대해 자세히 알려드려요.</Text>

          {/* 정보 박스 */}
          <View style={COMM_STYLES.detailInfoBox}>
            <DetailInfoRow icon={<IconDetailCategory width={22} height={22} />} text={`${groupInfo?.group_subj_name}`} />
            <DetailInfoRow icon={<IconInfoMark width={18} height={18} />} text={`클럽 · ${groupInfo?.apply_type === 'F' ? '선착순' : '승인제'}`} />
            <DetailInfoRow icon={<IconDetailMembers width={18} height={18} />} text={`최대 ${groupInfo?.group_max}명`} />
            {groupInfo?.fee_entry && <DetailInfoRow icon={<IconDetailFee width={18} height={18} />} text={`${formatNumberWithComma(groupInfo?.fee_entry)}원`} />}
            <DetailInfoRow icon={<IconCalendar width={18} height={18} />} text={`${groupInfo?.group_datetime}`} />
            {groupInfo?.place_name && <DetailInfoRow icon={<IconDetailMarker width={18} height={18} />} text={`${groupInfo?.place_name}`} />}
          </View>
          
          {/* 하단 지도 정보 카드 */}
          <PlaceLocationBox data={groupInfo as GroupInfo} />
        </View>         
      </ScrollView>

      {applyStatus === '-1' && (
        <CommBottomButton 
          label="신청하기" 
          onPress={() => router.checkAndNavigate(() => setActiveDialog('apply'), '/groups/groupDetailPage')}
        />
      )}
      {applyStatus === '0' && (
        <CommBottomButton 
          label="신청 취소하기" 
          onPress={() => setActiveDialog('cancelApply')} 
        />
      )}
      {applyStatus === '1' && (
        <CommBottomButton 
          label="채팅하기" 
          onPress={() => {router.push({
          pathname: "/chats",
          params: {
            room_id   : `${COMM_CONSTANTS.COMM_GROUP}_${groupInfo?.group_id}`,
            room_name : groupInfo?.group_name,
            room_type : COMM_CONSTANTS.COMM_GROUP,
          },
        })}} />
      )}
      <CustomDialog {...dialogConfig} />
    </View>
  );
}

