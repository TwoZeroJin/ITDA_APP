import React, { useCallback, useEffect, useRef, useState } from "react";
import CommHeader from "@/components/comm/CommHeader";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import { COLOR } from "@/constants";
import MemDefault from '@/assets/images/icon_mem_default.svg';
import IconPencil from '@/assets/images/icon_pencil.svg';
import { getMemberInfo, getCategoryList } from '@/utils/commUtil';
import { MemberInfo } from "@/types";
import { useFocusEffect } from "expo-router";
import DividingLine from "@/components/DividingLine";
import CommUpcomingMeetList from "@/components/comm/CommUpcomingMeetList";
import { useMemberDetail } from "@/hooks/queries/useMember";
import CommReviewList from "@/components/comm/CommReviewList";
import { useAuthRouter } from "@/components/comm/AuthRoute";
import { useLoading } from "@/contexts/LoadingContext";
import CommHorizontalList from "@/components/comm/CommHorizontalList";

/**
 * 마이페이지 - 내 정보 화면
 */
export default function MyPageScreen() {
  const router = useAuthRouter();
  const [memberInfo, setMemberInfo] = useState<MemberInfo>();
  const [refreshing, setRefreshing] = useState(false);
  const { setLoading } = useLoading();
  const hasHandledInitialLoadingRef = useRef(false);
  const [interestCategories, setInterestCategories] = useState<{ label: string; id: string }[]>([]);
  const { upcomingMeetList, myMeetList, myGroupList, applyMeetList, applyGroupList, reviewList, isLoading, refetch } = useMemberDetail();
  const profileImageUrl = memberInfo?.mem_image_url;

  const fetchMyMemberInfo = useCallback(async () => {
    const memberInfo = await getMemberInfo();

    setMemberInfo(memberInfo);
    
    if (memberInfo.mem_interest) {
      const interestIds = memberInfo.mem_interest.split('|').filter(Boolean);
      const categoryList = await getCategoryList();
      const subCategoryList = categoryList.flatMap((cat) => cat.sub_list ?? []);
      const matched = interestIds
        .map((id) => {
          const found = subCategoryList.find((cat) => cat.code_id === id);
          return found ? { label: found.code_value, id: found.code_id } : null;
        })
        .filter((item): item is { label: string; id: string } => item !== null);
      setInterestCategories(matched);
      return;
    }

    setInterestCategories([]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchMyMemberInfo();
    }, [fetchMyMemberInfo])
  );

  // 초기 진입시 로딩 관리
  useEffect(() => {
    if (hasHandledInitialLoadingRef.current) {
      return;
    }
    if (isLoading) {
      setLoading(true);
      return;
    }
    setLoading(false);
    hasHandledInitialLoadingRef.current = true;
  }, [isLoading, setLoading]);

  // 위로 땡겨서 새로고침
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const recommendSections = [
    {
      key       : 'applyMeet',
      title     : '내가 참여한 소셜링',
      subTitle  : '내가 참여한 소셜링이에요.',
      data      : applyMeetList,
    },
    {
      key       : 'applyGroup',
      title     : '내가 참여한 클럽',
      subTitle  : '내가 참여한 클럽이에요.',
      data      : applyGroupList,
    },
    {
      key       : 'myMeet',
      title     : '내가 만든 소셜링',
      subTitle  : '내가 만든 소셜링이에요.',
      data      : myMeetList,
    },
    {
      key       : 'myGroup',
      title     : '내가 만든 클럽',
      subTitle  : '내가 만든 클럽이에요.',
      data      : myGroupList,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <CommHeader isNoti={false} isSetting={true} isLike={false} />

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* 프로필 섹션 */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImageWrap}>
            {profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
            ) : (
              <MemDefault width={40} height={40} />
            )}
          </View>
          <View style={{ flex: 1, marginStart: 12 }}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>{memberInfo?.mem_nick || memberInfo?.mem_name || ''}</Text>
              <TouchableOpacity 
                style={styles.editBtnGroup} 
                activeOpacity={0.6}
                onPress={() => router.navigate('/mypage/memUpdate')}>
                <IconPencil width={20} height={20}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* 교회 및 팀 정보 */}
        <View style={styles.churchTeamRow}>
          <View style={styles.churchTeamChip}>
            <Text style={styles.churchTeamChipText}>{memberInfo?.mem_church_nm || ''}</Text>
          </View>
          {memberInfo?.mem_church_tm_nm && (
            <View style={styles.churchTeamChip}>
              <Text style={styles.churchTeamChipText}>{memberInfo?.mem_church_tm_nm}</Text>
            </View>
          )}
        </View>

        <DividingLine />

        {/* 관심 취미 섹션 */}
        <View style={styles.commContainer}>
          <Text style={styles.sectionTitle}>관심 취미</Text>
          {interestCategories.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.interestScroll}
            >
              {interestCategories.map((cat) => (
                <View key={cat.id} style={styles.interestChip}>
                  <Text style={styles.interestText}>{cat.label}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.interestEmptyText}>관심 카테고리가 없습니다.</Text>
          )}
        </View>

        <DividingLine />

        {/* 다가오는 모임 리스트 섹션 */}
        <CommUpcomingMeetList upcomingMeetList={upcomingMeetList} />

        <DividingLine />

        {/* 모임 내역 */}
        <CommHorizontalList sections={recommendSections} isMember={true} />

        <DividingLine />

        {/* 내가 쓴글 섹션 */}
        <CommReviewList reviewList={reviewList} />

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor   : COLOR.COMM_WHITE,
    paddingVertical   : 12,
    paddingBottom     : 40,
  },
  profileContainer: {
    flexDirection     : "row",
    alignItems        : "center",
    alignContent      : "center",
    marginBottom      : 20,
    paddingHorizontal : 16,
  },
  profileImageWrap: {
    width             : 40,
    height            : 40,
    borderRadius      : 20,
    alignItems        : 'center',
    justifyContent    : 'center',
    position          : 'relative',
  },
  profileImage: {
    width             : 40,
    height            : 40,
    borderRadius      : 20,
  },
  profileCameraBadge: {
    position          : 'absolute',
    right             : -4,
    bottom            : -2,
  },
  churchTeamRow: {
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 8,
    marginBottom      : 20,
    paddingHorizontal : 16,
  },
  churchTeamChip: {
    backgroundColor   : COLOR.COMM_GRAY_5,
    borderRadius      : 999,
    padding           : 8
  },
  churchTeamChipText: {
    color             : COLOR.COLOR_6B6B6B,
    fontSize          : 12,
    fontFamily        : 'Pretendard-Medium',
  },
  nameRow: {
    flexDirection     : "row",
    alignItems        : "center",
    alignContent      : "center",
    gap               : 6,
  },
  nameText: {
    fontSize          : 28,
    fontFamily        : "Pretendard-Bold",
    color             : COLOR.TEXT_1C1C1C,
  },
  intro: {
    fontSize          : 12,
    fontFamily        : 'Pretendard-Medium',
    color             : COLOR.TEXT_GRAY,
    lineHeight        : 18,
    marginBottom      : 8,
  },
  editBtnGroup: {
    flexDirection     : "row",
    gap               : 6,
    width             : 50,
    alignItems        : "center",
    marginStart       : -7,
    paddingStart      : 7,
    paddingVertical   : 10,
  },
  smallBtn: {
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    borderRadius      : 6,
    paddingHorizontal : 8,
    paddingVertical   : 4,
  },
  // 관심 취미
  commContainer: {
    paddingHorizontal : 16,
    paddingVertical   : 16,
  },
  sectionTitle: {
    fontSize          : 20,
    fontFamily        : 'Pretendard-SemiBold',
    color             : COLOR.TEXT_1C1C1C,
    marginBottom      : 10,
  },
  interestScroll: {
    gap               : 8,
  },
  interestChip: {
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    borderRadius      : 8,
    paddingHorizontal : 14,
    paddingVertical   : 7,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  interestText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
  },
  interestEmptyText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_GRAY,
    paddingVertical   : 8,
    paddingHorizontal : 4,
  },
});