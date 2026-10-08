import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Animated, GestureResponderEvent, Keyboard, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetFlatListMethods, BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import ChatSend from '@/assets/images/icon_chat_send.svg';
import ProfileIcon from '@/components/ProfileIcon';
import { COLOR, QUERY_KEYS } from '@/constants';
import { ReviewComment } from '@/types';
import { formatRelativeTime, getMemberInfo } from '@/utils/commUtil';
import { showToast } from '@/utils/commToast';
import { useReviewCommentDelete, useReviewCommentInsert, useReviewCommentList, useReviewCommentUpdate } from '@/hooks/queries/useCommunity';
import { useReportBlock } from '@/hooks/queries/useReport';
import CustomDialog from '@/components/modal/CustomDialog';
import IconLikeOff from '@/assets/images/icon_review_like_off.svg';
import IconLikeOn from '@/assets/images/icon_review_like_on.svg';
import { useMemberLike } from '@/hooks/queries/useMember';
import { useAuthRouter } from '@/components/comm/AuthRoute';
import { STORE_KEY } from '@/constants';
import { getSecureStore } from '@/utils/secureStoreUtil';
import queryClient from '@/api/queryClient';

interface CommentBottomModalProps {
  visible   : boolean;
  reviewId  : number;
  onClose   : () => void;
}

/**
 * 댓글 입력바 렌더 함수를 Footer에 전달하기 위한 Context
 * - footerComponent에 인라인 함수를 넘기면 렌더링마다 새로운 컴포넌트로 인식되어
 *   TextInput이 재마운트(포커스 해제)되므로, 고정된 컴포넌트 + Context로 내용만 갱신합니다.
 */
const CommentInputBarContext = createContext<(() => ReactNode) | null>(null);

function CommentInputFooter(props: BottomSheetFooterProps) {
  const renderInputBar = useContext(CommentInputBarContext);
  return (
    <BottomSheetFooter {...props} bottomInset={0}>
      {renderInputBar?.()}
    </BottomSheetFooter>
  );
}

/**
 * 댓글 목록 / 등록 바텀 모달
 */
