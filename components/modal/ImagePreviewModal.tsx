import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageZoom from 'react-native-image-pan-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ImagePreviewModalProps {
  visible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}
/**
 * 이미지 크게 보기 모달
 */
export default function ImagePreviewModal({ visible, images, initialIndex, onClose }: ImagePreviewModalProps) {
  const listRef = useRef<FlatList<string> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible || images.length === 0) {
      return;
    }

    setCurrentIndex(initialIndex);
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: initialIndex, animated: false });
    });
  }, [images.length, initialIndex, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => String(index)}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollToIndexFailed={() => undefined}
          onMomentumScrollEnd={(event) => {
            setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => (
            <View style={{ width, height }}>
              {/* @ts-ignore */}
              <ImageZoom
                cropWidth={width}
                cropHeight={height}
                imageWidth={width}
                imageHeight={height}
                panToMove
                pinchToZoom
                enableDoubleClickZoom
                minScale={1}
                maxScale={4}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width, height }}
                  resizeMode="contain"
                />
              </ImageZoom>
            </View>
          )}
        />

        <View pointerEvents="box-none" style={[styles.counterContainer, { top: insets.top + 8 }]}>
          <View style={styles.counterPill}>
            <Text style={styles.counterText}>{currentIndex + 1} / {images.length}</Text>
          </View>
          <Pressable
            accessibilityLabel="이미지 미리보기 닫기"
            onPress={onClose}
            style={[styles.closeButton, { top: 0 }]}
            hitSlop={12}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex            : 1,
    backgroundColor : 'rgba(0, 0, 0, 0.9)',
    // backgroundColor : '#000000',
  },
  closeButton: {
    position        : 'absolute',
    top             : 4,
    right           : 12,
    width           : 36,
    height          : 36,
    borderRadius    : 18,
    backgroundColor : 'rgba(255, 255, 255, 0.16)',
    alignItems      : 'center',
    justifyContent  : 'center',
  },
  counterContainer: {
    position        : 'absolute',
    top             : 18,
    left            : 0,
    right           : 0,
    alignItems      : 'center',
    zIndex          : 2,
  },
  counterPill: {
    paddingHorizontal   : 11,
    paddingVertical     : 4,
    borderRadius        : 12,
    backgroundColor     : 'rgba(255, 255, 255, 0.16)',
  },
  counterText: {
    color               : 'rgba(255, 255, 255, 0.92)',
    fontSize            : 13,
    fontWeight          : '500',
    letterSpacing       : 0.2,
  },
});