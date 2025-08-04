import { STORE_KEY } from '@/constants';
import { getSecureStore } from '@/utils/secureStoreUtil';
import { router, useFocusEffect } from 'expo-router';
import React, { ReactNode } from 'react';

interface AuthRouteProps {
    children: ReactNode;
}

function AuthRoute({children}: AuthRouteProps) {
    const access_token = getSecureStore(STORE_KEY.X_ACCESS_TOKEN);

    useFocusEffect(() => {
        !access_token && router.replace("/user" as any);
    });

    return (
        <>{children}</>
    )
}

export default AuthRoute;