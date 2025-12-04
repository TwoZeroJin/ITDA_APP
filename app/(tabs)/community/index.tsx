import CommHeader from "@/components/CommHeader";
import React from "react";
import { StyleSheet, View } from 'react-native';

export default function ReviewScreen() {

  return (
    <View style={styles.container}>
      {/* <CommHeader isLogo={false}/> */}
      <CommHeader/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});