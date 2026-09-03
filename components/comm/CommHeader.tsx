import Back from '@/assets/images/arrow_left.svg';
import Like from '@/assets/images/header_like.svg';
import Noti from '@/assets/images/header_noti.svg';
import Setting from '@/assets/images/header_setting.svg';
import Detail from '@/assets/images/header_detail.svg';
import Logo from '@/assets/images/top_logo.svg';
import { COLOR, STORE_KEY } from '@/constants';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthRouter } from "@/components/comm/AuthRoute";
import { getAsyncStore } from '@/utils/asyncStoreUtil';
import { subscribePushCountChanged } from '@/utils/pushCountEvent';
import { useFocusEffect } from '@react-navigation/native';

interface CommHeaderProps {
  isLogo?         : boolean;
  // isBack?    : boolean;
  isLike?         : boolean;
  isNoti?         : boolean;
  isSetting?      : boolean;
  isBack?         : boolean;
  isDetail?       : boolean;
  isShare?        : boolean;
  title?          : string;
  onPressDetail?  : () => void;
  onPressShare?   : () => void;
}

function CommHeader({ isLogo = true, isLike = true, isNoti = true, isSetting = false, isBack = true, isDetail = false, isShare = false, title, onPressDetail, onPressShare }: CommHeaderProps) {
  const authRouter = useAuthRouter();
  const [notiCount, setNotiCount] = useState(0);

  const loadNotiCount = useCallback(async () => {
    if (!isNoti) {
      return;
    }

    const val = await getAsyncStore(STORE_KEY.PUSH_COUNT);
    setNotiCount(val ? parseInt(val, 10) : 0);
  }, [isNoti]);

  useFocusEffect(
    useCallback(() => {
      loadNotiCount();

      if (!isNoti) {
        return;
      }

      return subscribePushCountChanged((nextCount) => {
        setNotiCount(nextCount);
      });
    }, [loadNotiCount]),
  );

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.container}>
          {isLogo && <Logo width={101} height={50} style={{marginStart: 7}}/>}
          {!isLogo && isBack &&
            <TouchableOpacity onPress={handleBackPress} activeOpacity={0.6}>
              <Back width={54} height={44}/>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.titleWrapper}>
          {title && <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>}
        </View>
        <View style={[styles.container, styles.right]}>
          {isLike && 
            <TouchableOpacity style={styles.iconContainer} onPress={() => {authRouter.navigate("/mypage/likeList");}} activeOpacity={0.6}>
              <Like width={26} height={26}/>
            </TouchableOpacity>
          }
          {isNoti && 
            <TouchableOpacity style={styles.iconContainer} onPress={() => {authRouter.navigate("/mypage/notiList");}} activeOpacity={0.6}>
              <View>
                <Noti width={26} height={26}/>
                {notiCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notiCount > 99 ? '99+' : notiCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          }
          {isSetting && 
            <TouchableOpacity style={styles.iconContainer} onPress={() => {authRouter.navigate("/mypage/settings");}} activeOpacity={0.6}>
              <Setting width={26} height={26}/>
            </TouchableOpacity>
          }
          {isShare &&
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={onPressShare}
              accessibilityRole="button"
              accessibilityLabel="공유하기"
              activeOpacity={0.6}
            >
              <Ionicons name="share-outline" size={25} color={COLOR.COMM_BLACK} />
            </TouchableOpacity>
          }
          {isDetail && 
            <TouchableOpacity style={styles.iconContainer} onPress={onPressDetail} activeOpacity={0.6}>
              <Detail width={26} height={26}/>
            </TouchableOpacity>
          }
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flexDirection     : "row",
    alignItems        : "center",
    height            : 50,
    backgroundColor   : COLOR.COMM_WHITE
  },
  right: {
    marginStart       : "auto",
    marginEnd         : 12,
  },
   titleWrapper: {
    position          : 'absolute',
    left              : 0,
    right             : 0,
    top               : 5,
    bottom            : 0,
    justifyContent    : 'center',
    alignItems        : 'center',
    pointerEvents     : 'none',
  },
  title: {
    fontSize          : 18,
    fontFamily        : 'Pretendard-Bold',
    color             : COLOR.COMM_BLACK,
    width             : '70%',
    textAlign         : 'center',
  },
  iconContainer: {
    height            : '100%',
    paddingHorizontal : 6,
    justifyContent    : 'center',
    alignItems        : 'center'
  },
  badge: {
    position          : 'absolute',
    top               : -4,
    right             : -10,
    minWidth          : 16,
    height            : 16,
    borderRadius      : 8,
    backgroundColor   : COLOR.APP_MAIN,
    alignItems        : 'center',
    justifyContent    : 'center',
    paddingHorizontal : 3,
  },
  badgeText: {
    fontSize          : 10,
    fontFamily        : 'Pretendard-Bold',
    color             : COLOR.COMM_WHITE,
    lineHeight        : 14,
  },
});

export default CommHeader;
