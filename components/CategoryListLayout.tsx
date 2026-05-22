import { COLOR, COMM_STYLES } from '@/constants';
import { CodeInfo } from '@/types';
import React from 'react';
import { Image, Text, FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { getCategoryList } from '@/utils/commUtil';

interface CategoryListLayoutProps {
  searchCategory?: (code_id: string) => void;
}
export default function CategoryListLayout({searchCategory}: CategoryListLayoutProps) {
  const [categoryList, setCategoryList]   = useState<CodeInfo[]>([]);
  // 카테고리 데이터
  const PAGE_SIZE = 4;
  const pages = [];
  
  useEffect(() => {
    (async () => {
      const categoryList = await getCategoryList();
      setCategoryList(categoryList);
    })();
  }, []);

  for (let i = 0; i < categoryList.length; i += PAGE_SIZE) {
    pages.push(categoryList.slice(i, i + PAGE_SIZE));
  }
  // 카테고리 목록 Rendering 함수
  const renderGridCategory = ({ item: pageItems = [] }: { item: CodeInfo[] }) => (
      <View>
          {Array(2).fill(0).map((_, rowIdx) => (
              <View key={rowIdx} style={styles.row}>
                  {pageItems.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, colIdx) => (
                  <TouchableOpacity 
                    key={colIdx} 
                    activeOpacity={0.6} 
                    onPress={() => {console.log('Selected category1 :', item.code_id); searchCategory?.(item.code_id)}} // ✅ 이제 개별 subItem 정보가 명확히 전달됩니다.
                    style={{ alignItems: 'center' }}
                  >
                    <View style={styles.cell}>
                      <Image source={{ uri: item.code_image_url }} style={{ width: 32, height: 25 }} />
                    </View>
                    <Text style={{ marginTop: 6, fontSize: 14, fontWeight: '600', color: COLOR.COMM_BLACK }}>
                      {item.code_value}
                    </Text>
                  </TouchableOpacity>
                  ))}
              </View>
          ))}
      </View>
  );

  return (
    <View>
      {/* 카테고리 섹션 */}
      <View style={[COMM_STYLES.container, {marginTop: 8, paddingTop: 16,paddingBottom: 8, flex : 1, paddingHorizontal: 16}]}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>카테고리</Text>
          <FlatList<CodeInfo[]>
              data={pages}
              renderItem={renderGridCategory}
              keyExtractor={(_, idx) => String(idx)}
              horizontal
              decelerationRate='fast'
              showsHorizontalScrollIndicator={false}
            />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cell: {
    width: 64,
    height: 64,
    marginHorizontal: 10,
    backgroundColor: COLOR.COMM_GRAY_5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

});
