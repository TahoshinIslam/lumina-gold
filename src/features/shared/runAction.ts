/**
 * Call a server action without letting it throw at the caller.
 *
 * Server actions in this app return `{ ok, message }` for everything they can
 * FORESEE — a sold-out piece, a bad coupon, the wrong password. Those are values,
 * not exceptions, because they are ordinary answers to an ordinary request.
 *
 * What they can't foresee is the database going away, the network dropping
 * mid-request, or a bug. Those reject the promise, and a caller written as
 *
 *     setBusy(true);
 *     const result = await placeOrderAction(...);   // throws
 *     setBusy(false);                               // never runs
 *
 * leaves the button spinning for ever with nothing said. Every client call goes
 * through here instead: an unexpected failure becomes the same `{ ok: false }`
 * shape as a foreseen one, so the UI always has something to show and always
 * gets its `busy` flag back.
 */
export type ActionResult = { ok: boolean; message?: string };

const FALLBACK = 'Something went wrong on our side. Please try again.';

export async function runAction<T extends ActionResult>(
  call: () => Promise<T>,
  fallback: string = FALLBACK,
): Promise<T | { ok: false; message: string }> {
  try {
    return await call();
  } catch (error) {
    // The real cause belongs in the server log, not in front of a customer —
    // it can carry SQL, table names and ids.
    console.error('[action]', error);
    return { ok: false, message: fallback };
  }
}
