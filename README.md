
# ITDA_APP

> 교회 공동체를 위한 ITDA(잇다) 사용자 모바일 애플리케이션

React Native와 Expo 기반으로 개발한 ITDA 사용자 앱입니다.

## 1. 프로젝트 정보

| 항목 | 내용 |
|---|---|
| 프로젝트명 | ITDA_APP |
| 앱 이름 | 잇다 |
| 개발 환경 | React Native / Expo |
| 개발 언어 | TypeScript |
| Node.js | 22.14.0 |
| npm | 11.2.0 |
| Expo SDK | 57 |
| 플랫폼 | iOS / Android |

### 주요 기술 스택

- React Native
- Expo
- TypeScript
- Expo Router
- TanStack Query
- Axios
- Expo SecureStore
- MQTT
- EAS Build / EAS Update

---

## 2. 개발 환경 설정 및 실행

### 2.1 프로젝트 생성

```bash
npx create-expo-app@latest
```

프로젝트 이름: `ITDA_APP`

### 2.2 의존성 설치

```bash
npm install
```

### 2.3 프로젝트 실행

프로젝트의 환경별 실행 스크립트를 이용합니다.

```bash
# Local 환경
npm run start:local

# Development 환경
npm run start:dev

# Production 환경
npm run start:prod
```

### 2.4 Expo Go를 이용한 실행

1. 모바일 기기에 Expo Go 앱 설치
2. Expo 계정 로그인
3. PC에서 프로젝트 실행
4. 터미널에서 `s` 키를 눌러 Development Build 모드에서 Expo Go 모드로 전환
5. 출력된 QR 코드를 모바일 기기로 스캔

**네트워크 주의사항**

- PC와 모바일 기기가 동일한 Wi-Fi 네트워크에 연결되어 있어야 합니다.
- QR 코드 스캔 후 앱이 실행되지 않는 경우 아래 명령어를 사용합니다.

```bash
npx expo start --tunnel
```

### 2.5 Android 실기기 실행

1. Android 기기의 개발자 옵션 활성화
2. USB 디버깅 활성화
3. USB 케이블로 PC와 기기 연결
4. 연결 권한 요청 시 승인
5. Expo 실행 터미널에서 `s`를 눌러 Expo Go 모드로 전환
6. `a`를 눌러 Android 앱 실행

---

## 3. EAS Update (OTA 업데이트)

앱스토어 및 플레이스토어를 통한 신규 바이너리 배포 없이 JavaScript 및 정적 리소스를 업데이트할 때 사용합니다.

### 3.1 환경별 업데이트

```bash
# Local 환경
npm run update:local

# Development 환경
npm run update:dev

# Production 환경
npm run update:prod
```

> 2026.06.03: 기존 EAS Update 명령어를 `.env` 파일을 읽는 환경별 npm 스크립트로 변경했습니다.

---

## 4. Expo SDK 및 라이브러리 관리

### 4.1 SDK 버전 업그레이드

Expo SDK 업그레이드 시 다음 순서로 진행합니다.

```bash
# Expo SDK 버전 변경
npm install expo@^57.0.0

# SDK 호환 라이브러리 업데이트
npx expo install --fix

# 프로젝트 진단
npx expo-doctor

# 의존성 버전 확인
npx expo install --check
```

필요한 경우 `package.json`, `app.json`, `app.config.ts`의 설정 및 라이브러리 버전을 함께 확인합니다.

### 4.2 의존성 확인 및 업데이트

```bash
# 업데이트 가능한 라이브러리 확인
npm outdated

# 라이브러리 업데이트
npm update
```

빌드 오류나 라이브러리 간 의존성 충돌이 발생하면 `expo-doctor`의 진단 결과를 확인합니다.

### 4.3 SDK 업그레이드 이력

