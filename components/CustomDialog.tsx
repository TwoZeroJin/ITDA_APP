import React, { ReactNode } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomDialogProps {
    visible     : boolean;
    title       : string;
    content     : string;
    onConfirm   : () => void;
    onCancel    : () => void;
    child?      : ReactNode;
}

function CustomDialog({ visible, title, content, onConfirm, onCancel }: CustomDialogProps) {
  return (
    <Modal transparent visible={visible} animationType='fade' onRequestClose={onCancel}>
        <View style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.contentText}>{content}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onCancel}>
                        <Text style={styles.cancelText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm}>
                        <Text style={styles.confirmText}>확인</Text>
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
    padding         : 20,
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
    justifyContent  : "flex-end",
  },
  cancelText: {
    marginLeft  : 15,
    color       : "#007BFF",
    fontWeight  : "bold",
  },
  confirmText: {
    marginLeft  : 15,
    color       : "#007BFF",
    fontWeight  : "bold",
  },
});

export default CustomDialog;