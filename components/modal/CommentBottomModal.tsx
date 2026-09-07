import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Animated, Dimensions, FlatList, Keyboard, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ChatSend from '@/assets/images/icon_chat_send.svg';
import ProfileIcon from '@/components/ProfileIcon';
import { COLOR } from '@/constants';
import { ReviewComment } from '@/types';
import { formatRelativeTime, getMemberInfo } from '@/utils/commUtil';
import { showToast } from '@/utils/commToast';
import { useReviewCommentInsert, useReviewCommentList } from '@/hooks/queries/useCommunity';
import IconBackArrow from '@/assets/images/icon_arrow_left_more.svg';
import IconLikeOff from '@/assets/images/icon_review_like_off.svg';
import IconLikeOn from '@/assets/images/icon_review_like_on.svg';
import { useMemberLike } from '@/hooks/queries/useMember';

interface CommentBottomModalProps {
  visible   : boolean;
  reviewId  : number;
  onClose   : () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.55;

/**
 * 댓글 목록 / 등록 바텀 모달
 */
export default function CommentBottomModal({ visible, reviewId, onClose }: CommentBottomModalProps) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(visible);

  // 모달 슬라이드 애니메이션 초기값 설정
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [visible]);

  // 키보드 열림/닫힘에 따라 시트 전체를 위/아래로 이동
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: -e.endCoordinates.height,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: Animated.add(slideAnim, keyboardAnim) }] },
          ]}
        >
          {visible && <CommentBottomModalContent reviewId={reviewId} onClose={onClose} />}
        </Animated.View>
      </View>
    </Modal>
  );
}

function CommentBottomModalContent({ reviewId, onClose }: { reviewId: number; onClose: () => void }) {
  const [commentText, setCommentText] = useState('');
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [myImageUrl, setMyImageUrl] = useState('');
  const commentInsert = useReviewCommentInsert();
  const flatListRef = useRef<FlatList<ReviewComment>>(null);
  const { results, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useReviewCommentList({
    page_no     : 0,
    page_size   : 20,
    review_id   : reviewId,
  });
  const memberLike = useMemberLike();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getMemberInfo().then((info) => setMyImageUrl(info.mem_image_url || ''));
  }, []);

  const toggleLike = (comment: ReviewComment) => {
    if (!comment.comment_id) {
      return;
    }
    memberLike.mutate(
      {
        target_id   : comment.comment_id,
        target_type : 'C',
        flag        : !isCommentLiked(comment),
      },
      {
        onSuccess: () => {
          setLikedMap((prev) => ({ ...prev, [comment.comment_id!]: !isCommentLiked(comment) }));
        },
        onError: () => {},
      },
    );
  };

  const isCommentLiked = (comment: ReviewComment) => {
    return comment.comment_id !== undefined && comment.comment_id in likedMap
      ? likedMap[comment.comment_id]
      : comment.like_yn === 'Y';
  };

  const getLikeCount = (comment: ReviewComment) => {
    const liked = isCommentLiked(comment);
    const wasLiked = comment.like_yn === 'Y';
    if (liked === wasLiked) {
      return comment.like_cnt;
    }
    return liked ? comment.like_cnt + 1 : Math.max(0, comment.like_cnt - 1);
  };

  const handleCommentInsert = () => {
    const content = commentText.trim();
    if (!content || !reviewId) {
      return;
    }
    commentInsert.mutate(
      { review_id: reviewId, review_comment: content } as ReviewComment,
      {
        onSuccess: () => {
          setCommentText('');
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }, 300);
        },
        onError: () => showToast({ text1: '댓글 등록 중 오류가 발생했습니다.' }),
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.6} onPress={onClose}>
          <IconBackArrow width={16} height={16} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>댓글</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={results}
        keyExtractor={(item, index) => `${item.comment_id ?? index}`}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <ProfileIcon mem_image_url={item.mem_image_url || ''} type="MEMBER" />
            <View style={styles.commentContent}>
              <Text style={styles.userName}>{item.mem_nick}</Text>
              <Text style={styles.timeText}>{formatRelativeTime(item.reg_sdate)}</Text>
              <Text style={styles.contentText}>{item.review_comment}</Text>
            </View>
            <TouchableOpacity style={styles.likeButton} activeOpacity={0.6} onPress={() => toggleLike(item)}>
              {isCommentLiked(item) ? (
                <IconLikeOn width={19} height={18} />
              ) : (
                <IconLikeOff width={18} height={18} />
              )}
              <Text style={styles.likeCountText}>{getLikeCount(item)}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>등록된 댓글이 없습니다.</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator size="small" color={COLOR.APP_ACTIVE_3} style={{ marginVertical: 20 }} /> : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />

      <View style={[styles.inputBarWrap, { paddingBottom: 18 + insets.bottom }]}>
        <ProfileIcon mem_image_url={myImageUrl} type="MEMBER" />
        <View style={styles.inputBoxWrap}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="댓글 달기..."
            placeholderTextColor={COLOR.COMM_GRAY_7}
            style={styles.inputBox}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPressIn={handleCommentInsert}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChatSend width={30} height={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex                : 1,
    justifyContent      : 'flex-end',
    backgroundColor     : 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    height              : SHEET_HEIGHT,
    backgroundColor     : COLOR.COMM_WHITE,
    borderTopLeftRadius : 20,
    borderTopRightRadius: 20,
    overflow            : 'hidden',
  },
  container: {
    flex                : 1,
  },
  header: {
    flexDirection       : 'row',
    alignItems          : 'center',
    justifyContent      : 'center',
    paddingVertical      : 16,
  },
  backButton: {
    position            : 'absolute',
    left                : 12,
    padding             : 4,
  },
  headerTitle: {
    fontSize            : 18,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.COMM_BLACK,
  },
  listContent: {
    paddingHorizontal   : 20,
    paddingTop          : 12,
    flexGrow            : 1,
  },
  commentItem: {
    flexDirection       : 'row',
    alignItems          : 'flex-start',
    paddingVertical     : 14,
  },
  commentContent: {
    flex                : 1,
    marginStart         : 12,
  },
  userName: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.TEXT_DEFAULT,
  },
  timeText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
    marginTop           : 2,
  },
  contentText: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COMM_BLACK,
    marginTop           : 6,
  },
  likeButton: {
    alignItems          : 'center',
    marginStart         : 8,
    minWidth            : 24,
  },
  likeCountText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
    marginTop           : 6,
  },
  separator: {
    height              : 1,
    backgroundColor     : COLOR.COLOR_E6E6E6,
  },
  emptyContainer: {
    paddingVertical     : 60,
    alignItems          : 'center',
  },
  emptyText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
  },
  inputBarWrap: {
    flexDirection       : 'row',
    alignItems          : 'center',
    gap                 : 10,
    paddingHorizontal   : 16,
    paddingVertical     : 10,
    borderTopWidth      : 1,
    borderTopColor      : COLOR.COLOR_E6E6E6,
  },
  inputBoxWrap: {
    flex                : 1,
    backgroundColor     : COLOR.COMM_GRAY_5,
    borderRadius        : 20,
    paddingHorizontal   : 16,
    paddingVertical     : 10,
    height              : 50,
    marginStart         : -8,
  },
  inputBox: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COMM_BLACK,
  },
});
