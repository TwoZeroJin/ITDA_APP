import Back from '@/assets/images/arrow_left.svg';
import Like from '@/assets/images/header_like.svg';
import Noti from '@/assets/images/header_noti.svg';
import Search from '@/assets/images/header_search.svg';
import Setting from '@/assets/images/header_setting.svg';
import Logo from '@/assets/images/logo.svg';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CommHeaderProps {
  isLogo?    : boolean;
  // isBack?    : boolean;
  isSearch?  : boolean;
  isLike?    : boolean;
  isNoti?    : boolean;
  isSetting? : boolean;
}

function CommHeader({isLogo = true, isSearch = true, isLike = true, isNoti = true, isSetting = false}: CommHeaderProps) {
  return (
    <View style={styles.container}>
        <View style={styles.container}>
          {isLogo && <Logo width={54} height={44} style={{marginStart: 33}}/>}
          {!isLogo && 
            <TouchableOpacity onPress={() => {}}>
              <Back width={54} height={44} style={{marginStart: 16}}/>
            </TouchableOpacity>
          }
        </View>
        <View style={[styles.container, styles.rigtht]}>
          {isSearch && 
            <TouchableOpacity onPress={() => {}}>
              <Search/>
            </TouchableOpacity>
          }
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
    gap             : 5
  },
  rigtht: {
    marginStart   : "auto",
    marginEnd     : 16,
  }
});

export default CommHeader;