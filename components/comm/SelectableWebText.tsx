import React, { useMemo, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';

interface SelectableWebTextProps {
  text?: string;
  style?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    lineHeight?: number;
    maxWidth?: number;
  };
}

const URL_REGEX = /(https?:\/\/[^\s<]+)/g;

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const toHtml = (value: string) => {
  const normalizedValue = value
    .replace(/\\r\\n/g, '\n')
    .replace(/\\r|\\n/g, '\n')
    .replace(/\r\n?|\n/g, '\n');

  return escapeHtml(normalizedValue)
    .replace(URL_REGEX, (url) => {
      const safeUrl = url.replace(/[.,!?;:)]+$/g, '');
      const trailingText = url.slice(safeUrl.length);
      return `<a href="${safeUrl}">${safeUrl}</a>${trailingText}`;
    })
    .replace(/\n/g, '<br />');
};

export default function SelectableWebText({ text = '', style }: SelectableWebTextProps) {
  const [contentHeight, setContentHeight] = useState(24);
  const html = useMemo(() => {
    const color = style?.color ?? '#2F2F2F';
    const fontSize = style?.fontSize ?? 16;
    const lineHeight = style?.lineHeight ?? Math.round(fontSize * 1.45);
    const fontFamily = style?.fontFamily ? `font-family: '${style.fontFamily}';` : '';

    return `<!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
          <style>
            * { -webkit-user-select: text; user-select: text; }
            html, body { margin: 0; padding: 0; background: transparent; }
            body { color: ${color}; font-size: ${fontSize}px; line-height: ${lineHeight}px; white-space: pre-wrap; word-break: break-word; ${fontFamily} }
            a { color: #3478F6; text-decoration: underline; }
          </style>
        </head>
        <body>${toHtml(text)}</body>
      </html>`;
  }, [style?.color, style?.fontFamily, style?.fontSize, style?.lineHeight, text]);

  const handleMessage = (event: WebViewMessageEvent) => {
    const nextHeight = Number(event.nativeEvent.data);
    if (Number.isFinite(nextHeight) && nextHeight > 0) {
      setContentHeight(Math.ceil(nextHeight));
    }
  };

  const handleNavigation = (request: WebViewNavigation) => {
    if (request.url.startsWith('http://') || request.url.startsWith('https://')) {
      void Linking.openURL(request.url);
      return false;
    }
    return true;
  };

  return (
    <View style={[styles.container, { height: contentHeight, maxWidth: style?.maxWidth }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webView}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={handleNavigation}
        injectedJavaScript="window.ReactNativeWebView.postMessage(String(document.body.scrollHeight)); true;"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});