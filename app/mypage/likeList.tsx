import CommHeader from '@/components/comm/CommHeader';
import { CategoryTab } from '@/components/CategoryTab';
import CommLabel from '@/components/comm/CommLabel';
import BtnLikeActive from '@/assets/images/btn_like_active.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import MemDefault from '@/assets/images/icon_mem_default.svg';
import { COLOR, COMM_CONSTANTS, COMM_STYLES } from '@/constants';
import { useMemberLike, useMemberLikeListPaging } from '@/hooks/queries/useMember';
import { LikeData } from '@/types';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { router } from 'expo-router';

/**
 * 좋아요 리스트 화면
 */
export default function LikeListScreen() {
  const memberLike = useMemberLike();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());

  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useMemberLikeListPaging({
    page_no   : 0,
    page_size : 20,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredMeets = useMemo(() => {
    if (activeCategory === "") {
      return results;
    }

    const typeMap: Record<string, string> = {
      [COMM_CONSTANTS.CHAT_TYPE_MEET]: 'M',
      [COMM_CONSTANTS.CHAT_TYPE_GROUP]: 'G',
      [COMM_CONSTANTS.CHAT_TYPE_CLASS]: 'C',
    };

    const targetType = typeMap[activeCategory];
    if (!targetType) return results;

    return results.filter((item) => item.target_type === targetType);
  }, [activeCategory, results]);

  const visibleMeets = useMemo(
    () => filteredMeets.filter((item) => !removedIds.has(item.target_id)),
    [filteredMeets, removedIds],
  );

  const [imageErrors, setImageErrors] = useState<Record<string | number, boolean>>({});

  // 좋아요 취소 — 낙관적으로 즉시 제거, 실패 시 롤백
  const handleLikePress = (targetId: number, targetType: string) => {
    if (!targetId) return;

    setRemovedIds((prev) => new Set(prev).add(targetId));

    memberLike.mutate(
      { target_id: targetId, target_type: targetType, flag: false },
      {
        onError: () => {
          setRemovedIds((prev) => {
            const next = new Set(prev);
            next.delete(targetId);
            return next;
          });
        },
      },
    );
  };

  const renderMeetCard = ({ item }: { item: LikeData }) => {
    const hasError = imageErrors[item.target_id];
    const imageSource = item.thumb_url && !hasError
      ? { uri: item.thumb_url }
      : require('@/assets/images/no_image.png');

    return (
      <TouchableOpacity 
        style={styles.cardContainer}
        activeOpacity={0.6}
        onPress={() => {
          if (item.target_type === 'M') {
            router.push({
              pathname: '/meets/meetDetailPage',
              params: { meetId: item.target_id },
            });
            return;
          }
          else if (item.target_type === 'G') {
            router.push({
              pathname: '/meets/groupDetailPage',
              params: { groupId: item.target_id },
            });
          }
        }}
      >
        <View style={styles.likeCard}>
          <ImageBackground
            source={imageSource}
            style={styles.likeCardImage}
            imageStyle={styles.likeCardImageStyle}
            onError={() => setImageErrors((prev) => ({ ...prev, [item.target_id]: true }))}
          >
            <TouchableOpacity 
              style={styles.likeBtn} 
              activeOpacity={0.6}
              onPress={() => handleLikePress(item.target_id, item.target_type)}
            >
              <BtnLikeActive />
            </TouchableOpacity>
          </ImageBackground>

          {/* 콘텐츠 영역 */}
          <View style={styles.likeCardContent}>
            {/* 태그 행 */}
            <View style={styles.tagRow}>
              <CommLabel variant="social" />
              <CommLabel variant="category" category={item.target_subj_name} />
            </View>

            {/* 제목 */}
            <Text style={styles.likeCardTitle} numberOfLines={1}>
              {item.target_name}
            </Text>

            {/* 위치 + 인원 행 */}
            {(item.place_addr || item.apply_ratio) && (
              <View style={styles.infoRow}>
                {!!item.place_addr && (
                  <>
                    <IconMarker width={12} height={12} />
                    <Text style={styles.infoText}>{item.place_addr}</Text>
                  </>
                )}
                {!!item.apply_ratio && (
                  <>
                    <IconMembers width={12} height={12} />
                    <Text style={styles.infoText}>{item.apply_ratio}</Text>
                  </>
                )}
              </View>
            )}

            {/* 호스트 행 */}
            {!!item.mem_nick && (
              <View style={styles.hostRow}>
                {item.mem_image_url ? (
                  <Image source={{ uri: item.mem_image_url }} style={styles.hostImage} />
                ) : (
                  <MemDefault width={20} height={20} />
                )}
                <Text style={styles.hostText}>{item.mem_nick}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader title={"좋아요한 모임"} isBack={true} isLogo={false} isLike={false} isNoti={false} />
      <CategoryTab data={activeCategory} onPress={setActiveCategory} />

      <FlatList
        data={visibleMeets}
        keyExtractor={(item) => `${item.target_type}-${item.target_id}`}
        renderItem={renderMeetCard}
        contentContainerStyle={[
          styles.listContainer,
          filteredMeets.length === 0 && styles.listContainerEmpty,
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>좋아요한 모임이 없습니다.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal : 16,
    paddingVertical   : 16,
  },
  listContainerEmpty: {
    flexGrow          : 1,
  },
  cardContainer: {
    marginBottom      : 12,
  },
  likeCard: {
    flexDirection     : 'row',
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 12,
    padding           : 12,
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    alignItems        : 'center',
  },
  likeCardImage: {
    width             : 86,
    height            : 86,
    borderRadius      : 10,
  },
  likeCardImageStyle: {
    borderRadius      : 10,
  },
  likeBtn: {
    position          : 'absolute',
    bottom            : 0,
    right             : 0,
    width             : 35,
    height            : 35,
    justifyContent    : 'center',
    alignItems        : 'center',
  },
  likeCardContent: {
    flex              : 1,
    marginStart       : 12,
    justifyContent    : 'center',
    gap               : 4,
  },
  tagRow: {
    flexDirection     : 'row',
    flexWrap          : 'wrap',
    gap               : 6,
  },
  likeCardTitle: {
    fontSize          : 16,
    fontWeight        : 'bold',
    color             : COLOR.TEXT_3C3C3C,
  },
  infoRow: {
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 4,
  },
  infoText: {
    fontSize          : 12,
    color             : COLOR.COMM_SHADOW,
  },
  hostRow: {
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 6,
  },
  hostImage: {
    width             : 20,
    height            : 20,
    borderRadius      : 10,
  },
  hostText: {
    fontSize          : 12,
    color             : COLOR.TEXT_DEFAULT,
  },
  emptyContainer: {
    flex              : 1,
    justifyContent    : 'center',
    alignItems        : 'center',
    paddingBottom     : 80,
  },
  emptyText: {
    color             : COLOR.TEXT_GRAY,
    fontSize          : 14,
  },
});