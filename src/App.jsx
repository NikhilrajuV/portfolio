import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  ArrowDown, ArrowRight, Award, BrainCircuit, Camera, Check, ChevronDown, Code2,
  Download, ExternalLink, FileText, Github, GraduationCap, Mail, Menu, MessageCircle,
  Moon, Send, ShieldCheck, Sparkles, Sun, X, BriefcaseBusiness, Cpu, Zap, Linkedin,
  LockKeyhole, LogOut, Save, UserRound, Orbit
} from 'lucide-react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db, firebaseConfigured } from './firebase';
import './App.css';
import './reference.css';

const DEFAULT_CONTENT = {
  profile: {
    name: 'Nikhil Raju Vadali', email: 'nikhilrajuvadali48@gmail.com',
    photo: '/nikhil-passport-photo.webp', resume: '/nikhil-resume-v3.pdf',
    github: 'https://github.com/NikhilrajuV',
    linkedin: 'https://www.linkedin.com/in/nikhilrajuvadali-627b5433b/',
    freelance: 'https://flux-site-ury9.onrender.com/', cgpa: '7.77', semester: '7th Semester',
    headline: 'CSE (AI & ML) student passionate about building intelligent systems, computer vision solutions and modern web applications. I love turning ideas into impactful real-world products.',
    aboutOne: 'I’m a B.Tech CSE (AI & ML) student interested in applied AI, computer vision, and building useful products. I enjoy taking an idea from experimentation to a working prototype, combining research, engineering, and thoughtful UI.',
    aboutTwo: 'Currently exploring intelligent vision systems, Wi-Fi sensing, and full-stack application development.',
    availability: 'Open to Opportunities', focus: 'AI & ML', chatEndpoint: '', chatGreeting: 'Hi! I’m the portfolio assistant. Ask me about Nikhil’s projects, skills, experience, or how to get in touch.',
  },
  skills: [
    { name: 'Python', short: 'PY', category: 'AI / ML' }, { name: 'JavaScript', short: 'JS', category: 'Web' },
    { name: 'React', short: 'RE', category: 'Web' }, { name: 'Node.js', short: 'ND', category: 'Web' },
    { name: 'PyTorch', short: 'PT', category: 'AI / ML' }, { name: 'TensorFlow', short: 'TF', category: 'AI / ML' },
    { name: 'OpenCV', short: 'CV', category: 'Computer Vision' }, { name: 'Firebase', short: 'FB', category: 'Backend' },
    { name: 'Flutter', short: 'FL', category: 'Mobile' }, { name: 'Git', short: 'GI', category: 'Tools' },
    { name: 'HTML & CSS', short: 'HC', category: 'Web' }, { name: 'SQL', short: 'DB', category: 'Data' },
  ],
  ribbonTech: [
    { name: 'Visual Studio Code', mark: '⌘', kind: 'vscode' }, { name: 'Python', mark: 'Py', kind: 'python' },
    { name: 'React', mark: '⚛', kind: 'react' }, { name: 'Node.js', mark: '⬡', kind: 'node' },
    { name: 'Firebase', mark: '▲', kind: 'firebase' }, { name: 'MySQL', mark: '⌁', kind: 'mysql' },
    { name: 'Git', mark: '◆', kind: 'git' }, { name: 'GitHub', mark: '●', kind: 'github' }, { name: 'Figma', mark: '●', kind: 'figma' },
  ],
  projects: [
    { id: 'face-morph', number: '01', title: 'Hybrid Face Morph Detection', category: 'AI / COMPUTER VISION', description: 'Detecting morphed faces using a hybrid CNN + Vision Transformer model for enhanced identity verification.', problem: 'Face morphing can undermine identity verification systems by making one image represent multiple identities.', solution: 'A hybrid CNN + Vision Transformer pipeline classifies images as genuine or morphed and supports visual model interpretation.', results: 'Research prototype; report evaluation metrics from the latest validated experiment before publishing.', tech: ['Python', 'PyTorch', 'CNN + ViT'], image: '/project-face-reference.webp', github: 'https://github.com/NikhilrajuV', demo: '' },
    { id: 'wivision', number: '02', title: 'WiVision AI', category: 'AI RESEARCH / WI-FI SENSING', description: 'Wi-Fi-based human activity recognition without conventional cameras.', problem: 'Camera-based monitoring can be unsuitable in privacy-sensitive environments.', solution: 'Explore CSI-based signal processing and activity recognition with a visual skeleton-style representation.', results: 'Prototype/research exploration; add measured accuracy and dataset-specific results after validation.', tech: ['Python', 'Wi-Fi CSI', 'Pygame'], image: '/project-wivision-reference.webp', github: 'https://github.com/NikhilrajuV', demo: '' },
    { id: 'visitor', number: '03', title: 'Visitor Management System', category: 'FULL STACK / MOBILE', description: 'QR-based visitor management platform with approvals and an admin dashboard.', problem: 'Manual visitor registers make approval workflows and tracking harder to manage.', solution: 'Flutter and Firebase support visitor registration, QR scanning, role-based access, and approval workflows.', results: 'Functional project prototype; connect a public demo when available.', tech: ['Flutter', 'Firebase', 'Firestore'], image: '/project-visitor-reference.webp', github: 'https://github.com/NikhilrajuV', demo: '' },
  ],
  experience: [
    { id: 'nit', type: 'RESEARCH EXPERIENCE', title: 'Research Intern', organization: 'NIT Warangal', details: 'AI · Computer Vision · Research', period: 'Research experience' },
    { id: 'placemantra', type: 'INDUSTRY EXPERIENCE', title: 'Data Science Intern', organization: 'Placemantra', details: 'Data · Analysis · Machine Learning', period: 'Internship' },
  ],
  certificates: [],
  settings: { showChat: true, showGalaxy: true, showChatGPTCredit: true, ribbonSpeed: 28 },
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const safeUrl = (value) => /^https?:\/\//i.test(value || '') || (value || '').startsWith('mailto:') || (value || '').startsWith('/') ? value : '#';

function MouseGlow() {
  useEffect(() => {
    const move = (event) => {
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
    };
    const hover = (event) => document.body.classList.toggle('glow-small', Boolean(event.target.closest('a,button')));
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', hover);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerover', hover); };
  }, []);
  return <div className="mouse-glow" aria-hidden="true" />;
}

