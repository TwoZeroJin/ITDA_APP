import CheckboxFalse from '@/assets/images/checkbox_false.svg';
import CheckboxTrue from '@/assets/images/checkbox_true.svg';
import { COLOR } from '@/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CheckboxFieldProps {
    value       : boolean;
    onChange    : (val: boolean) => void;
    label       : string;
}

const CheckboxField = ({value, onChange, label}: CheckboxFieldProps) => {
  return (
    <View>
        <TouchableOpacity
            style={styles.container}
            onPress={() => onChange(!value)}
            >
            {value ? <CheckboxTrue/> : <CheckboxFalse/> }
            <Text style={styles.labelText}>{label}</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        flexDirection: "row",
        alignItems : "center"
    },
    labelText: {
        fontSize: 20,
        color: COLOR.COMM_BLACK
    }
});

export default CheckboxField;