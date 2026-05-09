// 앱 내 상수 값

/**
 * 컬러 값
 */
const COLOR = {
    COMM_MODAL_BG       : 'rgba(0, 0, 0, 0.4)',
    COMM_BLACK          : '#000000',
    COMM_WHITE          : '#FFFFFF',
    COMM_GRAY           : '#F2F2F2',
    COMM_GRAY_2         : '#A4A4A4',
    COMM_GRAY_3         : '#0E0E0E',
    COMM_GRAY_4         : '#EDEDED',
    COMM_GRAY_5         : '#F4F4F4',
    COMM_GRAY_6         : '#DBDBDB',
    COMM_GRAY_7         : '#9D9D9D',
    COMM_GRAY_8         : '#F1F1F1',
    COMM_GRAY_9         : '#8A8A8A',
    COMM_RED            : '#FF0000',
    COMM_SHADOW         : '#747474',
    APP_MAIN            : '#F58A78',
    APP_ACTIVE_1        : '#FF826D',
    APP_ACTIVE_2        : '#71C6BC',
    APP_ACTIVE_3        : '#F38074',
    APP_ACTIVE_4        : '#FF817C',
    APP_ACTIVE_5        : '#FF5047',
    TEXT_DEFAULT        : '#555555',
    TEXT_GRAY           : '#9B9B9B',
    TEXT_WARN           : '#FF0000',
    TEXT_TITLE          : '#333333',
    TEXT_2F2F2F         : '#2F2F2F',
    TEXT_31AD69         : '#31AD69',
    TEXT_3C3C3C         : '#3C3C3C',
    TEXT_1C1C1C         : '#1C1C1C',
    BG_MEET             : '#F6554C',
    BG_CLUB             : '#E2FBED',
    BG_CATEGORY         : '#F3F3F3',
    COLOR_SOCIAL        : '#FF5047',
    COLOR_CLUB          : '#6F5ADB',
    COLOR_CLASS         : '#50C8D7',
    COLOR_323232        : '#323232',
    COLOR_373737        : '#373737',
    COLOR_5537CD        : '#5537CD',
    COLOR_6B6B6B        : '#6B6B6B',
};

/**
 * 쿼리 키 값
 */
const QUERY_KEYS = {
    USER                    : "user",
    MAIN                    : "main",
    MAIN_ENTRY              : "main_entry",
    MAIN_DATA               : "main_data",
    MEMBER                  : "member",
    MEMBER_DETAIL           : "member_detail",
    MEMBER_UPDATE           : "member_update",
    CHAT                    : "chat",
    CHAT_LIST               : "chat_list",
    CHAT_PAGING             : "chat_paging",
    CHAT_MEMBER_LIST        : "chat_member_list",
    MEET                    : "meet",
    MEET_PAGING             : "meet_paging",
    MEET_VIEW               : "meet_view",
    MEET_MEMBER_LIST        : "meet_member_list",
    MEET_COMMENT_LIST       : "meet_comment_list",
    MEET_REVIEW_LIST    : "meet_review_list",
    MEET_INSERT             : "meet_insert",
    GROUP                   : "group",
    GROUP_PAGING            : "group_paging",
    COMMUNITY               : "community",
    COMMUNITY_REVIEW_LIST   : "community_review_list",
    MY_MEET_LIST_NO_REVIEW  : "my_meet_list_no_review",
    FEEDBACK                : "feedback",
    FEEDBACK_PAGING         : "feedback_paging",
    FEEDBACK_VIEW           : "feedback_view",
    FEEDBACK_INSERT         : "feedback_insert",
    NOTICE                  : "notice",
    NOTICE_PAGING           : "notice_paging",
    NOTICE_VIEW             : "notice_view",
};

/**
 * SecureStore/AsyncStore Key 값
 */
