import { COLOR } from '@/constants';
import React, { ForwardedRef, forwardRef, MutableRefObject, ReactNode, RefObject, useRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label?      : string;
  variant?    : "filled" | "standard" | "outlined";
  error?      : string;
  rightChild? : ReactNode;
  textArea?   : boolean;
}

const InputField = ({label, variant = "filled", error, rightChild = null, textArea = false, ...props }: InputFieldProps, ref?: ForwardedRef<TextInput>) => {
  const innerRef = useRef<TextInput>(null);
  const isTextArea = textArea || Boolean(props.multiline);
  const multilineLines = isTextArea ? (props.numberOfLines ?? 5) : 1;
  const multilineInputHeight = multilineLines * 24;
  const multilineContainerHeight = multilineInputHeight + 20;

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={[
          styles.container
          , styles[variant]
          , Boolean(error) && styles.inputError
          , isTextArea && styles.multiline
          , isTextArea && { height: multilineContainerHeight }
        ]}
        activeOpacity={0.6}
        onPress={() => innerRef.current?.focus()} 
      >
        <TextInput 
          ref={(node) => {
            innerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as RefObject<TextInput | null>).current = node;
          }}
          
          {...props} 
          placeholderTextColor={COLOR.TEXT_GRAY} 
          style={[
            styles.input,
            styles[`${variant}Text`],
            isTextArea && styles.multilineInput,
            isTextArea && { height: multilineInputHeight }
          ]} 
          multiline={isTextArea}
          numberOfLines={isTextArea ? multilineLines : props.numberOfLines}
          spellCheck={false} 
          autoCorrect={false}
        />
        {rightChild}
      </TouchableOpacity>
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
    borderColor         :COLOR.COMM_GRAY_6,
    borderWidth         : 1,
  },
  standard: {
    borderColor         :COLOR.COMM_GRAY_6,
    borderWidth         : 1,
  },
  outlined: {
    borderColor         :COLOR.COMM_GRAY_6,
    borderWidth         : 1,
  },
  filledText: {
    color               : COLOR.TEXT_DEFAULT
  },
  standardText: {
    color               : COLOR.TEXT_DEFAULT
  },
  outlinedText: {
    color               : COLOR.TEXT_DEFAULT,
  },
  input: {
    flex        : 1,
    fontSize    : 16,
    padding     : 0,
  },
  error: {
    marginTop   : 5,
    marginStart : 5,
    fontSize    : 12,
    color       : COLOR.COMM_RED,
  },
  inputError: {
    borderWidth     : 1,
    borderColor     : COLOR.COMM_RED,
    backgroundColor : COLOR.COMM_GRAY
  },
  multiline: {
    alignItems      : "flex-start",
    paddingVertical : 10,
  },
  multilineInput: {
    textAlignVertical   : 'top',
  }
});

export default forwardRef(InputField);