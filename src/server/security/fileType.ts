/**
 * What a file IS, not what it claims to be.
 *
 * `File.type` in a multipart upload is just the Content-Type the client typed
 * into the request. It is not derived from the bytes and it is not verified by
 * anything. A caller can post a PHP script, an HTML phishing page, or a
 * zip-bomb, label it `video/mp4`, and every `file.type === ...` check in the
 * codebase waves it through.
 *
 * So we look at the bytes. Every format below is identified by a magic number —
 * a fixed signature the real format is required to start with.
 *
 * This matters most for the two uploads we do NOT re-encode: review videos and
 * certificate PDFs. An image that goes through sharp is already safe, because
 * sharp will not decode a file that is not really an image — but the signature
 * check runs first anyway, so the rejection is cheap and the error is honest.
 */

export type Sniffed = 'jpeg' | 'png' | 'webp' | 'gif' | 'avif' | 'pdf' | 'mp4' | 'webm' | 'mov' | null;

const startsWith = (buf: Uint8Array, sig: number[], offset = 0): boolean =>
  sig.every((byte, i) => buf[offset + i] === byte);

/** Reads an ISO-BMFF (MP4/MOV) brand from the `ftyp` box at offset 4. */
function isoBrand(buf: Uint8Array): string | null {
  // ....ftyp<brand>
  if (!startsWith(buf, [0x66, 0x74, 0x79, 0x70], 4)) return null;
  return String.fromCharCode(...buf.slice(8, 12));
}

/**
 * Identify a file from its leading bytes. 32 bytes is enough for every
 * signature here; pass more and it is simply ignored.
 */
export function sniff(buf: Uint8Array): Sniffed {
  if (buf.length < 12) return null;

  if (startsWith(buf, [0xff, 0xd8, 0xff])) return 'jpeg';
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
  if (startsWith(buf, [0x47, 0x49, 0x46, 0x38])) return 'gif';
  if (startsWith(buf, [0x25, 0x50, 0x44, 0x46])) return 'pdf'; // "%PDF"
  if (startsWith(buf, [0x1a, 0x45, 0xdf, 0xa3])) return 'webm'; // EBML (also .mkv)

  // RIFF....WEBP
  if (startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8)) {
    return 'webp';
  }

  const brand = isoBrand(buf);
  if (brand) {
    if (brand.startsWith('qt')) return 'mov';
    if (brand.startsWith('avif') || brand.startsWith('avis')) return 'avif';
    // isom / mp42 / M4V / iso5 ... all the MP4 family, which is what a phone shoots.
    return 'mp4';
  }

  return null;
}

/** Read just enough of a File to identify it, without buffering the whole thing. */
export async function sniffFile(file: File): Promise<Sniffed> {
  const head = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  return sniff(head);
}

export const IMAGE_TYPES: Sniffed[] = ['jpeg', 'png', 'webp', 'gif', 'avif'];
export const VIDEO_TYPES: Sniffed[] = ['mp4', 'webm', 'mov'];
