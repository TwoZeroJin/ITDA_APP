import { COMM_STYLES } from '@/constants';
import { MemberInfo } from '@/types';
import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TouchableOpacity } from 'react-native';
import IconPlace from '@/assets/images/icon_place.svg';
import KakaoPostcodeModal, { PostcodeAddress } from '@/components/modal/KakaoPostcodeModal';

/**
 * 교회 주소 입력 컴포넌트
 */
export default function ChurchAddrInput() {
  const { control, setValue, watch } = useFormContext<MemberInfo>();

  const placeAddr = watch('mem_church_addr');

  const [placeModalVisible, setPlaceModalVisible] = useState(false);
  const [postcodeKey, setPostcodeKey] = useState(0);


  const selectedPlace = useMemo(() => {
    if (!placeAddr) {
      return null;
    }

    return {
      address: placeAddr ?? '',
    };
  }, [placeAddr]);

  const handleSelectPlacePress = () => {
    setPostcodeKey((prevKey) => prevKey + 1);
    setPlaceModalVisible(true);
  };

  const handlePostcodeComplete = (data: PostcodeAddress) => {
    const nextPlaceAddr = data.roadAddress || data.address || data.jibunAddress || '';
      setValue('mem_church_addr', nextPlaceAddr);
    setPlaceModalVisible(false);
  };

  return (
    <>
      <Controller
        name="mem_church_addr"
        control={control}
        render={({}) => (
          <>
            <Text style={COMM_STYLES.label}>교회 주소</Text>
            <TouchableOpacity
              style={[COMM_STYLES.placeInfoContainer, {marginTop: -16}]}
              onPress={handleSelectPlacePress}
              activeOpacity={0.6}
            >
              <IconPlace width={13} height={17} />
              <Text style={[COMM_STYLES.dataText, !selectedPlace && COMM_STYLES.placeholderText]}>
                {selectedPlace ? selectedPlace.address : '교회 주소를 입력하세요'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      />

      <KakaoPostcodeModal
        visible={placeModalVisible}
        postcodeKey={postcodeKey}
        onClose={() => setPlaceModalVisible(false)}
        onComplete={handlePostcodeComplete}
      />
    </>
  );
}