import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { GroupInfo, MeetInfo } from '@/types';
import { COLOR } from '@/constants';

/**
 * 네이버 지도 컴포넌트
 */
export default function PlaceLocationBox({ data }: { data: MeetInfo | GroupInfo }) {
  // 클릭 시 네이버 지도로 이동시키는 함수
  const openNaverMap = async () => {
    if (!data.place_name || !data.place_addr) return;
    
    // 네이버 지도 앱 전용 URL 스키마 (주소 검색 방식)
    // 인코딩을 해주어야 공백이나 한글이 주소창에 깨지지 않고 잘 들어갑니다.
    const encodedAddress = encodeURIComponent(data.place_addr);
    
    const appUrl = `nmap://search?query=${encodedAddress}&appname=church.hacts.itda`;
    const webUrl = `https://map.naver.com/v5/search/${encodedAddress}`;

    try {
      // 유저의 핸드폰에 네이버 지도 앱이 설치되어 있는지 확인
      const isSupported = await Linking.canOpenURL(appUrl);

      if (isSupported) {
        // 앱이 있으면 네이버 지도 앱으로 바로 실행
        await Linking.openURL(appUrl);
      } else {
        // 앱이 없으면 기본 브라우저(사파리/크롬)로 네이버 지도 웹사이트 열기
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert('오류', '네이버 지도를 열 수 없습니다.');
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





