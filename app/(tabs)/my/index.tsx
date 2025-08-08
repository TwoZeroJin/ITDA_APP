import CommHeader from "@/components/CommHeader";
import useAuth from "@/hooks/queries/useAuth";
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MyPageScreen() {
  const {logout} = useAuth();

  return (
    <SafeAreaView>
      {/* <CommHeader isLogo={false}/> */}
      <CommHeader isSearch={false} isNoti={false} isSetting={true}/>
      <View style={styles.container}>
        <TouchableOpacity onPress={logout}>
          <Text>로그아웃 하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center"
  }
});