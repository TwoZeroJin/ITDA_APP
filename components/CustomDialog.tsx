import { COLOR } from '@/constants';
import React, { ReactNode } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomDialogProps {
    visible       : boolean;
    title         : string;
    content       : string;
    onConfirm     : () => void;
    onCancel      : () => void;
    child?        : ReactNode;
    confirmLabel? : string;
    cancelLabel?  : string;
}

/**
 * 
 * @param param
 * @returns  공통 커스텀 다이얼로그 컴포넌트
 */
function CustomDialog({
  visible,
  title,
  content,
  onConfirm,
  onCancel,
  confirmLabel = '확인',
  cancelLabel = '취소',
}: CustomDialogProps) {
  return (
    <Modal transparent visible={visible} animationType='fade' onRequestClose={onCancel}>
        <View style={styles.background}>
            <View style={styles.container}>
                <View style={{ padding: 20 }}>
                  <Text style={styles.titleText}>{title}</Text>
                  <Text style={styles.contentText}>{content}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onCancel} style={[styles.button, { backgroundColor: COLOR.COMM_GRAY_6, borderBottomStartRadius: 10 }]}>
                      <Text style={styles.cancelText}>{cancelLabel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm} style={[styles.button, { backgroundColor: COLOR.APP_MAIN, borderBottomEndRadius: 10 }]}>
                      <Text style={styles.confirmText}>{confirmLabel}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    flex            : 1,
    backgroundColor : "rgba(0,0,0,0.5)",
    justifyContent  : "center",
    alignItems      : "center",
  },
  container: {
    width           : "80%",
    backgroundColor : "#fff",
    borderRadius    : 10,
  },
  titleText: {
    fontSize        : 18,
    fontWeight      : "bold",
    marginBottom    : 10,
  },
  contentText: {
    fontSize        : 14,
    marginBottom    : 20,
  },
  buttonContainer: {
    flexDirection   : "row",
    alignItems      : "center",
  },
  button: {
    flex            : 1,
    padding         : 15,
  },
  cancelText: {
    color       : COLOR.COMM_BLACK,
    fontWeight  : "bold",
    alignSelf  : "center",
  },
  confirmText: {
    color       : COLOR.COMM_WHITE,
    fontWeight  : "bold",
    alignSelf  : "center",
  },
});

export default CustomDialog;