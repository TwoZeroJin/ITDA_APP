import CommHeader from '@/components/CommHeader';
import CustomDialog from '@/components/CustomDialog';
import RadioGroup from '@/components/RadioGroup';
import SelectboxModal from '@/components/SelectboxModal';
import * as ImagePicker from 'expo-image-picker';
import { COLOR } from '@/constants';
import { ApiResult, CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFormDataImages } from '@/utils/imageUtil';
import { useImageUpload, useImagesUpload } from '@/hooks/queries/useImageUpload';
import { useFormContext, useWatch } from 'react-hook-form';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);
  const [value, setValue] = useState<string | number | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const openDialog = () => setDialogVisible(true);
  const closeDialog = () => setDialogVisible(false);

  const [imageUris, setImageUris] = useState<Array<{uri:string}>>([]);
  const uploadImage = useImageUpload();
  const uploadImages = useImagesUpload();
  
  useEffect(() => {
    const fetchData = async () => {
      // SecureStore에서 카테고리 코드 목록 가져오기
      setCategoryList(await getCategoryList());
    }

    fetchData();
  }, []);

  // 테스트 코드
  const items = [
    { label: "사과", value: "apple" },
    { label: "바나나", value: "banana" },
    { label: "체리", value: "cherry", disabled: true },
  ];

  const PAGE_SIZE = 4;
  const pages = [];

  for (let i = 0; i < categoryList.length; i += PAGE_SIZE) {
      pages.push(categoryList.slice(i, i + PAGE_SIZE));
  }

  // 카테고리 목록 Rendering 함수
  const renderGrid = ({ item: pageItems = [] }: { item: CodeInfo[] }) => (
      <View style={styles.page}>
          {Array(2).fill(0).map((_, rowIdx) => (
              <View key={rowIdx} style={styles.row}>
                  {pageItems.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, colIdx) => (
                      <View key={colIdx} style={styles.cell}>
                          <Text>{JSON.stringify(item)}</Text>
                      </View>
                  ))}
              </View>
          ))}
      </View>
  );

  // 이미지 업로드 테스트
  const handleOpenImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
    });

    if (result.canceled) {
      return;
    }

    const formData = getFormDataImages("images", result.assets);
    uploadImages.mutate(formData, {
      onSuccess: (data: ApiResult<string[]>) => addImageUris(data?.data ?? []),
    });
  };

  const addImageUris = (uris: string[]) => {
    if (imageUris.length + uris.length > 5) {
      Alert.alert("이미지 개수 초과", "추가 가능한 이미지는 최대 5개입니다.");
      return;
    }

    setImageUris([...imageUris, ...uris.map((uri) => ({ uri: uri }))]);
  };

  // console.log('categoryList : ', categoryList);

  return (
    <>
      <CommHeader/>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* 라디오 버튼 UI 테스트*/}
        <View style={{ padding: 20 }}>
          {/* 세로형 */}
          <RadioGroup items={items} value={value} onChange={setValue} />

          {/* 가로형 */}
          <RadioGroup
            items={items}
            value={value}
            onChange={setValue}
            direction="row"
            spacing={20}
          />
        </View>
        {/* 셀렉트박스 모달 테스트 */}
        <View style={{ padding: 20 }}>
          <SelectboxModal
            options={items}
            value={value}
            onChange={setValue}
            placeholder="과일을 선택하세요"
          />
        </View>
        {/* 다이얼로그 테스트 */}
        <View style={{ padding: 20 }}>
          <TouchableOpacity onPress={openDialog}>
            <Text>다이얼로그 열기</Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 30 }}>
          <TouchableOpacity 
            style={{ borderColor : COLOR.COMM_BLACK, borderWidth : 2, width : 100 }} 
            onPress={() => router.navigate('/test')}>
            <Text>스크롤뷰 테스트 화면 이동</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 3 }}>
          <FlatList<CodeInfo[]>
              data={pages}
              renderItem={renderGrid}
              keyExtractor={(_, idx) => String(idx)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={{ marginBottom: 50, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={handleOpenImagePicker}>
            <Text>이미지 선택</Text>
          </TouchableOpacity>
        </View>

        {/* 다이얼로그 영역 */}
        <CustomDialog
          visible={dialogVisible}
          title="다이얼로그 타이틀"
          content="텍스트 내용"
          onCancel={closeDialog}
          onConfirm={() => {
            closeDialog();
          }}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  page: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cell: {
    width: width / 2 - 40,
    height: 100,
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});