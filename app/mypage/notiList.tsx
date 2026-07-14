import { COLOR, COMM_STYLES, STORE_KEY } from "@/constants";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import { usePushListPaging } from "@/hooks/queries/usePush";
import { PushData } from "@/types";
import { CategoryTab } from "@/components/CategoryTab";
import { COMM_CONSTANTS } from "@/constants";
import { formatRelativeTime } from "@/utils/commUtil";
import { saveAsyncStore } from "@/utils/asyncStoreUtil";
import { emitPushCountChanged } from "@/utils/pushCountEvent";
import { useAuthRouter } from "@/components/comm/AuthRoute";

/**
 * 마이페이지 - 알림 화면
 */
export default function NotiListScreen() {
  const router = useAuthRouter();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const { results, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = usePushListPaging({
    page_no   : 0,
    page_size : 10,
  });

  // 푸시화면으로 올 시 push count 초기화
  useEffect(() => {
    const resetPushCount = async () => {
      await saveAsyncStore(STORE_KEY.PUSH_COUNT, '0');
      emitPushCountChanged(0);
    };

    resetPushCount();
  }, []);

  const getCategoryFromItem = (item: PushData): string => {
    if (item.push_type.includes('MEET')) {
      return COMM_CONSTANTS.COMM_MEET;
    }
    if (item.push_type.includes('GROUP')) {
      return COMM_CONSTANTS.COMM_GROUP;
    }

    if (item.push_type.includes('CHAT')) {
      return COMM_CONSTANTS.COMM_MEMBER;
    }

    return '';
  };

  const filteredResults = useMemo(() => {
    if (!activeCategory) return results;

    return results.filter((item) => getCategoryFromItem(item) === activeCategory);
  }, [results, activeCategory]);

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="알림"/>
      <CategoryTab data={activeCategory} onPress={setActiveCategory} isMember={true} />

      <FlatList
        data={filteredResults}
        keyExtractor={(item, index) => `${item.push_type}-${item.sent_date}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notiRow}
            activeOpacity={0.6}
            onPress={() => {
              if (item.push_data) {
                const target_type = item.push_type.includes('MEET') ? COMM_CONSTANTS.COMM_MEET : COMM_CONSTANTS.COMM_GROUP;
                const target_id = JSON.parse(item.push_data)?.[`${target_type.toLowerCase()}_id`];
                const apply_type = item.push_type.includes('APPLY') ? JSON.parse(item.push_data)?.[`apply_type`] : '';
                const pathname = item.push_type.includes('APPLY') ? (apply_type === 'A' ? '/members/applyList': '/members/memberList') : item.push_type.includes('CONFIRM') ? '/members/memberList' : '/chats';
                if (pathname.includes('/members')) {
                  router.navigate({
                    pathname: pathname,
                    params: {
                      target_id: target_id,
                      target_type: target_type === COMM_CONSTANTS.COMM_MEET ? 'M' : 'G',
                    }
                  });
                }
                else if (pathname.includes('/chat')) {
                  const chat_data = JSON.parse(item.push_data);
                  router.navigate({
                    pathname: pathname,
                    params: {
                      room_id       : chat_data?.room_id,
                      room_name     : chat_data?.room_name,
                      room_type     : chat_data?.room_type,
                      expiry_date   : chat_data?.expiry_date
                    }
                  });
                }
              }
            }}
          >
            <View style={styles.notificationTextWrap}>
              <View style={styles.titleRow}>
                <Text style={styles.notiTitle} numberOfLines={1}>{item.push_title}</Text>
                <Text style={styles.timeText}>{formatRelativeTime(item.sent_date)}</Text>
              </View>
              <Text style={styles.notificationSubText} numberOfLines={2}>{item.push_message}</Text>
            </View>
          </TouchableOpacity>
        )}
        onRefresh={refetch}
        refreshing={isRefetching}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="small" color={COLOR.APP_MAIN} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>받은 알림이 없습니다.</Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={COLOR.APP_MAIN} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  notiRow: {
    borderBottomWidth : 1,
    borderBottomColor : COLOR.COMM_GRAY_6,
    paddingVertical   : 18,
    marginHorizontal  : 16,
  },
  notificationTextWrap: {
    flex              : 1,
    width            : '85%',
  },
  titleRow: {
    flexDirection     : 'row',
  },
  notiTitle: {
    fontSize          : 16,
    fontFamily        : 'Pretendard-Medium',
    color             : COLOR.COLOR_323232,
  },
  timeText: {
    fontSize          : 12,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.COLOR_6B6B6B,
    alignSelf         : 'center',
    marginStart       : 4,
  },
  notificationSubText: {
    marginTop         : 8,
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.COLOR_6B6B6B,
  },
  emptyContainer: {
    paddingVertical   : 32,
    alignItems        : 'center',
    justifyContent    : 'center',
  },
  emptyText: {
    fontSize          : 14,
    color             : COLOR.TEXT_GRAY,
  },
  footerLoader: {
    paddingVertical   : 16,
    alignItems        : 'center',
  },
});