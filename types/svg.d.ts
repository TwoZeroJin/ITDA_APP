/**
 * 소스에서 SVG 파일을 인식하기 위한 타입 선언
 */
declare module '*.svg' {
  import React from 'react';
    import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}