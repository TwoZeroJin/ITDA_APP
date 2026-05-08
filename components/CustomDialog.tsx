import { COLOR } from '@/constants';
import React, { ReactNode } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomDialogProps {
    visible       : boolean;
    title?        : string;
    content       : string;
    onConfirm     : () => void;
    onCancel      : () => void;
    child?        : ReactNode;
    confirmLabel? : string;
    cancelLabel?  : string;
}

/**
 * 공통 커스텀 다이얼로그 컴포넌트
 */
function CustomDialog({
  visible,
  title,
  content,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
}: CustomDialogProps) {
  const hasConfirmButton = Boolean(confirmLabel);
  const hasCancelButton = Boolean(cancelLabel);

  return (
    <Modal transparent visible={visible} animationType='fade' onRequestClose={onCancel}>
      <View style={styles.background}>
        <View style={styles.container}>
          <View style={{ padding: 20 }}>
            {title && <Text style={styles.titleText}>{title}</Text>}
            <Text style={styles.contentText}>{content}</Text>
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
                  onPress={onConfirm}
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
    flex            : 1,
    backgroundColor : COLOR.COMM_MODAL_BG,
    justifyContent  : "center",
    alignItems      : "center",
  },
  container: {
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 10,
    marginHorizontal  : 16,
  },
  titleText: {
    fontSize        : 14,
    fontWeight      : "light",
    marginBottom    : 10,
    alignSelf       : "center",
    color           : COLOR.TEXT_DEFAULT,
  },
  contentText: {
    fontSize        : 24,
    alignSelf       : "center",
    fontWeight      : "bold",
  },
  buttonContainer: {
    flexDirection   : "row",
    alignItems      : "center",
  },
  button: {
    flex            : 1,
    height          : 55,
    justifyContent  : "center",
    alignItems      : "center",
  },
  cancelText: {
    fontSize        : 16,
    color           : COLOR.TEXT_DEFAULT,
    fontWeight      : "medium",
    alignSelf       : "center",
  },
  confirmText: {
    fontSize        : 16,
    color           : COLOR.COMM_WHITE,
    fontWeight      : "medium",
    alignSelf       : "center",
  },
});

export default CustomDialog;