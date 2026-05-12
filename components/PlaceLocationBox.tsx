import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MeetInfo } from '@/types';


interface placeLocationBoxProps {
  data: MeetInfo;
}


export default function PlaceLocationBox({data}: placeLocationBoxProps) {
  if (data.place_addr != null && data.place_addr !== '') {
  return (
    <View style={styles.mapCard}>
      <Image 
        source={{ uri: 'https://navermaps.github.io/android-map-sdk/assets/2-3-basic.png' }} // 실제 지도 썸네일 이미지
        style={styles.mapThumbnail}
      />
      <View style={styles.mapTextContainer}>
        <Text style={styles.locationName}>{data.place_name}</Text>
        <Text style={styles.locationAddress}>{data.place_addr}</Text>
      </View>
    </View>      
    );
  } else {
    return null; // 장소 정보가 없으면 아무것도 렌더링하지 않음
  }




};

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





