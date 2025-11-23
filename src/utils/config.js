import fs from 'fs';
import path from 'path';

const CONFIG_FILENAME = 'ext-sync.json';

export function getConfigPath() {
  return path.join(process.cwd(), CONFIG_FILENAME);
}

export function loadConfig() {
  const configPath = getConfigPath();
  
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load config: ${error.message}`);
  }
}

export function saveConfig(config) {
  const configPath = getConfigPath();
  
  try {
    const content = JSON.stringify(config, null, 2);
    fs.writeFileSync(configPath, content, 'utf8');
    return configPath;
  } catch (error) {
    throw new Error(`Failed to save config: ${error.message}`);
  }
}

export function configExists() {
  return fs.existsSync(getConfigPath());
}
