const BN_PRI_COLOR_GLOBAL = {
  "高":{ bg:"#FEF2F2", border:"#FECACA", text:"#DC2626", icon:"🔴" },
  "中":{ bg:"#FFF7ED", border:"#FED7AA", text:"#EA580C", icon:"🟡" },
  "低":{ bg:"#EFF6FF", border:"#BFDBFE", text:"#2563EB", icon:"🔵" },
};
const BN_PRIORITIES_GLOBAL = ["高","中","低"];

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

function WorkflowPage({ tasks, isMobile, initialFlows, initialBottlenecks }) {
  const [flows, setFlows] = React.useState(() =>
    (initialFlows && initialFlows.length > 0) ? initialFlows : loadFromStorage(STORAGE_KEYS.FLOWS, SAMPLE_FLOWS)
  );
  const [selectedFlowId, setSelectedFlowId] = React.useState(flows[0]?.id || null);
  const [showBuilder, setShowBuilder] = React.useState(false);
  const [editingFlow, setEditingFlow] = React.useState(null);
  const [newFlowTitle, setNewFlowTitle] = React.useState("");
  const [newFlowBiz, setNewFlowBiz] = React.useState(BUSINESSES[0]);
  const [showAllRT, setShowAllRT] = React.useState(false);

  // ── Bottleneck state ──────────────────────────────────────────
  const BN_KEY = "kaiwai_bottlenecks";
  const [bottlenecks, setBottlenecks] = React.useState(() =>
    (initialBottlenecks && initialBottlenecks.length > 0)
      ? initialBottlenecks
      : loadFromStorage(BN_KEY, BOTTLENECKS.map(b => ({ ...b, priority:"高", resolvedAt:null })))
  );
  const [bnDetail, setBnDetail]     = React.useState(null);   // item being viewed
  const [bnEdit, setBnEdit]         = React.useState(null);   // item being edited (null = new)
  const [showBnForm, setShowBnForm] = React.useState(false);  // show add/edit form
  const [showBnAll, setShowBnAll]   = React.useState(false);  // detail modal

  function saveBottlenecks(updated) {
    setBottlenecks(updated);
    saveToStorage(BN_KEY, updated);
  }

  function deleteBn(id) { saveBottlenecks(bottlenecks.filter(b => b.id !== id)); }
  function toggleResolved(id) {
    saveBottlenecks(bottlenecks.map(b => b.id !== id ? b : {
      ...b, resolvedAt: b.resolvedAt ? null : new Date().toISOString().split("T")[0]
    }));
  }

  const BN_ICONS = ["👥","⏰","🔒","📦","💬","⚙️","📋","🚧"];
  const BN_PRI_COLOR = BN_PRI_COLOR_GLOBAL;
  const BN_PRIORITIES = BN_PRIORITIES_GLOBAL;

  const selectedFlow = flows.find(f => f.id === selectedFlowId);

  function saveFlows(updated) {
    setFlows(updated);
    saveToStorage(STORAGE_KEYS.FLOWS, updated);
  }

  function addFlow() {
    if (!newFlowTitle.trim()) return;
    const newFlow = { id: genId(), title: newFlowTitle, business: newFlowBiz, steps: [] };
    saveFlows([...flows, newFlow]);
    setSelectedFlowId(newFlow.id);
    setNewFlowTitle("");
    setShowBuilder(false);
    setEditingFlow(newFlow);
  }

  function updateStep(flowId, stepId, changes) {
    const updated = flows.map(f => f.id !== flowId ? f : {
      ...f, steps: f.steps.map(s => s.id !== stepId ? s : { ...s, ...changes })
    });
    saveFlows(updated);
    if (editingFlow?.id === flowId) setEditingFlow(updated.find(f => f.id === flowId));
  }

  function addStep(flowId) {
    const flow = flows.find(f => f.id === flowId);
    const newStep = { id: genId(), title: "新しいステップ", assignees: [MEMBERS[0]], status: "未着手", relatedTaskIds: [], order: flow.steps.length, description: "" };
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

  const projectProgress = BUSINESSES.map(b => {
    const bt = tasks.filter(t => t.business === b);
    return { name: b, pct: calcProgress(bt), count: bt.filter(t => t.status === "進行中").length };
  });

  const businessIcons = { "サークル間マッチング事業":"👥", "診断コンテンツ事業":"❓", "SNSメディア事業":"📣" };
  const stepIcons = ["👥","📸","📝","✈️","📬","✅","🔍","⚙️","📊"];

  function FlowStepCard({ step, idx, flowId, editable }) {
    const c = STATUS_COLORS[step.status] || {};
    // Support both legacy `assignee` (string) and new `assignees` (array)
    const assignees = step.assignees || (step.assignee ? [step.assignee] : [MEMBERS[0]]);

    function toggleAssignee(name) {
      const current = step.assignees || [step.assignee || MEMBERS[0]];
      const next = current.includes(name)
        ? current.length > 1 ? current.filter(m => m !== name) : current  // keep at least 1
        : [...current, name];
      updateStep(flowId, step.id, { assignees: next, assignee: next[0] });
    }

    return (
      <div>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 18px", background:"white", borderRadius:14, boxShadow:"0 1px 6px rgba(0,0,0,0.07)", border:`1px solid ${c.border || "#E5E7EB"}` }}>
          {/* Step number */}
          <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--accent,#06C755)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, flexShrink:0, marginTop:2 }}>{idx + 1}</div>
          {/* Icon */}
          <div style={{ width:40, height:40, borderRadius:10, background:"var(--accent-light,#E9FBEF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
            {stepIcons[idx % stepIcons.length]}
          </div>
          {/* Content */}
          <div style={{ flex:1, minWidth:0 }}>
            {editable ? (
              <input value={step.title} onChange={e => updateStep(flowId, step.id, { title: e.target.value })} style={{ fontSize:14, fontWeight:600, color:"#1F2937", border:"1px solid #E5E7EB", borderRadius:6, padding:"4px 8px", width:"100%", outline:"none", marginBottom:8 }} />
            ) : (
              <div style={{ fontSize:14, fontWeight:600, color:"#1F2937", marginBottom:4 }}>{step.title}</div>
            )}

            {/* Assignees */}
            {editable ? (
              <div>
                <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:5, fontWeight:600 }}>担当者（複数選択可）</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {MEMBERS.map(m => {
                    const sel = assignees.includes(m);
                    const mc = MEMBER_COLORS[m] || {};
                    return (
                      <button key={m} onClick={() => toggleAssignee(m)} title={m} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 8px 4px 4px", borderRadius:9999, border:`2px solid ${sel ? mc.ring || "var(--accent,#06C755)" : "#E5E7EB"}`, background: sel ? (mc.bg || "var(--accent-light,#E9FBEF)") : "white", cursor:"pointer", transition:"all 0.15s", position:"relative" }}>
                        <MemberAvatar name={m} size={20} />
                        <span style={{ fontSize:11, fontWeight: sel ? 700 : 500, color: sel ? (mc.text || "var(--accent-text,#065F46)") : "#6B7280" }}>{m}</span>
                        {sel && (
                          <span style={{ position:"absolute", top:-4, right:-4, width:14, height:14, borderRadius:"50%", background: mc.ring || "var(--accent,#06C755)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
                {assignees.map((m, i) => (
                  <div key={m} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <MemberAvatar name={m} size={18} />
                    <span style={{ fontSize:12, color:"#6B7280" }}>{m}</span>
                    {i < assignees.length - 1 && <span style={{ fontSize:11, color:"#D1D5DB" }}>·</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
            {editable ? (
              <select value={step.status} onChange={e => updateStep(flowId, step.id, { status: e.target.value })} style={{ fontSize:12, border:"1px solid #E5E7EB", borderRadius:8, padding:"4px 8px", color:c.text, background:c.bg }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <StatusBadge status={step.status} />
            )}
            {editable && (
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={() => moveStep(flowId, step.id, -1)} style={{ background:"#F3F4F6", border:"none", borderRadius:4, cursor:"pointer", padding:"2px 8px", fontSize:12 }}>↑</button>
                <button onClick={() => moveStep(flowId, step.id, 1)} style={{ background:"#F3F4F6", border:"none", borderRadius:4, cursor:"pointer", padding:"2px 8px", fontSize:12 }}>↓</button>
                <button onClick={() => removeStep(flowId, step.id)} style={{ background:"#FEE2E2", border:"none", borderRadius:4, cursor:"pointer", padding:"2px 8px", fontSize:12, color:"#DC2626" }}>✕</button>
              </div>
            )}
          </div>
        </div>
        {/* Arrow */}
        <div style={{ display:"flex", justifyContent:"center", padding:"6px 0" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:"#1F2937", marginBottom:4 }}>ワークフロー</h1>
        <p style={{ fontSize:14, color:"#6B7280" }}>事業ごとの流れと現在地を確認できます。</p>
      </div>

      {/* Project Progress Cards */}
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

      {/* Flow selector + builder toggle */}
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        {flows.map(f => (
          <button key={f.id} onClick={() => { setSelectedFlowId(f.id); setEditingFlow(null); }} style={{ padding:"8px 18px", borderRadius:9999, border:`2px solid ${selectedFlowId === f.id ? "#4CAF50" : "#E5E7EB"}`, background: selectedFlowId === f.id ? "#EAF7EA" : "white", color: selectedFlowId === f.id ? "#4CAF50" : "#6B7280", fontWeight: selectedFlowId === f.id ? 700 : 500, fontSize:13, cursor:"pointer" }}>
            {f.title}
          </button>
        ))}
        <button onClick={() => setShowBuilder(!showBuilder)} style={{ padding:"8px 18px", borderRadius:9999, border:"2px dashed #D1D5DB", background:"white", color:"#6B7280", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:16 }}>+</span> 新しいフロー
        </button>
      </div>

      {/* New Flow Form */}
      {showBuilder && (
        <div style={{ background:"white", borderRadius:14, padding:"16px 20px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)", marginBottom:20, display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
          <input value={newFlowTitle} onChange={e => setNewFlowTitle(e.target.value)} placeholder="フロー名を入力..." style={{ flex:1, minWidth:200, border:"1.5px solid #E5E7EB", borderRadius:8, padding:"8px 12px", fontSize:13, outline:"none" }} />
          <select value={newFlowBiz} onChange={e => setNewFlowBiz(e.target.value)} style={{ border:"1.5px solid #E5E7EB", borderRadius:8, padding:"8px 12px", fontSize:13 }}>
            {BUSINESSES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button onClick={addFlow} style={{ padding:"8px 20px", borderRadius:8, background:"#4CAF50", color:"white", border:"none", fontSize:13, fontWeight:700, cursor:"pointer" }}>作成</button>
          <button onClick={() => setShowBuilder(false)} style={{ padding:"8px 14px", borderRadius:8, background:"#F3F4F6", color:"#6B7280", border:"none", fontSize:13, cursor:"pointer" }}>キャンセル</button>
        </div>
      )}

      {/* Main area: Flow + Related Tasks + Bottlenecks */}
      {selectedFlow && (
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 360px", gap:16 }}>
          {/* Flowchart */}
          <div style={{ background:"white", borderRadius:16, padding:"24px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:"#1F2937" }}>{selectedFlow.title}</h2>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setEditingFlow(editingFlow ? null : selectedFlow)} style={{ padding:"6px 14px", borderRadius:8, border:"1.5px solid #4CAF50", background: editingFlow ? "#EAF7EA" : "white", color:"#4CAF50", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                  {editingFlow ? "編集中" : "✏️ 編集"}
                </button>
                {editingFlow && (
                  <button onClick={() => addStep(selectedFlow.id)} style={{ padding:"6px 14px", borderRadius:8, border:"none", background:"#4CAF50", color:"white", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                    + ステップ追加
                  </button>
                )}
              </div>
            </div>
            <div style={{ maxWidth:540, margin:"0 auto" }}>
              {[...selectedFlow.steps].sort((a,b) => a.order - b.order).map((step, idx, arr) => (
                <div key={step.id}>
                  <FlowStepCard step={step} idx={idx} flowId={selectedFlow.id} editable={!!editingFlow} />
                  {idx === arr.length - 1 && <div style={{ height:16 }}></div>}
                </div>
              ))}
              {selectedFlow.steps.length === 0 && (
                <div style={{ textAlign:"center", padding:"40px 0", color:"#9CA3AF", fontSize:14 }}>
                  ステップを追加してください
                  <br />
                  <button onClick={() => addStep(selectedFlow.id)} style={{ marginTop:12, padding:"8px 18px", borderRadius:8, background:"#4CAF50", color:"white", border:"none", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                    + ステップ追加
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Related Tasks */}
            <div style={{ background:"white", borderRadius:16, padding:"20px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <span style={{ fontWeight:700, fontSize:15, color:"#1F2937" }}>関連タスク</span>
                <SeeAllBtn expanded={showAllRT} count={RELATED_TASKS.length} limit={3} onToggle={() => setShowAllRT(v=>!v)} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(showAllRT ? RELATED_TASKS : RELATED_TASKS.slice(0,3)).map(rt => (
                  <div key={rt.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderBottom:"1px solid #F9FAFB" }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:"#4CAF50", display:"inline-block", flexShrink:0 }}></span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:500, color:"#1F2937", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{rt.title}</div>
                      <div style={{ fontSize:11, color:"#9CA3AF", display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                        <MemberAvatar name={rt.assignee} size={14} />
                        {rt.assignee} · {formatDate(rt.dueDate)}
                      </div>
                    </div>
                    <StatusBadge status={rt.status} />
                  </div>
                ))}
              </div>
              <button style={{ width:"100%", marginTop:12, padding:"8px", border:"1px solid #E5E7EB", borderRadius:8, background:"white", color:"#6B7280", fontSize:12, cursor:"pointer" }}>タスク一覧を開く ›</button>
            </div>

            {/* Bottlenecks */}
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

              {/* List (open items only, max 3) */}
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
                        <button onClick={() => { setBnEdit(b); setShowBnForm(true); }} style={{ fontSize:11, color:"#6B7280", background:"#F3F4F6", border:"none", borderRadius:6, padding:"3px 9px", cursor:"pointer", whiteSpace:"nowrap" }}>編集</button>
                        <button onClick={() => setBnDetail(b)} style={{ fontSize:11, color:pc.text, background:"white", border:`1px solid ${pc.border}`, borderRadius:6, padding:"3px 9px", cursor:"pointer", whiteSpace:"nowrap" }}>詳細</button>
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

      {/* ── Bottleneck Detail Modal ── */}
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

      {/* ── Bottleneck All Modal ── */}
      {showBnAll && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }} onClick={() => setShowBnAll(false)}>
          <div style={{ background:"white", borderRadius:20, padding:"28px 32px", maxWidth:560, width:"100%", maxHeight:"80vh", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <span style={{ fontSize:18, fontWeight:800, color:"#1F2937" }}>⚠️ ボトルネック一覧</span>
              <button onClick={() => setShowBnAll(false)} style={{ background:"#F3F4F6", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:14, color:"#6B7280" }}>✕</button>
            </div>
            {/* Tabs: open / resolved */}
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

      {/* ── Add / Edit Form Modal ── */}
      {showBnForm && (
        <BnFormModal
          bnEdit={bnEdit}
          bottlenecks={bottlenecks}
          saveBottlenecks={saveBottlenecks}
          BN_PRI_COLOR={BN_PRI_COLOR}
          BN_PRIORITIES={BN_PRIORITIES}
          onClose={() => { setShowBnForm(false); setBnEdit(null); }}
        />
      )}
    </div>
  );
}

window.WorkflowPage = WorkflowPage;
window.BnFormModal = BnFormModal;
