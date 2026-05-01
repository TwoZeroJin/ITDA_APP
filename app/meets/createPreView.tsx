import { COLOR } from "@/constants";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { useRoute } from "@react-navigation/native";
import { useMeetCreate } from "@/hooks/queries/useMeet";
import { MeetInfo } from "@/types";
import { router } from "expo-router";
import ImageCarousel from "@/components/ImageCarousel";
import CommLabel from "@/components/CommLabel";
import IconCalendar from '@/assets/images/icon_calendar.svg';
import CustomDialog from "@/components/CustomDialog";
import { parseImageList } from "@/utils/commUtil";

// 이전 화면에서 받은 데이터 타입 정의
type MeetCreateRouteParams = {
  [key: string]: string | number | (string | number)[] | undefined;
  img_list_json?: string;
};

export default function MeetCreatePreViewScreen() {
  const params = useRoute();
  const routeParams = (params.params ?? {}) as MeetCreateRouteParams;
  const imageList = parseImageList(routeParams.img_list_json);
  const { img_list_json, ...restParams } = routeParams;
  const meetInfo = restParams as unknown as MeetInfo;
  const meetCreate = useMeetCreate();
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateMeet = () => {
    const requestBody = {
      ...meetInfo,
      img_list: imageList,
    } as MeetInfo;

    meetCreate.mutate(requestBody, {
      onSuccess: () => {
        router.navigate({
          pathname: '/meets/createComplete', 
          params: { meet_type: meetInfo.meet_type}});
      },
      onError: (error) => {
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setIsErrorDialogVisible(true);
      }
    });
  }

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="미리 보기"/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 이미지 캐러슬 */}
        <View>
          <ImageCarousel
            images={imageList.map((file) => file.file_url)}
            height={280}
            // onPressImage={(i) => console.log("pressed image", i)} // 추후 이미지 수정 기능 추가 시 활용
          />
        </View>

        {/* 소셜링 정보 */}
        <View style={styles.commContainer}>
          {/* 소셜링 라벨 */}
          <View style={styles.labelContainer}>
              <CommLabel variant="social" />
              <CommLabel variant="club" />
              {/* 추후 넘긴 카테고리 값으로 세팅 */}
              <CommLabel variant="category" category="게임" />
          </View>

          {/* 소셜링 제목 */}
          <Text style={styles.commContainerTitle}>{meetInfo.meet_name}</Text>

          {/* 소셜링 장소, 날짜, 시간 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconCalendar />
            <Text style={styles.contentInfoText}>{`${meetInfo.place_name} · ${meetInfo.meet_datetime}`}</Text>
          </View>
          {/* 설명 */}
          <Text style={styles.contentDesc}>{meetInfo.meet_desc}</Text>
        </View>
        {/* 추후 작업 */}
        {/* 모임장 및 참여 멤버 */}
        {/* 소셜링 상세 소개 */}
        {/* 장소 주소 및 지도?? */}
        {/* 댓글 ?? */}
        {/* 후기 */}

      </ScrollView>

      <CommBottomButton label="소셜링 열기" onPress={handleCreateMeet}/>

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
  container: {
    flex: 1,
  },
  commContainerTitle: {
    fontSize: 20,
    fontWeight: 'bold', 
    marginBottom: 8,
  },
  commContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
    gap: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    marginBottom: 4,
  },
  contentInfoText: {
    fontSize: 16,
    marginStart: -8,
    color: COLOR.TEXT_DEFAULT,
  },
  contentDesc: {
    fontSize: 16,
    color: COLOR.TEXT_DEFAULT,
  },
});