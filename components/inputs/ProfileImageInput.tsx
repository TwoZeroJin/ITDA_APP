import IconCamera from '@/assets/images/icon_camera.svg';
import IconProfileDefault from '@/assets/images/icon_profile_default.svg';
import { useImageUpload } from '@/hooks/queries/useImageUpload';
import { ApiResult, FileInfo, SignupInfo } from '@/types';
import { getFormDataImages } from '@/utils/imageUtil';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useController, useFormContext } from 'react-hook-form';

type ProfileImageInputProps = {
  fieldName?        : string;
  initialImageUrl?  : string;
};

export default function ProfileImageInput({ fieldName = 'upfile', initialImageUrl }: ProfileImageInputProps) {
  const uploadImage = useImageUpload();
  const { showActionSheetWithOptions } = useActionSheet();
  const [imageUri, setImageUri] = useState<string | null>(initialImageUrl ?? null);
  const { control } = useFormContext<SignupInfo>();
  const { field } = useController({ control, name: 'new_image_name' });

  useEffect(() => {
    setImageUri(initialImageUrl ?? null);
  }, [initialImageUrl]);

  const resetSelectedImage = () => {
    setImageUri(null);
    field.onChange("DEL");
  };

  // 이미지 업로드 후 URI와 폼 값 업데이트
  const uploadAsset = (asset: ImagePicker.ImagePickerAsset) => {
    const formData = getFormDataImages(fieldName, [asset]);
    uploadImage.mutate(formData, {
      onSuccess: (data: ApiResult<FileInfo>) => {
        const uploaded = data?.data;
        if (!uploaded) {
          return;
        }
        setImageUri(uploaded.file_url);
        field.onChange(uploaded.sav_name + '|' + uploaded.org_name);
      },
      onError: () => {
        Alert.alert('업로드 실패', '프로필 이미지를 업로드하지 못했습니다.');
      },
    });
  };

  // 사진 선택
  const handlePickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '앨범 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    uploadAsset(result.assets[0]);
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
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    uploadAsset(result.assets[0]);
  };

  // 사진 찍기와 앨범에서 선택 옵션을 보여주는 액션 시트
  const handleOpenImagePicker = async () => {
    showActionSheetWithOptions({
      options: ['사진 찍기', '앨범에서 선택', '기본 이미지로 선택', '닫기'],
      cancelButtonIndex: 3,
    }, (selectedIndex) => {
      if (selectedIndex === 0) {
        handleTakePhoto();
      }
      else if (selectedIndex === 1) {
        handlePickFromLibrary();
      }
      else if (selectedIndex === 2) {
        resetSelectedImage();
      }
    });
  };

  const handlePress = () => {
    handleOpenImagePicker();
  };

  return (
    <View style={styles.profileImageSection}>
      <TouchableOpacity style={styles.profileImageButton} activeOpacity={0.8} onPress={handlePress}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <IconProfileDefault width={80} height={80} />
        )}
        <View style={styles.cameraBadge}>
          <IconCamera width={24} height={20} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImageSection: {
    alignItems          : 'center',
    marginTop           : 12,
  },
  profileImageButton: {
    borderRadius        : 50,
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  profileImage: {
    width               : 80,
    height              : 80,
    borderRadius        : 40,
  },
  cameraBadge: {
    position            : 'absolute',
    right               : 0,
    bottom              : 0,
  },
});
