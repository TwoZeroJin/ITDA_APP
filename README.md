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
# 25.09.09 최신 실행 방법
# npm run start:local
# npm run start:dev
# npm run start:prod
# ########################
# ########################
# 26.06.03 EAS UPDATE 명령어 변경(.env 파일 read)
# npm run update:local
# npm run update:dev
# npm run update:prod
# ########################
#
#
# #################
# Android 실행 방법
# 1. 개발자 옵션 ON 및 노트북 Ctype 선 연결 (권한 물어볼시 승인)
# 2. 's' 눌러 Using Expo Go 모드로 실행
# 3. 'a' 눌러서 open Android 실행
# #################
#
# 2025.09.13 Expo SDK 53.0.0 => 54.0.0 버전업 대응
# 1. npm install expo@^54.0.0
# 2. npx expo install --fix
# 3. npx expo-doctor // sdkVersion 체크, 업데이트하기 위해 무얼 해야할지 알려줌
# 4. npx expo install --check
# 5. node_modules, package-lock.json 삭제후 npm install --legacy-peer-deps 실행
# -- 안되서 결국 "@types/react": "^19.0.10" 으로 변경
#
# 2026.05.02 Expo SDK 54.0.0 => 55.0.0 버전업 대응
# 1. eas update만 문제였으나 npm install -g eas-cli 재 실행 후 재시도, 현재 확인 완료
# 2. Expo Go 앱이 현재 SDK 54버전만 지원하여(App Store) 55로 업그레이드는 추후 고민 필요
#
# 2026.09.07 Expo SDK 54.0.0 => 57.0.0 버전업 대응
# 1. iOS Device로 실행시 57버전으로 업데이트 해야 실행 가능하도록 바뀜
# 2. npm install expo@^57.0.0
# 3. npx expo install --fix 실행후 에러날 경우 npx expo-doctor 실행후 에러 수정
# 4. package.json에서 라이브러리 버전 수정, app.json, app.config.ts 수정
#
# EXPO 공용 계정 정보 : Notion 문서 참고
#
# npm start(서버 실행) 없이 Expo Go APP에서 실행하는 법 - Expo Publish (클라우드에 upload)
# 1. eas update
# 2. publish 진행
# 3. Expo GO 앱 실행후 로그인 (EXPO 공용 계정으로 로그인 필요)
# 4. 앱 실행
#
# SDK 버전 관련 문제 발생시 대처 방법
# 1. npx expo-doctor 명령어 실행
# 2. 결과 확인 및 Advice 메시지에 있는 명령어 실행
#
# 의존성 확인 및 업데이트 (여러 라이브러리 의존성 버전업 필요시 확인, build 진행시 에러날 경우 진행)
# 1. npm outdated
# 2. npm update
#
#
# 푸시토큰 설정 및 배포 방법
# 1. Expo 계정 로그인 및 EAS build
# 2. 애플 디벨로퍼 맴버십 가입 및 결제
# 3. 구글 파이어베이스 계정 생성 및 결제 정보 등록
# 4. [*******iOS*********] eas device:create 실행
# 5. Expo Go 계정 로그인
# 6. Apple ID 로그인 -> 핸드폰 인증
# 7. How would you like to register your devices? >> Website - generate a registration URL -> QR 이미지 찍고 프로필 다운로드
# 8. 프로필 다운로드시 도난 기기 방지 해제 후 진행(하지 않을 경우 1시간 동안 대기 후 재 다운로드 필요)
# 9. 설정 -> 프로필 다운로드됨 -> 프로필 설치 진행
# 10. iOS 16부터는 설정 > 개인정보 보호 및 보안 > 개발자 모드 > 켬 필요
#
#
# 빌드 방법 (위 내용 진행 후 필요[구글|애플계정 등록])
# 1. npm install -g eas-cli
# 2. eas login
# 3. eas build:configure (빌드 초기화)
# 4. -- eas build -p ios --profile [local|dev|prod] (iOS [로컬|개발|운영] 빌드)
# 5. -- eas build -p android --profile [local|dev|prod] (Android [로컬|개발|운영] 빌드)
# 6. eas build --profile dev 명령어 실행
# 7. All 선택
# 8. Apple ID 로그인 -> Generate a new Apple Distribution Certificate? -> Y 입력
# 9. 위 설정 내용에서 Apple 프로필 설정 후 Device UUID 발급 받은 경우 목록에 선택할 수 있는 Device 나옴.
# 10. Would you like to set up Push Notifications for your project? -> Yes 선택 -> 키 생성 Y
# 11. 빌드 진행, 에러날 경우 로그 메시지 체크 후 상황에 맞는 해결 방법 진행
#
# SSL적용 방법 (무료방법 Lets Encrypt)
#
# 1. 서버에서 Certbot 설치
# - sudo apt install certbot python3-certbot-nginx -y
# 2. iptables로 80, 443 규칙 설정 (특정 라인에 INPUT)
# - sudo iptables -I INPUT 7 -p tcp --dport 80 -j ACCEPT
# - sudo iptables -I INPUT 7 -p tcp --dport 443 -j ACCEPT
# 3. 오라클 클라우드 포트 허용 추가
# - Networking > Virtual cloud networks > Default Security List For VCN > Security rules > Add Ingress Rules 추가
# 4. 도메인 구매
# - 호스팅케이알에서 구매하고 DNS 적용함
# 5. 서버에서 nginx 설정
#  - cd /etc/nginx/sites-available
# - sudo vi itda-api 생성 후 작성
# server {
#   listen 80;
#    server_name api.newitda.co.kr;
#
#    location / {
#        proxy_pass http://127.0.0.1:6528;
#
#        proxy_set_header Host $host;
#        proxy_set_header X-Real-IP $remote_addr;
#        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#        proxy_set_header X-Forwarded-Proto $scheme;
#    }
# } 
#
# server {
#    listen 80;
#    server_name cms.newitda.co.kr;
#
#    location / {
#       proxy_pass http://127.0.0.1:6538;
#
#        proxy_set_header Host $host;
#        proxy_set_header X-Real-IP $remote_addr;
#        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#        proxy_set_header X-Forwarded-Proto $scheme;
#   }
# }
# - sudo ln -s /etc/nginx/sites-available/newitda /etc/nginx/sites-enabled/
# - sudo nginx -t
# - sudo systemctl restart nginx
# - sudo certbot --nginx -d api.newitda.co.kr -d cms.newitda.co.kr -d mqtt.newitda.co.kr
# - certbot 진행하면서 이메일 및 'Y' 입력해 진행하면 완료됨
# MQTT도 작업 필요 (진행됨)
#
# 구글 플레이 제출하기 (구글 개발자 계정 세팅, 구글 FCM 설정 필요)
# 1. npm run build:android 실행 (prod로 build)
# 2. Play Console 로그인 후 앱 만들기 진행
# 3. 앱 등록하여 대시보드 이동후 앱 설정 완료 진행
# 4. 신규 개발자 계정일 경우 비공개 테스트 (12명 이상 테스터가 14일 이상 테스트 진행 필요)
# . 앱 제출 이후 eas submit --platform android로 배포 가능
#
#
# 앱스토어 제출하기 (에플 디벨로퍼 멤버십 가입)
# 1. npm run build:ios 실행 (prod로 build)
# 2. 애플 로그인 및 Y 진행 후 빌드 진행
# 3. 빌드 완료후 eas submit --platform ios 진행
# 4. Select a build from EAS
# 5. Which build would you like to submit -> 선택후 진행
# 6. appstoreconnect로 이동하여 배포 및 심사 확인 (제출완료되면 링크 줌)
# *** 2026-06-20 빌드 에러 발생 ***
# 1. 애플에서 SMS 인증을 권장하지 않게 함 https://github.com/expo/fyi/blob/main/apple-2fa-sms-issues-workaround.md
# 2. iOS 기기에 hannewacts@gmail.com 애플 아이디로 로그인 후 빌드 진행 필요
#
#
# 앱 버전 업그레이드 후 조치 사항
# 1. 앱 버전 업그레이드시 package.json에서 version 값 변경 (Major, Minor, Patch)
# 2. 버전 변경 후 구글 플레이 및 앱스토어 제출
# 3. cms.newitda.co.kr 접속 후 로그인 -> 설정관리 > 버전관리로 들어가 아이폰/안드로이드마다 앱 버전 및 버전 명, 필수 여부 등 등록 필요
# 4. DB 직접 접속하여 TB_VIRSION_HIST 테이블에서 DEVICE_TYPE, APP_VER, APP_VER_NAME, UPDATE_STAT 직접 입력 가능
# 5. DEVICE_TYPE은 IOS, AOS 각각 입력하고 APP_VER는 최대값 + 1로 등록, APP_VER_NAME은 package.json 버전에 맞게 등록, UPDATE_STAT은 1이면 필수로 업데이트 하게 해놨음. 추후 수정 필요시 /api/main/entry API 수정 필요
# 6. API 및 CMS 적용 필요시 구글 플레이 및 앱스토어 제출 완료 후 적용, ssh로 서버 접속 후 각 디렉터리에서 build.sh 실행
