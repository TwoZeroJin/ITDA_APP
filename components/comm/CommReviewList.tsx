import ArrowRight from '@/assets/images/arrow_right.svg';
import { COLOR } from '@/constants';
import { MeetReview } from '@/types';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

interface CommReviewListProps {
  title?: string;
  subTitle?: string;
  reviewList: MeetReview[];
}

export default function CommReviewList({ title = '피드', subTitle = '', reviewList }: CommReviewListProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  if (reviewList.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.subTitle}>등록된 후기가 없습니다.</Text>
      </View>
    );
  }

  const handleImageError = (reviewId: number | undefined) => {
    if (reviewId !== undefined) {
      setImageErrors((prev) => ({ ...prev, [reviewId]: true }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => router.navigate('/community')}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.6}
        >
          <ArrowRight width={11} height={16} />
        </TouchableOpacity>
      </View>
      {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}

      <FlatList<MeetReview>
        data={reviewList}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item, idx) => String(item.review_id ?? idx)}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.navigate('/community')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.6}
            >
              <Image
                source={imageErrors[item.review_id ?? 0] || !item.thumb_url ? require('@/assets/images/no_image.png') : { uri: item.thumb_url }}
                style={styles.image}
                onError={() => handleImageError(item.review_id)}
              />
              {/* <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                {item.tag || item.memMeetListVO?.meet_name || '후기'}
              </Text> */}
              <Text style={styles.cardDesc} numberOfLines={2} ellipsizeMode="tail">
                {item.review_content}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical     : 16,
    paddingHorizontal   : 8,
    backgroundColor     : COLOR.COMM_WHITE,
  },
  headerRow: {
    flexDirection       : 'row',
    justifyContent      : 'space-between',
    alignItems          : 'center',
    width               : '100%',
    paddingHorizontal   : 16,
    marginBottom        : 16,
  },
  title: {
    fontSize            : 20,
    fontFamily          : 'Pretendard-SemiBold',
    color               : COLOR.TEXT_TITLE,
  },
  moreButton: {
    paddingVertical     : 4,
  },
  subTitle: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    textAlign           : 'center',
    alignSelf           : 'flex-start',
    marginTop           : 4,
    marginBottom        : 16,
    paddingHorizontal   : 16,
    color               : COLOR.TEXT_2F2F2F,
  },
  row: {
    justifyContent      : 'space-between',
    width               : '100%',
    height              : 200,
  },
  card: {
    width               : '50%',
    height              : 150,
  },
  image: {
    width               : '100%',
    height              : '100%',
    aspectRatio         : 1,
    borderRadius        : 14,
    marginBottom        : 4,
    alignSelf           : 'center',
  },
  cardTitle: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-Medium',
    alignSelf           : 'flex-start',
    color               : COLOR.TEXT_3C3C3C,
    paddingStart        : 16,
  },
  cardDesc: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    alignSelf           : 'flex-start',
    lineHeight          : 20,
    color               : COLOR.COMM_SHADOW,
    paddingStart        : 16,
  },
});