import { mainEntry } from '@/api/main';
import { userRefreshToken } from '@/api/user';
import { STORE_KEY } from '@/constants';
import { deleteSecureStore, saveSecureStore } from '@/utils/secureStoreUtil';
import { setCategoryList, setFeeList } from '@/utils/commUtil';
import { useQuery } from '@tanstack/react-query';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { DevSettings } from 'react-native';
import { AxiosError } from 'axios';

function useMainEntry() {
    const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);

    //
    const { data, isError, isSuccess, error, refetch } = useQuery({
        queryFn: mainEntry,
        queryKey: ["main" , "entry"],
        retry: 1,
    });
    //
    useEffect(() => {
        if (isSuccess) {
            // App에 필요한 정보 SecureStore(중요정보) 및 AsyncStore(비중요정보)에 세팅
            setCategoryList(data?.data?.category_list);
            setFeeList(data?.data?.fee_list);
        }
    }, [isSuccess, data])

    useEffect(() => {
        if (!isError) {
            return;
        }

        const status = (error as AxiosError | null)?.response?.status;

        // Main 호출시 401 에러 발생 -> 토큰 갱신 시도 -> 갱신 성공 시 Main 재호출
        if (status === 401) {

            (async () => {
                try {
                    const refreshResult = await userRefreshToken();

                    if (refreshResult.ret_code === 200 && refreshResult.data) {
                        await saveSecureStore(STORE_KEY.X_ACCESS_TOKEN,     refreshResult.data.access_token);
                        await saveSecureStore(STORE_KEY.X_REFRESH_TOKEN,    refreshResult.data.refresh_token);
                        await refetch();
                        return;
                    }
                    else {
                        // 토큰 발급 실패시 토큰 제거
                        await deleteSecureStore(STORE_KEY.X_ACCESS_TOKEN);
                        await deleteSecureStore(STORE_KEY.X_REFRESH_TOKEN);
                    }

                    setIsErrorDialogVisible(true);
                } catch {
                    setIsErrorDialogVisible(true);
                }
            })();

            return;
        }

        setIsErrorDialogVisible(true);
    }, [isError, error, refetch]);

    const handleRetryMainEntry = () => {
        setIsErrorDialogVisible(false);
        refetch();
    };

    const handleRestartApp = async () => {
        try {
            if (__DEV__) {
                DevSettings.reload();
                return;
            }

            await Updates.reloadAsync();
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : typeof error === 'string'
                        ? error
                        : JSON.stringify(error);

            console.log('앱 재시작 실패', errorMessage);
            setIsErrorDialogVisible(false);
        }
    };

    const handleCloseErrorDialog = () => {
        setIsErrorDialogVisible(false);
    };

    return {
        data,
        isErrorDialogVisible,
        handleRetryMainEntry,
        handleRestartApp,
        handleCloseErrorDialog,
    };
}

export default useMainEntry;