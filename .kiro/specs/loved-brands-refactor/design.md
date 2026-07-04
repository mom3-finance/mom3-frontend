# Design — Loved Brands Refactor (with shadcn/ui)

## Pendekatan
Refactor inkremental dalam tiga lapis:
1. **Pondasi UI**: pasang shadcn/ui dan ambil dua primitif minimal (`Card`, `Avatar`).
2. **Pondasi tema**: tambah token warna semantik (`ink`, `muted`, `lavender`) di blok `@theme` Tailwind v4, berdampingan dengan token shadcn.
3. **Refactor komponen**: pisah data/presentasi, ekstrak `BrandCard` yang dibangun di atas primitif shadcn, jaga visual parity lewat override `className`.

Tidak ada perubahan API publik komponen. `LovedBrands` tetap default-export tanpa props.

## Arsitektur file (setelah selesai)

```
components.json                                # baru: konfigurasi shadcn CLI
src/
├─ app/
│  └─ globals.css                              # + token landing + token shadcn
├─ app/(client)/landing-detail/_components/
│  └─ LovedBrands.tsx                          # refactor + BrandCard subkomponen
├─ components/
│  └─ ui/
│     ├─ card.tsx                              # baru: di-generate shadcn add
│     └─ avatar.tsx                            # baru: di-generate shadcn add
└─ lib/
   ├─ utils.ts                                 # diisi: cn() dari shadcn
   └─ format.ts                                # baru: formatCompact()
```

## 1) Init shadcn/ui

### Konfigurasi target
- **Style**: `new-york` (default modern, cocok dengan tipografi tegas seperti baseline).
- **Base color**: `neutral` (placeholder; warna yang dipakai komponen kita di-override via token `--color-ink`/`--color-muted`/`--color-lavender`).
- **CSS variables**: ya (sesuai pendekatan Tailwind v4 + `@theme`).
- **Aliases** (mengikuti `tsconfig.json` yang sudah ada `@/* → ./src/*`):
  - `components`: `@/components`
  - `utils`: `@/lib/utils`
  - `ui`: `@/components/ui`
  - `lib`: `@/lib`
  - `hooks`: `@/hooks`

### Perintah eksekusi
- `pnpm dlx shadcn@latest init` (jawab prompt sesuai konfigurasi di atas)
- `pnpm dlx shadcn@latest add card avatar`

### Efek samping yang diharapkan
- `components.json` dibuat di root.
- `src/lib/utils.ts` diisi dengan `cn = (...inputs) => twMerge(clsx(inputs))`.
- `src/components/ui/card.tsx` dan `src/components/ui/avatar.tsx` di-generate.
- `globals.css` ditambah blok variabel CSS shadcn (mis. `--background`, `--foreground`, `--card`, `--card-foreground`, `--border`, `--ring`, dst.) plus pemetaan `@theme` shadcn.
- Dependency baru: `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-avatar`, dan kemungkinan `lucide-react` (tidak dipakai komponen kita; biarkan terpasang).

### Penjagaan saat init
- Sebelum `init`, `globals.css` saat ini punya `--background`/`--foreground` minimal. shadcn init bisa menulis ulang nilai-nilai ini.
- **Strategi**: terima output shadcn apa adanya, lalu tambahkan token landing kita (`--color-ink`, `--color-muted`, `--color-lavender`) sebagai blok terpisah yang diberi komentar di akhir `@theme inline`. Kalau shadcn mengubah skema dark/light, biarkan sebagaimana adanya — tidak relevan untuk seksi yang berada di area `bg-lavender` warna terang.

## 2) Token warna landing (Tailwind v4 `@theme`)

Setelah init, tambahkan di akhir blok `@theme inline` (digabungkan dengan token shadcn):

```css
@theme inline {
  /* ...token bawaan shadcn yang sudah ada... */

  /* Landing palette */
  --color-ink: #0a0a0a;       /* teks utama */
  --color-muted: #6b6680;     /* teks sekunder (jangan bingung dengan --muted shadcn) */
  --color-lavender: #e6e1f0;  /* background seksi */
}
```

