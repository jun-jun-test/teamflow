// Tweaks configuration for チーム進捗ツール
// Three expressive controls that reshape the overall feel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentTheme": "green",
  "density": "standard",
  "cardStyle": "soft"
}/*EDITMODE-END*/;

// ── Accent themes ──────────────────────────────────────────────
const ACCENT_THEMES = {
  green:  { accent:"#06C755", accentDark:"#04A846", accentLight:"#E9FBEF", accentRing:"#06C75540", accentText:"#065F46", logoFill:"#06C755" },
  blue:   { accent:"#3B82F6", accentDark:"#2563EB", accentLight:"#EFF6FF", accentRing:"#3B82F655", accentText:"#1E40AF", logoFill:"#3B82F6" },
  violet: { accent:"#8B5CF6", accentDark:"#7C3AED", accentLight:"#EDE9FE", accentRing:"#8B5CF655", accentText:"#5B21B6", logoFill:"#8B5CF6" },
  amber:  { accent:"#F59E0B", accentDark:"#D97706", accentLight:"#FFFBEB", accentRing:"#F59E0B55", accentText:"#92400E", logoFill:"#F59E0B" },
};

// ── Density configs ────────────────────────────────────────────
const DENSITY_CONFIGS = {
  compact:  { cardPad:"14px 18px", gap:"10px", headerH:"56px", sidebarPad:"12px 10px", mainPad:"20px 24px", fontSize:"13px", titleSize:"21px" },
  standard: { cardPad:"20px 24px", gap:"16px", headerH:"64px", sidebarPad:"16px 12px", mainPad:"28px 32px", fontSize:"14px", titleSize:"24px" },
  relaxed:  { cardPad:"28px 32px", gap:"22px", headerH:"72px", sidebarPad:"20px 16px", mainPad:"36px 40px", fontSize:"15px", titleSize:"28px" },
};

// ── Card styles ────────────────────────────────────────────────
const CARD_STYLES = {
  flat:  { shadow:"0 1px 2px rgba(0,0,0,0.06)", radius:"10px", border:"1px solid #E5E7EB", bg:"#FFFFFF", appBg:"#F4F6F4" },
  soft:  { shadow:"0 2px 12px rgba(0,0,0,0.08)", radius:"16px", border:"none",              bg:"#FFFFFF", appBg:"#F8FAF8" },
  bold:  { shadow:"0 4px 0px rgba(0,0,0,0.12)",  radius:"14px", border:"2px solid #1F2937", bg:"#FFFFFF", appBg:"#F0F0F0" },
};

function applyTheme(tweaks) {
  const theme = ACCENT_THEMES[tweaks.accentTheme] || ACCENT_THEMES.green;
  const density = DENSITY_CONFIGS[tweaks.density] || DENSITY_CONFIGS.standard;
  const card = CARD_STYLES[tweaks.cardStyle] || CARD_STYLES.soft;
  const root = document.documentElement;
  // Accent
  root.style.setProperty("--accent",       theme.accent);
  root.style.setProperty("--accent-dark",  theme.accentDark);
  root.style.setProperty("--accent-light", theme.accentLight);
  root.style.setProperty("--accent-ring",  theme.accentRing);
  root.style.setProperty("--accent-text",  theme.accentText);
  root.style.setProperty("--logo-fill",    theme.logoFill);
  // Density
  root.style.setProperty("--card-pad",     density.cardPad);
  root.style.setProperty("--gap",          density.gap);
  root.style.setProperty("--header-h",     density.headerH);
  root.style.setProperty("--sidebar-pad",  density.sidebarPad);
  root.style.setProperty("--main-pad",     density.mainPad);
  root.style.setProperty("--font-sz",      density.fontSize);
  root.style.setProperty("--title-sz",     density.titleSize);
  // Card style
  root.style.setProperty("--card-shadow",  card.shadow);
  root.style.setProperty("--card-radius",  card.radius);
  root.style.setProperty("--card-border",  card.border);
  root.style.setProperty("--card-bg",      card.bg);
  root.style.setProperty("--app-bg",       card.appBg);
}

