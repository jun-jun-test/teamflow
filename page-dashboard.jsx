function SeeAllBtn({ expanded, count, limit, onToggle }) {
  if (count <= limit) return null;
  return (
    <button onClick={onToggle}
      style={{ fontSize:12,color:"var(--accent,#06C755)",background:"var(--accent-light,#E9FBEF)",border:"1px solid var(--accent,#06C755)",borderRadius:9999,padding:"3px 12px",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap" }}
      onMouseEnter={e => { e.currentTarget.style.background="var(--accent,#06C755)"; e.currentTarget.style.color="white"; }}
      onMouseLeave={e => { e.currentTarget.style.background="var(--accent-light,#E9FBEF)"; e.currentTarget.style.color="var(--accent,#06C755)"; }}>
      {expanded ? "閉じる ↑" : `すべて見る（${count}件）`}
    </button>
  );
}

function DashboardPage({ currentUser, tasks, setTasks, kpis, setKpis, isMobile, appSettings }) {
  const [showAllNext,   setShowAllNext]   = React.useState(false);
  const [showAllProj,   setShowAllProj]   = React.useState(false);
  // ① KPI管理
  const [kpiModalOpen, setKpiModalOpen] = React.useState(false);
  const [editingKpi,   setEditingKpi]   = React.useState(null);
  const [kpiForm,      setKpiForm]      = React.useState({ title:"", targetValue:10, currentValue:0, unit:"件", relatedProject:"" });
  // ⑥ タスク編集
  const [taskEditId,     setTaskEditId]     = React.useState(null);
  const [taskEditFields, setTaskEditFields] = React.useState({});

  const LIMIT   = 3;
  const G  = "var(--accent,#06C755)";
  const GL = "var(--accent-light,#E9FBEF)";

  const allPct    = calcProgress(tasks);
  const kpiPct    = kpis.length ? Math.round(kpis.reduce((s,k) => s+Math.min(100,k.currentValue/k.targetValue*100),0)/kpis.length) : 0;
  const doneTasks = tasks.filter(t => t.status==="完了");
  const lateTasks = tasks.filter(t => isOverdue(t));

  const nextTasks    = tasks.filter(t => t.assignee===currentUser && t.status!=="完了").sort((a,b)=>(a.dueDate||"9999")<(b.dueDate||"9999")?-1:1);
  const visibleNext  = showAllNext ? nextTasks : nextTasks.slice(0,LIMIT);

  const memberProgress = MEMBERS.map(m => ({ name:m, pct:calcProgress(tasks.filter(t=>t.assignee===m)) }));
  const visibleMembers = memberProgress; // ③ 常に全員表示

  const projectProgress = BUSINESSES.map(b => { const bt=tasks.filter(t=>t.business===b); return { name:b, pct:calcProgress(bt), count:bt.filter(t=>t.status==="進行中").length }; });
  const visibleProj     = showAllProj ? projectProgress : projectProgress.slice(0,LIMIT);

  const businessIcons = { "サークル間マッチング事業":"👥","診断コンテンツ事業":"❓","SNSメディア事業":"📣" };
  const kpiIcons = ["✈️","🎵","🤝","❓","🎯","📊"];

  // ① KPI functions
  function openKpiNew() {
    setEditingKpi(null);
    setKpiForm({ title:"", targetValue:10, currentValue:0, unit:"件", relatedProject:PROJECTS[0]||"" });
    setKpiModalOpen(true);
  }
  function openKpiEdit(k) {
    setEditingKpi(k);
    setKpiForm({ title:k.title, targetValue:k.targetValue, currentValue:k.currentValue, unit:k.unit||"件", relatedProject:k.relatedProject||"" });
    setKpiModalOpen(true);
  }
  function saveKpi() {
    if (!kpiForm.title.trim()) return;
    var entry = { ...kpiForm, targetValue:Math.max(1,Number(kpiForm.targetValue)||1), currentValue:Number(kpiForm.currentValue)||0 };
    var updated = editingKpi ? kpis.map(k => k.id===editingKpi.id ? { ...k, ...entry } : k) : [...kpis, { id:genId(), ...entry }];
    setKpis(updated);
    saveToStorage(STORAGE_KEYS.KPIS, updated);
    setKpiModalOpen(false);
  }
  function deleteKpi(id) {
    if (!window.confirm("このKPIを削除しますか？")) return;
    var updated = kpis.filter(k => k.id!==id);
    setKpis(updated);
    saveToStorage(STORAGE_KEYS.KPIS, updated);
  }

  // ⑥ Task edit functions
  function startTaskEdit(task) {
    setTaskEditId(task.id);
    setTaskEditFields({ status:task.status, progress:task.progress, memo:task.memo||"" });
  }
  function saveTaskEdit() {
    var updated = tasks.map(t => {
      if (t.id!==taskEditId) return t;
      var c = { ...t, ...taskEditFields };
      if (taskEditFields.status==="完了") { c.progress=100; c.completedAt=new Date().toISOString().split("T")[0]; }
      return c;
    });
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    setTaskEditId(null);
  }
  const editingTask = tasks.find(t => t.id===taskEditId);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:"var(--title-sz,24px)",fontWeight:800,color:"#1F2937",marginBottom:4 }}>ダッシュボード</h1>
        <p style={{ fontSize:"var(--font-sz,14px)",color:"#6B7280" }}>チーム全体の進捗と今週の目標を確認できます。</p>
      </div>

      {/* Metric cards */}
      <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:"var(--gap,16px)",marginBottom:"var(--gap,16px)" }}>
        <MetricCard title="全体進捗率"      value={allPct}           unit="%" sub="先週比 ↑8%"     sparkColor={G} icon="📈" iconColor="#06C755" />
        <MetricCard title="今週のKPI達成率" value={kpiPct}           unit="%" sub="先週比 ↑4%"     sparkColor={G} icon="🎯" iconColor="#06C755" />
        <MetricCard title="完了タスク"      value={doneTasks.length} unit="件" sub="先週比 +6件 ↑" subIcon="✅" icon="✓" iconColor="#06C755" />
        <MetricCard title="遅延タスク"      value={lateTasks.length} unit="件" sub="先週比 +1件 ↑" subIcon="⚠️" subColor="#DC2626" icon="⏰" iconColor="#EF4444" />
      </div>

      {/* KPI + Next Tasks */}
      <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:"var(--gap,16px)",marginBottom:"var(--gap,16px)" }}>
        {/* ① KPI */}
        <div style={{ background:"var(--card-bg,white)",borderRadius:"var(--card-radius,16px)",padding:"var(--card-pad,20px 24px)",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:"var(--card-border,none)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <span style={{ fontWeight:700,fontSize:16,color:"#1F2937" }}>今週のKPI</span>
            <button onClick={openKpiNew} style={{ fontSize:12,color:"white",background:G,border:"none",borderRadius:9999,padding:"4px 14px",fontWeight:700,cursor:"pointer" }}>＋ 追加</button>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            {kpis.length===0 && <div style={{ color:"#9CA3AF",fontSize:13 }}>KPIがありません。「追加」から作成してください。</div>}
            {kpis.map((k,idx) => {
              var pct = Math.min(100,Math.round(k.currentValue/k.targetValue*100));
              return (
                <div key={k.id}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0 }}>
                      <div style={{ width:32,height:32,borderRadius:8,background:GL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0 }}>{kpiIcons[idx%kpiIcons.length]}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:13,fontWeight:600,color:"#1F2937",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{k.title}</div>
                        <div style={{ fontSize:11,color:"#9CA3AF" }}>達成率 {pct}% · {k.currentValue}/{k.targetValue}{k.unit}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:4,flexShrink:0,marginLeft:8 }}>
                      <button onClick={() => openKpiEdit(k)} style={{ background:GL,border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,color:G,cursor:"pointer",fontWeight:600 }}>編集</button>
                      <button onClick={() => deleteKpi(k.id)} style={{ background:"#FEE2E2",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#DC2626",cursor:"pointer" }}>✕</button>
                    </div>
                  </div>
                  <ProgressBar value={pct} height={6} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ⑥ Next Tasks */}
        <div style={{ background:"var(--card-bg,white)",borderRadius:"var(--card-radius,16px)",padding:"var(--card-pad,20px 24px)",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:"var(--card-border,none)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <span style={{ fontWeight:700,fontSize:16,color:"#1F2937" }}>次にやるべきタスク</span>
            <SeeAllBtn expanded={showAllNext} count={nextTasks.length} limit={LIMIT} onToggle={() => setShowAllNext(v=>!v)} />
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {nextTasks.length===0 && <div style={{ color:"#9CA3AF",fontSize:13 }}>タスクはありません 🎉</div>}
            {visibleNext.map(t => (
              <div key={t.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#F8FAF8",borderRadius:10 }}>
                <PriorityBadge priority={t.priority||"中"} />
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:"#1F2937",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{t.title}</div>
                  <div style={{ fontSize:11,color:"#9CA3AF",marginTop:2 }}>📁 {t.business}</div>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <div style={{ fontSize:11,color:"#9CA3AF",marginBottom:3 }}>{formatDate(t.dueDate)}</div>
                  <StatusBadge status={t.status} />
                </div>
                <button onClick={() => startTaskEdit(t)} style={{ background:GL,border:"none",borderRadius:6,padding:"4px 8px",fontSize:13,color:G,cursor:"pointer",flexShrink:0 }}>✏️</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Member + Project */}
      <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:"var(--gap,16px)" }}>
        <div style={{ background:"var(--card-bg,white)",borderRadius:"var(--card-radius,16px)",padding:"var(--card-pad,20px 24px)",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:"var(--card-border,none)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <span style={{ fontWeight:700,fontSize:16,color:"#1F2937" }}>{(appSettings&&appSettings.dashboardSections&&appSettings.dashboardSections.memberProgress)||"メンバー別進捗"}</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {visibleMembers.map(mp => (
              <div key={mp.name} style={{ display:"flex",alignItems:"center",gap:10 }}>
                <MemberAvatar name={mp.name} size={28} />
                <span style={{ fontSize:13,color:"#1F2937",minWidth:90,fontWeight:mp.name===currentUser?700:400 }}>{mp.name}{mp.name===currentUser?" 👤":""}</span>
                <div style={{ flex:1 }}><ProgressBar value={mp.pct} height={6} /></div>
                <span style={{ fontSize:13,fontWeight:700,color:G,width:36,textAlign:"right" }}>{mp.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:"var(--card-bg,white)",borderRadius:"var(--card-radius,16px)",padding:"var(--card-pad,20px 24px)",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:"var(--card-border,none)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <span style={{ fontWeight:700,fontSize:16,color:"#1F2937" }}>プロジェクト別進捗</span>
            <SeeAllBtn expanded={showAllProj} count={projectProgress.length} limit={LIMIT} onToggle={() => setShowAllProj(v=>!v)} />
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            {visibleProj.map(pp => (
              <div key={pp.name}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:GL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{businessIcons[pp.name]||"📊"}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:"#1F2937",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{pp.name}</div>
                    <div style={{ fontSize:11,color:"#9CA3AF" }}>進行中 {pp.count}件</div>
                  </div>
                  <span style={{ fontSize:15,fontWeight:800,color:G }}>{pp.pct}%</span>
                </div>
                <ProgressBar value={pp.pct} height={6} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ① KPI Modal */}
      {kpiModalOpen && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16 }}>
          <div style={{ background:"white",borderRadius:20,padding:"28px 32px",maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize:17,fontWeight:700,color:"#1F2937",marginBottom:20 }}>{editingKpi ? "KPIを編集" : "＋ KPIを追加"}</h3>
            <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>KPI名 <span style={{ color:"#EF4444" }}>*</span></label>
            <input value={kpiForm.title} onChange={e=>setKpiForm(f=>({...f,title:e.target.value}))} placeholder="例：30チームへDM送信" style={{ width:"100%",border:"1.5px solid #E5E7EB",borderRadius:10,padding:"10px 12px",fontSize:13,outline:"none",marginBottom:14,boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14 }}>
              {[["目標値","targetValue"],["現在値","currentValue"],["単位","unit"]].map(([label,key]) => (
                <div key={key}>
                  <label style={{ fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4 }}>{label}</label>
                  <input type={key==="unit"?"text":"number"} value={kpiForm[key]} onChange={e=>setKpiForm(f=>({...f,[key]:e.target.value}))} placeholder={key==="unit"?"件":""} style={{ width:"100%",border:"1.5px solid #E5E7EB",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",boxSizing:"border-box" }} />
                </div>
              ))}
            </div>
            <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>関連プロジェクト</label>
            <input value={kpiForm.relatedProject} onChange={e=>setKpiForm(f=>({...f,relatedProject:e.target.value}))} list="kpi-proj-dl" placeholder="プロジェクトを選択または入力" style={{ width:"100%",border:"1.5px solid #E5E7EB",borderRadius:10,padding:"10px 12px",fontSize:13,outline:"none",marginBottom:20,boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            <datalist id="kpi-proj-dl">{PROJECTS.map(p=><option key={p} value={p}/>)}</datalist>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>setKpiModalOpen(false)} style={{ flex:1,padding:12,borderRadius:10,border:"1.5px solid #E5E7EB",background:"white",color:"#6B7280",fontSize:14,fontWeight:600,cursor:"pointer" }}>キャンセル</button>
              <button onClick={saveKpi} style={{ flex:1,padding:12,borderRadius:10,border:"none",background:G,color:"white",fontSize:14,fontWeight:700,cursor:"pointer" }}>{editingKpi?"保存する":"追加する"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ⑥ Task Edit Modal */}
      {taskEditId && editingTask && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16 }}>
          <div style={{ background:"white",borderRadius:20,padding:"28px 32px",maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize:17,fontWeight:700,color:"#1F2937",marginBottom:4 }}>タスクを編集</h3>
            <p style={{ fontSize:13,color:"#6B7280",marginBottom:20 }}>{editingTask.title}</p>
            <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>ステータス</label>
            <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
              {STATUS_OPTIONS.map(s=>(
                <button key={s} onClick={()=>setTaskEditFields(f=>({...f,status:s}))} style={{ padding:"7px 14px",borderRadius:9999,border:`1.5px solid ${taskEditFields.status===s?G:"#E5E7EB"}`,background:taskEditFields.status===s?GL:"white",color:taskEditFields.status===s?G:"#6B7280",fontWeight:taskEditFields.status===s?700:500,fontSize:13,cursor:"pointer" }}>{s}</button>
              ))}
            </div>
            <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>進捗率: {taskEditFields.progress}%</label>
            <input type="range" min={0} max={100} value={taskEditFields.progress} onChange={e=>setTaskEditFields(f=>({...f,progress:Number(e.target.value)}))} style={{ width:"100%",marginBottom:16 }} />
            <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>メモ</label>
            <textarea value={taskEditFields.memo} onChange={e=>setTaskEditFields(f=>({...f,memo:e.target.value}))} rows={3} style={{ width:"100%",borderRadius:10,border:"1.5px solid #E5E7EB",padding:"10px 12px",fontSize:13,resize:"vertical",boxSizing:"border-box",outline:"none" }} />
            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button onClick={()=>setTaskEditId(null)} style={{ flex:1,padding:12,borderRadius:10,border:"1.5px solid #E5E7EB",background:"white",color:"#6B7280",fontSize:14,fontWeight:600,cursor:"pointer" }}>キャンセル</button>
              <button onClick={saveTaskEdit} style={{ flex:1,padding:12,borderRadius:10,border:"none",background:G,color:"white",fontSize:14,fontWeight:700,cursor:"pointer" }}>保存する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.DashboardPage = DashboardPage;
window.SeeAllBtn = SeeAllBtn;
