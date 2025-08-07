import CommHeader from "@/components/CommHeader";
import React from "react";
import { SafeAreaView, StyleSheet } from 'react-native';

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
    
  }
});