import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Radio 버튼 Items
type RadioItem = {
    id?         : string | number;
    name?       : string;
    label       : string;
    value       : string | number;
    disabled?   : boolean;
}

interface RadioGroupProps {
    items       : RadioItem[];
    value       : string | number | null;
    onChange    : (value: string | number) => void;
    direction?  : "row" | "column";
    spacing?    : number;
}

let autoId = 0;

const RadioGroup = ({ items, value, onChange, direction = "column", spacing = 12 }: RadioGroupProps) => {
    const normalized = items.map((item) => ({
    ...item,
    id: item.id ?? `radio-${autoId++}`,
    name: item.name ?? item.label,
  }));
    return (
        <View
            style={[
            styles.container,
            { flexDirection: direction === "row" ? "row" : "column" },
            ]}
        >
            {normalized.map((item, idx) => {
                const selected = value === item.value;
                return (
                <TouchableOpacity
                    key={item.id}
                    style={[
                    styles.item,
                    direction === "row" && idx < normalized.length - 1
                        ? { marginRight: spacing }
                        : { marginBottom: direction === "column" ? spacing : 0 },
                    item.disabled && { opacity: 0.5 },
                    ]}
                    activeOpacity={0.6}
                    onPress={() => !item.disabled && onChange(item.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, disabled: !!item.disabled }}
                >
                    <View
                    style={[
                        styles.circle,
                        selected && styles.circleSelected,
                        { borderColor: selected ? "#2563eb" : "#9ca3af" },
                    ]}
                    >
                    {selected && <View style={styles.innerDot} />}
                    </View>
                    <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
                );
            })}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
    },
    circle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    circleSelected: {
        borderColor: "#2563eb",
    },
    innerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#2563eb",
    },
    label: {
        fontSize: 16,
        fontWeight: Platform.OS === "ios" ? "500" : "400",
    },
});

export default RadioGroup;