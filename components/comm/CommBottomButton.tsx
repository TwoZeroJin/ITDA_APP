import CustomButton from "@/components/comm/CustomButton";
import { COLOR } from "@/constants";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommBottomButtonProps {
  label   : string;
  onPress : () => void;
  disabled?: boolean;
}

function CommBottomButton({ label, onPress, disabled = false }: CommBottomButtonProps) {
  const inset = useSafeAreaInsets();
  return (
    <View style={[styles.fixed, {paddingBottom: inset.bottom || 12}]}>
      <CustomButton 
        label={label} 
        variant={!disabled ? "filled" : "standard"}
        style={styles.bottomStyle}
        onPress={onPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  fixed: {
    position            : "absolute",
    bottom              : 0,
    width               : "100%",
    paddingTop          : 12,
    paddingHorizontal   : 20,
    backgroundColor     : COLOR.COMM_WHITE,
  },
  bottomStyle: {
    height          : 52,
    borderRadius    : 12,
  }
});

export default CommBottomButton;