import fs from 'fs';
import path from 'path';
import type { ExpoConfig } from 'expo/config';
import { withProjectBuildGradle, ConfigPlugin } from '@expo/config-plugins';

const ENV_FILE_BY_APP_ENV: Record<string, string> = {
  local: '.env.local',
  dev: '.env.dev',
  prod: '.env.prod',
};

function normalizeEnvValue(rawValue: string) {
  const trimmedValue = rawValue.trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"'))
    || (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

function loadEnvFile(appEnv: string) {
  const envFileName = ENV_FILE_BY_APP_ENV[appEnv] ?? ENV_FILE_BY_APP_ENV.local;
  const envFilePath = path.join(__dirname, envFileName);

  if (!fs.existsSync(envFilePath)) {
    return;
  }

  const envFileContent = fs.readFileSync(envFilePath, 'utf8');

  envFileContent.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex < 0) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = normalizeEnvValue(trimmedLine.slice(separatorIndex + 1));

    process.env[key] = value;
  });
}

const appEnv = process.env.APP_ENV ?? 'local';

loadEnvFile(appEnv);

const { expo } = require('./app.json') as { expo: ExpoConfig };

/**
 * android/build.gradle의 allprojects.repositories에 카카오 메이븐 레포지토리를 자동으로 추가하는 Expo Config Plugin
 */
const withKakaoMavenRepository: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (modConfig) => {
    if (modConfig.modResults.language === 'groovy') {
      const kakaoMavenRepo = "maven { url 'https://devrepo.kakao.com/nexus/content/groups/public/' }";

      if (!modConfig.modResults.contents.includes(kakaoMavenRepo)) {
        modConfig.modResults.contents = modConfig.modResults.contents.replace(
          /allprojects\s*\{\s*repositories\s*\{/,
          `allprojects {\n  repositories {\n    ${kakaoMavenRepo}`
        );
      }
    }
    return modConfig;
  });
};

let config: ExpoConfig = {
  ...expo,
  extra: {
    ...expo.extra,
    appEnv,
  },
};

config = withKakaoMavenRepository(config);

export default config;
