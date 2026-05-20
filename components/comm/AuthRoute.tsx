import { STORE_KEY } from '@/constants';
import CustomDialog from '@/components/modal/CustomDialog';
import { getSecureStore } from '@/utils/secureStoreUtil';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';

// 로그인 체크에서 제외할 경로들
const EXCLUDE_PATHS = ['/', '/user', '/community', '/meet'];

// ──────────────────────────────────────────────────────────────
// Auth Router Context
// ──────────────────────────────────────────────────────────────
interface AuthRouterContextValue {
  push              : (href: Href) => void;
  navigate          : (href: Href) => void;
  replace           : (href: Href) => void;
  /** navigation.navigate 등 커스텀 함수를 Auth 체크 후 실행하고 싶을 때 사용 */
  checkAndNavigate  : (navigateFn: () => void, path: string) => void;
}

const AuthRouterContext = createContext<AuthRouterContextValue>({
  push             : router.push,
  navigate         : router.navigate,
  replace          : router.replace,
  checkAndNavigate : (_navigateFn, _path) => {},
});

/** router.push / navigate / replace 대신 이 훅을 사용하면 이동 전 Auth 체크를 수행합니다. */
export function useAuthRouter() {
  return useContext(AuthRouterContext);
}

interface AuthRouteProps {
  children: ReactNode;
}

function getPathname(href: Href | string): string {
  if (typeof href === 'string') return href;
  return (href as { pathname?: string }).pathname ?? '';
}

function isExcludedPath(path: string): boolean {
  return EXCLUDE_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * router를 Wrapping하여 push, navigate, replace 시 로그인 여부를 체크하는 컴포넌트
 */
function AuthRoute({ children }: AuthRouteProps) {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const checkAndNavigate = useCallback(async (navigateFn: () => void, href: Href | string) => {
    const pathname = getPathname(href);

    if (isExcludedPath(pathname)) {
      navigateFn();
      return;
    }

    const access_token = await getSecureStore(STORE_KEY.X_ACCESS_TOKEN);
    if (access_token) {
      navigateFn();
    } else {
      setIsDialogVisible(true);
    }
  }, []);

  const authRouter: AuthRouterContextValue = {
    push             : (href) => checkAndNavigate(() => router.push(href),     href),
    navigate         : (href) => checkAndNavigate(() => router.navigate(href), href),
    replace          : (href) => checkAndNavigate(() => router.replace(href),  href),
    checkAndNavigate : (fn, path) => checkAndNavigate(fn, path),
  };

  return (
    <AuthRouterContext.Provider value={authRouter}>
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
        }}
        confirmLabel="로그인"
        cancelLabel="취소"
      />
    </AuthRouterContext.Provider>
  );
}

export default AuthRoute;
