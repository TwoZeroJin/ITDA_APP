import { COLOR } from '@/constants';
import React, { ReactNode, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CustomDialogProps {
  visible       : boolean;
  title?        : string;
  content       : string;
  textInput?    : string| null |undefined;
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

            {/* 변경: JSX 내부에서는 삼항 연산자나 &&를 사용해 조건부 렌더링을 해야 합니다 */}
            {textInput !== undefined && textInput !== null && (
              <TextInput
                style={styles.textInput} // 주석 해제 및 스타일에 추가
                placeholder={textInput}
                placeholderTextColor="#B0B0B0"
                value={answer}
                onChangeText={setAnswer}
                multiline={true}
                maxLength={100}
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
  textInput: {
    width             : '100%',
    height            : 50, // 입력창 높이
    backgroundColor   : '#FFFFFF',
    borderWidth       : 1,
    borderColor       : '#E5E5EA',
    borderRadius      : 12,
    paddingHorizontal : 16,
    paddingTop        : 12, // multiline 대응용 위쪽 패딩
    paddingBottom     : 12,
    marginTop         : 12,
    fontSize          : 15,
    color             : '#1C1C1E',
    textAlignVertical : 'top', // Android에서 텍스트가 상단부터 찍히도록 설정
  },  
});

export default CustomDialog;