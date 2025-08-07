import { STORE_KEY } from "@/constants";
import { CodeInfo, MemberInfo, Token } from "@/types";
import { Platform } from "react-native";
import { getSecureStore, saveSecureStore } from "./secureStoreUtil";

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

/**
 * 
 * @returns AccessToken 저장
 */
function getAccessToken() {
    return getSecureStore(STORE_KEY.X_ACCESS_TOKEN);
}
/**
 * 
 * @returns RefreshToken 저장
 */
function getRefreshToken() {
    return getSecureStore(STORE_KEY.X_REFRESH_TOKEN);
}

/**
 * 
 * @param data 회원 정보 SecureStore에 저장
 */
async function saveMemberInfo(data?: MemberInfo & Token) {
    if (data) {
        await saveSecureStore(STORE_KEY.X_ACCESS_TOKEN,     data.access_token);
        await saveSecureStore(STORE_KEY.X_REFRESH_TOKEN,    data.refresh_token);
        await saveSecureStore(STORE_KEY.MEM_NAME,           data.mem_name);
        await saveSecureStore(STORE_KEY.MEM_NICK,           data.mem_nick);
        await saveSecureStore(STORE_KEY.MEM_TEAM,           data.mem_team);
        await saveSecureStore(STORE_KEY.MEM_GENDER,         data.mem_gender);
        await saveSecureStore(STORE_KEY.MEM_BIRTH,          data.mem_birth);
        await saveSecureStore(STORE_KEY.MEM_TELNO,          data.mem_telno);
        await saveSecureStore(STORE_KEY.MEM_ADDR,           data.mem_addr);
        await saveSecureStore(STORE_KEY.MEM_INTEREST,       data.mem_interest);
    }
}
/**
 * 
 * @returns 회원 정보
 */
async function getMemberInfo(): Promise<MemberInfo> {
    const mem_name      = await getSecureStore(STORE_KEY.MEM_NAME);
    const mem_nick      = await getSecureStore(STORE_KEY.MEM_NICK);
    const mem_team      = await getSecureStore(STORE_KEY.MEM_TEAM);
    const mem_gender    = await getSecureStore(STORE_KEY.MEM_GENDER);
    const mem_birth     = await getSecureStore(STORE_KEY.MEM_BIRTH);
    const mem_telno     = await getSecureStore(STORE_KEY.MEM_TELNO);
    const mem_addr      = await getSecureStore(STORE_KEY.MEM_ADDR);
    const mem_interest  = await getSecureStore(STORE_KEY.MEM_INTEREST);
    
    return {
        mem_name        : mem_name      || "",
        mem_nick        : mem_nick      || "",
        mem_team        : mem_team      || "",
        mem_gender      : mem_gender    || "",
        mem_birth       : mem_birth     || "",
        mem_telno       : mem_telno     || "",
        mem_addr        : mem_addr      || "",
        mem_interest    : mem_interest  || "",
        church_name     : "",
        push_send_yn    : "",
    };
}

async function setCategoryList(data?: any) {
    if (data) {
        await saveSecureStore(STORE_KEY.CATEGORY_LIST,     JSON.stringify(data));
    }
} 
async function getCategoryList(): Promise<CodeInfo[]> {
    const s_data = await getSecureStore(STORE_KEY.CATEGORY_LIST);

    if (!s_data) {
        return [];
    }

    try {
        const category_list: CodeInfo[] = JSON.parse(s_data);
        return category_list;
    }
    catch (error) {
        console.log('getCategoryList Error : ', error);
        return [];
    }
    
}

export { getAccessToken, getCategoryList, getMemberInfo, getOsId, getRefreshToken, saveMemberInfo, setCategoryList };

