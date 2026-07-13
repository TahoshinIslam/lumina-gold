/**
 * Code 128 (subset B) barcode, drawn as an SVG path.
 *
 * Written out rather than pulled in: the invoice needs to encode one short,
 * known-safe string (an order number — uppercase, digits, dashes), and a
 * barcode library would be a dependency, a bundle, and a licence for what is
 * a lookup table and a checksum.
 */

/**
 * The 107 Code 128 symbols as bar/space run-lengths, indexed by symbol value:
 * 0–102 are data, 103–105 the start codes, 106 the stop. The table must be
 * complete — a short one indexes `undefined` for START_B (104) and throws.
 */
const PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213', //  0
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132', // 10
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211', // 20
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313', // 30
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331', // 40
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111', // 50
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214', // 60
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111', // 70
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141', // 80
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141', // 90
  '114131', '311141', '411131',                                                                        // 100
  '211412', '211214', '211232',                       // 103 START A, 104 START B, 105 START C
  '2331112',                                          // 106 STOP
];
const START_B = 104;
const STOP = 106;

export interface Barcode {
  path: string;
  width: number;
  height: number;
}

/**
 * Encode `text` as a Code 128-B barcode. Returns an SVG path of black bars in a
 * 1-unit-per-module coordinate space, so the caller scales it with a viewBox.
 */
export function code128(text: string, height = 56): Barcode {
  // Subset B covers ASCII 32–126; anything else can't be represented, so it's
  // dropped rather than silently mis-encoded into a different character.
  const chars = [...text].filter(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126);

  const values = [START_B, ...chars.map(c => c.charCodeAt(0) - 32)];
  // Checksum: start value + each value weighted by its 1-based position, mod 103.
  const checksum = values.reduce((sum, value, index) => sum + value * (index === 0 ? 1 : index), 0) % 103;
  const symbols = [...values, checksum, STOP];

  let x = 0;
  let path = '';
  for (const symbol of symbols) {
    const runs = PATTERNS[symbol];
    // Runs alternate bar, space, bar, space… starting with a bar.
    for (let i = 0; i < runs.length; i++) {
      const width = Number(runs[i]);
      if (i % 2 === 0) path += `M${x} 0h${width}v${height}h-${width}z`;
      x += width;
    }
  }
  // Code 128 requires a quiet zone of at least 10 modules each side.
  return { path, width: x, height };
}
