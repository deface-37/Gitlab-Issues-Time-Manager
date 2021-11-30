type Settings = {
  url: string;
  personalToken: string;
};

export function saveSettings(settings: Settings): void {
  localStorage.setItem('settings', JSON.stringify(settings));
}

export function getSettings(): Settings {
  const res = localStorage.getItem('settings');

  return JSON.parse(res);
}
