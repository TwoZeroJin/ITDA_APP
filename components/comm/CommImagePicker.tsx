import { FileInfo } from '@/types';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconCamera from '@/assets/images/icon_camera.svg';
import IconCloseBtn from '@/assets/images/icon_close_btn.svg';
import { useImagePickerUpload } from '@/hooks/useImagePickerUpload';

type CommImagePickerProps = {
  onChangeImages: (files: FileInfo[]) => void;
  maxCount?: number;
  imgList?: FileInfo[];
};

function CommImagePicker({ onChangeImages, maxCount = 10, imgList = [] }: CommImagePickerProps) {
  // 이미지를 뿌리기 위한 URI 배열과, API에서 반환받은 파일 정보 배열을 각각 관리
  const [imageUris, setImageUris] = useState<Array<string>>(imgList.map((file) => file.file_path));
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>(imgList);
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

  const { open } = useImagePickerUpload({
    multiple: true,
    maxCount: maxCount - imageUris.length,
    onSuccess: (files) => addImageUris(files),
  });

  /**
   * 액션시트 열기 (사진 찍기 / 사진 선택하기)
   */
  const handleOpenImagePicker = () => {
    if (imageUris.length >= maxCount) {
      Alert.alert('이미지 개수 초과', `이미지는 최대 ${maxCount}개까지 등록할 수 있습니다.`);
      return;
    }

    open();
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
