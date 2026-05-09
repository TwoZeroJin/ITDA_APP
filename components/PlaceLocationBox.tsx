import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MeetInfo } from '@/types';


interface placeLocationBoxProps {
  data: MeetInfo;
}


export default function PlaceLocationBox({data}: placeLocationBoxProps) {
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





