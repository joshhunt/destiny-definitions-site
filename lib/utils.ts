export function friendlyDiffName(name: string) {
  const match = name.match(/Destiny(\w+)Definition/);

  return match ? match[1] : name;
}
