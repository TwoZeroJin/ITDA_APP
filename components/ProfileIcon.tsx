import { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import IconProfileDefault from '@/assets/images/icon_profile_default.svg';
import IconHost from '@/assets/images/icon_host.svg';
import { COLOR } from '@/constants';
import { MemberInfo } from '@/types';
import ProfileViewModal from '@/components/modal/ProfileViewModal';

interface ProfileIconProps {
  mem_image_url?: string;
  type?: 'HOST' | 'MEMBER';
  mem_id?: number | string;
  profileInfo?: MemberInfo;
  onChatPress?: (profileInfo: MemberInfo) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * 사용자 프로필 아이콘
 */
const ProfileIcon = ({ mem_image_url, type, mem_id, profileInfo, onChatPress, containerStyle }: ProfileIconProps) => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const targetMemId = Number(mem_id ?? profileInfo?.mem_id ?? 0);
  const effectiveProfileInfo: MemberInfo = profileInfo ?? {
    mem_id: targetMemId,
    mem_image_url,
  };

  const image = (
    // 모임장이 아닌 경우
    type === 'MEMBER' ? (
      <View style={[styles.memberItem, containerStyle]}>
        {mem_image_url ? (
          <Image source={{ uri: mem_image_url }} style={styles.memberImage} />
        ) : (
          <IconProfileDefault width={40} height={40} />
        )}
      </View>
    ) : (
      // 모임장인 경우
      <View style={styles.memberItem}>
        <View style={styles.hostImageFrame}>
          {mem_image_url ? (
            <Image 
              source={{ uri: mem_image_url }} 
              style={styles.memberImage}
            />
          ) : (
            <IconProfileDefault width={40} height={40} />
          )}
        </View>
        <View style={styles.crownBadge}>
          <IconHost />                    
        </View>
      </View>
    )
  );

  return (
    <>
      <TouchableOpacity activeOpacity={0.6} onPress={() => targetMemId > 0 && setIsProfileModalVisible(true)}>
        {image}
      </TouchableOpacity>
      {isProfileModalVisible && (
        <ProfileViewModal
          visible={isProfileModalVisible}
          memId={targetMemId}
          profileInfo={effectiveProfileInfo}
          onClose={() => setIsProfileModalVisible(false)}
          onChatPress={onChatPress}
        />
      )}
    </>
  );
};


const styles = StyleSheet.create({
  memberItem: {
    position          : 'relative',
    width             : 40,
    height            : 40,
    marginEnd         : 12,
  },
  hostImageFrame: {
    width             : 40,
    height            : 40,
    borderRadius      : 20,
    borderWidth       : 1,
    borderColor       : COLOR.APP_ACTIVE_5,
    overflow          : 'hidden',
    justifyContent    : 'center',
    alignItems        : 'center',
  },
  memberImage: {
    width             : 40,
    height            : 40,
    borderRadius      : 20,
  },
  crownBadge: {
    position          : 'absolute',
    bottom            : -2,
    right             : -2,
    width             : 18,
    height            : 18,
    borderRadius      : 9,
    justifyContent    : 'center',
    alignItems        : 'center',
    zIndex            : 10,
    elevation         : 4,
  },
});

export default ProfileIcon;