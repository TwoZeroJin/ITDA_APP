import IconArrowRightMore from '@/assets/images/icon_arrow_right_more.svg';
import CommMeetCard from '@/components/comm/CommMeetCard';
import { COLOR } from '@/constants';
import { GroupInfo, MeetInfo } from '@/types';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMemberLike } from '@/hooks/queries/useMember';
import { router } from 'expo-router';

interface RecommendSectionItem {
  key: string;
  title: string;
  subTitle: string;
  data: MeetInfo[] | GroupInfo[];
}

interface CommRcmdMeetListProps {
  sections: RecommendSectionItem[];
}

/**
 * 추천 소셜링 리스트 컴포넌트
 */
export default function CommRcmdMeetList({ sections }: CommRcmdMeetListProps) {
  const memberLike = useMemberLike();

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
      <FlatList<RecommendSectionItem>
        data={sections}
        renderItem={({ item: section }) => {
          return (
            <View style={{ width: 320 }}>
              <View>
                <Text style={styles.title}>{section.title}</Text>
                <Text style={styles.subTitle}>{section.subTitle}</Text>
              </View>
              {section.data?.length ? (
                section.data.map((item2, colIdx) => (
                  <View key={colIdx} style={styles.listContainer}>
                    <CommMeetCard
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
        keyExtractor={(item) => item.key}
        horizontal
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
      />

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity 
          style={styles.moreButton} 
          activeOpacity={0.6}
          onPress={() => router.navigate('/meet')}
        >
          <Text style={styles.moreButtonText}>더보기</Text>
          <IconArrowRightMore width={12} height={12} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical   : 32,
    paddingHorizontal : 16,
  },
  title: {
    fontSize          : 20,
    fontWeight        : 'bold',
    color             : COLOR.TEXT_TITLE,
  },
  subTitle: {
    fontSize          : 14,
    color             : COLOR.TEXT_2F2F2F,
    marginTop         : 4,
  },
  listContainer: {
    marginTop         : 12,
  },
  emptyText: {
    marginTop         : 16,
    fontSize          : 14,
    color             : COLOR.TEXT_GRAY,
  },
  moreButton: {
    justifyContent    : 'center',
    alignItems        : 'center',
    flexDirection     : 'row',
    marginTop         : 20,
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 25,
    width             : '100%',
    height            : 50,
  },
  moreButtonText: {
    fontSize          : 16,
    fontWeight        : 'bold',
    marginEnd         : 5,
    color             : COLOR.COMM_GRAY_2,
  },
});