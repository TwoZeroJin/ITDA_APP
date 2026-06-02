import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import IconProfileDefault from '@/assets/images/icon_profile_default.svg';
import { COLOR } from '@/constants';

interface ProfileIconProps {
  mem_image_url?: string;
  type?: 'HOST' | 'MEMBER';
}

const ProfileIcon = ({ mem_image_url, type }: ProfileIconProps) => {
  // 모임장이 아닌 경우
  if (type === 'MEMBER') {
    return (
      <View style={styles.memberItem}>
        {mem_image_url ? (
          <Image source={{ uri: mem_image_url }} style={styles.memberImage} />
        ) : (
          <IconProfileDefault width={60} height={60} />
        )}
      </View>
    );
  } else {
    // 모임장인 경우
    return (
      // <View style={styles.hostContainer}>
        <View style={styles.hostImageWrapper}>
          <View style={styles.hostImageFrame}>
            {mem_image_url ? (
              <Image 
                source={{ uri: mem_image_url }} 
                style={styles.hostImage}
              />
            ) : (
              // 💡 스타일을 제거하고 프레임 중앙에 원형 아이콘이 딱 맞게 들어가도록 크기를 56(60에서 테두리 뺀 크기) 정도로 맞춰줍니다.
              <IconProfileDefault width={60} height={60} />
            )}
          </View>
          <View style={styles.crownBadge}>
            <MaterialCommunityIcons name="crown" size={14} color="#fff" />                    
          </View>
        </View>

    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontWeight: '700',
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostImageWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
    marginRight: 12,
  },
  hostImageFrame: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FF5A5F',
    overflow: 'hidden',
    backgroundColor: '#fff',
    // 💡 아래 세 줄을 추가하여 프레임 내부 컴포넌트(아이콘 등)가 정중앙에 오도록 정렬합니다.
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostImage: {
    width: '100%',
    height: '100%',
  },
  crownBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF5A5F',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
    elevation: 4,
  },
  hostInfo: {
    marginLeft: 15,
  },
  hostName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  hostGreeting: {
    fontSize: 14,
    color: '#888',
  },
  memberListContent: {
    alignItems: 'center',
  },
  memberItem: {
    marginRight: 12,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor:COLOR.COMM_GRAY_6,
    borderWidth: 1,
  },
});

export default ProfileIcon;