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
  var myTasks      = tasks.filter(function(t){ return t.assignee === currentUser; });
  var todayTasks   = myTasks.filter(function(t){ return isToday(t.dueDate) && t.status !== "完了"; });
  var weekTasks    = myTasks.filter(function(t){ return isThisWeek(t.dueDate) && t.status !== "完了"; });
  var overdueTasks = myTasks.filter(function(t){ return isOverdue(t); });

  var [showAllToday, setShowAllToday] = React.useState(false);
  var [showAllWeek,  setShowAllWeek]  = React.useState(false);
  var [editingId,    setEditingId]    = React.useState(null);
  var [editFields,   setEditFields]   = React.useState({});
  var [detailTask,   setDetailTask]   = React.useState(null);

  // ── 検索・絞り込み ──
  var [searchQuery,  setSearchQuery]  = React.useState('');
  var [statusFilter, setStatusFilter] = React.useState('all');

  // ── 一括選択 ──
  var [selectedIds, setSelectedIds] = React.useState(new Set());

  var LIMIT = 3;
  var todaySource  = todayTasks.length > 0 ? todayTasks : myTasks.filter(function(t){ return t.status !== "完了"; }).slice(0,6);
  var weekSource   = weekTasks.length  > 0 ? weekTasks  : myTasks.slice(0,8);
  var visibleToday = showAllToday ? todaySource : todaySource.slice(0,LIMIT);
  var visibleWeek  = showAllWeek  ? weekSource  : weekSource.slice(0,LIMIT);

  var G  = "var(--accent,#06C755)";
  var GL = "var(--accent-light,#E9FBEF)";

  // 検索・フィルター適用
  var filteredTasks = myTasks.filter(function(t) {
    var q = searchQuery.toLowerCase();
    var matchSearch = !q || t.title.toLowerCase().indexOf(q) >= 0 || (t.memo || '').toLowerCase().indexOf(q) >= 0;
    var matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function startEdit(task) {
    setEditingId(task.id);
    setEditFields({ status:task.status, progress:task.progress, memo:task.memo||"" });
  }

  function saveEdit(taskId) {
    var updated = tasks.map(function(t) {
      if (t.id !== taskId) return t;
      var c = Object.assign({}, t, editFields);
      if (editFields.status === "完了") { c.progress = 100; c.completedAt = new Date().toISOString().split("T")[0]; }
      return c;
    });
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    setEditingId(null);
  }

  function toggleDone(taskId) {
    var updated = tasks.map(function(t) {
      if (t.id !== taskId) return t;
      var isDone = t.status === "完了";
      return Object.assign({}, t, { status: isDone ? "進行中" : "完了", progress: isDone ? t.progress : 100, completedAt: isDone ? undefined : new Date().toISOString().split("T")[0] });
    });
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
  }

  function deleteTask(taskId) {
    if (!window.confirm("このタスクを削除しますか？")) return;
    var updated = tasks.filter(function(t){ return t.id !== taskId; });
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    setSelectedIds(new Set());
  }

  // ── 一括操作 ──
  function toggleSelect(id) {
    setSelectedIds(function(prev) {
      var next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredTasks.length && filteredTasks.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map(function(t){ return t.id; })));
    }
  }

  function bulkChangeStatus(status) {
    var updated = tasks.map(function(t) {
      if (!selectedIds.has(t.id)) return t;
      var c = Object.assign({}, t, { status: status });
      if (status === '完了') { c.progress = 100; c.completedAt = new Date().toISOString().split('T')[0]; }
      return c;
    });
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    setSelectedIds(new Set());
  }

  function bulkDelete() {
    if (!window.confirm(selectedIds.size + '件のタスクを削除しますか？')) return;
    var updated = tasks.filter(function(t){ return !selectedIds.has(t.id); });
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    setSelectedIds(new Set());
  }

  var allSelected = filteredTasks.length > 0 && selectedIds.size === filteredTasks.length;

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
            <SeeAllBtn expanded={showAllToday} count={todaySource.length} limit={LIMIT} onToggle={() => setShowAllToday(function(v){ return !v; })} />
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
            {todaySource.length===0 && <div style={{ color:"#065F46",fontSize:13,padding:"8px 0" }}>今日のタスクはありません 🎉</div>}
            {visibleToday.map(function(t){ return <TodayTaskRow key={t.id} task={t} onRowClick={setDetailTask} onToggleDone={toggleDone} onEdit={startEdit} />; })}
          </div>
          <p style={{ fontSize:11,color:"#9CA3AF",marginTop:8 }}>タスク行をクリックすると詳細を確認できます</p>
        </div>

        {/* WEEK */}
        <div style={{ background:"var(--card-bg,white)",borderRadius:"var(--card-radius,16px)",padding:"var(--card-pad,20px 24px)",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:"var(--card-border,none)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <span style={{ fontWeight:700,fontSize:16,color:"#1F2937" }}>今週のタスク</span>
            <SeeAllBtn expanded={showAllWeek} count={weekSource.length} limit={LIMIT} onToggle={() => setShowAllWeek(function(v){ return !v; })} />
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {weekSource.length===0 && <div style={{ color:"#9CA3AF",fontSize:13 }}>今週のタスクはありません</div>}
            {visibleWeek.map(function(t){ return <WeekTaskRow key={t.id} task={t} />; })}
          </div>
        </div>
      </div>

      {/* 担当タスク一覧（検索・絞り込み・一括操作） */}
      <div style={{ background:"var(--card-bg,white)",borderRadius:"var(--card-radius,16px)",padding:"var(--card-pad,20px 24px)",boxShadow:"var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))",border:"var(--card-border,none)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10 }}>
          <div style={{ fontWeight:700,fontSize:16,color:"#1F2937" }}>担当タスク一覧</div>
          <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
            {/* 検索ボックス */}
            <div style={{ position:"relative" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)" }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={searchQuery}
                onChange={function(e){ setSearchQuery(e.target.value); setSelectedIds(new Set()); }}
                placeholder="タスクを検索…"
                style={{ border:"1.5px solid #E5E7EB",borderRadius:9,padding:"7px 10px 7px 30px",fontSize:13,outline:"none",width:160,boxSizing:"border-box" }}
                onFocus={function(e){ e.target.style.borderColor=G; }}
                onBlur={function(e){ e.target.style.borderColor="#E5E7EB"; }}
              />
              {searchQuery && (
                <button onClick={function(){ setSearchQuery(''); }}
                  style={{ position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#9CA3AF",fontSize:14,lineHeight:1,padding:0 }}>✕</button>
              )}
            </div>
            {/* ステータスフィルター */}
            <div style={{ display:"flex",gap:4 }}>
              {['all','未着手','進行中','確認待ち','完了'].map(function(s) {
                return (
                  <button key={s} onClick={function(){ setStatusFilter(s); setSelectedIds(new Set()); }}
                    style={{ padding:"5px 10px",borderRadius:9999,border:"1.5px solid " + (statusFilter===s ? G : "#E5E7EB"),background:statusFilter===s?GL:"white",color:statusFilter===s?G:"#6B7280",fontWeight:statusFilter===s?700:500,fontSize:11,cursor:"pointer",whiteSpace:"nowrap" }}>
                    {s==='all'?'すべて':s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 件数表示 */}
        <div style={{ fontSize:12,color:"#9CA3AF",marginBottom:8 }}>
          {filteredTasks.length}件表示
          {(searchQuery || statusFilter !== 'all') && ' (絞り込み中)'}
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #F3F4F6" }}>
                <th style={{ padding:"8px 10px",width:36 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
                    style={{ cursor:"pointer",width:16,height:16,accentColor:G }} />
                </th>
                {["タスク名","所属事業","期限","進捗","ステータス","メモ","操作"].map(function(h) {
                  return <th key={h} style={{ padding:"8px 10px",textAlign:"left",color:"#9CA3AF",fontWeight:600,fontSize:12,whiteSpace:"nowrap" }}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(function(t) {
                var isSel = selectedIds.has(t.id);
                return (
                  <tr key={t.id} style={{ borderBottom:"1px solid #F9FAFB",background:isSel?"#F0FDF4":"transparent",transition:"background 0.1s" }}>
                    <td style={{ padding:"10px 10px" }}>
                      <input type="checkbox" checked={isSel} onChange={function(){ toggleSelect(t.id); }}
                        style={{ cursor:"pointer",width:16,height:16,accentColor:G }} />
                    </td>
                    <td style={{ padding:"10px 10px",fontWeight:600,color:"#1F2937",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer" }}
                      onClick={function(){ setDetailTask(t); }}>
                      {t.title}
                    </td>
                    <td style={{ padding:"10px 10px",color:"#6B7280",whiteSpace:"nowrap" }}>
                      <span style={{ display:"inline-flex",alignItems:"center",gap:4 }}>
                        <span style={{ width:8,height:8,borderRadius:"50%",background:G,display:"inline-block" }}></span>
                        {t.business}
                      </span>
                    </td>
                    <td style={{ padding:"10px 10px",color:"#6B7280",whiteSpace:"nowrap" }}>{formatDate(t.dueDate)}</td>
                    <td style={{ padding:"10px 10px",minWidth:100 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                        <div style={{ flex:1 }}><ProgressBar value={t.progress} height={5} /></div>
                        <span style={{ fontSize:12,color:"#1F2937",fontWeight:600,width:34,textAlign:"right" }}>{t.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"10px 10px" }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding:"10px 10px",color:"#9CA3AF",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{t.memo||"—"}</td>
                    <td style={{ padding:"10px 10px" }}>
                      <div style={{ display:"flex",gap:4 }}>
                        <button onClick={function(){ startEdit(t); }} style={{ fontSize:12,color:G,background:GL,border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontWeight:600 }}>編集</button>
                        <button onClick={function(){ deleteTask(t.id); }} style={{ fontSize:12,color:"#DC2626",background:"#FEE2E2",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTasks.length===0 && (
            <div style={{ padding:"24px",textAlign:"center",color:"#9CA3AF" }}>
              {searchQuery || statusFilter !== 'all' ? '条件に一致するタスクがありません' : 'タスクはありません'}
            </div>
          )}
          <div style={{ fontSize:12,color:"#9CA3AF",marginTop:12 }}>全{myTasks.length}件</div>
        </div>
      </div>

      {/* ── 一括操作バー（選択時に表示） ── */}
      {selectedIds.size > 0 && (
        <div style={{
          position:"fixed", bottom:isMobile?68:16, left:"50%", transform:"translateX(-50%)",
          background:"#1F2937", borderRadius:16, padding:"12px 20px",
          display:"flex", alignItems:"center", gap:12, zIndex:500,
          boxShadow:"0 8px 32px rgba(0,0,0,0.25)", flexWrap:"wrap", justifyContent:"center",
          maxWidth:"90vw",
        }}>
          <span style={{ fontSize:13,fontWeight:700,color:"white",whiteSpace:"nowrap" }}>{selectedIds.size}件選択中</span>
          <div style={{ width:1,height:20,background:"#374151" }} />
          {STATUS_OPTIONS.map(function(s) {
            return (
              <button key={s} onClick={function(){ bulkChangeStatus(s); }}
                style={{ padding:"6px 12px",borderRadius:9999,border:"none",background:s==="完了"?G:s==="進行中"?"#F59E0B":s==="確認待ち"?"#3B82F6":"#6B7280",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap" }}>
                {s}に変更
              </button>
            );
          })}
          <button onClick={bulkDelete}
            style={{ padding:"6px 12px",borderRadius:9999,border:"none",background:"#EF4444",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap" }}>
            🗑 削除
          </button>
          <button onClick={function(){ setSelectedIds(new Set()); }}
            style={{ padding:"6px 10px",borderRadius:9999,border:"1px solid #4B5563",background:"transparent",color:"#9CA3AF",fontSize:12,cursor:"pointer" }}>
            ✕ 解除
          </button>
        </div>
      )}

      {/* タスク詳細モーダル（コメント付き） */}
      {detailTask && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16 }}
          onClick={function(){ setDetailTask(null); }}>
          <div style={{ background:"white",borderRadius:20,padding:"28px 32px",maxWidth:520,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)",maxHeight:"90vh",overflowY:"auto" }}
            onClick={function(e){ e.stopPropagation(); }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
              <div style={{ flex:1,minWidth:0,marginRight:12 }}>
                <div style={{ display:"flex",gap:8,marginBottom:8,flexWrap:"wrap" }}>
                  <PriorityBadge priority={detailTask.priority||"中"} />
                  <StatusBadge status={detailTask.status} />
                </div>
                <h3 style={{ fontSize:17,fontWeight:800,color:"#1F2937",lineHeight:1.4 }}>{detailTask.title}</h3>
              </div>
              <button onClick={function(){ setDetailTask(null); }} style={{ background:"#F3F4F6",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#6B7280",flexShrink:0 }}>✕</button>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
              {[
                { icon:"👤",label:"担当者",       val:detailTask.assignee },
                { icon:"📅",label:"期限",         val:formatDate(detailTask.dueDate) },
                { icon:"🏢",label:"所属事業",     val:detailTask.business },
                { icon:"📁",label:"プロジェクト", val:detailTask.project },
                { icon:"💡",label:"ワークフロー", val:detailTask.workflowStage },
                { icon:"📆",label:"作成日",       val:formatDate(detailTask.createdAt) },
              ].map(function(r) {
                return (
                  <div key={r.label} style={{ background:"#F8FAF8",borderRadius:10,padding:"10px 12px" }}>
                    <div style={{ fontSize:11,color:"#9CA3AF",marginBottom:3 }}>{r.icon} {r.label}</div>
                    <div style={{ fontSize:13,fontWeight:600,color:"#1F2937" }}>{r.val||"—"}</div>
                  </div>
                );
              })}
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

            {/* コメントセクション */}
            <div style={{ borderTop:"1px solid #F3F4F6",paddingTop:16,marginBottom:16 }}>
              <TaskComments taskId={detailTask.id} currentUser={currentUser} />
            </div>

            <div style={{ display:"flex",gap:10 }}>
              <button onClick={function(){ setDetailTask(null); startEdit(detailTask); }}
                style={{ flex:1,padding:12,borderRadius:10,border:`1.5px solid ${G}`,background:GL,color:G,fontSize:14,fontWeight:700,cursor:"pointer" }}>
                ✏️ 編集する
              </button>
              <button onClick={function(){ setDetailTask(null); }}
                style={{ flex:1,padding:12,borderRadius:10,border:"1.5px solid #E5E7EB",background:"white",color:"#6B7280",fontSize:14,fontWeight:600,cursor:"pointer" }}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {editingId && (function() {
        var task = tasks.find(function(t){ return t.id === editingId; });
        if (!task) return null;
        return (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16 }}>
            <div style={{ background:"white",borderRadius:20,padding:"28px 32px",maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
              <h3 style={{ fontSize:17,fontWeight:700,color:"#1F2937",marginBottom:4 }}>タスクを編集</h3>
              <p style={{ fontSize:13,color:"#6B7280",marginBottom:20 }}>{task.title}</p>
              <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>ステータス</label>
              <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
                {STATUS_OPTIONS.map(function(s) {
                  return (
                    <button key={s} onClick={function(){ setEditFields(function(f){ return Object.assign({},f,{status:s}); }); }}
                      style={{ padding:"7px 14px",borderRadius:9999,border:`1.5px solid ${editFields.status===s?G:"#E5E7EB"}`,background:editFields.status===s?GL:"white",color:editFields.status===s?G:"#6B7280",fontWeight:editFields.status===s?700:500,fontSize:13,cursor:"pointer" }}>
                      {s}
                    </button>
                  );
                })}
              </div>
              <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>進捗率: {editFields.progress}%</label>
              <input type="range" min={0} max={100} value={editFields.progress}
                onChange={function(e){ setEditFields(function(f){ return Object.assign({},f,{progress:Number(e.target.value)}); }); }}
                style={{ width:"100%",marginBottom:16 }} />
              <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>メモ</label>
              <textarea value={editFields.memo}
                onChange={function(e){ setEditFields(function(f){ return Object.assign({},f,{memo:e.target.value}); }); }}
                rows={3} style={{ width:"100%",borderRadius:10,border:"1.5px solid #E5E7EB",padding:"10px 12px",fontSize:13,color:"#1F2937",resize:"vertical",boxSizing:"border-box",outline:"none" }} />
              <div style={{ display:"flex",gap:10,marginTop:20 }}>
                <button onClick={function(){ setEditingId(null); }} style={{ flex:1,padding:12,borderRadius:10,border:"1.5px solid #E5E7EB",background:"white",color:"#6B7280",fontSize:14,fontWeight:600,cursor:"pointer" }}>キャンセル</button>
                <button onClick={function(){ saveEdit(editingId); }} style={{ flex:1,padding:12,borderRadius:10,border:"none",background:G,color:"white",fontSize:14,fontWeight:700,cursor:"pointer" }}>保存する</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

window.MyTasksPage = MyTasksPage;
