import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase ────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --cream: #F5F0E8; --cream-dark: #EDE7D9; --green: #1E3A2F; --green-mid: #2D5444;
    --green-light: #4A7C63; --green-pale: #D4E8DD; --terra: #C4622D; --terra-light: #F2D5C4;
    --gold: #C9A84C; --gold-light: #F5EDD0; --text: #1A2B22; --text-mid: #4A5E53;
    --text-soft: #8A9E94; --border: #D4C9B4; --white: #FDFBF7;
    --shadow: 0 2px 16px rgba(30,58,47,0.10); --shadow-lg: 0 8px 32px rgba(30,58,47,0.14);
    --radius: 16px; --radius-sm: 10px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text); min-height: 100vh; -webkit-font-smoothing: antialiased; }
  .app-shell { display: flex; min-height: 100vh; }
  .sidebar { width: 240px; background: var(--green); display: flex; flex-direction: column; padding: 28px 0; flex-shrink: 0; }
  .sidebar-brand { padding: 0 24px 28px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 16px; }
  .sidebar-brand h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--cream); line-height: 1.1; }
  .sidebar-brand p { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; letter-spacing: 0.04em; text-transform: uppercase; }
  .sidebar-nav { flex: 1; padding: 0 12px; display: flex; flex-direction: column; gap: 2px; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: var(--radius-sm); cursor: pointer; color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 400; transition: all 0.18s; border: none; background: none; width: 100%; text-align: left; }
  .nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .nav-item.active { background: var(--green-light); color: #fff; font-weight: 500; }
  .nav-icon { font-size: 17px; width: 20px; text-align: center; }
  .sidebar-footer { padding: 16px 12px 0; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 12px; }
  .couple-pill { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(255,255,255,0.06); border-radius: var(--radius-sm); }
  .avatars-sm { display: flex; }
  .av { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; border: 2px solid var(--green); }
  .av-a { background: #A8D5BA; color: var(--green); }
  .av-b { background: var(--gold); color: var(--green); margin-left: -8px; }
  .couple-info { flex: 1; min-width: 0; }
  .couple-name { font-size: 12px; color: rgba(255,255,255,0.75); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .couple-month { font-size: 11px; color: rgba(255,255,255,0.35); }
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; background: var(--cream); }
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; background: var(--white); border-bottom: 1px solid var(--border); gap: 12px; }
  .topbar-left h2 { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--green); }
  .topbar-left p { font-size: 13px; color: var(--text-soft); margin-top: 1px; }
  .topbar-actions { display: flex; align-items: center; gap: 10px; }
  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 50px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.18s; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
  .btn-primary { background: var(--green); color: #fff; }
  .btn-primary:hover { background: var(--green-mid); }
  .btn-secondary { background: var(--cream-dark); color: var(--green); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--border); }
  .btn-ghost { background: none; color: var(--text-mid); border: 1px solid var(--border); padding: 8px 14px; }
  .btn-ghost:hover { background: var(--cream-dark); }
  .btn-sm { padding: 6px 14px; font-size: 12px; }
  .btn-danger { background: #FDE8E8; color: #C0392B; border: 1px solid #F5C6C6; }
  .btn-danger:hover { background: #F5C6C6; }
  .page { padding: 24px 28px; flex: 1; overflow-y: auto; }
  .summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .card { background: var(--white); border-radius: var(--radius); padding: 20px; border: 1px solid var(--border); box-shadow: var(--shadow); }
  .card-accent-green { border-left: 4px solid var(--green-light); }
  .card-accent-terra { border-left: 4px solid var(--terra); }
  .card-accent-gold { border-left: 4px solid var(--gold); }
  .card-label { font-size: 11px; color: var(--text-soft); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; margin-bottom: 6px; }
  .card-value { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--green); font-weight: 600; }
  .card-sub { font-size: 12px; color: var(--text-soft); margin-top: 4px; }
  .card-positive { color: var(--green-light) !important; }
  .card-negative { color: var(--terra) !important; }
  .panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 24px; }
  .panel-full { grid-column: 1 / -1; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead th { text-align: left; padding: 10px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-soft); font-weight: 600; border-bottom: 1px solid var(--border); background: var(--cream-dark); }
  tbody tr { transition: background 0.12s; }
  tbody tr:hover { background: var(--cream); }
  tbody td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tbody tr:last-child td { border-bottom: none; }
  .amount-pos { color: var(--green-light); font-weight: 600; }
  .amount-neg { color: var(--terra); font-weight: 600; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 500; }
  .badge-green { background: var(--green-pale); color: var(--green); }
  .badge-gray { background: var(--cream-dark); color: var(--text-mid); }
  .bar-chart { display: flex; flex-direction: column; gap: 10px; padding: 4px 0; }
  .bar-row { display: flex; align-items: center; gap: 12px; }
  .bar-label { font-size: 13px; color: var(--text-mid); width: 120px; flex-shrink: 0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
  .bar-track { flex: 1; height: 10px; background: var(--cream-dark); border-radius: 5px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 5px; transition: width 0.5s ease; }
  .bar-amt { font-size: 12px; color: var(--text-mid); width: 80px; text-align: right; flex-shrink: 0; font-weight: 500; }
  .split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .person-card { background: var(--white); border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow); }
  .person-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .person-av { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; flex-shrink: 0; }
  .overlay { position: fixed; inset: 0; background: rgba(20,35,28,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; backdrop-filter: blur(3px); animation: fadeIn 0.18s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .modal { background: var(--white); border-radius: var(--radius); padding: 28px; width: 100%; max-width: 480px; box-shadow: var(--shadow-lg); animation: slideUp 0.22s ease; max-height: 90vh; overflow-y: auto; }
  .modal h3 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--green); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 12px; font-weight: 600; color: var(--text-mid); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  .form-group input, .form-group select { width: 100%; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); font-size: 14px; font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text); outline: none; transition: border-color 0.15s; }
  .form-group input:focus, .form-group select:focus { border-color: var(--green-light); background: var(--white); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); }
  .goals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .goal-card { background: var(--white); border-radius: var(--radius); padding: 20px; border: 1px solid var(--border); box-shadow: var(--shadow); }
  .goal-emoji { font-size: 28px; margin-bottom: 10px; display: block; }
  .goal-name { font-size: 15px; font-weight: 600; color: var(--green); margin-bottom: 4px; }
  .goal-amounts { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-soft); margin: 10px 0 6px; }
  .progress-track { height: 8px; background: var(--cream-dark); border-radius: 4px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width 0.5s; }
  .goal-pct { font-size: 20px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--green); margin-top: 8px; }
  .goal-deadline { font-size: 11px; color: var(--text-soft); margin-top: 4px; }
  .goal-monthly { font-size: 12px; background: var(--green-pale); color: var(--green); padding: 4px 10px; border-radius: 50px; display: inline-block; margin-top: 10px; font-weight: 500; }
  .loading { display: flex; align-items: center; justify-content: center; height: 200px; font-size: 14px; color: var(--text-soft); gap: 10px; }
  .sync-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green-light); display: inline-block; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @media print {
    .sidebar, .topbar-actions, .btn, .no-print { display: none !important; }
    .app-shell { display: block !important; }
    .page { padding: 0 !important; overflow: visible !important; }
    .card, table { break-inside: avoid; box-shadow: none !important; }
    body { background: white !important; }
    @page { margin: 20mm; }
  }
  .mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--green); padding: 10px 0 calc(10px + env(safe-area-inset-bottom)); border-top: 1px solid rgba(255,255,255,0.1); z-index: 50; box-shadow: 0 -4px 20px rgba(0,0,0,0.25); }
  .mobile-nav-inner { display: flex; justify-content: space-around; }
  .mobile-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 12px; color: rgba(255,255,255,0.5); font-size: 10px; transition: color 0.15s; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .mobile-nav-item.active { color: var(--cream); }
  .mobile-nav-item span:first-child { font-size: 20px; }
  .notif-item { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); align-items: flex-start; }
  .notif-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .notif-body { flex: 1; }
  .notif-title { font-size: 14px; font-weight: 500; color: var(--text); }
  .notif-sub { font-size: 12px; color: var(--text-soft); margin-top: 2px; }
  .notif-time { font-size: 11px; color: var(--text-soft); flex-shrink: 0; }
  .filter-row { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
  @media (max-width: 900px) {
    .sidebar { display: none; }
    .mobile-nav { display: block; }
    .page { padding: 16px; padding-bottom: 80px; }
    .topbar { padding: 14px 16px; }
    .summary-row { grid-template-columns: repeat(2, 1fr); }
    .panel-grid { grid-template-columns: 1fr; }
    .goals-grid { grid-template-columns: repeat(2, 1fr); }
    .split-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .card-value { font-size: 22px; }
  }
  @media (max-width: 500px) {
    .summary-row { grid-template-columns: 1fr 1fr; gap: 10px; }
    .goals-grid { grid-template-columns: 1fr; }
    .card { padding: 14px; }
    .topbar-left h2 { font-size: 18px; }
    .modal { padding: 20px; }
    .btn span { display: none; }
    .btn { padding: 9px 12px; }
  }
  .empty-state { text-align: center; padding: 48px 24px; color: var(--text-soft); }
  .empty-state .empty-icon { font-size: 48px; margin-bottom: 12px; display: block; }
  .empty-state p { font-size: 14px; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--green); }
  .section-sub { font-size: 12px; color: var(--text-soft); margin-top: 2px; }
  .tab-row { display: flex; gap: 4px; background: var(--cream-dark); border-radius: 50px; padding: 4px; margin-bottom: 20px; width: fit-content; }
  .tab-btn { padding: 7px 18px; border-radius: 50px; border: none; background: none; cursor: pointer; font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 400; color: var(--text-mid); transition: all 0.15s; }
  .tab-btn.active { background: var(--white); color: var(--green); font-weight: 600; box-shadow: 0 1px 6px rgba(0,0,0,0.1); }
