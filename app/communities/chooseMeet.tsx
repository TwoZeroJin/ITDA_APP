import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MeetInfo, SearchParams } from '@/types';
import { router } from 'expo-router';
import { COLOR } from '@/constants';
import { useMyMeetListNoReview } from '@/hooks/queries/useCommunity';
import CommHeader from '@/components/comm/CommHeader';
import CommCard from '@/components/comm/CommCard';

export default function chooseMeet() {
  const { results } = useMyMeetListNoReview({
    sch_condition: '3',
  } as SearchParams);  

  return (
    <View>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="커뮤니티 작성"/>

      {/* 소셜링 생성 타이틀 */}
      <Text style={styles.titleText}>후기를 작성할 모임을 선택해주세요.</Text>
      <FlatList 
        data={results}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => router.navigate({
              pathname: '/communities/writeFeedback',
              params: { data: JSON.stringify(item) }
            })}
          >
          <View style={styles.meetContainer} >
              <CommCard item={item as MeetInfo} backgroundColor="grey"/>
          </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.meet_id?.toString() || ''}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>후기를 작성할 수 있는 모임이 없습니다.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  meetContainer: {
    marginTop           : 12,
    paddingHorizontal   : 20,
  },
  emptyContainer: {
    flex: 1,
    marginTop          : 100,
    alignItems         : 'center',
    justifyContent     : 'center',
  },
  emptyText: {
    fontSize          : 16,
    color             : COLOR.COMM_GRAY_2,
  },  
  titleText: {
    fontSize          : 24,
    fontFamily        : 'Pretendard-Bold',
    color             : COLOR.TEXT_1C1C1C,
    marginTop         : 16,
    marginStart       : 16,
  },
});