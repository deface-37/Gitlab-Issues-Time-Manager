export type Settings = {
  url: string;
  groupName: string;
};

export function saveSettings(settings: Settings): void {
  localStorage.setItem('settings', JSON.stringify(settings));
}

export function getSettings(): Settings {
  const json = localStorage.getItem('settings');

  const defValue = {
    url: '',
    groupName: '',
  };

  return json ? { ...defValue, ...JSON.parse(json) } : defValue;
}
