import React from 'react';
import IconDetailCategory from '@/assets/images/icon_detail_category.svg';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR } from '@/constants';

type DetailInfoRowProps = {
  icon: React.ReactNode;
  text: string;
};

function DetailInfoRow({ icon, text }: DetailInfoRowProps) {
  const isDetailCategoryIcon = React.isValidElement(icon) && icon.type === IconDetailCategory;

  return (
    <View style={styles.row}>
      <View style={[styles.icon, isDetailCategoryIcon && styles.iconDetailCategory]}>{icon}</View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection   : 'row',
    alignItems      : 'center',
    marginBottom    : 15,
  },
  icon: {
    alignItems      : 'center',
    justifyContent  : 'center',
    marginEnd       : 15,
  },
  iconDetailCategory: {
    marginEnd       : 10,
  },
  text: {
    fontSize        : 14,
    fontFamily      : 'Pretendard-Regular',
    color           : COLOR.TEXT_DEFAULT,
  },
});

export default DetailInfoRow;