function SectionHeading({ eyebrow, children, action }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{children}</h2></div>{action}</div>;
}

function TechMark({ tech }) {
  return <span className={`skill-logo tech-${tech.kind}`} title={tech.name} aria-label={tech.name}>{tech.mark}</span>;
}

function ChatAssistant({ content, onClose }) {
  const [messages, setMessages] = useState([{ role: 'assistant', text: content.profile.chatGreeting }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  async function sendMessage(event) {
    event.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    setMessages((old) => [...old, { role: 'user', text: question }]); setInput(''); setBusy(true);
    try {
      let answer = '';
      if (content.profile.chatEndpoint) {
        const response = await fetch(content.profile.chatEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: question, profile: content }) });
        if (!response.ok) throw new Error('Assistant service unavailable');
        const data = await response.json(); answer = data.answer || data.reply || 'I could not find an answer for that.';
      } else {
        const q = question.toLowerCase();
        if (/project|build|work|morph|wivision|visitor/.test(q)) answer = `Nikhil's featured projects are ${content.projects.map((p) => p.title).join(', ')}. Open the Projects section for problem, solution, technology stack and project links.`;
        else if (/skill|technology|stack|language/.test(q)) answer = `Skills include ${content.skills.map((s) => s.name).join(', ')}. The skills section shows the full current list.`;
        else if (/experience|intern|work history/.test(q)) answer = `Experience includes ${content.experience.map((e) => `${e.title} at ${e.organization}`).join(' and ')}.`;
        else if (/contact|email|hire|linkedin|github/.test(q)) answer = `You can contact Nikhil at ${content.profile.email}, or use LinkedIn and GitHub links on this page.`;
        else if (/resume|cv/.test(q)) answer = 'Use the Download Resume button near the top of the portfolio to open or download the current CV.';
        else answer = `I can help with Nikhil's projects (${content.projects.map((p) => p.title).join(', ')}), skills, experience, resume, or contact details. Ask one of those topics.`;
      }
      setMessages((old) => [...old, { role: 'assistant', text: answer }]);
    } catch { setMessages((old) => [...old, { role: 'assistant', text: 'The connected AI service is unavailable right now. You can still explore the portfolio or contact Nikhil directly.' }]); }
    finally { setBusy(false); }
  }
  return <motion.aside className="assistant-panel" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .97 }} aria-label="Portfolio AI assistant">
    <div className="assistant-head"><span className="assistant-avatar"><Sparkles size={18}/></span><div><b>Portfolio Assistant</b><small>Ask about projects, skills & experience</small></div><button className="icon-button" onClick={onClose} aria-label="Close assistant"><X size={18}/></button></div>
    <div className="assistant-messages">{messages.map((message, i) => <div className={`assistant-message ${message.role}`} key={`${message.role}-${i}`}>{message.text}</div>)}{busy && <div className="assistant-message assistant">Thinking…</div>}</div>
    <form className="assistant-form" onSubmit={sendMessage}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about Nikhil…" aria-label="Ask the portfolio assistant"/><button className="primary-button" disabled={busy || !input.trim()} aria-label="Send message"><Send size={16}/></button></form>
    {!content.profile.chatEndpoint && <small className="assistant-note">FAQ mode. Connect a server-side AI endpoint for generated answers.</small>}
  </motion.aside>;
}

