import { STORE_KEY } from '@/constants';
import CustomDialog from '@/components/CustomDialog';
import { getSecureStore } from '@/utils/secureStoreUtil';
import { router, useFocusEffect, usePathname } from 'expo-router';
import React, { ReactNode, useCallback, useState } from 'react';

interface AuthRouteProps {
  children: ReactNode;
}

function AuthRoute({children}: AuthRouteProps) {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const pathname = usePathname();
  const excludePaths = ['/user', '/']; // 로그인 체크에서 제외할 경로들

  useFocusEffect(
    useCallback(() => {
    let isActive = true;

    const isExcludedPath = excludePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    if (isExcludedPath) {
      setIsDialogVisible(false);
      return () => {
        isActive = false;
      };
    }

    const checkLogin = async () => {
      const access_token = await getSecureStore(STORE_KEY.X_ACCESS_TOKEN);

      if (isActive && !access_token) {
          setIsDialogVisible(true);
      }
    };

    checkLogin();

    return () => {
      // 화면 unfocus 시 실행 방지
      isActive = false;
    };
    }, [pathname])
  );

  return (
    <>
      {children}
      <CustomDialog
        visible={isDialogVisible}
        content="로그인이 필요합니다."
        onConfirm={() => {
          setIsDialogVisible(false);
          router.replace('/user' as any);
        }}
        onCancel={() => {
          setIsDialogVisible(false);
          router.back();
        }}
        confirmLabel="로그인"
        cancelLabel="취소"
      />
    </>
  )
}

export default AuthRoute;