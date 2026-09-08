import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLOR } from '@/constants';
import ProfileIcon from '@/components/ProfileIcon';
import { router } from "expo-router";

interface MemberItem {
  mem_id?           : number | string;
  mem_image_url?    : string;
  host_yn?          : 'Y' | 'N' | string;
}

interface HostMemberSectionProps {
  hostMemId?    : number | string;
  hostImageUrl? : string;
  hostName?     : string;
  hostInfo?     : string | null;
  members?      : MemberItem[];
}

/**
 * 참여한 회원 목록 공통 컴포넌트
 */
export default function HostMemberSection({ hostMemId, hostImageUrl, hostName, hostInfo, members = [] }: HostMemberSectionProps) {
  return (
    <View style={styles.membersContainer}>
      <View style={styles.membersSection}>
        <Text style={styles.membersSectionTitle}>모임장 소개</Text>
        <View style={styles.hostContainer}>
          <ProfileIcon
            mem_id={hostMemId}
            mem_image_url={hostImageUrl || ''}
            type="HOST"
            profileInfo={{
              mem_id: Number(hostMemId ?? 0),
              mem_nick: hostName,
              mem_image_url: hostImageUrl,
            }}
          />
          <View>
            <Text style={styles.hostName}>{hostName}</Text>
            {Boolean(hostInfo) && <Text style={styles.hostInfo}>{hostInfo}</Text>}
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.membersSectionTitle}>참여 멤버</Text>
        <FlatList
          data={members}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item?.mem_id?.toString() ?? String(index)}
          contentContainerStyle={styles.memberListContent}
          renderItem={({ item }) => (
            <ProfileIcon
              mem_id={item?.mem_id}
              mem_image_url={item?.mem_image_url || ''}
              type={item.host_yn === 'Y' ? 'HOST' : 'MEMBER'}
              profileInfo={item}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  membersContainer: {
    flex              : 1,
    paddingHorizontal : 16,
    paddingVertical   : 10,
  },
  membersSection: {
    marginBottom      : 20,
  },
  membersSectionTitle: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Light',
    color             : COLOR.TEXT_DEFAULT,
    marginBottom      : 8,
  },
  memberListContent: {
    alignItems        : 'center',
    marginBottom      : 20,
  },
  hostContainer: {
    flexDirection     : 'row',
    alignItems        : 'center',
  },
  hostName: {
    fontSize          : 16,
    fontFamily        : 'Pretendard-Bold',
    color             : COLOR.COLOR_323232,
  },
  hostInfo: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.COLOR_838383,
  },
});