import { COLOR } from '@/constants';
import { CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { useEffect, useState } from 'react';
import { Image, FlatList, StyleSheet, Text, View } from 'react-native';

/**
 * 카테고리 리스트
 */
export default function CommCategoryList() {
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      setCategoryList(await getCategoryList());
    };

    fetchCategoryList();
  }, []);

  const PAGE_SIZE = 4;
  const pages: CodeInfo[][] = [];

  for (let i = 0; i < categoryList.length; i += PAGE_SIZE) {
    pages.push(categoryList.slice(i, i + PAGE_SIZE));
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>카테고리</Text>
        <FlatList<CodeInfo[]>
          data={pages}
          renderItem={({ item: pageItems = [] }) => {
              return (
                <View>
                  {Array(2)
                    .fill(0)
                    .map((_, rowIdx) => (
                      <View key={rowIdx} style={styles.row}>
                        {pageItems.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, colIdx) => (
                          <View key={colIdx} style={{ alignItems: 'center' }}>
                            <View style={styles.cell}>
                              <Image source={{ uri: item.code_image_url }} style={styles.image} />
                            </View>
                            <Text style={styles.categoryText}>{item.code_value}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                </View>
              );
          }}
          keyExtractor={(_, idx) => String(idx)}
          horizontal
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop         : 8,
    paddingTop        : 16,
    paddingBottom     : 8,
    paddingHorizontal : 16,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  title: {
    fontWeight      : 'bold',
    fontSize        : 20,
    marginBottom    : 12,
  },
  row: {
    marginBottom    : 12,
    justifyContent  : 'space-between',
    flexDirection   : 'row',
  },
  cell: {
    justifyContent    : 'center',
    alignItems        : 'center',
    width             : 64,
    height            : 64,
    marginHorizontal  : 10,
    backgroundColor   : COLOR.COMM_GRAY_5,
    borderRadius      : 10,
  },
  image: {
    width             : '55%',
    height            : undefined,
    aspectRatio       : 1,
    resizeMode        : 'contain',
  },
  categoryText: {
    marginTop   : 6,
    fontSize    : 14,
    fontWeight  : 'bold',
    color       : COLOR.COMM_BLACK,
  },
});