/* ============================================================
   MODABIR — how to add any language
   ------------------------------------------------------------
   1. Copy this file to: assets/i18n.xx.js   (xx = language code)
   2. Translate every value below into that language.
   3. In index.html, load it BEFORE app.js:
        <script src="assets/i18n.js"></script>
        <script src="assets/i18n.xx.js"></script>
        <script src="assets/app.js"></script>
   4. Open the site with ?lang=xx or choose it in the selector
      (after registering it in the buttons if you want it visible).

   The third argument is RTL: true for right-to-left languages
   (ar, fa, ur, he...), false for left-to-right languages.
   ============================================================ */

window.ModabirI18n.registerLanguage('xx', {
  appName: 'MODABIR',
  tagline: 'Translate this line',
  manager: 'Manager: DONGOL',
  leadDev: 'Lead Developer: DONGOL',
  /* ... copy all keys from assets/i18n.js (the "en" block) and translate ... */
}, false);
