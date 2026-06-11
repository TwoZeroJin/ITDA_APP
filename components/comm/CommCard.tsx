import BtnLikeDefault from '@/assets/images/btn_like_default.svg';
import BtnLikeActive from '@/assets/images/btn_like_active.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import ImageDefault from '@/assets/images/no_image.svg';
import CommLabel from '@/components/comm/CommLabel';
import { COLOR } from '@/constants';
import { GroupInfo, MeetInfo } from '@/types';
import { getAccessToken } from '@/utils/commUtil';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MemDefault from '@/assets/images/icon_mem_default.svg';
import { router, usePathname } from 'expo-router';

let cachedIsLoggedIn: boolean | null = null;

interface CommCardProps {
  item: MeetInfo | GroupInfo;
  onLikePress?: (item: MeetInfo | GroupInfo) => void;
  backgroundColor?: string;
}

function isMeetItem(item: MeetInfo | GroupInfo): item is MeetInfo {
  return 'meet_id' in item;
}

/**
 * 공통 아이템 카드 컴포넌트
 */
export default function CommCard({ item, onLikePress, backgroundColor }: CommCardProps) {
  const [thumbImageError, setThumbImageError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(cachedIsLoggedIn ?? false);
  const dynamicBackgroundColor = backgroundColor === 'grey' ? COLOR.COMM_GRAY_8 : COLOR.COMM_WHITE;
  const pathname = usePathname();

  // 좋아요 버튼 여부
  useEffect(() => {
    let isMounted = true;

    getAccessToken()
      .then((token) => {
        const nextIsLoggedIn = !!token;
        cachedIsLoggedIn = nextIsLoggedIn;
        if (isMounted) {
          setIsLoggedIn(nextIsLoggedIn);
        }
      })
      .catch(() => {
        cachedIsLoggedIn = false;
        if (isMounted) {
          setIsLoggedIn(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const imageSource = useMemo(
    () => (thumbImageError || !item.thumb_url ? null : { uri: item.thumb_url }),
    [thumbImageError, item.thumb_url],
  );

  const hostImageSource = useMemo(
    () => (profileImageError || !item.mem_image_url ? null : { uri: item.mem_image_url }),
    [profileImageError, item.mem_image_url],
  );

  const isMeet = isMeetItem(item);
  const title = isMeet ? item.meet_name : item.group_name;
  const categoryName = isMeet ? item.meet_subj_name : item.group_subj_name;
  const labelVariant = isMeet ? 'social' : 'club';

  const movePage = () => {
    if (pathname === '/communities/chooseMeet' && isMeet) {
        router.push({
          pathname: '/communities/writeFeedback',
          params: { data: JSON.stringify(item) },
        });
    } else if (isMeet) {
      router.push({ 
          pathname: '/meets/detailView',
          params: { meetId: item.meet_id }
      })
    } else {
      router.push({
        pathname: '/groups/detailView',
        params: { groupId: item.group_id },
      });
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.itemContainer, { backgroundColor: dynamicBackgroundColor }]}
      activeOpacity={0.6}
      onPress={movePage}
    >
      <View>
        {imageSource ? (
          <ImageBackground
            source={imageSource}
            style={styles.itemImage}
            imageStyle={styles.image}
            onError={() => setThumbImageError(true)}
          >
        {isLoggedIn && onLikePress && (
          <TouchableOpacity style={styles.likeBtnContainer} activeOpacity={0.6} onPress={() => onLikePress?.(item)}>
            {item.like_yn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
          </TouchableOpacity>
        )}
        </ImageBackground>) : (
          <View style={styles.itemImage}>
            <ImageDefault width={110} height={110} />
            {isLoggedIn && onLikePress && (
              <TouchableOpacity style={styles.likeBtnContainer} activeOpacity={0.6} onPress={() => onLikePress?.(item)}>
                {item.like_yn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View style={styles.contentWrap}>
        <View style={styles.tagContainer}>
          <CommLabel variant={labelVariant} />
          <CommLabel variant="category" category={categoryName} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          <View style={styles.contentInfoContainer}>
            {item.place_addr && (<><IconMarker width={12} height={12} />
            <Text style={styles.contentText} numberOfLines={1} ellipsizeMode="tail">{item.place_addr}</Text></>)}
          </View>
          <View style={styles.contentInfoContainer}>
            {item.apply_ratio && (<><IconMembers width={12} height={12} />
            <Text style={styles.contentText} numberOfLines={1} ellipsizeMode="tail">{item.apply_ratio}</Text></>)}
          </View>
          <View style={styles.contentInfoContainer}>
            {hostImageSource ? (
              <Image 
                source={hostImageSource}
                style={styles.hostImage}
                onError={() => setProfileImageError(true)}
              />
            ) : (
              <MemDefault width={23} height={23} />
            )}
            <Text style={styles.hostText} numberOfLines={1} ellipsizeMode="tail">{item.mem_nick}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius      : 12,
    paddingVertical   : 10,
    paddingHorizontal : 12,
    flexDirection     : 'row',
  },
  itemImage: {
    width             : 110,
    height            : 110,
    borderRadius      : 12,
    overflow          : 'hidden',
  },
  image: {
    width             : '100%',
    height            : '100%',
    borderRadius      : 12,
    overflow          : 'hidden',
  },
  likeBtnContainer: {
    justifyContent    : 'center',
    alignItems        : 'center',
    position          : 'absolute',
    bottom            : 0,
    right             : 0,
    width             : 35,
    height            : 35,
  },
  contentWrap: {
    marginStart       : 10,
  },
  tagContainer: {
    flexDirection     : 'row',
    gap               : 6,
    marginBottom      : 4,
  },
  contentContainer: {
    gap               : 4,
  },
  contentInfoContainer: {
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 12,
  },
  contentTitle: {
    fontSize          : 16,
    fontFamily        : 'Pretendard-Medium',
    color             : COLOR.COLOR_323232,
    width             : 200,
  },
  contentText: {
    fontSize          : 12,
    fontFamily        : 'Pretendard-Regular',
    marginStart       : -8,
    color             : COLOR.COMM_SHADOW,
  },
  hostImage: {
    width             : 20,
    height            : 20,
    borderRadius      : 10,
    marginEnd         : 4,
  },
  hostText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Medium',
    marginStart       : -8,
    color             : COLOR.COMM_SHADOW,
  },
});
