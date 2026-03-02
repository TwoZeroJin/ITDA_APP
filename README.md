# ITDA_APP
ITDA 사용자 앱

# 프로젝트 라이브러리
# nodejs 22.14.0 (npm 11.2.0)
# expo SDK 53

# 프로젝트 생성 및 실행 명령어
# 생성
# npx create-expo-app@latest
# ProjectName : ITDA_APP
#
# 프로젝트 실행
# npm install 후 npm start로 소스 실행
# Expo Go 앱 설치, Expo Dev 로그인, npm start로 실행 후 나오는 QR을 스캔하여 실행
# QR 스캔시 Using development build -> Using Expo Go로 바꾸기 위해 CMD 창에서 's' 눌러 스위칭하여 나타난 QR 스캔
# QR 스캔시 소스를 실행한 서버의 네트워크(Wi-Fi)와 단말에 연결된 네트워크가 동일해야함
# npm start -> QR 스캔으로 실행이 안될 경우
# npx expo start --tunnel 명령어로 소스 실행
#
# ########################
# 25.09.09 최신 방법
# npm run start:local
# npm run start:dev
# npm run start:prod
# ########################
# 장소 검색(카카오 로컬 API) 사용 시 .env 파일에 EXPO_PUBLIC_KAKAO_REST_API_KEY 설정 필요
#
#
# #################
# Android 실행 방법
# 1. 개발자 옵션 ON 및 노트북 Ctype 선 연결 (권한 물어볼시 승인)
# 2. npm run start:dev 실행
# 3. 's' 눌러 Using Expo Go 모드로 실행
# 4. 'a' 눌러서 open Android 실행
# #################
# 
# #################
# iPhone 실행 방법
# 1. npm run start:dev 명령어 실행
# 2. 's' 눌러 Using Expo Go 모드로 실행
# 3. Camera -> QR 스캔
# 4. Expo Go 앱 실행
# #################
#
#
# 2025.09.13 Expo SDK 53.0.0 => 54.0.0 버전업 대응
# 1. npm install expo@^54.0.0
# 2. npx expo install --fix
# 3. npx expo-doctor // sdkVersion 체크, 업데이트하기 위해 무얼 해야할지 알려줌
# 4. npx expo install --check
# 5. node_modules, package-lock.json 삭제후 npm install --legacy-peer-deps 실행
# -- 안되서 결국 "@types/react": "^19.0.10" 으로 변경
#
# 2026.02.02 node 버전 업 및 전체 버전 업
# node Version 20.13.1 => 22.14.0
# 1. nvm 설치
# 2. nvm use 22.14.0
# 3. npm install (안되면 npm audit -> npm audit fix)
#
# EXPO 공용 계정 정보 : Notion 문서 참고
#
# npm start(서버 실행) 없이 Expo Go APP에서 실행하는 법 - Expo Publish (클라우드에 upload)
# 1. 명령어 창에서 eas update 실행
# 2. publish 진행 (enter)
# 3. Expo GO 앱 실행후 로그인 (EXPO 공용 계정으로 로그인 필요)
# 4. 앱 실행
#
# 빌드 방법 (추후 개발자 계정 등록 후 진행 필요)
# 1. npm install -g eas-cli
# 2. eas login
# 3. eas build:configure (빌드 초기화)
# 4. eas build -p ios --profile dev (iOS 개발 빌드)