import { COLOR } from "@/constants";
import React, { useRef, useState } from "react";
import { View, FlatList, Dimensions, Image, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent, Pressable } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
import NoImage from '@/assets/images/no_image.svg';
import ImagePreviewModal from '@/components/modal/ImagePreviewModal';

interface ImageCarouselProps  {
  images            : string[];           // 이미지 URL
  height?           : number;             // 기본 높이
  imageRadius?      : number;             // 이미지 모서리 둥글기 (옵션)
  showIndicator?    : boolean;            // 인디케이터 표시 여부
  resizeMode?       : "contain" | "cover" | "stretch" | "repeat" | "center"; // 이미지 리사이즈 모드 (옵션)
  isZoomEnabled?    : boolean;            // 이미지 줌 가능 여부 (옵션)
  onPressImage?     : (idx: number) => void;
};

export function ImageCarousel({ images, height = 300, imageRadius, showIndicator = true, resizeMode = "contain", isZoomEnabled = false }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const ref = useRef<FlatList<string> | null>(null);
  
  const currentWidth = containerWidth || Dimensions.get('window').width;
  const canSwipe = images.length > 1;

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && nextWidth !== containerWidth) {
      setContainerWidth(nextWidth);
    }
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (currentWidth <= 0) {
      return;
    }
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / currentWidth);
    setIndex(newIndex);
  };

  const handleImagePress = (imageIndex: number) => {
    setPreviewIndex(imageIndex);
    setIsPreviewVisible(true);
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
            style={[styles.imagePage, { width: currentWidth, height }]}
            onPress={() => handleImagePress(idx)}
          >
            {/* @ts-ignore */}
            {isZoomEnabled ? (
              // @ts-ignore
              <ImageZoom 
                cropWidth={currentWidth}
                cropHeight={height}
                imageWidth={currentWidth}
                imageHeight={height}
                panToMove={true}
                pinchToZoom={true}
                enableDoubleClickZoom={true}
                minScale={1}
                maxScale={4}
              >
                <Image
                  source={{ uri: item }}
                  style={[
                    styles.image,
                    { width: currentWidth, height },
                    imageRadius !== undefined && { borderRadius: imageRadius },
                  ]}
                  resizeMode={resizeMode}
                />
              </ImageZoom>
            ) : (
              <Image
                source={{ uri: item }}
                style={[
                  styles.image,
                  { width: currentWidth, height },
                  imageRadius !== undefined && { borderRadius: imageRadius },
                ]}
                resizeMode={resizeMode}
              />
            )}
          </Pressable>
        )}
      />)}
      {!images.length && (
        <View style={styles.noImageContainer}>
          <NoImage />
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

      <ImagePreviewModal
        visible={isPreviewVisible}
        images={images}
        initialIndex={previewIndex}
        onClose={() => setIsPreviewVisible(false)}
      />
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
  imagePage: {
    overflow        : 'hidden',
    backgroundColor : 'rgba(0, 0, 0, 0.07)',
  },
  noImageContainer: {
    flex            : 1,
    justifyContent  : 'center',
    alignItems      : 'center',
    overflow        : 'hidden',
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