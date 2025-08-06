import queryClient from '@/api/queryClient';
import { userAutoLogin, userLogin, userSignup } from '@/api/user';
import { STORE_KEY } from '@/constants';
import { ApiResult, MemberInfo, Token } from '@/types';
import { showToast } from '@/utils/commToast';
import { saveMemberInfo } from '@/utils/commUtil';
import { removeHeader, setHeader } from '@/utils/headerUtil';
import { deleteSecureStore } from '@/utils/secureStoreUtil';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

type ResponseError = AxiosError<{
    statusCode: number;
    message:string;
    error:string;
}>

function useSignup() {
    return useMutation({
        mutationFn: userSignup,
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
            Toast.show({
                type: 'error',
                text1: error.response?.data.message
            })
        },
        onSettled: () => {},
    });
}

function useLogin() {
    return useMutation({
        mutationFn: userLogin,
        onSuccess: async (result: ApiResult<MemberInfo & Token>) => {
            if (result.ret_code != 200) {
                showToast({
                    text1: result.ret_msg
                });
            }
            else {
                // Header 세팅 및 회원 정보 SecureStore에 저장
                setHeader(STORE_KEY.X_ACCESS_TOKEN,     result.data?.access_token)
                setHeader(STORE_KEY.X_REFRESH_TOKEN,    result.data?.refresh_token)
                saveMemberInfo(result.data);
                router.replace("/");
                showToast({
                    text1: "로그인하였습니다."
                });
            }
        },
        onError: (error: ResponseError) => {
            console.log('error : ', error);
        },
        onSettled: () => {},
    });
}

function useAutoLogin() {
    return useMutation({
        mutationFn: userAutoLogin,
        onSuccess: async (result: ApiResult<MemberInfo & Token>) => {
            if (result.ret_code != 200) {
                removeHeader(STORE_KEY.X_ACCESS_TOKEN);
                removeHeader(STORE_KEY.X_REFRESH_TOKEN);
            }
            else {
                // Header 세팅 및 회원 정보 SecureStore에 저장
                setHeader(STORE_KEY.X_ACCESS_TOKEN,     result.data?.access_token)
                setHeader(STORE_KEY.X_REFRESH_TOKEN,    result.data?.refresh_token)
                saveMemberInfo(result.data);
            }
        },
        onError: (error: ResponseError) => {
            console.log('error : ', error);
        },
        onSettled: () => {},
    });
}

function useAuth() {
    const loginMutation = useLogin();
    const signupMutation = useSignup();
    const autoLoginMutation = useAutoLogin();

    const logout = () => {
        removeHeader("Authorization");
        deleteSecureStore("accessToken");
        queryClient.resetQueries({ queryKey: ["auth"]});
    }

    return { loginMutation, signupMutation, autoLoginMutation, logout};
}

export default useAuth;