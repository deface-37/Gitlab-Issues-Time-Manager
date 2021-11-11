export function formatIssueTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const hDisplay = h + ' ч ';
  const mDisplay = m > 0 ? m + ' м' : '';

  return hDisplay + mDisplay;
}
