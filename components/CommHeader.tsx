import Like from '@/assets/images/header_like.svg';
import Noti from '@/assets/images/header_noti.svg';
import Search from '@/assets/images/header_search.svg';
import Logo from '@/assets/images/logo.svg';
import React from 'react';
import { StyleSheet, View } from 'react-native';

function CommHeader() {
  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo width={54} height={44}/>
        </View>
        <View style={[styles.container, styles.rigthButton]}>
          <Search/>
          <Like/>
          <Noti/>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flexDirection   : "row",
    alignItems      : "center",
    gap             : 4
  },
  logoContainer: {
    marginStart: 33
  },
  rigthButton: {
    marginStart   : "auto",
    marginEnd     : 16,
  }
});

export default CommHeader;