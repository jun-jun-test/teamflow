// ===== PRIORITY COLOR MAPS (module-level) =====
const BN_PRI_COLOR_GLOBAL = {
  "高":{ bg:"#FEF2F2", border:"#FECACA", text:"#DC2626", icon:"🔴" },
  "中":{ bg:"#FFF7ED", border:"#FED7AA", text:"#EA580C", icon:"🟡" },
  "低":{ bg:"#EFF6FF", border:"#BFDBFE", text:"#2563EB", icon:"🔵" },
};
const BN_PRIORITIES_GLOBAL = ["高","中","低"];

const FLOW_PRI_COLORS = {
  "高": { bg:"#FEF2F2", border:"#FECACA", activeBorder:"#F87171", text:"#DC2626", dot:"#EF4444", badge:"🔴 高" },
  "中": { bg:"#FFF7ED", border:"#FED7AA", activeBorder:"#FB923C", text:"#EA580C", dot:"#F97316", badge:"🟡 中" },
  "低": { bg:"#EFF6FF", border:"#BFDBFE", activeBorder:"#60A5FA", text:"#2563EB", dot:"#3B82F6", badge:"🔵 低" },
};

// ===== FLOW META EDIT MODAL =====
function FlowMetaModal({ flow, onSave, onDelete, onClose }) {
  var [title,    setTitle]    = React.useState(flow.title);
  var [biz,      setBiz]      = React.useState(flow.business || "");
  var [priority, setPriority] = React.useState(flow.priority || "中");

  function handleSave() {
    if (!title.trim()) return;
    onSave({ title: title.trim(), business: biz, priority: priority });
    onClose();
  }

  function handleDelete() {
    if (!window.confirm("「" + flow.title + "」を削除しますか？\nこの操作は取り消せません。")) return;
    onDelete();
    onClose();
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }} onClick={onClose}>
      <div style={{ background:"white", borderRadius:20, padding:"28px 28px", maxWidth:440, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ fontSize:17, fontWeight:800, color:"#1F2937", margin:0 }}>⚙️ フローを編集</h3>
          <button onClick={onClose} style={{ background:"#F3F4F6", border:"none", borderRadius:8, padding:"5px 10px", cursor:"pointer", fontSize:14, color:"#6B7280" }}>✕</button>
        </div>

        <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>フロー名 <span style={{ color:"#EF4444" }}>*</span></label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="フロー名を入力..." style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"10px 12px", fontSize:13, outline:"none", marginBottom:14, boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor="#4CAF50"} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />

        <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>事業名</label>
        <input value={biz} onChange={e => setBiz(e.target.value)} list="flow-biz-dl-edit" placeholder="事業名を入力または選択" style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"10px 12px", fontSize:13, outline:"none", marginBottom:14, boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor="#4CAF50"} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
        <datalist id="flow-biz-dl-edit">{BUSINESSES.map(b => <option key={b} value={b}/>)}</datalist>

        <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>優先度</label>
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {["高","中","低"].map(function(p) {
            var pc = FLOW_PRI_COLORS[p];
            var active = priority === p;
            return (
              <button key={p} onClick={() => setPriority(p)} style={{ flex:1, padding:"9px 6px", borderRadius:10, border:"2px solid " + (active ? pc.activeBorder : "#E5E7EB"), background: active ? pc.bg : "white", color: active ? pc.text : "#6B7280", fontSize:13, fontWeight: active ? 700 : 500, cursor:"pointer", transition:"all 0.15s" }}>
                {pc.badge}
              </button>
            );
          })}
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <button onClick={handleDelete} style={{ padding:"10px 14px", borderRadius:10, border:"none", background:"#FEE2E2", color:"#DC2626", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            🗑 削除
          </button>
          <button onClick={onClose} style={{ flex:1, padding:"10px", borderRadius:10, border:"1.5px solid #E5E7EB", background:"white", color:"#6B7280", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            キャンセル
          </button>
          <button onClick={handleSave} disabled={!title.trim()} style={{ flex:1, padding:"10px", borderRadius:10, border:"none", background:"#4CAF50", color:"white", fontSize:13, fontWeight:700, cursor:"pointer", opacity: title.trim() ? 1 : 0.5 }}>
            保存する
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== BOTTLENECK FORM MODAL =====
function BnFormModal({ bnEdit, bottlenecks, saveBottlenecks, onClose }) {
  const isNew = !bnEdit;
  const [formTitle, setFormTitle] = React.useState(bnEdit?.title || "");
  const [formDesc,  setFormDesc]  = React.useState(bnEdit?.desc  || "");
  const [formPri,   setFormPri]   = React.useState(bnEdit?.priority || "高");

  function saveBn() {
    if (!formTitle.trim()) return;
    if (isNew) {
      saveBottlenecks([...bottlenecks, { id: genId(), title: formTitle, desc: formDesc, priority: formPri, resolvedAt: null }]);
    } else {
      saveBottlenecks(bottlenecks.map(b => b.id !== bnEdit.id ? b : { ...b, title: formTitle, desc: formDesc, priority: formPri }));
    }
    onClose();
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div style={{ background:"white", borderRadius:20, padding:"28px 32px", maxWidth:440, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        <h3 style={{ fontSize:17, fontWeight:800, color:"#1F2937", marginBottom:20 }}>{isNew ? "＋ ボトルネックを追加" : "✏️ ボトルネックを編集"}</h3>

        <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>タイトル <span style={{ color:"#EF4444" }}>*</span></label>
        <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="例：DM文面の決定が遅れています" style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"10px 12px", fontSize:13, outline:"none", marginBottom:14, boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor="var(--accent,#06C755)"} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />

        <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>詳細・原因</label>
        <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} placeholder="例：承認待ちのため、次のステップに進めません。" style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"10px 12px", fontSize:13, outline:"none", resize:"vertical", marginBottom:14, boxSizing:"border-box", lineHeight:1.6 }} onFocus={e=>e.target.style.borderColor="var(--accent,#06C755)"} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />

        <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>優先度</label>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {BN_PRIORITIES_GLOBAL.map(p => {
            const pc = BN_PRI_COLOR_GLOBAL[p];
            return (
              <button key={p} onClick={() => setFormPri(p)} style={{ flex:1, padding:"8px", borderRadius:10, border:`2px solid ${formPri===p ? pc.border : "#E5E7EB"}`, background: formPri===p ? pc.bg : "white", color: formPri===p ? pc.text : "#6B7280", fontSize:13, fontWeight: formPri===p ? 700 : 500, cursor:"pointer" }}>
                {pc.icon} {p}
              </button>
            );
          })}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:12, borderRadius:10, border:"1.5px solid #E5E7EB", background:"white", color:"#6B7280", fontSize:14, fontWeight:600, cursor:"pointer" }}>キャンセル</button>
          <button onClick={saveBn} style={{ flex:1, padding:12, borderRadius:10, border:"none", background:"var(--accent,#06C755)", color:"white", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 12px rgba(6,199,85,0.3)", opacity: formTitle.trim() ? 1 : 0.5 }}>
            {isNew ? "追加する" : "保存する"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== TASK ITEM: チェックボックス一行（ステップ内のタスク） =====
function TaskItem({ task, editable, onToggle, onRemove, onRename }) {
  const [editing, setEditing] = React.useState(false);
  const [draftTitle, setDraftTitle] = React.useState(task.title);

  function commitRename() {
    const t = draftTitle.trim();
    if (t && t !== task.title) onRename(t);
    setEditing(false);
  }

  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:"1px solid #F3F4F6", minHeight:34 }}>
      {/* チェックボックス — 常にクリック可能 */}
      <button
        onClick={onToggle}
        style={{
          width:20, height:20, borderRadius:5, flexShrink:0,
          border:`2px solid ${task.done ? "var(--accent,#22C55E)" : "#D1D5DB"}`,
          background: task.done ? "var(--accent,#22C55E)" : "white",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", padding:0, transition:"all 0.15s",
        }}
      >
        {task.done && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        )}
      </button>

      {/* タイトル（編集モード時はダブルクリックで入力） */}
      {editing ? (
        <input
          autoFocus
          value={draftTitle}
          onChange={e => setDraftTitle(e.target.value)}
          onBlur={commitRename}
          onKeyDown={e => {
            if (e.key === "Enter")  commitRename();
            if (e.key === "Escape") { setDraftTitle(task.title); setEditing(false); }
          }}
          style={{ flex:1, fontSize:13, border:"1px solid #E5E7EB", borderRadius:6, padding:"2px 8px", outline:"none" }}
        />
      ) : (
        <span
          onDoubleClick={() => editable && setEditing(true)}
          title={editable ? "ダブルクリックで編集" : ""}
          style={{
            flex:1, fontSize:13, lineHeight:1.5,
            color: task.done ? "#9CA3AF" : "#374151",
            textDecoration: task.done ? "line-through" : "none",
            cursor: editable ? "text" : "default",
            transition:"color 0.2s, text-decoration 0.2s",
          }}
        >
          {task.title}
        </span>
      )}

      {/* 削除ボタン（編集モードのみ） */}
      {editable && (
        <button
          onClick={onRemove}
          style={{ background:"none", border:"none", color:"#D1D5DB", cursor:"pointer",
                   fontSize:18, lineHeight:1, padding:"0 2px", flexShrink:0,
                   display:"flex", alignItems:"center" }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ===== TIMELINE STEP CARD =====
// 縦タイムラインの1ステップ。左レールに円とラインを配置し、右にカードを表示する。
// 状態: 未着手（白・グレー）/ 進行中（グリーンボーダー・パルスアニメ）/ 完了（グレーアウト）
const STEP_ICONS_TL = ["🎯","📋","🚀","📣","📬","✅","🔍","💬","⚙️","📊"];

function TimelineStepCard({ step, idx, isLast, editable, isMobile, onUpdate, onMove, onRemove, onToggleTask, onAddTask, onRemoveTask, onRenameTask }) {
  const isDone   = step.status === "完了";
  const isActive = step.status === "進行中";
  const tasks    = step.tasks || [];
  const doneTasks = tasks.filter(t => t.done).length;
  const assignees = step.assignees || (step.assignee ? [step.assignee] : [MEMBERS[0]]);

  const [addingTask,    setAddingTask]    = React.useState(false);
  const [newTaskTitle,  setNewTaskTitle]  = React.useState("");

  function commitAddTask() {
    const t = newTaskTitle.trim();
    if (t) onAddTask(t);
    setNewTaskTitle("");
    setAddingTask(false);
  }

  function toggleAssignee(name) {
    const next = assignees.includes(name)
      ? (assignees.length > 1 ? assignees.filter(m => m !== name) : assignees)
      : [...assignees, name];
    onUpdate({ assignees: next, assignee: next[0] });
  }

  // ステータス別スタイル
  const dotStyle = isDone
    ? { background:"#9CA3AF" }
    : isActive
      ? { background:"var(--accent,#22C55E)", animation:"workflowPulse 2s ease-in-out infinite" }
      : { background:"#E5E7EB" };

  const cardStyle = isDone
    ? { background:"#F9FAFB", border:"1px solid #E9ECEF", boxShadow:"none", opacity:0.72 }
    : isActive
      ? { background:"white", border:"2px solid var(--accent,#22C55E)", boxShadow:"0 4px 24px rgba(34,197,94,0.14)" }
      : { background:"white", border:"1px solid #E5E7EB", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" };

  const titleStyle = isDone
    ? { color:"#9CA3AF", textDecoration:"line-through" }
    : isActive
      ? { color:"#1F2937" }
      : { color:"#6B7280" };

  const lineColor = isDone ? "#D1D5DB" : "#E5E7EB";

  return (
    <div style={{ display:"flex", gap:0 }}>
      {/* ── 左レール（タイムライン縦線＋ドット） ── */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:isMobile?36:48, flexShrink:0 }}>
        {/* ステップ番号ドット */}
        <div style={{
          width:36, height:36, borderRadius:"50%", flexShrink:0, zIndex:1,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.3s ease", ...dotStyle
        }}>
          {isDone
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>
            : <span style={{ color: isActive ? "white" : "#9CA3AF", fontWeight:800, fontSize:14 }}>{idx + 1}</span>
          }
        </div>
        {/* コネクターライン */}
        {!isLast && (
          <div style={{ width:2, flex:1, minHeight:24, marginTop:4, background:lineColor, transition:"background 0.3s" }} />
        )}
      </div>

      {/* ── ステップカード ── */}
      <div style={{ flex:1, marginBottom:20, borderRadius:14, overflow:"hidden", transition:"all 0.3s ease", ...cardStyle }}>
        {/* カードヘッダー */}
        <div style={{ padding:isMobile?"12px 10px 8px":"14px 16px 10px", display:"flex", alignItems:"flex-start", gap:isMobile?8:10 }}>
          <span style={{ fontSize:20, flexShrink:0, lineHeight:1.4, opacity: isDone ? 0.5 : 1 }}>
            {STEP_ICONS_TL[idx % STEP_ICONS_TL.length]}
          </span>

          <div style={{ flex:1, minWidth:0 }}>
            {/* ステップタイトル */}
            {editable ? (
              <input
                value={step.title}
                onChange={e => onUpdate({ title: e.target.value })}
                style={{ fontSize:14, fontWeight:700, color:"#1F2937", border:"1px solid #E5E7EB",
                         borderRadius:6, padding:"4px 8px", width:"100%", outline:"none", marginBottom:6 }}
              />
            ) : (
              <div style={{ fontSize:14, fontWeight:700, marginBottom:4, transition:"all 0.2s", ...titleStyle }}>
                {step.title}
              </div>
            )}

            {/* 担当者 */}
            {editable ? (
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:4 }}>
                {MEMBERS.map(m => {
                  const sel = assignees.includes(m);
                  const mc  = MEMBER_COLORS[m] || {};
                  return (
                    <button key={m} onClick={() => toggleAssignee(m)}
                      style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 8px 3px 3px",
                               borderRadius:9999, border:`2px solid ${sel ? mc.ring||"var(--accent,#22C55E)" : "#E5E7EB"}`,
                               background: sel ? (mc.bg||"var(--accent-light,#DCFCE7)") : "white", cursor:"pointer" }}>
                      <MemberAvatar name={m} size={18} />
                      <span style={{ fontSize:11, fontWeight:sel?700:500, color:sel?(mc.text||"var(--accent-text,#15803D)"):"#6B7280" }}>{m}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
                {assignees.map((m, i) => (
                  <div key={m} style={{ display:"flex", alignItems:"center", gap:3 }}>
                    <MemberAvatar name={m} size={16} />
                    <span style={{ fontSize:11, color: isDone ? "#9CA3AF" : "#6B7280" }}>{m}</span>
                    {i < assignees.length - 1 && <span style={{ color:"#D1D5DB", fontSize:10 }}>·</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 右側：バッジ＋タスク進捗（＋PC時の編集コントロール） */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
            {isDone && (
              <span style={{ background:"#D1FAE5", color:"#059669", border:"1px solid #A7F3D0", borderRadius:9999,
                             padding:"2px 9px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>
                ✓ 完了
              </span>
            )}
            {isActive && (
              <span style={{ background:"var(--accent-light,#DCFCE7)", color:"var(--accent-text,#15803D)",
                             border:"1px solid var(--accent,#22C55E)", borderRadius:9999,
                             padding:"2px 9px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>
                ▶ 進行中
              </span>
            )}
            {tasks.length > 0 && (
              <span style={{ fontSize:11, fontWeight:600, whiteSpace:"nowrap",
                             color: isDone ? "#9CA3AF" : isActive ? "var(--accent-text,#15803D)" : "#9CA3AF" }}>
                {doneTasks}/{tasks.length}
              </span>
            )}
            {/* PC: 編集コントロールを右カラムに表示 */}
            {editable && !isMobile && (
              <div style={{ display:"flex", gap:3, marginTop:2 }}>
                <select value={step.status} onChange={e => onUpdate({ status: e.target.value })}
                  style={{ fontSize:11, border:"1px solid #E5E7EB", borderRadius:6, padding:"3px 6px", color: (STATUS_COLORS[step.status]||{}).text, background: (STATUS_COLORS[step.status]||{}).bg }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => onMove(-1)} style={{ background:"#F3F4F6", border:"none", borderRadius:4, cursor:"pointer", padding:"3px 7px", fontSize:11 }}>↑</button>
                <button onClick={() => onMove(1)}  style={{ background:"#F3F4F6", border:"none", borderRadius:4, cursor:"pointer", padding:"3px 7px", fontSize:11 }}>↓</button>
                <button onClick={onRemove}         style={{ background:"#FEE2E2", border:"none", borderRadius:4, cursor:"pointer", padding:"3px 7px", fontSize:11, color:"#DC2626" }}>✕</button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: 編集コントロールをカード下部に横並びで表示 */}
        {editable && isMobile && (
          <div style={{ display:"flex", gap:6, padding:"8px 10px", borderTop:"1px solid #F0F0F0", alignItems:"center", background:"#FAFAFA" }}>
            <select value={step.status} onChange={e => onUpdate({ status: e.target.value })}
              style={{ flex:1, fontSize:12, border:"1px solid #E5E7EB", borderRadius:7, padding:"6px 8px",
                       color:(STATUS_COLORS[step.status]||{}).text, background:(STATUS_COLORS[step.status]||{}).bg }}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => onMove(-1)} style={{ background:"#F3F4F6", border:"none", borderRadius:7, cursor:"pointer", padding:"6px 12px", fontSize:13 }}>↑</button>
            <button onClick={() => onMove(1)}  style={{ background:"#F3F4F6", border:"none", borderRadius:7, cursor:"pointer", padding:"6px 12px", fontSize:13 }}>↓</button>
            <button onClick={onRemove}         style={{ background:"#FEE2E2", border:"none", borderRadius:7, cursor:"pointer", padding:"6px 10px", fontSize:13, color:"#DC2626" }}>🗑</button>
          </div>
        )}

        {/* ── タスクリスト ── */}
        {(tasks.length > 0 || editable) && (
          <div style={{ padding:"0 16px 12px", borderTop:`1px solid ${isDone ? "#F3F4F6" : "#F0F0F0"}` }}>
            {/* タスク一覧 */}
            <div style={{ paddingTop:6 }}>
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  editable={editable}
                  onToggle={() => onToggleTask(task.id)}
                  onRemove={() => onRemoveTask(task.id)}
                  onRename={(title) => onRenameTask(task.id, title)}
                />
              ))}
              {tasks.length === 0 && !editable && (
                <div style={{ fontSize:12, color:"#D1D5DB", padding:"8px 0", textAlign:"center" }}>タスクがありません</div>
              )}
            </div>

            {/* タスク追加UI（編集モード時のみ） */}
            {editable && (
              <div style={{ marginTop:8 }}>
                {addingTask ? (
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <input
                      autoFocus
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter")  commitAddTask();
                        if (e.key === "Escape") { setAddingTask(false); setNewTaskTitle(""); }
                      }}
                      placeholder="タスク名を入力して Enter"
                      style={{ flex:1, fontSize:12, border:"1px solid var(--accent,#22C55E)", borderRadius:7,
                               padding:"6px 10px", outline:"none" }}
                    />
                    <button onClick={commitAddTask}
                      style={{ fontSize:12, padding:"6px 12px", borderRadius:7, background:"var(--accent,#22C55E)",
                               color:"white", border:"none", cursor:"pointer", fontWeight:700, whiteSpace:"nowrap" }}>
                      追加
                    </button>
                    <button onClick={() => { setAddingTask(false); setNewTaskTitle(""); }}
                      style={{ fontSize:12, padding:"6px 10px", borderRadius:7, background:"#F3F4F6",
                               color:"#6B7280", border:"none", cursor:"pointer" }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setAddingTask(true)}
                    style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#9CA3AF",
                             background:"none", border:"1.5px dashed #E5E7EB", borderRadius:8, padding:"6px 14px",
                             cursor:"pointer", width:"100%", marginTop:4, justifyContent:"center",
                             transition:"border-color 0.15s, color 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="var(--accent,#22C55E)"; e.currentTarget.style.color="var(--accent-text,#15803D)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#9CA3AF"; }}
                  >
                    <span style={{ fontSize:16, lineHeight:1 }}>+</span> タスクを追加
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== WORKFLOW PAGE =====
function WorkflowPage({ tasks, isMobile, initialFlows, initialBottlenecks, initialRelatedTasks }) {
  const [flows, setFlows] = React.useState(() =>
    (initialFlows && initialFlows.length > 0) ? initialFlows : loadFromStorage(STORAGE_KEYS.FLOWS, SAMPLE_FLOWS)
  );
  const [selectedFlowId, setSelectedFlowId] = React.useState(flows[0]?.id || null);
  const [showBuilder,    setShowBuilder]    = React.useState(false);
  const [editingFlow,    setEditingFlow]    = React.useState(null);
  const [newFlowTitle,   setNewFlowTitle]   = React.useState("");
  const [newFlowBiz,     setNewFlowBiz]     = React.useState(BUSINESSES[0]);
  const [newFlowPri,     setNewFlowPri]     = React.useState("中");
  const [editMetaFlow,   setEditMetaFlow]   = React.useState(null);
  const [showAllRT,      setShowAllRT]      = React.useState(false);

  // 関連タスク
  const RT_KEY = "kaiwai_related_tasks";
  const [relatedTasks, setRelatedTasks] = React.useState(function() {
    if (initialRelatedTasks && initialRelatedTasks.length > 0) return initialRelatedTasks;
    return loadFromStorage(RT_KEY, RELATED_TASKS);
  });
  React.useEffect(function() {
    if (initialRelatedTasks && initialRelatedTasks.length > 0) setRelatedTasks(initialRelatedTasks);
  }, [initialRelatedTasks]);

  const [rtModalOpen, setRtModalOpen] = React.useState(false);
  const [editingRt,   setEditingRt]   = React.useState(null);
  const [rtForm,      setRtForm]      = React.useState({ title:"", assignee:MEMBERS[0], dueDate:"", status:"未着手" });

  function saveRelatedTasks(updated) { setRelatedTasks(updated); saveToStorage(RT_KEY, updated); }
  function openRtNew() {
    setEditingRt(null);
    setRtForm({ title:"", assignee:MEMBERS[0], dueDate:new Date().toISOString().split("T")[0], status:"未着手" });
    setRtModalOpen(true);
  }
  function openRtEdit(rt) {
    setEditingRt(rt);
    setRtForm({ title:rt.title, assignee:rt.assignee, dueDate:rt.dueDate||"", status:rt.status });
    setRtModalOpen(true);
  }
  function saveRt() {
    if (!rtForm.title.trim()) return;
    var updated = editingRt
      ? relatedTasks.map(r => r.id===editingRt.id ? { ...r, ...rtForm } : r)
      : [...relatedTasks, { id:genId(), ...rtForm }];
    saveRelatedTasks(updated);
    setRtModalOpen(false);
  }
  function deleteRt(id) {
    if (!window.confirm("この関連タスクを削除しますか？")) return;
    saveRelatedTasks(relatedTasks.filter(r => r.id!==id));
  }

  // ボトルネック
  const BN_KEY = "kaiwai_bottlenecks";
  const [bottlenecks, setBottlenecks] = React.useState(() =>
    (initialBottlenecks && initialBottlenecks.length > 0)
      ? initialBottlenecks
      : loadFromStorage(BN_KEY, BOTTLENECKS.map(b => ({ ...b, priority:"高", resolvedAt:null })))
  );
  const [bnDetail,   setBnDetail]   = React.useState(null);
  const [bnEdit,     setBnEdit]     = React.useState(null);
  const [showBnForm, setShowBnForm] = React.useState(false);
  const [showBnAll,  setShowBnAll]  = React.useState(false);

  function saveBottlenecks(updated) { setBottlenecks(updated); saveToStorage(BN_KEY, updated); }
  function deleteBn(id) { saveBottlenecks(bottlenecks.filter(b => b.id !== id)); }
  function toggleResolved(id) {
    saveBottlenecks(bottlenecks.map(b => b.id !== id ? b : {
      ...b, resolvedAt: b.resolvedAt ? null : new Date().toISOString().split("T")[0]
    }));
  }

  const BN_ICONS = ["👥","⏰","🔒","📦","💬","⚙️","📋","🚧"];
  const BN_PRI_COLOR = BN_PRI_COLOR_GLOBAL;

  const selectedFlow = flows.find(f => f.id === selectedFlowId);

  // ── フロー保存 ──────────────────────────────────────────────────────
  function saveFlows(updated) {
    setFlows(updated);
    saveToStorage(STORAGE_KEYS.FLOWS, updated);
  }

  function addFlow() {
    if (!newFlowTitle.trim()) return;
    const newFlow = { id: genId(), title: newFlowTitle, business: newFlowBiz, priority: newFlowPri, steps: [] };
    saveFlows([...flows, newFlow]);
    setSelectedFlowId(newFlow.id);
    setNewFlowTitle("");
    setNewFlowPri("中");
    setShowBuilder(false);
    setEditingFlow(newFlow);
  }

  function updateFlowMeta(flowId, changes) {
    saveFlows(flows.map(f => f.id !== flowId ? f : { ...f, ...changes }));
  }

  function deleteFlow(flowId) {
    const updated = flows.filter(f => f.id !== flowId);
    saveFlows(updated);
    setSelectedFlowId(updated[0]?.id || null);
    setEditingFlow(null);
  }

  // ── ステップ操作 ────────────────────────────────────────────────────
  function updateStep(flowId, stepId, changes) {
    const updated = flows.map(f => f.id !== flowId ? f : {
      ...f, steps: f.steps.map(s => s.id !== stepId ? s : { ...s, ...changes })
    });
    saveFlows(updated);
    if (editingFlow?.id === flowId) setEditingFlow(updated.find(f => f.id === flowId));
  }

  function addStep(flowId) {
    const flow = flows.find(f => f.id === flowId);
    const newStep = {
      id: genId(),
      title: "新しいステップ",
      assignees: [MEMBERS[0]],
      assignee: MEMBERS[0],
      status: "未着手",
      order: flow.steps.length,
      description: "",
      tasks: [],  // タスクを空で初期化
    };
    const updated = flows.map(f => f.id !== flowId ? f : { ...f, steps: [...f.steps, newStep] });
    saveFlows(updated);
    if (editingFlow?.id === flowId) setEditingFlow(updated.find(f => f.id === flowId));
  }

  function removeStep(flowId, stepId) {
    const updated = flows.map(f => f.id !== flowId ? f : { ...f, steps: f.steps.filter(s => s.id !== stepId) });
    saveFlows(updated);
    if (editingFlow?.id === flowId) setEditingFlow(updated.find(f => f.id === flowId));
  }

  function moveStep(flowId, stepId, dir) {
    const flow = flows.find(f => f.id === flowId);
    const steps = [...flow.steps].sort((a, b) => a.order - b.order);
    const idx = steps.findIndex(s => s.id === stepId);
    if (dir === -1 && idx === 0) return;
    if (dir === 1 && idx === steps.length - 1) return;
    const swapIdx = idx + dir;
    [steps[idx].order, steps[swapIdx].order] = [steps[swapIdx].order, steps[idx].order];
    const updated = flows.map(f => f.id !== flowId ? f : { ...f, steps });
    saveFlows(updated);
    if (editingFlow?.id === flowId) setEditingFlow(updated.find(f => f.id === flowId));
  }

  // ── タスク操作 ────────────────────────────────────────────────────
  // チェックを切り替え。全タスク完了時はステップを「完了」に更新し次ステップを「進行中」へ自動遷移。
  function toggleStepTask(flowId, stepId, taskId) {
    const flow = flows.find(f => f.id === flowId);
    if (!flow) return;
    const step = flow.steps.find(s => s.id === stepId);
    if (!step) return;

    // タスクのdone状態を反転
    const updatedTasks = (step.tasks || []).map(t =>
      t.id !== taskId ? t : { ...t, done: !t.done }
    );
    const allDone  = updatedTasks.length > 0 && updatedTasks.every(t => t.done);
    const anyDone  = updatedTasks.some(t => t.done);

    // 新しいステップステータスを決定
    let newStatus = step.status;
    if (allDone) {
      newStatus = "完了";
    } else if (anyDone && step.status === "未着手") {
      newStatus = "進行中";
    } else if (!anyDone && step.status === "完了") {
      newStatus = "未着手";
    }

    // ステップリストを更新
    let updatedSteps = flow.steps.map(s =>
      s.id !== stepId ? s : { ...s, tasks: updatedTasks, status: newStatus }
    );

    // 自動進行：このステップが「完了」に変わったなら、次の「未着手」ステップを「進行中」へ
    if (allDone && step.status !== "完了") {
      const sorted = [...updatedSteps].sort((a, b) => a.order - b.order);
      const currentIdx = sorted.findIndex(s => s.id === stepId);
      if (currentIdx < sorted.length - 1) {
        const nextStep = sorted[currentIdx + 1];
        if (nextStep.status === "未着手") {
          updatedSteps = updatedSteps.map(s =>
            s.id !== nextStep.id ? s : { ...s, status: "進行中" }
          );
        }
      }
    }

    const updated = flows.map(f => f.id !== flowId ? f : { ...f, steps: updatedSteps });
    saveFlows(updated);
    if (editingFlow?.id === flowId) setEditingFlow(updated.find(f => f.id === flowId));
  }

  function addTaskToStep(flowId, stepId, title) {
    const updated = flows.map(f => f.id !== flowId ? f : {
      ...f, steps: f.steps.map(s => s.id !== stepId ? s : {
        ...s, tasks: [...(s.tasks || []), { id: genId(), title, done: false }]
      })
    });
    saveFlows(updated);
    if (editingFlow?.id === flowId) setEditingFlow(updated.find(f => f.id === flowId));
  }

  function removeTaskFromStep(flowId, stepId, taskId) {
    const updated = flows.map(f => f.id !== flowId ? f : {
      ...f, steps: f.steps.map(s => s.id !== stepId ? s : {
        ...s, tasks: (s.tasks || []).filter(t => t.id !== taskId)
      })
    });
    saveFlows(updated);
    if (editingFlow?.id === flowId) setEditingFlow(updated.find(f => f.id === flowId));
  }

  function renameStepTask(flowId, stepId, taskId, title) {
    const updated = flows.map(f => f.id !== flowId ? f : {
      ...f, steps: f.steps.map(s => s.id !== stepId ? s : {
        ...s, tasks: (s.tasks || []).map(t => t.id !== taskId ? t : { ...t, title })
      })
    });
    saveFlows(updated);
    if (editingFlow?.id === flowId) setEditingFlow(updated.find(f => f.id === flowId));
  }

  // ── 事業別進捗 ──────────────────────────────────────────────────────
  const projectProgress = BUSINESSES.map(b => {
    const bt = tasks.filter(t => t.business === b);
    return { name: b, pct: calcProgress(bt), count: bt.filter(t => t.status === "進行中").length };
  });
  const businessIcons = { "サークル間マッチング事業":"👥", "診断コンテンツ事業":"❓", "SNSメディア事業":"📣" };

  // 選択中フローのタスク完了率
  const flowProgress = selectedFlow
    ? (() => {
        const allTasks = (selectedFlow.steps || []).flatMap(s => s.tasks || []);
        if (!allTasks.length) return null;
        const done = allTasks.filter(t => t.done).length;
        return { done, total: allTasks.length, pct: Math.round(done / allTasks.length * 100) };
      })()
    : null;

  return (
    <div>
      {/* ページタイトル */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:"#1F2937", marginBottom:4 }}>ワークフロー</h1>
        <p style={{ fontSize:14, color:"#6B7280" }}>事業ごとの流れと現在地を確認できます。</p>
      </div>

      {/* 事業別進捗カード - モバイルは横スクロール・コンパクト表示 */}
      {isMobile ? (
        <div style={{ display:"flex", gap:10, marginBottom:16, overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:4 }}>
          {projectProgress.map(pp => (
            <div key={pp.name} style={{ flexShrink:0, width:150, background:"white", borderRadius:14, padding:"14px 14px", boxShadow:"0 1px 6px rgba(0,0,0,0.07)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ fontSize:18 }}>{businessIcons[pp.name]}</span>
                <span style={{ fontSize:11, fontWeight:600, color:"#1F2937", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pp.name}</span>
              </div>
              <div style={{ fontSize:26, fontWeight:800, color:"#4CAF50", marginBottom:6 }}>{pp.pct}%</div>
              <ProgressBar value={pp.pct} height={5} />
              <div style={{ fontSize:11, color:"#9CA3AF", marginTop:5 }}>進行中 {pp.count}件</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display:"flex", gap:16, marginBottom:24, flexWrap:"wrap" }}>
          {projectProgress.map(pp => (
            <div key={pp.name} style={{ flex:1, minWidth:200, background:"white", borderRadius:16, padding:"18px 20px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"#EAF7EA", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{businessIcons[pp.name]}</div>
                <span style={{ fontSize:13, fontWeight:600, color:"#1F2937", flex:1 }}>{pp.name}</span>
              </div>
              <div style={{ fontSize:32, fontWeight:800, color:"#4CAF50", marginBottom:8 }}>{pp.pct}%</div>
              <ProgressBar value={pp.pct} height={6} />
              <div style={{ fontSize:12, color:"#9CA3AF", marginTop:6 }}>進行中のタスク {pp.count}件</div>
            </div>
          ))}
        </div>
      )}

      {/* フロー選択 + 新規作成 - モバイルは横スクロール */}
      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center",
                    overflowX: isMobile ? "auto" : "visible",
                    flexWrap: isMobile ? "nowrap" : "wrap",
                    WebkitOverflowScrolling:"touch", paddingBottom: isMobile ? 2 : 0 }}>
        {flows.map(f => {
          const active = selectedFlowId === f.id;
          const pc = f.priority ? FLOW_PRI_COLORS[f.priority] : null;
          return (
            <button key={f.id} onClick={() => { setSelectedFlowId(f.id); setEditingFlow(null); }}
              style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", borderRadius:9999,
                       border:`2px solid ${active ? (pc ? pc.activeBorder : "#4CAF50") : "#E5E7EB"}`,
                       background: active ? (pc ? pc.bg : "#EAF7EA") : "white",
                       color: active ? (pc ? pc.text : "#4CAF50") : "#6B7280",
                       fontWeight: active ? 700 : 500, fontSize:13, cursor:"pointer", transition:"all 0.15s" }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background: pc ? pc.dot : "#D1D5DB", flexShrink:0, display:"inline-block" }} />
              {f.title}
              {f.priority && (
                <span style={{ fontSize:10, fontWeight:700, padding:"1px 5px", borderRadius:9999,
                               background: active ? "rgba(255,255,255,0.6)" : (pc ? pc.bg : "#F3F4F6"),
                               color: pc ? pc.text : "#6B7280", border:"1px solid " + (pc ? pc.border : "#E5E7EB") }}>
                  {f.priority}
                </span>
              )}
            </button>
          );
        })}
        <button onClick={() => setShowBuilder(!showBuilder)}
          style={{ padding:"8px 16px", borderRadius:9999, border:"2px dashed #D1D5DB", background:"white",
                   color:"#6B7280", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:16 }}>+</span> 新しいフロー
        </button>
      </div>

      {/* 新規フロー作成フォーム - モバイルは縦積み */}
      {showBuilder && (
        <div style={{ background:"white", borderRadius:14, padding:isMobile?"14px 14px":"18px 20px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)", marginBottom:16 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:12 }}>
            <input value={newFlowTitle} onChange={e => setNewFlowTitle(e.target.value)} placeholder="フロー名を入力..."
              style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:8, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor="#4CAF50"} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            <input value={newFlowBiz} onChange={e => setNewFlowBiz(e.target.value)} list="flow-biz-dl" placeholder="事業名"
              style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:8, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor="#4CAF50"} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            <datalist id="flow-biz-dl">{BUSINESSES.map(b => <option key={b} value={b}/>)}</datalist>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:12 }}>
            <span style={{ fontSize:12, fontWeight:600, color:"#6B7280", whiteSpace:"nowrap" }}>優先度：</span>
            {["高","中","低"].map(p => {
              const pc = FLOW_PRI_COLORS[p];
              const sel = newFlowPri === p;
              return (
                <button key={p} onClick={() => setNewFlowPri(p)} style={{ padding:"6px 14px", borderRadius:9999, border:"2px solid " + (sel ? pc.activeBorder : "#E5E7EB"), background: sel ? pc.bg : "white", color: sel ? pc.text : "#6B7280", fontSize:13, fontWeight: sel?700:500, cursor:"pointer" }}>
                  {pc.badge}
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setShowBuilder(false)} style={{ flex:1, padding:"10px", borderRadius:8, background:"#F3F4F6", color:"#6B7280", border:"none", fontSize:14, cursor:"pointer" }}>キャンセル</button>
            <button onClick={addFlow} style={{ flex:1, padding:"10px", borderRadius:8, background:"#4CAF50", color:"white", border:"none", fontSize:14, fontWeight:700, cursor:"pointer" }}>作成</button>
          </div>
        </div>
      )}

      {/* メインエリア：タイムライン + サイドパネル */}
      {selectedFlow && (
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap:16 }}>
          {/* タイムラインカラム */}
          <div style={{ background:"white", borderRadius:16, padding:isMobile?"16px 14px":"24px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)" }}>
            {/* フロータイトル + 操作ボタン */}
            <div style={{ marginBottom:isMobile?14:20 }}>
              {/* タイトル行 */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <h2 style={{ fontSize:isMobile?15:17, fontWeight:700, color:"#1F2937", margin:0 }}>{selectedFlow.title}</h2>
                    {selectedFlow.priority && (() => {
                      const pc = FLOW_PRI_COLORS[selectedFlow.priority];
                      return <span style={{ fontSize:10, fontWeight:700, color:pc.text, background:pc.bg, border:"1px solid " + pc.border, borderRadius:9999, padding:"2px 8px", whiteSpace:"nowrap" }}>{pc.badge}</span>;
                    })()}
                  </div>
                  {selectedFlow.business && <div style={{ fontSize:11, color:"#9CA3AF", marginTop:3 }}>{selectedFlow.business}</div>}
                </div>
                {/* ボタン群 */}
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={() => setEditMetaFlow(selectedFlow)}
                    style={{ padding:isMobile?"7px 9px":"6px 10px", borderRadius:8, border:"1.5px solid #E5E7EB", background:"white", color:"#6B7280", fontSize:13, cursor:"pointer" }}>
                    ⚙️
                  </button>
                  <button onClick={() => setEditingFlow(editingFlow ? null : selectedFlow)}
                    style={{ padding:isMobile?"7px 10px":"6px 14px", borderRadius:8, border:"1.5px solid #4CAF50",
                             background: editingFlow ? "#EAF7EA" : "white", color:"#4CAF50", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                    {editingFlow ? "✓ 完了" : "✏️ 編集"}
                  </button>
                  {editingFlow && (
                    <button onClick={() => addStep(selectedFlow.id)}
                      style={{ padding:isMobile?"7px 10px":"6px 14px", borderRadius:8, border:"none", background:"#4CAF50", color:"white", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                      {isMobile ? "+ ステップ" : "+ ステップ追加"}
                    </button>
                  )}
                </div>
              </div>
              {/* 全体タスク進捗バー */}
              {flowProgress && (
                <div style={{ marginTop:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:"#9CA3AF" }}>タスク全体の進捗</span>
                    <span style={{ fontSize:11, fontWeight:700, color:"var(--accent-text,#15803D)" }}>
                      {flowProgress.done}/{flowProgress.total}完了（{flowProgress.pct}%）
                    </span>
                  </div>
                  <ProgressBar value={flowProgress.pct} height={6} />
                </div>
              )}
            </div>

            {/* タイムライン本体 */}
            <div style={{ maxWidth:560, margin:"0 auto" }}>
              {[...selectedFlow.steps].sort((a,b) => a.order - b.order).map((step, idx, arr) => (
                <TimelineStepCard
                  key={step.id}
                  step={step}
                  idx={idx}
                  isLast={idx === arr.length - 1}
                  editable={!!editingFlow}
                  isMobile={isMobile}
                  onUpdate={(c) => updateStep(selectedFlow.id, step.id, c)}
                  onMove={(d) => moveStep(selectedFlow.id, step.id, d)}
                  onRemove={() => removeStep(selectedFlow.id, step.id)}
                  onToggleTask={(taskId) => toggleStepTask(selectedFlow.id, step.id, taskId)}
                  onAddTask={(title) => addTaskToStep(selectedFlow.id, step.id, title)}
                  onRemoveTask={(taskId) => removeTaskFromStep(selectedFlow.id, step.id, taskId)}
                  onRenameTask={(taskId, title) => renameStepTask(selectedFlow.id, step.id, taskId, title)}
                />
              ))}
              {selectedFlow.steps.length === 0 && (
                <div style={{ textAlign:"center", padding:"48px 0", color:"#9CA3AF", fontSize:14 }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
                  ステップを追加してください
                  <br/>
                  <button onClick={() => { setEditingFlow(selectedFlow); addStep(selectedFlow.id); }}
                    style={{ marginTop:12, padding:"9px 20px", borderRadius:9, background:"#4CAF50", color:"white", border:"none", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                    + ステップ追加
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* サイドパネル（関連タスク + ボトルネック） */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* 関連タスク */}
            <div style={{ background:"white", borderRadius:16, padding:"20px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <span style={{ fontWeight:700, fontSize:15, color:"#1F2937" }}>関連タスク</span>
                <button onClick={openRtNew}
                  style={{ fontSize:12, color:"white", background:"var(--accent,#06C755)", border:"none",
                           borderRadius:9999, padding:"3px 10px", fontWeight:700, cursor:"pointer" }}>
                  ＋ 追加
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {relatedTasks.length===0 && <div style={{ color:"#9CA3AF",fontSize:13 }}>関連タスクがありません</div>}
                {(showAllRT ? relatedTasks : relatedTasks.slice(0,3)).map(rt => (
                  <div key={rt.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderBottom:"1px solid #F9FAFB" }}>
                    <span style={{ width:6,height:6,borderRadius:"50%",background:"#4CAF50",display:"inline-block",flexShrink:0 }}></span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:500, color:"#1F2937", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{rt.title}</div>
                      <div style={{ fontSize:11, color:"#9CA3AF", display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                        <MemberAvatar name={rt.assignee} size={14} />
                        {rt.assignee} · {formatDate(rt.dueDate)}
                      </div>
                    </div>
                    <StatusBadge status={rt.status} />
                    <button onClick={() => openRtEdit(rt)} style={{ background:"var(--accent-light,#E9FBEF)",border:"none",borderRadius:6,padding:"3px 7px",fontSize:11,color:"var(--accent,#06C755)",cursor:"pointer" }}>編集</button>
                    <button onClick={() => deleteRt(rt.id)} style={{ background:"#FEE2E2",border:"none",borderRadius:6,padding:"3px 6px",fontSize:11,color:"#DC2626",cursor:"pointer" }}>✕</button>
                  </div>
                ))}
              </div>
              {relatedTasks.length > 3 && (
                <button onClick={() => setShowAllRT(v=>!v)} style={{ width:"100%", marginTop:10, padding:"7px", border:"1px solid #E5E7EB", borderRadius:8, background:"white", color:"#6B7280", fontSize:12, cursor:"pointer" }}>
                  {showAllRT ? "閉じる ↑" : `すべて見る（${relatedTasks.length}件）`}
                </button>
              )}
            </div>

            {/* ボトルネック */}
            <div style={{ background:"white", borderRadius:16, padding:"20px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontWeight:700, fontSize:15, color:"#1F2937" }}>現在のボトルネック</span>
                  <span style={{ fontSize:16 }}>⚠️</span>
                  <span style={{ fontSize:11, fontWeight:700, color:"white", background:"#EF4444", borderRadius:9999, padding:"1px 7px" }}>
                    {bottlenecks.filter(b=>!b.resolvedAt).length}
                  </span>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={() => setShowBnAll(true)} style={{ fontSize:12, color:"var(--accent,#06C755)", background:"var(--accent-light,#E9FBEF)", border:"1px solid var(--accent,#06C755)", borderRadius:9999, padding:"3px 10px", fontWeight:700, cursor:"pointer" }}>詳細</button>
                  <button onClick={() => { setBnEdit(null); setShowBnForm(true); }} style={{ fontSize:12, color:"white", background:"var(--accent,#06C755)", border:"none", borderRadius:9999, padding:"3px 10px", fontWeight:700, cursor:"pointer" }}>＋ 追加</button>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {bottlenecks.filter(b=>!b.resolvedAt).slice(0,3).map((b, i) => {
                  const pc = BN_PRI_COLOR[b.priority] || BN_PRI_COLOR["中"];
                  return (
                    <div key={b.id} style={{ display:"flex", gap:10, padding:"10px 12px", background:pc.bg, borderRadius:10, border:`1px solid ${pc.border}`, alignItems:"center" }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{BN_ICONS[i % BN_ICONS.length]}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                          <span style={{ fontSize:10, fontWeight:700, color:pc.text, background:"white", border:`1px solid ${pc.border}`, borderRadius:9999, padding:"1px 6px", flexShrink:0 }}>{pc.icon} {b.priority}</span>
                          <div style={{ fontSize:13, fontWeight:700, color:"#1F2937", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.title}</div>
                        </div>
                        <div style={{ fontSize:12, color:"#6B7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.desc}</div>
                      </div>
                      <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                        <button onClick={() => { setBnEdit(b); setShowBnForm(true); }} style={{ fontSize:11, color:"#6B7280", background:"#F3F4F6", border:"none", borderRadius:6, padding:"3px 9px", cursor:"pointer" }}>編集</button>
                        <button onClick={() => setBnDetail(b)} style={{ fontSize:11, color:pc.text, background:"white", border:`1px solid ${pc.border}`, borderRadius:6, padding:"3px 9px", cursor:"pointer" }}>詳細</button>
                      </div>
                    </div>
                  );
                })}
                {bottlenecks.filter(b=>!b.resolvedAt).length === 0 && (
                  <div style={{ textAlign:"center", padding:"16px 0", color:"var(--accent,#06C755)", fontSize:13, fontWeight:600 }}>
                    ✅ 現在ボトルネックはありません
                  </div>
                )}
              </div>
              {bottlenecks.filter(b=>!b.resolvedAt).length > 3 && (
                <button onClick={() => setShowBnAll(true)} style={{ width:"100%", marginTop:10, padding:"7px", border:"1px solid #E5E7EB", borderRadius:8, background:"white", color:"#6B7280", fontSize:12, cursor:"pointer" }}>
                  すべて見る（{bottlenecks.filter(b=>!b.resolvedAt).length}件）
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── モーダル群 ─────────────────────────────────────────────── */}

      {/* ボトルネック詳細 */}
      {bnDetail && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }} onClick={() => setBnDetail(null)}>
          <div style={{ background:"white", borderRadius:20, padding:"28px 32px", maxWidth:440, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:28 }}>{BN_ICONS[bottlenecks.findIndex(b=>b.id===bnDetail.id) % BN_ICONS.length]}</span>
                <div>
                  <div style={{ fontSize:17, fontWeight:800, color:"#1F2937" }}>{bnDetail.title}</div>
                  <span style={{ fontSize:11, fontWeight:700, color: BN_PRI_COLOR[bnDetail.priority]?.text, background: BN_PRI_COLOR[bnDetail.priority]?.bg, border:`1px solid ${BN_PRI_COLOR[bnDetail.priority]?.border}`, borderRadius:9999, padding:"1px 8px" }}>
                    {BN_PRI_COLOR[bnDetail.priority]?.icon} 優先度: {bnDetail.priority}
                  </span>
                </div>
              </div>
              <button onClick={() => setBnDetail(null)} style={{ background:"#F3F4F6", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:14, color:"#6B7280" }}>✕</button>
            </div>
            <div style={{ background:"#F8FAF8", borderRadius:12, padding:"14px 16px", marginBottom:16, fontSize:14, color:"#374151", lineHeight:1.7 }}>{bnDetail.desc}</div>
            {bnDetail.resolvedAt && <div style={{ fontSize:12, color:"var(--accent,#06C755)", fontWeight:600, marginBottom:12 }}>✅ 解決済み（{formatDate(bnDetail.resolvedAt)}）</div>}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { toggleResolved(bnDetail.id); setBnDetail(null); }} style={{ flex:1, padding:"10px", borderRadius:10, border:"none", background: bnDetail.resolvedAt ? "#F3F4F6" : "var(--accent,#06C755)", color: bnDetail.resolvedAt ? "#6B7280" : "white", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                {bnDetail.resolvedAt ? "未解決に戻す" : "✅ 解決済みにする"}
              </button>
              <button onClick={() => { setBnEdit(bnDetail); setBnDetail(null); setShowBnForm(true); }} style={{ flex:1, padding:"10px", borderRadius:10, border:"1.5px solid #E5E7EB", background:"white", color:"#374151", fontSize:13, fontWeight:600, cursor:"pointer" }}>✏️ 編集する</button>
              <button onClick={() => { deleteBn(bnDetail.id); setBnDetail(null); }} style={{ padding:"10px 14px", borderRadius:10, border:"none", background:"#FEE2E2", color:"#DC2626", fontSize:13, fontWeight:600, cursor:"pointer" }}>🗑</button>
            </div>
          </div>
        </div>
      )}

      {/* ボトルネック一覧 */}
      {showBnAll && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }} onClick={() => setShowBnAll(false)}>
          <div style={{ background:"white", borderRadius:20, padding:"28px 32px", maxWidth:560, width:"100%", maxHeight:"80vh", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <span style={{ fontSize:18, fontWeight:800, color:"#1F2937" }}>⚠️ ボトルネック一覧</span>
              <button onClick={() => setShowBnAll(false)} style={{ background:"#F3F4F6", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:14, color:"#6B7280" }}>✕</button>
            </div>
            {[false, true].map(resolved => {
              const list = bottlenecks.filter(b => !!b.resolvedAt === resolved);
              if (list.length === 0) return null;
              return (
                <div key={String(resolved)} style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#9CA3AF", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                    {resolved ? "✅ 解決済み" : "🔴 未解決"}（{list.length}件）
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {list.map((b, i) => {
                      const pc = BN_PRI_COLOR[b.priority] || BN_PRI_COLOR["中"];
                      return (
                        <div key={b.id} style={{ display:"flex", gap:10, padding:"12px 14px", background: resolved ? "#F9FAFB" : pc.bg, borderRadius:12, border:`1px solid ${resolved ? "#E5E7EB" : pc.border}`, alignItems:"flex-start", opacity: resolved ? 0.75 : 1 }}>
                          <span style={{ fontSize:18, flexShrink:0 }}>{BN_ICONS[i % BN_ICONS.length]}</span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:700, color:"#1F2937", marginBottom:3, textDecoration: resolved ? "line-through" : "none" }}>{b.title}</div>
                            <div style={{ fontSize:12, color:"#6B7280" }}>{b.desc}</div>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end", flexShrink:0 }}>
                            <span style={{ fontSize:10, fontWeight:700, color:pc.text, background:"white", border:`1px solid ${pc.border}`, borderRadius:9999, padding:"1px 7px" }}>{pc.icon} {b.priority}</span>
                            <div style={{ display:"flex", gap:4 }}>
                              <button onClick={() => toggleResolved(b.id)} style={{ fontSize:10, color:"#6B7280", background:"#F3F4F6", border:"none", borderRadius:4, padding:"2px 7px", cursor:"pointer" }}>{resolved ? "未解決に戻す" : "解決済み"}</button>
                              <button onClick={() => { setShowBnAll(false); setBnDetail(b); }} style={{ fontSize:10, color:pc.text, background:pc.bg, border:"none", borderRadius:4, padding:"2px 7px", cursor:"pointer" }}>詳細</button>
                              <button onClick={() => deleteBn(b.id)} style={{ fontSize:10, color:"#DC2626", background:"#FEE2E2", border:"none", borderRadius:4, padding:"2px 7px", cursor:"pointer" }}>削除</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <button onClick={() => { setShowBnAll(false); setBnEdit(null); setShowBnForm(true); }} style={{ marginTop:"auto", padding:"10px", borderRadius:10, border:"none", background:"var(--accent,#06C755)", color:"white", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              ＋ 新しいボトルネックを追加
            </button>
          </div>
        </div>
      )}

      {/* ボトルネック追加・編集フォーム */}
      {showBnForm && (
        <BnFormModal
          bnEdit={bnEdit}
          bottlenecks={bottlenecks}
          saveBottlenecks={saveBottlenecks}
          onClose={() => { setShowBnForm(false); setBnEdit(null); }}
        />
      )}

      {/* フローメタ編集 */}
      {editMetaFlow && (
        <FlowMetaModal
          flow={editMetaFlow}
          onSave={(changes) => updateFlowMeta(editMetaFlow.id, changes)}
          onDelete={() => deleteFlow(editMetaFlow.id)}
          onClose={() => setEditMetaFlow(null)}
        />
      )}

      {/* 関連タスク 追加・編集モーダル */}
      {rtModalOpen && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16 }}>
          <div style={{ background:"white",borderRadius:20,padding:"28px 32px",maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize:17,fontWeight:700,color:"#1F2937",marginBottom:20 }}>{editingRt ? "関連タスクを編集" : "＋ 関連タスクを追加"}</h3>
            <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>タスク名 <span style={{ color:"#EF4444" }}>*</span></label>
            <input value={rtForm.title} onChange={e=>setRtForm(f=>({...f,title:e.target.value}))} placeholder="例：ターゲットサークル候補をリスト化" style={{ width:"100%",border:"1.5px solid #E5E7EB",borderRadius:10,padding:"10px 12px",fontSize:13,outline:"none",marginBottom:14,boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor="var(--accent,#06C755)"} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            <label style={{ fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6 }}>担当者</label>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
              {MEMBERS.map(m => {
                var sel = rtForm.assignee===m;
                var mc = MEMBER_COLORS[m]||{};
                return (
                  <button key={m} onClick={()=>setRtForm(f=>({...f,assignee:m}))} style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 10px 4px 4px",borderRadius:9999,border:`2px solid ${sel?mc.ring||"var(--accent,#06C755)":"#E5E7EB"}`,background:sel?(mc.bg||"var(--accent-light,#E9FBEF)"):"white",cursor:"pointer" }}>
                    <MemberAvatar name={m} size={20} />
                    <span style={{ fontSize:12,fontWeight:sel?700:500,color:sel?(mc.text||"var(--accent-text,#065F46)"):"#6B7280" }}>{m}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
              <div>
                <label style={{ fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4 }}>期限</label>
                <input type="date" value={rtForm.dueDate} onChange={e=>setRtForm(f=>({...f,dueDate:e.target.value}))} style={{ width:"100%",border:"1.5px solid #E5E7EB",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4 }}>ステータス</label>
                <select value={rtForm.status} onChange={e=>setRtForm(f=>({...f,status:e.target.value}))} style={{ width:"100%",border:"1.5px solid #E5E7EB",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none" }}>
                  {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>setRtModalOpen(false)} style={{ flex:1,padding:12,borderRadius:10,border:"1.5px solid #E5E7EB",background:"white",color:"#6B7280",fontSize:14,fontWeight:600,cursor:"pointer" }}>キャンセル</button>
              <button onClick={saveRt} style={{ flex:1,padding:12,borderRadius:10,border:"none",background:"var(--accent,#06C755)",color:"white",fontSize:14,fontWeight:700,cursor:"pointer" }}>{editingRt?"保存する":"追加する"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.WorkflowPage = WorkflowPage;
window.BnFormModal  = BnFormModal;
