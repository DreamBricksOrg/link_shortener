const { Button, IconButton, Badge, Tag, Input, Select, Tabs, Card, Dialog, Toast, Tooltip } =
  window.DreamBricksDesignSystem_6b66b1;
const Icons = window.DBIcons;
const { PROJECTS, ACTIVITY } = window.DASHBOARD_DATA;

const STATUS_TONE = { active: 'brand', at_risk: 'warning', completed: 'success' };
const STATUS_LABEL = { active: 'Active', at_risk: 'At risk', completed: 'Completed' };

function Avatar({ initials, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: 'var(--db-blue-100)', color: 'var(--db-blue-700)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700,
      border: '2px solid var(--surface-card)', marginLeft: -8, fontFamily: 'var(--font-body)',
    }}>{initials}</div>
  );
}

function Logo({ variant = 'onblue', style }) {
  return <img src={`../../assets/logos/dreambricks-horizontal-${variant}.svg`} style={{ height: 28, ...style }} alt="DreamBricks" />;
}

/* ---------------- Login ---------------- */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = React.useState('ana@dreambricks.com');
  const [password, setPassword] = React.useState('••••••••');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-body)' }}>
      <div style={{
        flex: 1, background: 'var(--db-blue-500)', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: 48, boxSizing: 'border-box', color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <Logo variant="onblue" />
        <div style={{ maxWidth: 380, position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, margin: '0 0 12px' }}>Every project, one clear picture.</h1>
          <p style={{ fontSize: 16, fontWeight: 300, opacity: 0.9 }}>Track what's underway and see what's already shipped — all in one dashboard.</p>
        </div>
        <img src="../../assets/illustrations/jobson-mascot-walking.png" style={{ width: 150, opacity: 0.95, alignSelf: 'flex-end' }} />
      </div>
      <div style={{ width: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: 320 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 28px' }}>Sign in to your DreamBricks account.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Email" icon={<Icons.Mail size={16} style={{ color: 'var(--text-tertiary)' }} />} value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Password" type="password" icon={<Icons.Lock size={16} style={{ color: 'var(--text-tertiary)' }} />} value={password} onChange={e => setPassword(e.target.value)} />
            <Button fullWidth size="lg" onClick={onLogin} style={{ marginTop: 8 }}>Sign in</Button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 20, textAlign: 'center' }}>Prototype — any credentials will work.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Shell (sidebar + topbar) ---------------- */
function Sidebar({ activeNav, onNav, onLogout }) {
  const items = [
    { key: 'home', label: 'Overview', icon: Icons.Home },
    { key: 'projects', label: 'Projects', icon: Icons.Folder },
    { key: 'team', label: 'Team', icon: Icons.Users },
    { key: 'settings', label: 'Settings', icon: Icons.Settings },
  ];
  return (
    <div style={{
      width: 220, flexShrink: 0, background: 'var(--db-blue-900)', color: '#fff',
      display: 'flex', flexDirection: 'column', padding: '20px 14px', boxSizing: 'border-box', height: '100vh', position: 'sticky', top: 0,
    }}>
      <div style={{ padding: '4px 8px 24px' }}><Logo variant="onblue" /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(item => {
          const active = activeNav === item.key;
          const Ico = item.icon;
          return (
            <button key={item.key} onClick={() => onNav(item.key)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)',
              border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
              background: active ? 'rgba(255,255,255,0.14)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.72)',
              transition: 'background 120ms',
            }}>
              <Ico size={17} />{item.label}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <img src="../../assets/illustrations/jobson-and-cat-small.png" style={{ width: '100%', opacity: 0.9 }} />
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)',
          border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', fontSize: 14,
        }}><Icons.LogOut size={16} />Log out</button>
      </div>
    </div>
  );
}

function TopBar({ title, onSearch }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 220 }}>
          <Input placeholder="Search projects…" icon={<Icons.Search size={15} style={{ color: 'var(--text-tertiary)' }} />} />
        </div>
        <Tooltip label="Notifications"><IconButton icon={<Icons.Bell size={17} />} label="Notifications" /></Tooltip>
        <Avatar initials="AL" size={34} />
      </div>
    </div>
  );
}

