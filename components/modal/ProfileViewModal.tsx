import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IconProfileDefault from '@/assets/images/icon_profile_default.svg';
import { COLOR } from '@/constants';
import { MemberInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';

const MAX_VISIBLE_INTERESTS = 7;
const GENDER_LABEL: Record<string, string> = { M: '남', F: '여' };

interface ProfileViewModalProps {
  visible       : boolean;
  profileInfo?  : MemberInfo;
  onClose       : () => void;
  onChatPress?  : (profileInfo: MemberInfo) => void;
}

/**
 * 회원 프로필 확인 모달
 */
export default function ProfileViewModal({ visible, profileInfo, onClose, onChatPress }: ProfileViewModalProps) {
  const [interestLabels, setInterestLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!visible || !profileInfo?.mem_interest) {
      setInterestLabels([]);
      return;
    }

    const interestIds = profileInfo.mem_interest.split('|').filter(Boolean);
    getCategoryList().then((categoryList) => {
      const subCategoryList = categoryList.flatMap((cat) => cat.sub_list ?? []);
      const matched = interestIds
        .map((id) => subCategoryList.find((cat) => cat.code_id === id)?.code_value)
        .filter((label): label is string => !!label);
      setInterestLabels(matched);
    });
  }, [visible, profileInfo?.mem_interest]);

  if (!profileInfo) {
    return null;
  }

  const birthYear = profileInfo.mem_birth?.match(/^(\d{4})/)?.[1];
  const ageLabel = birthYear ? birthYear.slice(2) : '';
  const genderLabel = profileInfo.mem_gender ? GENDER_LABEL[profileInfo.mem_gender] ?? '' : '';
  const visibleInterests = interestLabels.slice(0, MAX_VISIBLE_INTERESTS);
  const remainingInterestCount = interestLabels.length - visibleInterests.length;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.background}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>프로필 확인</Text>
            <TouchableOpacity style={styles.closeButton} activeOpacity={0.6} onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={COLOR.COMM_BLACK} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.profileImageWrap}>
              {profileInfo.mem_image_url ? (
                <Image source={{ uri: profileInfo.mem_image_url }} style={styles.profileImage} />
              ) : (
                <IconProfileDefault width={60} height={60} />
              )}
            </View>
            <View style={styles.nameWrap}>
              <Text style={styles.nameText}>{profileInfo.mem_nick}</Text>
              <Text style={styles.ageGenderText}>{[ageLabel, genderLabel].filter(Boolean).join('·')}</Text>
            </View>
            {onChatPress && (
              <TouchableOpacity style={styles.chatButton} activeOpacity={0.6} onPress={() => onChatPress(profileInfo)}>
                <Text style={styles.chatButtonText}>채팅</Text>
              </TouchableOpacity>
            )}
          </View>

          {(profileInfo.mem_church_nm || profileInfo.mem_church_tm_nm) && (
            <View style={styles.chipRow}>
              {profileInfo.mem_church_nm && (
                <View style={styles.churchChip}>
                  <Text style={styles.churchChipText}>{profileInfo.mem_church_nm}</Text>
                </View>
              )}
              {profileInfo.mem_church_tm_nm && (
                <View style={styles.churchChip}>
                  <Text style={styles.churchChipText}>{profileInfo.mem_church_tm_nm}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.interestSection}>
            <Text style={styles.interestTitle}>관심 취미</Text>
            {visibleInterests.length > 0 ? (
              <View style={styles.chipRow}>
                {visibleInterests.map((label) => (
                  <View key={label} style={styles.interestChip}>
                    <Text style={styles.interestChipText}>{label}</Text>
                  </View>
                ))}
                {remainingInterestCount > 0 && (
                  <View style={styles.interestChip}>
                    <Text style={styles.interestChipText}>{`+${remainingInterestCount}`}</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.interestEmptyText}>등록된 관심 취미가 없습니다.</Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex                : 1,
    backgroundColor     : COLOR.COMM_MODAL_BG,
    justifyContent      : 'center',
    alignItems          : 'center',
    paddingHorizontal    : 20,
  },
  container: {
    width               : '100%',
    backgroundColor     : COLOR.COMM_WHITE,
    borderRadius        : 16,
    padding             : 24,
  },
  header: {
    flexDirection       : 'row',
    alignItems          : 'center',
    justifyContent      : 'center',
    marginBottom        : 20,
  },
  headerTitle: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.COMM_BLACK,
  },
  closeButton: {
    position            : 'absolute',
    right               : 0,
  },
  profileRow: {
    flexDirection       : 'row',
    alignItems          : 'center',
  },
  profileImageWrap: {
    width               : 60,
    height              : 60,
    borderRadius        : 30,
    overflow            : 'hidden',
    backgroundColor     : COLOR.COMM_GRAY_5,
    justifyContent      : 'center',
    alignItems          : 'center',
  },
  profileImage: {
    width               : 60,
    height              : 60,
    borderRadius        : 30,
  },
  nameWrap: {
    flex                : 1,
    flexDirection       : 'row',
    alignItems          : 'baseline',
    gap                 : 8,
    marginStart         : 14,
  },
  nameText: {
    fontSize            : 18,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.COMM_BLACK,
  },
  ageGenderText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
  },
  chatButton: {
    backgroundColor     : COLOR.APP_ACTIVE_5,
    paddingHorizontal   : 18,
    paddingVertical     : 8,
    borderRadius        : 20,
  },
  chatButtonText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.COMM_WHITE,
  },
  chipRow: {
    flexDirection       : 'row',
    flexWrap            : 'wrap',
    gap                 : 8,
    marginTop           : 16,
  },
  churchChip: {
    borderWidth         : 1,
    borderColor         : COLOR.COLOR_E6E6E6,
    borderRadius        : 16,
    paddingHorizontal   : 14,
    paddingVertical     : 6,
  },
  churchChipText: {
    fontSize            : 13,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.TEXT_DEFAULT,
  },
  interestSection: {
    marginTop           : 24,
  },
  interestTitle: {
    fontSize            : 15,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.COMM_BLACK,
  },
  interestChip: {
    backgroundColor     : COLOR.COMM_GRAY_5,
    borderRadius        : 16,
    paddingHorizontal   : 14,
    paddingVertical     : 6,
  },
  interestChipText: {
    fontSize            : 13,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.TEXT_DEFAULT,
  },
  interestEmptyText: {
    fontSize            : 13,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
    marginTop           : 10,
  },
});
