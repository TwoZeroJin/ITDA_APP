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
#
#
# #################
# Android 실행 방법
# Ctype 연결 후 소스 실행 -> Press a (open Android) 로 실행
# #################
# 
# #################
# iPhone 실행 방법
# 's' 눌러 Using Expo Go 모드로 실행
# Camera -> QR 스캔
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