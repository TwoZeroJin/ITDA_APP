import CommHeader from '@/components/CommHeader';
import { CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);
  
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container : {
    
  }
});