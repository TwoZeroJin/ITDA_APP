import { COLOR, COMM_STYLES } from "@/constants";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import { useNoticeView } from "@/hooks/queries/useNotice";
import { useLocalSearchParams } from "expo-router";
import RenderHtml from 'react-native-render-html';

const HTML_TAG_STYLES = {
  p: {
    marginTop    : 0,
    marginBottom : 10,
  },
  div: {
    marginTop    : 0,
    marginBottom : 10,
  },
  span: {
    color        : COLOR.TEXT_DEFAULT,
  },
  br: {
    marginBottom : 6,
  },
};

/**
 * 마이페이지 - 공지사항 조회 화면
 */
export default function NoticeViewScreen() {
  const { width } = useWindowDimensions();
  const { noticeId } = useLocalSearchParams();

  const { data, isLoading, isFetching, isError } = useNoticeView(Number(noticeId));
  const notice = data?.data;

  return (
    <View style={COMM_STYLES.CONTAINER}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="공지사항 조회" isBack={true} />

      {isLoading || isFetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={COLOR.APP_MAIN} />
        </View>
      ) : isError || !notice ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>공지사항을 불러오지 못했습니다.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subjectText}>{notice.noti_subject}</Text>
          <Text style={styles.dateText}>{notice.reg_sdate}</Text>
          <View style={styles.divider} />
          {/* HTML 태그 렌더링 */}
          <RenderHtml
            contentWidth={width - 40}
            source={{ html: notice.noti_content ?? '' }}
            baseStyle={styles.contentText}
            tagsStyles={HTML_TAG_STYLES}
          />
        </ScrollView>
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex              : 1,
    justifyContent    : 'center',
    alignItems        : 'center',
  },
  contentContainer: {
    paddingHorizontal : 20,
    paddingVertical   : 16,
  },
  subjectText: {
    fontSize          : 18,
    fontWeight        : 'bold',
    color             : COLOR.TEXT_3C3C3C,
  },
  dateText: {
    marginTop         : 8,
    fontSize          : 12,
    color             : COLOR.TEXT_GRAY,
  },
  divider: {
    marginBottom      : 16,
    borderBottomWidth : 1,
    borderBottomColor : COLOR.COMM_GRAY_6,
  },
  contentText: {
    fontSize          : 14,
    lineHeight        : 22,
    color             : COLOR.TEXT_DEFAULT,
  },
  emptyText: {
    fontSize          : 14,
    color             : COLOR.TEXT_GRAY,
  },
});