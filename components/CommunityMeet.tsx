import { COLOR } from '@/constants';
import React from 'react';
import { MyMeetInfo} from '@/types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import BtnLikeDefault from '@/assets/images/btn_like_default.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';

const { width } = Dimensions.get('window');


interface communityMeetProps {
  data: MyMeetInfo;
}

export default function CommunityMeet({data}: communityMeetProps) {
  // ✅ 현재 경로를 가져옵니다.
  const pathname = usePathname();  
  // ✅ 클릭 핸들러 함수
  const handlePress = () => {
    // 현재 경로가 이미 'chooseMeet'을 포함하고 있다면 이동하지 않음
    if (!pathname.includes('chooseMeet')) {
      return; 
    }

    router.push({
      pathname: '/communities/writeFeedback',
      params: { data: JSON.stringify(data) },
    });
  };

  return (
        <View style={styles.recommendContainer}>
            <TouchableOpacity onPress={handlePress}
            activeOpacity={pathname.includes('writeFeedback') ? 1 : 0.7} // 이미 그 페이지면 클릭 피드백 제거
            >
              <View style={styles.recommendListContainer}>
                {/* 추천 소셜링 리스트 (3개) */}
                <View style={styles.recommendItemContainer}>
                  {/* 이미지, 좋아요 버튼 */}
                  <View>
                    <ImageBackground
                      source={data.meet_image_url? { uri: data.meet_image_url } : require('@/assets/testImages/test_recommend_image2.png')}
                      style={styles.recommendItemImage}
                      imageStyle={styles.recommendImage}
                    >
                      <TouchableOpacity
                        style={styles.recommendLikeBtnContainer}>
                        <BtnLikeDefault />
                      </TouchableOpacity>
                    </ImageBackground>
                  </View>
                  <View style={{ marginStart: 10 }}>
                    <View style={styles.recommendTagContainer}>
                      <Text style={styles.recommendTagMeet}>모임</Text>
                      <Text style={styles.recommendTagClub}>클럽</Text>
                      <Text style={styles.recommendTagCategory}>게임</Text>
                    </View>
                    <View style={styles.recommendContentContainer}>
                      <Text style={styles.recommendContentTitle} numberOfLines={1} ellipsizeMode='tail'>{data.meet_name}</Text>
                      <View style={styles.recommendContentInfoContainer}>
                        <IconMarker width={12} height={12} />
                        <Text style={styles.recommendContentText}>{data.place_addr}</Text>
                        <IconMembers width={12} height={12} />
                        <Text style={styles.recommendContentText}>{data.apply_ratio}</Text>
                      </View>
                      <View style={styles.recommendContentInfoContainer}>
                        <Image source={require('@/assets/testImages/test_image_profile.png')} style={{ width: 20, height: 20, borderRadius: 10, marginEnd: 4 }} />
                        <Text style={styles.recommendHostText}>{data.mem_name}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
        </View>
  )
}

const styles = StyleSheet.create({
  // 추천 소셜링 모임
  recommendContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  recommendListContainer: {
    marginTop: 5,
  },
  recommendItemContainer: {
    width: width - 35,
    backgroundColor: COLOR.COMM_GRAY,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
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
    backgroundColor: COLOR.BTN_BORDER,
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
}); 