import { useImagesUpload } from '@/hooks/queries/useImageUpload';
import { ApiResult, FileInfo } from '@/types';
import { getFormDataImages } from '@/utils/imageUtil';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconCamera from '@/assets/images/icon_camera.svg';
import IconCloseBtn from '@/assets/images/icon_close_btn.svg';

type CommImagePickerProps = {
  onChangeImages: (files: FileInfo[]) => void;
  maxCount?: number;
  imgList?: FileInfo[];
};

function CommImagePicker({ onChangeImages, maxCount = 10, imgList = [] }: CommImagePickerProps) {
  // 이미지를 뿌리기 위한 URI 배열과, API에서 반환받은 파일 정보 배열을 각각 관리
  const [imageUris, setImageUris] = useState<Array<string>>(imgList.map((file) => file.file_path));
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>(imgList);
  const uploadImages = useImagesUpload();
  const { showActionSheetWithOptions } = useActionSheet();

  const addImageUris = (files: FileInfo[]) => {
    if (imageUris.length + files.length > maxCount) {
      Alert.alert('이미지 개수 초과', `추가 가능한 이미지는 최대 ${maxCount}개입니다.`);
      return;
    }

    const nextImageUris = [...imageUris, ...files.map((file) => file.file_path)];
    const nextUploadedFiles = [...uploadedFiles, ...files];

    setImageUris(nextImageUris);
    setUploadedFiles(nextUploadedFiles);
    onChangeImages(nextUploadedFiles);
  };

  // 서버에 이미지 업로드
  const uploadSelectedAssets = async (assets: ImagePicker.ImagePickerAsset[]) => {
    if (!assets.length) {
      return;
    }

    // 이미지 압축 및 JPEG 변환
    const compressedAssets = await Promise.all(
      assets.map(async (asset) => {
        const manipResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        return { ...asset, uri: manipResult.uri };
      })
    );

    // 다중 파일 이미지 업로드 API 호출
    const formData = getFormDataImages('upfiles', compressedAssets);
    uploadImages.mutate(formData, {
      onSuccess: (data: ApiResult<FileInfo[]>) => addImageUris(data?.data ?? []),
      onError: () => {
        Alert.alert('업로드 실패', '이미지를 업로드하지 못했습니다.');
      },
    });
  };

  // 사진 선택
  const handlePickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      selectionLimit: maxCount - imageUris.length,
      quality: 1,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    await uploadSelectedAssets(result.assets);
  };

  // 사진 찍기
  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 1,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    await uploadSelectedAssets(result.assets);
  };

  /**
   * 액션시트 열기 (사진 찍기 / 사진 선택하기)
   */
  const handleOpenImagePicker = () => {
    if (imageUris.length >= maxCount) {
      Alert.alert('이미지 개수 초과', `이미지는 최대 ${maxCount}개까지 등록할 수 있습니다.`);
      return;
    }

    showActionSheetWithOptions(
      {
        options: ['사진 찍기', '사진 선택하기', '닫기'],
        cancelButtonIndex: 2,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          handleTakePhoto();
        }
        else if (selectedIndex === 1) {
          handlePickFromLibrary();
        }
      }
    );
  };

  /**
   * 이미지 삭제
   */
  const handleDeleteImage = (index: number) => {
    const nextImageUris = imageUris.filter((_, i) => i !== index);
    const nextUploadedFiles = uploadedFiles.filter((_, i) => i !== index);

    setImageUris(nextImageUris);
    setUploadedFiles(nextUploadedFiles);
    onChangeImages(nextUploadedFiles);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.photoButton} onPress={handleOpenImagePicker} activeOpacity={0.6}>
        <IconCamera />
        <Text style={styles.photoCount}>({imageUris.length}/{maxCount})</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {imageUris.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.deleteBadge}
              onPress={() => handleDeleteImage(index)}
              activeOpacity={0.6}
            >
              <IconCloseBtn />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection     : 'row',
  },
  photoButton: {
    width             : 80,
    height            : 80,
    borderWidth       : 1,
    borderColor       : '#ddd',
    borderRadius      : 8,
    justifyContent    : 'center',
    alignItems        : 'center',
    marginRight       : 10,
  },
  photoCount: {
    fontSize          : 12,
    color             : '#aaa',
    marginTop         : 4,
  },
  imageWrapper: {
    marginRight       : 10,
    position          : 'relative',
  },
  previewImage: {
    width             : 80,
    height            : 80,
    borderRadius      : 8,
  },
  deleteBadge: {
    position          : 'absolute',
    right             : -1,
  },
});

export default CommImagePicker;
