export type Settings = {
  url: string;
  groupName: string;
};

export function saveSettings(settings: Settings): void {
  localStorage.setItem('settings', JSON.stringify(settings));
}

export const defaultSettings = {
  url: '',
  groupName: '',
};

export function getSettings(): Settings {
  const json = localStorage.getItem('settings');

  return json ? Object.assign({}, defaultSettings, JSON.parse(json)) : defaultSettings;
}
