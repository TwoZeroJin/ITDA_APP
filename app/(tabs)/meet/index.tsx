import CommHeader from '@/components/comm/CommHeader';
import CommFloatingButton from '@/components/comm/CommFloatingButton';
import TopTabButton from '@/components/comm/TopTabButton';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import ClubLayout from './clubLayout';
import SocialClassLayout from './socialClassLayout';

export default function Meet() {
  const [activeType, setActiveType] = useState<string>('social');
  const tabs: Array<{ label: string; value: string }> = [
    { label: '소셜링', value: 'social' },
    { label: '클럽', value: 'club' },
    // { label: '클래스', value: 'class' },
  ];


  return (
    <View style={styles.container}>
      <CommHeader isNoti={true} isSetting={false} isLike={true} />
      <TopTabButton
        tabs={tabs}
        activeValue={activeType}
        onTabPress={setActiveType}
      />

      {/* activeType에 따라 다른 리스트 컴포넌트 출력 */}
      {activeType === 'club' ? (
        <ClubLayout />
      ) : (
        <SocialClassLayout activeType={activeType} />
      )}      

      {/* 사진 우측 하단의 플로팅 글쓰기 버튼 */}
      <CommFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});