import { QUERY_KEYS } from '@/constants';
import { Report } from '@/types';
import { useLoading } from '@/contexts/LoadingContext';
import { useMutation } from '@tanstack/react-query';
import queryClient from '@/api/queryClient';
import { reportBlock, reportInsert } from '@/api/report';

/**
 * 신고 등록
 */
function useReportInsert() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : Report) => {
      setLoading(true);
      return reportInsert(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REPORT, QUERY_KEYS.REPORT_INSERT],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

/**
 * 차단 등록
 */
function useReportBlock() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : Report) => {
      setLoading(true);
      return reportBlock(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_PAGING],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export { useReportInsert, useReportBlock };