function AppTweaks() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    applyTheme(tweaks);
    saveToStorage("kaiwai_tweaks", tweaks);
  }, [tweaks]);

  const themeOptions = [
    { value:"green",  label:"みどり", color:"#4CAF50" },
    { value:"blue",   label:"あお",   color:"#3B82F6" },
    { value:"violet", label:"むらさき",color:"#8B5CF6" },
    { value:"amber",  label:"オレンジ",color:"#F59E0B" },
  ];

  return (
    <TweaksPanel>
      {/* Accent Color */}
      <TweakSection label="アクセントカラー" hint="全体のブランドカラーを変更します">
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {themeOptions.map(opt => (
            <button key={opt.value} onClick={() => setTweak("accentTheme", opt.value)}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"8px 10px", borderRadius:10, border: tweaks.accentTheme === opt.value ? `2px solid ${opt.color}` : "2px solid #E5E7EB", background: tweaks.accentTheme === opt.value ? opt.color + "18" : "white", cursor:"pointer", minWidth:56, transition:"all 0.15s" }}>
              <span style={{ width:24, height:24, borderRadius:"50%", background:opt.color, display:"block", boxShadow: tweaks.accentTheme === opt.value ? `0 0 0 3px ${opt.color}44` : "none", transition:"box-shadow 0.15s" }}></span>
              <span style={{ fontSize:11, fontWeight: tweaks.accentTheme === opt.value ? 700 : 500, color: tweaks.accentTheme === opt.value ? opt.color : "#6B7280" }}>{opt.label}</span>
            </button>
          ))}
        </div>
      </TweakSection>

      {/* Density */}
      <TweakSection label="UI密度" hint="余白・フォントサイズ・カード間隔を変えます">
        <TweakRadio id="density" options={[
          { value:"compact",  label:"コンパクト" },
          { value:"standard", label:"標準" },
          { value:"relaxed",  label:"ゆったり" },
        ]} value={tweaks.density} onChange={v => setTweak("density", v)} />
      </TweakSection>

      {/* Card Style */}
      <TweakSection label="カードスタイル" hint="影・角丸・ボーダーでカードの質感を変えます">
        <div style={{ display:"flex", gap:8 }}>
          {[
            { value:"flat", label:"フラット", preview: { shadow:"0 1px 2px rgba(0,0,0,0.08)", border:"1px solid #E5E7EB", radius:8 } },
            { value:"soft", label:"ソフト",   preview: { shadow:"0 4px 14px rgba(0,0,0,0.10)", border:"none", radius:14 } },
            { value:"bold", label:"ボールド", preview: { shadow:"0 4px 0 rgba(0,0,0,0.15)", border:"2px solid #1F2937", radius:12 } },
          ].map(opt => (
            <button key={opt.value} onClick={() => setTweak("cardStyle", opt.value)}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"10px 8px", borderRadius:10, border: tweaks.cardStyle === opt.value ? "2px solid var(--accent, #4CAF50)" : "2px solid #E5E7EB", background: tweaks.cardStyle === opt.value ? "var(--accent-light, #EAF7EA)" : "white", cursor:"pointer", transition:"all 0.15s" }}>
              <div style={{ width:"100%", height:28, borderRadius: opt.preview.radius, boxShadow: opt.preview.shadow, border: opt.preview.border || "none", background:"white" }}></div>
              <span style={{ fontSize:11, fontWeight: tweaks.cardStyle === opt.value ? 700 : 500, color: tweaks.cardStyle === opt.value ? "var(--accent, #4CAF50)" : "#6B7280" }}>{opt.label}</span>
            </button>
          ))}
        </div>
      </TweakSection>
    </TweaksPanel>
  );
}

window.AppTweaks = AppTweaks;
window.applyTheme = applyTheme;
window.TWEAK_DEFAULTS_INITIAL = TWEAK_DEFAULTS;
