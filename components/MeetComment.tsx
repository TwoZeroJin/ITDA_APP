import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import ProfileIcon from "@/components/ProfileIcon";

interface CommentItemType {
  mem_id: string;
  comment_id: string;
  mem_name: string;
  time: string;
  content: string;
  profile_image_url: string;
}
interface CommentTypeProps {
  data: CommentItemType; // 👈 data라는 변수를 선언하고 타입을 매핑
}
export default function MeetComment({data}: CommentTypeProps) {
  const [comment, setComment] = useState('');


  return (
    <View style={styles.commentItem}>
      <ProfileIcon mem_image_url={data.profile_image_url} type="MEMBER" />
      <View style={styles.commentContent}>
        <Text style={styles.userName}>{data.mem_name}</Text>
        <Text style={styles.timeText}>{data.time}</Text>
        <Text style={styles.contentText}>{data.content}</Text>
      </View>
    </View>

  )

};


const styles = StyleSheet.create({
  commnetContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  commnetHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  commnetHeaderTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  commnetListContent: {
    paddingHorizontal: 20,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  commentContent: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 13,
    color: '#999',
    marginVertical: 2,
  },
  contentText: {
    fontSize: 15,
    color: '#444',
    marginTop: 4,
  },

  commentSeparator: {
    height: 1,
    backgroundColor: '#eee',
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  myProfileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  commentInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  commentSendButton: {
    backgroundColor: '#FF5A5F', // 이미지의 주황/빨강 버튼 색상
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSendIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

