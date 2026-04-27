// ===== CONSTANTS =====
window.MEMBERS = ["じゅん", "あいる", "けい", "まなと", "そういち", "けんてぃ"];
window.BUSINESSES = ["サークル間マッチング事業", "診断コンテンツ事業", "SNSメディア事業"];
window.PROJECTS = ["TikTok運用プロジェクト", "DM送信プロジェクト", "診断設計プロジェクト", "サークルマッチング検証プロジェクト"];
window.WORKFLOW_STAGES = ["企画", "準備", "実行", "検証", "改善", "完了"];
window.STATUS_OPTIONS = ["未着手", "進行中", "確認待ち", "完了"];
window.PRIORITY_OPTIONS = ["高", "中", "低"];

// LINE-green palette
window.LINE_GREEN       = "#06C755";
window.LINE_GREEN_DARK  = "#04A846";
window.LINE_GREEN_LIGHT = "#E9FBEF";
window.PALE_GREEN       = "#F3FCF6";
window.BORDER_GREEN     = "#B7EFC5";
window.APP_BG           = "#F7FCF8";

window.MEMBER_COLORS = {
  "じゅん":   { bg: "#DCFCE7", ring: "#4CAF50", text: "#166534", avatarBg: "#86EFAC" },
  "あいる":   { bg: "#FCE7F3", ring: "#EC4899", text: "#9D174D", avatarBg: "#F9A8D4" },
  "けい":     { bg: "#DBEAFE", ring: "#3B82F6", text: "#1E40AF", avatarBg: "#93C5FD" },
  "まなと":   { bg: "#FEF3C7", ring: "#F59E0B", text: "#92400E", avatarBg: "#FCD34D" },
  "そういち": { bg: "#EDE9FE", ring: "#8B5CF6", text: "#5B21B6", avatarBg: "#C4B5FD" },
  "けんてぃ": { bg: "#CCFBF1", ring: "#14B8A6", text: "#0F766E", avatarBg: "#5EEAD4" },
};

