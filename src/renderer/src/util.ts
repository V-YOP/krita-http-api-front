export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}
export function generateUUID() {
  const cryptoObj = window.crypto || window['msCrypto']; // for IE 11
  const array = new Uint8Array(16);
  cryptoObj.getRandomValues(array);

  // 设置 UUID 的版本和变种
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;

  const hexArray = Array.from(array, byte => byte.toString(16).padStart(2, '0'));
  return `${hexArray.slice(0, 4).join('')}-${hexArray.slice(4, 6).join('')}-${hexArray.slice(6, 8).join('')}-${hexArray.slice(8, 10).join('')}-${hexArray.slice(10, 16).join('')}`;
}

export function secondsTohhmmss(second: number) {
  // Calculate hours, minutes and seconds
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second % 3600) / 60);
  const seconds = second % 60;

  // Convert to two-digit strings
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  // Return the formatted time
  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export function toKritaCoord(x: number, electronZoomFactor: number, kritaScalingFactor: number) {
  return Math.trunc(x * electronZoomFactor / kritaScalingFactor)
}
export function fromKritaCoord(x: number, electronZoomFactor: number, kritaScalingFactor: number) {
  return Math.trunc(x / electronZoomFactor * kritaScalingFactor)
}