/* ---------------- Dashboard home ---------------- */
function StatCard({ label, value, sub, tone }) {
  return (
    <Card>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: tone || 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>{sub}</div>}
    </Card>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <Card hoverable onClick={() => onOpen(project)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <Badge tone={STATUS_TONE[project.status]} dot>{STATUS_LABEL[project.status]}</Badge>
        <Icons.ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{project.name}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 16px' }}>{project.client}</p>
      <div style={{ height: 6, background: 'var(--db-slate-100)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: '100%', width: `${project.progress}%`, background: project.status === 'at_risk' ? 'var(--db-warning-500)' : 'var(--db-blue-500)', borderRadius: 'var(--radius-pill)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Calendar size={13} />{project.due}</span>
        <div style={{ display: 'flex' }}>{project.team.map(t => <Avatar key={t} initials={t} size={24} />)}</div>
      </div>
    </Card>
  );
}

function DashboardHome({ onOpenProject }) {
  const [tab, setTab] = React.useState('all');
  const filtered = PROJECTS.filter(p => tab === 'all' ? true : tab === 'active' ? p.status !== 'completed' : p.status === 'completed');
  const activeCount = PROJECTS.filter(p => p.status !== 'completed').length;
  const completedCount = PROJECTS.filter(p => p.status === 'completed').length;
  const atRisk = PROJECTS.filter(p => p.status === 'at_risk').length;

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Active projects" value={activeCount} sub="Across 5 clients" />
        <StatCard label="Completed" value={completedCount} sub="This quarter" tone="var(--db-success-500)" />
        <StatCard label="At risk" value={atRisk} sub="Needs attention" tone="var(--db-warning-500)" />
        <StatCard label="Team members" value="6" sub="3 currently assigned" />
      </div>

      <div>
        <Tabs items={[{ value: 'all', label: 'All projects', count: PROJECTS.length }, { value: 'active', label: 'Active', count: activeCount }, { value: 'completed', label: 'Completed', count: completedCount }]} value={tab} onChange={setTab} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
          {filtered.map(p => <ProjectCard key={p.id} project={p} onOpen={onOpenProject} />)}
        </div>
      </div>

      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: 'var(--text-primary)' }}>Recent activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
              <Avatar initials={a.who.split(' ').map(w => w[0]).join('')} size={26} />
              <div style={{ color: 'var(--text-primary)' }}><b>{a.who}</b> <span style={{ color: 'var(--text-secondary)' }}>{a.what}</span> · <span style={{ color: 'var(--db-blue-600)' }}>{a.project}</span></div>
              <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>{a.when}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Project detail ---------------- */
function ProjectDetail({ project, onBack }) {
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  return (
    <div style={{ padding: 32 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, marginBottom: 16, fontFamily: 'var(--font-body)' }}>
        <Icons.ArrowLeft size={15} />Back to projects
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <Badge tone={STATUS_TONE[project.status]} dot>{STATUS_LABEL[project.status]}</Badge>
            <Tag color="var(--db-blue-500)">{project.client}</Tag>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{project.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => setToast({ tone: 'success', title: 'Link copied', message: 'Shareable link copied to clipboard.' })}>Share</Button>
          <Button variant="danger" icon={<Icons.Trash size={15} />} onClick={() => setArchiveOpen(true)}>Archive</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px' }}>About</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{project.description}</p>
          </Card>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Progress</h3>
            <div style={{ height: 8, background: 'var(--db-slate-100)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${project.progress}%`, background: project.status === 'at_risk' ? 'var(--db-warning-500)' : 'var(--db-blue-500)' }} />
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{project.progress}% complete · due {project.due}</span>
          </Card>
          {project.status === 'at_risk' && (
            <Card style={{ background: 'var(--db-warning-100)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Icons.AlertTriangle size={18} style={{ color: '#8a5a00', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#5c3d00' }}>This project needs attention</div>
                  <div style={{ fontSize: 13, color: '#5c3d00' }}>Timeline slipped 6 days behind schedule. Review with the team.</div>
                </div>
              </div>
            </Card>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Team</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {project.team.map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <Avatar initials={t} size={28} /><span style={{ color: 'var(--text-primary)' }}>{t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={archiveOpen} onClose={() => setArchiveOpen(false)} title="Archive this project?"
        actions={<><Button variant="secondary" onClick={() => setArchiveOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => { setArchiveOpen(false); setToast({ tone: 'info', title: 'Project archived' }); }}>Archive</Button></>}>
        {project.name} will move to Archived. You can restore it from Settings within 30 days.
      </Dialog>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
          <Toast {...toast} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}

/* ---------------- App shell ---------------- */
function App() {
  const [screen, setScreen] = React.useState('login');
  const [activeNav, setActiveNav] = React.useState('home');
  const [selectedProject, setSelectedProject] = React.useState(null);

  if (screen === 'login') return <LoginScreen onLogin={() => setScreen('app')} />;

  return (
    <div style={{ display: 'flex', background: 'var(--surface-page)', minHeight: '100vh' }}>
      <Sidebar activeNav={activeNav} onNav={key => { setActiveNav(key); setSelectedProject(null); }} onLogout={() => setScreen('login')} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {!selectedProject && <TopBar title={activeNav === 'home' ? 'Overview' : activeNav === 'projects' ? 'Projects' : activeNav === 'team' ? 'Team' : 'Settings'} />}
        {selectedProject
          ? <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
          : <DashboardHome onOpenProject={setSelectedProject} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
