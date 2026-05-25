import CommHeader from '@/components/comm/CommHeader';
import CommLabel from '@/components/comm/CommLabel';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import MemDefault from '@/assets/images/icon_mem_default.svg';
import { COLOR, COMM_STYLES } from '@/constants';
import { useMemberMyGroupListPaging } from '@/hooks/queries/useMember';
import { GroupInfo } from '@/types';
import { useCallback, useState } from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import CommBottomButton from '@/components/comm/CommBottomButton';
import { useAuthRouter } from '@/components/comm/AuthRoute';

/**
 * 클럽 소셜링 - 클럽 선택
 */
export default function SelectGroupScreen() {
  const router = useAuthRouter();
  const { meet_type } = useLocalSearchParams();
  const [group_id, setGroupId] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useMemberMyGroupListPaging({
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

  const [imageErrors, setImageErrors] = useState<Record<string | number, boolean>>({});

  const renderMeetCard = ({ item }: { item: GroupInfo }) => {
    const hasError = imageErrors[item.group_id];
    const imageSource = item.thumb_url && !hasError
      ? { uri: item.thumb_url }
      : require('@/assets/images/no_image.png');

    return (
      <TouchableOpacity 
        style={styles.cardContainer}
        activeOpacity={0.6}
        onPress={() => setGroupId(item.group_id)}
      >
        <View style={[styles.likeCard, group_id === item.group_id && styles.selected]}>
          <ImageBackground
            source={imageSource}
            style={styles.likeCardImage}
            imageStyle={styles.likeCardImageStyle}
            onError={() => setImageErrors((prev) => ({ ...prev, [item.group_id]: true }))}
          >
          </ImageBackground>

          {/* 콘텐츠 영역 */}
          <View style={styles.likeCardContent}>
            {/* 태그 행 */}
            <View style={styles.tagRow}>
              <CommLabel variant="social" />
              <CommLabel variant="category" category={item.group_subj_name} />
            </View>

            {/* 제목 */}
            <Text style={styles.likeCardTitle} numberOfLines={1}>
              {item.group_name}
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
      <CommHeader title={"클럽 선택"} isBack={true} isLogo={false} isLike={false} isNoti={false} />

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.group_id}`}
        renderItem={renderMeetCard}
        contentContainerStyle={[
          styles.listContainer,
          results.length === 0 && styles.listContainerEmpty,
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

      <CommBottomButton label="다음" onPress={() => meet_type && group_id && router.navigate({
          pathname: '/meets/createDetail',
          params: {
            group_id : group_id,
            meet_type : meet_type
          },
        })}
        disabled={!meet_type && !group_id}/>
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
  selected : {
    borderColor       : COLOR.APP_ACTIVE_3,
    borderRadius      : 12,
    borderWidth       : 1,
  }
});