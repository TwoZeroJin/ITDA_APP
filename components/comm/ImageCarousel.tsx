import { COLOR } from "@/constants";
import React, { useRef, useState } from "react";
import { GestureResponderEvent,
  PanResponderGestureState, View, FlatList, Dimensions, Image, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
import NoImage from '@/assets/images/no_image.svg';

interface ImageCarouselProps  {
  images            : string[];           // 이미지 URL
  height?           : number;             // 기본 높이
  imageRadius?      : number;             // 이미지 모서리 둥글기 (옵션)
  showIndicator?    : boolean;            // 인디케이터 표시 여부
  onPressImage?     : (idx: number) => void;
};

export function ImageCarousel({ images, height = 300, imageRadius, showIndicator = true, onPressImage }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
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
          <View style={{ width: currentWidth, height, overflow: 'hidden' }}>
            {/* @ts-ignore */}
            <ImageZoom 
              cropWidth={currentWidth}
              cropHeight={height}
              imageWidth={currentWidth}
              imageHeight={height}
              panToMove={true}
              pinchToZoom={true}
              enableDoubleClickZoom={true}
              // 💡 매개변수 뒤에 각각 : GestureResponderEvent 와 : PanResponderGestureState 를 붙여줍니다.
              onStartShouldSetPanResponder={(e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                return false; 
              }}
              onMoveShouldSetPanResponder={(e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                return isZoomed || gestureState.numberActiveTouches >= 2;
              }}
              onMoveShouldSetPanResponderCapture={(e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                if (!isZoomed && gestureState.numberActiveTouches === 1) {
                  return false;
                }
                return true;
              }}              
              // 💡 라이브러리 자체 버그 방지: 줌 동작을 무겁게 잡지 않도록 임계값 최소화
              minScale={1}
              maxScale={4}
              // 💡 확대 도중 삐져나가는 현상을 방지하고, 손을 떼면 원래 크기로 자석처럼 돌아오게 유도
              responderRelease={() => {}}
            >
              <Image
                source={{ uri: item }}
                style={[
                  styles.image,
                  { width: currentWidth, height },
                  imageRadius !== undefined && { borderRadius: imageRadius },
                ]}
                resizeMode="cover"
              />
            </ImageZoom>          
          </View>
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