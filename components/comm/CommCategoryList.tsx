import { COLOR } from '@/constants';
import { CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { useEffect, useState } from 'react';
import { Image, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface CommCategoryListProps {
  onCategorySelect?: (code_id: string) => void;
}
/**
 * 카테고리 리스트
 */
export default function CommCategoryList({ onCategorySelect }: CommCategoryListProps) {
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

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
                        {pageItems.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, colIdx) => {
                          const isSelected = selectedCategoryId === item.code_id;

                          return (
                            <TouchableOpacity 
                              key={colIdx} 
                              style={{ alignItems: 'center' }} 
                              onPress={() => {
                                const nextCategoryId = selectedCategoryId === item.code_id ? '' : item.code_id;
                                setSelectedCategoryId(nextCategoryId);
                                onCategorySelect?.(nextCategoryId);
                              }}
                              activeOpacity={0.6}
                            >
                              <View style={[styles.cell, isSelected && styles.cellSelected]}>
                                <Image source={{ uri: item.code_image_url }} style={styles.image} />
                              </View>
                              <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>{item.code_value}</Text>
                            </TouchableOpacity>
                          );
                        })}
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
    flex              : 1,
    marginTop         : 8,
    paddingTop        : 16,
    paddingBottom     : 8,
    paddingHorizontal : 16,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  title: {
    fontSize          : 20,
    fontFamily        : 'Pretendard-SemiBold',
    color             : COLOR.COLOR_323232,
    marginBottom      : 12,
  },
  row: {
    marginBottom      : 12,
    justifyContent    : 'space-between',
    flexDirection     : 'row',
  },
  cell: {
    justifyContent    : 'center',
    alignItems        : 'center',
    width             : 64,
    height            : 64,
    marginHorizontal  : 10,
    backgroundColor   : COLOR.COMM_GRAY_5,
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_5,
    borderRadius      : 10,
  },
  cellSelected: {
    borderColor       : COLOR.APP_ACTIVE_4,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  image: {
    width             : '55%',
    height            : undefined,
    aspectRatio       : 1,
    resizeMode        : 'contain',
  },
  categoryText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    marginTop         : 6,
    color             : COLOR.TEXT_DEFAULT,
  },
  categoryTextSelected: {
    color             : COLOR.APP_ACTIVE_5,
    fontFamily        : 'Pretendard-Medium',
  },
});