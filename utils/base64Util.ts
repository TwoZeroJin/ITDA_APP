import { getOsId } from '@/utils/commUtil';
import base64 from 'react-native-base64';

function getClientId(appVersion?: string) {
    if (!appVersion) {
        appVersion = '1.0.0';
    }
    const jsonObject = {
        os_id: getOsId(),
        app_ver: appVersion,
    };

    return base64.encode(JSON.stringify(jsonObject));
}

export { getClientId };

