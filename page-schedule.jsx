// ===== SCHEDULE PAGE =====

// Build a 7-column calendar grid for a given year/month
// Returns array of weeks; each week is 7 slots (null = empty padding)
function buildMonthGrid(year, month) {
  var firstDay    = new Date(year, month, 1).getDay(); // 0=Sun
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var grid = [];
  var week = Array(firstDay).fill(null);
  for (var d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { grid.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    grid.push(week);
  }
  return grid;
}

// ===== PERSONAL INPUT CALENDAR (one month) =====
function PersonalMonthCalendar({ year, month, periodStart, periodEnd, todayStr, selectedDates, onToggle, confirmedDates }) {
  var MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var DAY_LABELS  = ['日','月','火','水','木','金','土'];
  var grid = buildMonthGrid(year, month);

  function toStr(d) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  }

  return (
    <div style={{ background:'white', borderRadius:16, padding:'18px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', flex:1, minWidth:260 }}>
      <div style={{ textAlign:'center', fontWeight:700, fontSize:15, color:'#1F2937', marginBottom:12 }}>
        {year}年 {MONTH_NAMES[month]}
      </div>

      {/* Day headers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3, marginBottom:6 }}>
        {DAY_LABELS.map(function(lbl, i) {
          return (
            <div key={lbl} style={{ textAlign:'center', fontSize:11, fontWeight:600, padding:'3px 0',
              color: i===0 ? '#EF4444' : i===6 ? '#3B82F6' : '#9CA3AF' }}>
              {lbl}
            </div>
          );
        })}
      </div>

      {/* Date cells */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
        {grid.map(function(week, wi) {
          return week.map(function(day, di) {
            if (!day) return <div key={wi+'-'+di} style={{ height:44 }} />;

            var dateStr    = toStr(day);
            var inPeriod   = dateStr >= periodStart && dateStr <= periodEnd;
            var isPast     = dateStr < todayStr;
            var disabled   = !inPeriod || isPast;
            var selected   = selectedDates.includes(dateStr);
            var confirmed  = confirmedDates && confirmedDates.includes(dateStr);
            var isToday    = dateStr === todayStr;

            var cellBg     = 'transparent';
            var cellColor  = di===0 ? '#EF4444' : di===6 ? '#3B82F6' : '#374151';
            var opacity    = disabled ? 0.28 : 1;
            var border     = isToday && !selected ? '2px solid #3B82F6' : '2px solid transparent';
            var fontWeight = isToday || selected ? 700 : 400;

            if (selected && confirmed) { cellBg = '#10B981'; cellColor = 'white'; }
            else if (selected)         { cellBg = '#3B82F6'; cellColor = 'white'; }
            else if (confirmed)        { cellBg = '#D1FAE5'; cellColor = '#065F46'; }

            return (
              <button
                key={wi+'-'+di}
                disabled={disabled}
                onClick={function() { onToggle(dateStr); }}
                style={{
                  position:'relative', height:44, borderRadius:8, border, background:cellBg,
                  color:cellColor, fontSize:13, fontWeight, opacity, cursor:disabled?'default':'pointer',
                  transition:'all 0.13s', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                }}
              >
                <span>{day}</span>
                {confirmed && !selected && (
                  <span style={{ fontSize:5, color:'#10B981', lineHeight:1 }}>●</span>
                )}
              </button>
            );
          });
        })}
      </div>
    </div>
  );
}

// ===== OVERVIEW CALENDAR (one month — shows all members) =====
function OverviewMonthCalendar({ year, month, periodStart, periodEnd, membersData, confirmedDates, isMobile }) {
  var MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var DAY_LABELS  = ['日','月','火','水','木','金','土'];
  var grid = buildMonthGrid(year, month);

  // Aggregate counts and member lists per date
  var counts  = {};
  var byDate  = {};
  Object.entries(membersData).forEach(function(entry) {
    var member = entry[0]; var md = entry[1];
    (md.availableDates || []).forEach(function(d) {
      counts[d] = (counts[d] || 0) + 1;
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(member);
    });
  });

  function toStr(d) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  }

  function getCellBg(count, isConfirmed) {
    if (isConfirmed) return '#10B981';
    if (count >= 6)  return '#86EFAC';
    if (count >= 4)  return '#BFDBFE';
    if (count >= 2)  return '#FEF08A';
    return 'transparent';
  }

  return (
    <div style={{ background:'white', borderRadius:16, padding:'18px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', flex:1, minWidth:260 }}>
      <div style={{ textAlign:'center', fontWeight:700, fontSize:15, color:'#1F2937', marginBottom:12 }}>
        {year}年 {MONTH_NAMES[month]}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3, marginBottom:6 }}>
        {DAY_LABELS.map(function(lbl, i) {
          return (
            <div key={lbl} style={{ textAlign:'center', fontSize:11, fontWeight:600, padding:'3px 0',
              color: i===0 ? '#EF4444' : i===6 ? '#3B82F6' : '#9CA3AF' }}>
              {lbl}
            </div>
          );
        })}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
        {grid.map(function(week, wi) {
          return week.map(function(day, di) {
            if (!day) return <div key={wi+'-'+di} style={{ height:56 }} />;

            var dateStr   = toStr(day);
            var inPeriod  = dateStr >= periodStart && dateStr <= periodEnd;
            var cnt       = counts[dateStr] || 0;
            var members   = byDate[dateStr] || [];
            var confirmed = confirmedDates.includes(dateStr);
            var cellBg    = inPeriod ? getCellBg(cnt, confirmed) : 'transparent';
            var dayColor  = inPeriod && confirmed ? 'white' : inPeriod && cnt >= 4 ? '#1E40AF' : di===0 ? '#EF4444' : di===6 ? '#3B82F6' : '#374151';

            return (
              <div
                key={wi+'-'+di}
                title={members.length > 0 ? members.join(', ') : ''}
                style={{
                  background: cellBg, borderRadius:8, minHeight:56, padding:'4px 2px',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                  opacity: inPeriod ? 1 : 0.2,
                }}
              >
                <span style={{ fontSize:12, fontWeight:600, color:dayColor, lineHeight:1 }}>{day}</span>
                {inPeriod && confirmed && (
                  <span style={{ fontSize:8, color:'white', fontWeight:700, lineHeight:1, letterSpacing:'-0.5px' }}>確定</span>
                )}
                {inPeriod && cnt > 0 && !confirmed && (
                  <span style={{ fontSize:10, color:cnt>=4?'#1E40AF':'#6B7280', fontWeight:600, lineHeight:1 }}>{cnt}名</span>
                )}
                {inPeriod && members.length > 0 && !isMobile && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:1, justifyContent:'center' }}>
                    {members.map(function(m) {
                      var c = (window.MEMBER_COLORS && window.MEMBER_COLORS[m]) || { avatarBg:'#D1D5DB' };
                      return <div key={m} title={m} style={{ width:7, height:7, borderRadius:'50%', background:c.avatarBg }} />;
                    })}
                  </div>
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}

// ===== MAIN SCHEDULE PAGE =====
function SchedulePage({ currentUser, onSaved, isMobile }) {
  var period     = getSchedulePeriod();
  var periodStart = period.start.toISOString().split('T')[0];
  var periodEnd   = period.end.toISOString().split('T')[0];
  var today       = new Date(); today.setHours(0,0,0,0);
  var todayStr    = today.toISOString().split('T')[0];

  var [activeTab,     setActiveTab]     = React.useState('mine');
  var [scheduleData,  setScheduleData]  = React.useState(function() { return getScheduleData(period.periodKey); });
  var [selectedDates, setSelectedDates] = React.useState(function() {
    var d = getScheduleData(period.periodKey);
    return (d.members[currentUser] && d.members[currentUser].availableDates) || [];
  });
  var [saveMsg, setSaveMsg] = React.useState('');
  var [saving,  setSaving]  = React.useState(false);

  // Reload data when switching to overview tab
  React.useEffect(function() {
    var fresh = getScheduleData(period.periodKey);
    setScheduleData(fresh);
    if (activeTab === 'mine') {
      setSelectedDates((fresh.members[currentUser] && fresh.members[currentUser].availableDates) || []);
    }
  }, [activeTab, currentUser]);

  // Determine which months to show (start month + end month)
  var months = [];
  var sy = period.start.getFullYear(), sm = period.start.getMonth();
  var ey = period.end.getFullYear(),   em = period.end.getMonth();
  var cy = sy, cm = sm;
  while (cy < ey || (cy === ey && cm <= em)) {
    months.push({ year: cy, month: cm });
    cm++; if (cm > 11) { cm = 0; cy++; }
  }

  function toggleDate(dateStr) {
    setSelectedDates(function(prev) {
      return prev.includes(dateStr)
        ? prev.filter(function(d) { return d !== dateStr; })
        : prev.concat(dateStr);
    });
  }

  function handleSave() {
    if (saving) return;
    setSaving(true);
    var newNotifs = saveMemberAvailability(period.periodKey, currentUser, selectedDates);
    if (newNotifs && newNotifs.length) addNotificationsToStore(newNotifs);
    var fresh = getScheduleData(period.periodKey);
    setScheduleData(fresh);
    setSaving(false);
    setSaveMsg('保存しました！');
    setTimeout(function() { setSaveMsg(''); }, 3000);
    if (onSaved) onSaved();
  }

  function handleCompleteClick() {
    if (selectedDates.length === 0 && !window.confirm('出席可能な日がない状態で完了にしますか？')) return;
    handleSave();
  }

  var myData       = scheduleData.members[currentUser] || {};
  var myCompleted  = !!myData.isCompleted;
  var completedCnt = Object.values(scheduleData.members).filter(function(m) { return m.isCompleted; }).length;
  var pending      = MEMBERS.filter(function(m) { return !(scheduleData.members[m] && scheduleData.members[m].isCompleted); });
  var periodLabel  = (period.start.getMonth()+1) + '月' + period.start.getDate() + '日 〜 ' +
                     (period.end.getMonth()+1)   + '月' + period.end.getDate()   + '日';

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'#1F2937', margin:'0 0 4px' }}>📅 MTG日程調整</h1>
        <p style={{ fontSize:13, color:'#6B7280', margin:0 }}>対象期間：{periodLabel}</p>
      </div>

      {/* Member completion status bar */}
      <div style={{ background:'white', borderRadius:12, padding:'12px 16px', marginBottom:18,
                    boxShadow:'0 1px 6px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <span style={{ fontSize:13, color:'#6B7280', whiteSpace:'nowrap' }}>
          入力済：<strong style={{ color:'#1F2937' }}>{completedCnt}/{MEMBERS.length}名</strong>
        </span>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {MEMBERS.map(function(m) {
            var done = !!(scheduleData.members[m] && scheduleData.members[m].isCompleted);
            return (
              <div key={m} style={{ display:'flex', alignItems:'center', gap:3 }}>
                <MemberAvatar name={m} size={18} />
                <span style={{ fontSize:12, color:done?'#16A34A':'#9CA3AF', fontWeight:done?600:400 }}>
                  {m}{done?' ✓':''}
                </span>
              </div>
            );
          })}
        </div>
        {pending.length > 0 && (
          <div style={{ marginLeft:'auto', fontSize:12, color:'#D97706' }}>
            未入力：{pending.join('、')}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['mine','自分の予定を入力'],['overview','全員の予定を確認']].map(function(item) {
          var active = activeTab === item[0];
          return (
            <button
              key={item[0]}
              onClick={function() { setActiveTab(item[0]); }}
              style={{
                padding:'9px 18px', borderRadius:10, border:'none', cursor:'pointer',
                fontSize:14, fontWeight: active?700:500,
                background: active ? 'var(--accent,#22C55E)' : 'white',
                color:      active ? 'white' : '#6B7280',
                boxShadow:  active ? '0 2px 8px rgba(34,197,94,0.28)' : '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'all 0.15s',
              }}
            >
              {item[1]}
            </button>
          );
        })}
      </div>

      {/* ===== PERSONAL TAB ===== */}
      {activeTab === 'mine' && (
        <div>
          <div style={{ background:'#EFF6FF', borderRadius:10, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#1D4ED8' }}>
            出席可能な日をクリックして青く選択してください。変更はいつでも保存し直せます。
          </div>

          <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:20 }}>
            {months.map(function(m) {
              return (
                <PersonalMonthCalendar
                  key={m.year+'-'+m.month}
                  year={m.year} month={m.month}
                  periodStart={periodStart} periodEnd={periodEnd}
                  todayStr={todayStr}
                  selectedDates={selectedDates}
                  onToggle={toggleDate}
                  confirmedDates={scheduleData.confirmedDates || []}
                />
              );
            })}
          </div>

          {/* Save bar */}
          <div style={{ background:'white', borderRadius:12, padding:'14px 20px', display:'flex',
                        alignItems:'center', gap:16, boxShadow:'0 1px 6px rgba(0,0,0,0.06)', flexWrap:'wrap' }}>
            <span style={{ fontSize:14, color:'#6B7280' }}>
              選択中：<strong style={{ color:'#3B82F6', fontSize:18 }}>{selectedDates.length}</strong>日
            </span>
            {saveMsg && <span style={{ fontSize:13, color:'#16A34A', fontWeight:600 }}>{saveMsg}</span>}
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              {myCompleted && (
                <span style={{ fontSize:12, color:'#16A34A', fontWeight:500 }}>✓ 入力済（変更して再保存できます）</span>
              )}
              <button
                onClick={handleCompleteClick}
                disabled={saving}
                style={{
                  background:'var(--accent,#22C55E)', color:'white', border:'none',
                  borderRadius:10, padding:'10px 24px', fontSize:14, fontWeight:700,
                  cursor:'pointer', boxShadow:'0 2px 8px rgba(34,197,94,0.28)',
                }}
              >
                {saving ? '保存中...' : myCompleted ? '変更を保存' : '入力完了'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === 'overview' && (
        <div>
          {/* Legend */}
          <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
            {[
              { bg:'transparent', border:'1px solid #E5E7EB', label:'0〜1名' },
              { bg:'#FEF08A', label:'2〜3名' },
              { bg:'#BFDBFE', label:'4〜5名（開催可）' },
              { bg:'#86EFAC', label:'全員参加可' },
              { bg:'#10B981', label:'MTG確定', textColor:'white' },
            ].map(function(item) {
              return (
                <div key={item.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:16, height:16, borderRadius:4, background:item.bg, border:item.border||'none', flexShrink:0 }} />
                  <span style={{ fontSize:12, color:'#6B7280' }}>{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Confirmed dates summary */}
          {scheduleData.confirmedDates && scheduleData.confirmedDates.length > 0 && (
            <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:12,
                          padding:'12px 16px', marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#065F46', marginBottom:8 }}>✅ MTG確定日</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {scheduleData.confirmedDates.map(function(d) {
                  return (
                    <span key={d} style={{ background:'#10B981', color:'white', borderRadius:8,
                                           padding:'4px 12px', fontSize:13, fontWeight:600 }}>
                      {_dateLabel(d)}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {months.map(function(m) {
              return (
                <OverviewMonthCalendar
                  key={m.year+'-'+m.month}
                  year={m.year} month={m.month}
                  periodStart={periodStart} periodEnd={periodEnd}
                  membersData={scheduleData.members}
                  confirmedDates={scheduleData.confirmedDates || []}
                  isMobile={isMobile}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== LOGIN POPUP =====
function SchedulePopup({ currentUser, onGoToSchedule, onSkip }) {
  var p      = getSchedulePeriod();
  var sLabel = (p.start.getMonth()+1) + '月' + p.start.getDate() + '日';
  var eLabel = (p.end.getMonth()+1)   + '月' + p.end.getDate()   + '日';

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:2000,
                  display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'white', borderRadius:20, padding:'36px 28px', maxWidth:400, width:'100%',
                    boxShadow:'0 24px 64px rgba(0,0,0,0.18)', textAlign:'center' }}>
        <div style={{ fontSize:52, marginBottom:8 }}>📅</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:'#1F2937', margin:'0 0 10px' }}>
          MTG日程を入力してください
        </h2>
        <p style={{ fontSize:14, color:'#6B7280', margin:'0 0 6px', lineHeight:1.6 }}>
          {currentUser}さんの出席可能日を登録することで<br />チームのMTG日程が自動的に調整されます。
        </p>
        <p style={{ fontSize:13, color:'#9CA3AF', margin:'0 0 28px' }}>
          対象期間：{sLabel} 〜 {eLabel}
        </p>
        <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
          <button
            onClick={onSkip}
            style={{ padding:'10px 20px', borderRadius:10, border:'1px solid #E5E7EB',
                     background:'white', color:'#6B7280', fontSize:14, cursor:'pointer', fontWeight:500 }}
          >
            後で入力する
          </button>
          <button
            onClick={onGoToSchedule}
            style={{ padding:'10px 24px', borderRadius:10, border:'none',
                     background:'var(--accent,#22C55E)', color:'white', fontSize:14,
                     fontWeight:700, cursor:'pointer', boxShadow:'0 2px 8px rgba(34,197,94,0.28)' }}
          >
            今すぐ入力する
          </button>
        </div>
      </div>
    </div>
  );
}
