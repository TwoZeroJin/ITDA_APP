/**
 * API 공통 결과
 */
interface ApiResult<T> {
  ret_code  : number;
  ret_msg   : string;
  ext_msg   : string;
  paging?   : {
    page_no       : number;
    page_size     : number;
    total_count   : number;
  };
  data?     : T;
}

interface SearchParams {
  page_no         : number;
  page_size       : number;
  search_type?    : string;
  sch_condition?  : string;
  search_text?    : string;
  mem_id?         : number;
}

/**
 * 토큰 정보
 */
interface Token {
  access_token   : string;
  refresh_token  : string;
}

/**
 * 앱 초기 데이터
 */
interface AppData {
  app_ver_name  : string;
  category_list : CodeInfo[];
  fee_list      : CodeInfo[];
  banner_list?  : BannerData[];
  church_list   : ChurchData[];
}

/**
 * 메인 화면 데이터
 */
interface MainData {
  upcoming_meet_list?   : MeetInfo[];
  hot_meet_list?        : MeetInfo[];
  recommend_meet_list?  : MeetInfo[];
  new_class_list?       : MeetInfo[];
  review_list?          : MeetReview[];
}

/**
 * 로그인 정보
 */
interface User {
  login_id        : string;
  login_pwd       : string;
  login_type      : string;
  push_token?     : string;
}

/**
 * 교회 정보
 */
interface ChurchData {
  church_id       : number;
  church_name     : string;
  church_addr?     : string;
}

/**
 * 회원가입 정보
 */
interface SignupInfo extends User {
  mem_name          : string;
  mem_nick?         : string;
  mem_gender        : string;
  mem_team          : string;
  mem_birth         : string;
  mem_telno         : string;
  mem_addr?         : string;
  mem_interest?     : string;
  mem_church_id?    : number;
  mem_church_tm_nm? : string;
  mem_image_id?     : string;
  new_image_name?   : string;
}

/**
 * 회원 정보
 */
interface MemberInfo {
  mem_id?           : number;
  mem_name          : string;
  mem_nick?         : string;
  mem_gender        : string;
  mem_birth?        : string;
  mem_telno?        : string;
  mem_addr?         : string;
  mem_interest?     : string;
  mem_church_id?    : number;
  mem_church_nm?    : string;
  mem_church_tm_nm? : string;
  push_send_yn      : string;
  push_token?       : string;
  mem_image_url?    : string;
  mem_image_id?     : string;
  new_image_name?   : string;
  host_yn        : string;
}

/**
 * 회원 상세 정보 (다가올 모임, 참여 내역, 후기 내역 등)
 */
interface MemberDetail extends MemberInfo {
  upcoming_meet_list?   : MeetInfo[];
  meet_history_list?    : MeetInfo[];
  review_list?          : MeetReview[];
}

/**
 * 회원 좋아요 정보
 */
interface MemberLike {
  target_id       : number;
  target_type     : string;
  flag            : boolean;
}

/**
 * 좋아요한 데이터
 */
interface LikeData {
  target_id         : number;
  target_type       : string;
  target_name       : string;
  target_subj_name  : string;
  thumb_url?        : string;
}

/**
 * 파일 정보
 */
interface FileInfo {
  file_id       : string;
  file_url      : string;
  file_path     : string;
  file_name     : string;
  file_order    : number;
  target_id     : number;
  target_type   : string;
  org_name      : string;
  sav_name      : string;
  new_file_name : string;
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
  fee_desc      : string;
  place_type    : string;
  place_name    : string;
  place_addr    : string;
  mem_id        : number;
  mem_name      : string;
  mem_nick      : string;
  mem_image_url? : string;
  group_id      : number;
  apply_ratio   : string;
  thumb_url?    : string;
  // 서버에 넘기기 위한 이미지 데이터 json 문자열 (프론트에서만 사용)
  img_list_json? : string;
  img_list? : FileInfo[];

}

/**
 * 소모임 신청
 */
interface MeetApply {
  meet_id       : number;
  mem_id        : number;
  meet_answer?  : string;
  use_stat      : string;
}

/**
 * 소모임 후기 정보
 */
interface MeetReview {
  review_id?      : number;
  content_type    : string;
  review_content  : string;
  tag             : string;
  place_addr      : string;
  meet_id         : number;
  mem_name        : string;
  mem_id          : number;
  reg_sdate       : string;
  mod_sdate       : string;
  use_stat        : string;
  thumb_url?      : string;

  // 중첩된 VO 객체 처리
  memMeetListVO?: MyMeetInfo;

  fileInfoVO? : FileInfo[];
}
/**
 * 내가 신청한 모임 정보
 * 후기작성가능한 모임 정보 조회
 */
interface MyMeetInfo {
  meet_id?        : number;
  meet_name       : string;
  place_addr      : string;
  mem_id          : number;
  mem_name        : string;
  apply_ratio     : string;
  thumb_url  : string;
}

/**
 * 공동체 정보
 */
interface GroupInfo {
  group_id        : number;
  group_name      : string;
  group_subj      : string;
  group_desc      : string;
  group_max       : number;
  group_question  : string;
  apply_type      : string;
  thumb_url?      : string;

  mem_id        : number;
  mem_name      : string;
  mem_nick      : string;
  mem_image_url? : string;

  // 서버에 넘기기 위한 이미지 데이터 json 문자열 (프론트에서만 사용)
  img_list_json? : string;
  img_list? : FileInfo[];

}

/**
 * 공동체 회원 매핑
 */
interface GroupApply {
  group_id      : number;
  mem_id        : number;
  group_answer? : string;
  use_stat      : string;
}

/**
 * 공지사항 / FAQ 정보
 */
interface BoardNotice {
  noti_id       : number;
  noti_subject  : string;
  noti_content  : string;
  noti_top_yn   : string;
  reg_sdate     : string;
}

/**
 * 개선, 의견 정보
 */
interface FeedbackData {
  feed_id         : number;
  feed_subject    : string;
  feed_content    : string;
  reg_sdate       : string;
}

/**
 * 채팅방 정보
 */
interface RoomData {
  room_id         : string;
  room_name       : string;
  room_type       : string;
  mem_id          : number;
  reg_sdate       : string;
  mod_sdate       : string;
  last_msg?       : string;
  thumb_url?      : string;
}
/**
 * 채팅 정보
 */
interface ChatData {
  chat_id     : number;
  chat_type   : 'MEMBER' | 'MEET' | 'GROUP';
  chat_msg    : string;
  room_id     : string;
  sender_id?  : number;
  mem_name?   : string;
  send_date   : string;
}

/**
 * 앱에서 사용할 공통 코드 정보
 */
interface CodeInfo {
  code_id         : string;
  code_value      : string;
  code_image_url? : string;
  sub_list?       : CodeInfo[];
}

interface BannerData {
  banner_image_url : string;
  banner_link_url? : string;
}

export type { ApiResult, SearchParams, BoardNotice, ChatData, RoomData, CodeInfo, FeedbackData, FileInfo, GroupInfo, GroupApply, AppData, MeetApply, MeetInfo, MeetReview, MemberInfo, MemberDetail, SignupInfo, Token, User, MyMeetInfo, BannerData, ChurchData, MainData, MemberLike, LikeData };
