import { COLOR } from "@/constants";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommHeader from "@/components/CommHeader";
import CommBottomButton from "@/components/CommBottomButton";
import { router } from "expo-router";
import { CodeInfo } from "@/types";
import { getCategoryList } from "@/utils/commUtil";
import { useRoute } from "@react-navigation/native";
import { MeetInfo } from "@/types";

/**
 * 모임 생성 - 카테고리 선택 화면
 */
export default function MeetCreateCategoryScreen() {
  const params = useRoute();
  const prevMeetInfo = (params.params ?? {}) as Partial<MeetInfo>;
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    (async () => {
      const categoryList = await getCategoryList();
      setCategoryList(categoryList);
    })();
  }, []);

  const canMoveNext = !!category;

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="모임 생성"/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 소모임 생성 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'만남 주제를 선택해볼까요?'}</Text>
          <Text style={styles.subtitle}>{'모임의 주제를 선택해보세요.'}</Text>
        </View>

        {/* 카테고리 선택 */}
        <View style={styles.commContainer}>

          <View style={styles.categoryContainer}>
            {categoryList.map((item) => {
              const selected = category === item.code_id;

              return (
                <TouchableOpacity
                  key={item.code_id}
                  style={[styles.categoryBox, selected && styles.categoryBoxSelected]}
                  onPress={() => setCategory(item.code_id)}
                >
                  <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{item.code_value}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>

      </ScrollView>

      <CommBottomButton label="다음" onPress={() => canMoveNext && router.push({
            pathname: '/meets/createDesc',
            params: {
              ...prevMeetInfo,
              meet_subj: category,
            } as Partial<MeetInfo>,
          })}
          disabled={!canMoveNext}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex          : 1,
  },
  titleContainer: {
    marginTop     : 12,
    marginBottom  : 5,
    paddingStart  : 16,
  },
  title: {
    fontSize      : 22,
    fontWeight    : 'bold',
    color         : COLOR.COMM_BLACK,
    marginBottom  : 16,
  },
  subtitle: {
    fontSize      : 16,
    color         : COLOR.COMM_GRAY_2,
  },
  commContainerTitle: {
    fontSize      : 20,
    fontWeight    : 'bold', 
    marginBottom  : 8,
  },
  commContainer: {
    marginTop         : 30,
    marginHorizontal  : 16,
    marginBottom      : 30,
    gap               : 16,
  },
  feeContainer: {
    gap               : 14,
  },
  commContainerSubTitle: {
    fontSize      : 14,
    color         : COLOR.TEXT_DEFAULT,
  },
  feeInput: {
    height              : 50,
    borderRadius        : 12,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    paddingHorizontal   : 16,
    fontSize            : 14,
    color               : COLOR.COMM_BLACK,
  },
  categoryContainer: {
    flexDirection   : 'row',
    flexWrap        : 'wrap',
    alignItems      : 'center',
    gap             : 10,
  },
  categoryBox: {
    width           : '30.5%',
    height          : 42,
    borderRadius    : 12,
    borderWidth     : 1,
    borderColor     : COLOR.COMM_GRAY_6,
    justifyContent  : 'center',
    alignItems      : 'center',
    backgroundColor : COLOR.COMM_WHITE,
  },
  categoryBoxSelected: {
    borderColor     : COLOR.APP_ACTIVE_4,
    backgroundColor : COLOR.COMM_WHITE,
  },
  categoryText: {
    fontSize        : 16,
    fontWeight      : '600',
    color           : COLOR.COLOR_323232,
  },
  categoryTextSelected: {
    color           : COLOR.APP_ACTIVE_5,
  },
});