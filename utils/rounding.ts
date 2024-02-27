export function roundToNearestQuarter(n: number) {
  return Math.round(n * 4) / 4;
}

export function roundToNearestFive(n: number) {
  return (Math.ceil(n / 5) * 5);
}

export function roundToNearestTen(n: number) {
  return Math.ceil(n / 10) * 10;
}
