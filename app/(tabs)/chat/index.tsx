import CommHeader from "@/components/CommHeader";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatListScreen() {

  return (
    <SafeAreaView style={styles.container}>
      {/* <CommHeader isLogo={false}/> */}
      <CommHeader isSearch={false} isNoti={false} isSetting={true}/>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push("/chats")}>
          <Text>채팅하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});