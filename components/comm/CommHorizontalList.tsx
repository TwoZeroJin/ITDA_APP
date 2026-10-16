import CommCard from '@/components/comm/CommCard';
import { COLOR } from '@/constants';
import { GroupInfo, MeetInfo } from '@/types';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMemberLike } from '@/hooks/queries/useMember';
import { router } from 'expo-router';

interface SectionItem {
  key       : string;
  title     : string;
  subTitle  : string;
  data      : MeetInfo[] | GroupInfo[];
}

interface CommHorizontalListProps {
  sections  : SectionItem[];
  isMember? : boolean;
}

/**
 * 공통 커뮤니티 리스트 컴포넌트
 */
export default function CommHorizontalList({ sections, isMember = false }: CommHorizontalListProps) {
  const memberLike = useMemberLike();
  const { width } = Dimensions.get('window');

  // 좋아요 처리
  const handleLikePress = (item: MeetInfo | GroupInfo) => {
    const isMeet = 'meet_id' in item;
    const targetId = isMeet ? item.meet_id : item.group_id;
    const targetType = isMeet ? 'M' : 'G';

    memberLike.mutate(
      {
        target_id   : targetId,
        target_type : targetType,
        flag        : item.like_yn === 'N',
      },
      {
        onSuccess: () => {
          item.like_yn = item.like_yn === 'Y' ? 'N' : 'Y';
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <View key={section.key} style={styles.sectionContainer}>
          <View>
            <Text style={styles.title}>{section.title}</Text>
            <Text style={styles.subTitle}>{section.subTitle}</Text>
          </View>
          {section.data?.length ? (
            section.data.map((item2, colIdx) => (
              <View key={colIdx} style={[styles.listContainer, { width: width - 32 }]}>
                <CommCard
                  item={item2}
                  onLikePress={(item) => handleLikePress(item)}
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>{section.title}이 없습니다</Text>
          )}
        </View>
      ))}

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity 
          style={styles.moreButton} 
          activeOpacity={0.6}
          onPress={() => router.navigate(`${isMember ? '/mypage/historyList' : '/meet'}`)}
        >
          <Text style={styles.moreButtonText}>더보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding           : 16,
  },
  sectionContainer: {
    width             : '100%',
    marginBottom      : 16,
  },
  title: {
    fontSize          : 20,
    fontFamily        : 'Pretendard-SemiBold',
    color             : COLOR.TEXT_1C1C1C,
    lineHeight        : 21,
  },
  subTitle: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_2F2F2F,
    lineHeight        : 21,
    marginTop         : 4,
  },
  listContainer: {
    marginTop         : 16,
  },
  emptyText: {
    marginTop         : 30,
    marginBottom      : 10,
    fontSize          : 14,
    color             : COLOR.TEXT_GRAY,
    alignSelf         : 'center',
  },
  moreButton: {
    justifyContent    : 'center',
    alignItems        : 'center',
    flexDirection     : 'row',
    marginTop         : 20,
    backgroundColor   : COLOR.COMM_WHITE,
    borderWidth       : 2,
    borderColor       : COLOR.COMM_GRAY_5,
    borderRadius      : 25,
    width             : '100%',
    height            : 50,
  },
  moreButtonText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    marginEnd         : 5,
    color             : COLOR.COLOR_323232,
  },
});