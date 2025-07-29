import useAuth from '@/hooks/queries/useAuth';
import { router, useFocusEffect } from 'expo-router';
import React, { ReactNode } from 'react';

interface AuthRouteProps {
    children: ReactNode;
}

function AuthRoute({children}: AuthRouteProps) {
    const { auth } = useAuth();

    useFocusEffect(() => {
        !auth.mem_id && router.replace("/user");
    });

    return (
        <>{children}</>
    )
}

export default AuthRoute;