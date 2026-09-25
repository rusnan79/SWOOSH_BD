# Swoosh Admin Panel — Setup Guide

Ei guide ta follow korle tumi tomar website GitHub + Vercel e deploy korte parba, ar phone/laptop
theke `admin.html` diye product upload/edit/delete korte parba — kono domain kena lagbe na.

Tomar Firebase project already ache: **swoosh-database**. Notun kichu banate hobe na, khali
kichu jinis **enable** korte hobe ar **security rules** boshate hobe.

---

## PART 1 — Firebase Console Setup

Go to **https://console.firebase.google.com** → select project **swoosh-database**.

### Step 1.1 — Authentication enable koro + nijer login banao

1. Left menu theke **Build → Authentication** e jao.
2. **Get started** button e click koro (jodi age theke enabled na thake).
3. **Sign-in method** tab e jao → **Email/Password** select koro → **Enable** toggle on koro → **Save**.
4. Ekhon **Users** tab e jao → **Add user** button e click koro.
5. Tomar email ar ekta strong password diye user create koro. **Eta e tomar admin login** —
   ei email/password diye tumi `admin.html` e login korba.

> ⚠️ Important: `admin.html` e kono "Sign up" form নেই — ইচ্ছা কৰেই রাখা হয়নি, যাতে অন্য কেউ account
> banate na pare. Notun admin user lagle ei Firebase console theke **Add user** diye e banate hobe।

### Step 1.2 — Firestore Database check koro

1. **Build → Firestore Database** e jao.
2. Age theke enabled thakle sekhane tomar `products` collection dekhte pete paro (na thakleo
   somossha nai, admin panel diye first product add korle automatically toiri hobe).
3. Jodi enabled na thake, **Create database** → **Production mode** → cache location (asia-south1
   ba kache kono region) select kore **Enable** koro.

### Step 1.3 — Firestore Rules boshao

**Firestore Database → Rules** tab e jao, shob mucche niche ei code ta paste koro:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == "YOUR_EMAIL@example.com";
    }
  }
}
```

`YOUR_EMAIL@example.com` er jaygay tumi Step 1.1 e je email diye admin user banaisho, **shei
exact email ta** boshao. Tarpor **Publish** e click koro.

> Ekadhik admin email rakhte chaile:
> `request.auth.token.email in ["email1@example.com", "email2@example.com"]`

**Eta keno dorkar:** `allow read: if true` mane tomar website e jekeu product dekhte parbe
(normal, eta e chai). `allow write: ... email ==` mane khali tumi login kore thakle e photo/product
add-edit-delete korte parba — onno keu admin.html khule login chesta korleo kichu change korte parbe na.

> 📝 **Note:** Product **photo** (image file) Firebase Storage e rakhi na — oita **Cloudinary** e
> rakha hoy (100% free, kono card lage na). Firestore e shudhu photo-r link (URL) shongrohito thake।
> Cloudinary setup Part 2 e deya ache।

---

## PART 2 — Cloudinary Setup (photo hosting, 100% free, kono card lagbe na)

Product photo upload/host korar jonno Cloudinary use kora hocche — eta Firebase Storage-er
free, card-chhara alternative।

1. **https://cloudinary.com** e jao → **Sign up for free** (Google/GitHub/email diye) — kono
   card/payment info chaibe na।
2. Login korar por Dashboard-e **"Cloud name"** dekhte pabe (upore-r dike, ekta short code jemon
   `dxyz1234`) — eta copy kore rakho।
3. Upore-r right corner-e **⚙ Settings** e click koro → **Upload** tab e jao।
4. **"Upload presets"** section e **"Add upload preset"** e click koro।
5. **Signing Mode** ta **"Unsigned"** e change koro (eta important — na korle admin panel theke
   upload kaj korbe na)। Preset name ta ja e thakuk (e.g. `ml_default` ba notun ekta) — oita copy
   kore rakho। **Save** koro।
6. Ekhon `admin.html` file ta text editor e (VS Code, ba GitHub-e direct edit) khule, উপরের দিকে
   এই দুটো লাইন খুঁজে বার করো:
   ```javascript
   const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
   const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';
   ```
   `YOUR_CLOUD_NAME` ar `YOUR_UPLOAD_PRESET` er jaygay Step 2 ar Step 5 theke copy kora value
   duita boshiye Save koro।

> ⚠️ **Ekta limitation jene rakho:** Product delete korle (ba photo shorale) oita tomar website
> theke shathe shathe shore jabe, kintu image file ta Cloudinary-r storage e thakbe (automatic
> clean-up korte backend server lagto, jeta ei simple setup e nai)। Cloudinary-r free plan e
> 25GB-er moto jaygা thake, tai choto shop-er jonno eta niye chinta korar dorkar nai — tobe
> majhe majhe chaile Cloudinary Dashboard → **Media Library** theke purono photo manually
> delete kore dite paro।

---

## PART 3 — GitHub e code upload

Jodi age theke GitHub account na thake, **github.com** e ekta free account banao.

### Option A — GitHub website diye (simple, terminal lagbe na)

1. github.com e login kore **New repository** e click koro. Name dao (e.g. `swoosh-store`),
   **Public** ba **Private** — jeta khushi (Private hole o Vercel deploy korte kono somossha nai).
   **Create repository**.
2. Repository page e **uploading an existing file** link e click koro.
3. Ei zip file theke ber kora **shob file ar folder** (admin.html shoho) drag-drop kore upload koro.
   *(`photos` folder ta upload korar dorkar nai — "Ja bad deya hoyeche" section e keno bola ache.)*
4. Niche **Commit changes** button e click koro.

### Option B — Terminal/Git diye (jara comfortable)

```bash
cd your-project-folder
git init
git add .
git commit -m "Initial site + admin panel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/swoosh-store.git
git push -u origin main
```

---

## PART 4 — Vercel e Deploy koro

1. **vercel.com** e jao → **Sign up** → **Continue with GitHub** diye login koro (shobcheye shohoj).
2. Dashboard e **Add New → Project** e click koro.
3. Tomar `swoosh-store` repository **Import** koro.
4. Configure screen e:
   - **Framework Preset**: "Other" thakuk (kichu change korar dorkar nai)
   - **Build Command**: khali rakho / na thakleo cholbe
   - **Output Directory**: khali rakho (root)
5. **Deploy** e click koro. 30-60 second wait koro.
6. Deploy shesh hole tumi ekta URL pabe, jemon:
   **`https://swoosh-store.vercel.app`** — eta e tomar website, kono domain kena lage nai!

