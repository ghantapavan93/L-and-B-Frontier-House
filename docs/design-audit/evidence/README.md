# Audit Evidence

Machine-generated artefacts supporting `docs/design-audit/`. **Audit evidence only — no
production application code belongs here.**

Every artefact was produced read-only. No file in `archive/` or `stitch-export/` was
modified, renamed, moved or deleted.

| File | Contents |
| :--- | :--- |
| `file-inventory.txt` | Complete file listing across all four generations, per-generation counts, production-asset search result, and md5 hashes of every `DESIGN.md` (the V2-residue duplication check) |
| `broken-reference-report.txt` | Missing manifest assets, unresolved `{{DATA:SCREEN:…}}` template placeholders, the verbatim broken Three.js container reference, and remote-dependency counts |

## Reproducing the key measurements

```bash
# Production assets present anywhere in the exports (expected: 0)
find stitch-export -type f \( -name '*.glb' -o -name '*.gltf' -o -name '*.mp4' \
  -o -name '*.webm' -o -name '*.jpg' -o -name '*.webp' -o -name '*.woff*' \
  -o -name '*.glsl' \) | wc -l

# Documented brand tokens actually used, per generation
for c in 0A0A0A F5F2EE 734F36 D9C5B2 1B2B45 A7A6A2 7E241F; do
  echo "#$c  V3=$(grep -rli "#$c" stitch-export/v3-production --include='*.html' | wc -l)/15" \
       " V3.1=$(grep -rli "#$c" stitch-export/v3-1-frontier-engine --include='*.html' | wc -l)/33"
done

# Accessibility signal census
for p in "prefers-reduced-motion" ":focus" "tabindex" "aria-live" "<form>" "<video" "poster="; do
  echo "$p : $(grep -rl -- "$p" stitch-export --include='*.html' | wc -l)/48"
done

# Prices present in markup
grep -rhoE '\$[0-9][0-9,.]*' stitch-export --include='*.html' | sort | uniq -c | sort -rn
```

## Not captured, and why

- **Rendered screenshots of the exports.** Every file depends on `cdn.tailwindcss.com`,
  Google Fonts and remote generated imagery. A local render would be network-dependent and
  non-reproducible. Structure was read from source instead; the 42 Stitch `screen.png`
  renders already in `stitch-export/` are the durable visual record.
- **Sampled contrast ratios.** Computed from declared token values, not from rendered
  pixels. Text-over-photography contrast is therefore marked **UNASSESSABLE** in
  `11_ACCESSIBILITY_AUDIT.md` rather than assumed passing.
- **Mirrored remote imagery.** Recommended in `07_ASSET_MEDIA_AND_PROVENANCE_MANIFEST.md`
  §3 before the URLs expire, but not performed — mirroring ~30 third-party generated
  images is a content decision, not an audit action.
