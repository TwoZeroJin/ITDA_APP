import BtnLikeDefault from '@/assets/images/btn_like_default.svg';
import BtnLikeActive from '@/assets/images/btn_like_active.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import ImageDefault from '@/assets/images/no_image.svg';
import CommLabel from '@/components/comm/CommLabel';
import { COLOR } from '@/constants';
import { GroupInfo } from '@/types';
import { getAccessToken } from '@/utils/commUtil';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MemDefault from '@/assets/images/icon_mem_default.svg';
import { router } from 'expo-router';

let cachedIsLoggedIn: boolean | null = null;

interface CommGroupCardProps {
  item: GroupInfo;
  onLikePress?: (item: GroupInfo) => void;
  backgroundColor?: string;
}

/**
 * 공통 소모임 아이템 카드 컴포넌트
 */
export default function CommGroupCard({ item, onLikePress, backgroundColor }: CommGroupCardProps) {
  const [thumbImageError, setThumbImageError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(cachedIsLoggedIn ?? false);
  const dynamicBackgroundColor = backgroundColor === 'grey' ? COLOR.COMM_GRAY_8 : COLOR.COMM_WHITE;

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
      style={[styles.recommendItemContainer, { backgroundColor: dynamicBackgroundColor }]}
      activeOpacity={0.6}
      onPress={() => router.push({ 
        pathname: '/groups/groupDetailPage',
        params: { groupId: item.group_id }
      })}
    >
      <View>
        {imageSource ? (
          <ImageBackground
            source={imageSource}
            style={styles.recommendItemImage}
            imageStyle={styles.recommendImage}
            onError={() => setThumbImageError(true)}
          >
            {isLoggedIn && (
              <TouchableOpacity style={styles.recommendLikeBtnContainer} activeOpacity={0.6} onPress={() => onLikePress?.(item)}>
                {item.like_yn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
              </TouchableOpacity>
            )}
          </ImageBackground>
        ) : (
          <View style={styles.recommendItemImage}>
            <ImageDefault width={96} height={96} />
            {isLoggedIn && (
              <TouchableOpacity style={styles.recommendLikeBtnContainer} activeOpacity={0.6} onPress={() => onLikePress?.(item)}>
                {item.like_yn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View style={styles.contentWrap}>
        <View style={styles.recommendTagContainer}>
          <CommLabel variant="club" />
          <CommLabel variant="category" category={item.group_subj_name} />
        </View>
        <View style={styles.recommendContentContainer}>
          <Text style={styles.recommendContentTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.group_name}
          </Text>
          <View style={styles.recommendContentInfoContainer}>
            {item.place_addr && (<><IconMarker width={12} height={12} />
            <Text style={styles.recommendContentText}>{item.place_addr}</Text></>)}
            {item.apply_ratio && (<><IconMembers width={12} height={12} />
            <Text style={styles.recommendContentText}>{item.apply_ratio}</Text></>)}
          </View>
          <View style={styles.recommendContentInfoContainer}>
            {hostImageSource ? (
              <Image 
                source={hostImageSource}
                style={styles.hostImage}
                onError={() => setProfileImageError(true)}
              />
            ) : (
              <MemDefault width={23} height={23} />
            )}
            <Text style={styles.recommendHostText}>{item.mem_nick}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recommendItemContainer: {
    width             : '95%',
    borderRadius      : 12,
    padding           : 12,
    flexDirection     : 'row',
    marginEnd         : 30,
  },
  recommendItemImage: {
    width             : 96,
    height            : 96,
    borderRadius      : 12,
    overflow          : 'hidden',
  },
  recommendImage: {
    width             : '100%',
    height            : '100%',
    borderRadius      : 12,
    overflow          : 'hidden',
  },
  recommendLikeBtnContainer: {
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
  recommendTagContainer: {
    flexDirection     : 'row',
    gap               : 6,
    marginBottom      : 4,
  },
  recommendContentContainer: {
    gap               : 4,
  },
  recommendContentInfoContainer: {
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 12,
  },
  recommendContentTitle: {
    fontSize          : 16,
    fontWeight        : 'bold',
    color             : COLOR.TEXT_3C3C3C,
  },
  recommendContentText: {
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
  recommendHostText: {
    fontSize          : 14,
    marginStart       : -8,
    fontWeight        : 'bold',
    color             : COLOR.COMM_SHADOW,
  },
});
