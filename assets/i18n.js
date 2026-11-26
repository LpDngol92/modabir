/* ============================================================
   MODABIR — i18n engine
   Add any language by calling:
     registerLanguage('fr', { ...dictionary... }, false);
   before app.js loads. See assets/i18n.template.js
   ============================================================ */
(function (global) {
  'use strict';

  const RTL_LANGS = new Set(['ar', 'fa', 'ur', 'he', 'ps', 'sd', 'yi', 'ku', 'dv']);

  const ar = {
    /* app */
    appName: 'مُدَبِّر',
    tagline: 'مساعد ملوك البقاء الذكي',
    manager: 'المدير: DONGOL',
    leadDev: 'المطور الرئيسي: DONGOL',
    setup: 'إعداد الملف / تعديله',
    profileEmpty: 'لم يتم إعداد الملف 👤',
    langLabel: 'اللغة',
    authTitle: '🔒 الصفحة محمية',
    authDesc: 'سجّل الدخول برابط سحري يُرسل إلى بريدك. بياناتك محفوظة في قاعدة بياناتك الخاصة، ولا يراها أحد غيرك نهائياً.',
    authEmail: 'بريدك الإلكتروني',
    authSend: 'إرسال رابط الدخول',
    authSent: 'تم الإرسال — افتح بريدك ثم اضغط الرابط',
    authLogout: 'تسجيل الخروج',
    authNotConfigured: 'الصفحة غير مهيّأة بعد. المطور يحتاج إضافة Project URL و Anon Key في assets/config.js.',
    authError: 'تعذّر الدخول: {msg}',
    authRequired: 'سجّل الدخول أولاً لعرض بياناتك 👆',
    saveFailed: 'تعذّر الحفظ — تأكد من تشغيل SQL في Supabase',
    loadFailed: 'تعذّر تحميل بياناتك',
    privacyBadge: '🔒 بياناتك خاصة — لا أحد غيرك يراها',
    savedCloud: 'تم الحفظ في قاعدة بياناتك الخاصة ✓',
    loadedCloud: 'تم تحميل بياناتك ✓',

    /* nav */
    navOverview: 'نظرة عامة', navEvents: 'الفعاليات الحالية', navCommand: 'مركز القيادة',
    navBear: 'فعالية الدب', navPriority: 'الأولويات العاجلة', navQuick: 'رفع القوة سريعاً',
    navProfile: 'بياناتي والنسخ الاحتياطي', navMain: 'لوحة التحكم',

    /* overview */
    heroTitle: 'أهلاً بك أيها الحاكم 👑',
    heroGreeting: 'أهلاً {name} 👑 — المملكة {kingdom}',
    heroIntro: 'أدخل بياناتك مرة واحدة، وهذا المساعد يحفظها في قاعدة بياناتك الخاصة ويحللها لك في كل زيارة: فعالياتك، أفضل تشكيلة، توقيت الدب، وأولويات التطوير. لا يستطيع أي لاعب آخر الاطلاع على بياناتك.',
    heroNoData: 'اضغط «إعداد الملف» لإدخال اسمك وبياناتك',
    statPower: 'القوة', statTroops: 'إجمالي القوات', statTown: 'مركز البلدة', statAlliance: 'التحالف',
    bearTimerTitle: '🐻 العدّاد القادم',
    bearTimerSub: 'حسب جدول تحالفك المدخل',
    bearNext: 'الموعد القادم: {date} UTC',
    topActionTitle: '⚡ أهم إجراء الآن',
    todayEventTitle: '🎯 فعالية اليوم',
    noData: 'لا توجد بيانات بعد',
    disclaimer: '⚠️ هذا مساعد ذكي يحفظ بياناتك في قاعدة بيانات خاصة بك بعد تسجيل الدخول، مثل فكرة أطلس تماماً. لا يوجد ربط تلقائي بحساب اللعبة (لا يوجد API رسمي)، لذلك أنت من تدخل الأرقام مرة واحدة، وتحدّثها عند تغيّرها.',
    complianceTitle: '🛡️ سياسة الامتثال والاستخدام الآمن',
    complianceText: 'الصفحة لا تخالف قواعد اللعبة. لا تتصل بخوادم اللعبة، ولا تطلب كلمة مرور أو رمز دخول، ولا تقرأ بيانات حسابك تلقائياً. تستخدم الذكاء الاصطناعي لمساعدتك وتحليل البيانات التي تُدخلها أنت، وتعتمد في جلب التحديثات على المنصات الرسمية المعلنة عند توفرها، مع إدخال قواعد السيرفر والتحالف يدوياً لضمان الدقة.',

    /* events */
    eventsTitle: '🎯 الفعاليات الحالية',
    eventsSub: 'جدول بالوقت الحقيقي + نصيحة مباشرة + أفضل استخدام لكل فعالية',
    allUtc: 'كل الأوقات UTC',
    today: 'اليوم', soon: 'قريباً', later: 'لاحقاً', dayShort: 'ي',
    startsAfter: 'البداية بعد {time}',
    formation: '🧩 التشكيلة: {value}',

    /* command */
    commandTitle: '🏰 فعاليات مركز القيادة',
    commandSub: 'أفضل توزيع للقوات حسب الفعالية وقوتك وتوزيع قواتك الحالي',

    /* bear */
    bearTitle: '🐻 فعالية الدب — غرفة العمليات',
    bearSub: 'التوقيت، الحشد، توزيع القوات، وترتيب المهاجمين حسب قواعد تحالفك',
    bearStartTitle: '⏰ بداية الفعالية',
    bearRule: 'القاعدة: {rule} • حد الحشد: {max} • {extra}',
    bearStepsTitle: '🧭 ماذا تسوي بالضبط؟',
    bearRankTitle: '🏅 ترتيب مهاجمي الحشد (مثل أطلس)',
    bearRankDesc: 'أدخل إحصائيات الاستطلاع لكل لاعب، والنظام يحسب نقطة الدب ويوزّع المستويات تلقائياً مع تصحيح المعدات الحصرية.',
    colRank: '#', colName: 'اللاعب', colScore: 'نقطة الدب', colTier: 'المستوى', colRole: 'الدور المقترح', colAction: '',
    addMember: 'إضافة',
    labelName: 'الاسم', labelInf: 'مشاة %', labelCav: 'فرسان %', labelArch: 'رماة %', labelEg: 'EG دفاعية %',
    noMembers: 'أضف لاعبين من تحالفك لترتيبهم تلقائياً',
    roleMain: 'قائد/عضو حشد', roleReserve: 'احتياطي / حشد ثانوي', roleRotation: 'حشد أساسي',
    bearDisclaimer: '⚠️ الدليل تقريبي: يحسب نقاط الدب من مكافآت القوات وتصحيح EG فقط. مهارات الأبطال ومتغيرات أخرى غير مشمولة.',
    bearSteps: [
      'قبل البداية بـ 30 دقيقة: جهّز الأسهم وراجع الأبطال الثلاثة',
      'فعّل معدات الهجوم فقط — المعدات الدفاعية تضخّم الاستطلاع وتُزال في الحساب',
      'كوّن حشداً بقيادة {rule}، وادخل أنت كـ joiner',
      'وزّع {max} أفراد حسب المستويات في الجدول أدناه',
      'بعد الفعالية: عالج الجرحى ولا تطلق مسارات في الحقل المفتوح'
    ],

    /* priority */
    priorityTitle: '⚡ النصائح العاجلة',
    prioritySub: 'ترتيب صارم: إيش تسوي أولاً، وبعدين، وإيش تؤجله',
    urgent: 'عاجل', important: 'مهم', laterTag: 'لاحقاً',
    prBearNowT: 'جهّز الدب الآن', prBearNowR: 'الفعالية تبدأ خلال {time}', prBearNowA: 'أسهم + أبطال هجوم + انضم لأقوى حشد',
    prTown6T: 'ارفع مركز البلدة إلى 6', prTown6R: 'فتح التحالف ومعظم الفعاليات متوقف على هذا', prTown6A: 'كل التسريعات للبناء حتى المستوى 6',
    prTown10T: 'ارفع مركز البلدة إلى 10', prTown10R: 'بطولة التحالف والعديد من الأنظمة تحتاج المستوى 10', prTown10A: 'بناء → بحث → قوات بهذا الترتيب',
    prTierT: 'طوّر القوات إلى Tier {tier}', prTierR: 'الـ tier أهم من عدد القوات في نفس المستوى', prTierA: 'درّب الدفعة الجديدة في فعالية تدريب القوات',
    prGearT: 'طوّر عتاد الحاكم', prGearR: 'عتاد الحاكم يضرب كل جوانب القوة', prGearA: 'استخدم مطارق الحدادة في أيام تداخل العتاد',
    prSpeedT: 'اجمع تسريعات قبل KvK', prSpeedR: 'التسريعات أغلى ما في التحضير', prSpeedA: 'لا تصرفها في فعاليات صغيرة',
    prAllianceT: 'انضم لتحالف داخل أفضل 10', prAllianceR: 'NAP + صناديق التحالف = حماية وتسريعات مجانية', prAllianceA: 'قدّم طلبك عبر مركز انتقال أطلس',
    prRoutineT: 'ثبّت روتين يومي', prRoutineR: 'التراكم اليومي يفوز على الدفعات الكبيرة', prRoutineA: 'شغّل قائمة مهام اليوم في قسم «رفع القوة»',

    /* quick */
    quickTitle: '📈 تعليمات عاجلة لرفع القوة أسرع',
    quickSub: 'قائمة يومية قابلة للتحديد — تُصفّر تلقائياً كل يوم',
    dailyTitle: '✅ مهام اليوم', goldenTitle: '💡 قواعد ذهبية',
    daily: [
      'اجمع المياه والخشب والحجر والحديد حتى السقف',
      'أنهِ المهام اليومية ومهام التحالف',
      'تدريب القوات في فعالية التدريب إن كانت مفتوحة',
      'استكشف وحوش القاعدة واحصد النقاط',
      'تبرّع بتقنية التحالف (البناء والأبحاث أولاً)',
      'راجع عدّاد الدب وجهّز التشكيلة',
      'لا تصرف تسريعات خارج الفعالية المناسبة'
    ],
    golden: [
      'الـ Tier أهم من حجم القوات — طوّر قبل ما تضاعف العدد',
      'عتاد الحاكم وتقنيات التحالف يضربان كل شيء — قدّمهما',
      'احفظ التسريعات لـ KvK وأقوى حاكم، لا للفعاليات الصغيرة',
      'في الدب: الهجوم فقط، والمعدات الدفاعية تُزال من الحساب',
      'انضم لتحالف NAP10 قبل أي اعتبار آخر',
      'زمّن إنفاقك مع تقويم أحداث أطلس (أفضل يوم للتداخل)'
    ],

    /* profile */
    profileTitle: '🗂️ بياناتي والنسخ الاحتياطي',
    profileSub: 'نفس آلية أطلس: بياناتك محفوظة في قاعدة بياناتك الخاصة، ولك وحدك تصديرها أو مسحها',
    summaryTitle: '📄 ملخص الملف',
    exportBtn: 'تصدير JSON', importBtn: 'استيراد JSON', resetBtn: 'مسح البيانات', deleteWord: 'حذف',
    providerTitle: '🔌 طبقة البيانات الخاصة',
    providerDesc: 'الصفحة تقرأ وتكتب في Supabase داخل صف واحد مرتبط ببريدك فقط. سياسة RLS تمنع أي حساب من قراءة صف لاعب آخر. لا تُحفظ بيانات اللاعبين داخل المستودع العام.',
    lblName: 'الاسم', lblKingdom: 'المملكة', lblPlayerId: 'Player ID', lblAlliance: 'التحالف / القرية',
    lblPower: 'القوة', lblTroops: 'القوات', lblUpdated: 'آخر تحديث',

    /* setup */
    setupTitle: 'إعداد ملف الحاكم', close: '✕ إغلاق', cancel: 'إلغاء', save: 'حفظ وتحليل بياناتي',
    groupIdentity: '👤 الهوية', groupTroops: '⚔️ القوات والعتاد', groupBear: '🐻 قواعد الدب والتحالف',
    fName: 'اسم اللاعب', fNamePh: 'اسمك داخل اللعبة',
    fKingdom: 'رقم المملكة', fKingdomPh: 'مثال: 172',
    fPlayerId: 'رقم اللاعب ID (اختياري)', fPlayerIdPh: 'يُحفظ في صفك الخاص فقط',
    fAlliance: 'اسم التحالف / القرية', fAlliancePh: 'اسم التحالف أو قريتك',
    fAge: 'عمر السيرفر (أيام)', fTown: 'مستوى مركز البلدة', fPower: 'القوة الكلية',
    fInf: 'المشاة', fCav: 'الفرسان', fArch: 'الرماة', fTier: 'أعلى tier متاح لك',
    fGear: 'مستوى عتاد الحاكم', fBuild: 'تسريعات البناء (دقائق)', fResearch: 'تسريعات الأبحاث (دقائق)', fTrain: 'تسريعات التدريب (دقائق)',
    fBearDay: 'يوم الدب (0=الأحد، 3=الأربعاء)', fBearTime: 'وقت البداية (UTC)',
    fRallyRule: 'قاعدة الحشد', fRallyMax: 'عدد أفراد الحشد المسموح',
    fRules: 'قواعد التحالف الإضافية (NAP، حدود القوات، ملاحظات)',
    fRulesPh: 'مثال: NAP10، لا حشد خارج القاعدة، حد 200k لكل مسار',
    setupNote: 'ℹ️ هذه القواعد تُدخل مرة واحدة، وبعدها النظام يطبّقها تلقائياً في كل قسم. هذا هو بديل «النظام يتعرف على قواعد السيرفر» بدون API.',
    days: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    rallyPower: 'الأقوى يقود الحشد', rallyScore: 'الأعلى نقطة دب يقود', rallyRotation: 'بالدور حسب القائمة', rallyCustom: 'قاعدة خاصة بالتحالف',

    /* formations */
    formNoTroops: 'أدخل أعداد قواتك في الإعداد عشان أحسب لك التشكيلة.',
    formBear: 'الدب: هجوم فقط. قدّم المشاة ثم الرماة حسب تعديلات EG. قاعدة تحالفك: {rule}',
    formPoints: 'متوازن لتغطية أكبر عدد من المعالم اليومية بأقل خسارة.',
    formEconomy: 'لا قتال كبير هنا — وفّر قواتك واستخدمها للمهام فقط.',
    formMixed: 'تشكيلة متساوية للتعامل مع مختلف أنواع الطوابق.',
    formTwoLegion: 'الفيلق الأول: الأقوى. الثاني: دعم. لا تخلط الترتيب.',
    formKvk: 'للقلعة: مشاة في المقدمة، فرسان للاستجابة السريعة، رماة للدعم.',
    formDefault: 'تشكيلة متوازنة.',

    /* toasts */
    tSaved: 'تم الحفظ ✓ وتم تحليل بياناتك', tAdded: 'تمت إضافة {name}', tExported: 'تم التصدير',
    tImported: 'تم الاستيراد ✓', tCleared: 'تم المسح', tNeedProfile: 'سوي إعداد الملف أولاً 👆',
    tInvalid: 'ملف غير صالح', tConfirmReset: 'متأكد تمسح كل بياناتك؟', tEnterName: 'اكتب اسم اللاعب',
    units: { inf: 'مشاة', cav: 'فرسان', arch: 'رماة', total: 'إجمالي' },

    /* events library */
    ev: {
      bear: { name: 'صيد الدب 🐻', desc: 'حشد تحالفي ضد الدب. التركيز على ضرر الهجوم لا الدفاع.', tips: ['جهّز الأسهم اليومية قبل البدء بـ 30 دقيقة', 'فعّل أفضل 3 أبطال بحسب قاعدة تحالفك', 'انضم للحشد ولا تطلق مسارك الفردي وقت الحشد', 'لا تستخدم الجنود الجرحى في الحشد'], best: 'أفضل استخدام: ادخر التسريعات والطاقة قبل البدء، وادخل كـ joiner في أقوى حشد متاح ثم عوّض نقاطك بالأسهم.' },
      gov: { name: 'أقوى حاكم ⚡', desc: 'فعالية نقاط يومية لمدة أسبوع. اجمع معالم كل يوم ولا تحرق التسريعات في اليوم الأول.', tips: ['اجمع صندوق المعالم اليومي فقط', 'وقّف فور وصولك لسقف مركز البلدة', 'وزّع التسريعات على الأيام السبعة'], best: 'أفضل استخدام: هدفك صناديق المعالم، لا المراكز العشرة الأوائل إلا إذا كنت من كبار المنفقين.' },
      mobilization: { name: 'تعبئة التحالف 📦', desc: 'مهام التحالف. أفضل لاعب F2P إذا التزم التحالف بالمهام الذهبية فقط.', tips: ['خذ المهام الذهبية ذات النقاط العالية فقط', 'اطلب من R4/R5 حذف المهام منخفضة القيمة', 'ركّز على التسريع الصغير بعد إتمام المهام الكبيرة'], best: 'أفضل استخدام: مزامنة التحالف على المهام عالية القيمة قبل إعادة تدوير المهام.' },
      mystic: { name: 'التجربة الغامضة 🧩', desc: 'تحديات طوابق بتشكيلات مختلفة. فائدتها تعتمد على عمق قائمتك لا على قوتك وحدها.', tips: ['احفظ تشكيلة لكل نوع طابق', 'استخدم البدلاء قبل الأبطال الأساسيين', 'أعد المحاولة بعد تغيير نوع القوات'], best: 'أفضل استخدام: طوّر تشكيلتين مختلفتين (مشاة ثقيلة / رماة) بدل رفع قوة تشكيلة واحدة.' },
      swordland: { name: 'أرض السيوف ⚔️', desc: 'معارك فيلقين. التوزيع أهم من القوة المطلقة.', tips: ['لا تضع لاعباً ضعيفاً في فيلق النخبة', 'وزّع القوات بالتساوي على المسارين', 'احفظ وقت الدخول الجماعي'], best: 'أفضل استخدام: اجعل الفيلق الأول للأقوى والثاني للدعم، ووقّت الدخول معاً.' },
      brawl: { name: 'شجار التحالف 🥊', desc: '6 أيام، مرحلة يومية مختلفة. تأجيل الترقيات يضاعف النقاط.', tips: ['أجّل ترقية المباني حتى مرحلة «نهضة المدينة»', 'احتفظ بالشاحنات لمرحلة النقل', 'أنهِ الشاحنات قبل نهاية اليوم'], best: 'أفضل استخدام: خطّط إنفاقك حسب سمة اليوم، لا حسب مزاجك.' },
      kvk: { name: 'صراع الممالك 🏰', desc: 'دورة 4 أسابيع: تحضير 5 أيام ثم معركة 12 ساعة. كل التسريعات تُحفظ للتحضير.', tips: ['لا تصرف تسريعات خارج مرحلة التحضير', 'احفظ درع الحماية ليوم المعركة', 'رتّب دور القلعة مع تحالفك مسبقاً'], best: 'أفضل استخدام: ركّز 80% من مواردك في التحضير، وادخل المعركة بدرع وجنود كاملة.' }
    }
  };

  const en = {
    appName: 'MODABIR', tagline: 'Smart Kingshot Assistant',
    manager: 'Manager: DONGOL', leadDev: 'Lead Developer: DONGOL',
    setup: 'Setup / Edit Profile', profileEmpty: 'Profile not set 👤', langLabel: 'Language',
    authTitle: '🔒 Protected Page',
    authDesc: 'Sign in with a magic link sent to your email. Your data lives in your own private database row and nobody else can read it.',
    authEmail: 'Your email address',
    authSend: 'Send sign-in link',
    authSent: 'Sent — open your email and tap the link',
    authLogout: 'Sign out',
    authNotConfigured: 'This page is not configured yet. The developer must add the Project URL and Anon Key in assets/config.js.',
    authError: 'Sign-in failed: {msg}',
    authRequired: 'Sign in first to view your data 👆',
    saveFailed: 'Save failed — make sure the Supabase SQL was run',
    loadFailed: 'Could not load your data',
    privacyBadge: '🔒 Your data is private — nobody else can see it',
    savedCloud: 'Saved to your private database ✓',
    loadedCloud: 'Your data was loaded ✓',

    navOverview: 'Overview', navEvents: 'Live Events', navCommand: 'Command Center',
    navBear: 'Bear Event', navPriority: 'Urgent Priorities', navQuick: 'Power Growth',
    navProfile: 'My Data & Backup', navMain: 'Dashboard',

    heroTitle: 'Welcome, Governor 👑', heroGreeting: 'Welcome {name} 👑 — Kingdom {kingdom}',
    heroIntro: 'Enter your data once. The assistant saves it to your own private database and analyses it on every visit: events, best formations, bear timing and upgrade priorities. No other player can ever read your data.',
    heroNoData: 'Click “Setup” to enter your name and data',
    statPower: 'Power', statTroops: 'Total Troops', statTown: 'Town Center', statAlliance: 'Alliance',
    bearTimerTitle: '🐻 Next Countdown', bearTimerSub: 'Based on your alliance schedule',
    bearNext: 'Next: {date} UTC', topActionTitle: '⚡ Do This Now', todayEventTitle: '🎯 Today’s Event',
    noData: 'No data yet',
    disclaimer: '⚠️ This is a smart assistant that stores your data in your own private database after sign-in, like the Atlas idea. There is no automatic game-account link (no official API), so you enter the numbers once and update them when needed.',
    complianceTitle: '🛡️ Compliance & Safe-Use Policy',
    complianceText: 'This page does not violate the game’s rules. It never connects to game servers, never asks for a password or login token, and never reads your account automatically. It uses AI to assist you and to analyse the data you enter, and sources updates from official platforms when available, while server and alliance rules are entered manually for accuracy.',

    eventsTitle: '🎯 Live Events', eventsSub: 'Real-time schedule + instant advice + best use for every event',
    allUtc: 'All times UTC', today: 'Today', soon: 'Soon', later: 'Later', dayShort: 'd',
    startsAfter: 'Starts in {time}', formation: '🧩 Formation: {value}',

    commandTitle: '🏰 Command Center Events', commandSub: 'Best troop split by event, matching your power and current troops',

    bearTitle: '🐻 Bear Event — War Room', bearSub: 'Timing, rallies, troop split and attacker ranking by your alliance rules',
    bearStartTitle: '⏰ Event Start', bearRule: 'Rule: {rule} • Rally slots: {max} • {extra}',
    bearStepsTitle: '🧭 What exactly to do', bearRankTitle: '🏅 Bear Rally Tier List (Atlas-style)',
    bearRankDesc: 'Enter each member’s scout report. The system calculates Bear Score and assigns tiers automatically with exclusive-gear correction.',
    colRank: '#', colName: 'Player', colScore: 'Bear Score', colTier: 'Tier', colRole: 'Suggested Role', colAction: '',
    addMember: 'Add', labelName: 'Name', labelInf: 'Infantry %', labelCav: 'Cavalry %', labelArch: 'Archers %', labelEg: 'Defensive EG %',
    noMembers: 'Add alliance members to rank them automatically',
    roleMain: 'Leader / rally member', roleReserve: 'Reserve / second rally', roleRotation: 'Core rally',
    bearDisclaimer: '⚠️ Approximate guide: Bear Score uses troop buffs and EG correction only. Hero skills and other variables are not included.',
    bearSteps: [
      '30 minutes before start: prepare arrows and review your 3 heroes',
      'Enable attack gear only — defensive gear inflates scouting and is removed in the calculation',
      'Form a rally led by {rule}, and join as a joiner',
      'Assign {max} members by the tiers in the table below',
      'After the event: heal troops and avoid open-field marches'
    ],

    priorityTitle: '⚡ Urgent Tips', prioritySub: 'A strict order: what to do first, next, and what to delay',
    urgent: 'Urgent', important: 'Important', laterTag: 'Later',
    prBearNowT: 'Prepare for Bear now', prBearNowR: 'Event starts in {time}', prBearNowA: 'Arrows + attack heroes + join the strongest rally',
    prTown6T: 'Upgrade Town Center to 6', prTown6R: 'Alliance and most events depend on this', prTown6A: 'All speedups into construction until level 6',
    prTown10T: 'Upgrade Town Center to 10', prTown10R: 'Alliance Championship and many systems need level 10', prTown10A: 'Build → research → troops in that order',
    prTierT: 'Train troops to Tier {tier}', prTierR: 'Tier matters more than quantity at the same level', prTierA: 'Train the new batch during the troop-training event',
    prGearT: 'Upgrade Governor Gear', prGearR: 'Governor gear affects every part of your power', prGearA: 'Use forge hammers on gear-overlap days',
    prSpeedT: 'Save speedups before KvK', prSpeedR: 'Speedups are the most valuable prep resource', prSpeedA: 'Do not spend them on minor events',
    prAllianceT: 'Join a top-10 alliance', prAllianceR: 'NAP + alliance chests = protection and free speedups', prAllianceA: 'Apply via Atlas transfer hub',
    prRoutineT: 'Set a daily routine', prRoutineR: 'Daily compounding beats occasional big pushes', prRoutineA: 'Run the daily checklist in “Power Growth”',

    quickTitle: '📈 Urgent Instructions to Grow Power Faster', quickSub: 'A tickable daily list — resets automatically every day',
    dailyTitle: '✅ Today’s Tasks', goldenTitle: '💡 Golden Rules',
    daily: [
      'Collect food, wood, stone and iron up to the cap',
      'Finish daily quests and alliance tasks',
      'Train troops during the training event if active',
      'Scout nearby monsters and claim points',
      'Donate alliance tech (construction and research first)',
      'Check the bear timer and prepare your formation',
      'Do not spend speedups outside the right event'
    ],
    golden: [
      'Tier beats troop count — upgrade before multiplying numbers',
      'Governor gear and alliance tech affect everything — prioritise them',
      'Save speedups for KvK and Strongest Governor, not small events',
      'Bear: attack only, and defensive gear is removed from the calculation',
      'Join a NAP10 alliance before anything else',
      'Time your spending with the Atlas event calendar (best overlap day)'
    ],

    profileTitle: '🗂️ My Data & Backup', profileSub: 'Same mechanism as Atlas: your data is stored in your own private database, and only you can export or clear it',
    summaryTitle: '📄 Profile Summary', exportBtn: 'Export JSON', importBtn: 'Import JSON', resetBtn: 'Clear Data', deleteWord: 'Delete',
    providerTitle: '🔌 Private Data Layer',
    providerDesc: 'The page reads and writes one Supabase row tied only to your email. RLS blocks every account from reading another player’s row. No player data is stored in the public repository.',
    lblName: 'Name', lblKingdom: 'Kingdom', lblPlayerId: 'Player ID', lblAlliance: 'Alliance / Village',
    lblPower: 'Power', lblTroops: 'Troops', lblUpdated: 'Last updated',

    setupTitle: 'Governor Profile Setup', close: '✕ Close', cancel: 'Cancel', save: 'Save & Analyse My Data',
    groupIdentity: '👤 Identity', groupTroops: '⚔️ Troops & Gear', groupBear: '🐻 Bear & Alliance Rules',
    fName: 'Player name', fNamePh: 'Your in-game name', fKingdom: 'Kingdom number', fKingdomPh: 'e.g. 172',
    fPlayerId: 'Player ID (optional)', fPlayerIdPh: 'Stored only in your private row', fAlliance: 'Alliance / Village', fAlliancePh: 'Your alliance or village name',
    fAge: 'Server age (days)', fTown: 'Town Center level', fPower: 'Total power',
    fInf: 'Infantry', fCav: 'Cavalry', fArch: 'Archers', fTier: 'Highest available tier',
    fGear: 'Governor gear level', fBuild: 'Construction speedups (min)', fResearch: 'Research speedups (min)', fTrain: 'Training speedups (min)',
    fBearDay: 'Bear day (0=Sun, 3=Wed)', fBearTime: 'Start time (UTC)', fRallyRule: 'Rally rule', fRallyMax: 'Allowed rally members',
    fRules: 'Extra alliance rules (NAP, troop caps, notes)', fRulesPh: 'e.g. NAP10, no rallies outside base, 200k per lane',
    setupNote: 'ℹ️ Enter these rules once; the system applies them everywhere afterwards. This replaces “auto-detecting server rules” without an API.',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    rallyPower: 'Strongest leads the rally', rallyScore: 'Highest Bear Score leads', rallyRotation: 'Rotation by list', rallyCustom: 'Custom alliance rule',

    formNoTroops: 'Enter your troop counts in Setup to get a formation.',
    formBear: 'Bear: attack only. Infantry first, then archers per EG adjustments. Your alliance rule: {rule}',
    formPoints: 'Balanced setup to cover the most daily milestones with minimal losses.',
    formEconomy: 'No major fighting here — save your troops and use them for tasks only.',
    formMixed: 'Even split to handle different floor types.',
    formTwoLegion: 'Legion 1: strongest. Legion 2: support. Do not mix the order.',
    formKvk: 'For the castle: infantry front, cavalry for fast response, archers for support.',
    formDefault: 'Balanced formation.',

    tSaved: 'Saved ✓ and analysed', tAdded: 'Added {name}', tExported: 'Exported', tImported: 'Imported ✓',
    tCleared: 'Cleared', tNeedProfile: 'Please set up your profile first 👆', tInvalid: 'Invalid file',
    tConfirmReset: 'Sure you want to clear all your data?', tEnterName: 'Enter the player name',
    units: { inf: 'Infantry', cav: 'Cavalry', arch: 'Archers', total: 'Total' },

    ev: {
      bear: { name: 'Bear Hunt 🐻', desc: 'Alliance rally against the bear. Focus on attack damage, not defence.', tips: ['Prepare daily arrows 30 minutes before start', 'Activate your best 3 heroes per alliance rule', 'Join a rally — do not send a solo march during the rally', 'Do not use wounded troops in the rally'], best: 'Best use: save speedups and energy before start, join as a joiner in the strongest rally, then top up points with arrows.' },
      gov: { name: 'Strongest Governor ⚡', desc: 'A seven-day daily points event. Collect daily milestones and do not burn speedups on day one.', tips: ['Claim only the daily milestone chest', 'Stop once you hit your Town Center cap', 'Spread speedups across all seven days'], best: 'Best use: aim for milestone chests, not the top 10 unless you are a heavy spender.' },
      mobilization: { name: 'Alliance Mobilization 📦', desc: 'Alliance tasks. Best F2P event if the alliance sticks to gold tasks only.', tips: ['Take only high-value gold tasks', 'Ask R4/R5 to remove low-value tasks', 'Focus on small speedups after finishing big tasks'], best: 'Best use: sync the alliance on high-value tasks before recycling the task pool.' },
      mystic: { name: 'Mystic Trial 🧩', desc: 'Floor challenges with different formations. Depth of roster matters more than raw power.', tips: ['Save one formation per floor type', 'Use substitutes before your main heroes', 'Retry after changing troop type'], best: 'Best use: build two different formations (heavy infantry / archers) instead of boosting a single one.' },
      swordland: { name: 'Swordland Showdown ⚔️', desc: 'Two-legion battles. Distribution matters more than absolute power.', tips: ['Do not put a weak player in the elite legion', 'Split troops evenly across both lanes', 'Save the synchronized entry time'], best: 'Best use: legion 1 for the strongest, legion 2 for support, and enter at the same time.' },
      brawl: { name: 'Alliance Brawl 🥊', desc: 'Six days, a different daily theme. Delaying upgrades multiplies points.', tips: ['Delay building upgrades until City Revival day', 'Save trucks for the transport phase', 'Finish trucks before the day ends'], best: 'Best use: plan your spending by the daily theme, not by mood.' },
      kvk: { name: 'Kingdom vs Kingdom 🏰', desc: '4-week cycle: 5 prep days then a 12-hour battle. All speedups are saved for prep.', tips: ['Do not spend speedups outside prep', 'Save a shield for battle day', 'Arrange castle rotation with your alliance in advance'], best: 'Best use: put 80% of resources into prep, then enter battle with a shield and full troops.' }
    }
  };

  const dictionaries = { ar, en };
  let current = 'ar';

  function isRTL(code) { return RTL_LANGS.has(String(code).split('-')[0].toLowerCase()); }

  function registerLanguage(code, dict, rtl) {
    dictionaries[code] = dict;
    if (typeof rtl === 'boolean') {
      if (rtl) RTL_LANGS.add(code.split('-')[0].toLowerCase());
      else RTL_LANGS.delete(code.split('-')[0].toLowerCase());
    }
    return dictionaries;
  }

  function t(key, vars) {
    const dict = dictionaries[current] || en;
    let val = dict[key];
    if (val === undefined) val = en[key];
    if (val === undefined) val = key;
    if (typeof val === 'string' && vars) {
      Object.keys(vars).forEach(k => { val = val.split('{' + k + '}').join(String(vars[k])); });
    }
    return val;
  }

  function languages() { return Object.keys(dictionaries); }

  function setLanguage(code, rerender) {
    if (!dictionaries[code]) code = 'en';
    current = code;
    try { localStorage.setItem('modabir_lang', code); } catch (e) {}
    const html = document.documentElement;
    html.lang = code;
    html.dir = isRTL(code) ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    if (typeof rerender === 'function') rerender();
    return code;
  }

  function initLanguage(rerender) {
    let saved = null;
    try { saved = localStorage.getItem('modabir_lang'); } catch (e) {}
    const fromUrl = new URLSearchParams(location.search).get('lang');
    return setLanguage(fromUrl || saved || 'ar', rerender);
  }

  global.ModabirI18n = { t, setLanguage, initLanguage, registerLanguage, languages, isRTL, dictionaries };
})(window);
