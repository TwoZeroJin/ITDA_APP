import { mainData, mainEntry } from '@/api/main';
import { userRefreshToken } from '@/api/user';
import { QUERY_KEYS, STORE_KEY } from '@/constants';
import { ApiResult, MainData } from '@/types';
import { deleteSecureStore, saveSecureStore } from '@/utils/secureStoreUtil';
import { printDebugLog, setCategoryList, setChurchList, setFeeList, setMainBannerList } from '@/utils/commUtil';
import { saveAsyncStore } from '@/utils/asyncStoreUtil';
import { useQuery } from '@tanstack/react-query';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { DevSettings, Image } from 'react-native';
import { AxiosError } from 'axios';

/**
 * 초기 정보 조회
 */
function useMainEntry() {
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const { data, isError, isSuccess, error, refetch } = useQuery({
    queryFn: mainEntry,
    queryKey: [QUERY_KEYS.MAIN , QUERY_KEYS.MAIN_ENTRY],
    retry: 1,
  });
  //
  useEffect(() => {
    if (isSuccess) {
      const bannerList = data?.data?.banner_list ;
      const normalizedBannerList = bannerList && bannerList.length > 0
          ? bannerList
          : [{ banner_image_url: Image.resolveAssetSource(require('@/assets/images/no_image.png')).uri }];

      // App에 필요한 정보 SecureStore(중요정보) 및 AsyncStore(비중요정보)에 세팅
      setCategoryList(data?.data?.category_list);
      setFeeList(data?.data?.fee_list);
      setMainBannerList(normalizedBannerList);
      setChurchList(data?.data?.church_list);
    }
  }, [isSuccess, data])

  useEffect(() => {
      if (!isError) {
        return;
      }

      const status = (error as AxiosError | null)?.response?.status;

      // Main 호출시 401 에러 발생 -> 토큰 갱신 시도 -> 갱신 성공 시 Main 재호출
      if (status === 401) {
        (async () => {
            try {
              const refreshResult = await userRefreshToken();

              if (refreshResult.ret_code === 200 && refreshResult.data) {
                await saveSecureStore(STORE_KEY.X_ACCESS_TOKEN,     refreshResult.data.access_token);
                await saveSecureStore(STORE_KEY.X_REFRESH_TOKEN,    refreshResult.data.refresh_token);
                await refetch();
                return;
              }
              else {
                // 토큰 발급 실패시 토큰 제거
                await deleteSecureStore(STORE_KEY.X_ACCESS_TOKEN);
                await deleteSecureStore(STORE_KEY.X_REFRESH_TOKEN);
              }

              setIsErrorDialogVisible(true);
            } catch {
              setIsErrorDialogVisible(true);
            }
        })();

        return;
      }

      setIsErrorDialogVisible(true);
  }, [isError, error, refetch]);

  const handleRetryMainEntry = () => {
    setIsErrorDialogVisible(false);
    refetch();
  };

  const handleRestartApp = async () => {
    try {
      if (__DEV__) {
        DevSettings.reload();
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

/**
 * 메인 데이터 조회
 */
function useMainData(sch_category?: string, sch_text?: string) {
  const query = useQuery<ApiResult<MainData>>({
    queryFn: () => mainData({ sch_category, sch_text }),
    queryKey: [QUERY_KEYS.MAIN , QUERY_KEYS.MAIN_DATA],
  });

  useEffect(() => {
    if (query.isError) {
      printDebugLog('메인 데이터 조회 실패', JSON.stringify(query.error));
    }
  }, [query.isError, query.error]);

  const pushCount = query.data?.data?.push_count ?? 0;

  useEffect(() => {
    saveAsyncStore(STORE_KEY.PUSH_COUNT, String(pushCount));
  }, [pushCount]);

  return {
    ...query,
    upcomingMeetList    : query.data?.data?.upcoming_meet_list ?? [],
    hotMeetList         : query.data?.data?.hot_meet_list ?? [],
    recommendMeetList   : query.data?.data?.recommend_meet_list ?? [],
    hotGroupList        : query.data?.data?.hot_group_list ?? [],
    recommendGroupList  : query.data?.data?.recommend_group_list ?? [],
    newClassList        : query.data?.data?.new_class_list ?? [],
    reviewList          : query.data?.data?.review_list ?? [],
  };
}

export { useMainEntry, useMainData }