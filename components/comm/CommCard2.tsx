import CommLabel from '@/components/comm/CommLabel';
import MemDefault from '@/assets/images/icon_mem_default.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import ImageDefault from '@/assets/images/no_image.svg';
import BtnLikeDefault from '@/assets/images/btn_like_default.svg';
import BtnLikeActive from '@/assets/images/btn_like_active.svg';
import { COLOR } from '@/constants';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface CardData {
  id            : number;
  type?         : string;
  name          : string;
  subjectName?  : string;
  thumbUrl?     : string;
  placeAddr?    : string;
  applyRatio?   : string;
  hostNick?     : string;
  hostImageUrl? : string;
  likeYn?       : string;
}

interface CommCard2Props {
  item          : CardData;
  onPress?      : (item: CardData) => void;
  onLikePress?  : (item: CardData) => void;
  selected?     : boolean;
  style?        : StyleProp<ViewStyle>;
}

export default function CommCard2({ item, onPress, onLikePress, selected = false, style }: CommCard2Props) {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [item.id, item.thumbUrl]);

  const imageSource = item.thumbUrl && !hasImageError
    ? { uri: item.thumbUrl }
    : require('@/assets/images/no_image.png');

  const typeLabel = item.type === 'M' ? 'social' : item.type === 'G' ? 'club' : undefined;

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
          onError={() => setHasImageError(true)}
        >
          {onLikePress && (
            <TouchableOpacity
              style={styles.likeBtn}
              activeOpacity={0.6}
              onPress={() => onLikePress(item)}
            >
              {item.likeYn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
            </TouchableOpacity>
          )}
        </ImageBackground>) : (
          <View style={styles.cardImage}>
            <ImageDefault width={96} height={96} />
            {onLikePress && (
              <TouchableOpacity
                style={styles.likeBtn}
                activeOpacity={0.6}
                onPress={() => onLikePress(item)}
              >
                {item.likeYn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.tagRow}>
            {typeLabel && <CommLabel variant={typeLabel} />}
            {!!item.subjectName && <CommLabel variant="category" category={item.subjectName} />}
          </View>

          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>

          {!!item.placeAddr && (
            <View style={styles.infoRowItem}>
              <IconMarker width={12} height={12} />
              <Text style={styles.infoText}>{item.placeAddr}</Text>
            </View>
          )}
          {!!item.applyRatio && (
            <View style={styles.infoRowItem}>
              <IconMembers width={12} height={12} />
              <Text style={styles.infoText}>{item.applyRatio}</Text>
            </View>
          )}

          {!!item.hostNick && (
            <View style={styles.hostRow}>
              {item.hostImageUrl ? (
                <Image source={{ uri: item.hostImageUrl }} style={styles.hostImage} />
              ) : (
                <MemDefault width={20} height={20} />
              )}
              <Text style={styles.hostText}>{item.hostNick}</Text>
            </View>
          )}
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