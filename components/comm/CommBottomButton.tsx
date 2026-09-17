import CustomButton from "@/components/comm/CustomButton";
import BtnLikeDefault from '@/assets/images/icon_bottom_like_default.svg';
import BtnLikeActive from '@/assets/images/icon_bottom_like_active.svg';
import { COLOR } from "@/constants";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommBottomButtonProps {
  label     : string;
  onPress   : () => void;
  disabled? : boolean;
  isLike?   : boolean;
  onLike?   : () => void;
}

function CommBottomButton({ label, onPress, disabled = false, isLike, onLike }: CommBottomButtonProps) {
  const inset = useSafeAreaInsets();
  return (
    <View style={[styles.fixed, {paddingBottom: inset.bottom || 12}]}>
      {onLike && (
        <TouchableOpacity
          style={{marginEnd: 12}}
          activeOpacity={0.6}
          onPress={onLike}
        >
          {isLike ? <BtnLikeActive /> : <BtnLikeDefault />}
        </TouchableOpacity>
      )}
      <CustomButton 
        label={label} 
        variant={!disabled ? "filled" : "standard"}
        style={onLike ? [styles.bottomStyle, { width: '88%' }] : styles.bottomStyle}
        onPress={onPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  fixed: {
    position            : "absolute",
    flex                : 1,
    flexDirection       : "row",
    alignItems          : "center",
    bottom              : 0,
    left                : 0,
    right               : 0,
    paddingTop          : 12,
    paddingHorizontal   : 20,
    backgroundColor     : COLOR.COMM_WHITE,
    overflow            : 'visible',
    zIndex              : 10,
    shadowOffset        : { width: 0, height: -6 },
    shadowOpacity       : 0.1,
    shadowRadius        : 6,
    shadowColor         : COLOR.COMM_SHADOW,
    elevation           : 10,
  },
  bottomStyle: {
    height              : 52,
    borderRadius        : 12,
  }
});

export default CommBottomButton;