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

### Step 1.3 — Storage enable koro (product photo rakhar jonno)

1. **Build → Storage** e jao.
2. **Get started** click koro (na thakle) → **Production mode** → same region → **Done**.

### Step 1.4 — Firestore Rules boshao

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

### Step 1.5 — Storage Rules boshao

**Storage → Rules** tab e jao, shob mucche niche ei code ta paste koro:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == "YOUR_EMAIL@example.com";
    }
  }
}
```

Ekhaneo `YOUR_EMAIL@example.com` change kore **Publish** koro.

**Eta keno dorkar:** `allow read: if true` mane tomar website e jekeu product dekhte parbe
(normal, eta e chai). `allow write: ... email ==` mane khali tumi login kore thakle e photo/product
add-edit-delete korte parba — onno keu admin.html khule login chesta korleo kichu change korte parbe na.

---

## PART 2 — GitHub e code upload

Jodi age theke GitHub account na thake, **github.com** e ekta free account banao.

### Option A — GitHub website diye (simple, terminal lagbe na)

1. github.com e login kore **New repository** e click koro. Name dao (e.g. `swoosh-store`),
   **Public** ba **Private** — jeta khushi (Private hole o Vercel deploy korte kono somossha nai).
   **Create repository**.
2. Repository page e **uploading an existing file** link e click koro.
3. Ei zip file theke ber kora **shob file ar folder** (admin.html shoho) drag-drop kore upload koro.
   *(`photos` folder ta upload korar dorkar nai — Part 4 e keno bola ache.)*
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

## PART 3 — Vercel e Deploy koro

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

## PART 4 — Ekta last step: Firebase ke Vercel URL chena o

Ei step miss korle **login kaj korbe na** ("unauthorized domain" error dekhabe).

1. Firebase Console → **Authentication → Settings** tab → **Authorized domains**.
2. **Add domain** e click kore tomar Vercel URL boshao (e.g. `swoosh-store.vercel.app` —
   `https://` chhara khali domain ta).
3. Save.

Ekhon `https://swoosh-store.vercel.app/admin.html` e giye Step 1.1 e banano email/password
diye login koro. Ready!

---

## Category list (admin panel e ja dropdown e pabe)

| Group | Categories |
|---|---|
| Men's Ready-to-Wear | Sneakers, Joggers, Shirts, T-Shirts, Slides |
| Women's Ready-to-Wear | Sneakers, Heels & Sandals, Tops, Gowns, Jewellery, Bags & Accessories |
| Sunglasses | Men's, Women's, Unisex |
| Umbrellas | Classic, Folding |

Eigulor baire "**New arrival**" ekta alada toggle — je kono category-r product ke ek shathe
"New Arrivals" page e o dekhate parba. "All Stock Items" page automatic shob product dekhabe,
alada kichu korte hobe na.

Notun kono brand-new section (e.g. "Watches") lagle admin dropdown e ekta line add kora jabe,
kintu shathe ekta notun HTML page o lagbe public site e dekhate — eta lagle bole dio.

---

## Ja fix kora hoyeche (tomar original code theke)

- **Category filter bug**: category page gulo (mens-categories.html, ityadi) product page e
  `?cat=...` pathaччило na, tai shob product mixed dekhto. Ekhon shothik bhabe filter hoy.
- **New Arrivals page**: age generic template chilo (shob product dekhato), ekhon shudhu
  `isNewArrival: true` thaka product gulo dekhabe.
- **Section heading fade-in**: 17 ta page e heading (jemon "Men's Shirts" lekha) kokhono
  fade-in hoto na (invisible thakto) — shob jaygay fix kora hoyeche.

## Ja bad deya hoyeche

- `photos/` folder (204MB raw source images) — eta website e kokhono use hoy na, admin panel
  diye product-wise photo upload korba Firebase Storage e. Tomar local computer e ei folder
  rekhe dao reference hishebe, GitHub e upload korar dorkar nai.

## Common errors

| Error | Karon | Shomadhan |
|---|---|---|
| "auth/unauthorized-domain" | Vercel URL Firebase e add kora hoyni | Part 4 dekho |
| Login e "Wrong email or password" | Email/password bhul, ba Step 1.1 e user banano hoyni | Firebase Console → Authentication → Users check koro |
| Product save korle error | Security rules e email ta bhul boshano hoyeche | Part 1.4/1.5 e email match kore dekho |
| Photo upload atke thake | Internet slow, ba file 10MB er beshi | Chhoto size er photo try koro |
