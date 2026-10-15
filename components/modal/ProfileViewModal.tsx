import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import IconProfileDefault from '@/assets/images/icon_profile_default.svg';
import { COLOR, COMM_CONSTANTS } from '@/constants';
import { MemberInfo } from '@/types';
import { getCategoryList, getMemberInfo } from '@/utils/commUtil';
import { useProfileDetailView } from '@/hooks/queries/useMember';
import { router } from 'expo-router';
import IconClose from '@/assets/images/icon_close.svg';

const MAX_VISIBLE_INTERESTS = 7;
const GENDER_LABEL: Record<string, string> = { M: '남', F: '여' };

interface ProfileViewModalProps {
  visible       : boolean;
  memId?        : number;
  roomId?       : string;
  profileInfo?  : MemberInfo;
  onClose       : () => void;
  onChatPress?  : (profileInfo: MemberInfo) => void;
}

/**
 * 회원 프로필 확인 모달
 */
export default function ProfileViewModal({ visible, memId, roomId, profileInfo, onClose, onChatPress }: ProfileViewModalProps) {
  const targetMemId = memId ?? Number(profileInfo?.mem_id ?? 0);

  const { results: apiProfile } = useProfileDetailView(
    { mem_id: targetMemId }
  );

  const displayInfo: MemberInfo & { room_id?: string } | undefined = apiProfile ?? profileInfo;

  const [interestLabels, setInterestLabels] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [myMemId, setMyMemId] = useState<number>(0);

    useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await getMemberInfo();
      setMyMemId(memberInfo.mem_id ?? 0);
    }
    fetchMyMemberInfo();
  }, []);

  useEffect(() => {
    if (!visible) {
      setIsExpanded(false);
      setInterestLabels([]);
      return;
    }

    if (!displayInfo?.mem_interest) {
      setInterestLabels([]);
      return;
    }

    const interestIds = displayInfo.mem_interest.split('|').filter(Boolean);
    getCategoryList().then((categoryList) => {
      const subCategoryList = categoryList.flatMap((cat) => cat.sub_list ?? []);
      const matched = interestIds
        .map((id) => subCategoryList.find((cat) => cat.code_id === id)?.code_value)
        .filter((label): label is string => !!label);
      setInterestLabels(matched);
    });
  }, [visible, displayInfo?.mem_interest]);

  if (!displayInfo) {
    return null;
  }

  const birthYear = displayInfo.mem_birth?.match(/^(\d{4})/)?.[1];
  const ageLabel = birthYear ? birthYear.slice(2) : '';
  const genderLabel = displayInfo.mem_gender ? GENDER_LABEL[displayInfo.mem_gender] ?? '' : '';
  const ageGenderStr = [ageLabel, genderLabel].filter(Boolean).join('·');

  const visibleInterests = isExpanded ? interestLabels : interestLabels.slice(0, MAX_VISIBLE_INTERESTS);
  const remainingInterestCount = interestLabels.length - MAX_VISIBLE_INTERESTS;
  const showMoreButton = !isExpanded && remainingInterestCount > 0;

  const handleChatPress = () => {
    if (!displayInfo) return;
    if (onChatPress) {
      onChatPress(displayInfo);
    } else if (displayInfo.mem_id) {
      onClose();
      router.push({
        pathname: '/chats',
        params: {
          room_id   : displayInfo.room_id,
          room_name : displayInfo.mem_nick ?? displayInfo.mem_name,
          room_type : COMM_CONSTANTS.COMM_MEMBER,
          mem_id    : displayInfo.mem_id,
        },
      });
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.background} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => {}}>
          {/* 상단 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>프로필 확인</Text>
            <TouchableOpacity style={styles.closeButton} activeOpacity={0.6} onPress={onClose} hitSlop={10}>
              <IconClose width={20} height={20} />
            </TouchableOpacity>
          </View>

          {/* 프로필 메인 정보 (사진 / 이름·나이성별·교회팀 / 채팅 버튼) */}
          <View style={styles.profileRow}>
            <View style={styles.profileImageWrap}>
              {displayInfo.mem_image_url ? (
                <Image source={{ uri: displayInfo.mem_image_url }} style={styles.profileImage} />
              ) : (
                <IconProfileDefault width={60} height={60} />
              )}
            </View>

            <View style={styles.infoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{displayInfo.mem_nick ?? displayInfo.mem_name}</Text>
                {Boolean(ageGenderStr) && (
                  <Text style={styles.ageGenderText}>{ageGenderStr}</Text>
                )}
              </View>

              {(displayInfo.mem_church_nm || displayInfo.mem_church_tm_nm) && (
                <View style={styles.churchTagRow}>
                  {Boolean(displayInfo.mem_church_nm) && (
                    <View style={styles.churchChip}>
                      <Text style={styles.churchChipText}>{displayInfo.mem_church_nm}</Text>
                    </View>
                  )}
                  {Boolean(displayInfo.mem_church_tm_nm) && (
                    <View style={styles.churchChip}>
                      <Text style={styles.churchChipText}>{displayInfo.mem_church_tm_nm}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {((myMemId !== displayInfo.mem_id) && (displayInfo.room_id !== roomId)) && (
              <TouchableOpacity style={styles.chatButton} activeOpacity={0.6} onPress={handleChatPress}>
                <Text style={styles.chatButtonText}>채팅</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 관심 취미 영역 */}
          <View style={styles.interestSection}>
            <Text style={styles.interestTitle}>관심 취미</Text>
            {visibleInterests.length > 0 ? (
              <View style={styles.chipRow}>
                {visibleInterests.map((label) => (
                  <View key={label} style={styles.interestChip}>
                    <Text style={styles.interestChipText}>{label}</Text>
                  </View>
                ))}
                {showMoreButton && (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setIsExpanded(true)}
                    style={styles.churchChip}
                  >
                    <Text style={styles.churchChipText}>{`+${remainingInterestCount}`}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.interestEmptyText}>등록된 관심 취미가 없습니다.</Text>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex                : 1,
    backgroundColor     : COLOR.COMM_MODAL_BG,
    justifyContent      : 'center',
    alignItems          : 'center',
    paddingHorizontal   : 20,
  },
  container: {
    width               : '100%',
    backgroundColor     : COLOR.COMM_WHITE,
    borderRadius        : 20,
    padding             : 20,
  },
  header: {
    flexDirection       : 'row',
    alignItems          : 'center',
    justifyContent      : 'center',
    marginBottom        : 12,
  },
  headerTitle: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Light',
    color               : COLOR.TEXT_DEFAULT,
  },
  closeButton: {
    position            : 'absolute',
    right               : 0,
  },
  profileRow: {
    flexDirection       : 'row',
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
  infoCol: {
    flex                : 1,
    marginStart         : 12,
    justifyContent      : 'center',
  },
  nameRow: {
    flexDirection       : 'row',
    alignItems          : 'baseline',
    gap                 : 6,
  },
  nameText: {
    fontSize            : 20,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.COMM_BLACK,
  },
  ageGenderText: {
    fontSize            : 15,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_838383,
  },
  churchTagRow: {
    flexDirection       : 'row',
    flexWrap            : 'wrap',
    gap                 : 6,
    marginTop           : 6,
  },
  churchChip: {
    borderWidth         : 1,
    borderColor         : COLOR.COLOR_D9D9D9,
    borderRadius        : 14,
    paddingHorizontal   : 10,
    paddingVertical     : 3,
    justifyContent      : 'center',
  },
  churchChipText: {
    fontSize            : 12,
    fontFamily          : 'Pretendard-Medium',
    color               : COLOR.COLOR_6B6B6B,
  },
  chatButton: {
    backgroundColor     : COLOR.APP_ACTIVE_4,
    paddingHorizontal   : 16,
    paddingVertical     : 8,
    borderRadius        : 20,
    alignSelf           : 'center',
    marginTop           : -20,
  },
  chatButtonText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Medium',
    color               : COLOR.COMM_WHITE,
  },
  interestSection: {
    marginTop           : 16,
    marginStart         : 4,
  },
  interestTitle: {
    fontSize            : 16,
    fontFamily          : 'Pretendard-SemiBold',
    color               : COLOR.COMM_BLACK,
    marginBottom        : 10,
  },
  chipRow: {
    flexDirection       : 'row',
    flexWrap            : 'wrap',
    gap                 : 8,
  },
  interestChip: {
    backgroundColor     : COLOR.COMM_GRAY_5,
    borderRadius        : 16,
    paddingHorizontal   : 13,
    paddingVertical     : 6,
  },
  interestChipText: {
    fontSize            : 12,
    fontFamily          : 'Pretendard-Medium',
    color               : COLOR.COLOR_6B6B6B,
  },
  interestEmptyText: {
    fontSize            : 13,
    fontFamily          : 'Pretendard-Regular',
    color               : COLOR.COLOR_6B6B6B,
  },
});
