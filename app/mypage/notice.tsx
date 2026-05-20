import { COLOR } from "@/constants";
import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import { useNoticeListPaging } from "@/hooks/queries/useNotice";
import IconMore from '@/assets/images/arrow_right.svg';
import { BoardNotice, SearchParams } from "@/types";
import { router } from "expo-router";

/**
 * 마이페이지 - 공지사항 화면
 */
export default function NoticeScreen() {
  const searchParams = useMemo<SearchParams>(() => ({
    page_no   : 0,
    page_size : 20,
  }), []);

  const { results, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useNoticeListPaging(searchParams);

  const handleEndReached = () => {
    if (!hasNextPage || isFetchingNextPage || isFetching) return;
    fetchNextPage();
  };

  const renderItem = ({ item }: { item: BoardNotice }) => (
    <TouchableOpacity
      style={styles.menuRow}
      activeOpacity={0.7}
      onPress={() => router.navigate({ pathname: '/mypage/noticeView', params: { noticeId: item.noti_id } })}
    >
      <Text style={styles.menuText} numberOfLines={1}>{item.noti_subject}</Text>
      <IconMore width={11} height={16} />
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>등록된 공지사항이 없습니다.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="공지사항"/>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLOR.APP_MAIN} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.noti_id)}
          contentContainerStyle={styles.menuContainer}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshing={isFetching && !isFetchingNextPage}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex            : 1,
    backgroundColor : COLOR.COMM_WHITE,
  },
  menuContainer: {
    flex              : 1,
    paddingHorizontal : 16,
  },
  menuRow: {
    borderBottomWidth : 1,
    borderBottomColor : COLOR.COMM_GRAY_6,
    flexDirection     : 'row',
    alignItems        : 'center',
    justifyContent    : 'space-between',
    marginVertical    : 12,
    paddingBottom     : 12,
  },
  menuText: {
    fontSize          : 16,
    fontWeight        : 'medium',
    color             : COLOR.TEXT_DEFAULT,
  },
  loadingContainer: {
    flex              : 1,
    justifyContent    : 'center',
    alignItems        : 'center',
  },
  emptyContainer: {
    flex              : 1,
    justifyContent    : 'center',
    alignItems        : 'center',
    paddingVertical   : 48,
  },
  emptyText: {
    fontSize          : 14,
    color             : COLOR.TEXT_GRAY,
  },
  footerLoading: {
    paddingVertical   : 16,
  },
  footerSpacing: {
    height            : 16,
  },
});