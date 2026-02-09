import { COLOR } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {FeedBackData} from '@/types';

interface communityFeedProps {
  data: FeedBackData;
}

export default function CommunityFeed({data}: communityFeedProps) {
  return (
    <View style={styles.feedContainer}>
      <View style={styles.feedCard}>
        {/* 상단 프로필 영역 */}
        <View style={styles.feedHeader}>
          <Ionicons name="person-circle" size={36} color="lightgrey" />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{data.mem_name}</Text>
            <Text style={styles.feedTime}>{data.reg_sdate}</Text>
          </View>
        </View>

        {/* 이미지 영역 */}
        <View style={styles.feedImageWrapper}>
          <Image
            source={{
              uri: data.feed_image_url,
            }}
            style={styles.feedImage}
            resizeMode="cover"
          />
        </View>

        {/* 본문 영역 */}
        <View style={styles.feedContent}>
            <Text style={styles.feedText} numberOfLines={2}>
            {data.feed_content}
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.moreText}>더보기</Text>
            </TouchableOpacity>
            </Text>
        </View>
      </View>
    </View>    
  )
}

const styles = StyleSheet.create({
  feedContainer: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 4,
    backgroundColor: COLOR.COMM_WHITE,
  },
  feedTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 15,     // 위아래 간격
    paddingHorizontal: 15,  // 왼쪽 간격
    backgroundColor: COLOR.COMM_WHITE,
  },
  feedTypeBtn: {
    fontSize: 12,
    borderRadius: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  feedCard: {
    backgroundColor: COLOR.COMM_WHITE,
    marginBottom: 16,
  },
  /* 상단 */
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLOR.COMM_GRAY,
    marginRight: 10,
  },
userInfo: {
  justifyContent: 'center',
},
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
  },

  feedTime: {
    fontSize: 12,
    color: COLOR.COMM_GRAY_2,
    marginTop: 2,
  },

  /* 이미지 */
  feedImageWrapper: {
    width: '100%',
    height: 240,
    backgroundColor: COLOR.COMM_GRAY,
  },

  feedImage: {
    width: '100%',
    height: '100%',
  },

  /* 본문 */
  feedContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  feedTextRow: {
  flexDirection: 'row',
//  alignItems: 'flex-end', // 글 마지막 줄 기준으로 정렬
  },
  feedText: {
    flex: 1,
    fontSize: 14,
    color: COLOR.COMM_BLACK,
    lineHeight: 20,
  },
  moreText: {
    fontSize: 13,
    color: COLOR.COMM_GRAY_2,
    marginTop: 0,
  },  
}); 
