import React from "react";
import CommBottomButton from "@/components/CommBottomButton";
// import EmailInput from "@/components/EmailInput";
// import PasswordConfirmInput from "@/components/PasswordConfirmInput";
// import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/hooks/queries/useAuth";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FormValues = {
    email: string;
    password: string;
    passwordConfirm: string;
}

const INTEREST_CATEGORIES = [
  {
    title: "액티비티",
    items: ["등산", "클라이밍", "테니스", "복싱", "서핑", "기타"],
  },
  {
    title: "액티비티",
    items: ["등산", "클라이밍", "테니스", "복싱", "서핑", "기타"],
  },
  {
    title: "액티비티",
    items: ["등산", "클라이밍", "테니스", "복싱", "서핑", "기타"],
  },
];

export default function SignupInterestScreen() {
    const { signupMutation } = useAuth();
    const signupForm = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
            passwordConfirm: ""    
        }
    });
    

  const [selected, setSelected] = React.useState<string[]>([]);

  const toggleSelect = (item: string) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const onSubmit = () => {
    if (selected.length < 2) {
      alert("관심분야를 최소 2개 이상 선택해주세요.");
      return;
    }
    console.log("선택된 항목:", selected);
    // signupMutation.mutate({ interests: selected });
  };

  return (
    <FormProvider {...signupForm}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>관심분야</Text>
          <Text style={styles.subtitle}>
            관심있는 취미가 우선적으로 보여져요 {"\n"}(최소 2개)
          </Text>

          {INTEREST_CATEGORIES.map((category, idx) => (
            <View key={idx} style={styles.categoryBox}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <View style={styles.buttonGroup}>
                {category.items.map((item) => {
                  const isSelected = selected.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.itemButton,
                        isSelected && styles.itemButtonSelected,
                      ]}
                      onPress={() => toggleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.itemText,
                          isSelected && styles.itemTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <CommBottomButton label="선택완료" onPress={onSubmit} />
      </SafeAreaView>
    </FormProvider>
  );
}

// return (
//         <SafeAreaView>
//             <View style={styles.container}>
//                 <Text> style={styles.text}>관심분야</Text>
//             </View>
//             <View style={styles.container2}>
//                 <Text> style={styles.text}>액티비티</Text>
//             </View>
//             <Button title="등산" onPress={()=>console.log("pressd!") }/>
//             <Button title="등산" onPress={()=>console.log("pressd!") }/>
//             <Button title="등산" onPress={()=>console.log("pressd!") }/>
//         </SafeAreaView>
//     );

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#888",
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
  },
  categoryBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  categoryTitle: {
    fontWeight: "600",
    marginBottom: 12,
    fontSize: 15,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  itemButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  itemButtonSelected: {
    backgroundColor: "#ff6b6b",
    borderColor: "#ff6b6b",
  },
  itemText: {
    color: "#333",
  },
  itemTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});