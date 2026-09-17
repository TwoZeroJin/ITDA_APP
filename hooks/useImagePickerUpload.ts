import { useActionSheet } from '@expo/react-native-action-sheet';
import { Alert } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';
import { useImageUpload, useImagesUpload } from '@/hooks/queries/useImageUpload';
import { ApiResult, FileInfo } from '@/types';
import { getFormDataImages } from '@/utils/imageUtil';
import { captureImage, pickImagesFromLibrary, prepareImageAssets } from '@/utils/commUtil';

type ImagePickerUploadOptions = {
  multiple?: boolean;
  maxCount?: number;
  onSuccess: (files: FileInfo[], assets: ImagePickerAsset[]) => void;
};

/**
 * 이미지 선택 및 업로드 훅
 */
export function useImagePickerUpload({ multiple = false, maxCount = 1, onSuccess }: ImagePickerUploadOptions) {
  const uploadImage = useImageUpload();
  const uploadImages = useImagesUpload();
  const { showActionSheetWithOptions } = useActionSheet();

  const uploadAssets = async (assets: ImagePickerAsset[]) => {
    const { imageAssets, compressedAssets } = await prepareImageAssets(assets);
    if (!imageAssets.length) {
      Alert.alert('이미지 파일만 선택 가능', '동영상은 선택할 수 없습니다.');
      return;
    }

    const formData = getFormDataImages(multiple ? 'upfiles' : 'upfile', compressedAssets);
    const handleSuccess = (data: ApiResult<FileInfo | FileInfo[]>) => {
      const files = Array.isArray(data.data) ? data.data : data.data ? [data.data] : [];
      onSuccess(files, imageAssets);
    };
    const handleError = () => Alert.alert('업로드 실패', '이미지를 업로드하지 못했습니다.');

    if (multiple) {
      uploadImages.mutate(formData, { onSuccess: handleSuccess, onError: handleError });
    } else {
      uploadImage.mutate(formData, { onSuccess: handleSuccess, onError: handleError });
    }
  };

  const openLibrary = async () => {
    const assets = await pickImagesFromLibrary(maxCount);
    if (assets.length > 0) {
      await uploadAssets(assets);
    }
  };

  const openCamera = async () => {
    const asset = await captureImage();
    if (asset) {
      await uploadAssets([asset]);
    }
  };

  const open = () => {
    showActionSheetWithOptions(
      { options: ['사진 찍기', '앨범에서 선택', '취소'], cancelButtonIndex: 2 },
      (selectedIndex) => {
        if (selectedIndex === 0) void openCamera();
        if (selectedIndex === 1) void openLibrary();
      },
    );
  };

  return { open, openLibrary, openCamera, isUploading: uploadImage.isPending || uploadImages.isPending };
}
