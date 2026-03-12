import fs from 'fs';
import path from 'path';

const storedConfigPath = path.resolve(
  'src/features/externalAPI/dataHandlerStorage/config.json',
);

export function readStoredConfig(): Record<string, string> {
  try {
    if (!fs.existsSync(storedConfigPath)) {
      return {};
    }

    const raw = fs.readFileSync(storedConfigPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read stored config', error);
    return {};
  }
}

export function getStoredConfigValue(
  storedConfig: Record<string, string>,
  key: string,
  fallback: string,
) {
  return storedConfig[key] ?? fallback;
}
