import BtnLikeDefault from '@/assets/images/btn_like_default.svg';
import BtnLikeActive from '@/assets/images/btn_like_active.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import ImageDefault from '@/assets/images/no_image.svg';
import CommLabel from '@/components/comm/CommLabel';
import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import { getAccessToken } from '@/utils/commUtil';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MemDefault from '@/assets/images/icon_mem_default.svg';
import { router } from 'expo-router';

let cachedIsLoggedIn: boolean | null = null;

interface CommMeetCardProps {
  item: MeetInfo;
  onLikePress?: (item: MeetInfo) => void;
}

/**
 * 공통 소모임 아이템 카드 컴포넌트
 */
export default function CommMeetCard({ item, onLikePress }: CommMeetCardProps) {
  const [thumbImageError, setThumbImageError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(cachedIsLoggedIn ?? false);

  // 좋아요 버튼 여부
  useEffect(() => {
    let isMounted = true;
    if (cachedIsLoggedIn !== null) {
      setIsLoggedIn(cachedIsLoggedIn);
      return () => {
        isMounted = false;
      };
    }
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
  }, []);

  const imageSource = useMemo(
    () => (thumbImageError || !item.thumb_url ? null : { uri: item.thumb_url }),
    [thumbImageError, item.thumb_url],
  );

  const hostImageSource = useMemo(
    () => (profileImageError || !item.mem_image_url ? null : { uri: item.mem_image_url }),
    [profileImageError, item.mem_image_url],
  );

  return (
    <TouchableOpacity 
      style={styles.itemContainer}
      activeOpacity={0.6}
      onPress={() => router.push({ 
        pathname: '/meets/meetDetailPage',
        params: { meetId: item.meet_id }
      })}
    >
      <View>
        {imageSource ? (
          <ImageBackground
            source={imageSource}
            style={styles.itemImage}
            imageStyle={styles.image}
            onError={() => setThumbImageError(true)}
          >
        {isLoggedIn && (
          <TouchableOpacity style={styles.likeBtnContainer} activeOpacity={0.6} onPress={() => onLikePress?.(item)}>
            {item.like_yn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
          </TouchableOpacity>
        )}
        </ImageBackground>) : (
          <View style={styles.itemImage}>
            <ImageDefault width={96} height={96} />
            {isLoggedIn && (
              <TouchableOpacity style={styles.likeBtnContainer} activeOpacity={0.6} onPress={() => onLikePress?.(item)}>
                {item.like_yn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View style={styles.contentWrap}>
        <View style={styles.tagContainer}>
          <CommLabel variant="social" />
          <CommLabel variant="category" category={item.meet_subj_name} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.meet_name}
          </Text>
          <View style={styles.contentInfoContainer}>
            {item.place_addr && (<><IconMarker width={12} height={12} />
            <Text style={styles.contentText}>{item.place_addr}</Text></>)}
            {item.apply_ratio && (<><IconMembers width={12} height={12} />
            <Text style={styles.contentText}>{item.apply_ratio}</Text></>)}
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
            <Text style={styles.hostText}>{item.mem_nick}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width             : '95%',
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 12,
    padding           : 12,
    flexDirection     : 'row',
    marginEnd         : 30,
  },
  itemImage: {
    width             : 96,
    height            : 96,
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
    fontWeight        : 'bold',
    color             : COLOR.TEXT_3C3C3C,
  },
  contentText: {
    fontSize          : 12,
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
    marginStart       : -8,
    fontWeight        : 'bold',
    color             : COLOR.COMM_SHADOW,
  },
});