function AdminPanel({ content, onChange, onClose }) {
  const [tab, setTab] = useState('profile');
  const [draft, setDraft] = useState(() => clone(content));
  const [status, setStatus] = useState('');
  useEffect(() => setDraft(clone(content)), [content]);
  const updateProfile = (key, value) => setDraft((old) => ({ ...old, profile: { ...old.profile, [key]: value } }));
  const updateArrayItem = (key, id, field, value) => setDraft((old) => ({ ...old, [key]: old[key].map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  const addItem = (key, item) => setDraft((old) => ({ ...old, [key]: [...old[key], item] }));
  const removeItem = (key, id) => setDraft((old) => ({ ...old, [key]: old[key].filter((item) => item.id !== id) }));
  async function save() { setStatus('Saving…'); try { await onChange(draft); setStatus('Published successfully'); } catch (error) { setStatus(error.message || 'Could not save changes'); } }
  const field = (label, key, multiline = false) => <label className="admin-field" key={key}>{label}{multiline ? <textarea value={draft.profile[key] || ''} onChange={(e) => updateProfile(key, e.target.value)} rows={3}/> : <input value={draft.profile[key] || ''} onChange={(e) => updateProfile(key, e.target.value)}/>}</label>;
  const nav = [['profile','Profile'],['skills','Skills'],['projects','Projects'],['experience','Experience'],['certificates','Certificates'],['settings','Settings']];
  return <div className="admin-backdrop" role="presentation"><section className="admin-panel" role="dialog" aria-modal="true" aria-label="Portfolio content editor">
    <header className="admin-header"><div><span className="eyebrow">CONTENT MANAGEMENT</span><h2>Portfolio Admin</h2><p>Edit content and publish it across the website.</p></div><button className="icon-button" onClick={onClose} aria-label="Close admin"><X/></button></header>
    <nav className="admin-tabs">{nav.map(([id, label]) => <button key={id} className={tab === id ? 'selected' : ''} onClick={() => setTab(id)}>{label}</button>)}</nav>
    <div className="admin-body">
      {tab === 'profile' && <div className="admin-fields">{field('Full name','name')}{field('Email','email')}{field('Profile photo URL (public path or URL)','photo')}{field('Resume URL','resume')}{field('CGPA','cgpa')}{field('Semester label','semester')}{field('LinkedIn URL','linkedin')}{field('GitHub URL','github')}{field('Freelance website URL','freelance')}{field('Availability label','availability')}{field('Core interest','focus')}{field('Hero introduction','headline',true)}{field('About me — paragraph 1','aboutOne',true)}{field('About me — paragraph 2','aboutTwo',true)}{field('Chat assistant greeting','chatGreeting',true)}{field('Optional AI endpoint (server URL only; never put API secrets here)','chatEndpoint')}</div>}
      {tab === 'skills' && <><div className="admin-list">{draft.skills.map((skill) => <div className="admin-item" key={skill.name}><div className="admin-fields compact"><label className="admin-field">Skill name<input value={skill.name} onChange={(e) => setDraft((old) => ({ ...old, skills: old.skills.map((s) => s.name === skill.name ? { ...s, name: e.target.value } : s) }))}/></label><label className="admin-field">Short mark<input value={skill.short} onChange={(e) => setDraft((old) => ({ ...old, skills: old.skills.map((s) => s.name === skill.name ? { ...s, short: e.target.value } : s) }))}/></label><label className="admin-field">Category<input value={skill.category} onChange={(e) => setDraft((old) => ({ ...old, skills: old.skills.map((s) => s.name === skill.name ? { ...s, category: e.target.value } : s) }))}/></label></div><button className="danger-button" onClick={() => setDraft((old) => ({ ...old, skills: old.skills.filter((s) => s !== skill) }))}>Remove</button></div>)}</div><button className="outline-button" onClick={() => setDraft((old) => ({ ...old, skills: [...old.skills, { name: 'New skill', short: 'SK', category: 'Other' }] }))}>+ Add skill</button></>}
      {tab === 'projects' && <><div className="admin-list">{draft.projects.map((project) => <div className="admin-item stacked" key={project.id}><h3>{project.title}</h3><div className="admin-fields">{['title','category','description','problem','solution','results','image','github','demo'].map((key) => <label className="admin-field" key={key}>{key}<input value={project[key] || ''} onChange={(e) => updateArrayItem('projects', project.id, key, e.target.value)}/></label>)}<label className="admin-field">Tech stack (comma separated)<input value={project.tech.join(', ')} onChange={(e) => updateArrayItem('projects', project.id, 'tech', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}/></label></div><button className="danger-button" onClick={() => removeItem('projects', project.id)}>Remove project</button></div>)}</div><button className="outline-button" onClick={() => addItem('projects', { id: `project-${Date.now()}`, number: String(draft.projects.length + 1).padStart(2,'0'), title: 'New project', category: 'PROJECT', description: '', problem: '', solution: '', results: '', tech: [], image: '', github: '', demo: '' })}>+ Add project</button></>}
      {tab === 'experience' && <><div className="admin-list">{draft.experience.map((item) => <div className="admin-item stacked" key={item.id}><div className="admin-fields">{['type','title','organization','details','period'].map((key) => <label className="admin-field" key={key}>{key}<input value={item[key] || ''} onChange={(e) => updateArrayItem('experience', item.id, key, e.target.value)}/></label>)}</div><button className="danger-button" onClick={() => removeItem('experience', item.id)}>Remove experience</button></div>)}</div><button className="outline-button" onClick={() => addItem('experience', { id: `experience-${Date.now()}`, type: 'EXPERIENCE', title: 'New role', organization: 'Organization', details: '', period: '' })}>+ Add experience</button></>}
      {tab === 'certificates' && <><div className="admin-list">{draft.certificates.map((item) => <div className="admin-item stacked" key={item.id}><div className="admin-fields">{['title','issuer','date','image','link'].map((key) => <label className="admin-field" key={key}>{key}<input value={item[key] || ''} onChange={(e) => updateArrayItem('certificates', item.id, key, e.target.value)}/></label>)}</div><button className="danger-button" onClick={() => removeItem('certificates', item.id)}>Remove certificate</button></div>)}</div><button className="outline-button" onClick={() => addItem('certificates', { id: `cert-${Date.now()}`, title: 'Certificate title', issuer: 'Issuing organization', date: '', image: '', link: '' })}>+ Add certificate</button></>}
      {tab === 'settings' && <div className="admin-fields">{[['showChat','Show AI assistant'],['showGalaxy','Show skills galaxy'],['showChatGPTCredit','Show small ChatGPT credit']].map(([key,label]) => <label className="admin-toggle" key={key}><input type="checkbox" checked={Boolean(draft.settings[key])} onChange={(e) => setDraft((old) => ({ ...old, settings: { ...old.settings, [key]: e.target.checked } }))}/>{label}</label>)}<label className="admin-field">Tech marquee speed (seconds; smaller is faster)<input type="number" min="8" max="90" value={draft.settings.ribbonSpeed || 28} onChange={(e) => setDraft((old) => ({ ...old, settings: { ...old.settings, ribbonSpeed: Math.max(8, Math.min(90, Number(e.target.value) || 28)) } }))}/></label><p className="admin-help">For secure publishing, configure Firebase Authentication, the admin email allow-list and Firestore rules before deploying.</p></div>}
    </div>
    <footer className="admin-footer"><span className={status.includes('success') ? 'save-success' : 'save-status'}>{status}</span><button className="primary-button" onClick={save}><Save size={16}/> Publish changes</button></footer>
  </section></div>;
}

function LoginPanel({ onLogin, onClose, error, busy }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return <div className="admin-backdrop"><form className="login-panel" onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}><button type="button" className="icon-button login-close" onClick={onClose}><X/></button><span className="assistant-avatar"><LockKeyhole/></span><h2>Admin sign in</h2><p>Firebase Authentication is used for admin access.</p><label className="admin-field">Admin email<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)}/></label><label className="admin-field">Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}/></label>{error && <p className="login-error">{error}</p>}<button className="primary-button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in securely'} <ArrowRight size={16}/></button></form></div>;
}

