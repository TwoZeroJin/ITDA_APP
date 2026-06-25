import IconArrowRightMore from '@/assets/images/icon_arrow_right_more.svg';
import IconArrowLeftMore from '@/assets/images/icon_arrow_left_more.svg';
import CommCard from '@/components/comm/CommCard';
import { COLOR } from '@/constants';
import { GroupInfo, MeetInfo } from '@/types';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMemberLike } from '@/hooks/queries/useMember';
import { router } from 'expo-router';
import { useRef, useState } from 'react';

interface SectionItem {
  key       : string;
  title     : string;
  subTitle  : string;
  data      : MeetInfo[] | GroupInfo[];
}

interface CommHorizontalListProps {
  sections  : SectionItem[];
  isMember? : boolean;
}

/**
 * 공통 수평 리스트 컴포넌트
 */
export default function CommHorizontalList({ sections, isMember = false }: CommHorizontalListProps) {
  const memberLike = useMemberLike();
  const { width } = Dimensions.get('window');
  const flatListRef = useRef<FlatList<SectionItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 좋아요 처리
  const handleLikePress = (item: MeetInfo | GroupInfo) => {
    const isMeet = 'meet_id' in item;
    const targetId = isMeet ? item.meet_id : item.group_id;
    const targetType = isMeet ? 'M' : 'G';

    memberLike.mutate(
      {
        target_id   : targetId,
        target_type : targetType,
        flag        : item.like_yn === 'N',
      },
      {
        onSuccess: () => {
          item.like_yn = item.like_yn === 'Y' ? 'N' : 'Y';
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      {currentIndex > 0 && (
        <TouchableOpacity
          style={styles.leftArrow}
          onPress={() => {
            flatListRef.current?.scrollToIndex({
              index: currentIndex - 1,
              animated: true,
            });
          }}
        >
          <IconArrowLeftMore width={7} height={10} />
        </TouchableOpacity>
      )}
      <FlatList<SectionItem>
        ref={flatListRef}
        data={sections}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={true}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / (width - 32)
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item: section }) => {
          return (
            <View style={{ width: width - 32 }}>
              <View>
                <Text style={styles.title} >{section.title}</Text>
                <Text style={styles.subTitle}>{section.subTitle}</Text>
              </View>
              {section.data?.length ? (
                section.data.map((item2, colIdx) => (
                  <View key={colIdx} style={[styles.listContainer, { width: width - 32 } ]}>
                    <CommCard
                      item={item2}
                      onLikePress={(item) => handleLikePress(item)}
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>데이터가 없습니다</Text>
              )}
            </View>
          );
        }}
      />

      {currentIndex < sections.length - 1 && (
        <TouchableOpacity
          style={styles.rightArrow}
          onPress={() => {
            flatListRef.current?.scrollToIndex({
              index: currentIndex + 1,
              animated: true,
            });
          }}
        >
          <IconArrowRightMore width={7} height={10} />
        </TouchableOpacity>
      )}

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity 
          style={styles.moreButton} 
          activeOpacity={0.6}
          onPress={() => router.navigate(`${isMember ? '/mypage/historyList' : '/meet'}`)}
        >
          <Text style={styles.moreButtonText}>더보기</Text>
          <IconArrowRightMore width={7} height={10} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding           : 16,
    position          : 'relative',
  },
  title: {
    fontSize          : 20,
    fontFamily        : 'Pretendard-SemiBold',
    color             : COLOR.TEXT_1C1C1C,
    lineHeight        : 21,
  },
  subTitle: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_2F2F2F,
    lineHeight        : 21,
    marginTop         : 4,
  },
  listContainer: {
    marginTop         : 8,
  },
  emptyText: {
    marginTop         : 30,
    marginBottom      : 10,
    fontSize          : 14,
    color             : COLOR.TEXT_GRAY,
    alignSelf         : 'center',
  },
  moreButton: {
    justifyContent    : 'center',
    alignItems        : 'center',
    flexDirection     : 'row',
    marginTop         : 20,
    backgroundColor   : COLOR.COMM_WHITE,
    borderWidth       : 2,
    borderColor       : COLOR.COMM_GRAY_5,
    borderRadius      : 25,
    width             : '100%',
    height            : 50,
  },
  moreButtonText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    marginEnd         : 5,
    color             : COLOR.COLOR_323232,
  },
  leftArrow: {
    position            : 'absolute',
    left                : 16,
    top                 : '50%',
    zIndex              : 999,
  },
  rightArrow: {
    position            : 'absolute',
    right               : 16,
    top                 : '50%',
    zIndex              : 999,
  },
});