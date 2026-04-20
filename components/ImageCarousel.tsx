import { COLOR } from "@/constants";
import React, { useRef, useState } from "react";
import { Text, View, FlatList, Image, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Pressable } from "react-native";

const { width } = Dimensions.get("window");

interface ImageCarouselProps  {
  images            : string[];           // 이미지 URL
  height?           : number;             // 기본 높이
  showIndicator?    : boolean;            // 인디케이터 표시 여부
  onPressImage?     : (idx: number) => void;
};

function ImageCarousel({ images, height = 300, showIndicator = true, onPressImage }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList<string> | null>(null);
  const canSwipe = images.length > 1;

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  return (
    <View style={[styles.container, { height }]}>
      {images.length > 0 && (
      <FlatList
        ref={ref}
        data={images}
        horizontal
        pagingEnabled={canSwipe}
        scrollEnabled={canSwipe}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item, index: idx }) => (
          <Pressable style={{ width, height }} onPress={() => onPressImage?.(idx)}>
            <Image
              source={{ uri: item }}
              style={[styles.image, { width, height }]}
              resizeMode="cover"
            />
          </Pressable>
        )}
      />)}
      {!images.length && (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>이미지가 없습니다.</Text>
        </View>
      )}
  
      {showIndicator && images.length > 1 && (
        <View style={styles.indicatorContainer}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index ? styles.dotActive : {opacity: 0.5}]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: COLOR.COMM_BLACK,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noImageText: {
    color: COLOR.TEXT_GRAY,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 4,
    backgroundColor: COLOR.COMM_WHITE,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ImageCarousel;