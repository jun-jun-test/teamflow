// ===== HEADER =====
function Header({ currentUser, onChangeUser, onOpenProfile }) {
  const [open, setOpen] = React.useState(false);
  const c = MEMBER_COLORS[currentUser] || {};
  return (
    <header style={{ position:"fixed", top:0, left:0, right:0, height:64, background:"white", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", zIndex:100, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="var(--logo-fill, #4CAF50)" />
          <circle cx="13" cy="16" r="2.5" fill="white" />
          <circle cx="23" cy="16" r="2.5" fill="white" />
          <path d="M12 22 Q18 27 24 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <span style={{ fontWeight:700, fontSize:16, color:"#1F2937", letterSpacing:"-0.3px" }}>チーム進捗ツール</span>
      </div>
      {/* User */}
      {currentUser && (
        <div style={{ position:"relative" }}>
          <button onClick={() => setOpen(!open)} style={{ display:"flex", alignItems:"center", gap:8, background:"#F8FAF8", border:"1px solid #E5E7EB", borderRadius:32, padding:"6px 14px 6px 8px", cursor:"pointer", fontSize:14, fontWeight:600, color:"#1F2937" }}>
            <MemberAvatar name={currentUser} size={28} />
            {currentUser}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {open && (
            <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", background:"white", border:"1px solid #E5E7EB", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", minWidth:160, zIndex:200 }}>
              <div style={{ padding:"8px 12px 4px", fontSize:11, color:"#9CA3AF", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>ユーザー変更</div>
              {MEMBERS.map(m => (
                <button key={m} onClick={() => { onChangeUser(m); setOpen(false); }} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 12px", background: m === currentUser ? "#F0FDF4" : "transparent", border:"none", cursor:"pointer", fontSize:13, color: m === currentUser ? "#16A34A" : "#1F2937", fontWeight: m === currentUser ? 600 : 400 }}>
                  <MemberAvatar name={m} size={22} />
                  {m}
                  {m === currentUser && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" style={{ marginLeft:"auto" }}><path d="M20 6L9 17l-5-5"/></svg>}
                </button>
              ))}
              <div style={{ margin:"4px 8px", borderTop:"1px solid #F3F4F6" }} />
              <button onClick={() => { setOpen(false); onOpenProfile && onOpenProfile(); }} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 12px", background:"transparent", border:"none", cursor:"pointer", fontSize:13, color:"#6B7280" }}>
                🎨 プロフィール設定
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// ===== SIDEBAR =====
const NAV_ITEMS = [
  { key:"dashboard", label:"ダッシュボード", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { key:"mytasks",   label:"自分のタスク",   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { key:"workflow",  label:"ワークフロー",   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/></svg> },
  { key:"create",    label:"タスク作成",     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg> },
];

function Sidebar({ page, setPage }) {
  return (
    <nav style={{ position:"fixed", left:0, top:64, bottom:0, width:200, background:"white", borderRight:"1px solid #E5E7EB", display:"flex", flexDirection:"column", zIndex:90, padding:"16px 12px" }}>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {NAV_ITEMS.map(item => {
          const active = page === item.key;
          return (
            <button key={item.key} onClick={() => setPage(item.key)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, border:"none", cursor:"pointer", background: active ? "var(--accent-light, #EAF7EA)" : "transparent", color: active ? "var(--accent, #4CAF50)" : "#6B7280", fontWeight: active ? 700 : 500, fontSize:14, textAlign:"left", transition:"all 0.15s" }}>
              <span style={{ color: active ? "var(--accent, #4CAF50)" : "#9CA3AF" }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>
      {/* Decoration */}
      <div style={{ marginTop:"auto", display:"flex", justifyContent:"center", paddingBottom:8, opacity:0.85 }}>
        <SidebarDeco />
      </div>
    </nav>
  );
}

// ===== BOTTOM NAV (mobile) =====
function BottomNav({ page, setPage }) {
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, height:60, background:"white", borderTop:"1px solid #E5E7EB", display:"flex", zIndex:100 }}>
      {NAV_ITEMS.map(item => {
        const active = page === item.key;
        return (
          <button key={item.key} onClick={() => setPage(item.key)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, border:"none", background:"transparent", cursor:"pointer", color: active ? "var(--accent, #06C755)" : "#9CA3AF", fontSize:10, fontWeight: active ? 700 : 500 }}>
            <span style={{ color: active ? "var(--accent, #06C755)" : "#9CA3AF" }}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

Object.assign(window, { Header, Sidebar, BottomNav, NAV_ITEMS });
