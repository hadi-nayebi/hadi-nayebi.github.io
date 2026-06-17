#!/usr/bin/env bash
# Sequentially (re)generate EVERY free-voice draft mp3 with the default voice
# (amy-low as of 2026-06-17). One piper invocation at a time — no CPU contention,
# no watchdog kills. Logs progress; safe to run in the background.
#
#   bash tools/generate_all_free_audio.sh           # all guides + all essays
#   bash tools/generate_all_free_audio.sh guides    # diagram guides only
#   bash tools/generate_all_free_audio.sh essays    # essay narrations only
set -u
cd "$(dirname "$0")/.." || exit 1
GEN="python3 tools/generate_free_audio.py"
MODE="${1:-all}"
total=0; ok=0; fail=0
log(){ echo "[$(date +%H:%M:%S)] $*"; }

gen_one(){
  local src="$1" out="$2"
  total=$((total+1))
  mkdir -p "$(dirname "$out")"
  if $GEN "$src" "$out" >/dev/null 2>>/tmp/audio-gen-errors.log; then
    if [ -s "$out" ]; then ok=$((ok+1)); log "OK   $out ($(du -h "$out" | cut -f1))"
    else fail=$((fail+1)); log "FAIL(empty) $out"; fi
  else fail=$((fail+1)); log "FAIL $src -> $out (see /tmp/audio-gen-errors.log)"; fi
}

if [ "$MODE" = "all" ] || [ "$MODE" = "guides" ]; then
  log "=== diagram guides ==="
  for g in $(find blog -name "*.guide.txt" | sort); do
    dir="$(dirname "$g")"; base="$(basename "$g" .guide.txt)"
    gen_one "$g" "$dir/audio/${base}-guide.draft.mp3"
  done
fi

if [ "$MODE" = "all" ] || [ "$MODE" = "essays" ]; then
  log "=== essay narrations ==="
  for t in $(find blog -name "*.transcript.md" | sort); do
    dir="$(dirname "$t")"; base="$(basename "$t" .transcript.md)"
    gen_one "$t" "$dir/audio/${base}.draft.mp3"
  done
fi

log "=== DONE: total=$total ok=$ok fail=$fail ==="