window.STATUS_COLORS = {
  "未着手":   { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
  "進行中":   { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA" },
  "確認待ち": { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  "完了":     { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
};

window.PRIORITY_COLORS = {
  "高": { bg: "#FEF2F2", text: "#DC2626" },
  "中": { bg: "#FFFBEB", text: "#D97706" },
  "低": { bg: "#EFF6FF", text: "#2563EB" },
};

// ===== ID GENERATOR =====
window.genId = function() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// ===== SAMPLE DATA =====
window.SAMPLE_TASKS = [
  { id:"t1",  title:"Instagramアカウントを作成する",         assignee:"あいる",   business:"サークル間マッチング事業", project:"DM送信プロジェクト",              workflowStage:"完了", dueDate:"2025-06-01", progress:100, status:"完了",     memo:"プロフィール整備済み",          createdAt:"2025-05-20", completedAt:"2025-05-31", priority:"高" },
  { id:"t2",  title:"DM文面を作成する",                      assignee:"そういち", business:"サークル間マッチング事業", project:"DM送信プロジェクト",              workflowStage:"実行", dueDate:"2025-06-02", progress:60,  status:"進行中",   memo:"テンプレート案を複数用意する",   createdAt:"2025-05-22", priority:"高" },
  { id:"t3",  title:"ターゲットサークルを30件リストアップする", assignee:"じゅん",  business:"サークル間マッチング事業", project:"DM送信プロジェクト",              workflowStage:"完了", dueDate:"2025-06-01", progress:100, status:"完了",     memo:"",                              createdAt:"2025-05-21", completedAt:"2025-05-30", priority:"高" },
  { id:"t4",  title:"TikTok投稿案を5本作成する",             assignee:"じゅん",  business:"SNSメディア事業",         project:"TikTok運用プロジェクト",          workflowStage:"実行", dueDate:"2025-06-03", progress:60,  status:"進行中",   memo:"トレンド調査してから作成",       createdAt:"2025-05-23", priority:"中" },
  { id:"t5",  title:"診断タイプ名を整理する",                assignee:"けい",    business:"診断コンテンツ事業",       project:"診断設計プロジェクト",            workflowStage:"準備", dueDate:"2025-06-04", progress:45,  status:"進行中",   memo:"",                              createdAt:"2025-05-24", priority:"中" },
  { id:"t6",  title:"LPの構成を作成する",                    assignee:"まなと",  business:"診断コンテンツ事業",       project:"診断設計プロジェクト",            workflowStage:"企画", dueDate:"2025-06-05", progress:30,  status:"進行中",   memo:"ユーザーインタビューを反映する", createdAt:"2025-05-25", priority:"中" },
  { id:"t7",  title:"診断質問の最終チェック",               assignee:"じゅん",  business:"診断コンテンツ事業",       project:"診断設計プロジェクト",            workflowStage:"検証", dueDate:"2025-06-02", progress:80,  status:"確認待ち", memo:"",                              createdAt:"2025-05-26", priority:"高" },
  { id:"t8",  title:"ユーザーインタビューの集計",            assignee:"じゅん",  business:"診断コンテンツ事業",       project:"診断設計プロジェクト",            workflowStage:"検証", dueDate:"2025-06-06", progress:20,  status:"未着手",   memo:"Googleスプレッドシートで共有",   createdAt:"2025-05-27", priority:"低" },
  { id:"t9",  title:"サークル間マッチング事業の企画書作成",  assignee:"じゅん",  business:"サークル間マッチング事業", project:"サークルマッチング検証プロジェクト", workflowStage:"企画", dueDate:"2025-06-08", progress:10,  status:"未着手",   memo:"スライド10枚以内で作成",         createdAt:"2025-05-28", priority:"低" },
  { id:"t10", title:"提携企業リストの更新",                  assignee:"けんてぃ",business:"診断コンテンツ事業",       project:"診断設計プロジェクト",            workflowStage:"完了", dueDate:"2025-06-09", progress:100, status:"完了",     memo:"最新情報に更新済み",             createdAt:"2025-05-20", completedAt:"2025-06-05", priority:"低" },
  { id:"t11", title:"30チームへDM送信",                      assignee:"まなと",  business:"サークル間マッチング事業", project:"DM送信プロジェクト",              workflowStage:"実行", dueDate:"2025-06-04", progress:40,  status:"進行中",   memo:"",                              createdAt:"2025-05-29", priority:"中" },
  { id:"t12", title:"TikTok動画の構成を仕上げる",            assignee:"じゅん",  business:"SNSメディア事業",         project:"TikTok運用プロジェクト",          workflowStage:"実行", dueDate:"2025-06-02", progress:60,  status:"進行中",   memo:"",                              createdAt:"2025-05-30", priority:"中" },
  { id:"t13", title:"SNS広告の効果検証レポート作成",         assignee:"あいる",  business:"SNSメディア事業",         project:"TikTok運用プロジェクト",          workflowStage:"検証", dueDate:"2025-06-07", progress:50,  status:"確認待ち", memo:"先週比で比較する",               createdAt:"2025-05-28", priority:"中" },
  { id:"t14", title:"診断コンテンツの改善案を提出",          assignee:"じゅん",  business:"診断コンテンツ事業",       project:"診断設計プロジェクト",            workflowStage:"改善", dueDate:"2025-06-04", progress:70,  status:"進行中",   memo:"ユーザーの声を反映する",         createdAt:"2025-05-27", priority:"中" },
  { id:"t15", title:"返信チームを管理する",                  assignee:"けい",    business:"サークル間マッチング事業", project:"DM送信プロジェクト",              workflowStage:"準備", dueDate:"2025-06-10", progress:0,   status:"未着手",   memo:"",                              createdAt:"2025-05-29", priority:"低" },
  { id:"t16", title:"送信リストの最終確認",                  assignee:"まなと",  business:"サークル間マッチング事業", project:"DM送信プロジェクト",              workflowStage:"準備", dueDate:"2025-06-03", progress:0,   status:"未着手",   memo:"",                              createdAt:"2025-05-29", priority:"高" },
  { id:"t17", title:"SNSメディア事業の企画書作成",           assignee:"そういち",business:"SNSメディア事業",         project:"TikTok運用プロジェクト",          workflowStage:"企画", dueDate:"2025-06-05", progress:35,  status:"進行中",   memo:"",                              createdAt:"2025-05-28", priority:"中" },
  { id:"t18", title:"ユーザーインタビューの実施",            assignee:"まなと",  business:"診断コンテンツ事業",       project:"診断設計プロジェクト",            workflowStage:"実行", dueDate:"2025-06-06", progress:0,   status:"未着手",   memo:"",                              createdAt:"2025-05-30", priority:"低" },
  { id:"t19", title:"サークル間マッチング事業の提案資料作成",assignee:"じゅん",  business:"サークル間マッチング事業", project:"サークルマッチング検証プロジェクト", workflowStage:"企画", dueDate:"2025-06-05", progress:25,  status:"未着手",   memo:"",                              createdAt:"2025-05-30", priority:"低" },
  { id:"t20", title:"コンテンツカレンダーの作成",            assignee:"けんてぃ",business:"SNSメディア事業",         project:"TikTok運用プロジェクト",          workflowStage:"準備", dueDate:"2025-06-03", progress:55,  status:"進行中",   memo:"",                              createdAt:"2025-05-25", priority:"中" },
];

window.SAMPLE_KPIS = [
  { id:"k1", title:"30チームへDM送信",     targetValue:30, currentValue:18, unit:"件", relatedProject:"DM送信プロジェクト" },
  { id:"k2", title:"TikTokを5本投稿",      targetValue:5,  currentValue:3,  unit:"本", relatedProject:"TikTok運用プロジェクト" },
  { id:"k3", title:"マッチング希望者を獲得", targetValue:3, currentValue:1, unit:"件", relatedProject:"サークルマッチング検証プロジェクト" },
  { id:"k4", title:"診断質問を16個作成",    targetValue:16, currentValue:10, unit:"個", relatedProject:"診断設計プロジェクト" },
];

window.SAMPLE_FLOWS = [
  {
    id: "f1",
    title: "サークル間マッチング初動フロー",
    business: "サークル間マッチング事業",
    steps: [
      { id:"s1", title:"ターゲットサークルを洗い出す",   assignee:"じゅん",  assignees:["じゅん"],         status:"完了",   relatedTaskIds:["t3"],  order:0, description:"" },
      { id:"s2", title:"Instagramアカウントを確認する",  assignee:"あいる",  assignees:["あいる"],         status:"完了",   relatedTaskIds:["t1"],  order:1, description:"" },
      { id:"s3", title:"DM文面を作成する",               assignee:"そういち",assignees:["そういち","じゅん"],status:"進行中", relatedTaskIds:["t2"],  order:2, description:"" },
      { id:"s4", title:"30チームへDMを送信する",         assignee:"まなと",  assignees:["まなと","あいる"], status:"未着手", relatedTaskIds:["t11"], order:3, description:"" },
      { id:"s5", title:"返信チームを管理する",           assignee:"けい",    assignees:["けい","そういち"], status:"未着手", relatedTaskIds:["t15"], order:4, description:"" },
    ]
  }
];

window.RELATED_TASKS = [
  { id:"r1", title:"ターゲットサークル候補をリスト化", assignee:"じゅん",   dueDate:"2025-06-01", status:"完了" },
  { id:"r2", title:"Instagramプロフィール整理",        assignee:"あいる",   dueDate:"2025-06-01", status:"完了" },
  { id:"r3", title:"DMテンプレート案を作成",           assignee:"そういち", dueDate:"2025-06-02", status:"進行中" },
  { id:"r4", title:"送信リストの最終確認",             assignee:"まなと",   dueDate:"2025-06-03", status:"未着手" },
  { id:"r5", title:"返信対応フローを整備",             assignee:"けい",     dueDate:"2025-06-04", status:"未着手" },
];

window.BOTTLENECKS = [
  { id:"b1", title:"DM文面の決定が遅れています",     desc:"承認待ちのため、次のステップに進めません。" },
  { id:"b2", title:"送信前の準備が不足しています",   desc:"送信リストの確定が遅れています。" },
  { id:"b3", title:"返信対応の体制が未整備です",     desc:"担当・フローの整理が必要です。" },
];

// ===== STORAGE =====
window.STORAGE_KEYS = {
  USER:  "kaiwai_selectedUser",
  TASKS: "kaiwai_tasks",
  KPIS:  "kaiwai_kpis",
  FLOWS: "kaiwai_flows",
};

window.loadFromStorage = function(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

window.saveToStorage = function(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

window.initStorage = function() {
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) saveToStorage(STORAGE_KEYS.TASKS, SAMPLE_TASKS);
  if (!localStorage.getItem(STORAGE_KEYS.KPIS))  saveToStorage(STORAGE_KEYS.KPIS,  SAMPLE_KPIS);
  if (!localStorage.getItem(STORAGE_KEYS.FLOWS)) saveToStorage(STORAGE_KEYS.FLOWS, SAMPLE_FLOWS);
};

// ===== HELPERS =====
window.calcProgress = function(tasks) {
  if (!tasks.length) return 0;
  return Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length);
};

window.formatDate = function(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const days = ["日","月","火","水","木","金","土"];
  return `${m}月${day}日（${days[d.getDay()]}）`;
};

window.isOverdue = function(task) {
  if (!task.dueDate || task.status === "完了") return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
};

window.isToday = function(dateStr) {
  if (!dateStr) return false;
  const today = new Date().toDateString();
  return new Date(dateStr).toDateString() === today;
};

window.isThisWeek = function(dateStr) {
  if (!dateStr) return false;
  const now = new Date();
  const d = new Date(dateStr);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0,0,0,0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23,59,59,999);
  return d >= startOfWeek && d <= endOfWeek;
};

// ===== SUPABASE INTEGRATION =====
window.db = null;

// Supabaseクライアントを初期化する
window.initSupabase = function() {
  if (
    typeof window.supabase === 'undefined' ||
    !window.SUPABASE_URL ||
    !window.SUPABASE_KEY ||
    window.SUPABASE_URL === 'YOUR_SUPABASE_URL'
  ) {
    console.info('[Supabase] env.js 未設定 — localStorage のみ使用します');
    return;
  }
  try {
    window.db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
    console.info('[Supabase] 接続完了');
  } catch(e) {
    console.warn('[Supabase] 接続失敗:', e);
  }
};

// DBへの書き込み（内部用）
// mode: 'upsert'=追記・更新  'replace'=全削除して再挿入
window._syncToDB = async function(table, records, mode) {
  if (!window.db) return;
  try {
    if (mode === 'replace') {
      await window.db.from(table).delete().neq('id', '');
      if (records.length > 0) {
        const { error } = await window.db.from(table).insert(records.map(r => ({ id: r.id, data: r })));
        if (error) console.warn('[Supabase] insert error (' + table + '):', error.message);
      }
    } else {
      const { error } = await window.db.from(table).upsert(records.map(r => ({ id: r.id, data: r })));
      if (error) console.warn('[Supabase] upsert error (' + table + '):', error.message);
    }
  } catch(e) {
    console.warn('[Supabase] 書き込み失敗 (' + table + '):', e);
  }
};

// 単一オブジェクト（配列でないデータ）を1レコードとして保存
window._syncSingleToDB = async function(table, id, data) {
  if (!window.db) return;
  try {
    var { error } = await window.db.from(table).upsert({ id: id, data: data });
    if (error) console.warn('[Supabase] upsert error (' + table + '):', error.message);
  } catch(e) {
    console.warn('[Supabase] sync failed (' + table + '):', e);
  }
};

// saveToStorage を上書き: localStorage + Supabase の両方に保存する
window.saveToStorage = function(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
  if (!window.db) return;
  if (Array.isArray(value)) {
    if      (key === STORAGE_KEYS.TASKS)       window._syncToDB('tasks',         value, 'upsert');
    else if (key === STORAGE_KEYS.KPIS)        window._syncToDB('kpis',          value, 'upsert');
    else if (key === STORAGE_KEYS.FLOWS)       window._syncToDB('flows',         value, 'replace');
    else if (key === 'kaiwai_bottlenecks')     window._syncToDB('bottlenecks',   value, 'replace');
    else if (key === 'kaiwai_related_tasks')   window._syncToDB('related_tasks', value, 'replace');
  } else if (value && typeof value === 'object') {
    if      (key === 'kaiwai_member_prefs')    window._syncSingleToDB('member_prefs', 'prefs', value);
  }
};

// initStorage を上書き: localStorage のみ書き込む（サンプルデータをDBに入れないため）
window.initStorage = function() {
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SAMPLE_TASKS));
  if (!localStorage.getItem(STORAGE_KEYS.KPIS))  localStorage.setItem(STORAGE_KEYS.KPIS,  JSON.stringify(SAMPLE_KPIS));
  if (!localStorage.getItem(STORAGE_KEYS.FLOWS)) localStorage.setItem(STORAGE_KEYS.FLOWS, JSON.stringify(SAMPLE_FLOWS));
};

// テーブル1つを安全にクエリ（エラーでも空配列を返す）
window._safeQuery = async function(tableName, queryPromise) {
  try {
    var res = await queryPromise;
    if (res.error) {
      console.warn('[Supabase] read error (' + tableName + '):', res.error.message);
      return [];
    }
    return res.data || [];
  } catch(e) {
    console.warn('[Supabase] read failed (' + tableName + '):', e);
    return [];
  }
};

// Supabase から全データを一括取得する（テーブルごと独立してエラー処理）
window.loadAllFromDB = async function() {
  if (!window.db) return null;
  try {
    var q = window._safeQuery;
    var [t, k, f, b, rt, mp, sc, no] = await Promise.all([
      q('tasks',         window.db.from('tasks').select('data')),
      q('kpis',          window.db.from('kpis').select('data')),
      q('flows',         window.db.from('flows').select('data')),
      q('bottlenecks',   window.db.from('bottlenecks').select('data')),
      q('related_tasks', window.db.from('related_tasks').select('data')),
      q('member_prefs',  window.db.from('member_prefs').select('data').eq('id','prefs')),
      q('schedule',      window.db.from('schedule').select('data').eq('id','seed_schedule')),
      q('notifications', window.db.from('notifications').select('data')),
    ]);
    return {
      tasks:         t.map(function(r) { return r.data; }),
      kpis:          k.map(function(r) { return r.data; }),
      flows:         f.map(function(r) { return r.data; }),
      bottlenecks:   b.map(function(r) { return r.data; }),
      relatedTasks:  rt.map(function(r) { return r.data; }),
      memberPrefs:   mp.length > 0 ? mp[0].data : null,
      schedule:      sc.length > 0 ? sc[0].data : null,
      notifications: no.map(function(r) { return r.data; }),
    };
  } catch(e) {
    console.warn('[Supabase] データ読み込み失敗:', e);
    return null;
  }
};

// env.js と Supabase SDK が読み込まれていれば自動接続
initSupabase();

// ===== AVATAR CUSTOMIZATION =====
window.AVATAR_COLOR_OPTIONS = {
  green:  { bg:"#DCFCE7", ring:"#4CAF50",  text:"#166534", avatarBg:"#86EFAC" },
  pink:   { bg:"#FCE7F3", ring:"#EC4899",  text:"#9D174D", avatarBg:"#F9A8D4" },
  blue:   { bg:"#DBEAFE", ring:"#3B82F6",  text:"#1E40AF", avatarBg:"#93C5FD" },
  yellow: { bg:"#FEF3C7", ring:"#F59E0B",  text:"#92400E", avatarBg:"#FCD34D" },
  purple: { bg:"#EDE9FE", ring:"#8B5CF6",  text:"#5B21B6", avatarBg:"#C4B5FD" },
  teal:   { bg:"#CCFBF1", ring:"#14B8A6",  text:"#0F766E", avatarBg:"#5EEAD4" },
  orange: { bg:"#FFEDD5", ring:"#F97316",  text:"#9A3412", avatarBg:"#FED7AA" },
  red:    { bg:"#FEE2E2", ring:"#EF4444",  text:"#991B1B", avatarBg:"#FCA5A5" },
};

window.DEFAULT_MEMBER_COLOR_KEYS = {
  "じゅん":"green","あいる":"pink","けい":"blue",
  "まなと":"yellow","そういち":"purple","けんてぃ":"teal",
};

window.MEMBER_PREFS = {};

window.applyMemberPrefs = function(prefs) {
  MEMBERS.forEach(function(m, i) {
    var colorKey = (prefs[m] && prefs[m].color) || DEFAULT_MEMBER_COLOR_KEYS[m] || 'green';
    var faceIdx  = (prefs[m] && prefs[m].face  != null) ? prefs[m].face  : i;
    if (AVATAR_COLOR_OPTIONS[colorKey]) {
      var c = AVATAR_COLOR_OPTIONS[colorKey];
      MEMBER_COLORS[m] = { bg:c.bg, ring:c.ring, text:c.text, avatarBg:c.avatarBg };
    }
    window.MEMBER_PREFS[m] = { color: colorKey, face: faceIdx };
  });
};

applyMemberPrefs(loadFromStorage('kaiwai_member_prefs', {}));

// ===== APP SETTINGS =====
window.APP_SETTINGS_DEFAULT = {
  appTitle: "SEED",
  navLabels: { dashboard:"ダッシュボード", mytasks:"自分のタスク", workflow:"ワークフロー", create:"タスク作成", settings:"設定" },
  dashboardSections: { kpi:"今週のKPI", nextTasks:"次にやるべきタスク", memberProgress:"メンバー別進捗", projectProgress:"プロジェクト別進捗" },
};

window.APP_SETTINGS = {
  appTitle: "SEED",
  navLabels: { dashboard:"ダッシュボード", mytasks:"自分のタスク", workflow:"ワークフロー", create:"タスク作成", settings:"設定" },
  dashboardSections: { kpi:"今週のKPI", nextTasks:"次にやるべきタスク", memberProgress:"メンバー別進捗", projectProgress:"プロジェクト別進捗" },
};

window.applyAppSettings = function(s) {
  if (!s) return;
  window.APP_SETTINGS = s;
  if (s.businesses && s.businesses.length) window.BUSINESSES = s.businesses;
  if (s.projects   && s.projects.length)   window.PROJECTS   = s.projects;
};

applyAppSettings(loadFromStorage('kaiwai_app_settings', null));

// ===== SCHEDULE FEATURE =====
window.STORAGE_KEYS.SCHEDULE      = 'seed_schedule';
window.STORAGE_KEYS.NOTIFICATIONS = 'seed_notifications';

// Period: 15th of current month → 15th of next month
window.getSchedulePeriod = function() {
  var today = new Date();
  var y  = today.getFullYear();
  var m  = today.getMonth();
  var ny = m === 11 ? y + 1 : y;
  var nm = (m + 1) % 12;
  return {
    start:     new Date(y, m, 15),
    end:       new Date(ny, nm, 15),
    periodKey: y + '-' + String(m + 1).padStart(2, '0'),
  };
};

window.getScheduleData = function(periodKey) {
  var store = loadFromStorage('seed_schedule', {});
  return store[periodKey] || { members: {}, confirmedDates: [] };
};

window.isScheduleCompleted = function(member, periodKey) {
  var d = window.getScheduleData(periodKey);
  return !!(d.members[member] && d.members[member].isCompleted);
};

// Save member availability, returns new notifications to create
window.saveMemberAvailability = function(periodKey, member, availableDates) {
  var store = loadFromStorage('seed_schedule', {});
  if (!store[periodKey]) store[periodKey] = { members: {}, confirmedDates: [] };
  store[periodKey].members[member] = {
    availableDates: availableDates,
    isCompleted:    true,
    completedAt:    new Date().toISOString(),
  };
  var prev = store[periodKey].confirmedDates || [];
  var chk  = window._checkMTGStatus(store[periodKey].members, prev);
  store[periodKey].confirmedDates = chk.confirmed;
  try { localStorage.setItem('seed_schedule', JSON.stringify(store)); } catch(e) {}
  if (window.db) window._syncSingleToDB('schedule', 'seed_schedule', store);
  return chk.newNotifs;
};

// Compare previous vs new confirmed dates and generate notifications
window._checkMTGStatus = function(membersData, prevConfirmed) {
  var counts = {};
  Object.values(membersData).forEach(function(md) {
    (md.availableDates || []).forEach(function(d) {
      counts[d] = (counts[d] || 0) + 1;
    });
  });
  var confirmed = Object.keys(counts).filter(function(d) { return counts[d] >= 4; }).sort();
  var notifs = [];
  confirmed.forEach(function(d) {
    if (!prevConfirmed.includes(d))
      notifs.push({ type: 'mtg_confirmed', targetDate: d, count: counts[d] });
  });
  prevConfirmed.forEach(function(d) {
    if (!confirmed.includes(d))
      notifs.push({ type: 'mtg_cancelled', targetDate: d });
  });
  return { confirmed: confirmed, newNotifs: notifs };
};

window._dateLabel = function(dateStr) {
  var d    = new Date(dateStr + 'T00:00:00');
  var days = ['日','月','火','水','木','金','土'];
  return (d.getMonth() + 1) + '月' + d.getDate() + '日（' + days[d.getDay()] + '）';
};

window.addNotificationsToStore = function(notifs) {
  if (!notifs || !notifs.length) return;
  var store = loadFromStorage('seed_notifications', []);
  notifs.forEach(function(n) {
    var label = window._dateLabel(n.targetDate);
    var msg   = n.type === 'mtg_confirmed'
      ? '📅 MTG確定：' + label + ' に' + n.count + '名が参加可能です'
      : '❌ MTGキャンセル：' + label + ' の参加者が3名以下になりました';
    store.unshift({ id: genId(), type: n.type, targetDate: n.targetDate, message: msg, createdAt: new Date().toISOString(), readBy: [] });
  });
  try { localStorage.setItem('seed_notifications', JSON.stringify(store)); } catch(e) {}
  if (window.db) window._syncToDB('notifications', store, 'replace');
};

window.markAllNotifsRead = function(member) {
  var store = loadFromStorage('seed_notifications', []);
  store.forEach(function(n) {
    if (!n.readBy.includes(member)) n.readBy.push(member);
  });
  try { localStorage.setItem('seed_notifications', JSON.stringify(store)); } catch(e) {}
  if (window.db) window._syncToDB('notifications', store, 'replace');
  return store;
};

// Send monthly reminder once per period (when today >= 10th)
window.checkMonthlyReminder = function(periodKey) {
  var today = new Date();
  if (today.getDate() < 10) return;
  var sentKey = 'seed_reminder_' + periodKey;
  if (localStorage.getItem(sentKey)) return;
  localStorage.setItem(sentKey, '1');
  var p  = window.getSchedulePeriod();
  var s  = window._dateLabel(p.start.toISOString().split('T')[0]);
  var e  = window._dateLabel(p.end.toISOString().split('T')[0]);
  var store = loadFromStorage('seed_notifications', []);
  store.unshift({ id: genId(), type: 'monthly_reminder', message: '📋 MTG日程を入力してください（' + s + ' 〜 ' + e + '）', createdAt: new Date().toISOString(), readBy: [] });
  try { localStorage.setItem('seed_notifications', JSON.stringify(store)); } catch(e) {}
  if (window.db) window._syncToDB('notifications', store, 'replace');
};