Catatan: shadcn juga punya token `--muted`/`--color-muted-foreground`. Untuk menghindari tabrakan namespace, kita tidak menulis ulang `--muted`; kita pakai nama spesifik **`--color-muted`** (utility yang dihasilkan: `text-muted`, `bg-muted`). Tailwind v4 men-generate utility dari prefix `--color-*`, jadi token kita aman selama tidak menumpuk identifier yang sama dengan shadcn. Bila bertabrakan, ganti nama ke `--color-text-muted` dan utility jadi `text-text-muted` (akan diputuskan saat eksekusi setelah melihat output shadcn).

Hex tetap 1:1 dengan baseline:
- `#0A0A0A` → `text-ink` / `bg-ink`
- `#6B6680` → `text-muted`
- `#E6E1F0` → `bg-lavender`

Warna data-driven (`bandColor`, `avatarColor`) tetap inline `style`.

## 3) Helper `formatCompact`

```ts
// src/lib/format.ts
export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
```

Pemetaan yang dipakai:
- 1200 → `1.2K` → ditampilkan `+1.2K`
- 980  → `980` → `+980`
- 2400 → `2.4K` → `+2.4K`
- 1700 → `1.7K` → `+1.7K`
- 3100 → `3.1K` → `+3.1K`

> Trade-off parity: baseline menulis `Plus 1.2k` (lowercase, kata "Plus"). Bentuk ini tidak "berubah secara fungsi" tetapi berbeda secara teks. Kalau visual parity tekstual penuh diinginkan, pakai formatter custom kecil yang lowercase huruf magnitude dan tambahkan prefix `Plus `. Keputusan akhir dicatat di `tasks.md` task #4.

## 4) Tipe & data

```ts
// LovedBrands.tsx
type Brand = {
  name: string;
  followers: number;
  bandColor: string;
  avatarColor?: string;
};

const DEFAULT_AVATAR = "#0A0A0A";

const BRANDS: readonly Brand[] = [
  { name: "Pinka",    followers: 1200, bandColor: "#FFD6E0" },
  { name: "Greenly",  followers:  980, bandColor: "#D6F5DC" },
  { name: "Sunny",    followers: 2400, bandColor: "#FFE3C2" },
  { name: "Bluebird", followers: 1700, bandColor: "#CFE0FF", avatarColor: "#2D2EFF" },
  { name: "Honey",    followers: 3100, bandColor: "#FFF5C2" },
];
```

## 5) Komponen

### `LovedBrands` (komponen seksi)

