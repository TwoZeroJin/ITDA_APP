import { imagesUpload, imageUpload } from "@/api/image";
import { useLoading } from "@/contexts/LoadingContext";
import { useMutation } from "@tanstack/react-query";

/**
 * 단일 이미지 임시 업로드
 */
function useImageUpload() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : FormData) => {
      setLoading(true);
      return imageUpload(body);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

/**
 * 다중 이미지 임시 업로드
 */
function useImagesUpload() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : FormData) => {
      setLoading(true);
      return imagesUpload(body);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export { useImageUpload, useImagesUpload };
