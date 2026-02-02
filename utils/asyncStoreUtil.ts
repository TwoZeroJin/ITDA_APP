import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveAsyncStore(key: string, value: unknown) {
  if (value === undefined) return;
  const str = typeof value === 'string' ? value : JSON.stringify(value);
  await AsyncStorage.setItem(key, str);
}

async function getAsyncStore(key: string): Promise<string | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw == null) return null;
  return raw;
}

async function deleteAsyncStore(key: string) {
  await AsyncStorage.removeItem(key);
}

async function clearAsyncStore() {
  await AsyncStorage.clear();
}

export { deleteAsyncStore, getAsyncStore, saveAsyncStore, clearAsyncStore };

