import queryClient from '@/api/queryClient';
import { QUERY_KEYS, STORE_KEY } from '@/constants';
import { MqttUtil } from '@/utils/mqttUtil';
import { deleteSecureStore } from '@/utils/secureStoreUtil';
import { router } from 'expo-router';

const QUERY_KEYS_TO_RESET = [
  QUERY_KEYS.USER,
  QUERY_KEYS.MAIN,
  QUERY_KEYS.MEMBER,
  QUERY_KEYS.PUSH,
  QUERY_KEYS.CHAT,
  QUERY_KEYS.MEET,
  QUERY_KEYS.GROUP,
  QUERY_KEYS.COMMUNITY,
  QUERY_KEYS.FEEDBACK,
  QUERY_KEYS.NOTICE,
];

async function deleteSecureStoreForMember() {
  await Promise.all([
    deleteSecureStore(STORE_KEY.X_ACCESS_TOKEN),
    deleteSecureStore(STORE_KEY.X_REFRESH_TOKEN),
    deleteSecureStore(STORE_KEY.MEM_ID),
    deleteSecureStore(STORE_KEY.MEM_NAME),
    deleteSecureStore(STORE_KEY.MEM_NICK),
    deleteSecureStore(STORE_KEY.MEM_GENDER),
    deleteSecureStore(STORE_KEY.MEM_BIRTH),
    deleteSecureStore(STORE_KEY.MEM_TELNO),
    deleteSecureStore(STORE_KEY.MEM_ADDR),
    deleteSecureStore(STORE_KEY.MEM_INTEREST),
    deleteSecureStore(STORE_KEY.MEM_IMAGE_URL),
    deleteSecureStore(STORE_KEY.MEM_CHURCH_NM),
    deleteSecureStore(STORE_KEY.MEM_CHURCH_TM_NM),
    deleteSecureStore(STORE_KEY.PUSH_SEND_YN),
    deleteSecureStore(STORE_KEY.PUSH_TOKEN),
    deleteSecureStore(STORE_KEY.TOPIC_LIST),
  ]);
}

/**
 * 토큰 및 회원정보 삭제 후 로그인 화면으로 이동
 * 훅이 아닌 일반 함수라 컴포넌트 밖(axios 인터셉터 등)에서도 호출 가능
 */
async function logoutUser() {
  await deleteSecureStoreForMember();
  MqttUtil.disconnect();

  await Promise.all(
    QUERY_KEYS_TO_RESET.map((queryKey) =>
      queryClient.removeQueries({ queryKey: [queryKey], exact: false })
    )
  );

  router.replace("/" as any);
}

export { logoutUser, deleteSecureStoreForMember };
