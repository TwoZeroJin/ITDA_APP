import IconArrowRightMore from '@/assets/images/icon_arrow_right_more.svg';
import CommCard from '@/components/comm/CommCard';
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
        keyExtractor={(item) => item.key}
        horizontal
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: section }) => {
          return (
            <View style={{ marginEnd: 15 }}>
              <View>
                <Text style={styles.title} >{section.title}</Text>
                <Text style={styles.subTitle}>{section.subTitle}</Text>
              </View>
              {section.data?.length ? (
                section.data.map((item2, colIdx) => (
                  <View key={colIdx} style={styles.listContainer}>
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

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity 
          style={styles.moreButton} 
          activeOpacity={0.6}
          onPress={() => router.navigate('/meet')}
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
    borderRadius      : 25,
    width             : '100%',
    height            : 50,
  },
  moreButtonText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    marginEnd         : 5,
    color             : COLOR.TEXT_DEFAULT,
  },
});