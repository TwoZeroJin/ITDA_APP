import React, { useCallback, useState } from "react";
import CommHeader from "@/components/CommHeader";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { COLOR } from "@/constants";
import MemDefault from '@/assets/images/icon_mem_default.svg';
import IconPencil from '@/assets/images/icon_pencil.svg';
import { getMemberInfo, getCategoryList } from '@/utils/commUtil';
import { MemberInfo } from "@/types";
import { useAuth } from "@/hooks/queries/useAuth";
import { router, useFocusEffect } from "expo-router";
import CustomDialog from "@/components/CustomDialog";
import DividingLine from "@/components/DividingLine";
import CommUpcomingMeetList from "@/components/CommUpcomingMeetList";
import { useMemberDetail } from "@/hooks/queries/useMember";
import CommReviewList from "@/components/CommReviewList";

/**
 * 마이페이지 - 내 정보 화면
 */
export default function MyPageScreen() {
  const { logout } = useAuth();
  const [memberInfo, setMemberInfo] = useState<MemberInfo>();
  const [isAuthDialogVisible, setIsAuthDialogVisible] = useState(false);
  const [interestCategories, setInterestCategories] = useState<{ label: string; id: string }[]>([]);
  const { upcomingMeetList, newClassList, reviewList } = useMemberDetail();
  const profileImageUrl = memberInfo?.mem_image_url;

  const fetchMyMemberInfo = useCallback(async () => {
    const memberInfo = await getMemberInfo();

    if (!memberInfo) {
      setIsAuthDialogVisible(true);
      return;
    }

    setMemberInfo(memberInfo);

    if (memberInfo.mem_interest) {
      const interestIds = memberInfo.mem_interest.split('|').filter(Boolean);
      const categoryList = await getCategoryList();
      const matched = interestIds
        .map((id) => {
          const found = categoryList.find((cat) => cat.code_id === id);
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

  return (
    <View style={styles.container}>
      <CommHeader isNoti={false} isSetting={true} isLike={false} />

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
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
              <TouchableOpacity style={styles.editBtnGroup} activeOpacity={0.7} onPress={() => router.navigate('/mypage/memUpdate')}>
                <IconPencil width={20} height={20}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* 교회 및 팀 정보 */}
        <View style={styles.churchTeamRow}>
          <View style={styles.churchTeamChip}>
            <Text style={styles.churchTeamChipText}>{memberInfo?.mem_church_nm || '한성교회'}</Text>
          </View>
          <View style={styles.churchTeamChip}>
            <Text style={styles.churchTeamChipText}>{memberInfo?.mem_church_tm_nm || '기회팀'}</Text>
          </View>
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
                <TouchableOpacity key={cat.id} style={styles.interestChip} activeOpacity={0.7}>
                  <Text style={styles.interestText}>{cat.label}</Text>
                </TouchableOpacity>
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

        {/* 모임 내역 추후 작업 */}

        {/* 내가 쓴글 섹션 */}
        <CommReviewList reviewList={reviewList} />

      </ScrollView>

      <CustomDialog
        visible={isAuthDialogVisible}
        content="로그인이 필요합니다."
        confirmLabel="OK"
        onCancel={() => {}}
        onConfirm={() => {
          setIsAuthDialogVisible(false);
          logout();
          router.replace('/user/login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex            : 1,
    backgroundColor : COLOR.COMM_WHITE,
  },
  content: {
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
    flexDirection : "row",
    alignItems    : "center",
    alignContent  : "center",
    gap           : 6,
  },
  nameText: {
    fontSize      : 28,
    fontWeight    : "bold",
    color         : COLOR.TEXT_1C1C1C,
  },
  intro: {
    fontSize: 12,
    color: COLOR.TEXT_GRAY,
    lineHeight: 18,
    marginBottom: 8,
  },
  editBtnGroup: {
    flexDirection: "row",
    gap: 6,
  },
  smallBtn: {
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  smallBtnText: {
    fontSize: 11,
    color: COLOR.TEXT_DEFAULT,
    fontWeight: "500",
  },
  // 관심 취미
  commContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize      : 20,
    fontWeight    : "bold",
    color         : COLOR.TEXT_1C1C1C,
    marginBottom  : 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  seeMore: {
    fontSize: 16,
    color: COLOR.TEXT_GRAY,
  },
  meetTitleContainer: {
    height : 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  }, 
  meetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  meetListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestScroll: {
    paddingRight: 16,
    gap: 8,
  },
  interestChip: {
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: COLOR.COMM_WHITE,
  },
  interestText: {
    fontSize: 12,
    color: COLOR.TEXT_DEFAULT,
    fontWeight: "500",
  },
  interestEmptyText: {
    fontSize: 13,
    color: COLOR.TEXT_GRAY,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  meetScroll: {
    paddingRight: 16,
    gap: 10,
  },
  upcomingCard: {
    width: 130,
    backgroundColor: COLOR.COMM_GRAY_5,
    borderRadius: 10,
    padding: 8,
  },
  upcomingThumbnail: {
    width: "100%",
    height: 80,
    backgroundColor: COLOR.APP_MAIN,
    borderRadius: 8,
    marginBottom: 8,
  },
  upcomingTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLOR.TEXT_DEFAULT,
  },
  upcomingSubtitle: {
    fontSize: 10,
    color: COLOR.TEXT_GRAY,
    marginTop: 2,
  },
  upcomingTag: {
    fontSize: 9,
    color: COLOR.COMM_RED,
    fontWeight: "600",
    marginTop: 4,
  },

  tabContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLOR.COMM_GRAY_6,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: COLOR.APP_MAIN,
  },
  tabText: {
    fontSize: 13,
    color: COLOR.TEXT_GRAY,
    fontWeight: "500",
  },
  tabTextActive: {
    color: COLOR.COMM_WHITE,
  },

  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: COLOR.COMM_WHITE,
    gap: 10,
  },
  thumbnail: {
    width: 90,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLOR.COMM_GRAY_5,
    flexShrink: 0,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dday: {
    color: COLOR.COMM_RED,
    fontSize: 11,
    fontWeight: "700",
  },
  statusPill: {
    backgroundColor: COLOR.APP_MAIN,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusDone: {
    backgroundColor: COLOR.TEXT_31AD69,
  },
  statusText: {
    color: COLOR.COMM_WHITE,
    fontSize: 10,
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLOR.TEXT_DEFAULT,
  },
  meta: {
    fontSize: 11,
    color: COLOR.TEXT_GRAY,
    marginTop: 3,
  },

  postCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.COMM_GRAY_6,
    gap: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLOR.COMM_GRAY_5,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  postTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLOR.TEXT_DEFAULT,
  },
  postMetaRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  postMeta: {
    fontSize: 10,
    color: COLOR.TEXT_GRAY,
  },
  postDate: {
    fontSize: 10,
    color: COLOR.TEXT_GRAY,
  },

  feedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  feedItem: {
    width: "48%",
  },
  feedThumbnail: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: COLOR.COMM_GRAY_5,
    borderRadius: 8,
    marginBottom: 6,
  },
  feedTitle: {
    fontSize: 11,
    color: COLOR.TEXT_DEFAULT,
    fontWeight: "500",
  },
});