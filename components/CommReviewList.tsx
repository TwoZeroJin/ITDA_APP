import ArrowRight from '@/assets/images/arrow_right.svg';
import { COLOR } from '@/constants';
import { MeetReview } from '@/types';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

interface CommReviewListProps {
  reviewList: MeetReview[];
}

export default function CommReviewList({ reviewList }: CommReviewListProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  if (reviewList.length === 0) {
    return null;
  }

  const handleImageError = (reviewId: number | undefined) => {
    if (reviewId !== undefined) {
      setImageErrors((prev) => ({ ...prev, [reviewId]: true }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>함께한 이야기</Text>
        <TouchableOpacity style={styles.moreButton}>
          <ArrowRight width={11} height={16} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subTitle}>우리가 함께한 순간, 진심이 담긴 후기 📝</Text>

      <FlatList<MeetReview>
        data={reviewList}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item, idx) => String(item.review_id ?? idx)}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <Image
                source={imageErrors[item.review_id ?? 0] || !item.thumb_url ? require('@/assets/images/no_image.png') : { uri: item.thumb_url }}
                style={styles.image}
                onError={() => handleImageError(item.review_id)}
              />
              <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                {item.tag || item.memMeetListVO?.meet_name || '후기'}
              </Text>
              <Text style={styles.cardDesc} numberOfLines={2} ellipsizeMode="tail">
                {item.review_content}
              </Text>
            </View>
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
//    alignItems          : 'center',//후기가 한개있을때 모양깨져서 지움
  },
  headerRow: {
    flexDirection       : 'row',
    justifyContent      : 'space-between',
    alignItems          : 'center',
    width               : '100%',
    paddingHorizontal   : 16,
  },
  title: {
    fontSize            : 20,
    fontWeight          : 'bold',
    color               : COLOR.TEXT_TITLE,
  },
  moreButton: {
    paddingVertical     : 4,
  },
  subTitle: {
    textAlign           : 'center',
    alignSelf           : 'flex-start',
    marginTop           : 4,
    fontSize            : 14,
    marginBottom        : 16,
    paddingHorizontal   : 16,
    color               : COLOR.TEXT_2F2F2F,
  },
  row: {
    justifyContent      : 'space-between',
    width               : '100%',
    height              : 250,
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
    marginBottom        : 10,
    alignSelf           : 'center',
  },
  cardTitle: {
    alignSelf           : 'flex-start',
    fontSize            : 16,
    fontWeight          : 'bold',
    color               : COLOR.TEXT_3C3C3C,
    paddingStart        : 16,
  },
  cardDesc: {
    alignSelf           : 'flex-start',
    marginTop           : 4,
    fontSize            : 14,
    lineHeight          : 20,
    color               : COLOR.COMM_SHADOW,
    paddingStart        : 16,
  },
});