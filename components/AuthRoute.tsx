import { STORE_KEY } from '@/constants';
import { getSecureStore } from '@/utils/secureStoreUtil';
import { router, useFocusEffect } from 'expo-router';
import React, { ReactNode } from 'react';

interface AuthRouteProps {
    children: ReactNode;
}

function AuthRoute({children}: AuthRouteProps) {
    useFocusEffect(() => {
        const checkLogin = async () => {
            const access_token = await getSecureStore(STORE_KEY.X_ACCESS_TOKEN);
            !access_token && router.replace("/user" as any);
        }

        checkLogin();
    });

    return (
        <>{children}</>
    )
}

export default AuthRoute;