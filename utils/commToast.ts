import Toast from 'react-native-toast-message';

export const showToast = ({
  type = 'customToast',
  text1,
  text2,
  visibilityTime = 3000,
  position = 'top',
  onPress = () => Toast.hide(),
  props = {},
}: {
  type?: string;
  text1: string;
  text2?: string;
  visibilityTime?: number;
  position?: 'top' | 'bottom';
  onPress?: () => void;
  props?: object;
}) => {
  Toast.show({
    type,
    text1,
    text2,
    position,
    visibilityTime,
    onPress,
    props,
  });
};