import { COLOR } from '@/constants';
import React, { ForwardedRef, forwardRef, ReactNode } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputFieldProps extends TextInputProps {
    label?      : string;
    variant?    : "filled" | "standard" | "outlined";
    error?      : string;
    rightChild? : ReactNode;
    textArea?   : boolean;
}

const InputField = ({label, variant = "filled", error, rightChild = null, textArea = false, ...props }: InputFieldProps, ref?: ForwardedRef<TextInput>) => {
  const isTextArea = textArea || Boolean(props.multiline);

  return (
    <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[
                styles.container
                , styles[variant]
                , Boolean(error) && styles.inputError
                , isTextArea && styles.multiline
            ]}>
            <TextInput 
                ref={ref} 
                {...props} 
                placeholderTextColor={COLOR.TEXT_GRAY} 
                style={[styles.input, styles[`${variant}Text`], isTextArea && styles.multilineInput]} 
                multiline={isTextArea}
                numberOfLines={isTextArea ? (props.numberOfLines ?? 5) : props.numberOfLines}
                spellCheck={false} 
                autoCorrect={false} />
            {rightChild}
        </View>
        {Boolean(error) && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
    label: {
        fontSize        : 14,
        fontWeight      : 400,
        lineHeight      : 22,
        color           : COLOR.TEXT_DEFAULT,
        marginStart     : 5,
        marginBottom    : 7,
    },
    container: {
        justifyContent      : "center",
        alignItems          : "center",
        flexDirection       : "row",
        height              : 49,
        borderRadius        : 12,
        paddingHorizontal   : 16,
    },
    filled: {
        borderColor:COLOR.COMM_GRAY_6,
        borderWidth: 1,
    },
    standard: {
        borderColor:COLOR.COMM_GRAY_6,
        borderWidth: 1,
    },
    outlined: {
        borderColor:COLOR.COMM_GRAY_6,
        borderWidth: 1,
    },
    filledText: {
        color: COLOR.TEXT_DEFAULT
    },
    standardText: {
        color: COLOR.TEXT_DEFAULT
    },
    outlinedText: {
        color:COLOR.TEXT_DEFAULT,
    },
    input: {
        flex        : 1,
        fontSize    : 16,
        padding     : 0,
    },
    error: {
        marginTop   : 5,
        fontSize    : 12,
        color       : COLOR.COMM_RED,
    },
    inputError: {
        backgroundColor: COLOR.COMM_GRAY
    },
    multiline: {
        alignItems      : "flex-start",
        paddingVertical : 10,
        height          : 200
    },
    multilineInput: {
        textAlignVertical   : 'top',
        paddingVertical     : 5,
        height              : 185
    }
});

export default forwardRef(InputField);