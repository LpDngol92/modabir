# MODABIR — مُدَبِّر

**Smart private assistant for Kingshot / ملوك البقاء**

- **Manager / المدير:** DONGOL
- **Lead Developer / المطور الرئيسي:** DONGOL

Live site: `https://LpDngol92.github.io/modabir/`

---

## What it does / ماذا يفعل

Same mechanism as Atlas — sign in once with your email, enter your data once, and the system saves it to your own private row and analyses it on every visit:

- Live event schedule with instant tips and best-use advice
- Command Center events with best troop distribution based on your power and troops
- Bear event war room: countdown, rally rules, role assignment and an Atlas-style Bear Score tier list
- Urgent priority list: what to upgrade first, next, and what to delay
- Daily power-growth checklist with AI-assisted analysis

نفس آلية أطلس: تسجّل الدخول ببريدك، تدخل بياناتك مرة، والنظام يحفظها في صف خاص بك ويحللها في كل زيارة.

## Privacy & storage / الخصوصية والتخزين

- The repository contains **code only**. It never contains player data.
- Player data is stored in Supabase table `public.modabir_profiles`, one row per authenticated user.
- Row Level Security (RLS) enforces `auth.uid() = user_id` for SELECT, INSERT, UPDATE and DELETE.
- A signed-in player can load **only their own row**. There is no admin/public listing query anywhere in the page.
- The page is gated behind an email magic link. It never asks for a game password or login token.
- Only the Anon public key is in `assets/config.js`. Never add the service_role/secret key.

> المستودع يحتوي الكود فقط. بيانات اللاعبين محفوظة في Supabase داخل صف واحد لكل مستخدم، وسياسة RLS تمنع أي لاعب من قراءة بيانات أي أحد آخر نهائياً.

## One-time setup / إعداد لمرة واحدة

1. Create a free Supabase project.
2. Run `supabase/schema.sql` in **SQL Editor → New query → Run**.
3. Copy **Project URL** and **anon public key** into `assets/config.js`.
4. Enable Email provider in **Authentication → Providers → Email**.

## Compliance & safe use / سياسة الامتثال والاستخدام الآمن

> **AR:** الصفحة لا تخالف قواعد اللعبة. لا تتصل بخوادم اللعبة، ولا تطلب كلمة مرور أو رمز دخول، ولا تقرأ بيانات حسابك تلقائياً. تستخدم الذكاء الاصطناعي لمساعدتك وتحليل البيانات التي تُدخلها أنت، وتعتمد في جلب التحديثات على المنصات الرسمية المعلنة عند توفرها، مع إدخال قواعد السيرفر والتحالف يدوياً لضمان الدقة.

> **EN:** This page does not violate the game's rules. It never connects to game servers, never asks for a password or login token, and never reads your account automatically. It uses AI to assist you and to analyse the data you enter, and sources updates from official platforms when available, while server and alliance rules are entered manually for accuracy.

## Languages / اللغات

- Arabic (ar) — default, RTL
- English (en) — LTR
- Any other language: copy `assets/i18n.template.js` to `assets/i18n.xx.js`, translate the keys, load it before `app.js`, then open with `?lang=xx`.

## Repository permissions / صلاحيات المستودع

- The repository is **public for viewing only**. Visitors cannot modify any file.
- Only the owner (DONGOL) can push changes.
- Force pushes and branch deletion are disabled on `main`.

## Files / الملفات

```
index.html              Page structure + protected sign-in gate
assets/style.css        Theme + RTL/LTR layout
assets/i18n.js          Arabic & English dictionaries + translation engine
assets/i18n.template.js Template to add any language
assets/config.js        Supabase URL + anon public key ONLY
assets/app.js           Auth, private storage and analysis engines
supabase/schema.sql     RLS policies — run once in Supabase
.nojekyll               Ensures assets are served as-is on GitHub Pages
```
