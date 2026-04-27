function SummaryCard({ label, count, icon, color, highlight }) {
  var G  = "var(--accent,#06C755)";
  var GL = "var(--accent-light,#E9FBEF)";
  return (
    <div style={{ background:highlight?GL:"white",borderRadius:"var(--card-radius,16px)",padding:"18px 20px",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:highlight?`2px solid ${G}`:"var(--card-border,none)",flex:1,minWidth:0 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
        <div style={{ width:36,height:36,borderRadius:10,background:highlight?G+"25":color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{icon}</div>
        <span style={{ fontSize:13,color:highlight?"#065F46":"#6B7280",fontWeight:highlight?700:500 }}>{label}</span>
      </div>
      <div style={{ fontSize:36,fontWeight:800,color:highlight?G:color,lineHeight:1 }}>{count}<span style={{ fontSize:18,fontWeight:700 }}>件</span></div>
    </div>
  );
}

function TodayTaskRow({ task, onRowClick, onToggleDone, onEdit }) {
  var G  = "var(--accent,#06C755)";
  var GL = "var(--accent-light,#E9FBEF)";
  var done = task.status==="完了";
  return (
    <div onClick={() => onRowClick(task)} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:10,background:done?"#F0FDF4":GL,marginBottom:4,border:`1px solid ${done?"#BBF7D0":"var(--accent,#06C755)"}22`,cursor:"pointer",transition:"background 0.2s" }}>
      <button onClick={e => { e.stopPropagation(); onToggleDone(task.id); }}
        style={{ width:24,height:24,borderRadius:7,border:`2px solid ${G}`,background:done?G:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s" }}>
        {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
      </button>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:14,fontWeight:done?500:700,color:done?"#6B7280":"#1F2937",textDecoration:done?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{task.title}</div>
        {done && <div style={{ fontSize:11,color:G,fontWeight:600,marginTop:2 }}>✓ 完了しました！</div>}
        {!done && <div style={{ fontSize:11,color:"#9CA3AF",marginTop:2 }}>{task.business}</div>}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
        <span style={{ fontSize:11,color:"#9CA3AF" }}>{formatDate(task.dueDate)}</span>
        <div style={{ width:56 }}>
          <div style={{ fontSize:11,color:"#6B7280",marginBottom:2,textAlign:"right" }}>{task.progress}%</div>
          <ProgressBar value={task.progress} height={4} />
        </div>
        <button onClick={e => { e.stopPropagation(); onEdit(task); }} style={{ background:"none",border:"none",cursor:"pointer",color:"#9CA3AF",padding:"2px 4px",fontSize:14 }}>✏️</button>
      </div>
    </div>
  );
}

function WeekTaskRow({ task }) {
  var GL = "var(--accent-light,#E9FBEF)";
  return (
    <div style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"#F8FAF8",borderRadius:10,border:"1px solid #F3F4F6" }}>
      <div style={{ width:32,height:32,borderRadius:8,background:GL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>
        {task.business==="SNSメディア事業"?"🎵":task.business==="診断コンテンツ事業"?"❓":"👥"}
      </div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:13,fontWeight:600,color:"#1F2937",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{task.title}</div>
        <div style={{ fontSize:11,color:"#9CA3AF" }}>{task.business}</div>
      </div>
      <div style={{ flexShrink:0,textAlign:"right" }}>
        <div style={{ fontSize:11,color:"#9CA3AF",marginBottom:3 }}>{formatDate(task.dueDate)}</div>
        <StatusBadge status={task.status} />
      </div>
    </div>
  );
}

function MyTasksPage({ currentUser, tasks, setTasks, isMobile }) {
  const myTasks    = tasks.filter(t => t.assignee===currentUser);
  const todayTasks = myTasks.filter(t => isToday(t.dueDate) && t.status!=="完了");
  const weekTasks  = myTasks.filter(t => isThisWeek(t.dueDate) && t.status!=="完了");
  const overdueTasks = myTasks.filter(t => isOverdue(t));

  const [showAllToday, setShowAllToday] = React.useState(false);
  const [showAllWeek,  setShowAllWeek]  = React.useState(false);
  const [editingId,    setEditingId]    = React.useState(null);
  const [editFields,   setEditFields]   = React.useState({});
  const [detailTask,   setDetailTask]   = React.useState(null);

  const LIMIT = 3;
  const todaySource  = todayTasks.length > 0 ? todayTasks : myTasks.filter(t=>t.status!=="完了").slice(0,6);
  const weekSource   = weekTasks.length  > 0 ? weekTasks  : myTasks.slice(0,8);
  const visibleToday = showAllToday ? todaySource : todaySource.slice(0,LIMIT);
  const visibleWeek  = showAllWeek  ? weekSource  : weekSource.slice(0,LIMIT);

  const G  = "var(--accent,#06C755)";
  const GL = "var(--accent-light,#E9FBEF)";

  function startEdit(task) {
    setEditingId(task.id);
    setEditFields({ status:task.status, progress:task.progress, memo:task.memo||"" });
  }

  function saveEdit(taskId) {
    var updated = tasks.map(t => {
      if (t.id!==taskId) return t;
      var c = { ...t, ...editFields };
      if (editFields.status==="完了") { c.progress=100; c.completedAt=new Date().toISOString().split("T")[0]; }
      return c;
    });
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    setEditingId(null);
  }

  function toggleDone(taskId) {
    var updated = tasks.map(t => {
      if (t.id!==taskId) return t;
      var isDone = t.status==="完了";
      return { ...t, status:isDone?"進行中":"完了", progress:isDone?t.progress:100, completedAt:isDone?undefined:new Date().toISOString().split("T")[0] };
    });
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
  }

  // ③ タスク削除
  function deleteTask(taskId) {
    if (!window.confirm("このタスクを削除しますか？")) return;
    var updated = tasks.filter(t => t.id!==taskId);
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
  }

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:"var(--title-sz,24px)",fontWeight:800,color:"#1F2937",marginBottom:4 }}>自分のタスク</h1>
        <p style={{ fontSize:"var(--font-sz,14px)",color:"#6B7280" }}>今日やることと今週のタスクを確認できます。</p>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:"var(--gap,16px)",marginBottom:"var(--gap,16px)" }}>
        <SummaryCard label="今日やること" count={todaySource.length} icon="✅" color="#4CAF50" highlight={true} />
        <SummaryCard label="今週のタスク" count={weekSource.length}  icon="📅" color="#3B82F6" />
        <SummaryCard label="期限切れ"     count={overdueTasks.length} icon="⏰" color="#EF4444" />
      </div>

      <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:"var(--gap,16px)",marginBottom:"var(--gap,16px)" }}>
        {/* TODAY */}
        <div style={{ background:GL,borderRadius:"var(--card-radius,16px)",padding:"var(--card-pad,20px 24px)",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:`2px solid ${G}`,borderLeft:`5px solid ${G}`,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:G+"15",pointerEvents:"none" }}></div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              <span style={{ fontWeight:800,fontSize:16,color:"#065F46" }}>今日やること</span>
            </div>
            <SeeAllBtn expanded={showAllToday} count={todaySource.length} limit={LIMIT} onToggle={() => setShowAllToday(v=>!v)} />
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
            {todaySource.length===0 && <div style={{ color:"#065F46",fontSize:13,padding:"8px 0" }}>今日のタスクはありません 🎉</div>}
            {visibleToday.map(t => <TodayTaskRow key={t.id} task={t} onRowClick={setDetailTask} onToggleDone={toggleDone} onEdit={startEdit} />)}
          </div>
          <p style={{ fontSize:11,color:"#9CA3AF",marginTop:8 }}>タスク行をクリックすると詳細を確認できます</p>
        </div>

        {/* WEEK */}
        <div style={{ background:"var(--card-bg,white)",borderRadius:"var(--card-radius,16px)",padding:"var(--card-pad,20px 24px)",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:"var(--card-border,none)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <span style={{ fontWeight:700,fontSize:16,color:"#1F2937" }}>今週のタスク</span>
            <SeeAllBtn expanded={showAllWeek} count={weekSource.length} limit={LIMIT} onToggle={() => setShowAllWeek(v=>!v)} />
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {weekSource.length===0 && <div style={{ color:"#9CA3AF",fontSize:13 }}>今週のタスクはありません</div>}
            {visibleWeek.map(t => <WeekTaskRow key={t.id} task={t} />)}
          </div>
        </div>
      </div>

      {/* ③ 担当タスク一覧（削除ボタン付き） */}
      <div style={{ background:"var(--card-bg,white)",borderRadius:"var(--card-radius,16px)",padding:"var(--card-pad,20px 24px)",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:"var(--card-border,none)" }}>
        <div style={{ fontWeight:700,fontSize:16,color:"#1F2937",marginBottom:16 }}>担当タスク一覧</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #F3F4F6" }}>
                {["タスク名","所属事業","期限","進捗","ステータス","メモ","操作"].map(h => (
                  <th key={h} style={{ padding:"8px 12px",textAlign:"left",color:"#9CA3AF",fontWeight:600,fontSize:12,whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myTasks.map(t => (
                <tr key={t.id} style={{ borderBottom:"1px solid #F9FAFB" }}>
                  <td style={{ padding:"12px 12px",fontWeight:600,color:"#1F2937",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer" }} onClick={() => setDetailTask(t)}>{t.title}</td>
                  <td style={{ padding:"12px 12px",color:"#6B7280",whiteSpace:"nowrap" }}>
                    <span style={{ display:"inline-flex",alignItems:"center",gap:4 }}>
                      <span style={{ width:8,height:8,borderRadius:"50%",background:G,display:"inline-block" }}></span>
                      {t.business}
                    </span>
                  </td>
                  <td style={{ padding:"12px 12px",color:"#6B7280",whiteSpace:"nowrap" }}>{formatDate(t.dueDate)}</td>
                  <td style={{ padding:"12px 12px",minWidth:100 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <div style={{ flex:1 }}><ProgressBar value={t.progress} height={5} /></div>
                      <span style={{ fontSize:12,color:"#1F2937",fontWeight:600,width:34,textAlign:"right" }}>{t.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 12px" }}><StatusBadge status={t.status} /></td>
                  <td style={{ padding:"12px 12px",color:"#9CA3AF",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{t.memo||"—"}</td>
                  <td style={{ padding:"12px 12px" }}>
                    <div style={{ display:"flex",gap:4 }}>
                      <button onClick={() => startEdit(t)} style={{ fontSize:12,color:G,background:GL,border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontWeight:600 }}>編集</button>
                      <button onClick={() => deleteTask(t.id)} style={{ fontSize:12,color:"#DC2626",background:"#FEE2E2",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer" }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myTasks.length===0 && <div style={{ padding:"24px",textAlign:"center",color:"#9CA3AF" }}>タスクはありません</div>}
          <div style={{ fontSize:12,color:"#9CA3AF",marginTop:12 }}>全{myTasks.length}件</div>
        </div>
      </div>

      {/* ② タスク詳細モーダル */}
      {detailTask && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16 }} onClick={() => setDetailTask(null)}>
          <div style={{ background:"white",borderRadius:20,padding:"28px 32px",maxWidth:480,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
              <div style={{ flex:1,minWidth:0,marginRight:12 }}>
                <div style={{ display:"flex",gap:8,marginBottom:8,flexWrap:"wrap" }}>
                  <PriorityBadge priority={detailTask.priority||"中"} />
                  <StatusBadge status={detailTask.status} />
                </div>
                <h3 style={{ fontSize:17,fontWeight:800,color:"#1F2937",lineHeight:1.4 }}>{detailTask.title}</h3>
              </div>
              <button onClick={() => setDetailTask(null)} style={{ background:"#F3F4F6",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#6B7280",flexShrink:0 }}>✕</button>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16 }}>
              {[
                { icon:"👤",label:"担当者",   val:detailTask.assignee },
                { icon:"📅",label:"期限",     val:formatDate(detailTask.dueDate) },
                { icon:"🏢",label:"所属事業", val:detailTask.business },
                { icon:"📁",label:"プロジェクト", val:detailTask.project },
                { icon:"💡",label:"ワークフロー", val:detailTask.workflowStage },
                { icon:"📆",label:"作成日",   val:formatDate(detailTask.createdAt) },
              ].map(r => (
                <div key={r.label} style={{ background:"#F8FAF8",borderRadius:10,padding:"10px 12px" }}>
                  <div style={{ fontSize:11,color:"#9CA3AF",marginBottom:3 }}>{r.icon} {r.label}</div>
                  <div style={{ fontSize:13,fontWeight:600,color:"#1F2937" }}>{r.val||"—"}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12,color:"#9CA3AF",marginBottom:6 }}>進捗率</div>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <div style={{ flex:1 }}><ProgressBar value={detailTask.progress} height={8} /></div>
                <span style={{ fontSize:16,fontWeight:800,color:G,width:44,textAlign:"right" }}>{detailTask.progress}%</span>
              </div>
            </div>

            {detailTask.memo && (
              <div style={{ background:"#F8FAF8",borderRadius:10,padding:"12px 14px",marginBottom:16 }}>
                <div style={{ fontSize:11,color:"#9CA3AF",marginBottom:4 }}>📝 メモ</div>
                <div style={{ fontSize:13,color:"#374151",lineHeight:1.6 }}>{detailTask.memo}</div>
              </div>
            )}

            <div style={{ display:"flex",gap:10 }}>
              <button onClick={() => { setDetailTask(null); startEdit(detailTask); }} style={{ flex:1,padding:12,borderRadius:10,border:`1.5px solid ${G}`,background:GL,color:G,fontSize:14,fontWeight:700,cursor:"pointer" }}>✏️ 編集する</button>
              <button onClick={() => setDetailTask(null)} style={{ flex:1,padding:12,borderRadius:10,border:"1.5px solid #E5E7EB",background:"white",color:"#6B7280",fontSize:14,fontWeight:600,cursor:"pointer" }}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {editingId && (() => {
        var task = tasks.find(t => t.id===editingId);
        if (!task) return null;
        return (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16 }}>
            <div style={{ background:"white",borderRadius:20,padding:"28px 32px",maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
              <h3 style={{ fontSize:17,fontWeight:700,color:"#1F2937",marginBottom:4 }}>タスクを編集</h3>
              <p style={{ fontSize:13,color:"#6B7280",marginBottom:20 }}>{task.title}</p>
              <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>ステータス</label>
              <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => setEditFields(f=>({...f,status:s}))} style={{ padding:"7px 14px",borderRadius:9999,border:`1.5px solid ${editFields.status===s?G:"#E5E7EB"}`,background:editFields.status===s?GL:"white",color:editFields.status===s?G:"#6B7280",fontWeight:editFields.status===s?700:500,fontSize:13,cursor:"pointer" }}>{s}</button>
                ))}
              </div>
              <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>進捗率: {editFields.progress}%</label>
              <input type="range" min={0} max={100} value={editFields.progress} onChange={e=>setEditFields(f=>({...f,progress:Number(e.target.value)}))} style={{ width:"100%",marginBottom:16 }} />
              <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>メモ</label>
              <textarea value={editFields.memo} onChange={e=>setEditFields(f=>({...f,memo:e.target.value}))} rows={3} style={{ width:"100%",borderRadius:10,border:"1.5px solid #E5E7EB",padding:"10px 12px",fontSize:13,color:"#1F2937",resize:"vertical",boxSizing:"border-box",outline:"none" }} />
              <div style={{ display:"flex",gap:10,marginTop:20 }}>
                <button onClick={() => setEditingId(null)} style={{ flex:1,padding:12,borderRadius:10,border:"1.5px solid #E5E7EB",background:"white",color:"#6B7280",fontSize:14,fontWeight:600,cursor:"pointer" }}>キャンセル</button>
                <button onClick={() => saveEdit(editingId)} style={{ flex:1,padding:12,borderRadius:10,border:"none",background:G,color:"white",fontSize:14,fontWeight:700,cursor:"pointer" }}>保存する</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

window.MyTasksPage = MyTasksPage;
