# RPG Adventure — 16-bit Open World

Game RPG browser dengan HTML, CSS, JavaScript, Canvas 2D, dan Web Audio API.

## Menjalankan
1. Download/clone repository.
2. Buka `index.html` dengan browser modern.
3. Untuk GitHub Pages: Settings → Pages → Deploy from a branch → pilih `main` dan `/root`.

## Kontrol
- WASD / tombol panah: bergerak
- Space atau J: serang
- K: skill elemen
- Shift: dash
- E: ganti elemen
- Esc: jeda
- Layar sentuh: joystick dan tombol aksi

## Struktur
- `index.html` — menu, layar karakter, HUD, kontrol
- `styles.css` — UI responsif dan tema pixel fantasy
- `src/data.js` — 20 karakter, elemen, senjata, kombinasi, monster
- `src/audio.js` — musik dan efek suara sintetis
- `src/world.js` — generator tile map dan dekorasi
- `src/main.js` — game loop, kamera, combat, input, partikel, save

## Catatan pengembangan
Dunia dan sprite saat ini digambar secara prosedural. Ini adalah fondasi playable yang bisa dikembangkan dengan sprite sheet PNG, tile set, animasi frame, quest, NPC, dungeon, boss, dan sistem equipment yang lebih lengkap.
