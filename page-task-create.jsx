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

const TEMPLATES = [
  { label:"SNS投稿を作成する",       memo:"参考となる事例やトレンドを調査し、投稿の方向性をまとめてください。" },
  { label:"DM送信リストを作成する",   memo:"ターゲットとなるチームをリストアップし、送信優先順位を整理してください。" },
  { label:"競合調査をする",           memo:"競合サービスの特徴・強み・弱みを分析し、差別化ポイントを明確にしてください。" },
  { label:"ミーティング内容を整理する", memo:"議事録をもとに、決定事項・次のアクションをまとめてください。" },
  { label:"投稿結果を分析する",       memo:"先週比でリーチ・エンゲージメント・フォロワー数を比較し、改善案を提案してください。" },
];

const STAGE_ICONS = { "企画":"💡","準備":"📋","実行":"▶","検証":"🔍","改善":"🔄","完了":"🏁" };

function TaskCreatePage({ currentUser, tasks, setTasks, isMobile, onTaskCreated }) {
  const today    = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const INIT = {
    title: "", assignees: [currentUser], business: BUSINESSES[0],
    project: "", workflowStage: "企画", dueDate: today,
    status: "未着手", progress: 0, memo: "", priority: "中"
  };
  const [form,    setForm]    = React.useState(INIT);
  const [saved,   setSaved]   = React.useState(false);
  const [drafted, setDrafted] = React.useState(false);
  const [errors,  setErrors]  = React.useState({});

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  // 担当者の追加・削除トグル（最低1人は必須）
  function toggleAssignee(member) {
    setForm(f => {
      const already = f.assignees.includes(member);
      if (already && f.assignees.length === 1) return f;  // 最後の1人は外せない
      const next = already
        ? f.assignees.filter(m => m !== member)
        : [...f.assignees, member];
      return { ...f, assignees: next };
    });
  }

  function validate() {
    const e = {};
    if (!form.title.trim())         e.title    = "タスク名は必須です";
    if (!form.assignees.length)     e.assignees = "担当者を1人以上選択してください";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const newTask = {
      ...form,
      assignee:  form.assignees[0],   // 後方互換のため先頭を primaryassignee にする
      assignees: form.assignees,
      id: genId(),
      createdAt: new Date().toISOString().split("T")[0]
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);

    // 担当者への通知を作成（自分以外 or 全員分を1件にまとめる）
    const label = newTask.title.length > 22 ? newTask.title.slice(0, 22) + '…' : newTask.title;
    const assigneeStr = form.assignees.join('・');
    const notif = {
      id:        genId(),
      type:      'task_assigned',
      taskId:    newTask.id,
      message:   '📋 新しいタスクが割り当てられました：「' + label + '」（担当: ' + assigneeStr + '）',
      createdAt: new Date().toISOString(),
      readBy:    [currentUser],  // 作成者本人は既読扱いにする
    };
    var notifStore = [notif].concat(loadFromStorage('seed_notifications', []));
    try { localStorage.setItem('seed_notifications', JSON.stringify(notifStore)); } catch(ex) {}
    if (window.db) window._syncToDB('notifications', notifStore, 'replace');

    // app.jsx の通知state を即時更新
    if (onTaskCreated) onTaskCreated();

    setSaved(true);
    setForm({ ...INIT, assignees: [currentUser] });
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

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:"#1F2937", marginBottom:4 }}>タスク作成</h1>
        <p style={{ fontSize:14, color:"#6B7280" }}>新しいタスクを直感的に追加できます。</p>
      </div>

      {saved && (
        <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"12px 16px", marginBottom:16, color:"#16A34A", fontWeight:600, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
          ✅ タスクを追加しました！担当者に通知が送信されました。
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap:20, alignItems:"start" }}>
        {/* フォーム */}
        <div style={{ background:"white", borderRadius:16, padding:"28px 32px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)" }}>

          {/* タスク名 */}
          {Section({ label: "タスク名", required: true, children: (<>
            <div style={{ position:"relative" }}>
              <input value={form.title} onChange={e => set("title", e.target.value)} maxLength={100}
                placeholder="例：TikTok動画の企画案を提出"
                style={{ width:"100%", border:`1.5px solid ${errors.title ? "#EF4444" : "#E5E7EB"}`, borderRadius:10, padding:"11px 50px 11px 14px", fontSize:14, color:"#1F2937", outline:"none", boxSizing:"border-box", transition:"border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor="#4CAF50"}
                onBlur={e  => e.target.style.borderColor = errors.title ? "#EF4444" : "#E5E7EB"} />
              <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:12, color:"#9CA3AF" }}>{form.title.length} / 100</span>
            </div>
            {errors.title && <p style={{ fontSize:12, color:"#EF4444", marginTop:4 }}>{errors.title}</p>}
          </>) })}

          {/* 担当者（複数選択可） */}
          {Section({ label: "担当者", required: true,
            hint: errors.assignees ? errors.assignees : "複数人選択できます（タップで追加・解除）",
            children: (
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {MEMBERS.map(m => {
                  const c   = MEMBER_COLORS[m];
                  const sel = form.assignees.includes(m);
                  return (
                    <button key={m} onClick={() => toggleAssignee(m)}
                      style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                               padding:"10px 14px", borderRadius:12,
                               border:`2px solid ${sel ? c.ring : "#E5E7EB"}`,
                               background: sel ? c.bg : "white",
                               cursor:"pointer", position:"relative", transition:"all 0.15s" }}>
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
            )
          })}

          {/* 所属事業（1列に広げる） */}
          {Section({ label: "所属事業", required: true, children: (<>
            <input value={form.business} onChange={e => set("business", e.target.value)}
              list="business-dl" placeholder="例：SNSメディア事業"
              style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"11px 14px", fontSize:14, color:"#1F2937", outline:"none", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor="#4CAF50"}
              onBlur={e =>e.target.style.borderColor="#E5E7EB"} />
            <datalist id="business-dl">{BUSINESSES.map(b=><option key={b} value={b}/>)}</datalist>
          </>) })}

          {/* ワークフロー段階 */}
          {Section({ label: "ワークフロー段階", required: true, children: (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {WORKFLOW_STAGES.map(s => (
                <button key={s} onClick={() => set("workflowStage", s)}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:9999,
                           border:`1.5px solid ${form.workflowStage === s ? "#4CAF50" : "#E5E7EB"}`,
                           background: form.workflowStage === s ? "#EAF7EA" : "white",
                           color: form.workflowStage === s ? "#4CAF50" : "#6B7280",
                           fontWeight: form.workflowStage === s ? 700 : 500, fontSize:13, cursor:"pointer", transition:"all 0.15s" }}>
                  <span>{STAGE_ICONS[s]}</span>{s}
                </button>
              ))}
            </div>
          ) })}

          {/* 期限 */}
          {Section({ label: "期限", required: true, children: (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>📅</span>
                <input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)}
                  style={{ border:"1.5px solid #E5E7EB", borderRadius:10, padding:"9px 12px 9px 32px", fontSize:13, color:"#1F2937", outline:"none" }} />
              </div>
              {[["今日",today],["明日",tomorrow],["来週中",nextWeek],["期限なし",""]].map(([label, val]) => (
                <button key={label} onClick={() => set("dueDate", val)}
                  style={{ padding:"8px 14px", borderRadius:9999,
                           border:`1.5px solid ${form.dueDate === val ? "#4CAF50" : "#E5E7EB"}`,
                           background: form.dueDate === val ? "#EAF7EA" : "white",
                           color: form.dueDate === val ? "#4CAF50" : "#6B7280",
                           fontSize:12, fontWeight: form.dueDate === val ? 700 : 500, cursor:"pointer", whiteSpace:"nowrap" }}>
                  {label}
                </button>
              ))}
            </div>
          ) })}

          {/* ステータス + 進捗率 */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
            {Section({ label: "ステータス", required: true, children: (
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => set("status", s)}
                    style={{ padding:"7px 12px", borderRadius:9999,
                             border:`1.5px solid ${form.status === s ? "#4CAF50" : "#E5E7EB"}`,
                             background: form.status === s ? "#EAF7EA" : "white",
                             color: form.status === s ? "#4CAF50" : "#6B7280",
                             fontWeight: form.status === s ? 700 : 500, fontSize:12, cursor:"pointer" }}>
                    {s === form.status && <span style={{ marginRight:4 }}>✓</span>}{s}
                  </button>
                ))}
              </div>
            ) })}
            {Section({ label: "進捗率", required: true, children: (
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <input type="range" min={0} max={100} value={form.progress}
                  onChange={e => set("progress", Number(e.target.value))}
                  style={{ flex:1, accentColor:"#4CAF50" }} />
                <span style={{ fontSize:16, fontWeight:800, color:"#1F2937", width:44 }}>{form.progress}%</span>
              </div>
            ) })}
          </div>

          {/* メモ */}
          {Section({ label: "メモ", children: (
            <div style={{ position:"relative" }}>
              <textarea value={form.memo} onChange={e => set("memo", e.target.value)} maxLength={500} rows={3}
                placeholder="例：参考となる事例やトレンドを調査し、企画の方向性をまとめてください。"
                style={{ width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"11px 14px", fontSize:13, color:"#1F2937", resize:"vertical", boxSizing:"border-box", outline:"none", lineHeight:1.6 }}
                onFocus={e => e.target.style.borderColor="#4CAF50"}
                onBlur={e  => e.target.style.borderColor="#E5E7EB"} />
              <span style={{ position:"absolute", right:10, bottom:8, fontSize:11, color:"#9CA3AF" }}>{form.memo.length} / 500</span>
            </div>
          ) })}

          {/* テンプレート */}
          {Section({ label: "テンプレートから選ぶ", children: (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {TEMPLATES.map(t => (
                <button key={t.label} onClick={() => applyTemplate(t)}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:9999, border:"1.5px solid #E5E7EB", background:"white", color:"#6B7280", fontSize:12, cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#4CAF50"; e.currentTarget.style.color="#4CAF50"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#6B7280"; }}>
                  <span>{t.label.includes("SNS") ? "🎵" : t.label.includes("DM") ? "✈️" : "🔍"}</span>
                  {t.label}
                </button>
              ))}
            </div>
          ) })}

          {/* ボタン */}
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            <button onClick={handleDraft}
              style={{ flex:1, padding:"13px", borderRadius:12, border:"1.5px solid #E5E7EB", background:"white", color:"#6B7280", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <span>📄</span>{drafted ? "保存しました！" : "下書き保存"}
            </button>
            <button onClick={handleSave}
              style={{ flex:2, padding:"13px", borderRadius:12, border:"none", background:"#4CAF50", color:"white", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 16px rgba(76,175,80,0.35)" }}>
              <span>⊕</span> タスクを追加する
            </button>
          </div>
        </div>

        {/* プレビュー */}
        <div style={{ background:"white", borderRadius:16, padding:"20px 24px", boxShadow:"0 1px 8px rgba(0,0,0,0.07)", position: isMobile ? "static" : "sticky", top:88 }}>
          <div style={{ fontWeight:700, fontSize:15, color:"#1F2937", marginBottom:4 }}>入力プレビュー</div>
          <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:16 }}>入力内容を確認できます。</div>

          {/* タスク名 */}
          <div style={{ padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:3 }}>✓ タスク名</div>
            <span style={{ fontSize:13, color:"#1F2937", wordBreak:"break-word" }}>{form.title || "—"}</span>
          </div>

          {/* 担当者（複数） */}
          <div style={{ padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:6 }}>👤 担当者</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {form.assignees.map(m => {
                const c = MEMBER_COLORS[m] || {};
                return (
                  <div key={m} style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 9px 3px 4px", borderRadius:9999, background:c.bg||"#F3F4F6", border:`1px solid ${c.ring||"#E5E7EB"}` }}>
                    <MemberAvatar name={m} size={18} />
                    <span style={{ fontSize:12, fontWeight:600, color:c.text||"#374151" }}>{m}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 所属事業 */}
          <div style={{ padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:3 }}>🏢 所属事業</div>
            <span style={{ fontSize:13, color:"#1F2937" }}>{form.business || "—"}</span>
          </div>

          {/* ワークフロー段階 */}
          <div style={{ padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:3 }}>💡 ワークフロー段階</div>
            <span style={{ fontSize:13, color:"#1F2937" }}>{STAGE_ICONS[form.workflowStage]} {form.workflowStage}</span>
          </div>

          {/* 期限 */}
          <div style={{ padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:3 }}>📅 期限</div>
            <span style={{ fontSize:13, color:"#1F2937" }}>{form.dueDate ? formatDate(form.dueDate) : "期限なし"}</span>
          </div>

          {/* ステータス */}
          <div style={{ padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:3 }}>✓ ステータス</div>
            <StatusBadge status={form.status} />
          </div>

          {/* 進捗率 */}
          <div style={{ padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:6 }}>→ 進捗率</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ flex:1 }}><ProgressBar value={form.progress} height={6} /></div>
              <span style={{ fontSize:13, fontWeight:700, color:"#1F2937" }}>{form.progress}%</span>
            </div>
          </div>

          {/* メモ */}
          <div style={{ padding:"10px 0" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:3 }}>📝 メモ</div>
            <span style={{ fontSize:13, color:"#1F2937", wordBreak:"break-word" }}>{form.memo || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.TaskCreatePage = TaskCreatePage;
