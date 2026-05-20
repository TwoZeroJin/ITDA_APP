import { COLOR } from "@/constants";
import React, { useRef, useState } from "react";
import { Text, View, FlatList, Image, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Pressable, LayoutChangeEvent } from "react-native";

interface ImageCarouselProps  {
  images            : string[];           // 이미지 URL
  height?           : number;             // 기본 높이
  imageRadius?      : number;             // 이미지 모서리 둥글기 (옵션)
  showIndicator?    : boolean;            // 인디케이터 표시 여부
  onPressImage?     : (idx: number) => void;
};

/// 이미지 캐러셀 컴포넌트
function ImageCarousel({ images, height = 300, imageRadius, showIndicator = true, onPressImage }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const ref = useRef<FlatList<string> | null>(null);
  const canSwipe = images.length > 1;

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && nextWidth !== containerWidth) {
      setContainerWidth(nextWidth);
    }
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (containerWidth <= 0) {
      return;
    }

    const newIndex = Math.round(e.nativeEvent.contentOffset.x / containerWidth);
    setIndex(newIndex);
  };

  return (
    <View style={[styles.container, { height }]} onLayout={handleLayout}>
      {images.length > 0 && (
      <FlatList
        ref={ref}
        data={images}
        horizontal
        pagingEnabled={canSwipe}
        scrollEnabled={canSwipe}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item, index: idx }) => (
          <Pressable
            style={[
              { width: containerWidth || "100%", height },
              imageRadius !== undefined && { borderRadius: imageRadius, overflow: "hidden" },
            ]}
            onPress={() => onPressImage?.(idx)}
          >
            <Image
              source={{ uri: item }}
              style={[
                styles.image,
                { width: containerWidth || "100%", height },
                imageRadius !== undefined && { borderRadius: imageRadius },
              ]}
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
    width           : "100%",
    backgroundColor : COLOR.COMM_WHITE,
  },
  image: {
    width           : "100%",
    height          : "100%",
  },
  noImageContainer: {
    flex            : 1,
    justifyContent  : 'center',
    alignItems      : 'center',
  },
  noImageText: {
    color: COLOR.TEXT_GRAY,
  },
  indicatorContainer: {
    position        : "absolute",
    flexDirection   : "row",
    justifyContent  : "center",
    alignItems      : "center",
    bottom          : 12,
    left            : 0,
    right           : 0,
    gap             : 6,
  },
  dot: {
    width             : 5,
    height            : 5,
    borderRadius      : 2.5,
    marginHorizontal  : 4,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  dotActive: {
    width             : 8,
    height            : 8,
    borderRadius      : 4,
  },
});

export default ImageCarousel;