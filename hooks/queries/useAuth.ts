import queryClient from '@/api/queryClient';
import { userAutoLogin, userLogin, userSignup } from '@/api/user';
import { useLoading } from '@/contexts/LoadingContext';
import { QUERY_KEYS, STORE_KEY } from '@/constants';
import { ApiResult, MemberInfo, SignupInfo, Token, User } from '@/types';
import { showToast } from '@/utils/commToast';
import { printDebugLog, saveMemberInfo } from '@/utils/commUtil';
import { deleteSecureStore } from '@/utils/secureStoreUtil';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { router } from 'expo-router';
import { useEffect } from 'react';

type ResponseError = AxiosError<{
  statusCode  : number;
  message     : string;
  error       : string;
}>

function useSignup() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : SignupInfo) => {
      setLoading(true);
      return userSignup(body);
    },
    onSuccess: async (result : ApiResult<null>) => {
      if (result.ret_code != 200) {
        showToast({
          text1: result.ret_msg
        });
      }
      else {
        showToast({
          text1: '회원가입되었습니다. 로그인해주세요.'
        });
        router.replace("/user/login");
      }
    },
    onError: (error: ResponseError) => {
      showToast({
        type: 'error',
        text1: error.response?.data.message || error.message || '회원가입 처리중 오류가 발생했습니다.'
      })
    },
    onSettled: () => {
        setLoading(false);
    },
  });
}

function useLogin() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : User) => {
      setLoading(true);
      return userLogin(body);
    },
    onSuccess: async (result: ApiResult<MemberInfo & Token>) => {
      if (result.ret_code != 200) {
        showToast({
          text1: result.ret_msg
        });
      }
      else {
        // 회원 정보 SecureStore에 저장
        saveMemberInfo(result.data);
        router.replace("/");
        showToast({
          text1: "로그인하였습니다."
        });
      }
    },
    onError: (error: ResponseError) => {
      showToast({
        type: 'error',
        text1: error.response?.data.message || error.message || '로그인 처리중 오류가 발생했습니다.'
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

function useAutoLogin(options = {enabled : false}) {
  const { data, isError, isSuccess } = useQuery({
    queryFn: userAutoLogin,
    queryKey: [QUERY_KEYS.USER , "auto_login"],
    enabled : options.enabled ?? true
  });

  useEffect(() => {
    (async () => {
      if (isSuccess) {
        if (data.ret_code == 200 && data.data) {
          saveMemberInfo(data.data);
        }
        else {
          // 자동 로그인 실패
          deleteSecureStoreForMember();
        }
      }
    })()
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      printDebugLog('자동 로그인 실패', JSON.stringify(isError));
    }
  }, [isError])

  return { data };
}

function useAuth() {
    const loginMutation     = useLogin();
    const signupMutation    = useSignup();

    // 토큰 및 회원정보 삭제
    const logout = () => {
        deleteSecureStoreForMember();
        queryClient.resetQueries({ queryKey: [QUERY_KEYS.USER]});
        router.replace("/user" as any);
    }

    return { loginMutation, signupMutation, logout };
}

function deleteSecureStoreForMember() {
  deleteSecureStore(STORE_KEY.X_ACCESS_TOKEN);
  deleteSecureStore(STORE_KEY.X_REFRESH_TOKEN);
  deleteSecureStore(STORE_KEY.MEM_ID);
  deleteSecureStore(STORE_KEY.MEM_NAME);
  deleteSecureStore(STORE_KEY.MEM_NICK);
  deleteSecureStore(STORE_KEY.MEM_GENDER);
  deleteSecureStore(STORE_KEY.MEM_BIRTH);
  deleteSecureStore(STORE_KEY.MEM_TELNO);
  deleteSecureStore(STORE_KEY.MEM_ADDR);
  deleteSecureStore(STORE_KEY.MEM_INTEREST);
  deleteSecureStore(STORE_KEY.MEM_IMAGE_URL);
  deleteSecureStore(STORE_KEY.MEM_CHURCH_NM);
  deleteSecureStore(STORE_KEY.MEM_CHURCH_TM_NM);
  deleteSecureStore(STORE_KEY.PUSH_SEND_YN);
  deleteSecureStore(STORE_KEY.PUSH_TOKEN);
}

export { useAuth, useAutoLogin };