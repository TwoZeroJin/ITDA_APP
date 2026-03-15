import { COLOR } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { MeetReview, MyMeetInfo} from '@/types';
import CommunityMeet from './CommunityMeet';

interface communityFeedProps {
  data: MeetReview;
}

export default function CommunityFeed({data}: communityFeedProps) {
  // ✅ 1. 펼침 상태 관리 (기본값: 닫힘)
  const [isExpanded, setIsExpanded] = useState(false);
    
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
              uri: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"//data.feed_image_url,
            }}
            style={styles.feedImage}
            resizeMode="cover"
          />
        </View>
        
        {/* 피드에 모임정보가  존재할 때만 컴포넌트를 렌더링 */}
        {data.memMeetListVO && <CommunityMeet data={data.memMeetListVO} />}

        {/* 본문 영역 */}
        <View style={styles.feedContent}>
          {/* ✅ 2. 조건부 numberOfLines 설정 */}
          <Text 
            style={styles.feedText} 
            numberOfLines={isExpanded ? undefined : 2}
          >
            {data.review_content}
          </Text>

          {/* ✅ 3. '더보기' 버튼: 2줄 이상일 가능성이 있고 아직 펼쳐지지 않았을 때만 표시 */}
          {!isExpanded && data.review_content.length > 40 && (
            <TouchableOpacity 
              onPress={() => setIsExpanded(true)}
              style={styles.moreButton}
            >
              <Text style={styles.moreText}>더보기</Text>
            </TouchableOpacity>
          )}

          {/* (선택사항) '접기' 버튼이 필요하다면 아래 추가 */}
          {isExpanded && (
            <TouchableOpacity onPress={() => setIsExpanded(false)}>
              <Text style={styles.moreText}>접기</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>    
  )
}

const styles = StyleSheet.create({
  moreButton: {
    marginTop: 4, // 텍스트와 약간의 간격
  },  
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
