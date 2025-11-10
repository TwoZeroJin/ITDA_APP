import { imagesUpload, imageUpload } from "@/api/image";
import { useMutation } from "@tanstack/react-query";

function useImageUpload() {
    return useMutation({
        mutationFn: imageUpload,
    });
}

function useImagesUpload() {
    return useMutation({
        mutationFn: imagesUpload,
  });
}

export { useImageUpload, useImagesUpload };
