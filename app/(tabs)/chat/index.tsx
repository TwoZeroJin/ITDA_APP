import CommHeader from "@/components/CommHeader";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChatListScreen() {

  return (
    <View style={styles.container}>
      {/* <CommHeader isLogo={false}/> */}
      <CommHeader isNoti={false} isSetting={true}/>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push("/chats")}>
          <Text>채팅하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});