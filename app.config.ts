import fs from 'fs';
import path from 'path';
import type { ExpoConfig } from 'expo/config';

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

const config: ExpoConfig = {
  ...expo,
  extra: {
    ...expo.extra,
    appEnv,
  },
};

export default config;
