import { COLOR } from "@/constants";
import React from "react";
import { StyleSheet, Text } from "react-native";

interface CommLabelProps {
    variant?    : "social" | "club" | "category";
    category?   : string;
}

// 소셜링 라벨 텍스트
function CommLabel({ variant = "social", category = ""} : CommLabelProps) {
    let text = variant === "social" ? "소셜링" : variant === "club" ? "클럽" : category;
    return (
        <Text style={styles[`${variant}`]}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    marginBottom: 4,
  },
  social: {
    fontSize: 12,
    borderRadius: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: COLOR.COMM_WHITE,
    backgroundColor: COLOR.BG_MEET,
  },
  club: {
    fontSize: 12,
    borderRadius: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: COLOR.TEXT_31AD69,
    backgroundColor: COLOR.BG_CLUB,
  },
  category: {
    fontSize: 12,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: COLOR.COMM_SHADOW,
    backgroundColor: COLOR.BG_CATEGORY,
  },
});

export default CommLabel;