| 일자 | 변경 사항 | 주요 작업 내용 |
|---|---|---|
| 2025.09.13 | SDK 53 → 54 | Expo 및 관련 라이브러리 업데이트 |
| 2026.05.02 | SDK 54 → 55 | EAS CLI 업데이트 및 EAS Update 확인 |
| 2026.09.07 | SDK 54 → 57 | iOS 실기기 실행을 위한 SDK 업데이트 및 프로젝트 설정 변경 |

**SDK 54 → 55 업그레이드 참고사항**

- EAS Update 실행 과정에서 문제가 발생하여 EAS CLI를 재설치했습니다.
- 당시 Expo Go가 SDK 54를 지원하고 있어 SDK 55 업그레이드 이후 Expo Go 호환성을 별도로 고려했습니다.

**SDK 54 → 57 업그레이드 참고사항**

- iOS 실기기 실행 시 SDK 57 업데이트가 필요했습니다.
- Expo 및 관련 라이브러리 버전을 변경했습니다.
- `app.json`, `app.config.ts` 설정을 확인했습니다.

---

## 5. EAS Build 설정 및 빌드

### 5.1 EAS CLI 설치 및 로그인

```bash
# EAS CLI 설치
npm install -g eas-cli

# Expo 계정 로그인
eas login

# EAS Build 설정 초기화
eas build:configure
```

### 5.2 환경별 빌드

`eas.json`에 정의된 프로파일을 기준으로 빌드를 진행합니다.

```bash
# iOS 빌드
eas build -p ios --profile local
eas build -p ios --profile dev
eas build -p ios --profile prod

# Android 빌드
eas build -p android --profile local
eas build -p android --profile dev
eas build -p android --profile prod
```

### 5.3 최초 빌드 시 설정

최초 빌드 시 다음 항목을 확인합니다.

1. Expo 계정 로그인
2. Apple Developer 계정 등록 (iOS)
3. Google Firebase 및 FCM 설정 (Android)
4. Apple 인증서 및 Provisioning Profile 설정
5. Push Notification 인증 키 생성 및 등록
6. 빌드 대상 플랫폼 선택
7. 빌드 로그 확인 및 오류 대응

### 5.4 iOS 실기기 등록

개발용 iOS 기기에서 빌드된 앱을 실행하려면 기기 등록이 필요할 수 있습니다.

```bash
eas device:create
```

진행 절차:

1. Apple ID 로그인 및 인증
2. Website 방식으로 기기 등록 URL 생성
3. QR 코드를 통해 iOS 기기에 등록 프로파일 다운로드
4. 설정에서 프로파일 설치
5. iOS 16 이상은 개발자 모드 활성화 필요

> 기기 등록 및 인증서 설정은 Apple Developer 계정의 권한과 등록 상태에 따라 달라질 수 있습니다.

---

## 6. Push Notification 설정

푸시 알림 기능을 사용하기 위한 설정입니다.

### 6.1 사전 준비

- Expo 계정
- EAS Build 설정
- Apple Developer Membership (iOS)
- Firebase 프로젝트 및 FCM 설정 (Android)

### 6.2 iOS 푸시 알림 설정

1. Apple Developer 계정 등록
2. iOS 앱의 Push Notifications 권한 설정
3. EAS 인증서 및 프로비저닝 설정
4. Push Notification 인증 키 생성 및 등록
5. 빌드 후 실제 기기에서 푸시 수신 테스트

### 6.3 Android 푸시 알림 설정

1. Firebase 프로젝트 생성
2. Firebase Cloud Messaging 설정
3. 프로젝트의 Firebase 관련 설정 적용
4. EAS Build 설정 및 FCM 인증 정보 등록
5. 빌드 후 실제 기기에서 푸시 수신 테스트

---

## 7. iOS 앱스토어 배포

### 7.1 사전 준비

- Apple Developer Membership 가입
- App Store Connect 앱 등록
- EAS Build 인증서 및 프로비저닝 설정 완료

### 7.2 Production 빌드

```bash
npm run build:ios
```

### 7.3 App Store Connect 제출

```bash
eas submit --platform ios
```

제출 과정:

