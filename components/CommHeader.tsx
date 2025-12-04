import Back from '@/assets/images/arrow_left.svg';
import Like from '@/assets/images/header_like.svg';
import Noti from '@/assets/images/header_noti.svg';
import Setting from '@/assets/images/header_setting.svg';
import Logo from '@/assets/images/top_logo.svg';
import { COLOR } from '@/constants';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CommHeaderProps {
  isLogo?    : boolean;
  // isBack?    : boolean;
  isLike?    : boolean;
  isNoti?    : boolean;
  isSetting? : boolean;
}

function CommHeader({isLogo = true, isLike = true, isNoti = true, isSetting = false}: CommHeaderProps) {
  return (
    <View style={styles.container}>
        <View style={styles.container}>
          {isLogo && <Logo width={101} height={50} style={{marginStart: 7}}/>}
          {!isLogo && 
            <TouchableOpacity onPress={() => {router.back()}}>
              <Back width={54} height={44} style={{marginStart: 10}}/>
            </TouchableOpacity>
          }
        </View>
        <View style={[styles.container, styles.rigtht]}>
          {isLike && 
            <TouchableOpacity onPress={() => {}}>
              <Like/>
            </TouchableOpacity>
          }
          {isNoti && 
            <TouchableOpacity onPress={() => {}}>
              <Noti/>
            </TouchableOpacity>
          }
          {isSetting && 
            <TouchableOpacity onPress={() => {}}>
              <Setting/>
            </TouchableOpacity>
          }
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flexDirection   : "row",
    alignItems      : "center",
    gap             : 10,
    backgroundColor : COLOR.COMM_WHITE,
  },
  rigtht: {
    marginStart   : "auto",
    marginEnd     : 16,
  }
});

export default CommHeader;