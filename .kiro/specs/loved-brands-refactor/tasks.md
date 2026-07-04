# Tasks — Loved Brands Refactor (with shadcn/ui)

- [x] 1. Inisialisasi shadcn/ui dan tambah primitif yang dipakai
  - Jalankan `pnpm dlx shadcn@latest init`. Jawab prompt:
    - Style: `new-york`
    - Base color: `neutral`
    - CSS variables: `yes`
    - Components alias: `@/components`
    - Utils alias: `@/lib/utils`
    - UI alias: `@/components/ui`
  - Jalankan `pnpm dlx shadcn@latest add card avatar`.
  - Pastikan `components.json` ada di root, `src/lib/utils.ts` berisi `cn`, dan `src/components/ui/card.tsx` + `src/components/ui/avatar.tsx` di-generate.
  - Pastikan dependency baru terpasang (`clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-avatar`).
  - _Requirements: R5_

- [x] 2. Tambahkan token warna landing di `@theme`
  - Edit `src/app/globals.css`. Setelah init shadcn, di akhir blok `@theme inline` (sesudah token bawaan shadcn), tambah:
    ```css
    /* Landing palette */
    --color-ink: #0a0a0a;
    --color-text-muted: #6b6680;
    --color-lavender: #e6e1f0;
    ```
  - Catatan eksekusi: token landing untuk teks sekunder dipakai sebagai `--color-text-muted` (utility `text-text-muted`) untuk menghindari tabrakan dengan token bawaan shadcn `--color-muted` (yang dirujuk `bg-muted` di `avatar.tsx` dan `text-muted-foreground` di `card.tsx`). Task #5–#7 sudah disesuaikan memakai `text-text-muted`.
  - Jangan mengubah token shadcn yang lain.
  - _Requirements: R6_

- [x] 3. Buat helper format angka
  - Buat `src/lib/format.ts` dengan named export:
    ```ts
    export function formatCompact(n: number): string {
      return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(n);
    }
    ```
  - _Requirements: R1_

- [x] 4. Refactor tipe & data brand di `LovedBrands.tsx`
  - Ubah `Brand` jadi `{ name: string; followers: number; bandColor: string; avatarColor?: string }`.
  - Hapus field `initial`.
  - Konversi `followers` ke number sesuai mapping di design (`1200`, `980`, `2400`, `1700`, `3100`).
  - Hapus `avatarColor: "#0A0A0A"` di entri yang memakai default; biarkan hanya `Bluebird` dengan `avatarColor: "#2D2EFF"`.
  - Tambahkan `const DEFAULT_AVATAR = "#0A0A0A"`.
  - Tandai `BRANDS` sebagai `readonly Brand[]`.
  - Catatan format: implementasi memakai `+1.2K` (sesuai design). Bila pemilik produk mau mempertahankan `Plus 1.2k`, ganti baris pembentuk `followersLabel` menjadi formatter custom (lowercase huruf magnitude + prefix `"Plus "`); jangan ubah tipe `followers`.
  - _Requirements: R1, R2, R3_

- [x] 5. Ekstrak `BrandCard` di atas shadcn `Card` + `Avatar`
  - Di file yang sama, buat `BrandCard({ brand }: { brand: Brand })` mengikuti blok kode di design:
    - Import `Card` dari `@/components/ui/card`, `Avatar` + `AvatarFallback` dari `@/components/ui/avatar`, `formatCompact` dari `@/lib/format`.
    - Hitung `initial = brand.name.charAt(0).toUpperCase()` dan `followersLabel = `+${formatCompact(brand.followers)}``.
    - Bungkus dengan `<Card role="article" aria-label="…">` dan kelas override (`rounded-2xl border-0 bg-white p-0 shadow-[…]`).
    - Posisikan `<Avatar>` absolut dengan `h-14 w-14 ring-4 ring-white`, `aria-hidden="true"`.
    - `<AvatarFallback>` memakai `style={{ backgroundColor: brand.avatarColor ?? DEFAULT_AVATAR }}` plus `rounded-full text-base font-bold uppercase text-white`.
  - _Requirements: R2, R3, R4_

- [x] 6. Refactor render `LovedBrands`
  - Ganti loop kartu jadi `<BrandCard key={brand.name} brand={brand} />`.
  - Ganti kelas warna repetitif: `bg-[#E6E1F0]` → `bg-lavender`, `text-[#0A0A0A]` → `text-ink`, `text-[#6B6680]` → `text-text-muted` (rename diterapkan di task #2 untuk hindari tabrakan dengan token shadcn).
  - Pertahankan semua kelas tata letak lain.
  - Tambahkan `aria-labelledby={HEADING_ID}` di `<section>` dan `id={HEADING_ID}` di `<h2>` (gunakan konstanta `HEADING_ID = "loved-brands-title"`).
  - _Requirements: R4, R6, R7_

- [x] 7. Aksesibilitas final di kartu
  - Pastikan nama brand di `BrandCard` memakai `<h3 className="text-sm font-semibold text-ink">`.
  - Pastikan `<Card>` punya `role="article"` dan `aria-label`, dan `<Avatar>` punya `aria-hidden="true"`.
  - _Requirements: R7_

- [x] 8. Verifikasi build, lint, dan visual parity
  - Jalankan `pnpm build` dan `pnpm lint`; tidak boleh ada error baru pada file yang disentuh.
  - Jalankan `pnpm dev`, buka `/landing-detail` di viewport mobile dan ≥ md, bandingkan dengan baseline: layout grid, ukuran teks, warna, posisi avatar (offset `-bottom-7`, ring putih), shadow kartu, dan jarak harus identik.
  - Konfirmasi DOM: heading order `<h2>` → `<h3>`, `aria-labelledby` mengikat dengan benar, `Avatar` `aria-hidden`, `Card` `role="article"`.
  - _Requirements: R8, R9_