1. EAS에서 빌드 선택
2. 제출 대상 빌드 선택
3. App Store Connect 업로드 진행
4. App Store Connect에서 빌드 처리 상태 확인
5. 앱 정보 및 심사 정보 확인
6. 앱 심사 제출 및 배포 진행

### 7.4 iOS 빌드 관련 참고사항

**2026.06.20 Apple 로그인 및 인증 문제**

- Apple에서 SMS 인증 방식 사용을 권장하지 않는 상황이 발생했습니다.
- iOS 기기에 등록된 Apple ID로 로그인한 후 빌드를 진행하는 방식으로 대응했습니다.

참고 문서:
https://github.com/expo/fyi/blob/main/apple-2fa-sms-issues-workaround.md

---

## 8. Google Play 배포

### 8.1 사전 준비

- Google Play Console 개발자 계정
- Firebase 및 FCM 설정
- EAS Build 설정

### 8.2 Android Production 빌드

```bash
npm run build:aos
```

### 8.3 최초 앱 등록 및 배포

1. Google Play Console에서 앱 생성
2. 앱 기본 정보 및 스토어 등록 정보 입력
3. 앱 설정 및 필수 항목 완료
4. 신규 개발자 계정의 경우 비공개 테스트 진행
5. 생성된 `.aab` 파일을 Play Console에 직접 업로드
6. 프로덕션 출시 진행

### 8.4 이후 버전 배포

```bash
eas submit --platform android
```

제출 과정:

1. EAS에서 빌드 선택
2. 제출 대상 빌드 선택
3. Google Play Console 업로드 진행
4. 출시 상태 및 검토 결과 확인

**참고사항**

현재 EAS Submit을 통한 Android 자동 제출 과정에서 문제가 발생한 이력이 있어, 필요시 `.aab` 파일을 직접 업로드하는 방식으로 진행합니다.

### 8.5 Android 난독화 대응

**2026.09.18**

- Google Play 난독화 관련 정책 대응 작업 진행
- `expo-build-properties`를 이용한 빌드 설정 변경
- 난독화 및 빌드 산출물 검증 필요

---

## 9. 서버 SSL 설정 (Let's Encrypt)

Oracle Cloud VM 환경에서 Nginx Reverse Proxy와 Let's Encrypt를 이용해 SSL 인증서를 적용합니다.

### 9.1 Certbot 설치

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 9.2 방화벽 포트 허용

Ubuntu 서버의 iptables에서 HTTP/HTTPS 포트를 허용합니다.

```bash
sudo iptables -I INPUT 7 -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 7 -p tcp --dport 443 -j ACCEPT
```

Oracle Cloud에서도 다음 설정이 필요합니다.

- Networking
- Virtual Cloud Networks
- Security Lists
- Ingress Rules
- TCP 80, 443 포트 허용

### 9.3 도메인 및 DNS 설정

- 도메인 구매 및 DNS 설정
- 서버 공인 IP와 도메인 연결
- DNS 전파 및 도메인 접속 확인

### 9.4 Nginx Reverse Proxy 설정

설정 파일 생성:

```bash
cd /etc/nginx/sites-available
sudo vi itda-api
```

API 서버 설정 예시:

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:6528;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

CMS 서버 설정 예시:

```nginx
server {
    listen 80;
    server_name cms.example.com;

    location / {
        proxy_pass http://127.0.0.1:6538;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 9.5 Nginx 설정 적용

```bash
# 설정 파일 연결
sudo ln -s /etc/nginx/sites-available/itda-api \
/etc/nginx/sites-enabled/itda-api

# 설정 검증
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

### 9.6 SSL 인증서 발급

```bash
sudo certbot --nginx \
-d api.example.com \
-d cms.example.com \
-d mqtt.example.com
```

이메일 입력 및 이용약관 동의 후 인증서 발급을 진행합니다.

> MQTT 서비스의 경우 WebSocket 연결 및 SSL 설정도 별도로 확인해야 합니다.

---

## 10. 앱 버전 업데이트

