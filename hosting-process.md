# Hosting Process — Nahar Jewellers (Next.js 16 + MariaDB)

How to take this project from the local XAMPP setup to a live server, and how to
update it afterwards.

## What this app needs from a host

| Requirement | Why |
|---|---|
| **Node.js 20+ (LTS)** | Runs the Next.js server (`next start`). |
| **MariaDB 10.6+ / MySQL 8** | All data — catalog, variants, orders, customers, analytics (`mysql2` client, raw SQL). |
| **Persistent disk** | Product/blog/home images are written to `public/uploads/` on the server's filesystem. |
| **~1 GB RAM minimum** | Next server + MariaDB on a small VPS works; 2 GB is comfortable. |

> ⚠️ **Serverless hosts (Vercel, Netlify) are NOT a drop-in fit** for this build:
> uploads write to the local filesystem, which serverless platforms throw away on
> every deploy/request. Use a VPS (recommended below), or first migrate uploads to
> object storage (S3/R2) if you want serverless.

**Recommended: one small VPS** (DigitalOcean / Hetzner / Linode / a BD provider) —
app + database on the same box behind nginx.

---

## 1. One-time server setup (Ubuntu 22.04/24.04)

```bash
# as root, or prefix sudo
apt update && apt upgrade -y

# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# MariaDB + nginx + certbot
apt install -y mariadb-server nginx certbot python3-certbot-nginx
mysql_secure_installation        # set a root password, remove anonymous users

# pm2 keeps the app alive across crashes/reboots
npm install -g pm2
```

### Database + user

```bash
mysql -u root -p
```
```sql
CREATE DATABASE lumina_jewelry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lumina'@'localhost' IDENTIFIED BY 'CHOOSE-A-STRONG-PASSWORD';
GRANT ALL PRIVILEGES ON lumina_jewelry.* TO 'lumina'@'localhost';
FLUSH PRIVILEGES;
```

### Schema + migrations

From your machine, copy the SQL in, then load — **schema first, then every file in
`database/migrations/` in filename order** (001 → 016; both `003_*` and both `004_*` files):

```bash
mysql -u lumina -p lumina_jewelry < database/schema.sql
for f in database/migrations/*.sql; do
  echo "applying $f"; mysql -u lumina -p'PASSWORD' lumina_jewelry < "$f";
done
```

To carry your local data over instead, dump XAMPP's DB and import it:

```bash
# locally (XAMPP)
/Applications/XAMPP/xamppfiles/bin/mysqldump -u root lumina_jewelry > lumina-dump.sql
# on the server
mysql -u lumina -p lumina_jewelry < lumina-dump.sql
```

---

## 2. Deploy the app

```bash
# choose a home for it
mkdir -p /var/www && cd /var/www
git clone <your-repo-url> nahar && cd nahar     # or rsync/scp the folder up

npm ci
```

### Environment — `/var/www/nahar/.env.production`

Every variable the code reads, in one place. **The three secrets have insecure
dev defaults baked into the code — you MUST set them in production.**

```bash
NODE_ENV=production

# Database (src/server/db/client.ts)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=lumina
DB_PASSWORD=CHOOSE-A-STRONG-PASSWORD
DB_NAME=lumina_jewelry

# Secrets — generate each with: openssl rand -hex 32
ADMIN_PASSWORD=...      # admin panel login (default is "lumina123" — change it!)
AUTH_SECRET=...         # signs customer session cookies
CRON_SECRET=...         # protects /api/cron/expire-holds

# Canonical URL (SEO, sitemap, absolute links — src/config/site.ts)
SITE_URL=https://naharjewellers.com
```

### Build and run

```bash
npm run build
pm2 start npm --name nahar -- start          # runs `next start` on :3000
pm2 save && pm2 startup                      # survive reboots (follow its printed command)
```

Check: `curl -I http://127.0.0.1:3000` → `200`.

### Uploads folder

```bash
mkdir -p public/uploads
# the pm2 process user must be able to write it
chown -R $(whoami) public/uploads
```

