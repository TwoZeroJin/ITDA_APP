import CommHeader from '@/components/CommHeader';
import { COLOR } from '@/constants';
import { ApiResult, CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Noti from '@/assets/images/navi_community.svg';
import BtnLikeDefault from '@/assets/images/btn_like_default.svg';
import IconArrowRightMore from '@/assets/images/icon_arrow_right_more.svg';
import ArrowRight from '@/assets/images/arrow_right.svg';
import SearchButton from '@/assets/images/search_button.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import IconClose from '@/assets/images/icon_close.svg';
import IconCreate from '@/assets/images/icon_create.svg';

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

  const getTimeOfDay = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 18) return 'afternoon';
    return 'evening';
  };

  const timeOfDay = getTimeOfDay();
  const greetingImages: Record<string, any> = {
    morning: require('@/assets/images/main_morning.png'),
    afternoon: require('@/assets/images/main_afternoon.png'),
    evening: require('@/assets/images/main_evening.png'),
  };

  const greetingBgSource = greetingImages[timeOfDay] ?? greetingImages.morning;
  const greetingPhrase =
    timeOfDay === 'morning' ? '송소희님, 좋은 아침이에요.' :
    timeOfDay === 'afternoon' ? '송소희님, 좋은 오후예요.' :
    '송소희님, 좋은 저녁이에요.';

  // 카테고리 데이터
  const PAGE_SIZE = 4;
  const pages = [];

  for (let i = 0; i < categoryList.length; i += PAGE_SIZE) {
    pages.push(categoryList.slice(i, i + PAGE_SIZE));
  }
  
  // TEST 데이터
  const recommendPage = [];
  recommendPage.push({
    title : "핫한 소셜링",
    subTitle : "요즘 다 여기서 만나요 👀 지금 참여하기!",
    data :  categoryList.slice(0, 3),
  })

  recommendPage.push({
    title : "핫한 소셜링2",
    subTitle : "요즘 다 여기서 만나요 👀 지금 참여하기!",
    data :  categoryList.slice(0, 3),
  })

  recommendPage.push({
    title : "핫한 소셜링3",
    subTitle : "요즘 다 여기서 만나요 👀 지금 참여하기!",
    data :  categoryList.slice(0, 3),
  })

  const recentSearches = ['보드게임', '등산', '독서', '영화', '요리'];

  // 카테고리 목록 Rendering 함수
  const renderGridCategory = ({ item: pageItems = [] }: { item: CodeInfo[] }) => (
      <View>
          {Array(2).fill(0).map((_, rowIdx) => (
              <View key={rowIdx} style={styles.row}>
                  {pageItems.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, colIdx) => (
                      <View key={colIdx} style={{ alignItems: 'center'}}>
                        <View style={styles.cell}>
                          <Image source={{ uri: item.code_image_url }} style={{ width: 32, height: 25 }} />
                        </View>
                          <Text style={{ marginTop: 6, fontSize: 14, fontWeight: '600', color: COLOR.COMM_BLACK }}>{item.code_value}</Text>
                      </View>
                  ))}
              </View>
          ))}
      </View>
  );

  // 다가오는 모임 리스트 Rendering 함수
  const renderGridMeet = ({ item }: { item: CodeInfo }) => (
      <View>
          {Array(1).fill(0).map((_, rowIdx) => (
              <View key={rowIdx} style={styles.meetCell}>
                <Text style={styles.meetDay}>D-Day</Text>
                <Text style={styles.meetSubTitle} numberOfLines={1} ellipsizeMode='tail'>매주 수요일은 보드게임 열심히 하자!</Text>
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                  <IconMarker width={12} height={12} />
                  <Text style={styles.meetInfoText}>양천구 - 신월 3동</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                  <IconMembers width={12} height={12} />
                  <Text style={styles.meetInfoText}>7/10</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                  <Image source={require('@/assets/testImages/test_image_profile.png')} style={{ width: 20, height: 20, borderRadius: 10, marginEnd: 4 }} />
                  <Text style={styles.meetHostText}>하지예</Text>
                </View>
              </View>
          ))}
      </View>
  );

  // 추천 소셜링 목록 Rendering 함수
  const renderGridRecommend = ({ item: pageItems = { title : '', subTitle : '', data : [] } }: { item: { title : '', subTitle : '', data : [] } }) => (
      <View>
          {Array(1).fill(0).map((item, rowIdx) => (
              <View key={rowIdx}>
                  <View>
                    {/* 추천 소셜링 타이틀 */}
                    <View>
                      <Text style={styles.recommendTitle}>{pageItems['title']}</Text>
                      <Text style={styles.recommendSubTitle}>{pageItems['subTitle']}</Text>
                    </View>
                    {pageItems['data'].map((item2, colIdx) => (
                      <View key={colIdx} style={styles.recommendListContainer}>
                      {/* 추천 소셜링 리스트 (3개) */}
                        <View style={styles.recommendItemContainer}>
                          {/* 이미지, 좋아요 버튼 */}
                          <View>
                            <ImageBackground 
                              source={require('@/assets/testImages/test_recommend_image2.png')}
                              style={styles.recommendItemImage}
                              imageStyle={styles.recommendImage}
                            >
                              <TouchableOpacity
                                style={styles.recommendLikeBtnContainer}>
                                <BtnLikeDefault/>
                              </TouchableOpacity>
                            </ImageBackground>
                          </View>
                          <View style={{ marginStart : 10 }}>
                            <View style={styles.recommendTagContainer}>
                              <Text style={styles.recommendTagMeet}>모임</Text>
                              <Text style={styles.recommendTagClub}>클럽</Text>
                              <Text style={styles.recommendTagCategory}>게임</Text>
                            </View>
                            <View style={styles.recommendContentContainer}>
                              <Text style={styles.recommendContentTitle} numberOfLines={1} ellipsizeMode='tail'>환승연애 같이 봐요!</Text>
                              <View style={styles.recommendContentInfoContainer}>
                                <IconMarker width={12} height={12} />
                                <Text style={styles.recommendContentText}>양천구 - 신월동</Text>
                                <IconMembers width={12} height={12} />
                                <Text style={styles.recommendContentText}>7/15</Text>
                              </View>
                              <View style={styles.recommendContentInfoContainer}>
                                <Image source={require('@/assets/testImages/test_image_profile.png')} style={{ width: 20, height: 20, borderRadius: 10, marginEnd: 4 }} />
                                <Text style={styles.recommendHostText}>하지예</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                  
              </View>
          ))}
      </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <CommHeader/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
        {/*  인사말 섹션  */}
        <View style={styles.greetingContainer}>
          {/* {timeOfDay == 'morning' && <MainMorning />}
          {timeOfDay == 'afternoon' && <MainAfternoon />}
          {timeOfDay == 'evening' && <MainEvening />} */}

          <ImageBackground 
            source={greetingBgSource}
             style={styles.greetingImage}
             imageStyle={{ resizeMode: 'cover' }}
           />
          <Text style={styles.greetingTitle}>{greetingPhrase}</Text>
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

        {/* 검색, 카테고리 섹션 */}
        <View style={[styles.container, {marginTop: 30, paddingTop: 30, flex : 1, paddingHorizontal: 16}]}>
          {/* 검색 조건 부분 */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchText}>참여하고 싶은 모임이나 클럽을 검색해 보세요.</Text>
            <TouchableOpacity
              // onPress={() => router.push('/search')}
              >
              <SearchButton width={20} height={20}/>
            </TouchableOpacity>

          </View>
          {/* 최근 검색어 */}
          <View style={styles.recentSearchContainer}>
            <FlatList
              data={recentSearches}
              renderItem={({ item }) => (
                <View style={styles.recentSearchItem}>
                  <TouchableOpacity
                    // onPress={() => handleSearch(item)}
                  >
                    <Text style={styles.recentSearchText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    // onPress={() => handleRemoveRecentSearch(item)}
                  >
                    <IconClose width={12} height={12} style={{ marginStart: 4 }} />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          {/*  카테고리 목록 */}
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 12 }}>카테고리</Text>
            <FlatList<CodeInfo[]>
                data={pages}
                renderItem={renderGridCategory}
                keyExtractor={(_, idx) => String(idx)}
                horizontal
                decelerationRate='fast'
                showsHorizontalScrollIndicator={false}
              />
          </View>

        </View>

        <View style={{ height: 10, backgroundColor: COLOR.COMM_GRAY_4 }} />

        {/* 추천 소셜링 섹션 */}
        <View style={styles.recommendContainer}>
          <FlatList<{ title : string, subTitle : string, data : [] }>
                data={recommendPage}
                renderItem={renderGridRecommend}
                keyExtractor={(_, idx) => String(idx)}
                horizontal
                decelerationRate='fast'
                showsHorizontalScrollIndicator={false}
              />

          {/* 더보기 버튼 */}
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: COLOR.COMM_WHITE,
                flexDirection: 'row',
                borderRadius: 25,
                width : '100%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLOR.COMM_GRAY_2, marginEnd : 5 }}>더보기</Text>
              <IconArrowRightMore width={12} height={12}/>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Floating 버튼 (화면에 고정) */}
      <TouchableOpacity
        style={styles.floatingButton}
        activeOpacity={0.85}
        onPress={() => router.push('/meets/createType')}
      >
        <IconCreate width={54} height={54} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.COMM_WHITE,
  },
  greetingContainer: {
    width: '100%',
    height: 390,
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
  // 다가올 모임 리스트
  meetContainer: {
    height: 170,
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
    marginStart: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetDay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR.BG_MEET,
  },
  meetSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.TEXT_3C3C3C,
    flexShrink: 1,
  },
  meetInfoText: {
    fontSize: 12,
    color: COLOR.COMM_SHADOW,
  },
  meetHostText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR.COMM_SHADOW,
  },
  meetCell: {
    width: width / 2 - 40,
    marginHorizontal: 6,
    padding: 12,
    backgroundColor: COLOR.COMM_WHITE,
    justifyContent: 'center',
    borderRadius: 12,
    gap: 5,
  },
  // 카테고리 목록
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cell: {
    width: 64,
    height: 64,
    marginHorizontal: 10,
    backgroundColor: COLOR.COMM_GRAY_5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  // 검색 섹션
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
  recentSearchContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 32,
  },
  recentSearchItem: {
    backgroundColor: COLOR.COMM_GRAY,
    borderRadius: 20,
    paddingHorizontal: 10,
    color: COLOR.TEXT_DEFAULT,
    marginEnd: 6,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  recentSearchText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLOR.COMM_SHADOW,
  },
  // 추천 소셜링 모임
  recommendContainer: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  recommendTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.TEXT_TITLE,
  },
  recommendSubTitle: {
    fontSize: 14,
    color: COLOR.TEXT_2F2F2F,
    marginTop: 4,
  },
  recommendListContainer: {
    marginTop: 16,
  },
  recommendItemContainer: {
    width: '95%',
    backgroundColor: COLOR.COMM_WHITE,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    marginEnd: 30,
  },
  recommendItemImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  recommendImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendLikeBtnContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 35,
    height: 35, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  recommendTagContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  recommendTagMeet: {
    fontSize: 12,
    borderRadius: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: COLOR.COMM_WHITE,
    backgroundColor: COLOR.BG_MEET,
  },
  recommendTagClub: {
    fontSize: 12,
    borderRadius: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: COLOR.TEXT_31AD69,
    backgroundColor: COLOR.BG_CLUB,
  },
  recommendTagCategory: {
    fontSize: 12,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: COLOR.COMM_SHADOW,
    backgroundColor: COLOR.BG_CATEGORY,
  },
  recommendContentContainer: {
    gap: 4,
  },
  recommendContentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recommendContentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.TEXT_3C3C3C,
  },
  recommendContentText: {
    fontSize: 12,
    marginStart: -8,
    color: COLOR.COMM_SHADOW,
  },
  recommendHostText: {
    fontSize: 14,
    marginStart: -8,
    fontWeight: 'bold',
    color: COLOR.COMM_SHADOW,
  },
  floatingButton: {
    position: 'absolute',
    right: 16,
    bottom: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    zIndex: 20,
  },
});