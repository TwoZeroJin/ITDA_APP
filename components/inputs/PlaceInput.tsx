import { COLOR, COMM_STYLES } from '@/constants';
import { MeetInfo } from '@/types';
import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconPlace from '@/assets/images/icon_place.svg';
import KakaoPostcodeModal, { PostcodeAddress } from '@/components/modal/KakaoPostcodeModal';

/**
 * 모임장소 입력 컴포넌트
 */
export default function PlaceInput() {
  const { control, setValue, watch } = useFormContext<MeetInfo>();

  const placeName = watch('place_name');
  const placeAddr = watch('place_addr');

  const [placeModalVisible, setPlaceModalVisible] = useState(false);
  const [postcodeKey, setPostcodeKey] = useState(0);

  const selectedPlace = useMemo(() => {
    if (!placeName) {
      return null;
    }

    return {
      name: placeName,
      address: placeAddr ?? '',
    };
  }, [placeName, placeAddr]);

  const handleSelectPlacePress = () => {
    setPostcodeKey((prevKey) => prevKey + 1);
    setPlaceModalVisible(true);
  };

  const handlePostcodeComplete = (data: PostcodeAddress) => {
    const nextPlaceAddr = data.roadAddress || data.address || data.jibunAddress || '';
    const nextPlaceName = data.buildingName || nextPlaceAddr;

    setValue('place_name', nextPlaceName, { shouldValidate: true, shouldDirty: true });
    setValue('place_addr', nextPlaceAddr);
    setPlaceModalVisible(false);
  };

  return (
    <>
        <View style={styles.placeContainer}>
          <Controller
            name="place_name"
            control={control}
            render={() => (
              <>
                <Text style={styles.commContainerSubTitle}>장소</Text>
                <TouchableOpacity
                  style={COMM_STYLES.placeInfoContainer}
                  onPress={handleSelectPlacePress}
                  activeOpacity={0.6}
                >
                  <IconPlace width={13} height={17} />
                  <Text style={[COMM_STYLES.dataText, !selectedPlace && COMM_STYLES.placeholderText]}>
                    {selectedPlace ? selectedPlace.name : '장소를 찾아주세요.'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          />
      </View>

      <KakaoPostcodeModal
        visible={placeModalVisible}
        postcodeKey={postcodeKey}
        onClose={() => setPlaceModalVisible(false)}
        onComplete={handlePostcodeComplete}
      />

    </>
  );
}

const styles = StyleSheet.create({
  placeContainer: {
    gap               : 14,
  },
  commContainerSubTitle: {
    fontSize          : 14,
    color             : COLOR.TEXT_DEFAULT,
  },
});