#!/usr/bin/env bash
# Конвертирует все PNG/JPG в public/images в WebP для уменьшения размера и ускорения загрузки.
# Требует cwebp (brew install webp). Удаляет исходные PNG после успешной конвертации.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMG_DIR="$ROOT/public/images"
QUALITY="${QUALITY:-80}"

if ! command -v cwebp >/dev/null 2>&1; then
  echo "cwebp не найден. Установи: brew install webp" >&2
  exit 1
fi

total_before=0
total_after=0

while IFS= read -r -d '' src; do
  dst="${src%.*}.webp"
  cwebp -quiet -q "$QUALITY" "$src" -o "$dst"
  b=$(stat -f%z "$src")
  a=$(stat -f%z "$dst")
  total_before=$((total_before + b))
  total_after=$((total_after + a))
  printf '%-45s %6sK -> %6sK\n' "${src#$ROOT/}" "$((b/1024))" "$((a/1024))"
  rm "$src"
done < <(find "$IMG_DIR" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

printf '\nИтого: %sK -> %sK (экономия %s%%)\n' \
  "$((total_before/1024))" "$((total_after/1024))" \
  "$(( total_before>0 ? (total_before-total_after)*100/total_before : 0 ))"
