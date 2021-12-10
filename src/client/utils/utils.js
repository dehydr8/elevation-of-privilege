export async function copyToClipboard(text) {
  return await navigator.clipboard.writeText(text);
}
