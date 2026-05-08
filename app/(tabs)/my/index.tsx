import React, { useEffect, useState } from "react";
import CommHeader from "@/components/CommHeader";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { COLOR } from "@/constants";
import MemDefault from '@/assets/images/icon_mem_default.svg';
import IconPencil from '@/assets/images/icon_pencil.svg';
import * as commUtil from '@/utils/commUtil';
import { MemberInfo } from "@/types";
import { useAuth } from "@/hooks/queries/useAuth";
import { router } from "expo-router";
import CustomDialog from "@/components/CustomDialog";
import DividingLine from "@/components/DividingLine";

/**
 * 마이페이지 - 내 정보 화면
 */
export default function MyPageScreen() {
  const { logout } = useAuth();
  const [memberInfo, setMemberInfo] = useState<MemberInfo>();
  const [isAuthDialogVisible, setIsAuthDialogVisible] = useState(false);
  const [interestCategories, setInterestCategories] = useState<{ label: string; id: string }[]>([]);

  // 회원정보 조회 및 없을 경우 로그인 화면으로 이동
  useEffect(() => {
      const fetchMyMemberInfo = async () => {
        const memberInfo = await commUtil.getMemberInfo();

        if (!memberInfo) {
          setIsAuthDialogVisible(true);
          return;
        }
        setMemberInfo(memberInfo);

        if (memberInfo.mem_interest) {
          const interestIds = memberInfo.mem_interest.split('|').filter(Boolean);
          const categoryList = await commUtil.getCategoryList();
          const matched = interestIds
            .map((id) => {
              const found = categoryList.find((cat) => cat.code_id === id);
              return found ? { label: found.code_value, id: found.code_id } : null;
            })
            .filter((item): item is { label: string; id: string } => item !== null);
          setInterestCategories(matched);
        }
      };
  
      fetchMyMemberInfo();
    }, []);

  const upcomingMeets = [
    { id: 1, title: "D-Day", subtitle: "매주 수요일 오후...", tag: "D-3 (11.08)" },
    { id: 2, title: "콜러스식여행단...", subtitle: "부산 · 진해", tag: "D-3 (11.08)" },
  ];

  const posts = [
    { id: 1, title: "하와이에서의 추억😍😍", meta: "여행" },
    { id: 2, title: "맛있는 음식 먹으러 가자!", meta: "음식" },
    { id: 3, title: "등산 가는 길", meta: "스포츠" },
  ];

  const feedImages = [
    { id: 1, title: "하와이에서의 추억😍😍" },
    { id: 2, title: "해변 일몰🌅" },
    { id: 3, title: "서울야경" },
    { id: 4, title: "보도독터 도움말" },
  ];

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
          <MemDefault width={40} height={40} />
          <View style={{ flex: 1, marginStart: 12 }}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>{memberInfo?.mem_nick || memberInfo?.mem_name || ''}</Text>
              <Pressable>
                <IconPencil width={20} height={20}/>
              </Pressable>
            </View>
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
                <Pressable key={cat.id} style={styles.interestChip}>
                  <Text style={styles.interestText}>{cat.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.interestEmptyText}>관심 카테고리가 없습니다.</Text>
          )}
        </View>

        <DividingLine />

        {/* 모임 내역 탭 */}
        <View style={styles.commContainer}>
          <Text style={styles.sectionTitle}>모임 내역</Text>
          <View style={styles.tabContainer}>
          </View>
        </View>

        {/* 게시 섹션 */}
        <View style={styles.commContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>게시</Text>
            <Pressable>
              <IconPencil />
            </Pressable>
          </View>
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <View style={styles.postMetaRow}>
                  <Text style={styles.postMeta}>사진</Text>
                  <Text style={styles.postMeta}>·</Text>
                  <Text style={styles.postMeta}>{post.meta}</Text>
                </View>
              </View>
              <Text style={styles.postDate}>6.28</Text>
            </View>
          ))}
        </View>

        {/* 피드 섹션 */}
        <View style={styles.commContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>피드</Text>
            <Pressable>
              <IconPencil />
            </Pressable>
          </View>
          <View style={styles.feedGrid}>
            {feedImages.map((item) => (
              <View key={item.id} style={styles.feedItem}>
                <View style={styles.feedThumbnail} />
                <Text style={styles.feedTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
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

/** =========================
 * Styles
 * ========================= */
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