import { Platform } from "react-native";

/**
 * OS 값 return
 */
function getOsId() {
    if (Platform.OS === 'ios') {
        return 'IOS';
    }
    else if (Platform.OS === 'android') {
        return 'AOS';
    }
    else {
        '';
    }

}

export { getOsId };

