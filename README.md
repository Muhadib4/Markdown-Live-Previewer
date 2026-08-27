# Markdown Studio

Markdown Live Previewer yang mudah digunakan, responsif, dan dapat dipersonalisasi dengan **50 tema** serta **light/dark mode**.

## Fitur utama

- Live preview Markdown
- 50 tema visual dengan palet dan karakter desain berbeda
- Light mode dan dark mode pada seluruh tema
- Pencarian dan filter kategori tema
- Pilihan tema serta mode tersimpan otomatis
- Toolbar: judul, tebal, miring, coret, daftar, checklist, link, kutipan, dan kode
- Draft tersimpan otomatis di browser
- Penghitung kata dan karakter
- Salin Markdown dan unduh file `.md`
- Sanitasi HTML menggunakan DOMPurify
- Responsif untuk desktop, tablet, dan HP
- Dukungan aksesibilitas dan reduced motion

## Daftar tema

1. Minimalism
2. Ultra Minimalism
3. Maximalism
4. Controlled Maximalism
5. Brutalism
6. Neo-Brutalism
7. Bento Grid
8. Masonry
9. Swiss Style
10. Editorial
11. Magazine
12. Glassmorphism
13. Liquid Glass
14. Neumorphism
15. Claymorphism
16. Flat Design
17. Material Design
18. Aurora
19. Gradient Mesh
20. Cyberpunk
21. Sci-Fi HUD
22. Holographic
23. Terminal
24. Retro Terminal
25. Pixel / 8-bit
26. Y2K
27. Frutiger Aero
28. Web 1.0
29. Vaporwave
30. Synthwave
31. Dark Fantasy
32. Medieval
33. Gothic
34. Arcane
35. Celestial
36. Abyss
37. Organic
38. Biophilic
39. Eco Futurism
40. Paper UI
41. Scrapbook
42. Hand-drawn
43. Monochrome
44. Luxury
45. Industrial
46. Bauhaus
47. Memphis
48. Art Deco
49. Skeuomorphism
50. Spatial / 3D UI

## Cara menggunakan

1. Tulis pada panel **Editor**.
2. Sorot teks dan pilih format melalui toolbar.
3. Lihat hasilnya pada panel **Preview**.
4. Klik pemilih tema di kanan atas untuk mencari tema.
5. Gunakan tombol **Dark/Light** untuk mengganti mode.
6. Salin Markdown atau unduh sebagai file `.md`.

## Cara menjalankan

1. Clone atau download repository.
2. Buka `index.html` di browser.
3. Tidak memerlukan `npm install` atau proses build.

Koneksi internet diperlukan untuk memuat Marked dan DOMPurify melalui CDN.

## Struktur

- `index.html` — struktur aplikasi dan theme picker
- `style.css` — desain responsif serta personalitas layout
- `themes.js` — konfigurasi 50 tema
- `script.js` — editor, preview, dark mode, tema, auto-save, copy, dan download
