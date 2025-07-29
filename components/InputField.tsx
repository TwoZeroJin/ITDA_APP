import { COLOR } from '@/constants';
import React, { ForwardedRef, forwardRef, ReactNode } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputFieldProps extends TextInputProps {
    label?: string;
    variant? : "filled" | "standard" | "outlined";
    error? : string;
    rightChild?: ReactNode;
}

const InputField = ({label, variant = "filled", error, rightChild = null, ...props }: InputFieldProps, ref?: ForwardedRef<TextInput>) => {
  return (
    <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[
                styles.container
                , styles[variant]
                , Boolean(error) && styles.inputError
                , props.multiline && styles.multiline
            ]}>
            <TextInput ref={ref} placeholderTextColor={COLOR.COMM_GRAY} style={[styles.input, styles[`${variant}Text`]]} {...props} spellCheck={false} autoCorrect={false} />
            {rightChild}
        </View>
        {Boolean(error) && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        color : COLOR.COMM_GRAY,
        marginBottom : 5,
    },
    container: {
        height: 44,
        borderRadius: 8,
        padding: 10,
        justifyContent : "center",
        alignItems: "center",
        flexDirection: "row"
    },
    filled: {
        backgroundColor: COLOR.COMM_GRAY
    },
    standard: {
        borderWidth:1,
        borderColor:COLOR.COMM_GRAY
    },
    outlined: {
        borderWidth:1,
        borderColor:COLOR.COMM_GRAY
    },
    filledText: {
        color: COLOR.COMM_GRAY
    },
    standardText: {
        color: COLOR.COMM_GRAY
    },
    outlinedText: {
        color:COLOR.APP_MAIN,
        fontWeight: "bold"
    },
    input: {
        fontSize: 16,
        padding: 0,
        flex: 1
    },
    error: {
        fontSize: 12,
        marginTop: 5,
        color: COLOR.COMM_RED
    },
    inputError: {
        backgroundColor: COLOR.COMM_RED
    },
    multiline: {
        alignItems: "flex-start",
        paddingVertical: 10,
        height: 200
    }
});

export default forwardRef(InputField);