import CommHeader from '@/components/CommHeader';
import CustomDialog from '@/components/CustomDialog';
import { CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

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
  }, [])

  // console.log('categoryList : ', categoryList);

  return (
    <SafeAreaView style={styles.container}>
      <CommHeader/>



      {/* 다이얼로그 테스트 */}
      <TouchableOpacity onPress={openDialog}>
        <Text>다이얼로그 열기</Text>
      </TouchableOpacity>
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