/**
 * 로그인 정보
 */
interface User {
  login_id  : string;
  login_pwd : string;
}

/**
 * 회원 정보
 */
interface MemberInfo {
  mem_id        : number;
  mem_name      : string;
  mem_nick      : string;
  mem_gender    : string;
  mem_team      : string;
  mem_birth     : string;
  mem_telno     : string;
  mem_addr      : string;
  mem_interest  : string;
  church_name   : string;
  push_send_yn  : string;
  push_token    : string;
  mem_image     : string;
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

export type { BoardData, FeedBackData, FileInfo, GroupInfo, GroupMember, MeetApply, MeetInfo, MeetReview, MemberInfo, User };
