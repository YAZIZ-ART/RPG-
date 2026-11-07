# Chronicles of the Five — Enhanced World & VFX Edition

Game RPG 2D top-down berbasis HTML Canvas, JavaScript, CSS, dan Web Audio. Tidak membutuhkan framework atau server backend.

## Menjalankan

- Buka `index.html` melalui GitHub Pages atau server statis.
- Jangan memindahkan file dari folder `src/` karena semua script dan aset memakai path relatif.
- Tombol **Mulai Petualangan** membuka pemilihan karakter; pilih satu dari 20 hero lalu tekan **Mulai dengan Hero Ini**.

## Struktur

```text
index.html
styles.css
src/
  data.js
  audio.js
  world.js
  vfx.js
  main.js
  assets/
    terrain-atlas.png
    heroes/
      hero-01.webp ... hero-20.webp
```

## Pembaruan versi ini

- Memperbaiki alur menu dan membuat transisi pemilihan karakter tidak bergantung pada dukungan audio browser.
- Menambahkan atlas tekstur pixel-art untuk rumput, tanah, jalur, air, batu, kayu, dan rune.
- Menambahkan 20 ilustrasi hero untuk layar pemilihan karakter dan panel profil.
- Menambahkan pipeline efek untuk ring sihir, slash, flash, sparks, partikel elemental, aura, dan ambience.
- Memperbarui detail dunia, bangunan, pepohonan, altar, air animasi, dan pencahayaan.
- Membatasi jumlah partikel dan menyesuaikan intensitas efek berdasarkan kualitas grafis.
- Memperbaiki pemilihan kombinasi skill agar memakai elemen sebelumnya ketika pemain mengganti elemen.
- Menambahkan cache-busting versi aset agar GitHub Pages tidak terus memakai file lama.

## Catatan ukuran

Ukuran proyek ditingkatkan dengan aset visual yang benar-benar dipakai, bukan dengan menambahkan komentar atau kode kosong. Ukuran setiap file kode tidak dipaksa melewati 200 KB karena file besar tanpa fungsi tambahan hanya memperlambat pemuatan dan perawatan proyek.
