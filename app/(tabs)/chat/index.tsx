import CommHeader from "@/components/CommHeader";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChatListScreen() {

  return (
    <SafeAreaView>
      {/* <CommHeader isLogo={false}/> */}
      <CommHeader isSearch={false} isNoti={false} isSetting={true}/>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push("/chat")}>
          <Text>채팅하기</Text>
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