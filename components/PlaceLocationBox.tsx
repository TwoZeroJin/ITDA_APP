import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { MeetInfo, MeetReview } from '@/types';

interface placeLocationBoxProps {
  data: MeetInfo;
}

export default function PlaceLocationBox({ data }: placeLocationBoxProps) {
  // 클릭 시 네이버 지도로 이동시키는 함수
  const openNaverMap = async () => {
    if (!data.place_name || !data.place_addr) return;
    
    // 네이버 지도 앱 전용 URL 스키마 (주소 검색 방식)
    // 인코딩을 해주어야 공백이나 한글이 주소창에 깨지지 않고 잘 들어갑니다.
    const encodedAddress = encodeURIComponent(data.place_addr);
    const encodedName = encodeURIComponent(data.place_name);
    
    const appUrl = `nmap://search?query=${encodedAddress}&appname=com.yourcompany.myapp`; // 실제 서비스 패키지명 입력 가능
    const webUrl = `https://map.naver.com/v5/search/${encodedAddress}`;

    try {
      // 1. 유저의 핸드폰에 네이버 지도 앱이 설치되어 있는지 확인
      const isSupported = await Linking.canOpenURL(appUrl);

      if (isSupported) {
        // 2. 앱이 있으면 네이버 지도 앱으로 바로 실행
        await Linking.openURL(appUrl);
      } else {
        // 3. 앱이 없으면 기본 브라우저(사파리/크롬)로 네이버 지도 웹사이트 열기
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert('오류', '네이버 지도를 열 수 없습니다.');
      console.error('Naver Map Open Error:', error);
    }
  };

  if (data != null &&data.place_addr != null && data.place_addr !== '') {
  console.log('PlaceLocationBox 렌더링 - 장소 정보:', data.place_name, data.place_addr);
    return (
      // 🌟 View를 TouchableOpacity로 변경하여 카드 전체를 클릭 가능하게 만듭니다.
      <TouchableOpacity 
        style={styles.mapCard} 
        onPress={openNaverMap}
        activeOpacity={0.7} // 클릭했을 때 살짝 흐려지는 효과 수치
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 12,
    overflow: 'hidden', // 이미지가 튀어나가지 않게
    alignItems: 'center',
  },
  mapThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#EAEAEA',
  },
  mapTextContainer: {
    paddingHorizontal: 15,
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#888',
  },
});





