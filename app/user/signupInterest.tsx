import React, { useEffect, useMemo, useState } from "react";
import CommBottomButton from "@/components/CommBottomButton";
import { useAuth } from "@/hooks/queries/useAuth";
import { CodeInfo, SignupInfo } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import CommHeader from "@/components/CommHeader";
import { getCategoryList } from "@/utils/commUtil";
import { COLOR } from "@/constants";

/**
 * 회원가입 - 관심분야 선택
 */
export default function SignupInterestScreen() {
  const { signupMutation } = useAuth();
  const { signupInfo } = useLocalSearchParams<{ signupInfo: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryList, setCategoryList]   = useState<CodeInfo[]>([]);

  // 이전 화면에서 가져온 회원정보
  const parsedSignupInfo = useMemo(() => {
    return JSON.parse(signupInfo) as SignupInfo;
  }, [signupInfo]);
  const signupForm = useForm<SignupInfo>({
    defaultValues: parsedSignupInfo
  });

  useEffect(() => {
    const fetchData = async () => {
      // SecureStore에서 카테고리 코드 목록 가져오기
      setCategoryList(await getCategoryList());
    }

    fetchData();
  }, []);

  const selectedCategoryIds = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return selectedCategory.split('|').filter(Boolean);
  }, [selectedCategory]);

  const toggleSelect = (item: CodeInfo) => {
    setSelectedCategory((prev) => {
      const currentIds = prev ? prev.split('|').filter(Boolean) : [];
      const isAlreadySelected = currentIds.includes(item.code_id);

      const nextIds = isAlreadySelected
        ? currentIds.filter((codeId) => codeId !== item.code_id)
        : [...currentIds, item.code_id];

      return nextIds.join('|');
    });
  };

  const onSubmit = () => {
    if (selectedCategoryIds.length < 2) {
      alert("관심분야를 최소 2개 이상 선택해주세요.");
      return;
    }
    parsedSignupInfo.mem_interest = selectedCategory;
    signupMutation.mutate(parsedSignupInfo);
  };

  return (
    <View style={styles.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="회원 가입"/>
      <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
        <FormProvider {...signupForm}>
          <Text style={styles.title}>관심분야</Text>
          <Text style={styles.subtitle}>
            관심있는 취미가 우선적으로 보여져요 {"\n"}(최소 2개)
          </Text>

          {categoryList.map((category, idx) => (
            <View key={idx} style={styles.categoryBox}>
              <Text style={styles.categoryTitle}>{category.code_value}</Text>
              <View style={styles.buttonGroup}>
                {category.sub_list?.map((item) => {
                  const isSelected = selectedCategoryIds.includes(item.code_id);
                  return (
                    <TouchableOpacity
                      key={item.code_id}
                      style={[
                        styles.itemButton,
                        isSelected && styles.itemButtonSelected,
                      ]}
                      onPress={() => toggleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.itemText,
                          isSelected && styles.itemTextSelected,
                        ]}
                      >
                        {item.code_value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

        </FormProvider>
      </ScrollView>
      <CommBottomButton label="회원가입" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex            : 1,
    backgroundColor : COLOR.COMM_WHITE,
  },
  title: {
    fontSize            : 23,
    fontWeight          : "700",
    color               : COLOR.TEXT_DEFAULT,
    textAlign           : "left",
    marginTop           : 20,
    marginBottom        : 10,
    marginHorizontal    : 20,
  },
  subtitle: {
    textAlign           : "left",
    color               : COLOR.COMM_GRAY_7,
    marginBottom        : 22,
    marginHorizontal    : 20,
    fontSize            : 16,
    lineHeight          : 28,
  },
  categoryBox: {
    backgroundColor     : COLOR.COMM_GRAY_5,
    borderRadius        : 12,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    padding             : 12,
    marginBottom        : 14,
    marginHorizontal    : 16,
  },
  categoryTitle: {
    fontSize            : 18,
    fontWeight          : "bold",
    color               : COLOR.TEXT_DEFAULT,
    marginBottom        : 12,
  },
  buttonGroup: {
    flexDirection       : "row",
    flexWrap            : "wrap",
    justifyContent      : "space-between",
    gap                 : 10,
  },
  itemButton: {
    paddingHorizontal   : 8,
    paddingVertical     : 5,
    borderWidth         : 1,
    borderColor         : COLOR.COMM_GRAY_6,
    borderRadius        : 8,
    justifyContent      : "center",
    alignItems          : "center",
    backgroundColor     : COLOR.COMM_WHITE,
  },
  itemButtonSelected: {
    borderColor         : COLOR.APP_ACTIVE_5,
  },
  itemText: {
    color               : COLOR.COMM_GRAY_7,
    fontSize            : 16,
    fontWeight          : "regular",
  },
  itemTextSelected: {
    color               : COLOR.APP_ACTIVE_5,
    fontWeight          : "regular",
  },
});