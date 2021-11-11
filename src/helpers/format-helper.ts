export function formatIssueTime(seconds: number): string {
  const date = new Date(seconds * 10e3);
  let result = [date.getHours() + ' ч'];
  if (date.getMinutes()) {
    result.push(date.getMinutes() + 'м');
  }

  return result.join(' ');
}
