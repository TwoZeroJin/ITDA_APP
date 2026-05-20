import { COLOR } from "@/constants";
import React from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

interface CustomButtonProps extends PressableProps {
    label       : string;
    size?       : "medium" | "large";
    variant?    : "standard" | "filled" | "outlined";
    style?      : StyleProp<ViewStyle>
}

function CustomButton({ label, size = "large", variant = "standard", style = null, ...props} : CustomButtonProps) {
    return (
        <Pressable 
            style={({pressed}) => [
            styles.container, 
            styles[size], 
            styles[variant],
            pressed && styles.pressed,
            style
            ]}
            {...props}
            >
            <Text style={styles[`${variant}Text`]}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius    : 20,
        justifyContent  : "center",
        alignItems      : "center"
    }, 
    large : {
        width   : "100%",
        height  : 45
    },
    medium : {
        height              : 38,
        alignSelf           : 'center',
        paddingHorizontal   : 12
    },
    filled: {
        backgroundColor : COLOR.APP_MAIN,
    },
    standard: {
        backgroundColor : COLOR.COMM_WHITE,
        borderWidth     : 1,
        borderColor     : COLOR.COMM_GRAY_6
    },
    outlined: {
        backgroundColor : COLOR.COMM_WHITE,
        borderWidth     : 1,
        borderColor     : COLOR.APP_MAIN
    },
    pressed: {
        opacity : 0.6,
    },
    filledText: {
        fontSize    : 18,
        fontWeight  : "normal",
        color       : COLOR.COMM_WHITE
    },
    standardText: {
        fontSize    : 18,
        fontWeight  : "normal",
        color       : COLOR.TEXT_DEFAULT
    },
    outlinedText: {
        fontSize    : 18,
        fontWeight  : "bold",
        color       : COLOR.APP_MAIN
    },
});

export default CustomButton;