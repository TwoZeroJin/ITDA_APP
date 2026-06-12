import CommLabel from '@/components/comm/CommLabel';
import MemDefault from '@/assets/images/icon_mem_default.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import ImageDefault from '@/assets/images/no_image.svg';
import BtnLikeDefault from '@/assets/images/btn_like_default.svg';
import BtnLikeActive from '@/assets/images/btn_like_active.svg';
import { COLOR, COMM_CONSTANTS } from '@/constants';
import React, { useMemo, useState } from 'react';
import { Image, ImageBackground, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { GroupInfo, LikeData, MeetInfo } from '@/types';
import { isLikeData, isMeetItem } from '@/utils/commUtil';

  interface CommCard2Props {
  item          : MeetInfo | GroupInfo | LikeData;
  onPress?      : (item: MeetInfo | GroupInfo | LikeData) => void;
  onLikePress?  : (item: MeetInfo | GroupInfo | LikeData) => void;
  selected?     : boolean;
  style?        : StyleProp<ViewStyle>;
}

export default function CommCard2({ item, onPress, onLikePress, selected = false, style }: CommCard2Props) {
  const [thumbImageError, setThumbImageError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const imageSource = useMemo(
    () => (thumbImageError || !item.thumb_url ? null : { uri: item.thumb_url }),
    [thumbImageError, item.thumb_url],
  );
  const hostImageSource = useMemo(
    () => (profileImageError || !item.mem_image_url ? null : { uri: item.mem_image_url }),
    [profileImageError, item.mem_image_url],
  );
  
  const isLike = isLikeData(item);
  const isMeet = isMeetItem(item);
  const title = isLike ? item.target_name : isMeet ? item.meet_name : item.group_name;
  const categoryName = isLike ? item.apply_ratio : isMeet ? item.meet_subj_name : item.group_subj_name;
  const labelVariant = isLike ? (item.target_type === COMM_CONSTANTS.TARGET_MEET ? COMM_CONSTANTS.COMM_MEET : COMM_CONSTANTS.COMM_GROUP) : isMeet ? COMM_CONSTANTS.COMM_MEET : COMM_CONSTANTS.COMM_GROUP;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, style]}
      activeOpacity={0.6}
      onPress={() => onPress?.(item)}
    >
      <View style={[styles.card, selected && styles.selectedCard]}>
        {imageSource ? (<ImageBackground
          source={imageSource}
          style={styles.cardImage}
          imageStyle={styles.cardImageStyle}
          onError={() => setThumbImageError(true)}
        >
          {onLikePress && (
            <TouchableOpacity
              style={styles.likeBtn}
              activeOpacity={0.6}
              onPress={() => onLikePress(item)}
            >
              {isLike || item.like_yn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
            </TouchableOpacity>
          )}
        </ImageBackground>) : (
          <View style={styles.cardImage}>
            <ImageDefault width={106} height={106} />
            {onLikePress && (
              <TouchableOpacity
                style={styles.likeBtn}
                activeOpacity={0.6}
                onPress={() => onLikePress(item)}
              >
                {isLike || item.like_yn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.tagRow}>
            <CommLabel variant={labelVariant as "MEET" | "GROUP"} />
            <CommLabel variant="category" category={categoryName} />
          </View>

          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>

          {item.place_addr && (
            <View style={styles.infoRowItem}>
              <IconMarker width={12} height={12} />
              <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">{item.place_addr}</Text>
            </View>
          )}
          {item.apply_ratio && (
            <View style={styles.infoRowItem}>
              <IconMembers width={12} height={12} />
              <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">{item.apply_ratio}</Text>
            </View>
          )}

          <View style={styles.hostRow}>
            {hostImageSource ? (
              <Image source={hostImageSource} 
              style={styles.hostImage} 
              onError={() => setProfileImageError(true)}
            />
            ) : (
              <MemDefault width={20} height={20} />
            )}
            <Text style={styles.hostText} numberOfLines={1} ellipsizeMode="tail">{item.mem_nick}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom      : 12,
  },
  card: {
    flexDirection     : 'row',
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 12,
    paddingVertical   : 10,
    paddingHorizontal : 12,
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    alignItems        : 'center',
  },
  selectedCard: {
    borderColor       : COLOR.APP_ACTIVE_3,
  },
  cardImage: {
    width             : 106,
    height            : 106,
    borderRadius      : 10,
    overflow          : "hidden",
  },
  cardImageStyle: {
    borderRadius      : 10,
  },
  likeBtn: {
    position          : 'absolute',
    bottom            : 0,
    right             : 0,
    width             : 35,
    height            : 35,
    justifyContent    : 'center',
    alignItems        : 'center',
  },
  cardContent: {
    flex              : 1,
    marginStart       : 12,
    height            : '100%',
    gap               : 4,
  },
  tagRow: {
    flexDirection     : 'row',
    flexWrap          : 'wrap',
    gap               : 6,
  },
  cardTitle: {
    fontSize          : 16,
    fontFamily        : 'Pretendard-Medium',
    color             : COLOR.TEXT_3C3C3C,
  },
  infoRowItem: {
    flexDirection     : 'row', 
    alignItems        : 'center',
    gap               : 4,
  },
  infoText: {
    fontSize          : 12,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.COMM_SHADOW,
  },
  hostRow: {
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 6,
  },
  hostImage: {
    width             : 20,
    height            : 20,
    borderRadius      : 10,
  },
  hostText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
  },
});