#!/bin/bash
# Restructure product images: flat /uploads/*.jpg → /uploads/products/<SKU>/<size>/<n>.jpg
# Sizes: original (as-is), zoom (as-is), large (1200px), medium (600px), thumb (240px).
# Updates product_images.image_path in the DB to the `large` rendition.
set -euo pipefail

APP="/Users/tahoshinislam/Desktop/Nextjs_Gold/my-app"
PUB="$APP/public"
MYSQL="/Applications/XAMPP/xamppfiles/bin/mysql -u root lumina_jewelry"
CACHE=$(mktemp -d)

# Pre-generate size renditions once per unique source file (placeholders repeat).
gen_cache() {
  local src="$1" key="$2"
  mkdir -p "$CACHE/$key"
  cp "$src" "$CACHE/$key/original.jpg"
  cp "$src" "$CACHE/$key/zoom.jpg"
  sips -Z 1200 "$src" --out "$CACHE/$key/large.jpg"  >/dev/null
  sips -Z 600  "$src" --out "$CACHE/$key/medium.jpg" >/dev/null
  sips -Z 240  "$src" --out "$CACHE/$key/thumb.jpg"  >/dev/null
}

count=0
$MYSQL -N -e "SELECT p.sku, img.id, img.image_path, img.sort_order
              FROM product_images img JOIN products p ON p.id = img.product_id
              ORDER BY p.sku, img.sort_order;" |
while IFS=$'\t' read -r sku id path sort; do
  # Placeholder JPGs were moved into uploads/home/ — resolve by basename.
  src="$PUB$path"
  [ -f "$src" ] || src="$PUB/uploads/home/$(basename "$path")"
  [ -f "$src" ] || { echo "SKIP missing $src"; continue; }
  key=$(basename "$path" | tr -c 'a-zA-Z0-9' '_')
  [ -d "$CACHE/$key" ] || gen_cache "$src" "$key"

  n=$((sort + 1))
  for size in original zoom large medium thumb; do
    mkdir -p "$PUB/uploads/products/$sku/$size"
    cp "$CACHE/$key/$size.jpg" "$PUB/uploads/products/$sku/$size/$n.jpg"
  done

  $MYSQL -e "UPDATE product_images SET image_path='/uploads/products/$sku/large/$n.jpg' WHERE id=$id;"
  count=$((count + 1))
done

rm -rf "$CACHE"
echo "Done. Folders: $(ls "$PUB/uploads/products" | wc -l | tr -d ' ') products."
