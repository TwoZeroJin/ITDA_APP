import ArrowRight from '@/assets/images/arrow_right.svg';
import IconMarker from '@/assets/images/icon_marker.svg';
import IconMembers from '@/assets/images/icon_members.svg';
import { COLOR } from '@/constants';
import { MeetInfo } from '@/types';
import { router } from 'expo-router';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface CommUpcomingMeetListProps {
  upcomingMeetList: MeetInfo[];
}

/**
 * 다가오는 모임 리스트 컴포넌트
 */
export default function CommUpcomingMeetList({ upcomingMeetList }: CommUpcomingMeetListProps) {
  const renderGridMeet = ({ item }: { item: MeetInfo }) => (
      <View style={styles.meetCell}>
        <Text style={styles.meetDay}>D-Day</Text>
        <Text style={styles.meetSubTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.meet_name}
        </Text>
        <View style={styles.meetInfoRow}>
          <IconMarker width={12} height={12} />
          <Text style={styles.meetInfoText}>{item.place_addr}</Text>
        </View>
        <View style={styles.meetInfoRow}>
          <IconMembers width={12} height={12} />
          <Text style={styles.meetInfoText}>{item.apply_ratio}</Text>
        </View>
        <View style={styles.meetInfoRow}>
          <Image
            source={require('@/assets/testImages/test_image_profile.png')}
            style={{ width: 20, height: 20, borderRadius: 10, marginEnd: 4 }}
          />
          <Text style={styles.meetHostText}>{item.mem_name}</Text>
        </View>
      </View>
  );

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
                        <Text style={styles.meetDay}>D-Day</Text>
                        <Text style={styles.meetSubTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.meet_name}
                        </Text>
                        <View style={styles.meetInfoRow}>
                        <IconMarker width={12} height={12} />
                        <Text style={styles.meetInfoText}>{item.place_addr}</Text>
                        </View>
                        <View style={styles.meetInfoRow}>
                        <IconMembers width={12} height={12} />
                        <Text style={styles.meetInfoText}>{item.apply_ratio}</Text>
                        </View>
                        <View style={styles.meetInfoRow}>
                        <Image
                            source={require('@/assets/testImages/test_image_profile.png')}
                            style={{ width: 20, height: 20, borderRadius: 10, marginEnd: 4 }}
                        />
                        <Text style={styles.meetHostText}>{item.mem_name}</Text>
                        </View>
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
    fontWeight      : 'bold',
    color           : COLOR.BG_MEET,
  },
  meetSubTitle: {
    fontSize        : 16,
    fontWeight      : 'bold',
    color           : COLOR.TEXT_3C3C3C,
    flexShrink      : 1,
  },
  meetInfoRow: {
    flexDirection   : 'row',
    gap             : 4,
    alignItems      : 'center',
  },
  meetInfoText: {
    fontSize        : 12,
    color           : COLOR.COMM_SHADOW,
  },
  meetHostText: {
    fontSize        : 14,
    fontWeight      : 'bold',
    color           : COLOR.COMM_SHADOW,
  },
  meetCell: {
    width               : width / 2 - 40,
    marginHorizontal    : 6,
    padding             : 12,
    backgroundColor     : COLOR.COMM_WHITE,
    justifyContent      : 'center',
    borderRadius        : 12,
    gap                 : 5,
  },
});