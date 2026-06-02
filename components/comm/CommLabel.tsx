import { COLOR } from "@/constants";
import { getCategoryList } from "@/utils/commUtil";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { CodeInfo } from "@/types";

interface CommLabelProps {
    variant?    : "social" | "club" | "category";
    category?   : string;
}

// 소셜링 라벨 텍스트
function CommLabel({ variant = "social", category = ""} : CommLabelProps) {
    const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);

    useEffect(() => {
        if (variant === "category") {
            getCategoryList().then(setCategoryList);
        }
    }, [variant]);

    let text = "";
    if (variant === "social") {
        text = "소셜링";
    } else if (variant === "club") {
        text = "클럽";
    } else if (variant === "category") {
        const found = categoryList.find(item => item.code_id === category);
        text = found?.code_value ?? category;
    }

    return (
        <Text style={styles[`${variant}`]}>{text}</Text>
    )
}

const baseStyle = {
  fontSize          : 12,
  fontFamily        : "Pretendard-Medium",
  borderRadius      : 10,
  paddingHorizontal : 6,
  paddingVertical   : 5,
};

const styles = StyleSheet.create({
  social: {
    ...baseStyle,
    color           : COLOR.COMM_WHITE,
    backgroundColor : COLOR.BG_MEET,
  },
  club: {
    ...baseStyle,
    color           : COLOR.COLOR_CLUB,
    backgroundColor : COLOR.BG_CLUB,
  },
  category: {
    ...baseStyle,
    color           : COLOR.COMM_SHADOW,
    backgroundColor : COLOR.BG_CATEGORY,
  },
});

export default CommLabel;