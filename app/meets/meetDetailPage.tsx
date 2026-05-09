import { COLOR } from "@/constants";
import React, { useState } from "react";
import { TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import {  useMeetDetailView, useMeetMemberList } from "@/hooks/queries/useMeet";
import { MeetInfo, SearchParams } from "@/types";
import {  useLocalSearchParams } from "expo-router";
import ImageCarousel from "@/components/ImageCarousel";
import CommLabel from "@/components/CommLabel";
import IconCalendar from '@/assets/images/icon_calendar.svg';
import CustomDialog from "@/components/CustomDialog";
import DividingLine from "@/components/DividingLine";
import ProfileIcon from "@/components/ProfileIcon";
import PlaceLocationBox from "@/components/PlaceLocationBox";
import MeetComment from "@/components/MeetComment";
import CommReviewList from '@/components/CommReviewList';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useReviewList } from "@/hooks/queries/useCommunity";

export default function MeetDetailPage() {
  const [comment, setComment] = useState('');

  // ✅ 1. 모임상세 데이터 조회
  const { meetId } = useLocalSearchParams();
  //소모임 정보 조회
  const { results : meetInfo, isLoading : isDetailLoading, isError : isDetailError } = useMeetDetailView(Number(meetId));  
  //소모임에 참여하는 멤버 조회
  const { results : memberList, isLoading : isMemberLoading, isError : isMemberError } = useMeetMemberList(Number(meetId));  
  //소모임 후기 조회
  const { results : reviewList, isLoading : isReviewLoading, isError : isReviewError } = 
          useReviewList({
            page_no: 0, 
            page_size: 4, 
            sch_condition: 'meet', // 'latest', 'mypost', 'review' 중 하나
            sch_keyword: Number(meetId), //myMemId, // 실제 mem_id는 로그인 정보에서 가져와야 함
        } as SearchParams); 

  const hostMember = memberList?.find(member => member.host_yn === 'Y');
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  // ✅ 2. 로딩 상태 처리
  if (isDetailLoading || isMemberLoading || isReviewLoading) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
        <Text style={{ marginTop: 10, color: COLOR.COMM_GRAY_2 }}>모임 정보를 불러오고 있어요...</Text>
      </View>
    );
  }
  if (isDetailError || isMemberError || isReviewError) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
        <Text style={{ marginTop: 10, color: COLOR.COMM_GRAY_2 }}>모임 정보를 불러오지 못했습니다...</Text>
      </View>
    );
  }

  //모임 신청처리
  const handleApplyMeet = () => {
    const requestBody = {
      ...meetInfo,
//      img_list: imageList,
    } as MeetInfo;
    console.log("신청하기 요청 바디:", requestBody);
    // meetCreate.mutate(requestBody, {
    //   onSuccess: () => {
    //     router.navigate({
    //       pathname: '/meets/createComplete', 
    //       params: { meetInfo: meetInfo }});
    //   },
    //   onError: (error) => {
    //     setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    //     setIsErrorDialogVisible(true);
    //   }
    // });
  }

  // 가상의 댓글 데이터
  const COMMENT_DATA = [
    {
      mem_id: '1',
      comment_id: '1',
      mem_name: '정현수',
      time: '00:40',
      content: '정말 재밌는 모임이 될 것 같아요!',
      profile_image_url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // 실제 이미지 URL로 교체
    },
    {
      mem_id: '2',
      comment_id: '2',
      mem_name: '정현수',
      time: '00:40',
      content: '정말 재밌는 모임이 될 것 같아요!',
      profile_image_url: '',
    },
  ];
  interface CommentTypeProps {
    mem_id: string;
    comment_id: string;
    mem_name: string;
    time: string;
    content: string;
    profile_image_url: string;
  };
  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title=""/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 1. 이미지 캐러슬---------------------------- */}
        <View>
          {/* onPressImage={(i) => console.log("pressed image", i)} // 추후 이미지 수정 기능 추가 시 활용 */}
          <ImageCarousel
            images={meetInfo?.thumb_url ? [meetInfo.thumb_url] : []}
            height={280}
          />
        </View>

        {/* 2. 소셜링 정보---------------------------- */}
        <View style={styles.commContainer}>
          {/* 소셜링 라벨 */}
          <View style={styles.labelContainer}>
              <CommLabel variant="social" />
              <CommLabel variant="club" />
              {/* 추후 넘긴 카테고리 값으로 세팅 */}
              <CommLabel variant="category" category="게임" />
          </View>

          {/* 소셜링 제목 */}
          <Text style={styles.commContainerTitle}>{meetInfo?.meet_name}</Text>

          {/* 소셜링 장소, 날짜, 시간 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconCalendar />
            <Text style={styles.contentInfoText}>{`${meetInfo?.place_name} · ${meetInfo?.meet_datetime}`}</Text>
          </View>
          {/* 설명 */}
          <Text style={styles.contentDesc}>{meetInfo?.meet_desc}</Text>
        </View>
        
        <DividingLine />
        {/* 3. 모임장 및 참여 멤버---------------------------- */}
        {/* 모임장 소개 섹션 */}
        <View style={styles.membersContainer}>
          {/* 모임장 소개 섹션 */}
          <View style={styles.membersSection}>
            <Text style={styles.membersSectionTitle}>모임장 소개</Text>
            <View style={styles.hostContainer}>
                <ProfileIcon mem_image_url={hostMember?.mem_image_url || ''} type="HOST" />
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>{hostMember?.mem_name}</Text>
                <Text style={styles.hostGreeting}>{hostMember?.mem_interest}</Text>
              </View>
            </View>
          </View>

          {/* 참여 멤버 섹션: 하단 여백을 제거하여 위쪽 여백과 균형을 맞춤 */}
          <View style={[styles.membersSection, { marginBottom: 0 }]}> 
            <Text style={styles.membersSectionTitle}>참여 멤버</Text>
            <FlatList
              data={memberList}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item?.mem_id?.toString() ?? String(index)}
              contentContainerStyle={styles.memberListContent}
              renderItem={({ item }) => (
                <ProfileIcon mem_image_url={item?.mem_image_url || ''} type="MEMBER" />
              )}
            />
          </View>
        </View>


        {/* 4. 소셜링 상세 소개---------------------------- */}
        <DividingLine />
        <View style={styles.meetDetailContainer}>
          {/* 상단 타이틀 */}
          <Text style={styles.meetDetailSubTitle}>소셜링 상세 소개</Text>
          <Text style={styles.meetDetailMainTitle}>모임에 대해 자세히 알려드려요.</Text>

          {/* 정보 박스 */}
          <View style={styles.meetDetailInfoBox}>
            <InfoRow icon="pencil-outline" text={`취미 > ${meetInfo?.meet_subj ?? '정보가 없습니다.'}`} />
            <InfoRow icon="information-outline" text={`${meetInfo?.meet_type ?? '모임 타입이 없습니다.'}`} />
            <InfoRow icon="account-group-outline" text={`인원 > ${meetInfo?.meet_min ?? '인원 정보가 없습니다.'} ~ ${meetInfo?.meet_max ?? '인원 정보가 없습니다.'}`} />
            <InfoRow icon="currency-krw" text={`비용 > ${meetInfo?.fee_info ?? '비용 정보가 없습니다.'}`} />
            <InfoRow icon="calendar-month-outline" text={`날짜 > ${meetInfo?.meet_datetime ?? '날짜 정보가 없습니다.'}`} />
            <InfoRow icon="map-marker-outline" text={meetInfo?.place_name ?? '장소 정보가 없습니다.'} />
          </View>

          {/* 하단 지도 정보 카드 */}
          <PlaceLocationBox data={meetInfo as MeetInfo} />
        </View>         

        {/* 장소 주소 및 지도?? */}
        {/* 6. 댓글 ??---------------------------- */}
        <DividingLine />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.commentContainer}
        >
          <View style={styles.commentHeader}>
            <Text style={styles.commentHeaderTitle}>멤버 댓글</Text>
          </View>

          <FlatList
            data={COMMENT_DATA}
            renderItem={({ item }) => <MeetComment data={item as CommentTypeProps} />}
            keyExtractor={(item) => item.comment_id}
            ItemSeparatorComponent={() => <View style={styles.commentSeparator} />}
            contentContainerStyle={styles.commentListContent}
            // 💡 아래 두 속성을 추가하면 ScrollView 안에서도 에러가 나지 않습니다.
            scrollEnabled={false}         // 자체 스크롤 기능 비활성화
            nestedScrollEnabled={true}    // 중첩 스크롤 허용
          />

          {/* 댓글 입력창 */}
          <View style={styles.commentInputWrapper}>
            {/* <View style={styles.myProfileCircle} /> */}
            <ProfileIcon mem_image_url={''} type="MEMBER" />
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="댓글 달기..."
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity style={styles.commentSendButton}>
                <Text style={styles.commentSendIcon}>↑</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        


        {/* 7. 후기---------------------------- */}
        <DividingLine />
        <CommReviewList reviewList={reviewList} />

      </ScrollView>

      <CommBottomButton label="신청하기" onPress={handleApplyMeet}/>

      <CustomDialog
        visible={isErrorDialogVisible}
        title="참가 실패"
        content={`소셜링에 참가하지 못했어요. 잠시 후 다시 시도해 주세요. \n${errorMessage}`}
        cancelLabel="닫기"
        confirmLabel="다시 시도"
        onCancel={() => setIsErrorDialogVisible(false)}
        onConfirm={() => {
          setIsErrorDialogVisible(false);
          handleApplyMeet();
        }}
      />
    </View>
  );
}

