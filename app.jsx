function App() {
  const [currentUser,  setCurrentUser]  = React.useState(() => loadFromStorage(STORAGE_KEYS.USER, null));
  const [page,         setPage]         = React.useState("dashboard");
  const [tasks,        setTasks]        = React.useState(() => loadFromStorage(STORAGE_KEYS.TASKS, SAMPLE_TASKS));
  const [kpis,         setKpis]         = React.useState(() => loadFromStorage(STORAGE_KEYS.KPIS,  SAMPLE_KPIS));
  const [isMobile,     setIsMobile]     = React.useState(window.innerWidth < 768);
  const [profileOpen,  setProfileOpen]  = React.useState(false);
  const [memberPrefs,  setMemberPrefs]  = React.useState(() => {
    var p = loadFromStorage('kaiwai_member_prefs', {});
    applyMemberPrefs(p);
    return p;
  });
  const [appSettings,  setAppSettings]  = React.useState(() => {
    var s = loadFromStorage('kaiwai_app_settings', null);
    if (s) applyAppSettings(s);
    return window.APP_SETTINGS;
  });

  // ===== PIN AUTH =====
  const [pinPending, setPinPending] = React.useState(null);
  const [pinError,   setPinError]   = React.useState(false);

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

  // ── Supabaseのデータを全Stateへ反映する共通関数 ──
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

  // ── 初回起動：Supabase→State反映 ──
  React.useEffect(() => {
    if (!window.db) return;
    loadAllFromDB().then(function(dbData) {
      if (!dbData) return;
      applyDBData(dbData);
      if (dbData.tasks  !== null && dbData.tasks.length === 0)  { var lt=loadFromStorage(STORAGE_KEYS.TASKS,[]); if(lt.length>0) window._syncToDB('tasks',lt,'upsert'); }
      if (dbData.kpis   !== null && dbData.kpis.length === 0)   { var lk=loadFromStorage(STORAGE_KEYS.KPIS,[]); if(lk.length>0) window._syncToDB('kpis',lk,'upsert'); }
      if (dbData.memberPrefs !== null && Object.keys(dbData.memberPrefs).length === 0) { var lmp=loadFromStorage('kaiwai_member_prefs',null); if(lmp&&Object.keys(lmp).length>0) window._syncSingleToDB('member_prefs','prefs',lmp); }
      if (dbData.notifications !== null && dbData.notifications.length === 0) { var ln=loadFromStorage('seed_notifications',[]); if(ln.length>0) window._syncToDB('notifications',ln,'replace'); }
    }).catch(function(e) { console.warn('[Supabase] 読み込みエラー:', e); });
  }, []);

  // ── Supabase Realtime ──
  React.useEffect(() => {
    if (!window.db) return;
    var WATCH_TABLES = ['tasks','kpis','member_prefs','schedule','notifications'];
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

  // ── 定期ポーリング（5秒）＋ タブに戻ったとき即時同期 ──
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

  // ── ユーザー変更時：スケジュール確認 ＋ 期限通知チェック ──
  React.useEffect(function() {
    if (!currentUser) return;
    refreshSchedule(currentUser);
    if (window.checkDueDateNotifications) {
      var newNotifs = checkDueDateNotifications(tasks, currentUser);
      if (newNotifs.length > 0) setNotifications(loadFromStorage('seed_notifications', []));
    }
  }, [currentUser]);

  function handleSelectUser(name) {
    if (window.hasPIN && hasPIN(name)) {
      setPinPending({ name: name, isChange: false });
    } else {
      setCurrentUser(name);
      saveToStorage(STORAGE_KEYS.USER, name);
      setPage("dashboard");
    }
  }

  function handleChangeUser(name) {
    if (window.hasPIN && hasPIN(name)) {
      setPinPending({ name: name, isChange: true });
    } else {
      setCurrentUser(name);
      saveToStorage(STORAGE_KEYS.USER, name);
    }
  }

  function handlePINSubmit(pin) {
    if (!pinPending) return;
    if (checkPIN(pinPending.name, pin)) {
      setCurrentUser(pinPending.name);
      saveToStorage(STORAGE_KEYS.USER, pinPending.name);
      if (!pinPending.isChange) setPage("dashboard");
      setPinPending(null);
      setPinError(false);
    } else {
      setPinError(true);
    }
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
    return (
      <>
        <NameSelectPage onSelect={handleSelectUser} isMobile={isMobile} />
        {pinPending && (
          <PINEntryModal
            name={pinPending.name}
            error={pinError}
            onSubmit={handlePINSubmit}
            onCancel={function(){ setPinPending(null); setPinError(false); }}
          />
        )}
      </>
    );
  }

  const sidebarW = isMobile ? 0 : 200;

  function renderPage() {
    switch (page) {
      case "dashboard": return <DashboardPage currentUser={currentUser} tasks={tasks} setTasks={setTasks} kpis={kpis} setKpis={setKpis} isMobile={isMobile} appSettings={appSettings} />;
      case "mytasks":   return <MyTasksPage   currentUser={currentUser} tasks={tasks} setTasks={setTasks} isMobile={isMobile} />;
      case "calendar":  return <CalendarPage  currentUser={currentUser} tasks={tasks} setTasks={setTasks} isMobile={isMobile} />;
      case "create":    return <TaskCreatePage currentUser={currentUser} tasks={tasks} setTasks={setTasks} isMobile={isMobile} onTaskCreated={() => setNotifications(loadFromStorage('seed_notifications', []))} />;
      case "workflow":  return <WorkflowPage  tasks={tasks} isMobile={isMobile} />;
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
      <main style={{ marginLeft:sidebarW, paddingTop:64, paddingBottom:isMobile?80:0 }}>
        <div style={{ padding:isMobile?"20px 14px":"28px 32px", maxWidth:1280 }}>
          {renderPage()}
        </div>
      </main>
      {isMobile && <BottomNav page={page} setPage={setPage} />}
      {profileOpen && (
        <ProfileModal
          member={currentUser}
          currentPrefs={memberPrefs[currentUser]}
          onSave={handleSaveMemberPref}
          onClose={() => setProfileOpen(false)}
        />
      )}
      {pinPending && (
        <PINEntryModal
          name={pinPending.name}
          error={pinError}
          onSubmit={handlePINSubmit}
          onCancel={function(){ setPinPending(null); setPinError(false); }}
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
