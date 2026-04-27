function App() {
  const [currentUser,     setCurrentUser]     = React.useState(() => loadFromStorage(STORAGE_KEYS.USER, null));
  const [page,            setPage]            = React.useState("dashboard");
  const [tasks,           setTasks]           = React.useState(() => loadFromStorage(STORAGE_KEYS.TASKS, SAMPLE_TASKS));
  const [kpis,            setKpis]            = React.useState(() => loadFromStorage(STORAGE_KEYS.KPIS,  SAMPLE_KPIS));
  const [isMobile,        setIsMobile]        = React.useState(window.innerWidth < 768);
  const [dbFlows,         setDbFlows]         = React.useState(null);
  const [dbBottlenecks,   setDbBottlenecks]   = React.useState(null);
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

  React.useEffect(() => {
    if (!window.db) return;
    loadAllFromDB().then(function(dbData) {
      if (!dbData) return;
      if (dbData.tasks.length > 0) {
        setTasks(dbData.tasks);
        try { localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(dbData.tasks)); } catch(e) {}
      }
      if (dbData.kpis.length > 0) {
        setKpis(dbData.kpis);
        try { localStorage.setItem(STORAGE_KEYS.KPIS, JSON.stringify(dbData.kpis)); } catch(e) {}
      }
      if (dbData.flows.length > 0) {
        setDbFlows(dbData.flows);
        try { localStorage.setItem(STORAGE_KEYS.FLOWS, JSON.stringify(dbData.flows)); } catch(e) {}
      }
      if (dbData.bottlenecks.length > 0) {
        setDbBottlenecks(dbData.bottlenecks);
        try { localStorage.setItem('kaiwai_bottlenecks', JSON.stringify(dbData.bottlenecks)); } catch(e) {}
      }
    }).catch(function(e) { console.warn('[Supabase] 読み込みエラー:', e); });
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
      case "workflow":  return <WorkflowPage  tasks={tasks} isMobile={isMobile} initialFlows={dbFlows} initialBottlenecks={dbBottlenecks} />;
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
