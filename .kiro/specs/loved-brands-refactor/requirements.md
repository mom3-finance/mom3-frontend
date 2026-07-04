# Requirements — Loved Brands Refactor (with shadcn/ui)

## Ringkasan
Refactor komponen `LovedBrands.tsx` dan adopsi **shadcn/ui** sebagai pondasi UI primitif (mulai dari `Card` dan `Avatar`) supaya:
- data terpisah dari presentasi,
- struktur lebih mudah dirawat (subkomponen + helper + primitif terstandarisasi),
- aksesibilitas membaik,
- **tampilan akhir di layar tidak berubah** (visual parity).

Tidak ada perubahan rute, API, atau kontrak komponen luar. `LovedBrands` tetap default-export tanpa props.

## Pemangku & ruang lingkup
- Pemangku: pengembang frontend yang akan menambah/mengganti brand, menerjemahkan halaman, atau memakai shadcn untuk komponen lain.
- Ruang lingkup:
  - `src/app/(client)/landing-detail/_components/LovedBrands.tsx`
  - `src/app/globals.css` (token warna, ditambahkan ke konfigurasi shadcn)
  - `src/lib/utils.ts` (helper `cn` dari shadcn)
  - `src/components/ui/card.tsx`, `src/components/ui/avatar.tsx` (di-generate shadcn CLI)
  - `src/lib/format.ts` (helper format angka)
  - `components.json` di root (config shadcn)
- Di luar lingkup: refactor seksi lain (`Hero`, `EarnSection`, dst.). Mereka boleh memakai token & primitif shadcn yang sama di kemudian hari.

## Kriteria penerimaan (EARS / Given–When–Then)

### R1. Pisahkan data dari presentasi pada `followers`
- **Given** daftar brand di modul `LovedBrands`,
- **When** sebuah brand didefinisikan,
- **Then** field `followers` bertipe `number` (jumlah follower mentah), bukan string ter-format.
- **And When** kartu brand dirender,
- **Then** angka diformat ke representasi ringkas (mis. `1.2k`, `980`) dengan prefix `+` di depan, sehingga teks yang tampil identik dengan versi sebelumnya untuk seluruh entri yang ada.

### R2. Hilangkan field turunan `initial`
- **Given** tipe `Brand`,
- **When** field hanya bisa diturunkan dari data lain,
- **Then** `initial` dihapus dari tipe dan data, dan inisial dihitung dari `name.charAt(0).toUpperCase()` saat render (digunakan sebagai `AvatarFallback`).

### R3. Default `avatarColor`
- **Given** tipe `Brand`,
- **When** sebagian besar entri memakai warna avatar yang sama (`#0A0A0A`),
- **Then** `avatarColor` jadi opsional dengan default konstanta, dan entri yang berbeda (mis. Bluebird `#2D2EFF`) tetap bisa override secara eksplisit.

### R4. Ekstraksi `BrandCard` di atas primitif shadcn
- **Given** markup kartu brand,
- **When** komponen `LovedBrands` dirender,
- **Then** kartu individual hidup di subkomponen `BrandCard` di file yang sama, menerima `brand: Brand`, dan menggunakan primitif **shadcn `Card`** untuk shell kartu serta **shadcn `Avatar` + `AvatarFallback`** untuk lingkaran inisial.
- **And** `LovedBrands` hanya bertugas menyusun seksi + grid.

### R5. shadcn/ui terpasang dan terkonfigurasi
- **Given** proyek belum memakai shadcn,
- **When** spec ini selesai,
- **Then** terdapat `components.json` di root, alias `@/components` dan `@/lib` aktif, helper `cn` di `src/lib/utils.ts`, dan primitif `Card` + `Avatar` ada di `src/components/ui/`.
- **And** dependency yang ditambahkan terbatas pada yang dibutuhkan primitif yang dipakai (`@radix-ui/react-avatar`, `class-variance-authority`, `clsx`, `tailwind-merge`).

### R6. Token warna landing di `@theme`
- **Given** warna utilitarian (`#0A0A0A`, `#6B6680`, `#E6E1F0`) dipakai berulang,
- **When** komponen ditulis,
- **Then** warna tersebut tersedia sebagai token di `globals.css` (`--color-ink`, `--color-muted`, `--color-lavender`) dalam blok `@theme inline`, **berdampingan** dengan token yang ditambahkan shadcn (mis. `--color-card`, `--color-border`), dan komponen memakai utility `text-ink`, `text-muted`, `bg-lavender` untuk warna repetitif tersebut.
- **And** warna data-driven (`bandColor`, `avatarColor`) tetap diterapkan via `style` inline karena nilainya datang dari data.

### R7. Aksesibilitas
- **Given** seksi Loved Brands,
- **When** screen reader membaca halaman,
- **Then** seksi memiliki `aria-labelledby` yang merujuk ke heading `<h2>` (id stabil), nama brand di kartu menggunakan elemen heading semantik (`<h3>`), dan `Avatar` shadcn (yang hanya berisi `AvatarFallback`) tidak membacakan huruf inisial sebagai konten utama (huruf inisial diberi `aria-hidden="true"`; konteks tetap terbawa lewat `aria-label` `<Card>`).

### R8. Visual parity
- **Given** halaman `landing-detail` dirender,
- **When** seksi Loved Brands ditampilkan pada viewport mobile dan ≥ md,
- **Then** layout, ukuran, warna, dan teks yang tampak identik dengan versi sebelum refactor (kecuali perubahan struktural tak-kasat-mata seperti tag heading dan format teks angka follower yang sudah disepakati di task implementasi).
- **And** style default shadcn (`Card` rounded-xl + border, `Avatar` h-10 w-10) **dioverride** lewat `className` agar cocok dengan baseline (`rounded-2xl`, shadow custom, `h-14 w-14`, `ring-4 ring-white`, tanpa border).

### R9. Tanpa regresi build/lint/type
- **When** `pnpm build` dan `pnpm lint` dijalankan,
- **Then** keduanya selesai tanpa error baru yang bersumber dari berkas yang disentuh spec ini.

## Asumsi
- Tailwind v4 CSS-based theming via `@theme` aktif (terkonfirmasi di `globals.css`).
- shadcn/ui versi terbaru sudah mendukung Tailwind v4 + Next.js 15 + React 19 (akan diverifikasi saat init).
- Bahasa konten antarmuka tetap dalam bahasa Inggris.
- Tidak ada test runner di proyek; verifikasi via build, lint, type-check, dan inspeksi visual.

## Non-goals
- Mengganti inisial dengan logo/`next/image`.
- Internasionalisasi konten teks.
- Mengubah palet warna atau hierarki tipografi.
- Refactor seksi lain di `landing-detail`.
- Memasang seluruh katalog shadcn — hanya primitif yang dipakai (`Card`, `Avatar`).
