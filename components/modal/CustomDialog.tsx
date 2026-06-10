import { COLOR } from '@/constants';
import React, { ReactNode, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import InputField from '../InputField';

interface CustomDialogProps {
  visible       : boolean;
  title?        : string;
  content       : string;
  textInput?    : string;
  onConfirm?    : (answer: string) => void;
  onCancel?     : () => void;
  child?        : ReactNode;
  confirmLabel? : string;
  cancelLabel?  : string;
}

/**
 * 공통 커스텀 다이얼로그 컴포넌트
 */
function CustomDialog({ visible, title, content, textInput, onConfirm, onCancel, confirmLabel, cancelLabel }: CustomDialogProps) {
  const hasConfirmButton = Boolean(confirmLabel);
  const hasCancelButton = Boolean(cancelLabel);
  const [answer, setAnswer] = useState('');

  return (
    <Modal transparent visible={visible} animationType='fade' onRequestClose={onCancel}>
      <View style={styles.background}>
        <View style={styles.container}>
          <View style={{ padding: 20 }}>
            {title && <Text style={styles.titleText}>{title}</Text>}
            <Text style={styles.contentText}>{content}</Text>

            {textInput && (
              <InputField
                placeholder={textInput}
                value={answer}
                onChangeText={setAnswer}
                multiline={true}
                maxLength={100}
                numberOfLines={2}
              />
            )}

          </View>
          {(hasCancelButton || hasConfirmButton) && (
            <View style={styles.buttonContainer}>
              {hasCancelButton && (
                <TouchableOpacity
                  onPress={onCancel}
                  style={[
                    styles.button,
                    {
                      backgroundColor: COLOR.COMM_GRAY_6,
                      borderBottomStartRadius: 10,
                      borderBottomEndRadius: hasConfirmButton ? 0 : 10,
                    },
                  ]}
                >
                  <Text style={styles.cancelText}>{cancelLabel}</Text>
                </TouchableOpacity>
              )}

              {hasConfirmButton && (
                <TouchableOpacity
                  onPress={() => onConfirm?.(answer)}
                  style={[
                    styles.button,
                    {
                      backgroundColor: COLOR.APP_MAIN,
                      borderBottomStartRadius: hasCancelButton ? 0 : 10,
                      borderBottomEndRadius: 10,
                    },
                  ]}
                >
                  <Text style={styles.confirmText}>{confirmLabel}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    flex              : 1,
    backgroundColor   : COLOR.COMM_MODAL_BG,
    justifyContent    : "center",
    alignItems        : "center",
    paddingHorizontal : 32,
  },
  container: {
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 10,
    marginHorizontal  : 16,
    width             : "100%",
  },
  titleText: {
    fontSize          : 14,
    fontFamily        : "Pretendard-Light",
    marginBottom      : 10,
    alignSelf         : "center",
    color             : COLOR.TEXT_DEFAULT,
  },
  contentText: {
    fontSize          : 24,
    fontFamily        : "Pretendard-Bold",
    alignSelf         : "center",
    marginBottom      : 10,
  },
  buttonContainer: {
    flexDirection     : "row",
    alignItems        : "center",
  },
  button: {
    flex              : 1,
    height            : 55,
    justifyContent    : "center",
    alignItems        : "center",
  },
  cancelText: {
    fontSize          : 16,
    fontFamily        : "Pretendard-Medium",
    color             : COLOR.TEXT_DEFAULT,
    alignSelf         : "center",
  },
  confirmText: {
    fontSize          : 16,
    fontFamily        : "Pretendard-Medium",
    color             : COLOR.COMM_WHITE,
    alignSelf         : "center",
  },
});

export default CustomDialog;