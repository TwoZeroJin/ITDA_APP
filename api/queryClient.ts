import { QueryClient } from '@tanstack/react-query';

/**
 * 쿼리 Client 설정
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 20 * 1000
        },
        mutations:{
            retry: false,
        } 
    }
});

export default queryClient;