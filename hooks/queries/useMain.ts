import { mainEntry } from '@/api/main';
import { setCategoryList, setFeeList } from '@/utils/commUtil';
import { useQuery } from '@tanstack/react-query';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';

function useMainEntry() {
    const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);

    //
    const { data, isError, isSuccess, refetch } = useQuery({
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

        setIsErrorDialogVisible(true);
    }, [isError]);

    const handleRetryMainEntry = () => {
        setIsErrorDialogVisible(false);
        refetch();
    };

    const handleRestartApp = async () => {
        try {
            if (__DEV__) {
                refetch();
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