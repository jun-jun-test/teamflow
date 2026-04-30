function App() {
  const [currentUser,     setCurrentUser]     = React.useState(() => loadFromStorage(STORAGE_KEYS.USER, null));
  const [page,            setPage]            = React.useState("dashboard");
  const [tasks,           setTasks]           = React.useState(() => loadFromStorage(STORAGE_KEYS.TASKS, SAMPLE_TASKS));
  const [kpis,            setKpis]            = React.useState(() => loadFromStorage(STORAGE_KEYS.KPIS,  SAMPLE_KPIS));
  const [isMobile,        setIsMobile]        = React.useState(window.innerWidth < 768);
  const [dbFlows,         setDbFlows]         = React.useState(null);
  const [dbBottlenecks,   setDbBottlenecks]   = React.useState(null);
  const [dbRelatedTasks,  setDbRelatedTasks]  = React.useState(null);
  const [profileOpen,     setProfileOpen]     = React.useState(false);
  const [memberPrefs,     setMemberPrefs]     = React.useState(() => {
    var p = loadFromStorage('kaiwai_member_prefs', {});
    applyMemberPrefs(p);
    return p;
  });
  const [appSettings,     setAppSettings]     = React.useState(() => {
    var s = loadFromStorage('kaiwai_app_settings', null);
    if (s) applyAppSettings(s);
    return window.APP_SETTINGS;
  });

  // ===== SCHEDULE STATE =====
  const [notifications,     setNotifications]     = React.useState(() => loadFromStorage('seed_notifications', []));
  const [scheduleCompleted, setScheduleCompleted] = React.useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = React.useState(false);

  function refreshSchedule(user) {
    var period = getSchedulePeriod();
    checkMonthlyReminder(period.periodKey);
    var done = isScheduleCompleted(user, period.periodKey);
    setScheduleCompleted(done);
    setShowSchedulePopup(!done);
    setNotifications(loadFromStorage('seed_notifications', []));
  }

  function handleScheduleSaved() {
    var period = getSchedulePeriod();
    var done = isScheduleCompleted(currentUser, period.periodKey);
    setScheduleCompleted(done);
    setShowSchedulePopup(false);
    setNotifications(loadFromStorage('seed_notifications', []));
  }

  function handleMarkAllRead() {
    markAllNotifsRead(currentUser);
    setNotifications(loadFromStorage('seed_notifications', []));
  }

  React.useEffect(() => {
    var handler = function() { setIsMobile(window.innerWidth < 768); };
    window.addEventListener("resize", handler);
    return function() { window.removeEventListener("resize", handler); };
  }, []);

  React.useEffect(() => {
    var saved = loadFromStorage("kaiwai_tweaks", TWEAK_DEFAULTS_INITIAL);
    applyTheme(saved);
  }, []);

  // ── Supabaseのデータを全Stateへ反映する共通関数 ──
  // null=読み込みエラー（スキップ）、[]=DBが空（適用）、[...]=データあり（適用）
  function applyDBData(dbData) {
    if (!dbData) return;
    if (dbData.tasks !== null) {
      setTasks(dbData.tasks);
      try { localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(dbData.tasks)); } catch(e) {}
    }
    if (dbData.kpis !== null) {
      setKpis(dbData.kpis);
      try { localStorage.setItem(STORAGE_KEYS.KPIS, JSON.stringify(dbData.kpis)); } catch(e) {}
    }
    if (dbData.flows !== null) {
      setDbFlows(dbData.flows);
      try { localStorage.setItem(STORAGE_KEYS.FLOWS, JSON.stringify(dbData.flows)); } catch(e) {}
    }
    if (dbData.bottlenecks !== null) {
      setDbBottlenecks(dbData.bottlenecks);
      try { localStorage.setItem('kaiwai_bottlenecks', JSON.stringify(dbData.bottlenecks)); } catch(e) {}
    }
    if (dbData.relatedTasks !== null) {
      setDbRelatedTasks(dbData.relatedTasks);
      try { localStorage.setItem('kaiwai_related_tasks', JSON.stringify(dbData.relatedTasks)); } catch(e) {}
    }
    if (dbData.memberPrefs !== null) {
      applyMemberPrefs(dbData.memberPrefs);
      setMemberPrefs(dbData.memberPrefs);
      try { localStorage.setItem('kaiwai_member_prefs', JSON.stringify(dbData.memberPrefs)); } catch(e) {}
    }
    if (dbData.schedule !== null) {
      try { localStorage.setItem('seed_schedule', JSON.stringify(dbData.schedule)); } catch(e) {}
    }
    if (dbData.notifications !== null) {
      setNotifications(dbData.notifications);
      try { localStorage.setItem('seed_notifications', JSON.stringify(dbData.notifications)); } catch(e) {}
    }
  }

  // ── 初回起動：Supabase→State反映 ＋ Supabaseが空（読み込み成功）ならlocalをプッシュ ──
  // 重要: null（読み込みエラー）のテーブルにはプッシュしない（古いデータで上書きを防ぐため）
  React.useEffect(() => {
    if (!window.db) return;
    loadAllFromDB().then(function(dbData) {
      if (!dbData) return;
      applyDBData(dbData);
      // null=エラー（スキップ）、[]=読み込み成功かつ空（localをプッシュ）
      if (dbData.tasks         !== null && dbData.tasks.length === 0)        { var lt=loadFromStorage(STORAGE_KEYS.TASKS,[]); if(lt.length>0) window._syncToDB('tasks',lt,'upsert'); }
      if (dbData.kpis          !== null && dbData.kpis.length === 0)         { var lk=loadFromStorage(STORAGE_KEYS.KPIS,[]); if(lk.length>0) window._syncToDB('kpis',lk,'upsert'); }
      if (dbData.flows         !== null && dbData.flows.length === 0)        { var lf=loadFromStorage(STORAGE_KEYS.FLOWS,[]); if(lf.length>0) window._syncToDB('flows',lf,'replace'); }
      if (dbData.bottlenecks   !== null && dbData.bottlenecks.length === 0)  { var lb=loadFromStorage('kaiwai_bottlenecks',[]); if(lb.length>0) window._syncToDB('bottlenecks',lb,'replace'); }
      if (dbData.relatedTasks  !== null && dbData.relatedTasks.length === 0) { var lr=loadFromStorage('kaiwai_related_tasks',[]); if(lr.length>0) window._syncToDB('related_tasks',lr,'replace'); }
      if (dbData.memberPrefs   !== null && Object.keys(dbData.memberPrefs).length === 0) { var lmp=loadFromStorage('kaiwai_member_prefs',null); if(lmp&&Object.keys(lmp).length>0) window._syncSingleToDB('member_prefs','prefs',lmp); }
      if (dbData.schedule      === null || !dbData.schedule) { /* schedule is a single object, skip push on error */ }
      if (dbData.notifications !== null && dbData.notifications.length === 0) { var ln=loadFromStorage('seed_notifications',[]); if(ln.length>0) window._syncToDB('notifications',ln,'replace'); }
    }).catch(function(e) { console.warn('[Supabase] 読み込みエラー:', e); });
  }, []);

  // ── Supabase Realtime：DBが変わった瞬間に全端末へ即時配信 ──
  React.useEffect(() => {
    if (!window.db) return;
    var WATCH_TABLES = ['tasks','kpis','flows','bottlenecks','related_tasks','member_prefs','schedule','notifications'];
    var ch = window.db.channel('seed-realtime-all');
    WATCH_TABLES.forEach(function(table) {
      ch.on('postgres_changes', { event: '*', schema: 'public', table: table }, function() {
        loadAllFromDB().then(function(d) { if (d) applyDBData(d); });
      });
    });
    ch.subscribe(function(status) {
      console.info('[Realtime]', status);
    });
    return function() { try { window.db.removeChannel(ch); } catch(e) {} };
  }, []);

  // ── 定期ポーリング（15秒）＋ タブに戻ったとき即時同期（Realtimeのフォールバック） ──
  React.useEffect(() => {
    if (!window.db) return;
    function refresh() {
      loadAllFromDB().then(function(d) { if (d) applyDBData(d); });
    }
    var timer = setInterval(refresh, 5000);
    window.addEventListener('focus', refresh);
    return function() {
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  // Refresh schedule state when user changes
  React.useEffect(function() {
    if (currentUser) refreshSchedule(currentUser);
  }, [currentUser]);

  function handleSelectUser(name) {
    setCurrentUser(name);
    saveToStorage(STORAGE_KEYS.USER, name);
    setPage("dashboard");
  }

  function handleChangeUser(name) {
    setCurrentUser(name);
    saveToStorage(STORAGE_KEYS.USER, name);
  }

  function handleSaveMemberPref(member, newPref) {
    var updated = Object.assign({}, memberPrefs);
    updated[member] = newPref;
    setMemberPrefs(updated);
    saveToStorage('kaiwai_member_prefs', updated);
    applyMemberPrefs(updated);
  }

  function handleSaveSettings(newSettings) {
    applyAppSettings(newSettings);
    setAppSettings(Object.assign({}, newSettings));
  }

  if (!currentUser) {
    return <NameSelectPage onSelect={handleSelectUser} isMobile={isMobile} />;
  }

  const sidebarW = isMobile ? 0 : 200;

  function renderPage() {
    switch (page) {
      case "dashboard": return <DashboardPage currentUser={currentUser} tasks={tasks} setTasks={setTasks} kpis={kpis} setKpis={setKpis} isMobile={isMobile} appSettings={appSettings} />;
      case "mytasks":   return <MyTasksPage   currentUser={currentUser} tasks={tasks} setTasks={setTasks} isMobile={isMobile} />;
      case "workflow":  return <WorkflowPage  tasks={tasks} isMobile={isMobile} initialFlows={dbFlows} initialBottlenecks={dbBottlenecks} initialRelatedTasks={dbRelatedTasks} />;
      case "create":    return <TaskCreatePage currentUser={currentUser} tasks={tasks} setTasks={setTasks} isMobile={isMobile} />;
      case "schedule":  return <SchedulePage  currentUser={currentUser} onSaved={handleScheduleSaved} isMobile={isMobile} />;
      case "settings":  return <SettingsPage  appSettings={appSettings} onSaveSettings={handleSaveSettings} isMobile={isMobile} />;
      default:          return <DashboardPage currentUser={currentUser} tasks={tasks} setTasks={setTasks} kpis={kpis} setKpis={setKpis} isMobile={isMobile} appSettings={appSettings} />;
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"var(--app-bg,#F8FAF8)", fontFamily:"'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif" }}>
      <Header
        currentUser={currentUser}
        onChangeUser={handleChangeUser}
        onOpenProfile={() => setProfileOpen(true)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        scheduleIncomplete={!scheduleCompleted}
        onGoSchedule={() => { setShowSchedulePopup(false); setPage("schedule"); }}
      />
      {!isMobile && <Sidebar page={page} setPage={setPage} />}
      <main style={{ marginLeft:sidebarW, paddingTop:64, paddingBottom:isMobile?72:0 }}>
        <div style={{ padding:isMobile?"24px 16px":"28px 32px", maxWidth:1280 }}>
          {renderPage()}
        </div>
      </main>
      {isMobile && <BottomNav page={page} setPage={setPage} />}
      <AppTweaks />
      {profileOpen && (
        <ProfileModal
          member={currentUser}
          currentPrefs={memberPrefs[currentUser]}
          onSave={handleSaveMemberPref}
          onClose={() => setProfileOpen(false)}
        />
      )}
      {showSchedulePopup && (
        <SchedulePopup
          currentUser={currentUser}
          onGoToSchedule={() => { setShowSchedulePopup(false); setPage("schedule"); }}
          onSkip={() => setShowSchedulePopup(false)}
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
