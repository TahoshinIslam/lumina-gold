import { assertSecrets } from '@/server/security/env';

/**
 * Runs once, before the server accepts its first request.
 *
 * That timing is the whole point: a production deploy missing AUTH_SECRET or
 * ADMIN_PASSWORD dies here, loudly, instead of coming up and quietly signing
 * cookies with a key that is published in this repository.
 */
export function register() {
  assertSecrets();
}
