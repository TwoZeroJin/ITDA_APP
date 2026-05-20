import IconArrowRightMore from '@/assets/images/icon_arrow_right_more.svg';
import CommMeetCard from '@/components/comm/CommMeetCard';
import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMemberLike } from '@/hooks/queries/useMember';
import { useEffect, useState } from 'react';

interface RecommendSectionItem {
  key: string;
  title: string;
  subTitle: string;
  data: MeetInfo[];
}

interface CommRcmdMeetListProps {
  sections: RecommendSectionItem[];
}

/**
 * 추천 소셜링 리스트 컴포넌트
 */
export default function CommRcmdMeetList({ sections }: CommRcmdMeetListProps) {
  const memberLike = useMemberLike();
  const [sectionList, setSectionList] = useState<RecommendSectionItem[]>(sections);

  useEffect(() => {
    setSectionList(sections);
  }, [sections]);

  // 좋아요 처리
  const handleLikePress = (meetId: number, like_yn: string) => {
    if (!meetId) {
      return;
    }

    const previousSectionList = sectionList;

    setSectionList((prev) =>
      prev.map((section) => ({
        ...section,
        data: section.data.map((meet) =>
          meet.meet_id === meetId
            ? { ...meet, like_yn: meet.like_yn === 'Y' ? 'N' : 'Y' }
            : meet,
        ),
      })),
    );

    memberLike.mutate(
      {
        target_id   : meetId,
        target_type : 'M',
        flag        : like_yn === 'N',
      },
      {
        onError: () => {
          setSectionList(previousSectionList);
        },
      },
    );
  };

  return (
    <View style={styles.recommendContainer}>
      <FlatList<RecommendSectionItem>
        data={sectionList}
        renderItem={({ item: section }) => {
          return (
            <View style={{ width: 320 }}>
              <View>
                <Text style={styles.recommendTitle}>{section.title}</Text>
                <Text style={styles.recommendSubTitle}>{section.subTitle}</Text>
              </View>
              {section.data.map((item2, colIdx) => (
                <View key={colIdx} style={styles.recommendListContainer}>
                  <CommMeetCard
                    item={item2}
                    onLikePress={(item) => handleLikePress(item.meet_id, item.like_yn)}
                  />
                </View>
              ))}
            </View>
          );
        }}
        keyExtractor={(item) => item.key}
        horizontal
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
      />

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.moreButton} activeOpacity={0.6}>
          <Text style={styles.moreButtonText}>더보기</Text>
          <IconArrowRightMore width={12} height={12} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recommendContainer: {
    paddingVertical   : 32,
    paddingHorizontal : 16,
  },
  recommendTitle: {
    fontSize          : 20,
    fontWeight        : 'bold',
    color             : COLOR.TEXT_TITLE,
  },
  recommendSubTitle: {
    fontSize          : 14,
    color             : COLOR.TEXT_2F2F2F,
    marginTop         : 4,
  },
  recommendListContainer: {
    marginTop         : 16,
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