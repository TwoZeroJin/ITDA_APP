import { COLOR, COMM_STYLES } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { MeetInfo, MeetReview} from '@/types';
import ImageCarousel from "@/components/comm/ImageCarousel";
import PlaceLocationBox from '@/components/PlaceLocationBox';
import CommCard from '@/components/comm/CommCard';
import ProfileIcon from "@/components/ProfileIcon";
import IconComment from '@/assets/images/icon_comment.svg';
import IconLikeOff from '@/assets/images/icon_review_like_off.svg';
import IconLikeOn from '@/assets/images/icon_review_like_on.svg';
import { useAuthRouter } from '@/components/comm/AuthRoute';

interface communityFeedProps {
  item              : MeetReview;
  handleLike?       : (item: MeetInfo) => void;
  handleReviewLike? : (item: MeetReview) => void;
  handleUpdate?     : (item: MeetReview) => void;
  handleDelete?     : (item: MeetReview) => void;
  handleReport?     : (item: MeetReview) => void;
  handleBlock?      : (item: MeetReview) => void;
  onCommentPress?   : (item: MeetReview) => void;
}

export default function CommunityFeed({ item, handleLike, handleReviewLike, handleUpdate, handleDelete, handleReport, handleBlock, onCommentPress }: communityFeedProps) {
  const { requireAuth } = useAuthRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const imageList = item.img_list || [];

  const onPressLike = () => {
    requireAuth(() => {
      handleReviewLike?.(item);
    });
  };

  return (
    <View style={styles.feedContainer}>
      {menuVisible && (
        <TouchableOpacity
        style={COMM_STYLES.detailMenuBackdrop}
        activeOpacity={1}
        onPress={() => setMenuVisible(false)}
        />
      )}
      <View style={styles.feedCard}>
        {/* 상단 프로필 영역 */}
        <View style={styles.feedHeader}>
          <ProfileIcon mem_id={item?.mem_id} mem_image_url={item.mem_image_url || ''} type="MEMBER" />
          <View style={styles.memberInfoContainer}>
            <Text style={styles.memberInfoNameText}>{item.mem_nick}</Text>
            <Text style={styles.feedTimeText}>{item.reg_sdate}</Text>
          </View>

          <TouchableOpacity 
            style={styles.menuTrigger} 
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={COLOR.COMM_BLACK} />
          </TouchableOpacity>
          
          {/* 수정/삭제 메뉴 팝업 (버튼 클릭 시 노출) */}
          {menuVisible && (
            item.my_yn === 'Y' ? (
              <View style={styles.menuPopup}>
                <TouchableOpacity style={styles.menuItem} onPress={() => {
                  setMenuVisible(false);
                  handleUpdate?.(item);
                }}>
                  <Text style={styles.menuText}>수정하기</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={() => {
                  setMenuVisible(false);
                  handleDelete?.(item);
                }}>
                  <Text style={[styles.menuText, { color: 'red' }]}>삭제하기</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.menuPopup}>
                <TouchableOpacity style={styles.menuItem} onPress={() => {
                  setMenuVisible(false);
                  handleReport?.(item);
                }}>
                  <Text style={styles.menuText}>신고하기</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={() => {
                  setMenuVisible(false);
                  handleBlock?.(item);
                }}>
                  <Text style={styles.menuText}>차단하기</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>

        {/* 이미지 슬라이더 영역 */}
        {imageList.length > 0 && (
          <View style={styles.commMargin}>
            <ImageCarousel
              images={imageList?.length ? imageList.map((file) => file.file_path) : []}
              height={330}
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

      {/* 좋아요 / 댓글 영역 */}
      <View style={styles.engagementRow}>
        <TouchableOpacity 
          style={styles.engagementItem} 
          activeOpacity={0.6} 
          onPress={onPressLike}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {item.like_review_yn === 'Y' ? (
            <View style={{ marginEnd: 1.5 }}>
              <IconLikeOn width={23} height={22} />
            </View>
          ) : (
            <IconLikeOff width={22} height={22} />
          )}
          <Text style={styles.engagementText}>{item.like_cnt}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.engagementItem} 
          activeOpacity={0.6} 
          onPress={() => onCommentPress?.(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconComment width={22} height={22} />
          <Text style={styles.engagementText}>{item.comment_cnt}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  commMargin: {
    marginBottom        : 16,
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
  engagementRow: {
    flexDirection       : 'row',
    alignItems          : 'center',
    paddingHorizontal   : 16,
    paddingBottom       : 12,
    gap                 : 16,
  },
  engagementItem: {
    flexDirection       : 'row',
    alignItems          : 'center',
    gap                 : 4,
  },
  engagementText: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-SemiBold',
    color               : COLOR.TEXT_DEFAULT,
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
    minWidth            : 100,
    elevation           : 5,
    shadowColor         : '#000',
    shadowOffset        : { width: 0, height: 2 },
    shadowOpacity       : 0.2,
    shadowRadius        : 4,
    zIndex              : 100,
  },
  menuItem: {
    paddingVertical     : 12,
    paddingHorizontal   : 18,
  },
  menuText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_1A1A1A,
    textAlign           : 'center',
  },
  menuDivider: {
    height              : 1,
    width               : '85%',
    backgroundColor     : COLOR.COLOR_E6E6E6,
    alignSelf           : 'center',
  },  
}); 