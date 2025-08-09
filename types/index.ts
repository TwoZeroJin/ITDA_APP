/**
 * API 공통 결과
 */
interface ApiResult<T> {
  ret_code  : number;
  ret_msg   : string;
  data?     : T;
}

interface MainData {
  app_ver_name  : string;
  category_list : CodeInfo[];
}

interface Token {
  access_token   : string;
  refresh_token  : string;
}

/**
 * 로그인 정보
 */
interface User {
  login_id        : string;
  login_pwd       : string;
  login_type      : string;
}

/**
 * 회원가입 정보
 */
interface SignupInfo extends User {
  mem_name      : string;
  mem_nick?     : string;
  mem_gender    : string;
  mem_team      : string;
  mem_birth     : string;
  mem_telno     : string;
  mem_addr?     : string;
  mem_interest? : string;
}

/**
 * 회원 정보
 */
interface MemberInfo {
  mem_name      : string;
  mem_nick?     : string;
  mem_gender    : string;
  mem_team      : string;
  mem_birth     : string;
  mem_telno     : string;
  mem_addr?     : string;
  mem_interest? : string;
  church_name   : string;
  push_send_yn  : string;
  push_token?   : string;
  mem_image?    : string;
}

/**
 * 파일 정보
 */
interface FileInfo {
  file_id     : string;
  file_name   : string;
  file_path   : string;
  file_order  : number;
  target_id   : number;
  target_type : string;
}

/**
 * 소모임 정보
 */
interface MeetInfo {
  meet_id       : number;
  meet_name     : string;
  meet_type     : string;
  meet_subj     : string;
  meet_datetime : string;
  meet_desc     : string;
  meet_min      : number;
  meet_max      : number;
  meet_question : string;
  age_min       : number;
  age_max       : number;
  gender_ratio  : number;
  apply_type    : string;
  fee_yn        : string;
  fee_info      : string;
  fee_entry     : number;
  place_type    : string;
  place_addr    : string;
  mem_id        : number;
  group_id      : number;
}

/**
 * 소모임 신청
 */
interface MeetApply {

}

/**
 * 소모임 후기 정보
 */
interface MeetReview {

}

/**
 * 공동체 정보
 */
interface GroupInfo {

}

/**
 * 공동체 회원 매핑
 */
interface GroupMember {

}

/**
 * 공지사항 / FAQ 정보
 */
interface BoardData {

}

/**
 * 개선, 의견, 정보
 */
interface FeedBackData {

}

/**
 * 채팅 정보
 */
interface ChatData {
  mem_id : number;
  chat_msg : string;
}

/**
 * 앱에서 사용할 공통 코드 정보
 */
interface CodeInfo {
  code_id     : string;
  code_value  : string;
  sub_list?   : CodeInfo[];
}

export type { ApiResult, BoardData, CodeInfo, FeedBackData, FileInfo, GroupInfo, GroupMember, MainData, MeetApply, MeetInfo, ChatData, MeetReview, MemberInfo, SignupInfo, Token, User };

