import { COLOR } from "@/constants";
import React from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

interface CustomButtonProps extends PressableProps {
    label: string;
    size?: "medium" | "large";
    variant? : "filled" | "standard" | "outlined";
    style?: StyleProp<ViewStyle>
}

function CustomButton({
    label, 
    size = "large",
    variant = "filled",
    style = null,
    ...props
} : CustomButtonProps) {
    return (
        <Pressable 
            style={({pressed}) => [
            styles.container, 
            styles[size], 
            styles[variant],
            props.disabled && styles.disabled,
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
        borderRadius: 8,
        justifyContent: "center",
        alignItems : "center"
    }, 
    large : {
        width: "100%",
        height : 44
    },
    medium : {
        height: 38,
        alignSelf: 'center',
        paddingHorizontal: 12
    },
    filled: {
        backgroundColor: COLOR.APP_MAIN,
    },
    standard: {},
    outlined: {
        backgroundColor: COLOR.COMM_WHITE,
        borderWidth: 1,
        borderColor: COLOR.APP_MAIN
    },
    pressed: {
        opacity : 0.8
    },
    disabled: {
        backgroundColor: COLOR.TEXT_GRAY
    },
    filledText: {
        fontSize : 14,
        fontWeight : "bold",
        color: COLOR.COMM_WHITE
    },
    standardText: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLOR.APP_MAIN
    },
    outlinedText: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLOR.APP_MAIN
    },
});

export default CustomButton;