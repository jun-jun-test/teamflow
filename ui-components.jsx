// ===== STATUS BADGE =====
function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg:"#F3F4F6", text:"#6B7280", border:"#E5E7EB" };
  return (
    <span style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}`, borderRadius:"9999px", padding:"2px 10px", fontSize:"12px", fontWeight:600, whiteSpace:"nowrap", display:"inline-block" }}>
      {status}
    </span>
  );
}

// ===== PRIORITY BADGE =====
function PriorityBadge({ priority }) {
  const c = PRIORITY_COLORS[priority] || { bg:"#F3F4F6", text:"#6B7280" };
  return (
    <span style={{ background:c.bg, color:c.text, borderRadius:"9999px", padding:"2px 8px", fontSize:"11px", fontWeight:700, whiteSpace:"nowrap", display:"inline-block" }}>
      {priority}
    </span>
  );
}

// ===== PROGRESS BAR =====
function ProgressBar({ value, height = 6, color }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div style={{ background:"#E5E7EB", borderRadius:"9999px", height, overflow:"hidden", width:"100%" }}>
      <div style={{ background: color || "var(--accent, #06C755)", width:`${pct}%`, height:"100%", borderRadius:"9999px", transition:"width 0.4s ease" }}></div>
    </div>
  );
}

// ===== FACE LIST (⑤ 顔パターンの配列) =====
var FACE_LIST = [
  React.createElement('g', {key:"f0"},
    React.createElement('ellipse', {cx:"20",cy:"13",rx:"9",ry:"5",fill:"#2D1B0E"}),
    React.createElement('circle',  {cx:"20",cy:"20",r:"10", fill:"#FBBF7A"}),
    React.createElement('circle',  {cx:"16",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('circle',  {cx:"24",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('path',    {d:"M16 23 Q20 26 24 23",stroke:"#1F2937",strokeWidth:"1.2",fill:"none",strokeLinecap:"round"}),
    React.createElement('rect',    {x:"11",y:"10",width:"18",height:"8",rx:"4",fill:"#2D1B0E"})
  ),
  React.createElement('g', {key:"f1"},
    React.createElement('circle', {cx:"20",cy:"20",r:"10",fill:"#FBBF7A"}),
    React.createElement('path',   {d:"M11 18 Q12 8 20 9 Q28 8 29 18",fill:"#6B3A1F"}),
    React.createElement('path',   {d:"M11 20 Q10 26 13 28",stroke:"#6B3A1F",strokeWidth:"3",fill:"none"}),
    React.createElement('path',   {d:"M29 20 Q30 26 27 28",stroke:"#6B3A1F",strokeWidth:"3",fill:"none"}),
    React.createElement('circle', {cx:"16.5",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('circle', {cx:"23.5",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('path',   {d:"M16 23 Q20 27 24 23",stroke:"#E8636A",strokeWidth:"1.2",fill:"none",strokeLinecap:"round"})
  ),
  React.createElement('g', {key:"f2"},
    React.createElement('circle', {cx:"20",cy:"20",r:"10",fill:"#FBBF7A"}),
    React.createElement('rect',   {x:"12",y:"10",width:"16",height:"7",rx:"3",fill:"#3D2B1F"}),
    React.createElement('circle', {cx:"16.5",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('circle', {cx:"23.5",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('path',   {d:"M16 23 Q20 26 24 23",stroke:"#1F2937",strokeWidth:"1.2",fill:"none",strokeLinecap:"round"})
  ),
  React.createElement('g', {key:"f3"},
    React.createElement('circle', {cx:"20",cy:"20",r:"10",fill:"#FBBF7A"}),
    React.createElement('path',   {d:"M11 16 Q13 8 20 9 Q27 8 29 16",fill:"#1A1009"}),
    React.createElement('circle', {cx:"16.5",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('circle', {cx:"23.5",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('path',   {d:"M16 23 Q20 26 24 23",stroke:"#1F2937",strokeWidth:"1.2",fill:"none",strokeLinecap:"round"})
  ),
  React.createElement('g', {key:"f4"},
    React.createElement('circle', {cx:"20",cy:"20",r:"10",fill:"#FBBF7A"}),
    React.createElement('rect',   {x:"11",y:"10",width:"18",height:"6",rx:"3",fill:"#2D1B0E"}),
    React.createElement('rect',   {x:"13",y:"17",width:"6",height:"4",rx:"2",fill:"none",stroke:"#374151",strokeWidth:"1.2"}),
    React.createElement('rect',   {x:"21",y:"17",width:"6",height:"4",rx:"2",fill:"none",stroke:"#374151",strokeWidth:"1.2"}),
    React.createElement('line',   {x1:"19",y1:"19",x2:"21",y2:"19",stroke:"#374151",strokeWidth:"1"}),
    React.createElement('circle', {cx:"16",cy:"19",r:"1",fill:"#1F2937"}),
    React.createElement('circle', {cx:"24",cy:"19",r:"1",fill:"#1F2937"}),
    React.createElement('path',   {d:"M16 24 Q20 27 24 24",stroke:"#1F2937",strokeWidth:"1.2",fill:"none",strokeLinecap:"round"})
  ),
  React.createElement('g', {key:"f5"},
    React.createElement('circle', {cx:"20",cy:"20",r:"10",fill:"#FBBF7A"}),
    React.createElement('path',   {d:"M11 17 Q12 8 20 8 Q28 8 29 17",fill:"#4B3F2F"}),
    React.createElement('path',   {d:"M11 17 Q10 22 12 25",stroke:"#4B3F2F",strokeWidth:"2.5",fill:"none"}),
    React.createElement('circle', {cx:"16.5",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('circle', {cx:"23.5",cy:"19",r:"1.5",fill:"#1F2937"}),
    React.createElement('path',   {d:"M16 23 Q20 26 24 23",stroke:"#1F2937",strokeWidth:"1.2",fill:"none",strokeLinecap:"round"})
  ),
];

// ===== MEMBER AVATAR =====
function MemberAvatar({ name, size = 36 }) {
  const c = MEMBER_COLORS[name] || { avatarBg:"#E5E7EB" };
  var faceIdx = (window.MEMBER_PREFS && window.MEMBER_PREFS[name] && window.MEMBER_PREFS[name].face != null)
    ? Number(window.MEMBER_PREFS[name].face)
    : (MEMBERS ? Math.max(0, MEMBERS.indexOf(name)) : 0);
  const face = FACE_LIST[faceIdx] || FACE_LIST[0];
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ borderRadius:"50%", flexShrink:0 }}>
      <circle cx="20" cy="20" r="20" fill={c.avatarBg || "#E5E7EB"} />
      {face}
    </svg>
  );
}

// ===== PROFILE MODAL (⑤) =====
function ProfileModal({ member, currentPrefs, onSave, onClose }) {
  const prefs = currentPrefs || {};
  const colorOpts = window.AVATAR_COLOR_OPTIONS || {};
  const defColorKey = (window.DEFAULT_MEMBER_COLOR_KEYS || {})[member] || 'green';
  const defFaceIdx  = MEMBERS ? Math.max(0, MEMBERS.indexOf(member)) : 0;

  const [selColor, setSelColor] = React.useState(prefs.color || defColorKey);
  const [selFace,  setSelFace]  = React.useState(prefs.face  != null ? Number(prefs.face) : defFaceIdx);

  const prevBg   = (colorOpts[selColor] || {}).avatarBg || "#86EFAC";
  const prevRing = (colorOpts[selColor] || {}).ring     || "#4CAF50";
  const prevBgLight = (colorOpts[selColor] || {}).bg    || "#EAF7EA";

  const COLOR_LABELS = { green:"みどり",pink:"ピンク",blue:"あお",yellow:"きいろ",purple:"むらさき",teal:"ティール",orange:"オレンジ",red:"あか" };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:16 }} onClick={onClose}>
      <div style={{ background:"white",borderRadius:20,padding:"28px",maxWidth:420,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize:17,fontWeight:800,color:"#1F2937",marginBottom:4 }}>🎨 プロフィール設定</h3>
        <p style={{ fontSize:13,color:"#9CA3AF",marginBottom:20 }}>{member} のアイコンをカスタマイズ</p>

        <label style={{ fontSize:13,fontWeight:700,color:"#374151",display:"block",marginBottom:10 }}>アイコンの色</label>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
          {Object.entries(colorOpts).map(([key, c]) => (
            <button key={key} onClick={() => setSelColor(key)} title={COLOR_LABELS[key]||key}
              style={{ width:36,height:36,borderRadius:"50%",background:c.avatarBg,border:selColor===key?`3px solid ${c.ring}`:"3px solid #E5E7EB",cursor:"pointer",boxShadow:selColor===key?`0 0 0 2px ${c.ring}55`:"none",transition:"all 0.15s",outline:"none" }} />
          ))}
        </div>

        <label style={{ fontSize:13,fontWeight:700,color:"#374151",display:"block",marginBottom:10 }}>アイコンの顔</label>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
          {FACE_LIST.map(function(_, i) {
            var isSel = selFace === i;
            return (
              <button key={i} onClick={() => setSelFace(i)}
                style={{ padding:4,borderRadius:12,border:isSel?`2.5px solid ${prevRing}`:"2.5px solid #E5E7EB",background:isSel?prevBgLight:"white",cursor:"pointer",outline:"none" }}>
                <svg width="44" height="44" viewBox="0 0 40 40" style={{ borderRadius:"50%",display:"block" }}>
                  <circle cx="20" cy="20" r="20" fill={prevBg} />
                  {FACE_LIST[i]}
                </svg>
              </button>
            );
          })}
        </div>

        {/* Preview */}
        <div style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:"#F8FAF8",borderRadius:12,marginBottom:20 }}>
          <svg width="52" height="52" viewBox="0 0 40 40" style={{ borderRadius:"50%",flexShrink:0 }}>
            <circle cx="20" cy="20" r="20" fill={prevBg} />
            {FACE_LIST[selFace]}
          </svg>
          <div>
            <div style={{ fontSize:15,fontWeight:700,color:"#1F2937" }}>{member}</div>
            <div style={{ fontSize:12,color:"#9CA3AF",marginTop:2 }}>{COLOR_LABELS[selColor]||selColor} · 顔 {selFace+1}</div>
          </div>
        </div>

        <div style={{ display:"flex",gap:10 }}>
          <button onClick={onClose} style={{ flex:1,padding:12,borderRadius:10,border:"1.5px solid #E5E7EB",background:"white",color:"#6B7280",fontSize:14,fontWeight:600,cursor:"pointer" }}>キャンセル</button>
          <button onClick={() => { onSave(member, { color:selColor, face:selFace }); onClose(); }} style={{ flex:2,padding:12,borderRadius:10,border:"none",background:"var(--accent,#06C755)",color:"white",fontSize:14,fontWeight:700,cursor:"pointer" }}>保存する</button>
        </div>
      </div>
    </div>
  );
}

// ===== SPARKLINE =====
function Sparkline({ color, width = 80, height = 32 }) {
  color = color || "var(--accent, #06C755)";
  const pts = [4,12,8,18,10,14,20,12,22,8,28,16,32,10,40,18,50,12,60,20,70,14,76,18];
  const d = pts.reduce((s,v,i) => i%2===0 ? s+(i===0?`M${v}`:` L${v}`) : s+`,${height-v*(height/24)}`,"");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow:"visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-2]} cy={height-pts[pts.length-1]*(height/24)} r="3" fill={color} />
    </svg>
  );
}

// ===== SIDEBAR DECORATION =====
function SidebarDeco() {
  return (
    <svg viewBox="0 0 160 220" width="160" height="220" style={{ display:"block" }}>
      <ellipse cx="80" cy="200" rx="28" ry="10" fill="#D1FAE5" />
      <rect x="62" y="175" width="36" height="28" rx="4" fill="#6EE7B7" />
      <rect x="66" y="172" width="28" height="8"  rx="3" fill="#34D399" />
      <path d="M80 172 Q72 155 60 148" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M80 172 Q88 155 100 148" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M80 170 Q80 150 80 135" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="56"  cy="144" rx="14" ry="10" fill="#86EFAC" transform="rotate(-30 56 144)" />
      <ellipse cx="104" cy="144" rx="14" ry="10" fill="#86EFAC" transform="rotate(30 104 144)" />
      <ellipse cx="80"  cy="128" rx="14" ry="10" fill="#4ADE80" />
      <rect x="30" y="60" width="100" height="68" rx="10" fill="white" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }} />
      <circle cx="48" cy="82"  r="6" fill="#BBF7D0" />
      <path d="M45 82 L47 84 L52 79" stroke="#4CAF50" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="58" y="79"  width="54" height="6" rx="3" fill="#E5E7EB" />
      <circle cx="48" cy="96"  r="6" fill="#BBF7D0" />
      <path d="M45 96 L47 98 L52 93" stroke="#4CAF50" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="58" y="93"  width="40" height="6" rx="3" fill="#E5E7EB" />
      <circle cx="48" cy="110" r="6" fill="#E5E7EB" />
      <rect x="58" y="107" width="48" height="6" rx="3" fill="#E5E7EB" />
      <rect x="18" y="10" width="70" height="42" rx="10" fill="#4CAF50" />
      <path d="M28 52 L24 62 L36 52" fill="#4CAF50" />
      <circle cx="38" cy="31" r="5" fill="white" opacity="0.9" />
      <circle cx="53" cy="31" r="5" fill="white" opacity="0.9" />
      <circle cx="68" cy="31" r="5" fill="white" opacity="0.9" />
      <text x="108" y="30" fontSize="18">+</text>
    </svg>
  );
}

// ===== METRIC CARD =====
function MetricCard({ title, value, unit, sub, subIcon, subColor, icon, iconColor, sparkColor }) {
  return (
    <div style={{ background:"white",borderRadius:16,padding:"20px 24px",boxShadow:"0 1px 8px rgba(0,0,0,0.07)",flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:4 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:13,color:"#6B7280",marginBottom:4 }}>{title}</div>
          <div style={{ fontSize:36,fontWeight:800,color:iconColor||"#4CAF50",lineHeight:1 }}>
            {value}<span style={{ fontSize:18,fontWeight:700 }}>{unit}</span>
          </div>
        </div>
        <div style={{ width:48,height:48,borderRadius:12,background:iconColor?`${iconColor}18`:"var(--accent-light,#E9FBEF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>
          {icon}
        </div>
      </div>
      {sparkColor && <div style={{ marginTop:4 }}><Sparkline color={sparkColor} /></div>}
      <div style={{ fontSize:12,color:subColor||"#6B7280",marginTop:4,display:"flex",alignItems:"center",gap:4 }}>
        {subIcon && <span>{subIcon}</span>}
        {sub}
      </div>
    </div>
  );
}

Object.assign(window, {
  StatusBadge, PriorityBadge, ProgressBar, MemberAvatar, ProfileModal,
  Sparkline, SidebarDeco, MetricCard, FACE_LIST
});
