import { imagesUpload, imageUpload } from "@/api/image";
import { useLoading } from "@/contexts/LoadingContext";
import { useMutation } from "@tanstack/react-query";

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