`;

const CATEGORIES = [
  { id: 'moradia', label: 'Moradia', color: '#6B8FBF', emoji: '🏠' },
  { id: 'alimentacao', label: 'Alimentação', color: '#4A7C63', emoji: '🛒' },
  { id: 'transporte', label: 'Transporte', color: '#C9A84C', emoji: '🚗' },
  { id: 'saude', label: 'Saúde', color: '#E07B84', emoji: '💊' },
  { id: 'lazer', label: 'Lazer', color: '#C4622D', emoji: '🎉' },
  { id: 'educacao', label: 'Educação', color: '#7B64C4', emoji: '📚' },
  { id: 'roupas', label: 'Roupas', color: '#C4A064', emoji: '👗' },
  { id: 'outro', label: 'Outro', color: '#8A9E94', emoji: '📦' },
];

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const GOAL_EMOJIS = ['✈️','🏠','🚗','👶','🎓','💍','🛋️','🏦','🌴','🎵','💻','🐾','🏋️','🎨','🌱'];
const NOTIF_RULES: any = {
  over_budget: { icon: '⚠️', bg: '#FEF3C7' },
  imbalance: { icon: '⚖️', bg: '#EDE9FE' },
  goal_reminder: { icon: '🎯', bg: '#D1FAE5' },
  goal_complete: { icon: '🎉', bg: '#D1FAE5' },
  income_added: { icon: '💰', bg: '#D1FAE5' },
};

const fmt = (v: any) => 'R$ ' + Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtShort = (v: any) => 'R$ ' + Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const todayStr = () => new Date().toISOString().slice(0, 10);
const nowISO = () => new Date().toISOString();
const catOf = (id: any, extra: any[] = []) => [...CATEGORIES, ...extra].find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
const currentMonth = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
const monthLabel = (ym: string) => { const [y, m] = ym.split('-'); return `${MONTHS[parseInt(m) - 1]} ${y}`; };

const MEMBERS = [
  { id: 'user-a', name: 'Camila', avatar: 'C', color: '#A8D5BA' },
  { id: 'user-b', name: 'Rogério', avatar: 'R', color: '#C9A84C' },
];

export default function CasalGrana() {
  const [page, setPage] = useState('dashboard');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [customCategories, setCustomCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<string | null>(null);
  const [filterPerson, setFilterPerson] = useState('todos');
  const [filterCat, setFilterCat] = useState('todas');
  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [viewMode, setViewMode] = useState('juntos');
  const [depositGoal, setDepositGoal] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const allCategories = [...CATEGORIES, ...customCategories];

  // ─── Carregar dados do Supabase ───────────────────────────────
  useEffect(() => {
    loadAll();
    // Tempo real — atualiza quando parceiro lança algo
    const ch1 = supabase.channel('expenses').on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => loadExpenses()).subscribe();
    const ch2 = supabase.channel('incomes').on('postgres_changes', { event: '*', schema: 'public', table: 'incomes' }, () => loadIncomes()).subscribe();
    const ch3 = supabase.channel('goals').on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, () => loadGoals()).subscribe();
    return () => { ch1.unsubscribe(); ch2.unsubscribe(); ch3.unsubscribe(); };
  }, []);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadExpenses(), loadIncomes(), loadGoals()]);
    setLoading(false);
  };

  const loadExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('date', { ascending: false });
    if (data) setExpenses(data);
  };

  const loadIncomes = async () => {
    const { data } = await supabase.from('incomes').select('*').order('date', { ascending: false });
    if (data) setIncomes(data);
  };

  const loadGoals = async () => {
    const { data } = await supabase.from('goals').select('*').order('created_at', { ascending: false });
    if (data) setGoals(data);
  };

  // ─── Ações ────────────────────────────────────────────────────
  const addExpense = async (data: any) => {
    const member = MEMBERS.find(m => m.id === data.person_id);
    const { data: inserted } = await supabase.from('expenses').insert({
      person_name: member?.name,
      person_id: data.person_id,
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
    }).select().single();
    if (inserted) {
      setExpenses(prev => [inserted, ...prev]);
      // Verifica desequilíbrio
      const aTotal = expenses.filter(e => inMonth(e) && e.person_id === 'user-a').reduce((s, e) => s + e.amount, 0) + (data.person_id === 'user-a' ? data.amount : 0);
      const bTotal = expenses.filter(e => inMonth(e) && e.person_id === 'user-b').reduce((s, e) => s + e.amount, 0) + (data.person_id === 'user-b' ? data.amount : 0);
      const diff = Math.abs(aTotal - bTotal);
      if (diff > 500) {
        const who = aTotal > bTotal ? 'Rogério' : 'Camila';
        addNotif('imbalance', 'Saldo desigual', `${who} deve ${fmtShort(diff)} ao parceiro neste mês.`);
      }
    }
  };

  const deleteExpense = async (id: string) => {
    await supabase.from('expenses').delete().eq('id', id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addIncome = async (data: any) => {
    const member = MEMBERS.find(m => m.id === data.person_id);
    const { data: inserted } = await supabase.from('incomes').insert({
      person_name: member?.name,
      person_id: data.person_id,
      description: data.description,
      amount: data.amount,
      date: data.date,
    }).select().single();
    if (inserted) {
      setIncomes(prev => [inserted, ...prev]);
      addNotif('income_added', 'Ganho registrado', `${data.description}: ${fmt(data.amount)}`);
    }
  };

  const addGoal = async (data: any) => {
    const { data: inserted } = await supabase.from('goals').insert({
      emoji: data.emoji,
      name: data.name,
      target: data.target,
      saved: data.saved || 0,
      deadline: data.deadline,
      split: data.split,
    }).select().single();
    if (inserted) setGoals(prev => [inserted, ...prev]);
  };

  const depositGoalFn = async (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const newSaved = Math.min(goal.saved + amount, goal.target);
    await supabase.from('goals').update({ saved: newSaved }).eq('id', goalId);
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, saved: newSaved } : g));
    if (newSaved >= goal.target) {
      addNotif('goal_complete', `Meta concluída! ${goal.emoji}`, `"${goal.name}" foi atingida!`);
    }
  };

  const addNotif = (type: string, title: string, body: string) => {
    setNotifs(prev => [{ id: Date.now().toString(), type, title, body, read: false, created_at: nowISO() }, ...prev]);
  };

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const addCustomCategory = (cat: any) => setCustomCategories(prev => [...prev, cat]);

  const unread = notifs.filter(n => !n.read).length;
  const inMonth = (item: any) => item.date && item.date.startsWith(filterMonth);

  const expensesFiltered = expenses
    .filter(inMonth)
    .filter(e => filterPerson === 'todos' || e.person_id === filterPerson)
    .filter(e => filterCat === 'todas' || e.category === filterCat)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalExpenses = expenses.filter(inMonth).reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = incomes.filter(inMonth).reduce((s, e) => s + Number(e.amount), 0);
  const balance = totalIncome - totalExpenses;

  const byPerson = MEMBERS.map(m => ({
    ...m,
    expenses: expenses.filter(e => inMonth(e) && e.person_id === m.id).reduce((s, e) => s + Number(e.amount), 0),
    income: incomes.filter(e => inMonth(e) && e.person_id === m.id).reduce((s, e) => s + Number(e.amount), 0),
  }));

  const byCat = allCategories.map(c => ({
    ...c,
    total: expenses.filter(e => inMonth(e) && e.category === c.id).reduce((s, e) => s + Number(e.amount), 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const maxCat = Math.max(...byCat.map(c => c.total), 1);

  const months = Array.from(new Set([...expenses, ...incomes].map(t => t.date?.slice(0, 7)).filter(Boolean))).sort().reverse() as string[];
  if (!months.includes(currentMonth())) months.unshift(currentMonth());

  const selStyle = { padding: '8px 12px', borderRadius: 50, border: '1.5px solid var(--border)', background: 'var(--cream)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', outline: 'none' };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app-shell" ref={printRef}>
        <aside className="sidebar">
          <div className="sidebar-brand"><h1>Casal &<br />Grana</h1><p>Finanças a dois</p></div>
          <nav className="sidebar-nav">
            {[
              { id: 'dashboard', icon: '📊', label: 'Visão Geral' },
              { id: 'lancamentos', icon: '💳', label: 'Lançamentos' },
              { id: 'ganhos', icon: '💰', label: 'Ganhos' },
              { id: 'metas', icon: '🎯', label: 'Metas' },
              { id: 'relatorio', icon: '📄', label: 'Relatório' },
              { id: 'notificacoes', icon: '🔔', label: unread > 0 ? `Avisos (${unread})` : 'Avisos' },
            ].map(n => (
              <button key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="couple-pill">
              <div className="avatars-sm"><div className="av av-a">C</div><div className="av av-b">R</div></div>
              <div className="couple-info">
                <div className="couple-name">Camila & Rogério</div>
                <div className="couple-month">{monthLabel(filterMonth)} <span className="sync-dot" title="Sincronizado" /></div>
              </div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar no-print">
            <div className="topbar-left">
              <h2>{{ dashboard:'Visão Geral', lancamentos:'Lançamentos', ganhos:'Ganhos', metas:'Metas', relatorio:'Relatório', notificacoes:'Avisos' }[page]}</h2>
              <p>{{ dashboard:'Resumo do mês', lancamentos:'Gastos do casal', ganhos:'Renda registrada', metas:'Objetivos do casal', relatorio:'Imprimir e exportar', notificacoes:'Notificações automáticas' }[page]}</p>
            </div>
            <div className="topbar-actions">
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={selStyle}>
                {months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}
              </select>
              {page === 'relatorio' && <button className="btn btn-secondary" onClick={() => window.print()}>🖨️ <span>Imprimir</span></button>}
              {['lancamentos','ganhos','metas'].includes(page) && (
                <button className="btn btn-primary" onClick={() => setModal(page === 'ganhos' ? 'income' : page === 'metas' ? 'goal' : 'expense')}>
                  ＋ <span>{page === 'ganhos' ? 'Ganho' : page === 'metas' ? 'Meta' : 'Gasto'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="page">
            {loading ? (
              <div className="loading">⏳ Carregando dados...</div>
            ) : (
              <>
                {page === 'dashboard' && <Dashboard byPerson={byPerson} byCat={byCat} maxCat={maxCat} totalExpenses={totalExpenses} totalIncome={totalIncome} balance={balance} goals={goals} expenses={expenses.filter(inMonth)} members={MEMBERS} />}
                {page === 'lancamentos' && <Lancamentos expenses={expensesFiltered} members={MEMBERS} filterPerson={filterPerson} setFilterPerson={setFilterPerson} filterCat={filterCat} setFilterCat={setFilterCat} allCategories={allCategories} viewMode={viewMode} setViewMode={setViewMode} byPerson={byPerson} onDelete={deleteExpense} onAdd={() => setModal('expense')} inMonth={inMonth} allExpenses={expenses} />}
                {page === 'ganhos' && <Ganhos incomes={incomes.filter(inMonth)} members={MEMBERS} byPerson={byPerson} onAdd={() => setModal('income')} />}
                {page === 'metas' && <Metas goals={goals} onAdd={() => setModal('goal')} onDeposit={g => { setDepositGoal(g); setModal('deposit'); }} />}
                {page === 'relatorio' && <Relatorio expenses={expenses.filter(inMonth)} incomes={incomes.filter(inMonth)} members={MEMBERS} byCat={byCat} totalExpenses={totalExpenses} totalIncome={totalIncome} balance={balance} byPerson={byPerson} filterMonth={filterMonth} />}
                {page === 'notificacoes' && <Notificacoes notifs={notifs} unread={unread} onMarkAll={markAllRead} onMarkOne={id => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))} />}
              </>
            )}
          </div>
        </main>

        <nav className="mobile-nav">
          <div className="mobile-nav-inner">
            {[
              { id: 'dashboard', icon: '📊', label: 'Início' },
              { id: 'lancamentos', icon: '💳', label: 'Gastos' },
              { id: 'ganhos', icon: '💰', label: 'Ganhos' },
              { id: 'metas', icon: '🎯', label: 'Metas' },
              { id: 'notificacoes', icon: unread > 0 ? '🔔' : '🔕', label: 'Avisos' },
            ].map(n => (
              <button key={n.id} className={`mobile-nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
                <span>{n.icon}</span><span>{n.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {modal === 'expense' && <ExpenseModal members={MEMBERS} allCategories={allCategories} onSave={d => { addExpense(d); setModal(null); }} onClose={() => setModal(null)} />}
      {modal === 'income' && <IncomeModal members={MEMBERS} onSave={d => { addIncome(d); setModal(null); }} onClose={() => setModal(null)} />}
      {modal === 'goal' && <GoalModal onSave={d => { addGoal(d); setModal(null); }} onClose={() => setModal(null)} />}
      {modal === 'deposit' && depositGoal && <DepositModal goal={depositGoal} onSave={amt => { depositGoalFn(depositGoal.id, amt); setModal(null); setDepositGoal(null); }} onClose={() => { setModal(null); setDepositGoal(null); }} />}
    </>
  );
}

