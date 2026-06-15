import { COLOR, COMM_STYLES, COMM_CONSTANTS } from "@/constants";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, ActivityIndicator, ScrollView, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { useMeetApply, useMeetDetailView, useMeetMemberList, useMeetCancelApply, useMeetDelete } from "@/hooks/queries/useMeet";
import { MeetApply, MeetInfo } from "@/types";
import { useLocalSearchParams } from "expo-router";
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
import PlaceLocationBox from "@/components/PlaceLocationBox";
import CommReviewList from '@/components/comm/CommReviewList';
import DropdownModal from '@/components/modal/DropdownModal';
import { useReviewList } from "@/hooks/queries/useCommunity";
import { useAuthRouter } from "@/components/comm/AuthRoute";
import { router as expoRouter } from 'expo-router';
import { showToast } from "@/utils/commToast";
import DetailInfoRow from "@/components/comm/DetailInfoRow";
import { formatNumberWithComma } from "@/utils/commUtil";
import HostMemberSection from "@/components/comm/HostMemberSection";

type DialogType = 'none' | 'apply' | 'cancelApply' | 'cancelApply2' | 'delete' | 'error' | 'report';

/**
 * 모임 상세보기 화면
 */
export default function DetailViewScreen() {
  const meetApply = useMeetApply();
  const meetCancelApply = useMeetCancelApply();
  const meetDelete = useMeetDelete();
  const [activeDialog, setActiveDialog] = useState<DialogType>('none');
  const [isDetailMenuVisible, setIsDetailMenuVisible] = useState(false);
  const router = useAuthRouter();
  const { meetId } = useLocalSearchParams();
  const { results : meetInfo } = useMeetDetailView(Number(meetId));  
  const { results : memberList,refetch: refetchMemberList, isLoading : isMemberLoading, isError : isMemberError } = useMeetMemberList(Number(meetId));  
  const { results : reviewList, isLoading : isReviewLoading, isError : isReviewError } = useReviewList({
    page_no: 0, 
    page_size: 4, 
    sch_condition: 'meet',
    sch_keyword: String(meetId),
  }); 
  const [errorMessage, setErrorMessage] = useState('');
  const [applyStatus, setApplyStatus] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    setApplyStatus(meetInfo?.apply_stat);
  }, [meetInfo?.apply_stat]);

  // 모임 삭제
  const handleDeleteSubmit = () => {
    setActiveDialog('none');

    meetDelete.mutate(Number(meetInfo?.meet_id), {
      onSuccess: (result) => {
        if (result.ret_code !== 200) {
          setErrorMessage(result.ret_msg);
          setActiveDialog('error');
          return;
        }
        else {
          showToast({ text1: '삭제되었습니다.' });
          expoRouter.back();
        }
      },
      onError: (error) => {
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setActiveDialog('error');
      },
    });
  };
  
  // 로딩 상태 처리
  if (isMemberLoading || isReviewLoading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
        <Text style={{ marginTop: 10, color: COLOR.COMM_GRAY_2 }}>모임 정보를 불러오고 있어요...</Text>
      </View>
    );
  }
  if (isMemberError || isReviewError) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
        <Text style={{ marginTop: 10, color: COLOR.COMM_GRAY_2 }}>모임 정보를 불러오지 못했습니다...</Text>
      </View>
    );
  }

  //모임 신청처리
  const handleApplySubmit = (answer: string) => {
    setActiveDialog('none');

    if(meetInfo?.apply_type === 'A' && meetInfo?.meet_question?.trim() != '' && (!answer || answer.trim() === '')) {
      showToast({ text1: '신청 답변을 입력해주세요.' });
      return;
    }

    const requestBody = {
      meet_id: Number(meetInfo?.meet_id),
      meet_answer: answer,
      use_stat: (answer.trim() !== '' && meetInfo?.apply_type === 'A') ? '0' : '1'
    } as MeetApply;

    meetApply.mutate(requestBody, {
      onSuccess: (result) => {
        if(result.ret_code != 200){
          setErrorMessage(result.ext_msg? result.ext_msg : result.ret_msg);
          setActiveDialog('error');
        } else {
          showToast({ text1: '신청되었습니다.' });
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
  
  // 모임 신청 취소처리
  const handleNotApplySubmit = (type: string) => {
    setActiveDialog('none');

    const requestBody = {
      meet_id: Number(meetInfo?.meet_id),
    } as MeetApply;

    meetCancelApply.mutate(requestBody, {
      onSuccess: () => {
        showToast({ text1: type === 'cancelApply2' ? '소셜링에서 탈퇴했습니다.' : '취소되었습니다.' });
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
      label: '소셜링 나가기',
      onPress: () => {
        setIsDetailMenuVisible(false);
        setActiveDialog('cancelApply2');
      },
    },
    {
      label: '소셜링 수정',
      onPress: () => {
        setIsDetailMenuVisible(false);
        setActiveDialog('delete');
      },
    },
    {
      label: '가입 승인',
      onPress: () => {
        router.navigate({
          pathname: '/members/applyList',
          params: {
            target_id: meetInfo?.meet_id,
            target_type: 'M',
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
            target_id: meetInfo?.meet_id,
            target_type: 'M',
          }
        });
      },
    },
    {
      label: '소셜링 삭제',
      onPress: () => {
        setIsDetailMenuVisible(false);
        setActiveDialog('delete');
      },
    },
    {
      label: '신고하기',
      onPress: () => {
        setIsDetailMenuVisible(false);
        setActiveDialog('report');
      },
    },
  ];

  if (meetInfo?.host_yn !== 'Y') {
    DETAIL_MENU_ITEMS.splice(1);
  }
  else {
    DETAIL_MENU_ITEMS.splice(0, 1);
  }

  const dialogConfig = (() => {
    switch (activeDialog) {
      case 'apply':
        return {
          visible     : true,
          title       : '소셜링 가입 질문',
          content     : meetInfo?.apply_type === 'A' && meetInfo.meet_question ? meetInfo.meet_question : '이 모임에 신청하시겠어요?',
          textInput   : meetInfo?.apply_type === 'A' && meetInfo.meet_question ? '답변을 작성해주세요.' : undefined,
          cancelLabel : '취소',
          confirmLabel: '확인',
          onCancel    : () => setActiveDialog('none'),
          onConfirm   : handleApplySubmit,
        };
      case 'cancelApply':
        return {
          visible     : true,
          title       : '소셜링 참여 취소',
          content     : '소셜링 참여를 취소하시겠어요?',
          cancelLabel : '취소',
          confirmLabel: '확인',
          onCancel    : () => setActiveDialog('none'),
          onConfirm   : () => handleNotApplySubmit('cancelApply'),
        };
      case 'cancelApply2':
        return {
          visible     : true,
          title       : '소셜링 탈퇴',
          content     : '소셜링에서 탈퇴하시겠어요?',
          cancelLabel : '취소',
          confirmLabel: '확인',
          onCancel    : () => setActiveDialog('none'),
          onConfirm   : () => handleNotApplySubmit('cancelApply2'),
        };
      case 'delete':
        return {
          visible     : true,
          title       : '모임 삭제',
          content     : '정말 삭제하시겠습니까?',
          cancelLabel : '아니오',
          confirmLabel: '예',
          onCancel    : () => setActiveDialog('none'),
          onConfirm   : () => handleDeleteSubmit(),
        };
      case 'error':
        return {
          visible     : true,
          content     : `${errorMessage}`,
          cancelLabel : '닫기',
          onCancel    : () => setActiveDialog('none'),
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
        isDetail={applyStatus === '1'}
        onPressDetail={() => setIsDetailMenuVisible((prev) => !prev)}
      />

      {/* 메뉴 팝업 */}
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
            images={meetInfo?.img_list?.length ? meetInfo.img_list.map((file) => file.file_path) : []}
            height={280}
          />
        </View>

        {/* 소셜링 정보 */}
        <View style={COMM_STYLES.commContainer}>
          {/* 소셜링 라벨 */}
          <View style={COMM_STYLES.labelContainer}>
              <CommLabel variant={COMM_CONSTANTS.COMM_MEET as "MEET"} />
              <CommLabel variant="category" category={meetInfo?.meet_subj_name} />
          </View>

          {/* 소셜링 제목 */}
          <Text style={COMM_STYLES.commContainerTitle}>{meetInfo?.meet_name}</Text>

          {/* 설명 */}
          <Text style={COMM_STYLES.contentDesc}>{meetInfo?.meet_desc}</Text>
        </View>
        
        <DividingLine />

        {/* 모임장 및 참여 멤버 */}
        <HostMemberSection
          hostImageUrl={meetInfo?.mem_image_url}
          hostName={meetInfo?.mem_nick}
          hostInfo={meetInfo?.mem_info}
          members={memberList}
        />

        <DividingLine />

        {/* 소셜링 상세 소개 */}
        <View style={COMM_STYLES.detailContainer}>
          {/* 상단 타이틀 */}
          <Text style={COMM_STYLES.detailSubTitle}>소셜링 상세 소개</Text>
          <Text style={COMM_STYLES.detailMainTitle}>모임에 대해 자세히 알려드려요.</Text>
          {/* 정보 박스 */}
          <View style={COMM_STYLES.detailInfoBox}>
            <DetailInfoRow icon={<IconDetailCategory width={22} height={22} />} text={`${meetInfo?.meet_subj_name}`} />
            <DetailInfoRow icon={<IconInfoMark width={18} height={18} />} text={`1회성 ${meetInfo?.meet_type === 'N' ? '일반' : '클럽'} 소셜링 · ${meetInfo?.apply_type === 'F' ? '선착순' : '승인제'}`} />
            <DetailInfoRow icon={<IconDetailMembers width={18} height={18} />} text={`최소 ${meetInfo?.meet_min}명 ~ 최대 ${meetInfo?.meet_max}명`} />
            {meetInfo?.fee_entry && <DetailInfoRow icon={<IconDetailFee width={18} height={18} />} text={`${formatNumberWithComma(meetInfo?.fee_entry)}원`} />}
            <DetailInfoRow icon={<IconCalendar width={18} height={18} />} text={`${meetInfo?.meet_datetime}`} />
            {meetInfo?.place_name && <DetailInfoRow icon={<IconDetailMarker width={18} height={18} />} text={`${meetInfo?.place_name}`} />}
          </View>

          {/* 하단 지도 정보 카드 */}
          <PlaceLocationBox data={meetInfo as MeetInfo} />
        </View>

        <DividingLine />
        {/* 후기 */}
        <CommReviewList reviewList={reviewList} />

      </ScrollView>

      {applyStatus === '-1' && (
        <CommBottomButton
          label="신청하기"
          onPress={() => router.checkAndNavigate(() => setActiveDialog('apply'), '/meets/detailView')}
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
            room_id   : `${COMM_CONSTANTS.COMM_MEET}_${meetInfo?.meet_id}`,
            room_name : meetInfo?.meet_name,
            room_type : COMM_CONSTANTS.COMM_MEET,
          },
        })}} />
      )}

      <CustomDialog {...dialogConfig} />
    </View>
  );
}
