import useAuth from '@/hooks/queries/useAuth';
import { useFocusEffect } from 'expo-router';
import React, { ReactNode } from 'react';

interface AuthRouteProps {
    children: ReactNode;
}

function AuthRoute({children}: AuthRouteProps) {
    const { auth } = useAuth();

    useFocusEffect(() => {
        // !auth.id && router.replace("/auth");
    });

    return (
        <>{children}</>
    )
}

export default AuthRoute;