앱의 신규 버전을 배포할 때 다음 절차를 진행합니다.

### 10.1 앱 버전 변경

`package.json`의 `version` 값을 변경합니다.

```json
{
  "version": "1.1.2"
}
```

버전 정책에 맞춰 Major / Minor / Patch 값을 변경합니다.

### 10.2 스토어 배포

- iOS: App Store Connect 제출 및 심사
- Android: Google Play Console 제출 및 검토

### 10.3 CMS 버전 정보 등록

스토어 배포 완료 후 CMS에 접속합니다.

1. CMS 로그인
2. 설정관리 메뉴 진입
3. 버전관리 메뉴 진입
4. iOS 및 Android 버전 정보 각각 등록

등록 항목:

- 디바이스 유형
- 앱 버전
- 앱 버전명
- 업데이트 필수 여부

### 10.4 DB 직접 등록

CMS에서 등록이 어려운 경우 DB에서 직접 관리할 수 있습니다.

테이블: `TB_VIRSION_HIST`

| 컬럼 | 설명 |
|---|---|
| DEVICE_TYPE | IOS / AOS |
| APP_VER | 앱 버전 코드 |
| APP_VER_NAME | 앱 버전명 |
| UPDATE_STAT | 업데이트 필수 여부 |

등록 기준:

1. DEVICE_TYPE은 IOS와 AOS 각각 등록
2. APP_VER는 해당 디바이스의 기존 최대값 + 1
3. APP_VER_NAME은 `package.json`의 version과 동일하게 설정
4. UPDATE_STAT이 1이면 필수 업데이트 처리

> 현재 업데이트 필수 여부의 실제 처리 로직은 `/api/main/entry` API에 구현되어 있습니다. 변경이 필요한 경우 해당 API도 함께 확인해야 합니다.

---

## 11. API 및 CMS 서버 배포

API 또는 CMS 소스 변경 사항을 운영 서버에 반영하는 절차입니다.

1. SSH를 통해 서버 접속
2. API 또는 CMS 프로젝트 디렉터리 이동
3. `build.sh` 실행
4. 빌드 결과 및 서버 로그 확인
5. 서비스 정상 동작 여부 확인

---

## 12. 운영 및 트러블슈팅

### 12.1 Expo SDK 관련 오류

```bash
npx expo-doctor
```

- Expo SDK와 라이브러리 버전 호환성 확인
- Advice 메시지에 따른 수정 작업
- 필요시 `npx expo install --fix` 실행

### 12.2 Expo Go 실행 오류

- PC와 모바일의 동일 네트워크 연결 여부 확인
- Expo Go SDK 호환성 확인
- Expo Go 모드 전환 여부 확인
- 필요시 Tunnel 모드 실행

```bash
npx expo start --tunnel
```

### 12.3 라이브러리 의존성 충돌

기존 SDK 업그레이드 과정에서 다음과 같은 작업을 진행한 이력이 있습니다.

- `node_modules` 삭제
- `package-lock.json` 삭제
- 의존성 재설치
- `@types/react` 버전 조정

```bash
npm install --legacy-peer-deps
```

> 위 명령어는 의존성 충돌이 확인된 경우에만 사용하고, 일반적인 설치는 `npm install`을 우선합니다.

### 12.4 빌드 오류

- EAS Build 로그 확인
- Expo SDK 호환성 확인
- `app.json`, `app.config.ts` 설정 확인
- 네이티브 라이브러리 설정 확인
- 인증서 및 Provisioning Profile 상태 확인

---

## 13. 참고사항

- Expo 공용 계정 및 인증 정보는 별도 관리 문서를 참고합니다.
- Apple Developer 및 Google Play Console 계정 권한이 필요합니다.
- Firebase 및 FCM 설정 정보는 별도로 관리합니다.
- Production 빌드 및 배포 전 환경변수와 서버 연결 정보를 확인합니다.
- 서버 및 배포 관련 설정은 운영 환경에 따라 달라질 수 있습니다.