// 정보 한 줄을 렌더링하는 컴포넌트
const InfoRow = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.meetDetailInfoRow}>
    <MaterialCommunityIcons name={icon as any} size={20} color="#444" style={styles.meetDetailIcon} />
    <Text style={styles.meetDetailInfoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
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
  membersContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
    // paddingBottom을 추가해 ScrollView 끝에서 답답하지 않게 조절 가능합니다.
  },
  membersSection: {
    marginBottom: 30, // 섹션 간 간격
  },
  membersSectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontWeight: '700',
  },
  memberListContent: {
    alignItems: 'center',
  },
  meetDetailContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  meetDetailSubTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  meetDetailMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },  
  meetDetailInfoBox: {
    backgroundColor: '#F5F5F5', // 연한 회색 배경
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  meetDetailInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  meetDetailIcon: {
    marginRight: 15,
    width: 20,
  },
  meetDetailInfoText: {
    fontSize: 16,
    color: '#444',
  },
  reviewContainer: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  reviewHeaderTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  reviewListContent: {
    paddingHorizontal: 15,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostInfo: {
    marginLeft: 15,
  },
  hostName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  hostGreeting: {
    fontSize: 14,
    color: '#888',
  },
  commentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  commentHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  commentHeaderTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  commentListContent: {
    paddingHorizontal: 20,
  },
  commentSeparator: {
    height: 1,
    backgroundColor: '#eee',
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },  
commentInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  commentSendButton: {
    backgroundColor: '#FF5A5F', // 이미지의 주황/빨강 버튼 색상
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSendIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },  
});