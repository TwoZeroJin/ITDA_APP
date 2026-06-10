import { COLOR, COMM_STYLES } from "@/constants";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { useMeetInsert, useMeetUpdate } from "@/hooks/queries/useMeet";
import { ApiResult, MeetInfo } from "@/types";
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
import { formatNumberWithComma, parseImageList } from "@/utils/commUtil";
import DividingLine from "@/components/DividingLine";
import DetailInfoRow from "@/components/comm/DetailInfoRow";
import PlaceLocationBox from "@/components/PlaceLocationBox";

/**
 * 모임 생성 - 최종 미리보기 및 생성 화면
 */
export default function MeetCreatePreViewScreen() {
  const prevMeetInfo = useLocalSearchParams() as Partial<MeetInfo> as MeetInfo; 
  const imageList = parseImageList(prevMeetInfo.img_list_json);
  const meetInsert = useMeetInsert();
  const meetUpdate = useMeetUpdate();
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleMutationSuccess = (result: ApiResult<null>) => {
    if (result.ret_code !== 200) {
      setErrorMessage(result.ret_msg || '요청 처리에 실패했습니다.');
      setIsErrorDialogVisible(true);
      return;
    }

    router.navigate({
      pathname: '/meets/createComplete',
      params: { 
        meet_id: prevMeetInfo.meet_id || '',
        meet_type: prevMeetInfo.meet_type
      },
    });
  };
  const handleMutationError = (error: unknown) => {
    setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    setIsErrorDialogVisible(true);
  };

  const handleCreateMeet = () => {
    const formValues = {
      ...prevMeetInfo,
      img_list: imageList,
    };

    if (prevMeetInfo.meet_id) {
      // meet_id가 존재하면 업데이트, 없으면 새로 생성
      meetUpdate.mutate(formValues, {
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
      });
    } else {
      meetInsert.mutate(formValues, {
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
            // onPressImage={(i) => console.log("pressed image", i)} // 추후 이미지 수정 기능 추가 시 활용
          />
        </View>

        {/* 소셜링 정보 */}
        <View style={styles.commContainer}>
          {/* 소셜링 라벨 */}
          <View style={styles.labelContainer}>
            <CommLabel variant="social" />
            <CommLabel variant="category" category={prevMeetInfo.meet_subj_name} />
          </View>

          {/* 소셜링 제목 */}
          <Text style={styles.commContainerTitle}>{prevMeetInfo.meet_name}</Text>

          {/* 설명 */}
          <Text style={styles.contentDesc}>{prevMeetInfo.meet_desc}</Text>
        </View>
        {/* 모임장 및 참여 멤버 */}

        {/* 소셜링 상세 소개 */}
        <DividingLine />
        <View style={styles.meetDetailContainer}>
          {/* 상단 타이틀 */}
          <Text style={styles.meetDetailSubTitle}>소셜링 상세 소개</Text>
          <Text style={styles.meetDetailMainTitle}>모임에 대해 자세히 알려드려요.</Text>

          {/* 정보 박스 */}
          <View style={styles.meetDetailInfoBox}>
            <DetailInfoRow icon={<IconDetailCategory width={22} height={22} />} text={`${prevMeetInfo?.meet_subj_name}`} />
            <DetailInfoRow icon={<IconInfoMark width={18} height={18} />} text={`1회성 ${prevMeetInfo?.meet_type === 'N' ? '일반' : '클럽'} 소셜링 · ${prevMeetInfo?.apply_type === 'F' ? '선착순' : '승인제'}`} />
            <DetailInfoRow icon={<IconDetailMembers width={18} height={18} />} text={`최소 ${prevMeetInfo?.meet_min}명 ~ 최대 ${prevMeetInfo?.meet_max}명`} />
            {prevMeetInfo?.fee_entry && <DetailInfoRow icon={<IconDetailFee width={18} height={18} />} text={`${formatNumberWithComma(prevMeetInfo?.fee_entry)}원`} />}
            <DetailInfoRow icon={<IconCalendar width={18} height={18} />} text={`${prevMeetInfo?.meet_datetime}`} />
            {prevMeetInfo?.place_name && <DetailInfoRow icon={<IconDetailMarker width={18} height={18} />} text={`${prevMeetInfo?.place_name}`} />}
          </View>

          {/* 하단 지도 정보 카드 */}
          <PlaceLocationBox data={prevMeetInfo as MeetInfo} />
        </View>

      </ScrollView>

      <CommBottomButton label={`소셜링 ${prevMeetInfo.meet_id ? '수정' : '열기'}`} onPress={handleCreateMeet}/>

      <CustomDialog
        visible={isErrorDialogVisible}
        title="생성 실패"
        content={`소셜링을 생성하지 못했어요. 잠시 후 다시 시도해 주세요. \n${errorMessage}`}
        cancelLabel="닫기"
        confirmLabel="다시 시도"
        onCancel={() => setIsErrorDialogVisible(false)}
        onConfirm={() => {
          setIsErrorDialogVisible(false);
          handleCreateMeet();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  commContainer: {
    marginHorizontal  : 16,
    marginBottom      : 30,
    gap               : 8,
  },
  commContainerTitle: {
    fontSize          : 24,
    fontFamily        : 'Pretendard-Bold',
    color             : COLOR.TEXT_1C1C1C,
  },
  labelContainer: {
    flexDirection     : 'row',
    gap               : 6,
    marginTop         : 12,
    marginBottom      : 4,
  },
  contentInfoText: {
    fontSize          : 16,
    fontFamily        : 'Pretendard-Medium',
    marginStart       : -8,
    color             : COLOR.TEXT_DEFAULT,
  },
  contentDesc: {
    fontSize          : 16,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
  },
  meetDetailContainer: {
    padding           : 20,
    gap               : 10,
  },
  meetDetailSubTitle: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Light',
    color             : COLOR.TEXT_DEFAULT,
    marginTop         : 6,
  },
  meetDetailMainTitle: {
    fontSize          : 16,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
  },  
  meetDetailInfoBox: {
    backgroundColor   : COLOR.COMM_GRAY_5,
    borderRadius      : 8,
    paddingHorizontal : 20,
    paddingVertical   : 17,
    marginBottom      : 16,
  },
});