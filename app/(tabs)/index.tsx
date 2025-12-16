import CommHeader from '@/components/CommHeader';
import { COLOR } from '@/constants';
import { ApiResult, CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Noti from '@/assets/images/navi_community.svg';
import ArrowRight from '@/assets/images/arrow_right.svg';
import SearchButton from '@/assets/images/search_button.svg';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);
  const [value, setValue] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // SecureStore에서 카테고리 코드 목록 가져오기
      setCategoryList(await getCategoryList());
    }

    fetchData();
  }, []);


   const PAGE_SIZE = 4;
   const pages = [];

   for (let i = 0; i < categoryList.length; i += PAGE_SIZE) {
       pages.push(categoryList.slice(i, i + PAGE_SIZE));
   }

  // 카테고리 목록 Rendering 함수
  const renderGridCategory = ({ item: pageItems = [] }: { item: CodeInfo[] }) => (
      <View>
          {Array(2).fill(0).map((_, rowIdx) => (
              <View key={rowIdx} style={styles.row}>
                  {pageItems.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, colIdx) => (
                      <View key={colIdx} style={styles.cell}>
                          <Image source={{ uri: item.code_image_url }} style={{ width: 50, height: 50 }} />
                          <Text>{item.code_value}</Text>
                      </View>
                  ))}
              </View>
          ))}
      </View>
  );

  const renderGridMeet = ({ item }: { item: CodeInfo }) => (
      <View>
          {Array(1).fill(0).map((_, rowIdx) => (
              <View key={rowIdx} style={styles.meetCell}>
                <Text>D-Day</Text>
                <Text>매주 수요일은 보드...</Text>
                <Text>양천구 - 신월 3동</Text>
                <Text>7/10</Text>
                <Text>하지예</Text>
              </View>
          ))}
      </View>
  );

  console.log('categoryList : ', categoryList);

  return (
    <>
      <CommHeader/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
        {/*  인사말 섹션  */}
        <View style={styles.greetingContainer}>
          <ImageBackground 
            source={require('@/assets/images/home_morning.png')} 
            style={styles.greetingImage}
            imageStyle={{ resizeMode: 'cover' }}
          />
          <Text style={styles.greetingTitle}>송소희 님 좋은 아침이에요.</Text>
          <Text style={styles.greetingMessage}>오늘 하루도 주님의 은혜가 가득하길</Text>

          {/* Noti 알림판 */}
          <View style={styles.notiContainer}>
            <Noti width={12} height={13}/>
            <Text style={styles.notiMessage}>잇다에서 공지사항을 등록했어요.</Text>
          </View>
        </View>

        {/* 다가오는 모임 리스트 섹션 */}
        <View style={styles.meetContainer}>

          {/* 타이틀 */}
          <View style={styles.meetTitleContainer}>
            <Text style={styles.meetTitle}>다가오는 모임 리스트</Text>
            <TouchableOpacity
              style={{ height: '100%', justifyContent: 'center', paddingStart: 25}}
              onPress={() => router.push('/meet')}>
              <ArrowRight width={16} height={11}/>
            </TouchableOpacity>
          </View>

          <View style={styles.meetListContainer}>
            <FlatList<CodeInfo>
               data={categoryList}
               renderItem={renderGridMeet}
               keyExtractor={(_, idx) => String(idx)}
               horizontal
               decelerationRate='fast'
               showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        {/* 검색 조건 부분 */}
        <View style={[styles.container, {marginTop: 30, flex : 1, paddingHorizontal: 16}]}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchText}>참여하고 싶은 모임이나 클럽을 검색해 보세요.</Text>
            <TouchableOpacity
              // onPress={() => router.push('/search')}
              >
              <SearchButton width={20} height={20}/>
            </TouchableOpacity>
          </View>
        </View>

        {/*  카테고리 목록 */}
        <View style={styles.container}>
           <FlatList<CodeInfo[]>
               data={pages}
               renderItem={renderGridCategory}
               keyExtractor={(_, idx) => String(idx)}
               horizontal
               decelerationRate='fast'
               showsHorizontalScrollIndicator={false}
            />
         </View>
         
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.COMM_WHITE,
  },
  greetingContainer: {
    width: '100%',
    height: 260,
    marginBottom: 12,
  },
  greetingImage: {
    width: '100%',
    height: '100%',
  },
  greetingTitle: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 2,
    marginStart: 16,
  },
  greetingMessage: {
    position: 'absolute',
    fontSize: 16,
    color: COLOR.TEXT_DEFAULT,
    marginTop: 50,
    marginStart: 16,
  },
  notiContainer: {
    flexDirection: 'row',
    position: 'absolute',
    width: '80%',
    height: 30,
    bottom: 14,
    backgroundColor: COLOR.COMM_WHITE,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 14,
  },
  notiMessage: {
    fontSize: 12,
    color: COLOR.TEXT_DEFAULT,
    marginStart: 6,
  },
  meetContainer: {
    height: 154,
  },
  meetTitleContainer: {
    height : 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  }, 
  meetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  meetListContainer: {
    height: '80%',
    marginStart: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cell: {
     width: width / 2 - 40,
     height: 100,
     marginHorizontal: 10,
     backgroundColor: COLOR.COMM_WHITE,
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 12,
   },
  meetCell: {
    width: width / 2 - 40,
    height: 100,
    marginHorizontal: 6,
    backgroundColor: COLOR.COMM_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  searchContainer: {
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: COLOR.APP_ACTIVE_3,
    borderWidth: 2,
    borderRadius: 25,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  searchText: {
    fontSize: 14,
    color: COLOR.COMM_GRAY_2,
  },
});