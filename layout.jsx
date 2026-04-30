// ===== NAV ICONS =====
const NAV_ICONS = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  mytasks:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  workflow:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/></svg>,
  create:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>,
  settings:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  schedule:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

function getNavItems() {
  var labels = (window.APP_SETTINGS && window.APP_SETTINGS.navLabels) || {};
  return [
    { key:"dashboard", label:labels.dashboard||"ダッシュボード", icon:NAV_ICONS.dashboard },
    { key:"mytasks",   label:labels.mytasks  ||"自分のタスク",   icon:NAV_ICONS.mytasks   },
    { key:"workflow",  label:labels.workflow ||"ワークフロー",   icon:NAV_ICONS.workflow  },
    { key:"create",    label:labels.create   ||"タスク作成",     icon:NAV_ICONS.create    },
    { key:"schedule",  label:"日程調整",                         icon:NAV_ICONS.schedule  },
    { key:"settings",  label:labels.settings ||"設定",           icon:NAV_ICONS.settings  },
  ];
}

// ===== NOTIFICATION BELL =====
function NotificationBell({ notifications, currentUser, onMarkAllRead }) {
  var [open, setOpen] = React.useState(false);
  var ref = React.useRef(null);

  var unread = (notifications || []).filter(function(n) {
    return !n.readBy || !n.readBy.includes(currentUser);
  }).length;

  // Close on outside click
  React.useEffect(function() {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return function() { document.removeEventListener('mousedown', handler); };
  }, []);

  function handleOpen() {
    setOpen(function(v) { return !v; });
    if (!open && unread > 0) onMarkAllRead();
  }

  function fmtTime(iso) {
    var d = new Date(iso);
    var now = new Date();
    var diffMs = now - d;
    var diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1)  return 'たった今';
    if (diffMin < 60) return diffMin + '分前';
    var diffH = Math.floor(diffMin / 60);
    if (diffH < 24)   return diffH + '時間前';
    return Math.floor(diffH / 24) + '日前';
  }

  var typeColor = { mtg_confirmed:'#10B981', mtg_cancelled:'#EF4444', monthly_reminder:'#3B82F6' };

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={handleOpen}
        title="お知らせ"
        style={{ position:'relative', background:'#F8FAF8', border:'1px solid #E5E7EB', borderRadius:10,
                 width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center',
                 cursor:'pointer', flexShrink:0 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{ position:'absolute', top:-4, right:-4, background:'#EF4444', color:'white',
                          borderRadius:'9999px', minWidth:18, height:18, display:'flex', alignItems:'center',
                          justifyContent:'center', fontSize:10, fontWeight:700, padding:'0 4px',
                          border:'2px solid white' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', background:'white',
                      border:'1px solid #E5E7EB', borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,0.13)',
                      width:320, maxHeight:400, overflowY:'auto', zIndex:300 }}>
          <div style={{ padding:'12px 16px 8px', fontSize:13, fontWeight:700, color:'#1F2937',
                        borderBottom:'1px solid #F3F4F6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>お知らせ</span>
            {notifications && notifications.length > 0 && (
              <span style={{ fontSize:11, color:'#9CA3AF' }}>最新{Math.min(notifications.length,20)}件</span>
            )}
          </div>

          {(!notifications || notifications.length === 0) ? (
            <div style={{ padding:'24px 16px', textAlign:'center', color:'#9CA3AF', fontSize:13 }}>
              お知らせはありません
            </div>
          ) : (
            (notifications || []).slice(0, 20).map(function(n) {
              var isRead  = n.readBy && n.readBy.includes(currentUser);
              var dotColor = typeColor[n.type] || '#9CA3AF';
              return (
                <div key={n.id} style={{ padding:'10px 16px', borderBottom:'1px solid #F9FAFB',
                                          background: isRead ? 'white' : '#F0FDF4',
                                          display:'flex', gap:10, alignItems:'flex-start' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:dotColor,
                                marginTop:4, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, color:'#1F2937', lineHeight:1.5 }}>{n.message}</div>
                    <div style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>{fmtTime(n.createdAt)}</div>
                  </div>
                  {!isRead && (
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#22C55E', flexShrink:0, marginTop:6 }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ===== HEADER =====
function Header({ currentUser, onChangeUser, onOpenProfile, notifications, onMarkAllRead, scheduleIncomplete, onGoSchedule }) {
  const [open, setOpen] = React.useState(false);
  const appTitle = (window.APP_SETTINGS && window.APP_SETTINGS.appTitle) || "チーム進捗ツール";
  return (
    <header style={{ position:"fixed", top:0, left:0, right:0, height:64, background:"white", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", zIndex:100, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <img src="logo.png" alt="SEED" style={{ height:40, width:40, objectFit:"contain", borderRadius:10 }} />
        <div style={{ display:"flex", flexDirection:"column", lineHeight:1.1 }}>
          <span style={{ fontWeight:800, fontSize:18, color:"#15803D", letterSpacing:"0.05em" }}>{appTitle}</span>
          <span style={{ fontSize:9, color:"#86EFAC", fontWeight:600, letterSpacing:"0.15em" }}>TEAM PROGRESS</span>
        </div>
      </div>
      {currentUser && (
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Notification Bell */}
          <NotificationBell
            notifications={notifications || []}
            currentUser={currentUser}
            onMarkAllRead={onMarkAllRead || function(){}}
          />

          {/* User dropdown with blinking avatar when schedule incomplete */}
          <div style={{ position:"relative" }}>
            <button
              onClick={() => setOpen(!open)}
              title={scheduleIncomplete ? "MTG日程を入力してください" : ""}
              style={{ display:"flex", alignItems:"center", gap:8, background:"#F8FAF8", border:"1px solid #E5E7EB", borderRadius:32, padding:"6px 14px 6px 8px", cursor:"pointer", fontSize:14, fontWeight:600, color:"#1F2937" }}
            >
              {/* Avatar wrapper with optional red pulse */}
              <div style={{ position:"relative", display:"inline-flex" }}>
                {scheduleIncomplete && (
                  <div style={{ position:"absolute", inset:-3, borderRadius:"50%", background:"rgba(239,68,68,0.25)", animation:"schedulePulse 1.2s ease-in-out infinite", zIndex:0 }} />
                )}
                <div style={{ position:"relative", zIndex:1 }}>
                  <MemberAvatar name={currentUser} size={28} />
                </div>
                {scheduleIncomplete && (
                  <div style={{ position:"absolute", bottom:-1, right:-1, width:10, height:10, borderRadius:"50%", background:"#EF4444", border:"2px solid white", zIndex:2 }} />
                )}
              </div>
              {currentUser}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {open && (
              <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", background:"white", border:"1px solid #E5E7EB", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", minWidth:180, zIndex:200 }}>
                <div style={{ padding:"8px 12px 4px", fontSize:11, color:"#9CA3AF", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>ユーザー変更</div>
                {MEMBERS.map(m => (
                  <button key={m} onClick={() => { onChangeUser(m); setOpen(false); }} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 12px", background:m===currentUser?"#F0FDF4":"transparent", border:"none", cursor:"pointer", fontSize:13, color:m===currentUser?"#16A34A":"#1F2937", fontWeight:m===currentUser?600:400 }}>
                    <MemberAvatar name={m} size={22} />
                    {m}
                    {m===currentUser && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" style={{ marginLeft:"auto" }}><path d="M20 6L9 17l-5-5"/></svg>}
                  </button>
                ))}
                <div style={{ margin:"4px 8px", borderTop:"1px solid #F3F4F6" }} />
                {scheduleIncomplete && (
                  <button onClick={() => { setOpen(false); onGoSchedule && onGoSchedule(); }} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 12px", background:"#FEF2F2", border:"none", cursor:"pointer", fontSize:13, color:"#DC2626", fontWeight:600 }}>
                    📅 日程を入力する
                  </button>
                )}
                <button onClick={() => { setOpen(false); onOpenProfile && onOpenProfile(); }} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 12px", background:"transparent", border:"none", cursor:"pointer", fontSize:13, color:"#6B7280" }}>
                  🎨 プロフィール設定
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ===== SIDEBAR =====
function Sidebar({ page, setPage }) {
  const navItems = getNavItems();
  return (
    <nav style={{ position:"fixed", left:0, top:64, bottom:0, width:200, background:"white", borderRight:"1px solid #E5E7EB", display:"flex", flexDirection:"column", zIndex:90, padding:"16px 12px" }}>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {navItems.map(item => {
          const active = page === item.key;
          return (
            <button key={item.key} onClick={() => setPage(item.key)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, border:"none", cursor:"pointer", background:active?"var(--accent-light,#EAF7EA)":"transparent", color:active?"var(--accent,#4CAF50)":"#6B7280", fontWeight:active?700:500, fontSize:14, textAlign:"left", transition:"all 0.15s" }}>
              <span style={{ color:active?"var(--accent,#4CAF50)":"#9CA3AF" }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop:"auto", display:"flex", justifyContent:"center", paddingBottom:8, opacity:0.85 }}>
        <SidebarDeco />
      </div>
    </nav>
  );
}

// ===== BOTTOM NAV (mobile) =====
function BottomNav({ page, setPage }) {
  const navItems = getNavItems().slice(0, 5);
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, height:60, background:"white", borderTop:"1px solid #E5E7EB", display:"flex", zIndex:100 }}>
      {navItems.map(item => {
        const active = page === item.key;
        return (
          <button key={item.key} onClick={() => setPage(item.key)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, border:"none", background:"transparent", cursor:"pointer", color:active?"var(--accent,#06C755)":"#9CA3AF", fontSize:10, fontWeight:active?700:500 }}>
            <span style={{ color:active?"var(--accent,#06C755)":"#9CA3AF" }}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

const NAV_ITEMS = getNavItems();
Object.assign(window, { Header, Sidebar, BottomNav, NAV_ITEMS, getNavItems });
