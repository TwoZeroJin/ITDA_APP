import ArrowRight from '@/assets/images/arrow_right.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import { formatRelativeMeetDatetime } from '@/utils/commUtil';
import { router } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MemDefault from '@/assets/images/icon_mem_default.svg';

interface CommUpcomingMeetListProps {
  upcomingMeetList: MeetInfo[];
}

/**
 * 다가오는 모임 리스트 컴포넌트
 */
export default function CommUpcomingMeetList({ upcomingMeetList }: CommUpcomingMeetListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>다가오는 모임 리스트</Text>
        <TouchableOpacity
          style={{ height: '100%', justifyContent: 'center', paddingStart: 25 }}
          onPress={() => router.navigate('/meet')}
        >
          <ArrowRight width={11} height={16} />
        </TouchableOpacity>
      </View>

      {upcomingMeetList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>다가오는 모임이 없습니다</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList<MeetInfo>
            data={upcomingMeetList}
            renderItem={({ item }) => {
              return (
                <View style={styles.meetCell}>
                  <Text style={styles.meetDay}>{formatRelativeMeetDatetime(item.meet_datetime)}</Text>
                  <Text style={styles.meetSubTitle} numberOfLines={1} ellipsizeMode="tail">{item.meet_name}</Text>
                  {item.place_addr && (<View style={styles.meetInfoRow}>
                    <IconMarker width={12} height={12} />
                    <Text style={styles.meetInfoText}>{item.place_addr}</Text>
                  </View>)}
                  {item.apply_ratio && (<View style={styles.meetInfoRow}>
                    <IconMembers width={12} height={12} />
                    <Text style={styles.meetInfoText}>{item.apply_ratio}</Text>
                  </View>)}
                  {item.mem_nick && (<View style={styles.meetInfoRow}>
                    {item.mem_image_url ? (
                        <Image source={{ uri: item.mem_image_url }} style={styles.hostImage} />
                      ) : (
                        <MemDefault width={23} height={23} />
                      )}
                    <Text style={styles.meetHostText}>{item.mem_nick}</Text>
                  </View>)}
                </View>
              );
            }}
            keyExtractor={(item) => String(item.meet_id)}
            horizontal
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding         : 16,
    backgroundColor : COLOR.COMM_GRAY_5,
  },
  titleContainer: {
    flexDirection   : 'row',
    justifyContent  : 'space-between',
    alignItems      : 'center',
    height          : 32,
    marginBottom    : 12,
  },
  title: {
    fontSize        : 20,
    fontWeight      : 'bold',
    fontFamily      : 'Pretendard-SemiBold',
  },
  listContainer: {
    flexDirection   : 'row',
    alignItems      : 'center',
  },
  emptyContainer: {
    justifyContent  : 'center',
    alignItems      : 'center',
    paddingVertical : 32,
  },
  emptyText: {
    fontSize        : 16,
    color           : COLOR.COMM_GRAY_2,
    textAlign       : 'center',
  },
  meetDay: {
    fontSize        : 14,
    fontFamily      : 'Pretendard-SemiBold',
    color           : COLOR.BG_MEET,
  },
  meetSubTitle: {
    fontSize        : 16,
    fontFamily      : 'Pretendard-Medium',
    color           : COLOR.TEXT_3C3C3C,
  },
  meetInfoRow: {
    flexDirection   : 'row',
    alignItems      : 'center',
    marginVertical  : 2,
  },
  meetInfoText: {
    fontSize        : 12,
    fontFamily      : 'Pretendard-Regular',
    color           : COLOR.COMM_SHADOW,
  },
  meetHostText: {
    fontSize        : 14,
    fontFamily      : 'Pretendard-Medium',
    color           : COLOR.COMM_SHADOW,
  },
  meetCell: {
    width               : 160,
    height              : 140,
    marginHorizontal    : 6,
    padding             : 12,
    backgroundColor     : COLOR.COMM_WHITE,
    borderRadius        : 12,
    gap                 : 5,
  },
  hostImage: {
    width             : 20,
    height            : 20,
    borderRadius      : 10,
    marginEnd         : 4,
  },
});