import CommHeader from '@/components/comm/CommHeader';
import CreateFloatingButton from '@/components/comm/CreateFloatingButton';
import { COLOR } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import ClubLayout from './clubLayout';
import SocialClassLayout from './socialClassLayout';


export default function Meet() {
  const [activeType, setActiveType] = useState<'social' | 'club' | 'class'>('social');
  const activeTypeLabel = activeType === 'social' ? '소셜링' : activeType === 'club' ? '클럽' : '클래스';
  const [refreshing, setRefreshing] = useState(false);
  const [myMemId, setMyMemId] = useState<number>(0);
  const renderButton = (label: string, type: 'social' | 'club' | 'class') => {
  const isActive = activeType === type;
    return (
      <TouchableOpacity 
        style={styles.tabButton}
        activeOpacity={0.6}
        onPress={() => setActiveType(type)} 
      >
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {label}
        </Text>
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <CommHeader isNoti={true} isSetting={false} isLike={true} />
      {/* 사진 상단의 탭 바 (소셜링, 클럽, 클래스 느낌) */}
      <View style={styles.tabContainer}>
        {renderButton('소셜링', 'social')}
        {renderButton('클럽', 'club')}
        {renderButton('클래스', 'class')}
      </View>

      {/* activeType에 따라 다른 리스트 컴포넌트 출력 */}
      {activeType === 'club' ? (
        <ClubLayout />
      ) : (
        <SocialClassLayout activeType={activeType} />
      )}      

      {/* 사진 우측 하단의 플로팅 글쓰기 버튼 */}
      <CreateFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // 사진처럼 약간 밝은 회색 배경
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR.COMM_WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    justifyContent: 'flex-start', 
    paddingHorizontal: 16, // 전체적인 왼쪽 여백    
  },
  tabButton: {
    // ✅ flex: 1을 제거해야 왼쪽으로 정렬됩니다.
    alignItems: 'center',
    paddingVertical: 15,
    // ✅ 메뉴 사이의 간격을 조절 (사진처럼 촘촘하게)
    marginRight: 50,
  },
  tabText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999999',
  },
  activeTabText: {
    color: COLOR.APP_ACTIVE_3, // 사진의 포인트 컬러 (주홍/분홍 계열)
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    // ✅ 텍스트 길이에 맞춰 인디케이터 너비 조절
    width: '100%', 
    height: 3,
    backgroundColor: '#FF5A5F',
    borderRadius: 2,
  },
});