// ① バグ修正：Section と Field を SettingsPage の外に定義
var _sInputStyle = { width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"9px 12px", fontSize:13, outline:"none", boxSizing:"border-box", color:"#1F2937" };

function SettingsSection({ title, children }) {
  return (
    <div style={{ background:"white", borderRadius:16, padding:"20px 24px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)", marginBottom:16 }}>
      <h3 style={{ fontSize:15, fontWeight:700, color:"#1F2937", marginBottom:16, paddingBottom:10, borderBottom:"1px solid #F3F4F6" }}>{title}</h3>
      {children}
    </div>
  );
}

function SettingsField({ label, value, onChange, placeholder, multiline }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, fontWeight:600, color:"#6B7280", display:"block", marginBottom:5 }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
          style={{ ..._sInputStyle, resize:"vertical", lineHeight:1.6 }}
          onFocus={e => e.target.style.borderColor = "var(--accent,#22C55E)"}
          onBlur={e  => e.target.style.borderColor = "#E5E7EB"} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={_sInputStyle}
          onFocus={e => e.target.style.borderColor = "var(--accent,#22C55E)"}
          onBlur={e  => e.target.style.borderColor = "#E5E7EB"} />
      )}
    </div>
  );
}

function SettingsPage({ appSettings, onSaveSettings, isMobile }) {
  var s = appSettings || window.APP_SETTINGS || {};

  const [title,      setTitle]      = React.useState(s.appTitle || "SEED");
  const [navLabels,  setNavLabels]  = React.useState(Object.assign({ dashboard:"ダッシュボード", mytasks:"自分のタスク", calendar:"カレンダー", create:"タスク作成", settings:"設定" }, s.navLabels || {}));
  const [sections,   setSections]   = React.useState(Object.assign({ kpi:"今週のKPI", nextTasks:"次にやるべきタスク", memberProgress:"メンバー別進捗", projectProgress:"プロジェクト別進捗" }, s.dashboardSections || {}));
  const [businesses, setBusinesses] = React.useState((s.businesses || window.BUSINESSES || ["サークル間マッチング事業","診断コンテンツ事業","SNSメディア事業"]).join("\n"));
  const [projects,   setProjects]   = React.useState((s.projects   || window.PROJECTS   || ["TikTok運用プロジェクト","DM送信プロジェクト","診断設計プロジェクト","サークルマッチング検証プロジェクト"]).join("\n"));
  const [saved,      setSaved]      = React.useState(false);

  function handleSave() {
    var bList = businesses.split("\n").map(function(x){ return x.trim(); }).filter(Boolean);
    var pList = projects.split("\n").map(function(x){ return x.trim(); }).filter(Boolean);
    var newSettings = {
      appTitle: title.trim() || "SEED",
      navLabels: navLabels,
      dashboardSections: sections,
      businesses: bList.length ? bList : window.BUSINESSES,
      projects:   pList.length ? pList : window.PROJECTS,
    };
    saveToStorage('kaiwai_app_settings', newSettings);
    onSaveSettings(newSettings);
    setSaved(true);
    setTimeout(function(){ setSaved(false); }, 2500);
  }

  function resetAll() {
    if (!window.confirm("すべての設定をデフォルトに戻しますか？")) return;
    setTitle("SEED");
    setNavLabels({ dashboard:"ダッシュボード", mytasks:"自分のタスク", calendar:"カレンダー", create:"タスク作成", settings:"設定" });
    setSections({ kpi:"今週のKPI", nextTasks:"次にやるべきタスク", memberProgress:"メンバー別進捗", projectProgress:"プロジェクト別進捗" });
    setBusinesses(["サークル間マッチング事業","診断コンテンツ事業","SNSメディア事業"].join("\n"));
    setProjects(["TikTok運用プロジェクト","DM送信プロジェクト","診断設計プロジェクト","サークルマッチング検証プロジェクト"].join("\n"));
  }

  var G = "var(--accent,#22C55E)";

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:"var(--title-sz,24px)", fontWeight:800, color:"#1F2937", marginBottom:4 }}>
          {((window.APP_SETTINGS||{}).navLabels||{}).settings || "設定"}
        </h1>
        <p style={{ fontSize:"var(--font-sz,14px)", color:"#6B7280" }}>アプリ名・タブ名・セクション見出し・事業名をカスタマイズできます。</p>
      </div>

      {saved && (
        <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"12px 16px", marginBottom:16, color:"#16A34A", fontWeight:600, fontSize:14 }}>
          ✅ 設定を保存しました！
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:16, alignItems:"start" }}>
        <div>
          <SettingsSection title="🌱 アプリ名">
            <SettingsField label="アプリのタイトル（ヘッダーに表示）" value={title} onChange={setTitle} placeholder="SEED" />
          </SettingsSection>

          <SettingsSection title="🗂️ ナビゲーションのラベル">
            {[["ダッシュボード","dashboard"],["自分のタスク","mytasks"],["カレンダー","calendar"],["タスク作成","create"],["設定","settings"]].map(function(pair) {
              return (
                <SettingsField key={pair[1]} label={pair[0]}
                  value={navLabels[pair[1]] || ""}
                  onChange={function(v){ setNavLabels(function(p){ var n=Object.assign({},p); n[pair[1]]=v; return n; }); }}
                  placeholder={pair[0]} />
              );
            })}
          </SettingsSection>
        </div>

        <div>
          <SettingsSection title="📊 ダッシュボードのセクション名">
            {[["今週のKPI","kpi"],["次にやるべきタスク","nextTasks"],["メンバー別進捗","memberProgress"],["プロジェクト別進捗","projectProgress"]].map(function(pair) {
              return (
                <SettingsField key={pair[1]} label={pair[0]}
                  value={sections[pair[1]] || ""}
                  onChange={function(v){ setSections(function(p){ var n=Object.assign({},p); n[pair[1]]=v; return n; }); }}
                  placeholder={pair[0]} />
              );
            })}
          </SettingsSection>

          <SettingsSection title="🏢 事業・プロジェクト名">
            <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:8, padding:"10px 12px", marginBottom:14, fontSize:12, color:"#92400E" }}>
              💡 1行に1つずつ入力。タスク作成・ワークフローに反映されます。
            </div>
            <SettingsField label="事業名（1行1件）" value={businesses} onChange={setBusinesses} multiline
              placeholder={"サークル間マッチング事業\n診断コンテンツ事業\nSNSメディア事業"} />
            <SettingsField label="プロジェクト名（1行1件）" value={projects} onChange={setProjects} multiline
              placeholder={"TikTok運用プロジェクト\nDM送信プロジェクト"} />
          </SettingsSection>
        </div>
      </div>

      <div style={{ display:"flex", gap:12, marginTop:4 }}>
        <button onClick={resetAll} style={{ padding:"13px 20px", borderRadius:12, border:"1.5px solid #E5E7EB", background:"white", color:"#6B7280", fontSize:14, fontWeight:600, cursor:"pointer" }}>
          🔄 デフォルトに戻す
        </button>
        <button onClick={handleSave} style={{ flex:1, padding:"13px", borderRadius:12, border:"none", background:G, color:"white", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(34,197,94,0.35)" }}>
          💾 設定を保存する
        </button>
      </div>
    </div>
  );
}

window.SettingsPage = SettingsPage;
