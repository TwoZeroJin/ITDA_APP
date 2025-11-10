// 앱 내 상수 값

/**
 * 컬러 값
 */
const COLOR = {
    COMM_BLACK      : '#000000',
    COMM_WHITE      : '#FFFFFF',
    COMM_GRAY       : '#F2F2F2',
    COMM_GRAY_2     : '#4A4A4A',
    COMM_GRAY_3     : '#0E0E0E',
    COMM_RED        : '#FF0000',
    COMM_SHADOW     : '#747474',
    APP_MAIN        : '#F58A78',
    APP_ACTIVE_1    : '#FF826D',
    APP_ACTIVE_2    : '#71C6BC',
    TEXT_DEFAULT    : '#646464',
    TEXT_GRAY       : '#9B9B9B',
    TEXT_WARN       : '#FF0000',
    BTN_BORDER      : '#8B8B8B',
};

/**
 * 쿼리 키 값
 */
const QUERY_KEYS = {
    USER         : "user",
    MEET         : "meet",
    MEET_PAGING  : "meet_paging",
    GROUP        : "group",
    GROUP_PAGING : "group_paging"
};

/**
 * SecureStore Key 값
 */
const STORE_KEY = {
    X_ACCESS_TOKEN  : "x-access-token",
    X_REFRESH_TOKEN : "x-refresh-token",
    CATEGORY_LIST   : "category_list",
    MEM_NAME        : "mem_name",
    MEM_NICK        : "mem_nick",
    MEM_TEAM        : "mem_team",
    MEM_GENDER      : "mem_gender",
    MEM_BIRTH       : "mem_birth",
    MEM_TELNO       : "mem_telno",
    MEM_ADDR        : "mem_addr",
    MEM_INTEREST    : "mem_interest",
}

/**
 * 공통 상수 값
 */
const COMM_CONSTANTS = {
    COMM_INFO       : "info",
    COMM_ERROR      : "error",
    COMM_DEBUG      : "debug"
}

/**
 * API URL 정의
 */
const API_URL = {
    MAIN_ENTRY          : "/main/entry",
    USER_SIGNUP         : "/user/signup",
    USER_LOGIN          : "/user/login",
    USER_AUTO_LOGIN     : "/user/auto_login",
    CHAT_INSERT         : "/chat/insert",
    MEET_LIST           : "/meet/list",
    MEET_VIEW           : "/meet/view",
    MEET_INSERT         : "/meet/insert",
    MEET_UPDATE         : "/meet/update",
    MEET_DELETE         : "/meet/delete",
    MEET_APPLY          : "/meet/apply",
    MEET_CONFIRM        : "/meet/confirm",
    GROUP_LIST          : "/group/list",
    GROUP_VIEW          : "/group/view",
    GROUP_INSERT        : "/group/insert",
    GROUP_UPDATE        : "/group/update",
    GROUP_DELETE        : "/group/delete",
    GROUP_APPLY         : "/group/apply",
    GROUP_CONFIRM       : "/group/confirm",
    FILE_UPLOAD         : "/file/file_upload",
    FILES_UPLOAD        : "/file/files_upload",
}

export { COLOR, QUERY_KEYS, STORE_KEY, COMM_CONSTANTS, API_URL };
