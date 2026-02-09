import CommHeader from '@/components/CommHeader';
import CommunityFeed from '@/components/CommunityFeed';
import { COLOR } from '@/constants';
import { StyleSheet, Text, FlatList, TouchableOpacity, View, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function community() {
  // ✅ 기본 선택: 'latest'
  const [activeType, setActiveType] = useState<'latest' | 'popular' | 'meeting'>('latest');
  // 피드 종류 버튼 렌더링 함수
  const renderButton = (label: string, type: 'latest' | 'popular' | 'meeting') => {
    const isActive = activeType === type;
    //피드 종류 버튼 : 최신, 인기, 모임 후기
    return (
      <TouchableOpacity onPress={() => setActiveType(type)}>
        <Text
          style={[
            styles.feedTypeBtn,
            {
              backgroundColor: isActive ? COLOR.APP_ACTIVE_3 : COLOR.COMM_GRAY,
              color: isActive ? COLOR.COMM_WHITE : COLOR.COMM_GRAY_2,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
      );
  };


  //피드 출력
  // 컴포넌트 내부 혹은 외부에 데이터 정의
  const feedList = [
    {
      feed_id: 1,
      feed_subject: '모임 후기',
      feed_content: '함께 요리하며 자연스럽게 대화를 나눌 수 있어 즐거운 시간이었습니다. 직접 만들고 함께 나누니 음식이 더 맛있어졌어요. 글이 좀 길어요 더보기 클릭해보세요.글이 좀 길어요 더보기 클릭해보세요.글이 좀 길어요 더보기 클릭해보세요.글이 좀 길어요 더보기 클릭해보세요.',
      feed_image_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
      mem_id: 123,
      mem_name: '정현수',
      reg_sdate: '2024-01-01',
      mod_sdate: '2024-01-01',
      use_stat: 'Y'
    },
    {
      feed_id: 2,
      feed_subject: '모임 후기',
      feed_content: '두 번째 피드 내용입니다. 모임이 정말 즐거웠어요!',
      feed_image_url: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2',
      mem_id: 123,
      mem_name: '김민지',
      reg_sdate: '2024-01-02',
      mod_sdate: '2024-01-02',
      use_stat: 'Y'
    }
  ];
  return (
    <View style={{ flex: 1 }}>
      <CommHeader />
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 12, color: COLOR.APP_ACTIVE_3}}>피드</Text>
          <TouchableOpacity onPress={() => router.navigate('/(tabs)/community/chooseWriteType')}>
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.feedTypeContainer}>
          {renderButton('최신', 'latest')}
          {renderButton('인기', 'popular')}
          {renderButton('모임 후기', 'meeting')}
        </View>
        {/* ✅ 피드 리스트 출력 부분 */}
        <FlatList 
        data={feedList}
        renderItem={({item}) => <CommunityFeed data={item} />}
        keyExtractor={(item) => item.feed_id.toString()}
        />
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: '100%',
    marginBottom: 4,
    backgroundColor: COLOR.COMM_WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  feedTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 15,     // 위아래 간격
    paddingHorizontal: 15,  // 왼쪽 간격
    backgroundColor: COLOR.COMM_WHITE,
  },
  feedTypeBtn: {
    fontSize: 12,
    borderRadius: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

});