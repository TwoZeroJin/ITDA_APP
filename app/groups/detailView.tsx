import { COLOR, COMM_CONSTANTS } from "@/constants";
import React, { useState } from "react";
import { TouchableOpacity, ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { useGroupApply, useGroupCancelApply, useGroupDelete } from "@/hooks/queries/useGroup";
import {  FileInfo, GroupApply, GroupInfo } from "@/types";
import {  useLocalSearchParams } from "expo-router";
import ImageCarousel from "@/components/comm/ImageCarousel";
import CommLabel from "@/components/comm/CommLabel";
import IconCalendar from '@/assets/images/icon_calendar.svg';
import IconPencil from '@/assets/images/icon_pencil.svg';
import IconInfoMark from '@/assets/images/icon_info_mark.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import CustomDialog from "@/components/modal/CustomDialog";
import DividingLine from "@/components/DividingLine";
import ProfileIcon from "@/components/ProfileIcon";
import { useGroupDetailView, useGroupMemberList } from "@/hooks/queries/useGroup";
import { useAuthRouter } from "@/components/comm/AuthRoute";
import DropdownModal from '@/components/modal/DropdownModal';
import { router as expoRouter } from 'expo-router';
import DetailInfoRow from "@/components/comm/DetailInfoRow";

/**
 * 그룹 상세보기 화면
 */
export default function GroupDetailViewScreen() {
  const { groupId } = useLocalSearchParams();
  const { results : groupInfo, isLoading : isDetailLoading, isError : isDetailError } = useGroupDetailView(Number(groupId));  
  const imageList = groupInfo?.img_list? groupInfo.img_list : [];
  const groupApply = useGroupApply();
  const groupCancelApply = useGroupCancelApply();
  const groupDelete = useGroupDelete();
  const [isApplyComfirmVisible, setApplyComfirmVisible] = useState(false);//신청alert
  const [isNotApplyComfirmVisible, setNotApplyComfirmVisible] = useState(false);//신청취소alert
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);//삭제확인alert
  const router = useAuthRouter();
  //소모임에 참여하는 멤버 조회
  const { results : memberList, refetch: refetchMemberList, isLoading : isMemberLoading, isError : isMemberError } = useGroupMemberList(Number(groupId));  
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDetailMenuVisible, setIsDetailMenuVisible] = useState(false);

  const handleDeleteSubmit = () => {
    setDeleteConfirmVisible(false);

    if (!groupInfo?.group_id) {
      setErrorMessage('삭제할 클럽 정보가 없습니다.');
      setIsErrorDialogVisible(true);
      return;
    }

    groupDelete.mutate(Number(groupInfo.group_id), {
      onSuccess: (result) => {
        if (result.ret_code !== 200) {
          setErrorMessage(result.ext_msg ? result.ext_msg : result.ret_msg);
          setIsErrorDialogVisible(true);
          return;
        }

        expoRouter.back();
      },
      onError: (error) => {
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setIsErrorDialogVisible(true);
      },
    });
  };

  
  // ✅ 2. 로딩 상태 처리
  if (isMemberLoading) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
        <Text style={{ marginTop: 10, color: COLOR.COMM_GRAY_2 }}>클럽 정보를 불러오고 있어요...</Text>
      </View>
    );
  }
  if (isMemberError) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
        <Text style={{ marginTop: 10, color: COLOR.COMM_GRAY_2 }}>클럽 정보를 불러오지 못했습니다...</Text>
      </View>
    );
  }

  //모임 신청처리
  const handleApplySubmit = (answer: string) => {
    setApplyComfirmVisible(false);

    console.log("모달에서 받은 답변:", answer);

    if(groupInfo?.apply_type === 'A' && (!answer || answer.trim() === '')) {
      Alert.alert('신청 답변을 입력해주세요.');
      return;
    }

    const requestBody = {
      group_id: Number(groupInfo?.group_id),
      group_answer: answer,
      use_stat: (answer.trim() !== '' && groupInfo?.apply_type === 'A') ? '0' : '1', // 신청 상태 (예: 'Y' for 신청, 'N' for 취소)
    } as GroupApply;

    // 실제 신청 로직은 여기에 추가 (API 호출 등)
    groupApply.mutate(requestBody, {
      onSuccess: (result) => {
        if(result.ret_code != 200){
          setErrorMessage(result.ext_msg? result.ext_msg : result.ret_msg);
          setIsErrorDialogVisible(true);
        }else{
          Alert.alert('모임에 신청되었습니다.');   
          refetchMemberList(); //참여멤버 재조회  
        }
        
      },
      onError: (error) => {
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setIsErrorDialogVisible(true);
      }
    });
  }
  //모임 신청 취소처리
  const handleNotApplySubmit = () => {
    setNotApplyComfirmVisible(false);

    const requestBody = {
      group_id: Number(groupInfo?.group_id),
    } as GroupApply;


    // 실제 신청 로직은 여기에 추가 (API 호출 등)
    groupCancelApply.mutate(requestBody, {
      onSuccess: () => {
        Alert.alert('모임에 취소되었습니다.');    
        refetchMemberList(); //참여멤버 재조회
      },
      onError: (error) => {
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setIsErrorDialogVisible(true);
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
        setDeleteConfirmVisible(true);
      },
    },
  ];  

  return (
    <View style={styles.container}>
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
          style={styles.detailMenuBackdrop}
          activeOpacity={1}
          onPress={() => setIsDetailMenuVisible(false)}
        />
      )}

      {isDetailMenuVisible && (
        <View style={styles.detailMenuLayer} pointerEvents="box-none">
          <View style={styles.detailMenuAnchor}>
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 1. 이미지 캐러슬---------------------------- */}
        <View>
          {/* onPressImage={(i) => console.log("pressed image", i)}  추후 이미지 수정 기능 추가 시 활용 */}
          <ImageCarousel
            images={imageList.length ? imageList.map((file) => file.file_path) : []}
            height={280}
          />
        </View>

        {/* 2. 소셜링 정보---------------------------- */}
        <View style={styles.commContainer}>
          {/* 소셜링 라벨 */}
          <View style={styles.labelContainer}>
              <CommLabel variant="club" />
              {/* 추후 넘긴 카테고리 값으로 세팅 */}
              <CommLabel variant="category" category="게임" />
          </View>

          {/* 소셜링 제목 */}
          <Text style={styles.commContainerTitle}>{groupInfo?.group_name}</Text>

          {/* 소셜링 장소, 날짜, 시간 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconCalendar />
            <Text style={styles.contentInfoText}>{`${groupInfo?.group_subj}`}</Text>
          </View>
          {/* 설명 */}
          <Text style={styles.contentDesc}>{groupInfo?.group_desc}</Text>
        </View>
        
        <DividingLine />
        {/* 3. 모임장 및 참여 멤버---------------------------- */}
        {/* 모임장 소개 섹션 */}
        <View style={styles.membersContainer}>
          {/* 모임장 소개 섹션 */}
          <View style={styles.membersSection}>
            <Text style={styles.membersSectionTitle}>모임장 소개</Text>
            <View style={styles.hostContainer}>
                <ProfileIcon mem_image_url={groupInfo?.mem_image_url || ''} type="HOST" />
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>{groupInfo?.mem_nick}</Text>
                {/* <Text style={styles.hostGreeting}>{groupInfo?.mem_interest}</Text> */}
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
              renderItem={({ item }) => 
                item.host_yn === 'Y' ? (
                  <ProfileIcon mem_image_url={item?.mem_image_url || ''} type="HOST" />
                ) : (
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
            <DetailInfoRow icon={<IconPencil width={20} height={20} />} text={`취미 > ${groupInfo?.group_subj || ''}`} />
            {/* <DetailInfoRow icon={<IconInfoMark width={20} height={20} />} text={`타입 > ${groupInfo?.group_type || ''}`} /> */}
            <DetailInfoRow icon={<IconMembers width={20} height={20} />} text={`인원 > 최대 ${groupInfo?.group_max || ''}명`} />
            {/* <DetailInfoRow icon={<IconInfoMark width={20} height={20} />} text={`비용 > ${groupInfo?.fee_info || ''}`} /> */}
            {/* <DetailInfoRow icon={<IconCalendar width={20} height={20} />} text={`날짜 > ${groupInfo?.group_datetime || ''}`} /> */}
            {/* <DetailInfoRow icon={<IconMarker width={20} height={20} />} text={`장소 > ${groupInfo?.place_name || ''}`} /> */}
          </View>

        </View>         

        {/* 장소 주소 및 지도?? */}
        {/* 6. 댓글 ??---------------------------- */}
        {/* <DividingLine />
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
            scrollEnabled={false}         
            nestedScrollEnabled={true}    
          />

           댓글 입력창 
          <View style={styles.commentInputWrapper}>
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
        </KeyboardAvoidingView> */}
        

      </ScrollView>

      {groupInfo?.apply_stat === '-1' && (
        <CommBottomButton 
          label="신청하기" 
          onPress={() => router.checkAndNavigate(() => setApplyComfirmVisible(true), '/groups/groupDetailPage')}
        />
      )}
      {groupInfo?.apply_stat === '0' && (
        <CommBottomButton 
          label="신청 취소하기" 
          onPress={() => setNotApplyComfirmVisible(true)} 
        />
      )}
      {groupInfo?.apply_stat === '1' && (
        <CommBottomButton 
          label="채팅하기" 
          onPress={() => {router.push({
          pathname: "/chats",
          params: {
            room_id   : `${COMM_CONSTANTS.CHAT_TYPE_GROUP}_${groupInfo.group_id}`,
            room_name : groupInfo.group_name,
            room_type : COMM_CONSTANTS.CHAT_TYPE_GROUP,
          },
        })}} />
      )}


      {/* 4. 클럽 가입 모달 조립 */}
      <CustomDialog
        visible={isApplyComfirmVisible}
        title="클럽 가입 질문"
        content={groupInfo?.apply_type === 'A' && groupInfo.group_question ? groupInfo.group_question : "이 모임에 신청하시겠어요?"}        
        textInput={groupInfo?.apply_type === 'A' && groupInfo.group_question ? "답변을 작성해주세요." : null}
        cancelLabel="취소"
        confirmLabel="완료"
        onCancel={() => setApplyComfirmVisible(false)}
        onConfirm={handleApplySubmit}
      />

      <CustomDialog
        visible={isNotApplyComfirmVisible}
        title="클럽 참여 취소"
        content="이 모임에 참여를 취소하시겠어요?"
        cancelLabel="취소"
        confirmLabel="완료"
        onCancel={() => setNotApplyComfirmVisible(false)}
        onConfirm={handleNotApplySubmit}
      />

      <CustomDialog
        visible={isDeleteConfirmVisible}
        title="클럽 삭제"
        content="정말 삭제하시겠습니까?"
        cancelLabel="아니오"
        confirmLabel="예"
        onCancel={() => setDeleteConfirmVisible(false)}
        onConfirm={handleDeleteSubmit}
      />

      <CustomDialog
        visible={isErrorDialogVisible}
        title="처리 실패"
        content={`정상 처리되지 않았습니다. \n${errorMessage}`}
        cancelLabel="닫기"
        onCancel={() => {
          setIsErrorDialogVisible(false)
          refetchMemberList();
        }}
        onConfirm={() => {
          setIsErrorDialogVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  detailMenuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  detailMenuLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 11,
  },
  detailMenuAnchor: {
    position: 'absolute',
    top: 44,
    right: 8,
  },
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