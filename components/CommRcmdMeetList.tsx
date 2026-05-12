import BtnLikeDefault from '@/assets/images/btn_like_default.svg';
import IconArrowRightMore from '@/assets/images/icon_arrow_right_more.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import CommLabel from '@/components/CommLabel';
import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import { useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMemberLike } from '@/hooks/queries/useMember';

type MeetListItem = MeetInfo & {
  like_yn?: 'Y' | 'N';
};

interface RecommendSectionStateItem {
  key: string;
  title: string;
  subTitle: string;
  data: MeetListItem[];
}

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
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [sectionState, setSectionState] = useState<RecommendSectionStateItem[]>(sections as RecommendSectionStateItem[]);
  const memberLike = useMemberLike();

  useEffect(() => {
    setSectionState(sections as RecommendSectionStateItem[]);
  }, [sections]);

  const handleImageError = (meetId: number | undefined) => {
    if (meetId !== undefined) {
      setImageErrors((prev) => ({ ...prev, [meetId]: true }));
    }
  };

  const handleLikePress = (item: MeetListItem) => {
    const meetId = item.meet_id;
    if (!meetId) {
      return;
    }

    const isLiked = item.like_yn === 'Y';

    memberLike.mutate({
      target_id   : meetId,
      target_type : 'M',
      flag        : !isLiked,
    }, {
      onSuccess: () => {
        setSectionState((prev) =>
          prev.map((section) => ({
            ...section,
            data: section.data.map((dataItem) => {
              if (dataItem.meet_id !== meetId) {
                return dataItem;
              }

              return {
                ...dataItem,
                like_yn: dataItem.like_yn === 'Y' ? 'N' : 'Y',
              };
            }),
          })),
        );
      },
    });
  };

  return (
    <View style={styles.recommendContainer}>
      <FlatList<RecommendSectionItem>
        data={sectionState}
        renderItem={({ item: section }) => {
          return (
            <View>
              <View>
                <Text style={styles.recommendTitle}>{section.title}</Text>
                <Text style={styles.recommendSubTitle}>{section.subTitle}</Text>
              </View>
              {section.data.map((item2, colIdx) => (
                <View key={colIdx} style={styles.recommendListContainer}>
                  <View style={styles.recommendItemContainer}>
                    <View>
                      <ImageBackground
                        source={imageErrors[item2.meet_id ?? 0] || !item2.thumb_url ? require('@/assets/images/no_image.png') : { uri: item2.thumb_url }}
                        style={styles.recommendItemImage}
                        imageStyle={styles.recommendImage}
                        onError={() => handleImageError(item2.meet_id)}
                      >
                        <TouchableOpacity 
                          style={styles.recommendLikeBtnContainer}
                          onPress={() => handleLikePress(item2)}
                        >
                          <BtnLikeDefault />
                        </TouchableOpacity>
                      </ImageBackground>
                    </View>
                    <View style={{ marginStart: 10 }}>
                      <View style={styles.recommendTagContainer}>
                        <CommLabel variant="social" />
                        <CommLabel variant="club" />
                        <CommLabel variant="category" category={item2.meet_type || '카테고리'} />
                      </View>
                      <View style={styles.recommendContentContainer}>
                        <Text style={styles.recommendContentTitle} numberOfLines={1} ellipsizeMode="tail">
                          {item2.meet_name}
                        </Text>
                        <View style={styles.recommendContentInfoContainer}>
                          <IconMarker width={12} height={12} />
                          <Text style={styles.recommendContentText}>{item2.place_addr}</Text>
                          <IconMembers width={12} height={12} />
                          <Text style={styles.recommendContentText}>{item2.apply_ratio}</Text>
                        </View>
                        <View style={styles.recommendContentInfoContainer}>
                          <Image
                            source={imageErrors[item2.meet_id ?? 0] || !item2.thumb_url ? require('@/assets/images/no_image.png') : { uri: item2.thumb_url }}
                            style={{ width: 20, height: 20, borderRadius: 10, marginEnd: 4 }}
                            onError={() => handleImageError(item2.meet_id)} 
                          />
                          <Text style={styles.recommendHostText}>{item2.mem_name}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
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
        <TouchableOpacity style={styles.moreButton}>
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
  recommendItemContainer: {
    width             : '95%',
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 12,
    padding           : 12,
    flexDirection     : 'row',
    marginEnd         : 30,
  },
  recommendItemImage: {
    width             : 96,
    height            : 96,
    borderRadius      : 12,
  },
  recommendImage: {
    width             : '100%',
    height            : '100%',
    borderRadius      : 12,
    overflow          : 'hidden',
  },
  recommendLikeBtnContainer: {
    justifyContent    : 'center',
    alignItems        : 'center',
    position          : 'absolute',
    bottom            : 0,
    right             : 0,
    width             : 35,
    height            : 35,
  },
  recommendTagContainer: {
    flexDirection     : 'row',
    gap               : 6,
    marginBottom      : 4,
  },
  recommendContentContainer: {
    gap               : 4,
  },
  recommendContentInfoContainer: {
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 12,
  },
  recommendContentTitle: {
    fontSize          : 16,
    fontWeight        : 'bold',
    color             : COLOR.TEXT_3C3C3C,
  },
  recommendContentText: {
    fontSize          : 12,
    marginStart       : -8,
    color             : COLOR.COMM_SHADOW,
  },
  recommendHostText: {
    fontSize          : 14,
    marginStart       : -8,
    fontWeight        : 'bold',
    color             : COLOR.COMM_SHADOW,
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