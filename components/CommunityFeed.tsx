import { COLOR } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { MeetInfo, MeetReview} from '@/types';
import ImageCarousel from "@/components/comm/ImageCarousel";
import PlaceLocationBox from '@/components/PlaceLocationBox';
import CommCard from '@/components/comm/CommCard';
import ProfileIcon from "@/components/ProfileIcon";

interface communityFeedProps {
  item          : MeetReview;
  menuVisible?  : boolean;
  handleLike?   : (item: MeetInfo) => void;
  handleUpdate? : (item: MeetReview) => void;
  handleDelete? : (item: MeetReview) => void;
}

export default function CommunityFeed({ item, menuVisible = false, handleLike, handleUpdate, handleDelete }: communityFeedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localMenuVisible, setLocalMenuVisible] = useState(menuVisible);
  const imageList = item.img_list || [];

  return (
    <View style={styles.feedContainer}>
      <View style={styles.feedCard}>
        {/* 상단 프로필 영역 */}
        <View style={styles.feedHeader}>
          <ProfileIcon mem_image_url={item.mem_image_url || ''} type="MEMBER" />
          <View style={styles.memberInfoContainer}>
            <Text style={styles.memberInfoNameText}>{item.mem_nick}</Text>
            <Text style={styles.feedTimeText}>{item.reg_sdate}</Text>
          </View>

          {/* 더보기 버튼 추가 */}
          {item.my_yn === 'Y' && (
            <>
              <TouchableOpacity 
                style={styles.menuTrigger} 
                onPress={() => setLocalMenuVisible(!localMenuVisible)}
              >
                <Ionicons name="ellipsis-vertical" size={24} color={COLOR.COMM_BLACK} />
              </TouchableOpacity>
          
              {/* 수정/삭제 메뉴 팝업 (버튼 클릭 시 노출) */}
              {localMenuVisible && (
                <View style={styles.menuPopup}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => handleUpdate?.(item)}>
                    <Text style={styles.menuText}>수정</Text>
                  </TouchableOpacity>
                  <View style={styles.menuDivider} />
                  <TouchableOpacity style={styles.menuItem} onPress={() => handleDelete?.(item)}>
                    <Text style={[styles.menuText, { color: 'red' }]}>삭제</Text>
                  </TouchableOpacity>
                </View>
              )}   
            </>
          )}
        </View>

        {/* 이미지 슬라이더 영역 */}
        {imageList.length > 0 && (
          <View style={styles.commMargin}>
            <ImageCarousel
              images={imageList?.length ? imageList.map((file) => file.file_path) : []}
              height={390}
            />
          </View>
        )}
        
        {/* 피드에 모임정보가 존재할 때만 컴포넌트를 렌더링 */}
        {item.memMeetListVO && 
          <View style={[styles.commMargin, { paddingHorizontal: 16, gap: 16 }]}>
            <CommCard item={item.memMeetListVO} onLikePress={(item) => handleLike?.(item as MeetInfo)} backgroundColor="grey"/>
            {/* <PlaceLocationBox data={item.memMeetListVO as MeetInfo}/> */}
          </View>
        }

        {/* 본문 영역 */}
        <View style={styles.feedContent}>
          <Text 
            style={styles.feedText} 
            numberOfLines={isExpanded ? undefined : 2}
            ellipsizeMode="tail"
          >
            {item.review_content}
          </Text>

          {item.review_content.length > 30 && 
            (
              !isExpanded ? (
                <TouchableOpacity 
                  style={styles.moreButton}
                  onPress={() => setIsExpanded(true)}
                >
                  <Text style={styles.moreText}>더보기</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.moreButton}
                  onPress={() => setIsExpanded(false)}
                >
                  <Text style={styles.moreText}>접기</Text>
                </TouchableOpacity>
              )
            )
          }
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  commMargin: {
    marginBottom        : 16
  },
  feedContainer: {
    backgroundColor     : COLOR.COMM_WHITE,
    gap                 : 4,
    marginBottom        : 3,
  },
  feedCard: {
    backgroundColor     : COLOR.COMM_WHITE,
    marginTop           : 4,
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
    width               : '90%',
    paddingHorizontal   : 16,
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
  },
  moreButton: {
    paddingVertical     : 4,
  }, 
  menuTrigger: {
    marginStart         : 'auto',
    padding             : 4,
  },
  menuPopup: {
    position            : 'absolute',
    top                 : 45,
    right               : 16,
    backgroundColor     : COLOR.COMM_WHITE,
    borderRadius        : 8,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_4,
    width               : 80,
    elevation           : 5,
    shadowColor         : '#000',
    shadowOffset        : { width: 0, height: 2 },
    shadowOpacity       : 0.2,
    shadowRadius        : 4,
    zIndex              : 100,
  },
  menuItem: {
    paddingVertical     : 10,
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  menuText: {
    fontSize            : 14,
    fontWeight          : '500',
    color               : COLOR.COMM_BLACK,
  },
  menuDivider: {
    height              : 1,
    backgroundColor     : COLOR.COMM_GRAY_4,
    marginHorizontal    : 8,
  },  
}); 