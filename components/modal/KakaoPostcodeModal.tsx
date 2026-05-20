import CommBottomButton from '@/components/comm/CommBottomButton';
import { COLOR, COMM_STYLES } from '@/constants';
import React from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type PostcodeAddress = {
  address: string;
  roadAddress?: string;
  jibunAddress?: string;
  buildingName?: string;
};

type KakaoPostcodeModalProps = {
  visible: boolean;
  postcodeKey: number;
  onClose: () => void;
  onComplete: (data: PostcodeAddress) => void;
};

const POSTCODE_WEBVIEW_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <style>
      body, html { width: 100%; height: 100%; margin: 0; padding: 0; }
      #container { width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="container"></div>
    <script>
      function init() {
        new daum.Postcode({
          oncomplete: function(data) {
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          },
          width: '100%',
          height: '100%',
          animation: true,
          hideMapBtn: true,
        }).embed(document.getElementById('container'));
      }

      window.addEventListener('DOMContentLoaded', init);
    </script>
  </body>
</html>
`;

export default function KakaoPostcodeModal({ visible, postcodeKey, onClose, onComplete }: KakaoPostcodeModalProps) {
  const KakaoPostcodeEmbed = Platform.OS === 'web' ? require('react-daum-postcode').default : null;
  const WebView = Platform.OS !== 'web' ? require('react-native-webview').WebView : null;
  const insets = useSafeAreaInsets();

  const handleWebViewMessage = (event: any) => {
    const payload = JSON.parse(event.nativeEvent.data) as PostcodeAddress;
    onComplete(payload);
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      statusBarTranslucent
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        style={[
          COMM_STYLES.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <View style={styles.modalContainer}>
          <View style={styles.postcodeContainer}>
            {Platform.OS === 'web' && KakaoPostcodeEmbed && (
              <KakaoPostcodeEmbed
                key={`postcode-${postcodeKey}`}
                onComplete={onComplete}
                autoClose={false}
                style={{ width: '100%', height: '100%' }}
              />
            )}

            {Platform.OS !== 'web' && WebView && (
              <WebView
                key={`postcode-webview-${postcodeKey}`}
                source={{
                  html: POSTCODE_WEBVIEW_HTML,
                  baseUrl: 'https://postcode.map.daum.net',
                }}
                onMessage={handleWebViewMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
              />
            )}
            <CommBottomButton label="닫기" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex                : 1,
    backgroundColor     : COLOR.COMM_WHITE,
    overflow             : 'hidden',
    gap                  : 12,
  },
  postcodeContainer: {
    flex                : 1,
    borderRadius        : 12,
    overflow            : 'hidden',
  },
});
