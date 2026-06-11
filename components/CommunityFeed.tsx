import { COLOR } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, NativeSyntheticEvent, NativeScrollEvent, FlatList, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { MeetInfo, MeetReview} from '@/types';
import { useReviewDelete } from '@/hooks/queries/useCommunity';
import ImageCarousel from "@/components/comm/ImageCarousel";
import { router } from 'expo-router';
import PlaceLocationBox from '@/components/PlaceLocationBox';
import CommCard from '@/components/comm/CommCard';
import { useMemberLike } from '@/hooks/queries/useMember';
import ProfileIcon from "@/components/ProfileIcon";

interface communityFeedProps {
  data: MeetReview;
}

export default function CommunityFeed({ data }: communityFeedProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const imageList = data.img_list || [];
  const reviewMutation = useReviewDelete();
  const memberLike = useMemberLike();

  const handleUpdate = () => {
    setMenuVisible(false);
    
    router.navigate({
      pathname: '/communities/writeFeedback',
      params: { data: JSON.stringify(data.memMeetListVO),
        updFeedData: JSON.stringify(data)
      }
    })
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      "삭제 확인",
      "정말로 이 게시글을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        { 
          text: "삭제", 
          style: "destructive",
          onPress: () => {
            reviewMutation.mutate(data as MeetReview, {
              onSuccess: () => {
                setIsVisible(false);
              },
              onError: () => {
                setIsVisible(true);                
                Alert.alert('오류', '삭제 중 문제가 발생했습니다.');
              }
            });
          } 
        }
      ],
      { cancelable: true }
    );
  };

  // 좋아요 처리
  const handleLikePress = (item: MeetInfo) => {
    if (!item.meet_id) {
      return;
    }
    memberLike.mutate(
      {
        target_id   : item.meet_id,
        target_type : 'M',
        flag        : item.like_yn === 'N',
      },
      {
        onSuccess: () => {
          item.like_yn = item.like_yn === 'Y' ? 'N' : 'Y';
        },
        onError: () => {
        },
      },
    );
  };
  
  if (!isVisible) return null;  

  return (
    <View style={styles.feedContainer}>
      <View style={styles.feedCard}>
        {/* 상단 프로필 영역 */}
        <View style={styles.feedHeader}>
          <ProfileIcon mem_image_url={data.mem_image_url || ''} type="MEMBER" />
          <View style={styles.memberInfoContainer}>
            <Text style={styles.memberInfoNameText}>{data.mem_nick}</Text>
            <Text style={styles.feedTimeText}>{data.reg_sdate}</Text>
          </View>

          {/* 더보기 버튼 추가 */}
          {data.my_yn === 'Y' && (
            <>
              <TouchableOpacity 
                style={styles.menuTrigger} 
                onPress={() => setMenuVisible(!menuVisible)}
              >
                <Ionicons name="ellipsis-vertical" size={24} color={COLOR.COMM_BLACK} />
              </TouchableOpacity>
          
              {/* 수정/삭제 메뉴 팝업 (버튼 클릭 시 노출) */}
              {menuVisible && (
                <View style={styles.menuPopup}>
                  <TouchableOpacity style={styles.menuItem} onPress={handleUpdate}>
                    <Text style={styles.menuText}>수정</Text>
                  </TouchableOpacity>
                  <View style={styles.menuDivider} />
                  <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                    <Text style={[styles.menuText, { color: 'red' }]}>삭제</Text>
                  </TouchableOpacity>
                </View>
              )}   
            </>
          )}
        </View>

        {/* 이미지 슬라이더 영역 */}
        {imageList.length > 0 && (
          <ImageCarousel
            images={imageList?.length ? imageList.map((file) => file.file_path) : []}
            height={390}
          />
        )}
        
        {/* 피드에 모임정보가  존재할 때만 컴포넌트를 렌더링 */}
        {data.memMeetListVO && <CommCard item={data.memMeetListVO} onLikePress={(item) => handleLikePress(item as MeetInfo)} backgroundColor="grey"/>}

        {/* 하단 지도 정보 카드 */}
        <PlaceLocationBox data={data.memMeetListVO as MeetInfo}/>

        {/* 본문 영역 */}
        <View style={styles.feedContent}>
          <Text 
            style={styles.feedText} 
            numberOfLines={isExpanded ? undefined : 2}
            ellipsizeMode="tail"
          >
            {data.review_content}
          </Text>

          {/* '더보기' 버튼: 2줄 이상일 가능성이 있고 아직 펼쳐지지 않았을 때만 표시 */}
          {!isExpanded && (
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => setIsExpanded(true)}
            >
              <Text style={styles.moreText}>더보기</Text>
            </TouchableOpacity>
          )}

          {/* (선택사항) '접기' 버튼이 필요하다면 아래 추가 */}
          {isExpanded && (
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => setIsExpanded(false)}
            >
              <Text style={styles.moreText}>접기</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>    
  )
}

const styles = StyleSheet.create({
  imageCarousel: {
    marginBottom:10
  },
  feedContainer: {
    backgroundColor     : COLOR.COMM_WHITE,
    gap                 : 4,
    marginBottom        : 3,
  },
  feedCard: {
    backgroundColor     : COLOR.COMM_WHITE,
    marginBottom        : 16,
  },
  feedHeader: {
    flexDirection       : 'row',
    alignItems          : 'flex-start',
    paddingHorizontal   : 16,
    paddingVertical     : 12,
  },
  memberInfoContainer: {
    justifyContent      : 'center',
  },
  memberInfoNameText: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.TEXT_DEFAULT,
  },
  feedTimeText: {
    fontSize            : 12,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
    marginTop           : 4,
  },
  feedContent: {
    flexDirection       : 'row',
    paddingHorizontal   : 16,
    paddingVertical     : 12,
  },
  feedText: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.TEXT_DEFAULT,
  },
  moreText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Medium',
    color               : COLOR.COLOR_BABABA,
    marginStart         : 4,
  },
  moreButton: {
    marginTop: 4,
  }, 
  menuTrigger: {
    marginLeft: 'auto',
    padding: 4,
  },
  menuPopup: {
    position: 'absolute',
    top: 45,
    right: 16,
    backgroundColor: COLOR.COMM_WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_4,
    width: 80,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.COMM_BLACK,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLOR.COMM_GRAY_4,
    marginHorizontal: 8,
  },  
}); 