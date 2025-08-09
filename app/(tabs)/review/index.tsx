import CommHeader from "@/components/CommHeader";
import React from "react";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewScreen() {

  return (
    <SafeAreaView style={styles.container}>
      {/* <CommHeader isLogo={false}/> */}
      <CommHeader/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});