`public/uploads/` is generated content, not code — **exclude it from deploys**
(it's the reason a `git pull` deploy is safer than rsync-with-delete) and
**include it in backups**.

---

## 3. nginx + HTTPS

`/etc/nginx/sites-available/nahar`:

```nginx
server {
    listen 80;
    server_name naharjewellers.com www.naharjewellers.com;

    client_max_body_size 20m;          # image uploads go through Next API routes

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;   # HMR/websockets safe-guard
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/nahar /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# point your domain's A record at the server IP first, then:
certbot --nginx -d naharjewellers.com -d www.naharjewellers.com
```

Certbot rewrites the config for HTTPS and auto-renews.

---

## 4. The cron job (order-hold expiry)

Unpaid orders hold stock; `/api/cron/expire-holds` releases expired holds. Call it
every few minutes:

```bash
crontab -e
# every 5 minutes
*/5 * * * * curl -fsS -H "Authorization: Bearer YOUR_CRON_SECRET" http://127.0.0.1:3000/api/cron/expire-holds > /dev/null 2>&1
```

---

## 5. Updating the site (each release)

```bash
cd /var/www/nahar
git pull                                   # or upload changed files
npm ci                                     # only if package.json changed
# apply any NEW files in database/migrations/ (never re-run old ones)
npm run build
pm2 restart nahar
```

Near-zero downtime: `pm2 reload nahar` instead of `restart`.

---

## 5b. Continuous deployment (GitHub Actions → VPS)

`.github/workflows/ci.yml` has a `deploy` job that runs **only after** CI + the
security scan pass, and **only** on a push to `main`. It SSHes in and runs the
same steps as §5 (`git pull` → `npm ci` → `npm run build` → `pm2 reload`).

### One-time server prep for the deploy user

```bash
# On the server, as the user that owns /var/www/nahar:
# 1. Make the app dir a normal clone that can `git pull --ff-only`.
cd /var/www/nahar && git remote -v          # must point at the GitHub repo

# 2. Create a passphrase-less deploy key FOR THIS SERVER→GitHub is NOT needed;
#    the key GitHub uses is the server's LOGIN key. Generate one pair whose
#    PUBLIC half authorises SSH login as this user:
ssh-keygen -t ed25519 -f ~/deploy_key -N ''     # creates deploy_key + deploy_key.pub
cat ~/deploy_key.pub >> ~/.ssh/authorized_keys  # lets that key log in
cat ~/deploy_key                                # <-- PRIVATE key → GitHub secret SSH_KEY
```

> The **private** key goes into GitHub; the **public** key goes into the
> server's `authorized_keys`. Never put the private key anywhere else.

### GitHub secrets (Settings → Secrets and variables → Actions → New secret)

| Secret | Value |
|---|---|
| `SSH_HOST` | server IP or hostname |
| `SSH_USER` | the deploy user (owns `/var/www/nahar`) |
| `SSH_KEY` | contents of `~/deploy_key` (the **private** key) |
| `SSH_KNOWN_HOSTS` | run `ssh-keyscan <SSH_HOST>` **locally** and paste the output — pins the server's identity |
| `SSH_PORT` | *(optional)* only if SSH isn't on 22 |

That's it — the next push to `main` that passes CI will deploy itself. Watch it
under the repo's **Actions** tab. To require a human click before each deploy,
add protection rules to the `production` environment (Settings → Environments).

**Migrations are not auto-run** — after a deploy that includes a new
`database/migrations/*.sql`, apply it by hand (§1). A failed migration is not
something to discover from a red pipeline.

## 6. Backups (the two things that matter)

```bash
# nightly DB dump, keep 14 days — /etc/cron.daily/nahar-backup
mysqldump -u lumina -p'PASSWORD' lumina_jewelry | gzip > /backups/db-$(date +%F).sql.gz
tar czf /backups/uploads-$(date +%F).tgz -C /var/www/nahar/public uploads
find /backups -mtime +14 -delete
```

Copy `/backups` somewhere off the server (rclone → any cloud drive) — a backup on
the same disk is not a backup.

---

## Quick checklist

- [ ] VPS with Node 20, MariaDB, nginx, pm2
- [ ] DB created, schema + **all** migrations applied (or local dump imported)
- [ ] `.env.production` written — **ADMIN_PASSWORD / AUTH_SECRET / CRON_SECRET changed from defaults**
- [ ] `npm run build` clean, pm2 running + saved
- [ ] nginx proxy + certbot HTTPS, `client_max_body_size` raised
- [ ] `SITE_URL` set to the real domain
- [ ] cron hitting `/api/cron/expire-holds` with the secret
- [ ] `public/uploads/` writable, excluded from deploys, included in backups
- [ ] Log in at `https://your-domain/admin/login` and publish a Gold Rate to smoke-test DB writes