export default function App() {
  const [light, setLight] = useState(false); const [menuOpen, setMenuOpen] = useState(false);
  const [content, setContent] = useState(() => { try { const local = localStorage.getItem('nikhil-portfolio-content-v2'); return local ? { ...clone(DEFAULT_CONTENT), ...JSON.parse(local) } : clone(DEFAULT_CONTENT); } catch { return clone(DEFAULT_CONTENT); } });
  const [selectedProject, setSelectedProject] = useState(null); const [chatOpen, setChatOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false); const [loginOpen, setLoginOpen] = useState(false); const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(''); const [loginBusy, setLoginBusy] = useState(false); const [publishError, setPublishError] = useState('');
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [contactStatus, setContactStatus] = useState('');
  const [contactBusy, setContactBusy] = useState(false);
  const sectionMotion = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.5, ease: 'easeOut' } };
  useEffect(() => {
    if (!firebaseConfigured) return undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    const reference = doc(db, 'portfolio', 'public');
    const unsubscribeData = onSnapshot(reference, (snapshot) => { if (snapshot.exists()) setContent({ ...clone(DEFAULT_CONTENT), ...snapshot.data() }); }, () => {});
    return () => { unsubscribeAuth(); unsubscribeData(); };
  }, []);
  useEffect(() => { const handler = (event) => { if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'e') { event.preventDefault(); setLoginOpen(true); } }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, []);
  useEffect(() => {
    const targets = [['home', document.querySelector('.hero')], ...['about','skills','projects','experience','certification','contact'].map((id) => [id, document.getElementById(id)])].filter(([, element]) => element);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) { const found = targets.find(([, element]) => element === visible[0].target); if (found) setActiveSection(found[0]); }
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.1, 0.25, 0.5] });
    targets.forEach(([, element]) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const ribbon = useMemo(() => [...content.ribbonTech, ...content.ribbonTech, ...content.ribbonTech], [content.ribbonTech]);
  async function login(email, password) {
    if (!firebaseConfigured) { setLoginError('Firebase is not configured yet. Follow the included README and .env.example first.'); return; }
    setLoginBusy(true); setLoginError('');
    try { await signInWithEmailAndPassword(auth, email, password); setLoginOpen(false); setAdminOpen(true); }
    catch { setLoginError('Sign-in failed. Check credentials and confirm this user is enabled in Firebase Authentication.'); }
    finally { setLoginBusy(false); }
  }
  async function publish(nextContent) {
    if (!firebaseConfigured || !user) throw new Error('Sign in through Firebase before publishing.');
    try { await setDoc(doc(db, 'portfolio', 'public'), nextContent); setContent(nextContent); setPublishError(''); }
    catch { setPublishError('Publish failed. Check the Firestore security rules and admin email allow-list.'); throw new Error('Publish failed. Check Firestore rules and admin permissions.'); }
  }
  async function logout() { await signOut(auth); setAdminOpen(false); }
  const emailHref = `mailto:${content.profile.email}?subject=${encodeURIComponent('Portfolio enquiry')}`;
  const navLinks = [['Home','home'],['About','about'],['Skills','skills'],['Projects','projects'],['Experience','experience'],['Certification','certification'],['Contact','contact']];
  return <main className={`portfolio ${light ? 'light' : 'dark'}`} id="home">
    <MouseGlow/><div className="ambient ambient-one"/><div className="ambient ambient-two"/><div className="violet-ribbon ribbon-left" aria-hidden="true"/><div className="violet-ribbon ribbon-right" aria-hidden="true"/>
    <header className="topbar"><a className="brand" href="#home"><span className="brand-mark">NR</span><span>Nikhil <b>Raju</b><i>•</i></span></a><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button><nav className={menuOpen ? 'nav-links open' : 'nav-links'}>{navLinks.map(([label,id])=><a key={id} className={activeSection===id?'active':''} href={`#${id}`} onClick={()=>{setActiveSection(id);setMenuOpen(false);}}>{label}</a>)}</nav><div className="header-actions"><button className="theme-toggle" onClick={()=>setLight(!light)} aria-label="Toggle theme">{light?<Sun size={16}/>:<Moon size={16}/>}<Sun size={15}/></button><a className="connect-button" href="#contact">Let’s Connect <ArrowRight size={17}/></a></div><div className="admin-entry"><button className="admin-entry-button" onClick={()=> user ? setAdminOpen(true) : setLoginOpen(true)}>{user?<><ShieldCheck size={14}/> Admin Panel</>:<><LockKeyhole size={14}/> Admin Edit</>}</button>{user && <button className="admin-entry-logout" onClick={logout} aria-label="Admin sign out"><LogOut size={13}/></button>}</div></header>

    <section className="hero"><motion.div className="portrait-column" initial={{opacity:0,x:-22}} animate={{opacity:1,x:0}} transition={{duration:.65}}><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="portrait-halo"/><img className="portrait" src="/nikhil-passport-photo.webp" alt="Nikhil Raju Vadali" loading="eager"/><div className="floating-card ai-card"><span className="mini-icon"><BrainCircuit/></span><div><b>AI / ML</b><small>Research Enthusiast</small></div><i/></div><div className="floating-card vision-card"><span className="mini-icon"><Camera/></span><div><b>Computer Vision</b><small>Building real-world<br/>solutions</small></div><i/></div><div className="floating-card stack-card"><span className="mini-icon"><Code2/></span><div><b>Full Stack</b><small>Turning ideas<br/>into products</small></div><i/></div><div className="signature"><img src="/Neon Pink-Purple Nikhil Raju Signature.webp" alt="Nikhil Raju signature" loading="lazy"/></div><div className="social-rail"><span className="rail-dot"/><a href={safeUrl(content.profile.linkedin)} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18}/></a><a href={safeUrl(content.profile.github)} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18}/></a><a href={emailHref} aria-label="Email"><Mail size={18}/></a><a href={safeUrl(content.profile.freelance)} target="_blank" rel="noreferrer" aria-label="Freelance website"><Zap size={18}/></a></div></motion.div>
      <motion.div className="hero-copy" initial={{opacity:0,x:22}} animate={{opacity:1,x:0}} transition={{duration:.65,delay:.08}}><div className="availability"><span className="green-dot"/> {content.profile.availability} <b>·</b> Available for Freelance</div><p className="eyebrow">HELLO, WORLD. I’M</p><h1 className="hero-name">Nikhil Raju<br/><span>Vadali.</span></h1><div className="role-strip"><span>AI/ML Engineer</span>　|　Computer Vision　|　Full Stack</div><p className="intro">{content.profile.headline}</p><div className="hero-buttons"><a className="primary-button" href="#projects">View My Work <ArrowRight size={18}/></a><a className="outline-button" href={safeUrl(content.profile.resume)} target="_blank" rel="noreferrer"><Download size={18}/> Download Resume</a><button className="outline-button recruiter-button" onClick={()=>document.getElementById('recruiter-view')?.showModal()}><UserRound size={17}/> Recruiter Quick View</button></div><div className="stats"><motion.div className="stat" whileHover={{y:-3}}><GraduationCap/><div><b>{content.profile.cgpa} <small>/ 10</small></b><span>{content.profile.semester} CGPA</span></div></motion.div><motion.div className="stat" whileHover={{y:-3}}><Cpu/><div><b>{content.profile.focus}</b><span>Core Interest</span></div></motion.div><motion.div className="stat" whileHover={{y:-3}}><FileText/><div><b>Research Intern</b><span>NIT Warangal</span></div></motion.div><motion.div className="stat" whileHover={{y:-3}}><Zap/><div><b>Freelance</b><span>Available</span></div><i className="green-dot"/></motion.div></div></motion.div><div className="scroll-cue"><span>SCROLL DOWN · EXPLORE MORE</span><div className="mouse-icon"/></div><div className="prism"><span/><span/><span/><i/><b/></div><div className="side-note">Build<br/>Explore<br/>Learn<br/>Repeat</div><div className="section-dots"><a href="#home"/><a href="#about"/><a href="#skills"/><a href="#projects"/><a href="#contact"/></div>
    </section>

    <motion.section className="tool-ribbon" aria-label="Tools and technologies" {...sectionMotion}><span className="ribbon-label">I WORK WITH</span><div className="tech-marquee" style={{'--ribbon-duration':`${content.settings.ribbonSpeed || 28}s`}}><div className="tech-marquee-track">{ribbon.map((tech,i)=><TechMark tech={tech} key={`${tech.name}-${i}`}/>)}</div></div><span className="ribbon-divider"/><span className="ribbon-label freelance-ribbon-label">FREELANCE WEBSITE</span><a className="flux-link" href={safeUrl(content.profile.freelance)} target="_blank" rel="noreferrer">Flux Site <ArrowRight size={14}/></a></motion.section>

    <motion.section className="projects-section" id="projects" {...sectionMotion}><SectionHeading eyebrow="SELECTED WORK" action={<a href={safeUrl(content.profile.github)} target="_blank" rel="noreferrer" className="text-link">More on GitHub <ArrowRight size={16}/></a>}>Projects that <span>make an impact.</span></SectionHeading><div className="project-grid">{content.projects.map((project,index)=><motion.article className="project-card case-project" key={project.id} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.08}}><button className="project-open" onClick={()=>setSelectedProject(project)} aria-label={`Open case study for ${project.title}`}><div className="project-art">{project.image && (
  <img
    src={project.image}
    alt={`${project.title} preview`}
    loading="lazy"
    onError={(e) => {
      console.error("Project image failed:", project.image);
      e.currentTarget.style.display = "block";
      e.currentTarget.style.border = "2px solid red";
    }}
  />
)}<span className="project-art-overlay"><Sparkles size={22}/> View case study</span></div><div className="project-info"><div className="project-meta"><span>{project.number}</span><small>{project.category}</small></div><h3>{project.title}</h3><p>{project.description}</p><div className="tech-tags">{project.tech.map((tech)=><span key={tech}>{tech}</span>)}</div></div></button><div className="project-links">{project.github && <a href={safeUrl(project.github)} target="_blank" rel="noreferrer"><Github size={14}/> Code</a>}{project.demo && <a href={safeUrl(project.demo)} target="_blank" rel="noreferrer"><ExternalLink size={14}/> Live demo</a>}<button onClick={()=>setSelectedProject(project)}>Case study <ArrowRight size={14}/></button></div></motion.article>)}</div></motion.section>

    <motion.section className="about-section content-section" id="about" {...sectionMotion}><SectionHeading eyebrow="A LITTLE ABOUT ME">Curious mind. <span>Builder’s heart.</span></SectionHeading><div className="about-card"><div className="about-symbol"><BrainCircuit size={48}/></div><div><p>{content.profile.aboutOne}</p><p>{content.profile.aboutTwo}</p></div><div className="about-number"><b>AI</b><span>with purpose</span></div></div></motion.section>

    <motion.section className="skills-section content-section" id="skills" {...sectionMotion}><SectionHeading eyebrow="MY TOOLKIT">Skills &amp; <span>technologies.</span></SectionHeading>{content.settings.showGalaxy && <div className="skills-galaxy"><div className="galaxy-orbit orbit-a"/><div className="galaxy-orbit orbit-b"/><div className="galaxy-center"><BrainCircuit size={30}/><span>SKILLS</span></div>{content.skills.map((skill,index)=><button key={skill.name} className={`galaxy-node node-${index%12} ${activeSkill===skill.name?'active':''}`} onMouseEnter={()=>setActiveSkill(skill.name)} onFocus={()=>setActiveSkill(skill.name)} onClick={()=>setActiveSkill(activeSkill===skill.name?null:skill.name)}><span>{skill.short}</span><b>{skill.name}</b></button>)}</div>}{activeSkill && <p className="skill-selection"><Sparkles size={15}/> Selected: <b>{activeSkill}</b> <span>· Explore related projects in the Projects section.</span></p>}</motion.section>

    <motion.section className="experience-section content-section" id="experience" {...sectionMotion}><SectionHeading eyebrow="WHERE I’VE GROWN">Experience &amp; <span>learning.</span></SectionHeading><div className="experience-grid">{content.experience.map((item,index)=><article className="experience-card" key={item.id}><span className="experience-icon"><BriefcaseBusiness/></span><div><small>{item.type}</small><h3>{item.title}</h3><p>{item.organization}</p><span className="experience-line">{item.details}</span><p className="experience-period">{item.period}</p></div><span className="experience-index">{String(index+1).padStart(2,'0')}</span></article>)}</div></motion.section>

    <motion.section className="cert-section content-section" id="certification" {...sectionMotion}><SectionHeading eyebrow="KEEP LEARNING">Certifications &amp; <span>milestones.</span></SectionHeading>{content.certificates.length ? <div className="certificate-grid">{content.certificates.map((cert)=><article className="cert-card cert-hover-card" key={cert.id} tabIndex={0}><span className="cert-icon"><Award/></span><div><h3>{cert.title}</h3><p>{cert.issuer}{cert.date?` · ${cert.date}`:''}</p>{cert.link && <a href={safeUrl(cert.link)} target="_blank" rel="noreferrer" className="text-link">Verify credential ↗</a>}</div><span className="cert-status">CERTIFICATE</span>{cert.image && <div className="cert-hover-preview"><img src={cert.image} alt={`${cert.title} preview`} loading="lazy"/><span>{cert.title}</span></div>}</article>)}</div> : <div className="cert-card"><span className="cert-icon"><GraduationCap/></span><div><h3>Learning in progress</h3><p>Add certificates from Admin Edit to show credential previews here.</p></div><span className="cert-status">ALWAYS LEARNING</span></div>}</motion.section>

    <motion.section className="contact-section content-section" id="contact" {...sectionMotion}><span className="eyebrow">HAVE A PROJECT IN MIND?</span><h2>Let’s build something<br/><span>meaningful together.</span></h2><p>Share a few details and I’ll get back to you about AI/ML, web development, or collaboration.</p><form className="contact-form" onSubmit={async (e) => {
      e.preventDefault();
      setContactStatus('');
      const form = e.currentTarget;
      const d = new FormData(form);
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      if (!serviceId || !templateId || !publicKey) {
        setContactStatus('Email delivery is not configured yet. Please configure the EmailJS values in .env.local.');
        return;
      }
      setContactBusy(true);
      try {
        await emailjs.send(serviceId, templateId, {
          to_name: content.profile.name,
          from_name: String(d.get('name') || ''),
          from_email: String(d.get('email') || ''),
          phone: String(d.get('phone') || 'Not provided'),
          work_with: 'Nikhil (solo developer)',
          project_type: String(d.get('projectType') || ''),
          project_details: String(d.get('details') || ''),
          reply_to: String(d.get('email') || ''),
        }, { publicKey });
        setContactStatus('Request sent successfully! Thank you — I’ll get back to you soon.');
        form.reset();
      } catch (error) {
        console.error('EmailJS contact form failed:', error);
        setContactStatus('Could not send the request. Please try again or email me directly.');
      } finally {
        setContactBusy(false);
      }
    }}><div className="contact-form-grid"><label>Name<input name="name" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Phone / WhatsApp number (optional)<input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" /></label><label className="contact-full">Project type<select name="projectType" defaultValue="" required><option value="" disabled>Choose a type</option><option>AI / Machine Learning</option><option>Computer Vision</option><option>Website / Full Stack</option><option>Mobile App</option><option>Research collaboration</option><option>Internship / Job opportunity</option><option>Other</option></select></label><label className="contact-full">Project details<textarea name="details" rows="5" required placeholder="What problem are you trying to solve, and what data or requirements do you have?" /></label></div><div className="contact-actions contact-form-actions"><button className="primary-button" type="submit" disabled={contactBusy}>{contactBusy ? <><Send size={17}/> Sending…</> : <><Send size={17}/> Send project request</>}</button><a className="outline-button" href={safeUrl(content.profile.freelance)} target="_blank" rel="noreferrer">Visit Flux Site <ExternalLink size={17}/></a></div>{contactStatus && <p className="contact-form-note" role="status" aria-live="polite">{contactStatus}</p>}<p className="contact-form-note">Your request will be sent directly to my inbox. Your email address will be used only to reply to your enquiry.</p></form><div className="contact-socials"><a href={safeUrl(content.profile.github)} target="_blank" rel="noreferrer"><Github size={17}/> GitHub</a><a href={safeUrl(content.profile.linkedin)} target="_blank" rel="noreferrer"><Linkedin size={17}/> LinkedIn</a><a href={emailHref}><Mail size={17}/> Email</a></div></motion.section>
    <footer><a className="brand" href="#home"><span className="brand-mark">NR</span><span>Nikhil <b>Raju</b><i>•</i></span></a><span>Designed with curiosity <b>✦</b> © {new Date().getFullYear()} {content.profile.name}</span><a href="#home">Back to top ↑</a>{content.settings.showChatGPTCredit && <span className="chatgpt-credit"><Sparkles size={11}/> Built with ChatGPT</span>}</footer>

    {content.settings.showChat && <div className="assistant-dock"><AnimatePresence>{chatOpen && <ChatAssistant content={content} onClose={()=>setChatOpen(false)}/>}</AnimatePresence><button className="assistant-launcher" onClick={()=>setChatOpen(!chatOpen)} aria-label={chatOpen?'Close portfolio assistant':'Open portfolio assistant'}>{chatOpen?<X size={22}/>:<><MessageCircle size={21}/><span>Ask AI</span></>}</button></div>}
    <dialog className="recruiter-dialog" id="recruiter-view"><div className="recruiter-head"><span className="assistant-avatar"><UserRound/></span><button className="icon-button" onClick={()=>document.getElementById('recruiter-view')?.close()}><X/></button></div><p className="eyebrow">RECRUITER QUICK VIEW</p><h2>{content.profile.name}</h2><p>{content.profile.headline}</p><div className="recruiter-facts"><span><GraduationCap/> CGPA {content.profile.cgpa}/10</span><span><Cpu/> {content.profile.focus}</span><span><BriefcaseBusiness/> {content.experience.length} experience entries</span><span><Code2/> {content.skills.length} listed skills</span></div><h3>Featured projects</h3><ul>{content.projects.map((p)=><li key={p.id}>{p.title} — {p.tech.join(', ')}</li>)}</ul><div className="contact-actions"><a className="primary-button" href={safeUrl(content.profile.resume)} target="_blank" rel="noreferrer"><Download size={16}/> Resume</a><a className="outline-button" href={emailHref}><Mail size={16}/> Contact</a><button className="outline-button" onClick={()=>document.getElementById('recruiter-view')?.close()}>Close</button></div></dialog>
    <AnimatePresence>{selectedProject && <motion.div className="case-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={(e)=>{if(e.target===e.currentTarget)setSelectedProject(null)}}><motion.article className="case-modal" initial={{opacity:0,y:20,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:15}}><button className="icon-button case-close" onClick={()=>setSelectedProject(null)} aria-label="Close case study"><X/></button><span className="eyebrow">PROJECT CASE STUDY · {selectedProject.category}</span><h2>{selectedProject.title}</h2><p className="case-summary">{selectedProject.description}</p><div className="case-columns"><section><h3>Problem</h3><p>{selectedProject.problem || 'Describe the problem this project is designed to address.'}</p></section><section><h3>Approach / solution</h3><p>{selectedProject.solution || selectedProject.description}</p></section><section><h3>Results</h3><p>{selectedProject.results || 'Add verified outcomes and evaluation metrics in Admin Edit.'}</p></section></div><div className="tech-tags">{selectedProject.tech.map((tech)=><span key={tech}>{tech}</span>)}</div><div className="contact-actions">{selectedProject.github && <a className="primary-button" href={safeUrl(selectedProject.github)} target="_blank" rel="noreferrer"><Github size={16}/> Source code</a>}{selectedProject.demo && <a className="outline-button" href={safeUrl(selectedProject.demo)} target="_blank" rel="noreferrer"><ExternalLink size={16}/> Live demo</a>}</div></motion.article></motion.div>}</AnimatePresence>
    {loginOpen && <LoginPanel onLogin={login} onClose={()=>{setLoginOpen(false);setLoginError('')}} error={loginError} busy={loginBusy}/>}
    {adminOpen && user && <AdminPanel content={content} onChange={publish} onClose={()=>setAdminOpen(false)}/>}
    {publishError && <div className="publish-error" role="status">{publishError}<button onClick={()=>setPublishError('')}><X size={14}/></button></div>}
  </main>;
}