```tsx
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCompact } from "@/lib/format";

const HEADING_ID = "loved-brands-title";

export default function LovedBrands() {
  return (
    <section
      aria-labelledby={HEADING_ID}
      className="bg-lavender px-5 pt-16 pb-16 md:px-10 md:pt-24 md:pb-24"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
          Community picks
        </p>
        <h2
          id={HEADING_ID}
          className="mt-4 text-center text-4xl font-bold uppercase leading-[0.95] tracking-tight text-ink md:text-6xl lg:text-7xl"
        >
          <span className="block">You most loved</span>
          <span className="block">brands</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-center text-sm text-muted md:text-base">
          The crowd favorites this week, ranked by real follows.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-5">
          {BRANDS.map((brand) => (
            <BrandCard key={brand.name} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### `BrandCard` (subkomponen, file sama)

```tsx
function BrandCard({ brand }: { brand: Brand }) {
  const initial = brand.name.charAt(0).toUpperCase();
  const followersLabel = `+${formatCompact(brand.followers)}`;

  return (
    <Card
      role="article"
      aria-label={`${brand.name}, ${followersLabel} followers`}
      className="overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.18)]"
    >
      <div className="relative h-24" style={{ backgroundColor: brand.bandColor }}>
        <Avatar
          aria-hidden="true"
          className="absolute -bottom-7 left-1/2 h-14 w-14 -translate-x-1/2 ring-4 ring-white"
        >
          <AvatarFallback
            className="rounded-full text-base font-bold uppercase text-white"
            style={{ backgroundColor: brand.avatarColor ?? DEFAULT_AVATAR }}
          >
            {initial}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="px-4 pb-5 pt-10 text-center">
        <h3 className="text-sm font-semibold text-ink">{brand.name}</h3>
        <p className="mt-1 text-xs text-muted">{followersLabel}</p>
      </div>
    </Card>
  );
}
```

#### Catatan override penting (visual parity)
- shadcn `Card` default: `rounded-xl border bg-card text-card-foreground shadow`. Override: `rounded-2xl border-0 bg-white p-0 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.18)]` agar identik baseline.
- shadcn `Avatar` default: `h-10 w-10 rounded-full` + clipping bawaan. Override: `h-14 w-14` dan tambah `ring-4 ring-white`. `rounded-full` sudah ada di komponen — pertahankan.
- shadcn `AvatarFallback` default: `bg-muted` (token shadcn). Override: `style={{ backgroundColor }}` agar warna data-driven, plus `text-white`. `rounded-full` mengikuti parent `Avatar`.

## 6) Aksesibilitas
- `<section aria-labelledby={HEADING_ID}>` ↔ `<h2 id={HEADING_ID}>`.
- Nama brand naik ke `<h3>` (anak `<Card role="article">`).
- `Avatar` diberi `aria-hidden="true"` karena sifatnya dekoratif; konteks tetap dibawa oleh `aria-label` di `Card`.
- `Card` shadcn me-render `<div>`, jadi kita beri `role="article"` agar perilaku semantik sama dengan `<article>` baseline.

## 7) Strategi visual parity
- Semua kelas tata letak (`mt-4`, `tracking-[0.3em]`, `shadow-[…]`, dst.) dipertahankan.
- Token warna baru memetakan 1:1 ke hex sebelumnya.
- Heading kartu naik dari `<p>` ke `<h3>` tetapi mempertahankan kelas `text-sm font-semibold text-ink`, jadi bobot dan ukuran sama.
- Override shadcn diuji manual via `pnpm dev` di breakpoint mobile dan ≥ md.

## 8) Strategi error & validasi
- Tidak ada I/O atau runtime error baru.
- TypeScript memastikan `followers: number` dan `avatarColor?: string` dikonsumsi dengan benar.
- shadcn primitif sudah teruji a11y oleh Radix; tidak ada penambahan handler kustom.

## 9) Verifikasi
1. `pnpm install` setelah init shadcn — tanpa error.
2. `pnpm build` — sukses.
3. `pnpm lint` — tanpa warning baru pada file yang disentuh.
4. Inspeksi visual halaman `/landing-detail` di mobile dan ≥ md: layout, warna, dan teks identik dengan baseline (kecuali bentuk angka follower yang sudah disepakati).
5. Inspeksi DOM: `aria-labelledby`, urutan heading `<h2>` → `<h3>`, `aria-hidden` pada `Avatar`.

## 10) Alternatif yang dipertimbangkan
- **Tanpa shadcn (komponen ad-hoc)** — sebelumnya jadi rencana awal; ditolak karena user meminta shadcn dan benefit konsistensi + Radix a11y bernilai melebihi biaya init.
- **Memakai `CardHeader/CardContent`** — ditolak; struktur kartu kita punya "band" warna penuh di atas yang bukan idiom `CardHeader` shadcn. Pakai `<Card>` + dua `<div>` anak lebih jujur dan menghindari override gaya berlebihan.
- **`AvatarImage` dengan logo asli** — di luar scope; ditangguhkan.
- **Mempertahankan teks `Plus 1.2k`** — alternatif valid bila product owner ingin parity tekstual penuh; implementasinya formatter custom kecil. Dicatat sebagai opsi switch di task #4.

## 11) Risiko
- **shadcn init menulis ulang `globals.css`** — risiko menengah; mitigasi: setelah init, audit file dan tambahkan token landing secara aditif.
- **Default style shadcn bocor (border, padding)** — risiko rendah; sudah di-override eksplisit di `BrandCard`. Verifikasi visual mengejar parity.
- **Tabrakan nama token `--color-muted`** — risiko rendah; jika shadcn juga mendefinisikan utility `text-muted` dengan arti berbeda, kita rename token landing ke `--color-text-muted` saat eksekusi (lihat task #2).
- **Ketidakcocokan versi shadcn dengan Tailwind v4 / React 19** — risiko rendah; shadcn rilis stabil saat ini sudah mendukung kedua hal tersebut. Diverifikasi saat task #1.
