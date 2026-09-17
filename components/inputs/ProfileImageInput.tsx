import IconCamera from '@/assets/images/icon_camera.svg';
import IconProfileDefault from '@/assets/images/icon_profile_default.svg';
import { SignupInfo } from '@/types';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useController, useFormContext } from 'react-hook-form';
import { useImagePickerUpload } from '@/hooks/useImagePickerUpload';

type ProfileImageInputProps = {
  initialImageUrl?  : string;
};

export default function ProfileImageInput({ initialImageUrl }: ProfileImageInputProps) {
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

  const { openCamera, openLibrary } = useImagePickerUpload({
    onSuccess: (files) => {
      const uploaded = files[0];
        if (!uploaded) {
          return;
        }
        setImageUri(uploaded.file_path);
        field.onChange(uploaded.sav_name + '|' + uploaded.org_name);
    },
  });

  // 사진 찍기와 앨범에서 선택 옵션을 보여주는 액션 시트
  const handleOpenImagePicker = async () => {
    showActionSheetWithOptions({
      options: ['사진 찍기', '앨범에서 선택', '기본 이미지로 선택', '닫기'],
      cancelButtonIndex: 3,
    }, (selectedIndex) => {
      if (selectedIndex === 0) {
        openCamera();
      }
      else if (selectedIndex === 1) {
        openLibrary();
      }
      else if (selectedIndex === 2) {
        resetSelectedImage();
      }
    });
  };

  return (
    <View style={styles.profileImageSection}>
      <TouchableOpacity style={styles.profileImageButton} activeOpacity={0.8} onPress={handleOpenImagePicker}>
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
