/**
 * Secrets that must not be allowed to have a default in production.
 *
 * Both of these used to fall back silently:
 *
 *   ADMIN_PASSWORD -> "lumina123"
 *   AUTH_SECRET    -> "lumina-dev-secret-change-me"
 *
 * Those strings are IN THIS REPOSITORY. AUTH_SECRET is the HMAC key for the
 * customer session cookie (`${userId}.${hmac(userId)}`), so shipping with the
 * default means anyone who can read the source can mint a valid cookie for any
 * user id and be signed in as that customer — and, now, sign their own document
 * URLs too. ADMIN_PASSWORD with the default means the admin panel is open to
 * anyone who has seen the repo.
 *
 * A silent fallback to a published secret is worse than no default: it fails
 * OPEN, quietly, and looks like it is working. So in production we refuse to
 * boot. In development the defaults stay, because there is no secret to protect
 * and making people set env vars to run the thing locally is how you get them
 * committing a .env.
 */

const DEV_DEFAULTS: Record<string, string> = {
  ADMIN_PASSWORD: 'lumina123',
  AUTH_SECRET: 'lumina-dev-secret-change-me',
};

export function assertSecrets(): void {
  if (process.env.NODE_ENV !== 'production') return;

  const bad: string[] = [];
  for (const [name, devDefault] of Object.entries(DEV_DEFAULTS)) {
    const value = process.env[name];
    if (!value) bad.push(`${name} is not set`);
    else if (value === devDefault) bad.push(`${name} is still the development default`);
    else if (name === 'AUTH_SECRET' && value.length < 32) {
      bad.push('AUTH_SECRET is shorter than 32 characters');
    }
  }

  if (bad.length) {
    throw new Error(
      'Refusing to start in production with insecure secrets:\n' +
        bad.map(b => `  - ${b}`).join('\n') +
        '\n\nGenerate one with:  openssl rand -hex 32\n' +
        'Set ADMIN_PASSWORD and AUTH_SECRET in the environment before starting.\n',
    );
  }
}
