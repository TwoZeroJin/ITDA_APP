import CommHeader from "@/components/CommHeader";
import { useAuth } from "@/hooks/queries/useAuth";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPageScreen() {
  const {logout} = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      {/* <CommHeader isLogo={false}/> */}
      <CommHeader isSearch={false} isNoti={false} isSetting={true}/>
      <View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.text}>로그아웃 하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    
  },
  text: {
  }
});