---

## PART 5 — Ekta last step: Firebase ke Vercel URL chena o

Ei step miss korle **login kaj korbe na** ("unauthorized domain" error dekhabe).

1. Firebase Console → **Authentication → Settings** tab → **Authorized domains**.
2. **Add domain** e click kore tomar Vercel URL boshao (e.g. `swoosh-store.vercel.app` —
   `https://` chhara khali domain ta).
3. Save.

Ekhon `https://swoosh-store.vercel.app/admin.html` e giye Step 1.1 e banano email/password
diye login koro. Ready!

---

## Product taxonomy (admin panel e ja dropdown e pabe)

Protita product-e **Gender** (Men/Women/Unisex) ar **Type** (niche) dutoi set korte hoy, plus
optional **Brand**:

| Type value | Label |
|---|---|
| sneakers | Sneakers |
| slides | Slides |
| formal_shirts_pants | Formal Shirts & Pants |
| joggers_trousers | Joggers & Trousers |
| dropshoulder_tshirts | Dropshoulder T-Shirts |
| watches | Watches |
| heels_sandals | Heels & Sandals |
| tops | Tops |
| gowns | Gowns |
| jewellery | Jewellery |
| bags | Bags & Accessories |
| sunglasses | Sunglasses |
| fragrance | Fragrance |
| umbrellas | Umbrellas |

Website-e **4 ta আলাদা section** ache — Men, Women, Sunglasses, Umbrellas — protita section-er
nijer hero banner (tomar real product-er photo diye automatic banano) ar category picture-grid
ache। Men/Women section-e category-grid Type dekhায় (Sneakers, Slides, ityadi — Men/Women-er
jonno alada shubset), Sunglasses/Umbrellas section-e category-grid Gender dekhায় (Men's/Women's/
Unisex)। "New arrival" alada toggle — je kono product-ke home page-er hero-e o priority dekhায়।

⚠️ **Important**: Type list e notun kichu add/remove korle **admin.html-er TYPE_OPTIONS** ar
**shop.html-er TYPE_OPTIONS** — duijaygay e change korte hobe, na hole mismatch hoye product
shothik jaygay show korbe na।

---

## Website structure (4 ta file)

- `index.html` — home page: hero + 4-way category grid (Men/Women/Sunglasses/Umbrellas), protita
  tile-e real product-er photo dynamically dekhায়
- `shop.html` — ekটাই page, URL parameter diye 4 rokom section hoy:
  - `shop.html?gender=men` / `?gender=women` — Men/Women section
  - `shop.html?type=sunglasses` / `?type=umbrellas` — Sunglasses/Umbrellas section
  - Header-e Home/Women/Men/Sunglasses/Umbrellas nav diye ek section theke onno-te jawa jay
  - Shopping Bag (cart) — "Add to Bag" + "Order Now" duitai ache, Bag icon-e click korle sidebar
    khule shob item ekshathe WhatsApp-e checkout kora jay
  - Multi-photo carousel + click-to-zoom lightbox + automatic watermark-shoho photo (admin theke
    upload korar shomoy e bosano hoy)
- `admin.html` — login, product add/edit/delete, Cloudinary-te photo upload+watermark

## Ja bad deya hoyeche

- `photos/` folder (204MB raw source images) — eta website e kokhono use hoy na, admin panel
  diye product-wise photo upload korba Cloudinary e (Part 2 dekho). Tomar local computer e ei
  folder rekhe dao reference hishebe, GitHub e upload korar dorkar nai.

## Common errors

| Error | Karon | Shomadhan |
|---|---|---|
| "auth/unauthorized-domain" | Vercel URL Firebase e add kora hoyni | Part 5 dekho |
| Login e "Wrong email or password" | Email/password bhul, ba Step 1.1 e user banano hoyni | Firebase Console → Authentication → Users check koro |
| Product save korle error | Security rules e email ta bhul boshano hoyeche | Part 1 Step 1.3 e email match kore dekho |
| Photo upload e "Photo upload failed" | admin.html e CLOUDINARY_CLOUD_NAME / CLOUDINARY_UPLOAD_PRESET bhul boshano, ba preset "Unsigned" kora hoyni | Part 2 Step 2/5 abar check koro |
| Photo upload atke thake | Internet slow, ba file 10MB er beshi | Chhoto size er photo try koro |