export default function CommentBottomModal({ visible, reviewId, onClose }: CommentBottomModalProps) {
  const [activeMenu, setActiveMenu] = useState<{
    comment: ReviewComment;
    top: number;
  } | null>(null);
  const [blockingComment, setBlockingComment] = useState<ReviewComment | null>(null);
  const [deletingComment, setDeletingComment] = useState<ReviewComment | null>(null);
  const [myMemId, setMyMemId] = useState<number>(0);
  const [myImageUrl, setMyImageUrl] = useState('');
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState<ReviewComment | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const reportBlock = useReportBlock();
  const { requireAuth } = useAuthRouter();
  const commentInsert = useReviewCommentInsert();
  const commentUpdate = useReviewCommentUpdate();
  const commentDelete = useReviewCommentDelete();
  const memberLike = useMemberLike();
  const flatListRef = useRef<BottomSheetFlatListMethods>(null);
  const commentInputRef = useRef<TextInput>(null);
  const inputKeyboardAnim = useRef(new Animated.Value(0)).current;
  const { results, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useReviewCommentList({
    page_no     : 0,
    page_size   : 20,
    review_id   : reviewId,
  }, visible && reviewId > 0);

  // 좋아요
  const toggleLike = (comment: ReviewComment) => {
    requireAuth(() => {
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
    });
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

  useEffect(() => {
    getMemberInfo().then((info) => {
      setMyMemId(info.mem_id || 0);
      setMyImageUrl(info.mem_image_url || '');
    });
  }, []);

  useEffect(() => {
    if(Platform.OS != 'ios') return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setIsKeyboardVisible(true);
      Animated.timing(inputKeyboardAnim, {
        toValue: -event.endCoordinates.height,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      Animated.timing(inputKeyboardAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [inputKeyboardAnim]);

  // 댓글 등록/수정
  const handleCommentInsert = () => {
    const content = commentText.trim();
    if (!content || !reviewId) {
      return;
    }

    if (editingComment) {
      commentUpdate.mutate(
        { ...editingComment, review_comment: content },
        {
          onSuccess: () => {
            setCommentText('');
            setEditingComment(null);
            showToast({ text1: '댓글이 수정되었습니다.' });
          },
        },
      );
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

    if (isKeyboardVisible) {
      Keyboard.dismiss();
    }
  };

  useEffect(() => {
    if (!visible) {
      setActiveMenu(null);
    }
  }, [visible]);

  // 댓글 더보기 메뉴 (수정/삭제/신고/차단) 열기/닫기 토글
  const handleCommentAction = (comment: ReviewComment, event?: GestureResponderEvent) => {
    if (!comment.comment_id) return;
    if (activeMenu?.comment.comment_id === comment.comment_id) {
      setActiveMenu(null);
      return;
    }
    const pageY = event?.nativeEvent?.pageY ?? 200;
    const menuHeight = 100;
    const isNearBottom = pageY + menuHeight > windowHeight - (insets.bottom + 80);
    const top = isNearBottom ? Math.max(10, pageY - menuHeight) : pageY + 14;

    setActiveMenu({
      comment,
      top,
    });
  };

  if (!visible) {
    return null;
  }

  // 댓글 입력바 (Context를 통해 고정 Footer 컴포넌트 내부에 렌더링됨)
  const renderInputBar = () => (
    <View
      style={[
        styles.inputBarWrap,
        { paddingBottom: insets.bottom },
      ]}
    >
      <ProfileIcon mem_image_url={myImageUrl} type="MEMBER" />
      <View style={styles.inputBoxWrap}>
        <TextInput
          ref={commentInputRef}
          value={commentText}
          onChangeText={setCommentText}
          onFocus={() => {
            requireAuth(() => {});
          }}
          placeholder={editingComment ? '댓글 수정...' : '댓글 달기...'}
          placeholderTextColor={COLOR.COMM_GRAY_7}
          style={styles.inputBox}
          multiline
          maxLength={500}
        />
      </View>
      {editingComment && (
        <TouchableOpacity
          style={styles.editCancelButton}
          activeOpacity={0.6}
          onPress={() => {
            setEditingComment(null);
            setCommentText('');
            commentInputRef.current?.blur();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={22} color={COLOR.COLOR_838383} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleCommentInsert}
        style={styles.sendButton}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 10 }}
      >
        <ChatSend width={34} height={34} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <CommentInputBarContext.Provider value={renderInputBar}>
      <GestureHandlerRootView style={styles.modalContainer}>
        <BottomSheet
          index={visible ? 0 : -1}
          snapPoints={['55%', '75%']}
          enableDynamicSizing={false}
          enablePanDownToClose
          enableContentPanningGesture={true}
          keyboardBehavior="interactive"    
          keyboardBlurBehavior="none"
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
            />
          )}
          footerComponent={CommentInputFooter}
          onChange={(index) => {
            if (activeMenu) {
              setActiveMenu(null);
            }
            if (index === -1) {
              onClose();
            }
          }}
        >
          <BottomSheetFlatList
            ListHeaderComponent={
              <View style={styles.header}>
                <Text style={styles.headerTitle}>댓글</Text>
              </View>
            }
            ref={flatListRef}
            data={results}
            keyExtractor={(item, index) => `${item.comment_id ?? index}`}
            style={styles.commentList}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="always"
            onScrollBeginDrag={() => {
              if (activeMenu) {
                setActiveMenu(null);
              }
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <ProfileIcon mem_id={item?.mem_id} mem_image_url={item.mem_image_url || ''} type="MEMBER" />
                <View style={styles.commentContent}>
                  <Text style={styles.userName}>
                    {item.mem_nick}{'  '}
                    <Text style={styles.timeText}>
                      {formatRelativeTime(item.reg_sdate)}
                      {item.mod_sdate && <Text style={styles.editedText}> (수정됨)</Text>}
                    </Text>
                  </Text>
                  <Text style={styles.contentText}>{item.review_comment}</Text>
                </View>
                <View style={styles.likeActionColumn}>
                  <TouchableOpacity style={styles.likeButton} activeOpacity={0.6} onPress={() => toggleLike(item)}>
                    {isCommentLiked(item) ? (
                      <IconLikeOn width={19} height={18} />
                    ) : (
                      <IconLikeOff width={18} height={18} />
                    )}
                    <Text style={styles.likeCountText}>{getLikeCount(item)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.moreButton}
                    activeOpacity={0.6}
                    onPress={(event) => handleCommentAction(item, event)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="ellipsis-horizontal" size={20} color={COLOR.COLOR_838383} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>등록된 댓글이 없습니다.</Text>
                </View>
              ) : null
            }
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
          />
        </BottomSheet>
      </GestureHandlerRootView>
      </CommentInputBarContext.Provider>

      {/* 댓글 더보기 메뉴 (수정/삭제/신고/차단) - 최상단 레이어에 플로팅 렌더링 */}
      {activeMenu && (
        <View style={styles.dropdownOverlayLayer} pointerEvents="box-none">
          {/* 바깥 터치 시 메뉴 닫기 백드롭 */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setActiveMenu(null)}
          />

          <View
            style={[
              styles.commentDropdownMenu,
              {
                top: activeMenu.top,
                right: 20,
              },
            ]}
          >
            {!!myMemId && activeMenu.comment.mem_id === myMemId ? (
              <>
                <TouchableOpacity
                  style={styles.commentDropdownItem}
                  activeOpacity={0.6}
                  onPress={() => {
                    const target = activeMenu.comment;
                    setActiveMenu(null);
                    setEditingComment(target);
                    setCommentText(target.review_comment);
                    setTimeout(() => commentInputRef.current?.focus(), 100);
                  }}
                >
                  <Text style={styles.commentDropdownText}>수정하기</Text>
                </TouchableOpacity>
                <View style={styles.commentDropdownDivider} />
                <TouchableOpacity
                  style={styles.commentDropdownItem}
                  activeOpacity={0.6}
                  onPress={() => {
                    const target = activeMenu.comment;
                    setActiveMenu(null);
                    setDeletingComment(target);
                  }}
                >
                  <Text style={styles.commentDropdownText}>삭제하기</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.commentDropdownItem}
                  activeOpacity={0.6}
                  onPress={() => {
                    const targetId = activeMenu.comment.comment_id;
                    setActiveMenu(null);
                    if (!targetId) return;
                    onClose();
                    setTimeout(() => {
                      router.navigate({
                        pathname: '/user/reportCreate',
                        params: {
                          target_id   : targetId,
                          target_type : 'C',
                        },
                      });
                    }, 220);
                  }}
                >
                  <Text style={styles.commentDropdownText}>신고하기</Text>
                </TouchableOpacity>
                <View style={styles.commentDropdownDivider} />
                <TouchableOpacity
                  style={styles.commentDropdownItem}
                  activeOpacity={0.6}
                  onPress={() => {
                    const target = activeMenu.comment;
                    setActiveMenu(null);
                    setBlockingComment(target);
                  }}
                >
                  <Text style={styles.commentDropdownText}>차단하기</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}


      <CustomDialog
        visible={Boolean(deletingComment)}
        title="삭제"
        content="이 댓글을 삭제하시겠습니까?"
        cancelLabel="닫기"
        confirmLabel="삭제"
        onCancel={() => setDeletingComment(null)}
        onConfirm={() => {
          if (!deletingComment?.comment_id) {
            setDeletingComment(null);
            return;
          }
          commentDelete.mutate(
            { comment_id: deletingComment.comment_id } as ReviewComment,
            {
              onSuccess: () => showToast({ text1: '댓글이 삭제되었습니다.' }),
              onError: () => showToast({ text1: '댓글 삭제 중 오류가 발생했습니다.' }),
              onSettled: () => setDeletingComment(null),
            },
          );
        }}
      />

      <CustomDialog
        visible={Boolean(blockingComment)}
        title="차단"
        content="이 댓글을 차단하시겠습니까?"
        cancelLabel="닫기"
        confirmLabel="차단"
        onCancel={() => setBlockingComment(null)}
        onConfirm={() => {
          if (!blockingComment?.comment_id) {
            setBlockingComment(null);
            return;
          }
          reportBlock.mutate(
            {
              target_id   : blockingComment.comment_id,
              target_type : 'C',
            },
            {
              onSuccess: () => {
                showToast({ text1: '차단되었습니다.' });
                queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_COMMENT_LIST],
                });
              },
              onError: () => showToast({ text1: '차단 중 문제가 발생했습니다.' }),
              onSettled: () => setBlockingComment(null),
            },
          );
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex                : 1,
    backgroundColor     : 'transparent',
  },
  sheetContent: {
    flex                : 1,
    backgroundColor     : COLOR.COMM_WHITE,
  },
  sheetBackground: {
    backgroundColor     : COLOR.COMM_WHITE,
    borderTopLeftRadius : 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    width               : 40,
    height              : 4,
    backgroundColor     : COLOR.COLOR_E6E6E6,
  },
  header: {
    flexDirection       : 'row',
    alignItems          : 'center',
    justifyContent      : 'center',
    height              : 28,
    paddingHorizontal   : 12,
  },
  headerTitle: {
    fontSize            : 18,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.COMM_BLACK,
  },
  listContent: {
    paddingHorizontal   : 24,
    paddingBottom       : 90,
    flexGrow            : 1,
  },
  commentList: {
    flex                : 1,
  },
  commentItem: {
    flexDirection       : 'row',
    alignItems          : 'flex-start',
    paddingVertical     : 12,
    position            : 'relative',
  },
  commentContent: {
    flex                : 1,
  },
  userName: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.TEXT_DEFAULT,
  },
  timeText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
    marginTop           : 2,    
  },
  editedText: {
    fontSize            : 11,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
  },
  contentText: {
    fontSize            : 18,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COMM_BLACK,
    marginTop           : 6,
  },
  likeButton: {
    flexDirection       : 'row',
    alignItems          : 'center',
    gap                 : 4,
  },
  likeActionColumn: {
    alignItems          : 'center',
    marginStart         : 12,
    minWidth            : 24,
    position            : 'relative',
  },
  moreButton: {
    alignItems          : 'center',
    justifyContent      : 'center',
    minWidth            : 24,
    marginTop           : 8,
  },
  dropdownOverlayLayer: {
    position            : 'absolute',
    top                 : 0,
    left                : 0,
    right               : 0,
    bottom              : 0,
    zIndex              : 99999,
    elevation           : 20,
  },
  commentDropdownMenu: {
    position            : 'absolute',
    backgroundColor     : COLOR.COMM_WHITE,
    borderRadius        : 14,
    minWidth            : 105,
    paddingVertical     : 4,
    zIndex              : 99999,
    elevation           : 20,
    shadowColor         : COLOR.COMM_BLACK,
    shadowOffset        : { width: 0, height: 4 },
    shadowOpacity       : 0.15,
    shadowRadius        : 8,
  },
  commentDropdownItem: {
    paddingVertical     : 12,
    paddingHorizontal   : 16,
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  commentDropdownText: {
    fontSize            : 15,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_1A1A1A,
  },
  commentDropdownDivider: {
    height              : 1,
    width               : '85%',
    backgroundColor     : COLOR.COLOR_E6E6E6,
    alignSelf           : 'center',
  },
  likeCountText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
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
    paddingHorizontal   : 14,
    paddingTop          : 12,
    borderTopWidth      : 1,
    borderTopColor      : COLOR.COLOR_E6E6E6,
    backgroundColor     : COLOR.COMM_WHITE,
  },
  inputBoxWrap: {
    flex                : 1,
    backgroundColor     : COLOR.COMM_GRAY_5,
    borderRadius        : 18,
    paddingHorizontal   : 18,
    paddingTop          : 12,
    paddingBottom       : 8,
    height              : 58,
    marginStart         : -10,
    justifyContent      : 'center',
  },
  inputBox: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COMM_BLACK,
    marginTop           : -6,
  },
  editCancelButton: {
    position            : 'absolute',
    right               : 72,
    top                 : 40,
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  keyboardDismissButton: {
    alignItems          : 'center',
    justifyContent      : 'center',
    marginStart         : -4,
  },
  sendButton: {
    marginStart         : 2,
    marginEnd           : -4,
    paddingEnd          : 4,
    paddingVertical     : 12,
    zIndex              : 10,
  },
});
