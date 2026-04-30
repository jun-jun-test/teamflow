function NameSelectPage({ onSelect, isMobile }) {
  const [selected, setSelected] = React.useState(null);

  function handleGo() {
    if (!selected) return;
    saveToStorage(STORAGE_KEYS.USER, selected);
    onSelect(selected);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#F8FAF8", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <header style={{ height:64, background:"white", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", padding:"0 24px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src="logo.png" alt="SEED" style={{ height:36, width:36, objectFit:"contain", borderRadius:8 }} />
          <span style={{ fontWeight:700, fontSize:16, color:"#1F2937" }}>チーム進捗ツール</span>
        </div>
      </header>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px" }}>
        {/* Left decoration - hidden on mobile */}
        <div className="deco-left" style={{ marginRight:48 }}>
          <SidebarDeco />
        </div>

        {/* Main card */}
        <div style={{ background:"white", borderRadius:24, boxShadow:"0 4px 32px rgba(0,0,0,0.10)", padding: isMobile ? "28px 20px" : "40px 48px", maxWidth:560, width:"100%" }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:"#1F2937", textAlign:"center", marginBottom:8 }}>あなたの名前を選択してください</h1>
          <p style={{ fontSize:14, color:"#6B7280", textAlign:"center", marginBottom:32 }}>あなたの名前を選ぶと、あなた専用のダッシュボードが開きます。</p>

          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap:16, marginBottom:32 }}>
            {MEMBERS.map(m => {
              const c = MEMBER_COLORS[m];
              const isSelected = selected === m;
              return (
                <button key={m} onClick={() => setSelected(m)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, padding:"20px 12px", borderRadius:16, border: isSelected ? `2px solid ${c.ring}` : "2px solid #E5E7EB", background: isSelected ? c.bg : "white", cursor:"pointer", transition:"all 0.15s", boxShadow: isSelected ? `0 0 0 4px ${c.ring}22` : "none" }}>
                  <MemberAvatar name={m} size={56} />
                  <span style={{ fontSize:14, fontWeight: isSelected ? 700 : 500, color: isSelected ? c.text : "#1F2937" }}>{m}</span>
                  {isSelected && (
                    <div style={{ width:20, height:20, borderRadius:"50%", background:c.ring, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button onClick={handleGo} disabled={!selected} style={{ width:"100%", padding:"16px", borderRadius:14, border:"none", background: selected ? "#4CAF50" : "#D1D5DB", color:"white", fontSize:17, fontWeight:700, cursor: selected ? "pointer" : "not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s", boxShadow: selected ? "0 4px 16px rgba(76,175,80,0.35)" : "none" }}>
            ダッシュボードへ進む
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>

          <p style={{ fontSize:12, color:"#9CA3AF", textAlign:"center", marginTop:16, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            ログインは不要です。名前を選ぶだけで利用を開始できます。
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .deco-left { display: none !important; }
        }
      `}</style>
    </div>
  );
}

window.NameSelectPage = NameSelectPage;
