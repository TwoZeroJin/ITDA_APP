import queryClient from '@/api/queryClient';
import { userAutoLogin, userLogin, userSignup } from '@/api/user';
import { removeHeader, setHeader } from '@/utils/header';
import { deleteSecureStore, saveSecureStore } from '@/utils/secureStore';
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
        onSuccess: () => router.replace("/user/login"),
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
        onSuccess: async ({accessToken}) => {
            setHeader("Authorization", `Bearer ${accessToken}`);
            await saveSecureStore("accessToken", accessToken);
            queryClient.fetchQuery({queryKey: ["auth", "getMe"]});
            router.replace("/");
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

function useAutoLogin() {
    return useMutation({
        mutationFn: userAutoLogin,
        // onSuccess: async ({accessToken}) => {
        //     setHeader("Authorization", `Bearer ${accessToken}`);
        //     await saveSecureStore("accessToken", accessToken);
        //     queryClient.fetchQuery({queryKey: ["auth", "getMe"]});
        //     router.replace("/");
        // },
        // onError: (error: ResponseError) => {
        //     Toast.show({
        //         type: 'error',
        //         text1: error.response?.data.message
        //     })
        // },
        // onSettled: () => {},
    });
}

function useGetMe() {
    // const { data, isError, isSuccess } = useQuery({
    //     queryFn: getMe,
    //     queryKey: ["auth", "getMe"]
    // });

    // useEffect(() => {
    //     (async () => {
    //         if (isSuccess) {
    //             const accessToken = await getSecureStore('accessToken');
    //             setHeader("Authorization", `Bearer ${accessToken}`);
    //         }
    //     })()
    // }, [isSuccess])

    // useEffect(() => {
    //     if (isError) {
    //         removeHeader("Authorization");
    //         deleteSecureStore("accessToken");
    //     }
    // }, [isError])

    // return { data };
}

function useAuth() {
    // const { data } = useGetMe();
    const loginMutation = useLogin();
    const signupMutation = useSignup();
    const autoLoginMutation = useAutoLogin();

    const logout = () => {
        removeHeader("Authorization");
        deleteSecureStore("accessToken");
        queryClient.resetQueries({ queryKey: ["auth"]});
    }

    return { loginMutation, signupMutation, autoLoginMutation, logout, auth: {
        // id: data?.id || "",
        // nickname: data?.nickname || "",
        // imageUri: data?.imageUri || "",
        // introduce: data?.introduce || "",
        // hatId: data?.hatId || '',
        // faceId: data?.faceId || '',
        // topId: data?.topId || '',
        // bottomId: data?.bottomId || '',
        // handId: data?.handId || '',
        // skinId: data?.skinId || '',
    } };
}

export default useAuth;