import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { GroupInfo, MeetInfo } from '@/types';
import { COLOR } from '@/constants';
import { showToast } from '@/utils/commToast';

/**
 * 네이버 지도 컴포넌트
 */
export default function PlaceLocationBox({ data }: { data: MeetInfo | GroupInfo }) {
  const openNaverMap = async () => {
    if (!data.place_name || !data.place_addr) return;
    
    // 네이버 지도 앱 전용 URL 스키마 (주소 검색 방식)
    const encodedAddress = encodeURIComponent(data.place_addr);
    
    const appUrl = `nmap://search?query=${encodedAddress}&appname=church.hacts.itda`;
    const webUrl = `https://map.naver.com/v5/search/${encodedAddress}`;

    try {
      let isSupported = false;
      try {
        isSupported = await Linking.canOpenURL(appUrl);
      } catch {
        isSupported = false;
      }

      if (isSupported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch {
      try {
        await Linking.openURL(webUrl);
      } catch {
        showToast({ text1: '네이버 지도를 열 수 없습니다.' });
      }
    }
  };

  if (data != null && data.place_addr != null && data.place_addr !== '') {
    return (
      <TouchableOpacity 
        style={styles.mapCard} 
        onPress={openNaverMap}
        activeOpacity={0.6}
      >
        <Image 
          source={{ uri: 'https://navermaps.github.io/android-map-sdk/assets/2-3-basic.png' }} 
          style={styles.mapThumbnail}
        />
        <View style={styles.mapTextContainer}>
          <Text style={styles.locationName}>{data.place_name}</Text>
          <Text style={styles.locationAddress}>{data.place_addr}</Text>
        </View>
      </TouchableOpacity>      
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  mapCard: {
    flexDirection     : 'row',
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    borderRadius      : 12,
    overflow          : 'hidden',
    alignItems        : 'center',
  },
  mapThumbnail: {
    width             : 70,
    height            : 70,
  },
  mapTextContainer: {
    flex              : 1,
    paddingHorizontal : 15,
  },
  locationName: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Medium',
    color             : COLOR.COLOR_323232,
    marginBottom      : 4,
  },
  locationAddress: {
    fontSize          : 12,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
  },
});