const STORE_KEY = {
    X_ACCESS_TOKEN      : "x-access-token",
    X_REFRESH_TOKEN     : "x-refresh-token",
    CATEGORY_LIST       : "category_list",
    FEE_LIST            : "fee_list",
    MAIN_BANNER_LIST    : "main_banner_list",
    CHURCH_LIST         : "church_list",
    MEM_ID              : "mem_id",
    MEM_NAME            : "mem_name",
    MEM_NICK            : "mem_nick",
    MEM_TEAM            : "mem_team",
    MEM_GENDER          : "mem_gender",
    MEM_BIRTH           : "mem_birth",
    MEM_TELNO           : "mem_telno",
    MEM_ADDR            : "mem_addr",
    MEM_INTEREST        : "mem_interest",
    MEM_IMAGE_URL       : "mem_image_url",
    MEM_CHURCH_NM       : "mem_church_nm",
    MEM_CHURCH_TM_NM    : "mem_church_tm_nm",
    PUSH_SEND_YN        : "push_send_yn",
    PUSH_TOKEN          : "push_token",
    DEVICE_UID          : "device_uid",
}

/**
 * 공통 상수 값
 */
const COMM_CONSTANTS = {
    COMM_INFO                   : "info",
    COMM_ERROR                  : "error",
    COMM_DEBUG                  : "debug",
    MEET_SOCIAL                 : "social",
    MEET_CLUB                   : "club",
    MEET_CLASS                  : "class",
    MEET_TYPE_NORMAL            : "N",
    MEET_TYPE_GROUP             : "G",
    MEET_APPLY_TYPE_FIRST       : "F",
    MEET_APPLY_TYPE_APPROVE     : "A",
}

/**
 * API URL 정의
 */
const API_URL = {
    MAIN_ENTRY          : "/main/entry",
    MAIN_DATA           : "/main/data",
    USER_SIGNUP         : "/user/signup",
    USER_LOGIN          : "/user/login",
    USER_AUTO_LOGIN     : "/user/auto_login",
    USER_REFRESH_TOKEN  : "/user/refresh_token",
    MEMBER_DETAIL       : "/member/detail",
    MEMBER_UPDATE       : "/member/update",
    CHAT_LIST           : "/chat/list",
    CHAT_VIEW           : "/chat/view",
    CHAT_INSERT         : "/chat/insert",
    CHAT_MEMBER_LIST    : "/chat/mem_list",
    MEET_LIST           : "/meet/list",
    MEET_VIEW           : "/meet/view",
    MEET_INSERT         : "/meet/insert",
    MEET_UPDATE         : "/meet/update",
    MEET_DELETE         : "/meet/delete",
    MEET_APPLY          : "/meet/apply",
    MEET_CONFIRM        : "/meet/confirm",
    MEET_DETAIL         : "/meet/view",
    MEET_MEMBER_LIST    : "/meet/member_list",
    REVIEW_LIST         : "/review/list",
    REVIEW_INSERT       : "/review/insert",
    MY_MEET_LIST_NO_REVIEW : "/review/my_meet_list_no_review",
    REVIEW_DELETE       : "/review/delete", // 추가된 후기 삭제 API
    REVIEW_UPDATE       : "/review/update", // 추가된 후기 수정 API
    GROUP_LIST          : "/group/list",
    GROUP_VIEW          : "/group/view",
    GROUP_INSERT        : "/group/insert",
    GROUP_UPDATE        : "/group/update",
    GROUP_DELETE        : "/group/delete",
    GROUP_APPLY         : "/group/apply",
    GROUP_CONFIRM       : "/group/confirm",
    FILE_UPLOAD         : "/file/file_upload",
    FILES_UPLOAD        : "/file/files_upload",
    NOTICE_LIST         : "/notice/list",
    NOTICE_VIEW         : "/notice/view",
    FEEDBACK_LIST       : "/feedback/list",
    FEEDBACK_VIEW       : "/feedback/view",
    FEEDBACK_INSERT     : "/feedback/insert",
}

export { COLOR, QUERY_KEYS, STORE_KEY, COMM_CONSTANTS, API_URL };
