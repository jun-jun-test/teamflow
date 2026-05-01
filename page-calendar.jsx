// ===== CALENDAR PAGE =====
function CalendarPage({ currentUser, tasks, setTasks, isMobile }) {
  var today = new Date();
  var todayStr = today.toISOString().split('T')[0];

  var [year,       setYear]       = React.useState(today.getFullYear());
  var [month,      setMonth]      = React.useState(today.getMonth());
  var [selDay,     setSelDay]     = React.useState(null);
  var [filterMine, setFilterMine] = React.useState(false);
  var [editingId,  setEditingId]  = React.useState(null);
  var [editFields, setEditFields] = React.useState({});

  var G  = "var(--accent,#06C755)";
  var GL = "var(--accent-light,#E9FBEF)";

  var DOW        = ['日','月','火','水','木','金','土'];
  var MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

  var STATUS_BG = { '未着手':'#FEE2E2','進行中':'#FEF3C7','確認待ち':'#DBEAFE','完了':'#DCFCE7' };
  var STATUS_FG = { '未着手':'#DC2626','進行中':'#D97706','確認待ち':'#2563EB','完了':'#16A34A' };

  function prevMonth() {
    if (month === 0) { setYear(function(y){ return y - 1; }); setMonth(11); }
    else setMonth(function(m){ return m - 1; });
    setSelDay(null);
  }

  function nextMonth() {
    if (month === 11) { setYear(function(y){ return y + 1; }); setMonth(0); }
    else setMonth(function(m){ return m + 1; });
    setSelDay(null);
  }

  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelDay(null);
  }

  function getDateStr(d) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  }

  function getTasksForDay(d) {
    var ds = getDateStr(d);
    var src = filterMine ? tasks.filter(function(t){ return t.assignee === currentUser; }) : tasks;
    return src.filter(function(t){ return t.dueDate === ds; });
  }

  var firstDow = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var cells = [];
  for (var i = 0; i < firstDow; i++) cells.push(null);
  for (var d = 1; d <= daysInMonth; d++) cells.push(d);

  var selTasks = selDay !== null ? getTasksForDay(selDay) : [];

  function startEdit(task) {
    setEditingId(task.id);
    setEditFields({ status: task.status, progress: task.progress, memo: task.memo || '' });
  }

  function saveEdit() {
    var updated = tasks.map(function(t) {
      if (t.id !== editingId) return t;
      var c = Object.assign({}, t, editFields);
      if (editFields.status === '完了') { c.progress = 100; c.completedAt = new Date().toISOString().split('T')[0]; }
      return c;
    });
    setTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    setEditingId(null);
  }

  var editingTask = tasks.find(function(t){ return t.id === editingId; });

  // Count tasks per day for heatmap style
  function getDayCount(d) {
    return getTasksForDay(d).length;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "var(--title-sz,24px)", fontWeight: 800, color: "#1F2937", marginBottom: 4 }}>カレンダー</h1>
        <p style={{ fontSize: "var(--font-sz,14px)", color: "#6B7280" }}>タスクの期限をカレンダーで確認できます。</p>
      </div>

      <div style={{ background: "var(--card-bg,white)", borderRadius: "var(--card-radius,16px)", padding: "var(--card-pad,20px 24px)", boxShadow: "var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))", marginBottom: 16 }}>
        {/* ヘッダー */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={prevMonth} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid #E5E7EB", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#6B7280" }}>‹</button>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#1F2937", minWidth: 110, textAlign: "center" }}>
              {year}年 {MONTH_NAMES[month]}
            </span>
            <button onClick={nextMonth} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid #E5E7EB", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#6B7280" }}>›</button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={goToday} style={{ padding: "6px 16px", borderRadius: 9999, border: "1px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: 12, color: "#6B7280", fontWeight: 600 }}>今月</button>
            <button onClick={function(){ setFilterMine(function(f){ return !f; }); }}
              style={{ padding: "6px 16px", borderRadius: 9999, border: "1px solid " + (filterMine ? G : "#E5E7EB"), background: filterMine ? GL : "white", cursor: "pointer", fontSize: 12, color: filterMine ? G : "#6B7280", fontWeight: filterMine ? 700 : 500 }}>
              自分のみ
            </button>
          </div>
        </div>

        {/* 曜日ヘッダー */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 4 }}>
          {DOW.map(function(d, i) {
            return (
              <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: i === 0 ? "#EF4444" : i === 6 ? "#3B82F6" : "#9CA3AF", padding: "4px 0" }}>{d}</div>
            );
          })}
        </div>

        {/* カレンダーグリッド */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
          {cells.map(function(d, i) {
            if (!d) return <div key={"pad" + i} style={{ minHeight: isMobile ? 62 : 72 }} />;
            var ds = getDateStr(d);
            var dayTasks = getTasksForDay(d);
            var isToday_ = ds === todayStr;
            var isSel = selDay === d;
            var col = i % 7;
            var hasOverdue = dayTasks.some(function(t){ return t.status !== '完了' && t.dueDate < todayStr; });

            return (
              <div key={d}
                onClick={function(){ setSelDay(d === selDay ? null : d); }}
                style={{
                  minHeight: isMobile ? 62 : 72,
                  borderRadius: 10,
                  border: isSel ? "2px solid " + G : isToday_ ? "2px solid #93C5FD" : hasOverdue ? "1.5px solid #FCA5A5" : "1px solid #F3F4F6",
                  background: isSel ? GL : isToday_ ? "#EFF6FF" : "white",
                  cursor: "pointer",
                  padding: "5px 6px",
                  transition: "all 0.12s",
                  position: "relative",
                  overflow: "hidden",
                }}>
                <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: isToday_ ? 800 : 600, color: isToday_ ? "#2563EB" : col === 0 ? "#EF4444" : col === 6 ? "#3B82F6" : "#1F2937", marginBottom: 2, display: "flex", alignItems: "center", gap: 2 }}>
                  {d}
                  {isToday_ && !isMobile && <span style={{ fontSize: 9, color: "#2563EB", fontWeight: 700 }}>今日</span>}
                </div>
                {isMobile ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {dayTasks.slice(0, 3).map(function(t) {
                      return <div key={t.id} style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_BG[t.status] || "#E5E7EB", border: "1px solid " + (STATUS_FG[t.status] || "#9CA3AF") + "66" }} />;
                    })}
                    {dayTasks.length > 3 && <div style={{ fontSize: 8, color: "#9CA3AF", fontWeight: 700 }}>+{dayTasks.length - 3}</div>}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {dayTasks.slice(0, 2).map(function(t) {
                      return (
                        <div key={t.id} style={{
                          fontSize: 10, borderRadius: 4, padding: "1px 5px", fontWeight: 600,
                          background: STATUS_BG[t.status] || "#F3F4F6",
                          color: STATUS_FG[t.status] || "#6B7280",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {t.title}
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, paddingLeft: 2 }}>+{dayTasks.length - 2}件</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 凡例 */}
        <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
          {Object.entries(STATUS_BG).map(function(entry) {
            return (
              <div key={entry[0]} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: entry[1], border: "1px solid " + (STATUS_FG[entry[0]] || "#9CA3AF") + "66" }} />
                <span style={{ fontSize: 11, color: "#6B7280" }}>{entry[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 選択日のタスク一覧 */}
      {selDay !== null && (
        <div style={{ background: "var(--card-bg,white)", borderRadius: "var(--card-radius,16px)", padding: "var(--card-pad,20px 24px)", boxShadow: "var(--card-shadow,0 2px 12px rgba(0,0,0,0.08))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1F2937" }}>
              {month + 1}月{selDay}日のタスク（{selTasks.length}件）
            </span>
            <button onClick={function(){ setSelDay(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 20, lineHeight: 1, padding: "0 4px" }}>✕</button>
          </div>

          {selTasks.length === 0 ? (
            <div style={{ color: "#9CA3AF", fontSize: 13, padding: "8px 0" }}>この日のタスクはありません</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selTasks.map(function(t) {
                return (
                  <div key={t.id} style={{ background: "#F8FAF8", borderRadius: 12, border: "1px solid #F3F4F6",
                                          padding: isMobile ? "12px 12px" : "10px 14px" }}>
                    {/* モバイル: 縦積みレイアウト / PC: 横並びレイアウト */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 8 : 0 }}>
                      <MemberAvatar name={t.assignee} size={28} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis",
                                       whiteSpace: isMobile ? "normal" : "nowrap", lineHeight: 1.4 }}>{t.title}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{t.assignee} · {t.business}</div>
                      </div>
                      {!isMobile && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <div style={{ width: 52 }}>
                            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2, textAlign: "right" }}>{t.progress}%</div>
                            <ProgressBar value={t.progress} height={4} />
                          </div>
                          <StatusBadge status={t.status} />
                          <PriorityBadge priority={t.priority || "中"} />
                          <button onClick={function(){ startEdit(t); }}
                            style={{ background: GL, border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 12, color: G, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
                            編集
                          </button>
                        </div>
                      )}
                    </div>
                    {/* モバイル: 進捗 + バッジ + 編集ボタンを2行目に */}
                    {isMobile && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingLeft: 38 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <StatusBadge status={t.status} />
                          <span style={{ fontSize: 11, color: "#6B7280" }}>{t.progress}%</span>
                        </div>
                        <button onClick={function(){ startEdit(t); }}
                          style={{ background: GL, border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, color: G, cursor: "pointer", fontWeight: 700 }}>
                          編集
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 編集モーダル */}
      {editingId && editingTask && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
          onClick={function(){ setEditingId(null); }}>
          <div style={{ background: "white", borderRadius: 20, padding: "28px 32px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            onClick={function(e){ e.stopPropagation(); }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1F2937", marginBottom: 4 }}>タスクを編集</h3>
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>{editingTask.title}</p>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>ステータス</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {STATUS_OPTIONS.map(function(s) {
                return (
                  <button key={s} onClick={function(){ setEditFields(function(f){ return Object.assign({}, f, { status: s }); }); }}
                    style={{ padding: "7px 14px", borderRadius: 9999, border: "1.5px solid " + (editFields.status === s ? G : "#E5E7EB"), background: editFields.status === s ? GL : "white", color: editFields.status === s ? G : "#6B7280", fontWeight: editFields.status === s ? 700 : 500, fontSize: 13, cursor: "pointer" }}>
                    {s}
                  </button>
                );
              })}
            </div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>進捗率: {editFields.progress}%</label>
            <input type="range" min={0} max={100} value={editFields.progress}
              onChange={function(e){ setEditFields(function(f){ return Object.assign({}, f, { progress: Number(e.target.value) }); }); }}
              style={{ width: "100%", marginBottom: 16 }} />
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>メモ</label>
            <textarea value={editFields.memo}
              onChange={function(e){ setEditFields(function(f){ return Object.assign({}, f, { memo: e.target.value }); }); }}
              rows={3} style={{ width: "100%", borderRadius: 10, border: "1.5px solid #E5E7EB", padding: "10px 12px", fontSize: 13, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={function(){ setEditingId(null); }}
                style={{ flex: 1, padding: 12, borderRadius: 10, border: "1.5px solid #E5E7EB", background: "white", color: "#6B7280", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                キャンセル
              </button>
              <button onClick={saveEdit}
                style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: G, color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.CalendarPage = CalendarPage;
