/* ============================================================
   MODABIR — application logic
   Manager & Lead Developer: DONGOL

   All personal data lives in Supabase (public.modabir_profiles).
   Row Level Security guarantees auth.uid() = user_id, so no user
   can ever read or write another user's row. The public repo
   contains code only — never player data.
   ============================================================ */
(function () {
  'use strict';

  const I = window.ModabirI18n;
  const t = (key, vars) => I.t(key, vars);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const fmt = n => Number(n || 0).toLocaleString('en-US');
  const num = v => Number(v || 0) || 0;

  function fill(str, vars) {
    let out = String(str);
    Object.keys(vars || {}).forEach(k => { out = out.split('{' + k + '}').join(String(vars[k])); });
    return out;
  }

  /* ---------- Supabase client ---------- */
  const cfg = window.MODABIR_CONFIG || {};
  const configured = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const db = configured ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  }) : null;
  const TABLE = 'modabir_profiles';

  let user = null;
  let profile = null;
  let loadedFor = null;
  let saveChain = Promise.resolve();

  const DEFAULT = {
    name:'', kingdom:'', playerId:'', alliance:'', age:30, town:10, power:0,
    inf:0, cav:0, arch:0, tier:6, gear:1,
    speedBuild:0, speedResearch:0, speedTrain:0,
    bearDay:3, bearTime:'19:00', rallyRule:'power', rallyMax:4, rules:'NAP10',
    members:[], updatedAt:null
  };

  function cleanProfile(p) {
    const out = { ...DEFAULT };
    const textKeys = ['name','playerId','alliance','bearTime','rallyRule','rules','updatedAt'];
    const numberKeys = ['kingdom','age','town','power','inf','cav','arch','tier','gear','speedBuild','speedResearch','speedTrain','bearDay','rallyMax'];
    textKeys.forEach(k => { if (p && p[k] !== undefined && p[k] !== null) out[k] = String(p[k]).slice(0, 500); });
    numberKeys.forEach(k => { if (p && p[k] !== undefined) out[k] = num(p[k]); });

    out.age = Math.max(0, out.age);
    out.town = Math.min(30, Math.max(1, out.town || 10));
    out.tier = Math.min(10, Math.max(1, out.tier || 6));
    out.gear = Math.min(10, Math.max(0, out.gear));
    out.bearDay = Math.min(6, Math.max(0, out.bearDay));
    out.rallyMax = Math.min(8, Math.max(1, out.rallyMax || 4));
    out.bearTime = /^\d{1,2}:\d{2}$/.test(out.bearTime) ? out.bearTime : '19:00';
    out.rallyRule = ['power','score','rotation','custom'].includes(out.rallyRule) ? out.rallyRule : 'power';

    out.members = (p && Array.isArray(p.members) ? p.members : []).slice(0, 100).map(m => ({
      name: String(m && m.name || '').slice(0, 80),
      inf: Math.max(0, num(m && m.inf)),
      cav: Math.max(0, num(m && m.cav)),
      arch: Math.max(0, num(m && m.arch)),
      eg: Math.min(100, Math.max(0, num(m && m.eg)))
    })).filter(m => m.name);
    return out;
  }

  // Never let an older local-storage prototype leak player data on screen.
  try { localStorage.removeItem('modabir_kingshot_profile_v1'); } catch (e) {}

  const dailyKey = () => 'modabir_daily_' + (user ? user.id + '_' : '') + new Date().toISOString().slice(0, 10);

  /* ---------- event library ---------- */
  const EVENTS = [
    { id:'bear', key:'bear', cat:'bear', day:3, time:'19:00', form:'bear' },
    { id:'gov', key:'gov', cat:'command', day:1, time:'00:00', form:'points' },
    { id:'mobilization', key:'mobilization', cat:'command', day:0, time:'00:00', form:'economy' },
    { id:'mystic', key:'mystic', cat:'command', day:2, time:'00:00', form:'mixed' },
    { id:'swordland', key:'swordland', cat:'command', day:5, time:'00:00', form:'twolegion' },
    { id:'brawl', key:'brawl', cat:'command', day:6, time:'00:00', form:'economy' },
    { id:'kvk', key:'kvk', cat:'command', day:6, time:'10:00', form:'kvk' }
  ];
  function ev(key) {
    const dict = I.dictionaries[(localStorage.getItem('modabir_lang') || 'ar')] || I.dictionaries.en;
    return (dict.ev && dict.ev[key]) || I.dictionaries.en.ev[key];
  }

  /* ---------- helpers ---------- */
  function nextOccurrence(day, timeStr, from = new Date()) {
    const [h, m] = String(timeStr).split(':').map(Number);
    const d = new Date(from);
    d.setUTCHours(h || 0, m || 0, 0, 0);
    d.setUTCDate(d.getUTCDate() + ((day - d.getUTCDay() + 7) % 7));
    if (d <= from) d.setUTCDate(d.getUTCDate() + 7);
    return d;
  }
  function diffParts(target) {
    let s = Math.max(0, Math.floor((target - new Date()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    return { d, h, m, s, text: `${d}${t('dayShort')} ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` };
  }
  function toast(msg) {
    const box = $('#toast'), el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg; box.appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }
  function requireAuth() {
    if (!user || !db) { setGate(true); toast(t('authRequired')); return false; }
    return true;
  }
  function needProfile() { if (!profile) { toast(t('tNeedProfile')); openSetup(); return false; } return true; }
  function rallyRuleText() {
    const map = { power:'rallyPower', score:'rallyScore', rotation:'rallyRotation', custom:'rallyCustom' };
    return t(map[profile.rallyRule] || 'rallyPower');
  }

  /* ---------- auth gate ---------- */
  function setGate(show) {
    const gate = $('#authGate');
    if (!gate) return;
    gate.style.display = show ? 'flex' : 'none';
    gate.setAttribute('aria-hidden', String(!show));
    $('.app').setAttribute('aria-hidden', String(show));
    document.body.classList.toggle('locked', !!show);
    $('#setupBtn').disabled = !!show;
    $('#logoutBtn').hidden = !!show || !user;
    $('#privacyChip').hidden = !!show || !user;
  }

  async function loadProfile() {
    if (!user || !db) return;
    const { data, error } = await db.from(TABLE)
      .select('data')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) {
      console.error('MODABIR load error:', error);
      toast(t('loadFailed'));
      profile = null;
    } else {
      profile = data && data.data ? cleanProfile(data.data) : null;
      if (profile) toast(t('loadedCloud'));
    }
    renderAll();
  }

  function persist() {
    if (!user || !db) return Promise.resolve(false);
    profile.updatedAt = new Date().toISOString();
    const snapshot = cleanProfile(profile);
    saveChain = saveChain.then(async () => {
      const { error } = await db.from(TABLE).upsert({
        user_id: user.id,
        data: snapshot,
        updated_at: snapshot.updatedAt
      }, { onConflict: 'user_id' });
      if (error) {
        console.error('MODABIR save error:', error);
        toast(t('saveFailed'));
        return false;
      }
      renderProfile();
      return true;
    }).catch(err => {
      console.error('MODABIR save error:', err);
      toast(t('saveFailed'));
      return false;
    });
    return saveChain;
  }

  async function activateSession(session) {
    const next = session && session.user ? session.user : null;
    if (!next) {
      user = null;
      loadedFor = null;
      profile = null;
      $('#authStatus').textContent = '';
      setGate(true);
      renderAll();
      return;
    }
    const changed = loadedFor !== next.id;
    user = next;
    setGate(false);
    if (changed) {
      loadedFor = next.id;
      await loadProfile();
    } else {
      renderAll();
    }
  }

  function initAuth() {
    if (!db) {
      $('#authNotConfigured').hidden = false;
      $('#authForm').style.display = 'none';
      setGate(true);
      return;
    }
    db.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') activateSession(session);
      else if (event === 'SIGNED_OUT') activateSession(null);
      else if (event === 'USER_UPDATED' && session) { user = session.user; renderAll(); }
    });
    db.auth.getSession().then(({ data }) => activateSession(data.session));
  }

  /* ---------- navigation ---------- */
  $$('.nav-btn').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.go;
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b === btn));
    $$('.section').forEach(s => s.classList.toggle('active', s.id === id));
    window.scrollTo({ top:0, behavior:'smooth' });
  }));

  /* ---------- setup ---------- */
  function buildDayOptions() {
    const sel = $('#fBearDay');
    sel.innerHTML = t('days').map((d, i) => `<option value="${i}">${d}</option>`).join('');
  }
  function openSetup() {
    if (!requireAuth()) return;
    const p = profile || DEFAULT;
    const map = {
      fName:p.name, fKingdom:p.kingdom, fPlayerId:p.playerId, fAlliance:p.alliance,
      fAge:p.age, fTown:p.town, fPower:p.power, fInf:p.inf, fCav:p.cav, fArch:p.arch,
      fTier:p.tier, fGear:p.gear, fSpeedBuild:p.speedBuild, fSpeedResearch:p.speedResearch,
      fSpeedTrain:p.speedTrain, fBearTime:p.bearTime, fRallyMax:p.rallyMax, fRules:p.rules
    };
    Object.entries(map).forEach(([id, val]) => { const el = $('#' + id); if (el) el.value = val ?? ''; });
    $('#fBearDay').value = p.bearDay;
    $('#fRallyRule').value = p.rallyRule;
    $('#setupDialog').showModal();
  }
  function saveSetup(e) {
    e.preventDefault();
    if (!requireAuth()) return;
    profile = cleanProfile({
      name: $('#fName').value.trim(), kingdom: num($('#fKingdom').value), playerId: $('#fPlayerId').value.trim(),
      alliance: $('#fAlliance').value.trim(), age: num($('#fAge').value), town: num($('#fTown').value), power: num($('#fPower').value),
      inf: num($('#fInf').value), cav: num($('#fCav').value), arch: num($('#fArch').value),
      tier: num($('#fTier').value), gear: num($('#fGear').value),
      speedBuild: num($('#fSpeedBuild').value), speedResearch: num($('#fSpeedResearch').value),
      speedTrain: num($('#fSpeedTrain').value),
      bearDay: num($('#fBearDay').value), bearTime: $('#fBearTime').value || '19:00',
      rallyRule: $('#fRallyRule').value, rallyMax: num($('#fRallyMax').value) || 4,
      rules: $('#fRules').value.trim(), members: profile ? profile.members : [],
      updatedAt: new Date().toISOString()
    });
    $('#setupDialog').close();
    renderAll();
    persist().then(ok => { if (ok) toast(t('savedCloud')); });
  }

  /* ---------- formation engine ---------- */
  function formationFor(type) {
    const total = num(profile.inf) + num(profile.cav) + num(profile.arch);
    if (!total) return { text: t('formNoTroops'), note:'' };
    const scale = (i, c, a) => ({
      inf: Math.round(total * i), cav: Math.round(total * c), arch: Math.round(total * a), total
    });
    const f = ({
      bear: scale(.5,.25,.25), points: scale(.4,.2,.4), economy: scale(.6,.2,.2),
      mixed: scale(.34,.33,.33), twolegion: scale(.45,.2,.35), kvk: scale(.45,.25,.3)
    })[type] || scale(.4,.3,.3);
    const u = t('units');
    const noteKey = ({ bear:'formBear', points:'formPoints', economy:'formEconomy', mixed:'formMixed', twolegion:'formTwoLegion', kvk:'formKvk' })[type] || 'formDefault';
    return {
      text: `${fmt(f.inf)} ${u.inf} • ${fmt(f.cav)} ${u.cav} • ${fmt(f.arch)} ${u.arch} (${fmt(f.total)} ${u.total})`,
      note: t(noteKey, { rule: rallyRuleText() })
    };
  }

  /* ---------- bear engine ---------- */
  function bearScore(m) {
    const eg = num(m.eg);
    return Math.round((num(m.inf) + num(m.cav) + num(m.arch)) * Math.max(0, 1 - eg / 100));
  }
  function naturalTiers(rows) {
    if (!rows.length) return [];
    const scores = rows.map(r => r.score).sort((a,b) => b-a);
    const labels = ['SS','S','A','B','C','D'];
    const gaps = [];
    for (let i = 0; i < scores.length - 1; i++) gaps.push({ gap: scores[i] - scores[i+1], pos: i });
    gaps.sort((a,b) => b.gap - a.gap);
    const cuts = gaps.slice(0, Math.min(5, gaps.length)).map(g => scores[g.pos]).sort((a,b) => b-a);
    return rows.map(r => {
      let idx = Math.min(cuts.length, labels.length - 1);
      for (let i = 0; i < cuts.length; i++) if (r.score >= cuts[i]) { idx = i; break; }
      return { ...r, tier: labels[idx] };
    });
  }
  function addMember() {
    if (!needProfile()) return;
    const name = $('#mName').value.trim();
    if (!name) { toast(t('tEnterName')); return; }
    profile.members.push({
      name, inf:num($('#mInf').value), cav:num($('#mCav').value),
      arch:num($('#mArch').value), eg:num($('#mEg').value)
    });
    ['mName','mInf','mCav','mArch','mEg'].forEach(id => { $('#'+id).value = ''; });
    renderBear();
    persist().then(ok => { if (ok) toast(fill(t('tAdded'), { name })); });
  }
  function removeMember(i) {
    if (!needProfile()) return;
    profile.members.splice(i, 1);
    renderBear();
    persist();
  }
  window.addMember = addMember;
  window.removeMember = removeMember;

  /* ---------- priority engine ---------- */
  function buildPriorities() {
    const p = profile, out = [];
    const bearIn = diffParts(nextOccurrence(p.bearDay, p.bearTime));
    const totalSpeed = num(p.speedBuild) + num(p.speedResearch) + num(p.speedTrain);
    const push = (key, urgency) => out.push({
      t:t(key+'T'),
      r:t(key+'R', { time:bearIn.text, tier:Math.min(8, Math.max(4, Math.floor(num(p.town) / 2))) }),
      a:t(key+'A'), u:urgency
    });

    if (bearIn.d === 0 && bearIn.h < 12) push('prBearNow', t('urgent'));
    if (num(p.town) < 6) push('prTown6', t('urgent'));
    if (num(p.town) < 10) push('prTown10', t('important'));
    if (num(p.tier) < Math.min(8, Math.max(4, Math.floor(num(p.town) / 2)))) push('prTier', t('important'));
    if (num(p.gear) < Math.max(1, num(p.town) - 4)) push('prGear', t('important'));
    if (totalSpeed < 1200) push('prSpeed', t('laterTag'));
    push('prAlliance', t('important'));
    push('prRoutine', t('laterTag'));
    return out;
  }

  /* ---------- renderers ---------- */
  function renderOverview() {
    const p = profile;
    $('#greeting').textContent = p ? fill(t('heroGreeting'), { name:p.name, kingdom:p.kingdom }) : t('heroTitle');
    $('#profileChip').textContent = p ? `👤 ${p.name} • ${p.kingdom}` : t('profileEmpty');
    $('#heroStats').innerHTML = p ? `
      <div class="stat"><span>${t('statPower')}</span><b>${fmt(p.power)}</b></div>
      <div class="stat"><span>${t('statTroops')}</span><b>${fmt(num(p.inf)+num(p.cav)+num(p.arch))}</b></div>
      <div class="stat"><span>${t('statTown')}</span><b>${p.town}</b></div>
      <div class="stat"><span>${t('statAlliance')}</span><b style="font-size:15px">${p.alliance||'—'}</b></div>` :
      `<div class="empty" style="grid-column:1/-1">${t('heroNoData')}</div>`;
    if (!p) {
      $('#topAction').innerHTML = `<p class="empty">${t('noData')}</p>`;
      $('#todayEvent').innerHTML = `<p class="empty">${t('noData')}</p>`;
      return;
    }
    const top = buildPriorities()[0];
    $('#topAction').innerHTML = `<span class="badge b-urgent">${top.u}</span><h3 style="margin:10px 0 4px">${top.t}</h3><p>${top.a}</p>`;
    const today = new Date().getUTCDay();
    const e = EVENTS.find(x => x.day === today) || EVENTS[0], d = ev(e.key);
    $('#todayEvent').innerHTML = `<h3 style="margin:0 0 6px">${d.name}</h3><p>${d.desc}</p><ul class="list">${d.tips.slice(0,2).map(x=>`<li>${x}</li>`).join('')}</ul>`;
  }

  function renderEvents() {
    const box = $('#eventsGrid');
    if (!profile) { box.innerHTML = `<div class="empty">${t('heroNoData')}</div>`; return; }
    box.innerHTML = EVENTS.map(e => {
      const d = ev(e.key), diff = diffParts(nextOccurrence(e.day, e.time));
      const badge = diff.d === 0 ? `<span class="badge b-now">${t('today')}</span>`
        : diff.d <= 2 ? `<span class="badge b-soon">${t('soon')}</span>`
        : `<span class="badge b-later">${t('later')}</span>`;
      const f = formationFor(e.form);
      return `<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">${badge}<span class="timer" style="font-size:16px;color:var(--cyan)">${diff.text}</span></div>
        <h3 style="margin-top:10px">${d.name}</h3><p>${d.desc}</p>
        <ul class="list">${d.tips.map(x=>`<li>${x}</li>`).join('')}</ul>
        <div class="note" style="margin-top:12px">${d.best}</div>
        <p style="color:var(--gold)">${fill(t('formation'), { value:f.text })}</p>
        <small style="color:var(--muted)">${f.note}</small>
      </div>`;
    }).join('');
  }

  function renderCommand() {
    const box = $('#commandGrid');
    if (!profile) { box.innerHTML = `<div class="empty">${t('heroNoData')}</div>`; return; }
    box.innerHTML = EVENTS.filter(e => e.cat === 'command').map(e => {
      const d = ev(e.key), f = formationFor(e.form), diff = diffParts(nextOccurrence(e.day, e.time));
      return `<div class="card"><h3>${d.name}</h3>
        <p>${fill(t('startsAfter'), { time:diff.text })}</p>
        <p style="color:var(--cyan)">${fill(t('formation'), { value:f.text })}</p>
        <ul class="list">${d.tips.map(x=>`<li>${x}</li>`).join('')}</ul>
        <div class="note">${d.best}</div></div>`;
    }).join('');
  }

  function renderBear() {
    if (!profile) {
      $('#bearTableWrap').innerHTML = `<div class="empty">${t('heroNoData')}</div>`;
      $('#bearSteps').innerHTML = `<li>${t('heroNoData')}</li>`;
      $('#bearRule').textContent = '';
      return;
    }
    $('#bearRule').textContent = fill(t('bearRule'), {
      rule: rallyRuleText(), max: profile.rallyMax, extra: profile.rules || '—'
    });
    $('#bearSteps').innerHTML = t('bearSteps').map(s =>
      `<li>${fill(s, { rule:rallyRuleText(), max:profile.rallyMax })}</li>`).join('');
    const ranked = naturalTiers(profile.members.map((m, idx) => ({ ...m, score:bearScore(m), idx })));
    if (!ranked.length) { $('#bearTableWrap').innerHTML = `<div class="empty">${t('noMembers')}</div>`; return; }
    $('#bearTableWrap').innerHTML = `<table>
      <thead><tr><th>${t('colRank')}</th><th>${t('colName')}</th><th>${t('colScore')}</th><th>${t('colTier')}</th><th>${t('colRole')}</th><th></th></tr></thead>
      <tbody>${ranked.map((r,i) => `<tr>
        <td>${i+1}</td><td>${r.name}</td><td>${fmt(r.score)}</td>
        <td><span class="tier ${r.tier.toLowerCase()}">${r.tier}</span></td>
        <td>${i < profile.rallyMax ? (profile.rallyRule==='rotation' ? t('roleRotation') : t('roleMain')) : t('roleReserve')}</td>
        <td><button class="btn small danger" onclick="removeMember(${r.idx})">${t('deleteWord')}</button></td>
      </tr>`).join('')}</tbody></table>
      <div class="note">${t('bearDisclaimer')}</div>`;
  }

  function renderPriority() {
    const box = $('#priorityList');
    if (!profile) { box.innerHTML = `<div class="empty">${t('heroNoData')}</div>`; return; }
    box.innerHTML = buildPriorities().map((x,i) => `<div class="priority-item">
      <div class="priority-num">${i+1}</div>
      <div class="priority-body"><b>${x.t} <span class="badge ${x.u===t('urgent')?'b-urgent':x.u===t('important')?'b-soon':'b-later'}" style="margin-right:8px">${x.u}</span></b>
      <small>${x.r}</small><div style="margin-top:5px;color:var(--cyan)">→ ${x.a}</div></div>
    </div>`).join('');
  }

  function renderQuick() {
    if (!profile) {
      $('#dailyChecks').innerHTML = `<div class="empty">${t('heroNoData')}</div>`;
      $('#goldRules').innerHTML = '';
      return;
    }
    let done = []; try { done = JSON.parse(localStorage.getItem(dailyKey()) || '[]'); } catch (e) {}
    $('#dailyChecks').innerHTML = t('daily').map((x,i) => `<li class="${done.includes(i)?'done':''}">
      <input type="checkbox" data-i="${i}" ${done.includes(i)?'checked':''}><span>${x}</span></li>`).join('');
    $$('#dailyChecks input').forEach(cb => cb.addEventListener('change', () => {
      let arr = []; try { arr = JSON.parse(localStorage.getItem(dailyKey()) || '[]'); } catch (e) {}
      const i = Number(cb.dataset.i);
      arr = cb.checked ? [...new Set([...arr, i])] : arr.filter(x => x !== i);
      localStorage.setItem(dailyKey(), JSON.stringify(arr));
      cb.closest('li').classList.toggle('done', cb.checked);
    }));
    $('#goldRules').innerHTML = t('golden').map(x => `<li>${x}</li>`).join('');
  }

  function renderProfile() {
    const box = $('#profileSummary');
    if (!profile) box.innerHTML = `<div class="empty">${t('noData')}</div>`;
    else {
      const when = profile.updatedAt && !isNaN(new Date(profile.updatedAt)) ? new Date(profile.updatedAt).toLocaleString() : '—';
      box.innerHTML = `<table><tbody>
        <tr><th>${t('lblName')}</th><td>${profile.name}</td></tr>
        <tr><th>${t('lblKingdom')}</th><td>${profile.kingdom}</td></tr>
        <tr><th>${t('lblPlayerId')}</th><td>${profile.playerId||'—'}</td></tr>
        <tr><th>${t('lblAlliance')}</th><td>${profile.alliance||'—'}</td></tr>
        <tr><th>${t('lblPower')}</th><td>${fmt(profile.power)}</td></tr>
        <tr><th>${t('lblTroops')}</th><td>${fmt(profile.inf)} / ${fmt(profile.cav)} / ${fmt(profile.arch)}</td></tr>
        <tr><th>${t('lblUpdated')}</th><td>${when}</td></tr>
      </tbody></table>`;
    }
    $('#providerInfo').textContent = [
      'provider      = "SupabaseProvider"',
      `table         = "public.${TABLE}"`,
      `signedInAs    = "${user ? user.email : '—'}"`,
      `rowsVisible   = ${profile ? 1 : 0}`,
      `memberRecords = ${profile ? profile.members.length : 0}`,
      'localProfile  = disabled',
      'RLS           = auth.uid() = user_id',
      '',
      '// No query in this page can read another user\'s row.'
    ].join('\n');
  }

  function renderAll() {
    buildDayOptions();
    renderOverview(); renderEvents(); renderCommand(); renderBear();
    renderPriority(); renderQuick(); renderProfile(); tick();
  }

  function tick() {
    if (!profile) return;
    const target = nextOccurrence(profile.bearDay, profile.bearTime);
    const text = diffParts(target).text;
    $('#bearCountdown').textContent = text;
    $('#bearCountdown2').textContent = text;
    $('#bearNextLabel').textContent = fill(t('bearNext'), { date: target.toLocaleString('en-GB', { timeZone:'UTC' }) });
  }

  /* ---------- backup ---------- */
  function exportData() {
    if (!requireAuth() || !profile) { toast(t('noData')); return; }
    const blob = new Blob([JSON.stringify(cleanProfile(profile), null, 2)], { type:'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `modabir-${profile.kingdom}-${profile.name}.json`;
    a.click(); URL.revokeObjectURL(a.href); toast(t('tExported'));
  }
  function importData(e) {
    if (!requireAuth()) return;
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        profile = cleanProfile({ ...DEFAULT, ...JSON.parse(reader.result), updatedAt:new Date().toISOString() });
        renderAll();
        persist().then(ok => { if (ok) toast(t('tImported')); });
      } catch (err) { toast(t('tInvalid')); }
    };
    reader.readAsText(file);
  }
  async function resetData() {
    if (!requireAuth()) return;
    if (!confirm(t('tConfirmReset'))) return;
    const { error } = await db.from(TABLE).delete().eq('user_id', user.id);
    if (error) { console.error(error); toast(t('saveFailed')); return; }
    profile = null;
    renderAll();
    toast(t('tCleared'));
  }

  /* ---------- language wiring ---------- */
  function updateLangButtons() {
    const code = localStorage.getItem('modabir_lang') || 'ar';
    $$('.lang-switch button').forEach(b => b.classList.toggle('active', b.dataset.lang === code));
    document.title = `${t('appName')} — ${t('tagline')}`;
  }
  $$('.lang-switch button').forEach(btn => btn.addEventListener('click', () => {
    I.setLanguage(btn.dataset.lang, renderAll);
    updateLangButtons();
  }));

  /* ---------- events wiring ---------- */
  $('#setupBtn').addEventListener('click', openSetup);
  $('#closeSetupTop').addEventListener('click', () => $('#setupDialog').close());
  $('#cancelSetup').addEventListener('click', () => $('#setupDialog').close());
  $('#setupForm').addEventListener('submit', saveSetup);
  $('#addMemberBtn').addEventListener('click', addMember);
  $('#exportBtn').addEventListener('click', exportData);
  $('#importBtn').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', importData);
  $('#resetBtn').addEventListener('click', resetData);

  $('#logoutBtn').addEventListener('click', async () => {
    if (!db) return;
    await db.auth.signOut();
  });
  $('#authForm').addEventListener('submit', async e => {
    e.preventDefault();
    if (!db) { toast(t('authNotConfigured')); return; }
    const email = $('#authEmail').value.trim();
    if (!email) return;
    const btn = $('#authSend');
    btn.disabled = true;
    const redirectTo = location.origin + location.pathname;
    const { error } = await db.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    btn.disabled = false;
    $('#authStatus').textContent = error ? fill(t('authError'), { msg:error.message }) : t('authSent');
  });

  /* ---------- boot ---------- */
  buildDayOptions();
  I.initLanguage(() => renderAll());
  updateLangButtons();
  setGate(true);
  initAuth();
  setInterval(tick, 1000);
})();