function Dashboard({ byPerson, byCat, maxCat, totalExpenses, totalIncome, balance, goals, expenses, members }: any) {
  return (
    <>
      <div className="summary-row">
        <div className="card card-accent-green"><div className="card-label">Total de Ganhos</div><div className="card-value card-positive">{fmtShort(totalIncome)}</div><div className="card-sub">Renda combinada</div></div>
        <div className="card card-accent-terra"><div className="card-label">Total de Gastos</div><div className="card-value card-negative">{fmtShort(totalExpenses)}</div><div className="card-sub">Despesas do mês</div></div>
        <div className={`card ${balance >= 0 ? 'card-accent-green' : 'card-accent-terra'}`}><div className="card-label">Saldo do Mês</div><div className={`card-value ${balance >= 0 ? 'card-positive' : 'card-negative'}`}>{fmtShort(balance)}</div><div className="card-sub">{balance >= 0 ? '✓ No azul' : '⚠ No vermelho'}</div></div>
        <div className="card card-accent-gold"><div className="card-label">Economia</div><div className="card-value" style={{ color: 'var(--gold)' }}>{totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%</div><div className="card-sub">Da renda economizada</div></div>
      </div>
      <div className="panel-grid">
        <div className="card">
          <div className="section-header"><div><div className="section-title">Por Pessoa</div><div className="section-sub">Gastos individuais</div></div></div>
          {byPerson.map((p: any) => (
            <div key={p.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div className="av" style={{ background: p.color, color: 'var(--green)', fontSize: 13 }}>{p.avatar}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div><div style={{ fontSize: 12, color: 'var(--text-soft)' }}>Ganhou {fmtShort(p.income)}</div></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontSize: 15, fontWeight: 600, color: 'var(--terra)' }}>{fmtShort(p.expenses)}</div><div style={{ fontSize: 11, color: 'var(--text-soft)' }}>Saldo: {fmtShort(p.income - p.expenses)}</div></div>
              </div>
              <div className="bar-track"><div className="bar-fill" style={{ width: totalExpenses > 0 ? `${(p.expenses / totalExpenses) * 100}%` : '0%', background: p.color }} /></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="section-header"><div><div className="section-title">Por Categoria</div><div className="section-sub">Maiores gastos</div></div></div>
          {byCat.length === 0 ? <div className="empty-state"><span className="empty-icon">📊</span><p>Sem gastos neste mês</p></div> : (
            <div className="bar-chart">
              {byCat.map((c: any) => (
                <div key={c.id} className="bar-row">
                  <span className="bar-label">{c.emoji} {c.label}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${(c.total / maxCat) * 100}%`, background: c.color }} /></div>
                  <span className="bar-amt">{fmtShort(c.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <div className="section-header"><div><div className="section-title">Últimos Gastos</div></div></div>
          {expenses.length === 0 ? <div className="empty-state"><span className="empty-icon">💳</span><p>Nenhum gasto registrado</p></div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Descrição</th><th>Categoria</th><th>Pessoa</th><th>Valor</th></tr></thead>
                <tbody>
                  {expenses.slice(0, 6).map((e: any) => {
                    const cat = catOf(e.category);
                    return (
                      <tr key={e.id}>
                        <td>{e.description}</td>
                        <td><span className="badge badge-gray">{cat.emoji} {cat.label}</span></td>
                        <td style={{ fontSize: 13 }}>{e.person_name || members.find((m: any) => m.id === e.person_id)?.name}</td>
                        <td className="amount-neg">{fmtShort(e.amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card">
          <div className="section-header"><div><div className="section-title">Metas</div><div className="section-sub">Progresso dos objetivos</div></div></div>
          {goals.length === 0 ? <div className="empty-state"><span className="empty-icon">🎯</span><p>Sem metas cadastradas</p></div> : goals.slice(0, 3).map((g: any) => {
            const pct = Math.round((g.saved / g.target) * 100);
            return (
              <div key={g.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 14, fontWeight: 500 }}>{g.emoji} {g.name}</span><span style={{ fontSize: 13, color: 'var(--text-soft)' }}>{pct}%</span></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--green-light)' : pct > 60 ? 'var(--gold)' : 'var(--terra)' }} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-soft)', marginTop: 3 }}><span>{fmtShort(g.saved)}</span><span>{fmtShort(g.target)}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Lancamentos({ expenses, members, filterPerson, setFilterPerson, filterCat, setFilterCat, allCategories, viewMode, setViewMode, byPerson, onDelete, onAdd, inMonth, allExpenses }: any) {
  const selStyle = { padding: '7px 14px', borderRadius: 50, border: '1.5px solid var(--border)', background: 'var(--cream)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', outline: 'none' };
  return (
    <>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 16 }}>
        <div className="tab-row">
          <button className={`tab-btn ${viewMode === 'juntos' ? 'active' : ''}`} onClick={() => setViewMode('juntos')}>👫 Juntos</button>
          <button className={`tab-btn ${viewMode === 'separado' ? 'active' : ''}`} onClick={() => setViewMode('separado')}>👤 Separado</button>
        </div>
        <button className="btn btn-primary no-print" onClick={onAdd}>＋ Gasto</button>
      </div>
      {viewMode === 'separado' ? (
        <div className="split-grid">
          {byPerson.map((p: any) => (
            <div key={p.id} className="person-card">
              <div className="person-header">
                <div className="person-av" style={{ background: p.color, color: 'var(--green)' }}>{p.avatar}</div>
                <div><div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div><div style={{ fontSize: 13, color: 'var(--terra)', fontWeight: 600 }}>{fmtShort(p.expenses)} gastos</div></div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Descrição</th><th>Cat.</th><th>Valor</th></tr></thead>
                  <tbody>
                    {allExpenses.filter((e: any) => inMonth(e) && e.person_id === p.id).sort((a: any, b: any) => b.date.localeCompare(a.date)).map((e: any) => (
                      <tr key={e.id}><td>{e.description}</td><td><span className="badge badge-gray">{catOf(e.category).emoji}</span></td><td className="amount-neg">{fmtShort(e.amount)}</td></tr>
                    ))}
                    {allExpenses.filter((e: any) => inMonth(e) && e.person_id === p.id).length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-soft)', padding: 24 }}>Sem gastos</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="filter-row no-print">
            <select value={filterPerson} onChange={e => setFilterPerson(e.target.value)} style={selStyle}>
              <option value="todos">Todos</option>
              {members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={selStyle}>
              <option value="todas">Todas categorias</option>
              {allCategories.map((c: any) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Pessoa</th><th>Valor</th><th className="no-print"></th></tr></thead>
              <tbody>
                {expenses.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-soft)' }}>Nenhum gasto encontrado</td></tr> : expenses.map((e: any) => {
                  const cat = catOf(e.category);
                  const m = members.find((x: any) => x.id === e.person_id);
                  return (
                    <tr key={e.id}>
                      <td style={{ color: 'var(--text-soft)', fontSize: 13 }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</td>
                      <td style={{ fontWeight: 500 }}>{e.description}</td>
                      <td><span className="badge badge-gray">{cat.emoji} {cat.label}</span></td>
                      <td><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: m?.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--green)', flexShrink: 0 }}>{m?.avatar}</span>{e.person_name || m?.name}</span></td>
                      <td className="amount-neg">{fmt(e.amount)}</td>
                      <td className="no-print"><button className="btn btn-danger btn-sm" onClick={() => onDelete(e.id)}>✕</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function Ganhos({ incomes, members, byPerson, onAdd }: any) {
  const total = incomes.reduce((s: number, i: any) => s + Number(i.amount), 0);
  return (
    <>
      <div className="summary-row" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="card card-accent-green"><div className="card-label">Renda Total</div><div className="card-value card-positive">{fmtShort(total)}</div><div className="card-sub">Combinada do casal</div></div>
        {byPerson.map((p: any) => <div key={p.id} className="card card-accent-gold"><div className="card-label">{p.name}</div><div className="card-value" style={{ color: 'var(--gold)' }}>{fmtShort(p.income)}</div><div className="card-sub">{total > 0 ? Math.round((p.income / total) * 100) : 0}% da renda</div></div>)}
      </div>
      <div className="card">
        <div className="section-header"><div><div className="section-title">Lançamentos de Ganhos</div></div><button className="btn btn-primary no-print" onClick={onAdd}>＋ Ganho</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Descrição</th><th>Pessoa</th><th>Valor</th></tr></thead>
            <tbody>
              {incomes.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-soft)' }}>Nenhum ganho registrado</td></tr> : incomes.map((i: any) => {
                const m = members.find((x: any) => x.id === i.person_id);
                return (
                  <tr key={i.id}>
                    <td style={{ color: 'var(--text-soft)', fontSize: 13 }}>{new Date(i.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</td>
                    <td style={{ fontWeight: 500 }}>{i.description}</td>
                    <td><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: m?.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--green)' }}>{m?.avatar}</span>{i.person_name || m?.name}</span></td>
                    <td className="amount-pos">{fmt(i.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Metas({ goals, onAdd, onDeposit }: any) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--green)' }}>Objetivos do Casal</div>
        <button className="btn btn-primary no-print" onClick={onAdd}>＋ Nova Meta</button>
      </div>
      {goals.length === 0 ? <div className="empty-state"><span className="empty-icon">🎯</span><p>Nenhuma meta cadastrada ainda</p></div> : (
        <div className="goals-grid">
          {goals.map((g: any) => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
            const falta = Math.max(0, g.target - g.saved);
            const now = new Date();
            const deadline = g.deadline ? new Date(g.deadline + '-01') : null;
            const mos = deadline ? Math.max(1, (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth())) : null;
            const monthly = mos ? Math.round(falta / mos) : null;
            const color = pct >= 100 ? 'var(--green-light)' : pct > 70 ? 'var(--gold)' : pct > 40 ? '#6B8FBF' : 'var(--terra)';
            return (
              <div key={g.id} className="goal-card">
                <span className="goal-emoji">{g.emoji}</span>
                <div className="goal-name">{g.name}</div>
                {g.deadline && <div className="goal-deadline">📅 Prazo: {monthLabel(g.deadline)}</div>}
                <div className="goal-amounts"><span>Guardado: {fmtShort(g.saved)}</span><span>Meta: {fmtShort(g.target)}</span></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%`, background: color }} /></div>
                <div className="goal-pct">{pct}%</div>
                {monthly && pct < 100 && <div className="goal-monthly">📆 {fmtShort(monthly / 2)}/mês cada</div>}
                {pct < 100 && <button className="btn btn-secondary btn-sm no-print" style={{ marginTop: 12, width: '100%' }} onClick={() => onDeposit(g)}>+ Depositar</button>}
                {pct >= 100 && <div className="badge badge-green" style={{ marginTop: 12 }}>✓ Meta atingida!</div>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Relatorio({ expenses, incomes, members, byCat, totalExpenses, totalIncome, balance, byPerson, filterMonth }: any) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><div className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--green)' }}>Relatório — {monthLabel(filterMonth)}</div><div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 2 }}>Camila & Rogério · Casal & Grana</div></div>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Imprimir</button>
      </div>
      <div className="summary-row">
        <div className="card"><div className="card-label">Renda Total</div><div className="card-value card-positive">{fmt(totalIncome)}</div></div>
        <div className="card"><div className="card-label">Gastos Totais</div><div className="card-value card-negative">{fmt(totalExpenses)}</div></div>
        <div className="card"><div className="card-label">Saldo</div><div className={`card-value ${balance >= 0 ? 'card-positive' : 'card-negative'}`}>{fmt(balance)}</div></div>
        <div className="card"><div className="card-label">Taxa de Poupança</div><div className="card-value" style={{ color: 'var(--gold)' }}>{totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%</div></div>
      </div>
      <div className="panel-grid">
        <div className="card">
          <div className="section-title" style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>Gastos por Pessoa</div>
          {byPerson.map((p: any) => <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}><span style={{ fontWeight: 500 }}>{p.name}</span><span className="amount-neg">{fmt(p.expenses)}</span></div>)}
        </div>
        <div className="card">
          <div className="section-title" style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>Gastos por Categoria</div>
          {byCat.map((c: any) => <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}><span>{c.emoji} {c.label}</span><span className="amount-neg">{fmt(c.total)}</span></div>)}
          {byCat.length === 0 && <div style={{ color: 'var(--text-soft)', fontSize: 14 }}>Sem gastos</div>}
        </div>
        <div className="card panel-full">
          <div className="section-title" style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>Todos os Gastos</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Pessoa</th><th>Valor</th></tr></thead>
              <tbody>
                {expenses.sort((a: any, b: any) => b.date.localeCompare(a.date)).map((e: any) => {
                  const cat = catOf(e.category);
                  const m = members.find((x: any) => x.id === e.person_id);
                  return <tr key={e.id}><td>{new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR')}</td><td>{e.description}</td><td>{cat.emoji} {cat.label}</td><td>{e.person_name || m?.name}</td><td className="amount-neg">{fmt(e.amount)}</td></tr>;
                })}
                <tr style={{ fontWeight: 700, background: 'var(--cream-dark)' }}><td colSpan={4}><strong>Total</strong></td><td className="amount-neg"><strong>{fmt(totalExpenses)}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="card panel-full">
          <div className="section-title" style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>Todos os Ganhos</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Data</th><th>Descrição</th><th>Pessoa</th><th>Valor</th></tr></thead>
              <tbody>
                {incomes.map((i: any) => {
                  const m = members.find((x: any) => x.id === i.person_id);
                  return <tr key={i.id}><td>{new Date(i.date + 'T12:00:00').toLocaleDateString('pt-BR')}</td><td>{i.description}</td><td>{i.person_name || m?.name}</td><td className="amount-pos">{fmt(i.amount)}</td></tr>;
                })}
                <tr style={{ fontWeight: 700, background: 'var(--cream-dark)' }}><td colSpan={3}><strong>Total</strong></td><td className="amount-pos"><strong>{fmt(totalIncome)}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function Notificacoes({ notifs, unread, onMarkAll, onMarkOne }: any) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--green)' }}>Avisos Automáticos</div>
          {unread > 0 && <div style={{ fontSize: 13, color: 'var(--terra)', marginTop: 2 }}>{unread} não lido{unread > 1 ? 's' : ''}</div>}
        </div>
        {unread > 0 && <button className="btn btn-secondary btn-sm" onClick={onMarkAll}>Marcar todos como lidos</button>}
      </div>
      <div className="card">
        {notifs.length === 0 ? <div className="empty-state"><span className="empty-icon">🔔</span><p>Nenhuma notificação</p></div> : notifs.map((n: any) => {
          const rule = NOTIF_RULES[n.type] || { icon: '📢', bg: 'var(--cream-dark)' };
          return (
            <div key={n.id} className="notif-item" style={{ opacity: n.read ? 0.6 : 1 }}>
              <div className="notif-icon" style={{ background: rule.bg }}>{rule.icon}</div>
              <div className="notif-body"><div className="notif-title" style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</div>{n.body && <div className="notif-sub">{n.body}</div>}</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span className="notif-time">{new Date(n.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                {!n.read && <button className="btn btn-ghost btn-sm" onClick={() => onMarkOne(n.id)}>Lido</button>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ExpenseModal({ members, allCategories, onSave, onClose }: any) {
  const [form, setForm] = useState({ person_id: members[0]?.id, description: '', amount: '', category: 'alimentacao', date: todayStr() });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { if (!form.description || !form.amount) return; onSave({ ...form, amount: parseFloat(form.amount) }); };
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>💳 Novo Gasto</h3>
        <div className="form-group"><label>Pessoa</label><select value={form.person_id} onChange={e => set('person_id', e.target.value)}>{members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
        <div className="form-group"><label>Descrição</label><input type="text" placeholder="Ex: Supermercado" value={form.description} onChange={e => set('description', e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group"><label>Valor (R$)</label><input type="number" placeholder="0,00" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} /></div>
          <div className="form-group"><label>Data</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Categoria</label><select value={form.category} onChange={e => set('category', e.target.value)}>{allCategories.map((c: any) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}</select></div>
        <div className="form-actions"><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={handleSave}>Salvar Gasto</button></div>
      </div>
    </div>
  );
}

function IncomeModal({ members, onSave, onClose }: any) {
  const [form, setForm] = useState({ person_id: members[0]?.id, description: 'Salário', amount: '', date: todayStr() });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { if (!form.description || !form.amount) return; onSave({ ...form, amount: parseFloat(form.amount) }); };
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>💰 Novo Ganho</h3>
        <div className="form-group"><label>Pessoa</label><select value={form.person_id} onChange={e => set('person_id', e.target.value)}>{members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
        <div className="form-group"><label>Descrição</label><input type="text" placeholder="Ex: Salário, Freelance..." value={form.description} onChange={e => set('description', e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group"><label>Valor (R$)</label><input type="number" placeholder="0,00" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} /></div>
          <div className="form-group"><label>Data</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
        </div>
        <div className="form-actions"><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={handleSave}>Salvar Ganho</button></div>
      </div>
    </div>
  );
}

function GoalModal({ onSave, onClose }: any) {
  const [form, setForm] = useState({ name: '', target: '', saved: '0', deadline: '', split: '50/50' });
  const [selEmoji, setSelEmoji] = useState('✈️');
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { if (!form.name || !form.target) return; onSave({ ...form, emoji: selEmoji, target: parseFloat(form.target), saved: parseFloat(form.saved || '0') }); };
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>🎯 Nova Meta</h3>
        <div className="form-group">
          <label>Ícone</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
            {GOAL_EMOJIS.map(e => <button key={e} onClick={() => setSelEmoji(e)} style={{ padding: 8, background: selEmoji === e ? 'var(--green-pale)' : 'var(--cream-dark)', border: selEmoji === e ? '2px solid var(--green-light)' : '1.5px solid var(--border)', borderRadius: 10, cursor: 'pointer', fontSize: 18 }}>{e}</button>)}
          </div>
        </div>
        <div className="form-group"><label>Nome da meta</label><input type="text" placeholder="Ex: Viagem para Europa" value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group"><label>Valor alvo (R$)</label><input type="number" placeholder="0" min="0" value={form.target} onChange={e => set('target', e.target.value)} /></div>
          <div className="form-group"><label>Já guardado (R$)</label><input type="number" placeholder="0" min="0" value={form.saved} onChange={e => set('saved', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Prazo</label><input type="month" value={form.deadline} onChange={e => set('deadline', e.target.value)} /></div>
          <div className="form-group"><label>Divisão</label><select value={form.split} onChange={e => set('split', e.target.value)}><option value="50/50">50% cada</option><option value="60/40">60% Camila / 40% Rogério</option><option value="40/60">40% Camila / 60% Rogério</option></select></div>
        </div>
        <div className="form-actions"><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={handleSave}>Criar Meta</button></div>
      </div>
    </div>
  );
}

function DepositModal({ goal, onSave, onClose }: any) {
  const [amount, setAmount] = useState('');
  const handleSave = () => { const v = parseFloat(amount); if (!v || v <= 0) return; onSave(v); };
  const falta = Math.max(0, goal.target - goal.saved);
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{goal.emoji} Depositar na Meta</h3>
        <p style={{ fontSize: 14, color: 'var(--text-soft)', marginBottom: 20 }}><strong>{goal.name}</strong> · Faltam {fmt(falta)}</p>
        <div className="form-group"><label>Valor a depositar (R$)</label><input type="number" placeholder="0,00" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} autoFocus /></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {[100, 200, 500, falta].map(v => <button key={v} className="btn btn-secondary btn-sm" onClick={() => setAmount(String(v))}>{fmtShort(v)}</button>)}
        </div>
        <div className="form-actions"><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={handleSave}>Depositar</button></div>
      </div>
    </div>
  );
}
