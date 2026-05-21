import Back from '@/assets/images/arrow_left.svg';
import Like from '@/assets/images/header_like.svg';
import Noti from '@/assets/images/header_noti.svg';
import Setting from '@/assets/images/header_setting.svg';
import Detail from '@/assets/images/header_detail.svg';
import Logo from '@/assets/images/top_logo.svg';
import { COLOR } from '@/constants';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

interface CommHeaderProps {
  isLogo?         : boolean;
  // isBack?    : boolean;
  isLike?         : boolean;
  isNoti?         : boolean;
  isSetting?      : boolean;
  isBack?         : boolean;
  isDetail?       : boolean;
  title?          : string;
  onPressDetail?  : () => void;
}

function CommHeader({isLogo = true, isLike = true, isNoti = true, isSetting = false, isBack = true, isDetail = false, title, onPressDetail}: CommHeaderProps) {
  return (
    <View style={styles.container}>
        <View style={styles.container}>
          {isLogo && <Logo width={101} height={50} style={{marginStart: 7}}/>}
          {!isLogo && isBack &&
            <TouchableOpacity onPress={() => {router.back()}} activeOpacity={0.6}>
              <Back width={54} height={44}/>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.titleWrapper}>
          {title && <Text style={styles.title}>{title}</Text>}
        </View>
        <View style={[styles.container, styles.right]}>
          {isLike && 
            <TouchableOpacity style={styles.iconContainer} onPress={() => {router.navigate("/mypage/likeList");}} activeOpacity={0.6}>
              <Like/>
            </TouchableOpacity>
          }
          {isNoti && 
            <TouchableOpacity style={styles.iconContainer} onPress={() => {}} activeOpacity={0.6}>
              <Noti/>
            </TouchableOpacity>
          }
          {isSetting && 
            <TouchableOpacity style={styles.iconContainer} onPress={() => {router.navigate("/mypage/settings");}} activeOpacity={0.6}>
              <Setting/>
            </TouchableOpacity>
          }
          {isDetail && 
            <TouchableOpacity style={styles.iconContainer} onPress={onPressDetail} activeOpacity={0.6}>
              <Detail/>
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
    height          : 50,
    backgroundColor : COLOR.COMM_WHITE
  },
  right: {
    marginStart     : "auto",
    marginEnd       : 8,
  },
   titleWrapper: {
    position        : 'absolute',
    left            : 0,
    right           : 0,
    top             : 5,
    bottom          : 0,
    justifyContent  : 'center',
    alignItems      : 'center',
    pointerEvents   : 'none',
  },
  title: {
    fontSize        : 18,
    fontWeight      : "bold",
    color           : COLOR.COMM_BLACK,
  },
  iconContainer: {
    height            : '100%',
    paddingHorizontal : 10,
    justifyContent    : 'center',
    alignItems        : 'center'
  },
});

export default CommHeader;