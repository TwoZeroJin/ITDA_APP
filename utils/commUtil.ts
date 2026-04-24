import { COMM_CONSTANTS, STORE_KEY } from "@/constants";
import { CodeInfo, FileInfo, MemberInfo, Token } from "@/types";
import { Platform } from "react-native";
import base64 from 'react-native-base64';
import { getSecureStore, saveSecureStore } from "./secureStoreUtil";
import { getAsyncStore, saveAsyncStore } from "./asyncStoreUtil";

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
        return '';
    }
}

/**
 * Header에 넣을 ClientId
 * @param appVersion 
 * @returns 
 */
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

/**
 * 
 * @returns DEVICE UID 생성
 */
async function getDeviceUid(): Promise<string> {
    const savedUid = await getSecureStore(STORE_KEY.DEVICE_UID);

    if (savedUid) {
        return savedUid;
    }

    let deviceUid = "";

    try {
        const Application = require("expo-application");

        if (Platform.OS === "android") {
            deviceUid = Application.androidId ?? "";
        }
        else if (Platform.OS === "ios" && Application.getIosIdForVendorAsync) {
            deviceUid = (await Application.getIosIdForVendorAsync()) ?? "";
        }
    }
    catch {
        // expo-application 미설치/미지원 환경에서는 fallback UID 사용
    }

    if (!deviceUid) {
        deviceUid = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    }

    await saveSecureStore(STORE_KEY.DEVICE_UID, deviceUid);
    return deviceUid;
}

/**
 * 공통 콘솔 로그
 * @param logType 
 * @param logMessages
 */
function printCommLog(logType: string = COMM_CONSTANTS.COMM_INFO, ...logMessages: string[]) {
    let logMessage = logMessages.join(" ");
    switch (logType) {
        case COMM_CONSTANTS.COMM_INFO : console.log(logMessage);
        break;
        case COMM_CONSTANTS.COMM_DEBUG : console.debug(logMessage);
        break;
        case COMM_CONSTANTS.COMM_ERROR : console.error(logMessage);
        break;
    }
}

/**
 * Info Log
 * @param logMessage 
 */
function printInfoLog(...logMessage: string[]) {
    printCommLog(COMM_CONSTANTS.COMM_INFO, ...logMessage);
}

/**
 * Debug Log
 * @param logMessage 
 */
function printDebugLog(...logMessage: string[]) {
    printCommLog(COMM_CONSTANTS.COMM_DEBUG, ...logMessage);
}

/**
 * Error Log
 * @param logMessage 
 */
function printErrorLog(...logMessage: string[]) {
    printCommLog(COMM_CONSTANTS.COMM_ERROR, ...logMessage);
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
        await saveSecureStore(STORE_KEY.MEM_ID,             String(data.mem_id));
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
    const mem_id        = await getSecureStore(STORE_KEY.MEM_ID);
    const mem_name      = await getSecureStore(STORE_KEY.MEM_NAME);
    const mem_nick      = await getSecureStore(STORE_KEY.MEM_NICK);
    const mem_team      = await getSecureStore(STORE_KEY.MEM_TEAM);
    const mem_gender    = await getSecureStore(STORE_KEY.MEM_GENDER);
    const mem_birth     = await getSecureStore(STORE_KEY.MEM_BIRTH);
    const mem_telno     = await getSecureStore(STORE_KEY.MEM_TELNO);
    const mem_addr      = await getSecureStore(STORE_KEY.MEM_ADDR);
    const mem_interest  = await getSecureStore(STORE_KEY.MEM_INTEREST);
    
    return {
        mem_id          : Number(mem_id) || 0,
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

// AsyncStore에서 데이터 가져올 때, parser 함수를 통해 원하는 타입으로 변환하여 반환하는 유틸 함수
async function getAsyncData<T = string>(key: string, parser?: (raw: string) => T): Promise<T | null> {
    const s_data = await getAsyncStore(key);

    if (!s_data) {
        return null;
    }

    if (!parser) {
        return s_data as T;
    }

    try {
        return parser(s_data);
    }
    catch (error) {
        console.log('getAsyncData parse Error : ', error);
        return null;
    }
}

// 취미 카테고리 set/get 함수
async function setCategoryList(data?: any) {
    if (data) {
        await saveAsyncStore(STORE_KEY.CATEGORY_LIST, JSON.stringify(data));
    }
}
async function getCategoryList(): Promise<CodeInfo[]> {
    return await getAsyncData<CodeInfo[]>(STORE_KEY.CATEGORY_LIST, JSON.parse) ?? [];
}

// 참가비 정보 set/get 함수
async function setFeeList(data: any) {
    if (data) {
        await saveAsyncStore(STORE_KEY.FEE_LIST, JSON.stringify(data));
    }
}
async function getFeeList(): Promise<CodeInfo[]> {
    return await getAsyncData<CodeInfo[]>(STORE_KEY.FEE_LIST, JSON.parse) ?? [];
}

// 날짜 관련 함수 (AI Generated - 2024.06.11)
function formatYmdDate(date: Date) {
    return formatYmdDateFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
}
function formatYmdDateFromParts(year: number, month: number, day: number) {
    const pad2 = (value: number) => `${value}`.padStart(2, '0');
    return `${year}-${pad2(month)}-${pad2(day)}`;
}
function parseYmdDate(value?: string) {
    if (!value) {
        return null;
    }

    const matched = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!matched) {
        return null;
    }

    const [, rawYear, rawMonth, rawDay] = matched;
    const year = Number(rawYear);
    const month = Number(rawMonth);
    const day = Number(rawDay);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year
        || date.getMonth() !== month - 1
        || date.getDate() !== day
    ) {
        return null;
    }

    return { year, month, day, date,};
}
function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
}
function getDefaultBirthDate() {
    const now = new Date();
    const defaultDate = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate());
    return formatYmdDate(defaultDate);
}
function formatDisplayBirthDate(value?: string) {
    const parsed = parseYmdDate(value);

    if (!parsed) {
        return '';
    }

    return formatYmdDateFromParts(parsed.year, parsed.month, parsed.day);
}

// 이미지 리스트 JSON 문자열을 FileInfo[] 타입으로 파싱하는 함수
function parseImageList(imgListJson?: string): FileInfo[] {
    if (!imgListJson) {
        return [];
    }

    try {
        const parsed = JSON.parse(imgListJson);
        return Array.isArray(parsed) ? parsed as FileInfo[] : [];
    }
    catch {
        return [];
    }
}

export { getAccessToken, getCategoryList, getClientId, getDeviceUid, getMemberInfo, getOsId, getRefreshToken, saveMemberInfo, setCategoryList, printCommLog, printInfoLog, printDebugLog, printErrorLog, setFeeList, getFeeList, formatYmdDate, formatYmdDateFromParts, parseYmdDate, getDaysInMonth, getDefaultBirthDate, formatDisplayBirthDate, parseImageList };

