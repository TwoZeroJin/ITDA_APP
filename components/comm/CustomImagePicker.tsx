import { useImagesUpload } from '@/hooks/queries/useImageUpload';
import { ApiResult, FileInfo } from '@/types';
import { getFormDataImages } from '@/utils/imageUtil';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconCamera from '@/assets/images/icon_camera.svg';
import IconCloseBtn from '@/assets/images/icon_close_btn.svg';

type CustomImagePickerProps = {
  onChangeImages: (files: FileInfo[]) => void;
  maxCount?: number;
  fieldName?: string;
};

function CustomImagePicker({
  onChangeImages,
  maxCount = 10,
  fieldName = 'upfiles',
}: CustomImagePickerProps) {
  // 이미지를 뿌리기 위한 URI 배열과, API에서 반환받은 파일 정보 배열을 각각 관리
  const [imageUris, setImageUris] = useState<Array<string>>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const uploadImages = useImagesUpload();

  const addImageUris = (files: FileInfo[]) => {
    if (imageUris.length + files.length > maxCount) {
      Alert.alert('이미지 개수 초과', `추가 가능한 이미지는 최대 ${maxCount}개입니다.`);
      return;
    }

    const nextImageUris = [...imageUris, ...files.map((file) => file.file_url)];
    const nextUploadedFiles = [...uploadedFiles, ...files];

    setImageUris(nextImageUris);
    setUploadedFiles(nextUploadedFiles);
    onChangeImages(nextUploadedFiles);
  };

  /**
   * 이미지 선택 및 API 호출하여 임시 이미지 URL 설정
   */
  const handleOpenImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      selectionLimit: maxCount - imageUris.length,
    });

    if (result.canceled) {
      return;
    }

    // 다중 파일 이미지 업로드 API 호출
    const formData = getFormDataImages(fieldName, result.assets);
    uploadImages.mutate(formData, {
      onSuccess: (data: ApiResult<FileInfo[]>) => addImageUris(data?.data ?? []),
    });
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

export default CustomImagePicker;
