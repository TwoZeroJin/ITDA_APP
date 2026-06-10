import { COLOR, COMM_STYLES } from "@/constants";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { GroupInfo, CodeInfo, ApiResult } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import ImageCarousel from "@/components/comm/ImageCarousel";
import CommLabel from "@/components/comm/CommLabel";
import IconCalendar from '@/assets/images/icon_calendar.svg';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import IconDetailMarker from '@/assets/images/icon_detail_marker.svg';
import IconDetailCategory from '@/assets/images/icon_detail_category.svg';
import IconDetailMembers from '@/assets/images/icon_detail_members.svg';
import IconDetailFee from '@/assets/images/icon_detail_fee.svg';
import CustomDialog from "@/components/modal/CustomDialog";
import { parseImageList, formatNumberWithComma } from "@/utils/commUtil";
import { useGroupInsert, useGroupUpdate } from "@/hooks/queries/useGroup";
import DividingLine from "@/components/DividingLine";
import PlaceLocationBox from "@/components/PlaceLocationBox";
import DetailInfoRow from "@/components/comm/DetailInfoRow";

/**
 * 클럽 생성 - 최종 미리보기 및 생성 화면
 */
export default function GroupCreatePreViewScreen() {
  const prevGroupInfo = useLocalSearchParams() as Partial<GroupInfo> as GroupInfo;
  const imageList = parseImageList(prevGroupInfo.img_list_json);
  const groupInsert = useGroupInsert();
  const groupUpdate = useGroupUpdate();
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleMutationSuccess = (result: ApiResult<null>) => {
    if (result.ret_code !== 200) {
      setErrorMessage(result.ret_msg || '요청 처리에 실패했습니다.');
      setIsErrorDialogVisible(true);
      return;
    }
    
    router.navigate({
      pathname: '/groups/createComplete',
      params: { 
        group_id: prevGroupInfo.group_id || '',
      },
    });
  };
  const handleMutationError = (error: unknown) => {
    setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    setIsErrorDialogVisible(true);
  };

  const handleCreateGroup = () => {
    const formValues = {
      ...prevGroupInfo,
      img_list: imageList,
    };
    
    if (prevGroupInfo.group_id) {
      // group_id가 존재하면 업데이트, 없으면 새로 생성
      groupUpdate.mutate(formValues, {
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
      });
    } else {
      groupInsert.mutate(formValues, {
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
      });
    }
  }

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="미리 보기"/>
      <ScrollView
        style={{ marginBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 이미지 캐러슬 */}
        <View>
          <ImageCarousel
            images={imageList.map((file) => file.file_path)}
            height={280}
          />
        </View>

        {/* 클럽 정보 */}
        <View style={COMM_STYLES.commContainer}>
          {/* 클럽 라벨 */}
          <View style={COMM_STYLES.labelContainer}>
              <CommLabel variant="club" />
              <CommLabel variant="category" category={prevGroupInfo.group_subj_name} />
          </View>

          {/* 클럽 제목 */}
          <Text style={COMM_STYLES.commContainerTitle}>{prevGroupInfo.group_name}</Text>

          {/* 설명 */}
          <Text style={COMM_STYLES.contentDesc}>{prevGroupInfo.group_desc}</Text>
        </View>

        <DividingLine />
        
        {/* 모임장 및 참여 멤버 */}
        {/* 클럽 상세 소개 */}
        <View style={COMM_STYLES.detailContainer}>
          {/* 상단 타이틀 */}
          <Text style={COMM_STYLES.detailSubTitle}>클럽 상세 소개</Text>
          <Text style={COMM_STYLES.detailMainTitle}>클럽에 대해 자세히 알려드려요.</Text>
          {/* 정보 박스 */}
          <View style={COMM_STYLES.detailInfoBox}>
            <DetailInfoRow icon={<IconDetailCategory width={22} height={22} />} text={`${prevGroupInfo?.group_subj_name}`} />
            <DetailInfoRow icon={<IconInfoMark width={18} height={18} />} text={`클럽 · ${prevGroupInfo?.apply_type === 'F' ? '선착순' : '승인제'}`} />
            <DetailInfoRow icon={<IconDetailMembers width={18} height={18} />} text={`최대 ${prevGroupInfo?.group_max}명`} />
            {prevGroupInfo?.fee_entry && <DetailInfoRow icon={<IconDetailFee width={18} height={18} />} text={`${formatNumberWithComma(prevGroupInfo?.fee_entry)}원`} />}
            <DetailInfoRow icon={<IconCalendar width={18} height={18} />} text={`${prevGroupInfo?.group_datetime}`} />
            {prevGroupInfo?.place_name && <DetailInfoRow icon={<IconDetailMarker width={18} height={18} />} text={`${prevGroupInfo?.place_name}`} />}
          </View>

          {/* 하단 지도 정보 카드 */}
          <PlaceLocationBox data={prevGroupInfo as GroupInfo} />
        </View>
        {/* 장소 주소 및 지도?? */}
        {/* 댓글 ?? */}
        {/* 후기 */}

      </ScrollView>

      <CommBottomButton label={`클럽 ${prevGroupInfo.group_id ? '수정' : '열기'}`} onPress={handleCreateGroup}/>

      <CustomDialog
        visible={isErrorDialogVisible}
        title="생성 실패"
        content={`클럽을 생성하지 못했어요. 잠시 후 다시 시도해 주세요. \n${errorMessage}`}
        cancelLabel="닫기"
        confirmLabel="다시 시도"
        onCancel={() => setIsErrorDialogVisible(false)}
        onConfirm={() => {
          setIsErrorDialogVisible(false);
          handleCreateGroup();
        }}
      />
    </View>
  );
}