#!/usr/bin/env bash
# Comprime los vídeos del diseño para la web y genera su imagen de portada.
# Uso: scripts/optimize-media.sh [carpeta-origen] [carpeta-destino]
#   Origen por defecto: design/assets · destino: public/media
# Calidad máxima: resolución nativa (720) y CRF 16 (visualmente sin pérdida respecto al
# original). Los bucles de portada van sin audio; los de las fichas de tratamiento y los
# testimonios conservan el audio (160k). En los recortes, el sonido entra y sale con un
# fundido corto para que el bucle no dé un golpe.
# ONLY=regex limita los trabajos (p. ej. ONLY='^tx-|^fotona-4d$').
set -euo pipefail

SRC="${1:-design/assets}"
OUT="${2:-public/media}"
mkdir -p "$OUT"

# nombre-salida | archivo-origen | inicio (s) | duración (s, 0 = entero) | audio (0/1) | ancho
JOBS=(
  "hero-reel|glowhaus-reel.mp4|0|0|0|720"
  "fotona-reel|fotona-reel.mp4|0|14|0|720"
  "fotona-4d|fotona-4d-tx.mp4|0|14|1|720"
  "tx-renovacion|tx/renovacion.mp4|0|12|1|720"
  "tx-body|tx/body.mp4|28.3|12|1|720"
  "tx-inyectables|tx/inyectables.mp4|0|12|1|720"
  "tx-rellenos|tx/rellenos.mp4|0|12|1|720"
  "tx-skincare|tx/skincare.mp4|0|12|1|720"
  "tx-intimo|tx/intimo.mp4|55.3|12|1|720"
  "tx-complementos|tx/complementos.mp4|0|12|1|720"
  "testimonio-1|testimonios/t1.mp4|0|0|1|720"
  "testimonio-2|testimonios/t2.mp4|0|0|1|720"
  "testimonio-3|testimonios/t3.mp4|0|0|1|720"
)

for job in "${JOBS[@]}"; do
  IFS='|' read -r name file start dur audio width <<<"$job"
  [[ -n "${ONLY:-}" && ! "$name" =~ $ONLY ]] && continue
  in="$SRC/$file"
  [[ -f "$in" ]] || { echo "Falta $in" >&2; exit 1; }
  dur_args=()
  [[ "$dur" != "0" ]] && dur_args=(-t "$dur")
  if [[ "$audio" == "1" ]]; then
    audio_args=(-c:a aac -b:a 160k -ac 2)
    if [[ "$dur" != "0" ]]; then
      audio_args+=(-af "afade=t=in:d=0.4,afade=t=out:st=$(echo "$dur - 0.6" | bc):d=0.6")
    fi
  else
    audio_args=(-an)
  fi
  ffmpeg -v error -y -ss "$start" -i "$in" ${dur_args[@]+"${dur_args[@]}"} \
    -vf "scale=${width}:-2:flags=lanczos,fps=30" \
    -c:v libx264 -preset veryslow -tune film -crf 16 -profile:v high -pix_fmt yuv420p \
    -movflags +faststart "${audio_args[@]}" "$OUT/$name.mp4"
  ffmpeg -v error -y -ss 0.4 -i "$OUT/$name.mp4" -frames:v 1 -q:v 1 "$OUT/$name.jpg"
  printf '%-16s %6s\n' "$name" "$(du -h "$OUT/$name.mp4" | cut -f1)"
done
