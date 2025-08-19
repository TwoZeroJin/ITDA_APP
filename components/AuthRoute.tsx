import { STORE_KEY } from '@/constants';
import { getSecureStore } from '@/utils/secureStoreUtil';
import { router, useFocusEffect } from 'expo-router';
import React, { ReactNode, useCallback } from 'react';

interface AuthRouteProps {
    children: ReactNode;
}

function AuthRoute({children}: AuthRouteProps) {
    useFocusEffect(
        useCallback(() => {
        let isActive = true;

        const checkLogin = async () => {
            const access_token = await getSecureStore(STORE_KEY.X_ACCESS_TOKEN);

            if (isActive && !access_token) {
                router.replace("/user" as any);
            }
        };

        checkLogin();

        return () => {
            // 화면 unfocus 시 실행 방지
            isActive = false;
        };
        }, [router])
    );

    return (
        <>{children}</>
    )
}

export default AuthRoute;