import { mainEntry } from '@/api/main';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

function useMainEntry() {
    //
    const { data, isError, isSuccess } = useQuery({
        queryFn: mainEntry,
        queryKey: [ "main" , "entry"]
    });
    //
    useEffect(() => {
        (async () => {
            if (isSuccess) {
                // App에 필요한 정보 SecureStore에 세팅
            }
        })()
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            console.log('연결 실패, 앱 재실행 필요')
        }
    }, [isError])

    return { data };
}

export default useMainEntry;