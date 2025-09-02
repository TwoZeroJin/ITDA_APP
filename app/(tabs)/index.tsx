import CommHeader from '@/components/CommHeader';
import CustomDialog from '@/components/CustomDialog';
import CustomSelectModal from '@/components/CustomSelectModal';
import RadioGroup from '@/components/RadioGroup';
import { CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);

  const [dialogVisible, setDialogVisible] = useState(false);
  const openDialog = () => setDialogVisible(true);
  const closeDialog = () => setDialogVisible(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setCategoryList(await getCategoryList());
    }

    fetchData();
  }, []);

  const [value, setValue] = useState<string | number | null>(null);

  const items = [
    { label: "사과", value: "apple" },
    { label: "바나나", value: "banana" },
    { label: "체리", value: "cherry", disabled: true },
  ];

  // console.log('categoryList : ', categoryList);

  return (
    <SafeAreaView style={styles.container}>
      <CommHeader/>
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
        <CustomSelectModal
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
      <CustomDialog
        visible={dialogVisible}
        title="다이얼로그 타이틀"
        content="텍스트 내용"
        onCancel={closeDialog}
        onConfirm={() => {
          closeDialog();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container : {
    
  }
});