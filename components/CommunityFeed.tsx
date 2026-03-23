import { COLOR } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { MeetReview, MyMeetInfo} from '@/types';
import CommunityMeet from './CommunityMeet';

interface communityFeedProps {
  data: MeetReview;
}

// ✅ 1. 기기의 가로 너비를 가져옵니다. 이미지 한 장의 너비가 됩니다.
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CommunityFeed({data}: communityFeedProps) {
  // ✅ 1. 펼침 상태 관리 (기본값: 닫힘)
  const [isExpanded, setIsExpanded] = useState(false);
    
// ✅ 2. 현재 보고 있는 이미지의 인덱스 상태 (0부터 시작)
  const [activeIndex, setActiveIndex] = useState(0);

  // 이미지 리스트가 비어있을 경우를 대비한 방어 코드
  const imageList = data.fileInfoVO || [];

  console.log('이미지 리스트:', imageList);

  // ✅ 3. 스크롤 위치를 계산하여 activeIndex를 업데이트하는 함수
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // 현재 스크롤된 X축 위치
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    
    // 현재 위치를 이미지 너비로 나누어 반올림하면 현재 인덱스가 나옵니다.
    const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    
    // 인덱스가 바뀌었을 때만 상태를 업데이트 (성능 최적화)
    if (currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  };

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
        {/* 이미지 슬라이더 영역 */}
        {imageList.length > 0 && (
          <View style={styles.imageSliderContainer}>
            <FlatList
              data={imageList}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => {
                // 여기서 로그가 찍히지 않는다면 imageList 자체가 빈 배열인 것입니다.
                console.log(`[디버깅] ${index}번 아이템 전체:`, item);
                console.log(`[디버깅] 경로값 확인:`, item?.file_path);

                return (
                  <Image
                    source={{ uri: item.file_path }}
                    style={styles.feedImage}
                    resizeMode="cover"
                    // 로딩 에러가 발생하면 이유를 알려줍니다.
                    onError={(e) => console.log(`[에러] ${index}번 이미지 로드 실패:`, e.nativeEvent.error)}
                  />
                );
              }}          
            />
            
            
          </View>
        )}
        {/* ✅ 2. 이미지 밖으로 나온 인디케이터 (이미지 아래, 모임정보 위에 위치) */}
        {imageList.length > 1 && (
          <View style={styles.outsideIndicatorContainer}>
            {imageList.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  activeIndex === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        )}

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
// ✅ 점들을 감싸는 컨테이너 (이미지 하단 중앙 배치)
  indicatorContainer: {
    position: 'absolute',
    bottom: 12, // 이미지 하단에서 얼만큼 띄울지
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center', // 가로 중앙 정렬
    alignItems: 'center',
    gap: 5, // 점들 사이의 간격
  },
// ✅ 새로운 인디케이터 컨테이너 스타일 (이미지 아래에 자연스럽게 위치)
  outsideIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10, // 이미지와 아래 컴포넌트 사이의 간격 조절
    gap: 5,
    backgroundColor: COLOR.COMM_WHITE,
  },  
  // ✅ 공통 점 스타일
  indicatorDot: {
    width: 6, // 점 크기
    height: 6,
    borderRadius: 3, // 동그랗게
  },
  
  // ✅ 활성화된 점 스타일 (현재 페이지)
  activeDot: {
    backgroundColor: COLOR.APP_MAIN || COLOR.APP_ACTIVE_1, // 앱 메인 컬러 혹은 강조색
    // width: 8, height: 8, borderRadius: 4, // 원하시면 현재 점만 살짝 더 크게 할 수도 있습니다.
  },
  
  // ✅ 비활성화된 점 스타일 (다른 페이지)
  inactiveDot: {
    backgroundColor: COLOR.COMM_GRAY_6, // 반투명 흰색 (인스타 스타일)
  },  
/* ✅ 이미지 슬라이더 및 인디케이터 스타일 */
  imageSliderContainer: {
    width: SCREEN_WIDTH,
    height: 390, // 피드 이미지 높이 설정
    position: 'relative', // 인디케이터의 absolute 배치를 위한 기준
    backgroundColor: COLOR.COMM_GRAY, // 로딩 전 배경색
  },
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
    width: SCREEN_WIDTH, // '100%' 대신 기기 전체 너비 사용
    height: 390,        // '%' 대신 고정 숫자 사용
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
