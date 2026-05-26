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
import CustomDialog from "@/components/modal/CustomDialog";
import { parseImageList } from "@/utils/commUtil";

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
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
            <CommLabel variant="category" category={prevMeetInfo.meet_subj} />
          </View>

          {/* 소셜링 제목 */}
          <Text style={styles.commContainerTitle}>{prevMeetInfo.meet_name}</Text>

          {/* 소셜링 장소, 날짜, 시간 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconCalendar />
            <Text style={styles.contentInfoText}>{`${prevMeetInfo.place_name} · ${prevMeetInfo.meet_datetime}`}</Text>
          </View>
          {/* 설명 */}
          <Text style={styles.contentDesc}>{prevMeetInfo.meet_desc}</Text>
        </View>
        {/* 추후 작업 */}
        {/* 모임장 및 참여 멤버 */}
        {/* 소셜링 상세 소개 */}
        {/* 장소 주소 및 지도?? */}
        {/* 댓글 ?? */}
        {/* 후기 */}

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
  commContainerTitle: {
    fontSize          : 20,
    fontWeight        : 'bold', 
    marginBottom      : 8,
  },
  commContainer: {
    marginHorizontal  : 16,
    marginBottom      : 30,
    gap               : 16,
  },
  labelContainer: {
    flexDirection     : 'row',
    gap               : 6,
    marginTop         : 12,
    marginBottom      : 4,
  },
  contentInfoText: {
    fontSize          : 16,
    marginStart       : -8,
    color             : COLOR.TEXT_DEFAULT,
  },
  contentDesc: {
    fontSize          : 16,
    color             : COLOR.TEXT_DEFAULT,
  },
});