import CustomButton from "@/components/CustomButton";
import { COLOR } from '@/constants';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommBottomButtonProps {
    label: string;
    onPress: () => void;
}

function CommBottomButton({label, onPress }: CommBottomButtonProps) {
    const inset = useSafeAreaInsets();
  return (
        <View style={[styles.fixed, {paddingBottom: inset.bottom || 12}]}>
            <CustomButton label={label} onPress={onPress}/>
        </View>
  )
}

const styles = StyleSheet.create({
    fixed: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLOR.COMM_GRAY,
        paddingTop: 12,
        paddingHorizontal: 16
    }
});

export default CommBottomButton;