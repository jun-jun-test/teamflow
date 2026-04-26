const TEMPLATES = [
  { label:"SNS投稿を作成する",       memo:"参考となる事例やトレンドを調査し、投稿の方向性をまとめてください。" },
  { label:"DM送信リストを作成する",   memo:"ターゲットとなるチームをリストアップし、送信優先順位を整理してください。" },
  { label:"競合調査をする",           memo:"競合サービスの特徴・強み・弱みを分析し、差別化ポイントを明確にしてください。" },
  { label:"ミーティング内容を整理する", memo:"議事録をもとに、決定事項・次のアクションをまとめてください。" },
  { label:"投稿結果を分析する",       memo:"先週比でリーチ・エンゲージメント・フォロワー数を比較し、改善案を提案してください。" },
];

const STAGE_ICONS = { "企画":"💡","準備":"📋","実行":"▶","検証":"🔍","改善":"🔄","完了":"🏁" };

function TaskCreatePage({ currentUser, tasks, setTasks, isMobile }) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
  const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

  const INIT = {
    title: "", assignee: currentUser, business: BUSINESSES[0], project: PROJECTS[0],
    workflowStage: "企画", dueDate: today, status: "未着手", progress: 0, memo: "", priority: "中"
  };
  const [form, setForm] = React.useState(INIT);
  const [saved, setSaved] = React.useState(false);
  const [drafted, setDrafted] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "タスク名は必須です";
    if (!form.assignee) e.assignee = "担当者を選択してください";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newTask = { ...form, id: genId(), createdAt: new Date().toISOString().split("T")[0] };
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    setSaved(true);
    setForm(INIT);
    setErrors({});
    setTimeout(() => setSaved(false), 3000);
  }

  function handleDraft() {
    saveToStorage("kaiwai_draft", form);
    setDrafted(true);
    setTimeout(() => setDrafted(false), 2000);
  }

  function applyTemplate(t) {
    setForm(f => ({ ...f, title: t.label, memo: t.memo }));
  }

  const Section = ({ label, required, children, hint }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <label style={{ fontSize:14, fontWeight:700, color:"#374151" }}>{label}</label>
        {required && <span style={{ fontSize:11, fontWeight:700, color:"white", background:"#4CAF50", borderRadius:4, padding:"1px 7px" }}>必須</span>}
      </div>
      {hint && <p style={{ fontSize:12, color:"#9CA3AF", marginBottom:8 }}>{hint}</p>}
      {children}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:"#1F2937", marginBottom:4 }}>タスク作成</h1>
        <p style={{ fontSize:14, color:"#6B7280" }}>新しいタスクを直感的に追加できます。</p>
      </div>

      {saved && (
        <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"12px 16px", marginBottom:16, color:"#16A34A", fontWeight:600, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
          ✅ タスクを追加しました！
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap:20, alignItems:"start" }}>
        {/* Form */}
        <div style={{ background:"white", borderRadius:16, padding:"28px 32px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)" }}>

          {/* Title */}
          <Section label="タスク名" required>
            <div style={{ position:"relative" }}>
              <input value={form.title} onChange={e => set("title", e.target.value)} maxLength={100} placeholder="例：TikTok動画の企画案を提出" style={{ width:"100%", border:`1.5px solid ${errors.title ? "#EF4444" : "#E5E7EB"}`, borderRadius:10, padding:"11px 50px 11px 14px", fontSize:14, color:"#1F2937", outline:"none", boxSizing:"border-box", transition:"border-color 0.15s" }} onFocus={e => e.target.style.borderColor="#4CAF50"} onBlur={e => e.target.style.borderColor= errors.title ? "#EF4444" : "#E5E7EB"} />
              <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:12, color:"#9CA3AF" }}>{form.title.length} / 100</span>
            </div>
            {errors.title && <p style={{ fontSize:12, color:"#EF4444", marginTop:4 }}>{errors.title}</p>}
          </Section>

          {/* Assignee */}
          <Section label="担当者" required hint={errors.assignee || "担当者を1人選択してください"}>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {MEMBERS.map(m => {
                const c = MEMBER_COLORS[m];
                const sel = form.assignee === m;
                return (
                  <button key={m} onClick={() => set("assignee", m)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"10px 14px", borderRadius:12, border:`2px solid ${sel ? c.ring : "#E5E7EB"}`, background: sel ? c.bg : "white", cursor:"pointer", position:"relative", transition:"all 0.15s" }}>
                    <MemberAvatar name={m} size={40} />
                    <span style={{ fontSize:12, fontWeight: sel ? 700 : 500, color: sel ? c.text : "#6B7280" }}>{m}</span>
                    {sel && (
                      <div style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:c.ring, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Business + Project */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
            <Section label="所属事業" required>
              <input value={form.business} onChange={e => set("business", e.target.value)} list="business-dl" placeholder="例：SNSメディア事業" style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"11px 14px", fontSize:14, color:"#1F2937", outline:"none", boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor="#4CAF50"} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
              <datalist id="business-dl">{BUSINESSES.map(b=><option key={b} value={b}/>)}</datalist>
            </Section>
            <Section label="所属プロジェクト" required>
              <input value={form.project} onChange={e => set("project", e.target.value)} list="project-dl" placeholder="例：TikTok運用プロジェクト" style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"11px 14px", fontSize:14, color:"#1F2937", outline:"none", boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor="#4CAF50"} onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
              <datalist id="project-dl">{PROJECTS.map(p=><option key={p} value={p}/>)}</datalist>
            </Section>
          </div>

          {/* Workflow Stage */}
          <Section label="ワークフロー段階" required>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {WORKFLOW_STAGES.map(s => (
                <button key={s} onClick={() => set("workflowStage", s)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:9999, border:`1.5px solid ${form.workflowStage === s ? "#4CAF50" : "#E5E7EB"}`, background: form.workflowStage === s ? "#EAF7EA" : "white", color: form.workflowStage === s ? "#4CAF50" : "#6B7280", fontWeight: form.workflowStage === s ? 700 : 500, fontSize:13, cursor:"pointer", transition:"all 0.15s" }}>
                  <span>{STAGE_ICONS[s]}</span>{s}
                </button>
              ))}
            </div>
          </Section>

          {/* Due Date */}
          <Section label="期限" required>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>📅</span>
                <input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} style={{ border:"1.5px solid #E5E7EB", borderRadius:10, padding:"9px 12px 9px 32px", fontSize:13, color:"#1F2937", outline:"none" }} />
              </div>
              {[["今日",today],["明日",tomorrow],["今週中",today],["来週中",nextWeek],["期限なし",""]].map(([label, val]) => (
                <button key={label} onClick={() => set("dueDate", val)} style={{ padding:"8px 14px", borderRadius:9999, border:`1.5px solid ${form.dueDate === val ? "#4CAF50" : "#E5E7EB"}`, background: form.dueDate === val ? "#EAF7EA" : "white", color: form.dueDate === val ? "#4CAF50" : "#6B7280", fontSize:12, fontWeight: form.dueDate === val ? 700 : 500, cursor:"pointer", whiteSpace:"nowrap" }}>{label}</button>
              ))}
            </div>
          </Section>

          {/* Status + Progress */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
            <Section label="ステータス" required>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => set("status", s)} style={{ padding:"7px 12px", borderRadius:9999, border:`1.5px solid ${form.status === s ? "#4CAF50" : "#E5E7EB"}`, background: form.status === s ? "#EAF7EA" : "white", color: form.status === s ? "#4CAF50" : "#6B7280", fontWeight: form.status === s ? 700 : 500, fontSize:12, cursor:"pointer" }}>
                    {s === form.status && <span style={{ marginRight:4 }}>✓</span>}{s}
                  </button>
                ))}
              </div>
            </Section>
            <Section label="進捗率" required>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <input type="range" min={0} max={100} value={form.progress} onChange={e => set("progress", Number(e.target.value))} style={{ flex:1, accentColor:"#4CAF50" }} />
                <span style={{ fontSize:16, fontWeight:800, color:"#1F2937", width:44 }}>{form.progress}%</span>
              </div>
            </Section>
          </div>

          {/* Memo */}
          <Section label="メモ">
            <div style={{ position:"relative" }}>
              <textarea value={form.memo} onChange={e => set("memo", e.target.value)} maxLength={500} rows={3} placeholder="例：参考となる事例やトレンドを調査し、企画の方向性をまとめてください。" style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"11px 14px", fontSize:13, color:"#1F2937", resize:"vertical", boxSizing:"border-box", outline:"none", lineHeight:1.6 }} onFocus={e => e.target.style.borderColor="#4CAF50"} onBlur={e => e.target.style.borderColor="#E5E7EB"} />
              <span style={{ position:"absolute", right:10, bottom:8, fontSize:11, color:"#9CA3AF" }}>{form.memo.length} / 500</span>
            </div>
          </Section>

          {/* Templates */}
          <Section label="テンプレートから選ぶ">
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {TEMPLATES.map(t => (
                <button key={t.label} onClick={() => applyTemplate(t)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:9999, border:"1.5px solid #E5E7EB", background:"white", color:"#6B7280", fontSize:12, cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#4CAF50"; e.currentTarget.style.color="#4CAF50"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#6B7280"; }}>
                  <span>{t.label.includes("SNS") ? "🎵" : t.label.includes("DM") ? "✈️" : "🔍"}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Buttons */}
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            <button onClick={handleDraft} style={{ flex:1, padding:"13px", borderRadius:12, border:"1.5px solid #E5E7EB", background:"white", color:"#6B7280", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <span>📄</span>{drafted ? "保存しました！" : "下書き保存"}
            </button>
            <button onClick={handleSave} style={{ flex:2, padding:"13px", borderRadius:12, border:"none", background:"#4CAF50", color:"white", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 16px rgba(76,175,80,0.35)" }}>
              <span>⊕</span> タスクを追加する
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={{ background:"white", borderRadius:16, padding:"20px 24px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)", position: isMobile ? "static" : "sticky", top:88 }}>
          <div style={{ fontWeight:700, fontSize:15, color:"#1F2937", marginBottom:4 }}>入力プレビュー</div>
          <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:16 }}>入力内容を確認できます。</div>

          {[
            { icon:"✓", label:"タスク名", val: form.title || "—" },
            { icon:"👤", label:"担当者", val: form.assignee, isAvatar:true },
            { icon:"🏢", label:"所属事業", val: form.business },
            { icon:"📁", label:"所属プロジェクト", val: form.project },
            { icon:"💡", label:"ワークフロー段階", val: form.workflowStage },
            { icon:"📅", label:"期限", val: form.dueDate ? formatDate(form.dueDate) : "期限なし" },
            { icon:"✓", label:"ステータス", val: null, isStatus:true },
            { icon:"→", label:"進捗率", val: null, isProgress:true },
            { icon:"📝", label:"メモ", val: form.memo || "—" },
          ].map(row => (
            <div key={row.label} style={{ padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                <span style={{ fontSize:13, color:"#9CA3AF", width:18 }}>{row.icon}</span>
                <span style={{ fontSize:11, color:"#9CA3AF", fontWeight:600 }}>{row.label}</span>
              </div>
              <div style={{ paddingLeft:24 }}>
                {row.isAvatar ? (
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <MemberAvatar name={form.assignee} size={20} />
                    <span style={{ fontSize:13, fontWeight:600, color:"#1F2937" }}>{form.assignee}</span>
                  </div>
                ) : row.isStatus ? (
                  <StatusBadge status={form.status} />
                ) : row.isProgress ? (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1 }}><ProgressBar value={form.progress} height={6} /></div>
                    <span style={{ fontSize:13, fontWeight:700, color:"#1F2937" }}>{form.progress}%</span>
                  </div>
                ) : (
                  <span style={{ fontSize:13, color:"#1F2937", wordBreak:"break-word" }}>{row.val}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.TaskCreatePage = TaskCreatePage;
