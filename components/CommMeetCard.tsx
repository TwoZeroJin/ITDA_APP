import BtnLikeDefault from '@/assets/images/btn_like_default.svg';
import BtnLikeActive from '@/assets/images/btn_like_active.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import CommLabel from '@/components/CommLabel';
import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MemDefault from '@/assets/images/icon_mem_default.svg';

interface CommMeetCardProps {
  item: MeetInfo;
  onLikePress?: (item: MeetInfo) => void;
}

export default function CommMeetCard({ item, onLikePress }: CommMeetCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSource = imageError || !item.thumb_url
    ? require('@/assets/images/no_image.png')
    : { uri: item.thumb_url };

  return (
    <View style={styles.recommendItemContainer}>
      <View>
        <ImageBackground
          source={imageSource}
          style={styles.recommendItemImage}
          imageStyle={styles.recommendImage}
          onError={() => setImageError(true)}
        >
          <TouchableOpacity
            style={styles.recommendLikeBtnContainer}
            onPress={() => onLikePress?.(item)}
          >
            {item.like_yn === 'Y' ? <View style={{bottom : -4}}><BtnLikeActive /></View> : <BtnLikeDefault />}
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.contentWrap}>
        <View style={styles.recommendTagContainer}>
          <CommLabel variant="social" />
          <CommLabel variant="category" category={item.meet_subj_name} />
        </View>
        <View style={styles.recommendContentContainer}>
          <Text style={styles.recommendContentTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.mem_nick}
          </Text>
          <View style={styles.recommendContentInfoContainer}>
            {item.place_addr && (<><IconMarker width={12} height={12} />
            <Text style={styles.recommendContentText}>{item.place_addr}</Text></>)}
            {item.apply_ratio && (<><IconMembers width={12} height={12} />
            <Text style={styles.recommendContentText}>{item.apply_ratio}</Text></>)}
          </View>
          <View style={styles.recommendContentInfoContainer}>
            {imageSource ? (
              <Image 
                source={{ uri: item.mem_image_url }} 
                style={styles.hostImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <MemDefault width={23} height={23} />
            )}
            <Text style={styles.recommendHostText}>{item.mem_nick}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recommendItemContainer: {
    width             : '95%',
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 12,
    padding           : 12,
    flexDirection     : 'row',
    marginEnd         : 30,
  },
  recommendItemImage: {
    width             : 96,
    height            : 96,
    borderRadius      : 12,
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
