import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

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

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
const GOAL_EMOJIS = [
  '✈️',
  '🏠',
  '🚗',
  '👶',
  '🎓',
  '💍',
  '🛋️',
  '🏦',
  '🌴',
  '🎵',
  '💻',
  '🐾',
  '🏋️',
  '🎨',
  '🌱',
];
const NOTIF_RULES = {
  over_budget: { icon: '⚠️', bg: '#FEF3C7' },
  imbalance: { icon: '⚖️', bg: '#EDE9FE' },
  goal_reminder: { icon: '🎯', bg: '#D1FAE5' },
  goal_complete: { icon: '🎉', bg: '#D1FAE5' },
  income_added: { icon: '💰', bg: '#D1FAE5' },
};

const fmt = (v) =>
  'R$ ' +
  Number(v || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtShort = (v) =>
  'R$ ' +
  Number(v || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
const todayStr = () => new Date().toISOString().slice(0, 10);
const nowISO = () => new Date().toISOString();
const catOf = (id, cats = CATEGORIES) =>
  cats.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
const monthLabel = (ym) => {
  const [y, m] = ym.split('-');
  return `${MONTHS[parseInt(m) - 1]} ${y}`;
};
const uid = () => Math.random().toString(36).slice(2, 10);

const DEMO_MEMBERS = [
  { id: 'user-a', name: 'Camila', avatar: 'C', color: '#A8D5BA' },
  { id: 'user-b', name: 'Rogério', avatar: 'R', color: '#C9A84C' },
];

const makeExpenses = () => [];
const makeIncomes = () => [];
const makeGoals = () => [];
const makeNotifs = () => [];

export default function CasalGrana() {
  const [page, setPage] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [members] = useState(DEMO_MEMBERS);
  const [modal, setModal] = useState(null);
  const [filterPerson, setFilterPerson] = useState('todos');
  const [filterCat, setFilterCat] = useState('todas');
  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [viewMode, setViewMode] = useState('juntos');
  const [depositGoal, setDepositGoal] = useState(null);
  const [customCategories, setCustomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  const allCategories = [...CATEGORIES, ...customCategories];

  const addCustomCategory = async (cat) => {
    await supabase.from('custom_categories').insert({ id: cat.id, label: cat.label, emoji: cat.emoji, color: cat.color });
    await loadCustomCategories();
  };

  // Load data from Supabase
  useEffect(() => {
    loadData();
    const expSub = supabase.channel('expenses').on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => loadExpenses()).subscribe();
    const incSub = supabase.channel('incomes').on('postgres_changes', { event: '*', schema: 'public', table: 'incomes' }, () => loadIncomes()).subscribe();
    const goalSub = supabase.channel('goals').on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, () => loadGoals()).subscribe();
    const notifSub = supabase.channel('notifications').on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => loadNotifs()).subscribe();
    const catSub = supabase.channel('custom_categories').on('postgres_changes', { event: '*', schema: 'public', table: 'custom_categories' }, () => loadCustomCategories()).subscribe();
    return () => { expSub.unsubscribe(); incSub.unsubscribe(); goalSub.unsubscribe(); notifSub.unsubscribe(); catSub.unsubscribe(); };
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadExpenses(), loadIncomes(), loadGoals(), loadNotifs(), loadCustomCategories()]);
    setLoading(false);
  };

  const loadCustomCategories = async () => {
    const { data } = await supabase.from('custom_categories').select('*').order('created_at');
    if (data) setCustomCategories(data);
  };

  const loadExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('date', { ascending: false });
    if (data) setExpenses(data.map(e => ({ ...e, person_id: e.person_name === 'Camila' ? 'user-a' : 'user-b' })));
  };

  const loadIncomes = async () => {
    const { data } = await supabase.from('incomes').select('*').order('date', { ascending: false });
    if (data) setIncomes(data.map(e => ({ ...e, person_id: e.person_name === 'Camila' ? 'user-a' : 'user-b' })));
  };

  const loadGoals = async () => {
    const { data } = await supabase.from('goals').select('*').order('created_at', { ascending: false });
    if (data) setGoals(data);
  };

  const loadNotifs = async () => {
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (data) setNotifs(data);
  };

  const unread = notifs.filter((n) => !n.read).length;

  const inMonth = (item) => item.date.startsWith(filterMonth);

  const expensesFiltered = expenses
    .filter(inMonth)
    .filter((e) => filterPerson === 'todos' || e.person_id === filterPerson)
    .filter((e) => filterCat === 'todas' || e.category === filterCat)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalExpenses = expenses
    .filter(inMonth)
    .reduce((s, e) => s + e.amount, 0);
  const totalIncome = incomes.filter(inMonth).reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  const byPerson = members.map((m) => ({
    ...m,
    expenses: expenses
      .filter((e) => inMonth(e) && e.person_id === m.id)
      .reduce((s, e) => s + e.amount, 0),
    income: incomes
      .filter((e) => inMonth(e) && e.person_id === m.id)
      .reduce((s, e) => s + e.amount, 0),
  }));

  const byCat = allCategories.map((c) => ({
    ...c,
    total: expenses
      .filter((e) => inMonth(e) && e.category === c.id)
      .reduce((s, e) => s + e.amount, 0),
  }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const maxCat = Math.max(...byCat.map((c) => c.total), 1);

  const addExpense = async (data) => {
    const personName = members.find(m => m.id === data.person_id)?.name || data.person_id;
    await supabase.from('expenses').insert({
      person_name: personName,
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
      tipo: data.tipo || 'normal',
      installment_group: data.installment_group || null,
      installment_total: data.installment_total || 1,
      installment_current: data.installment_current || 1,
    });
    await loadExpenses();
    // Check imbalance
    const aTotal = expenses.filter(e => inMonth(e) && e.person_id === 'user-a').reduce((s,e) => s+e.amount, 0) + (data.person_id === 'user-a' ? data.amount : 0);
    const bTotal = expenses.filter(e => inMonth(e) && e.person_id === 'user-b').reduce((s,e) => s+e.amount, 0) + (data.person_id === 'user-b' ? data.amount : 0);
    const diff = Math.abs(aTotal - bTotal);
    if (diff > 500) {
      const who = aTotal > bTotal ? 'Rogério' : 'Camila';
      await supabase.from('notifications').insert({ type: 'imbalance', title: 'Saldo desigual', body: `${who} deve ${fmtShort(diff)} ao parceiro neste mês.`, read: false });
      await loadNotifs();
    }
  };

  const addIncome = async (data) => {
    const personName = members.find(m => m.id === data.person_id)?.name || data.person_id;
    await supabase.from('incomes').insert({
      person_name: personName,
      description: data.description,
      amount: data.amount,
      date: data.date,
    });
    await supabase.from('notifications').insert({ type: 'income_added', title: 'Ganho registrado', body: `${data.description}: ${fmt(data.amount)}`, read: false });
    await loadIncomes();
    await loadNotifs();
  };

  const deleteExpense = async (id, deleteGroup = false) => {
    const exp = expenses.find(e => e.id === id);
    if (deleteGroup && exp?.installment_group) {
      await supabase.from('expenses').delete().eq('installment_group', exp.installment_group);
    } else {
      await supabase.from('expenses').delete().eq('id', id);
    }
    await loadExpenses();
  };

  const editExpense = async (id, data) => {
    const personName = members.find(m => m.id === data.person_id)?.name || data.person_id;
    await supabase.from('expenses').update({
      person_name: personName,
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
    }).eq('id', id);
    await loadExpenses();
  };

  const deleteIncome = async (id) => {
    await supabase.from('incomes').delete().eq('id', id);
    await loadIncomes();
  };

  const editIncome = async (id, data) => {
    const personName = members.find(m => m.id === data.person_id)?.name || data.person_id;
    await supabase.from('incomes').update({
      person_name: personName,
      description: data.description,
      amount: data.amount,
      date: data.date,
    }).eq('id', id);
    await loadIncomes();
  };

  const deleteGoal = async (id) => {
    await supabase.from('goals').delete().eq('id', id);
    await loadGoals();
  };

  const editGoal = async (id, data) => {
    await supabase.from('goals').update({
      name: data.name,
      emoji: data.emoji,
      target: data.target,
      saved: data.saved,
      deadline: data.deadline,
      split: data.split,
    }).eq('id', id);
    await loadGoals();
  };

  const addGoal = async (data) => {
    await supabase.from('goals').insert({ ...data, saved: data.saved || 0 });
    await loadGoals();
  };

  const depositGoalFn = async (goalId, amount) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const newSaved = Math.min(goal.saved + amount, goal.target);
    await supabase.from('goals').update({ saved: newSaved }).eq('id', goalId);
    if (newSaved >= goal.target) {
      await supabase.from('notifications').insert({ type: 'goal_complete', title: `Meta concluída! ${goal.emoji}`, body: `"${goal.name}" foi atingida!`, read: false });
      await loadNotifs();
    }
    await loadGoals();
  };

  const markAllRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('read', false);
    await loadNotifs();
  };

  const months = Array.from(
    new Set([...expenses, ...incomes].map((t) => t.date.slice(0, 7)))
  )
    .sort()
    .reverse();
  if (!months.includes(currentMonth())) months.unshift(currentMonth());

  const selStyle = {
    padding: '8px 12px',
    borderRadius: 50,
    border: '1.5px solid var(--border)',
    background: 'var(--cream)',
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    outline: 'none',
  };

  if (loading) return (
    <>
      <style>{STYLE}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--green)', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: 'var(--cream)' }}>Casal & Grana</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Carregando seus dados...</div>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLE}</style>
      <div className="app-shell" ref={printRef}>
        <aside className="sidebar">
          <div className="sidebar-brand">
            <h1>
              Casal &<br />
              Grana
            </h1>
            <p>Finanças a dois</p>
          </div>
          <nav className="sidebar-nav">
            {[
              { id: 'dashboard', icon: '📊', label: 'Visão Geral' },
              { id: 'lancamentos', icon: '💳', label: 'Lançamentos' },
              { id: 'ganhos', icon: '💰', label: 'Ganhos' },
              { id: 'metas', icon: '🎯', label: 'Metas' },
              { id: 'relatorio', icon: '📄', label: 'Relatório' },
              {
                id: 'notificacoes',
                icon: '🔔',
                label: unread > 0 ? `Avisos (${unread})` : 'Avisos',
              },
            ].map((n) => (
              <button
                key={n.id}
                className={`nav-item ${page === n.id ? 'active' : ''}`}
                onClick={() => setPage(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="couple-pill">
              <div className="avatars-sm">
                <div className="av av-a">C</div>
                <div className="av av-b">R</div>
              </div>
              <div className="couple-info">
                <div className="couple-name">Camila & Rogério</div>
                <div className="couple-month">{monthLabel(filterMonth)}</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar no-print">
            <div className="topbar-left">
              <h2>
                {
                  {
                    dashboard: 'Visão Geral',
                    lancamentos: 'Lançamentos',
                    ganhos: 'Ganhos',
                    metas: 'Metas',
                    relatorio: 'Relatório',
                    notificacoes: 'Avisos',
                  }[page]
                }
              </h2>
              <p>
                {
                  {
                    dashboard: 'Resumo do mês',
                    lancamentos: 'Gastos do casal',
                    ganhos: 'Renda registrada',
                    metas: 'Objetivos do casal',
                    relatorio: 'Imprimir e exportar',
                    notificacoes: 'Notificações automáticas',
                  }[page]
                }
              </p>
            </div>
            <div className="topbar-actions">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                style={selStyle}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {monthLabel(m)}
                  </option>
                ))}
              </select>
              {page === 'relatorio' && (
                <button
                  className="btn btn-secondary"
                  onClick={() => window.print()}
                >
                  🖨️ <span>Imprimir</span>
                </button>
              )}
              {['lancamentos', 'ganhos', 'metas'].includes(page) && (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setModal(
                      page === 'ganhos'
                        ? 'income'
                        : page === 'metas'
                        ? 'goal'
                        : 'expense'
                    )
                  }
                >
                  ＋{' '}
                  <span>
                    {page === 'ganhos'
                      ? 'Ganho'
                      : page === 'metas'
                      ? 'Meta'
                      : 'Gasto'}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="page">
            {page === 'dashboard' && (
              <Dashboard
                byPerson={byPerson}
                byCat={byCat}
                maxCat={maxCat}
                totalExpenses={totalExpenses}
                totalIncome={totalIncome}
                balance={balance}
                goals={goals}
                expenses={expenses.filter(inMonth)}
                members={members}
              />
            )}
            {page === 'lancamentos' && (
              <Lancamentos
                expenses={expensesFiltered}
                members={members}
                filterPerson={filterPerson}
                setFilterPerson={setFilterPerson}
                filterCat={filterCat}
                setFilterCat={setFilterCat}
                viewMode={viewMode}
                setViewMode={setViewMode}
                byPerson={byPerson}
                onDelete={deleteExpense}
                onEdit={editExpense}
                onAdd={() => setModal('expense')}
                inMonth={inMonth}
                allExpenses={expenses}
                allCategories={allCategories}
              />
            )}
            {page === 'ganhos' && (
              <Ganhos
                incomes={incomes.filter(inMonth)}
                members={members}
                byPerson={byPerson}
                onAdd={() => setModal('income')}
                onDelete={deleteIncome}
                onEdit={editIncome}
              />
            )}
            {page === 'metas' && (
              <Metas
                goals={goals}
                onAdd={() => setModal('goal')}
                onDeposit={(g) => {
                  setDepositGoal(g);
                  setModal('deposit');
                }}
                onDelete={deleteGoal}
                onEdit={editGoal}
              />
            )}
            {page === 'relatorio' && (
              <Relatorio
                expenses={expenses.filter(inMonth)}
                incomes={incomes.filter(inMonth)}
                members={members}
                byCat={byCat}
                totalExpenses={totalExpenses}
                totalIncome={totalIncome}
                balance={balance}
                byPerson={byPerson}
                filterMonth={filterMonth}
              />
            )}
            {page === 'notificacoes' && (
              <Notificacoes
                notifs={notifs}
                unread={unread}
                onMarkAll={markAllRead}
                onMarkOne={(id) =>
                  setNotifs((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                  )
                }
              />
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
              {
                id: 'notificacoes',
                icon: unread > 0 ? '🔔' : '🔕',
                label: 'Avisos',
              },
            ].map((n) => (
              <button
                key={n.id}
                className={`mobile-nav-item ${page === n.id ? 'active' : ''}`}
                onClick={() => setPage(n.id)}
              >
                <span>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {modal === 'expense' && (
        <ExpenseModal
          members={members}
          categories={allCategories}
          onSave={async (d) => {
            await addExpense(d);
            setModal(null);
          }}
          onClose={() => setModal(null)}
          onAddCategory={addCustomCategory}
        />
      )}
      {modal === 'income' && (
        <IncomeModal
          members={members}
          onSave={(d) => {
            addIncome(d);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'goal' && (
        <GoalModal
          onSave={(d) => {
            addGoal(d);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'deposit' && depositGoal && (
        <DepositModal
          goal={depositGoal}
          onSave={(amt) => {
            depositGoalFn(depositGoal.id, amt);
            setModal(null);
            setDepositGoal(null);
          }}
          onClose={() => {
            setModal(null);
            setDepositGoal(null);
          }}
        />
      )}
    </>
  );
}

function Dashboard({
  byPerson,
  byCat,
  maxCat,
  totalExpenses,
  totalIncome,
  balance,
  goals,
  expenses,
  members,
}) {
  return (
    <>
      <div className="summary-row">
        <div className="card card-accent-green">
          <div className="card-label">Total de Ganhos</div>
          <div className="card-value card-positive">
            {fmtShort(totalIncome)}
          </div>
          <div className="card-sub">Renda combinada</div>
        </div>
        <div className="card card-accent-terra">
          <div className="card-label">Total de Gastos</div>
          <div className="card-value card-negative">
            {fmtShort(totalExpenses)}
          </div>
          <div className="card-sub">Despesas do mês</div>
        </div>
        <div
          className={`card ${
            balance >= 0 ? 'card-accent-green' : 'card-accent-terra'
          }`}
        >
          <div className="card-label">Saldo do Mês</div>
          <div
            className={`card-value ${
              balance >= 0 ? 'card-positive' : 'card-negative'
            }`}
          >
            {fmtShort(balance)}
          </div>
          <div className="card-sub">
            {balance >= 0 ? '✓ No azul' : '⚠ No vermelho'}
          </div>
        </div>
        <div className="card card-accent-gold">
          <div className="card-label">Economia</div>
          <div className="card-value" style={{ color: 'var(--gold)' }}>
            {totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%
          </div>
          <div className="card-sub">Da renda economizada</div>
        </div>
      </div>
      <div className="panel-grid">
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Por Pessoa</div>
              <div className="section-sub">Gastos individuais</div>
            </div>
          </div>
          {byPerson.map((p) => (
            <div key={p.id} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <div
                  className="av"
                  style={{
                    background: p.color,
                    color: 'var(--green)',
                    fontSize: 13,
                  }}
                >
                  {p.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>
                    Ganhou {fmtShort(p.income)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--terra)',
                    }}
                  >
                    {fmtShort(p.expenses)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>
                    Saldo: {fmtShort(p.income - p.expenses)}
                  </div>
                </div>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width:
                      totalExpenses > 0
                        ? `${(p.expenses / totalExpenses) * 100}%`
                        : '0%',
                    background: p.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Por Categoria</div>
              <div className="section-sub">Maiores gastos</div>
            </div>
          </div>
          {byCat.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📊</span>
              <p>Sem gastos neste mês</p>
            </div>
          ) : (
            <div className="bar-chart">
              {byCat.map((c) => (
                <div key={c.id} className="bar-row">
                  <span className="bar-label">
                    {c.emoji} {c.label}
                  </span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(c.total / maxCat) * 100}%`,
                        background: c.color,
                      }}
                    />
                  </div>
                  <span className="bar-amt">{fmtShort(c.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Últimos Gastos</div>
            </div>
          </div>
          {expenses.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💳</span>
              <p>Nenhum gasto registrado</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Pessoa</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 6).map((e) => {
                    const cat = catOf(e.category, allCategories.length ? allCategories : undefined);
                    return (
                      <tr key={e.id}>
                        <td>
                          {e.description}
                          {e.tipo === 'fixo' && <span style={{ marginLeft: 6, fontSize: 10, background: '#EDE9FE', color: '#5B21B6', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>🔁 Fixo</span>}
                        </td>
                        <td>
                          <span className="badge badge-gray">
                            {cat.emoji} {cat.label}
                          </span>
                        </td>
                        <td style={{ fontSize: 13 }}>
                          {members.find((m) => m.id === e.person_id)?.name}
                        </td>
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
          <div className="section-header">
            <div>
              <div className="section-title">Metas</div>
              <div className="section-sub">Progresso dos objetivos</div>
            </div>
          </div>
          {goals.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎯</span>
              <p>Sem metas cadastradas</p>
            </div>
          ) : (
            goals.slice(0, 3).map((g) => {
              const pct = Math.round((g.saved / g.target) * 100);
              return (
                <div key={g.id} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500 }}>
                      {g.emoji} {g.name}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-soft)' }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background:
                          pct >= 100
                            ? 'var(--green-light)'
                            : pct > 60
                            ? 'var(--gold)'
                            : 'var(--terra)',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      color: 'var(--text-soft)',
                      marginTop: 3,
                    }}
                  >
                    <span>{fmtShort(g.saved)}</span>
                    <span>{fmtShort(g.target)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

function Lancamentos({
  expenses,
  members,
  filterPerson,
  setFilterPerson,
  filterCat,
  setFilterCat,
  viewMode,
  setViewMode,
  byPerson,
  onDelete,
  onEdit,
  onAdd,
  inMonth,
  allExpenses,
  allCategories = [],
}) {
  const [editingExp, setEditingExp] = useState(null);
  const [editExpForm, setEditExpForm] = useState({});
  const cats = allCategories.length > 0 ? allCategories : [];

  const startEditExp = (e) => {
    setEditingExp(e.id);
    setEditExpForm({ description: e.description, amount: e.amount, category: e.category, date: e.date, person_id: e.person_id });
  };
  const saveEditExp = async () => {
    await onEdit(editingExp, editExpForm);
    setEditingExp(null);
  };
  const selStyle = {
    padding: '7px 14px',
    borderRadius: 50,
    border: '1.5px solid var(--border)',
    background: 'var(--cream)',
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    outline: 'none',
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <div className="tab-row">
          <button
            className={`tab-btn ${viewMode === 'juntos' ? 'active' : ''}`}
            onClick={() => setViewMode('juntos')}
          >
            👫 Juntos
          </button>
          <button
            className={`tab-btn ${viewMode === 'separado' ? 'active' : ''}`}
            onClick={() => setViewMode('separado')}
          >
            👤 Separado
          </button>
        </div>
        <button className="btn btn-primary no-print" onClick={onAdd}>
          ＋ Gasto
        </button>
      </div>
      {viewMode === 'separado' ? (
        <div className="split-grid">
          {byPerson.map((p) => (
            <div key={p.id} className="person-card">
              <div className="person-header">
                <div
                  className="person-av"
                  style={{ background: p.color, color: 'var(--green)' }}
                >
                  {p.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--terra)',
                      fontWeight: 600,
                    }}
                  >
                    {fmtShort(p.expenses)} gastos
                  </div>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Cat.</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allExpenses
                      .filter((e) => inMonth(e) && e.person_id === p.id)
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((e) => (
                        <tr key={e.id}>
                          <td>{e.description}</td>
                          <td>
                            <span className="badge badge-gray">
                              {catOf(e.category).emoji}
                            </span>
                          </td>
                          <td className="amount-neg">{fmtShort(e.amount)}</td>
                        </tr>
                      ))}
                    {allExpenses.filter(
                      (e) => inMonth(e) && e.person_id === p.id
                    ).length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            textAlign: 'center',
                            color: 'var(--text-soft)',
                            padding: 24,
                          }}
                        >
                          Sem gastos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="filter-row no-print">
            <select
              value={filterPerson}
              onChange={(e) => setFilterPerson(e.target.value)}
              style={selStyle}
            >
              <option value="todos">Todos</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              style={selStyle}
            >
              <option value="todas">Todas categorias</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Pessoa</th>
                  <th>Valor</th>
                  <th className="no-print"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: 'center',
                        padding: 32,
                        color: 'var(--text-soft)',
                      }}
                    >
                      Nenhum gasto encontrado
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => {
                    const cat = catOf(e.category, allCategories.length ? allCategories : undefined);
                    const m = members.find((x) => x.id === e.person_id);
                    return (
                      <tr key={e.id}>
                        <td style={{ color: 'var(--text-soft)', fontSize: 13 }}>
                          {new Date(e.date + 'T12:00:00').toLocaleDateString(
                            'pt-BR',
                            { day: '2-digit', month: 'short' }
                          )}
                        </td>
                        <td style={{ fontWeight: 500 }}>{e.description}</td>
                        <td>
                          <span className="badge badge-gray">
                            {cat.emoji} {cat.label}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: m?.color,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'var(--green)',
                                flexShrink: 0,
                              }}
                            >
                              {m?.avatar}
                            </span>
                            {m?.name}
                          </span>
                        </td>
                        <td className="amount-neg">
                          {editingExp === e.id
                            ? <input type="number" value={editExpForm.amount} onChange={ev => setEditExpForm(p=>({...p, amount: ev.target.value}))} style={{ width: 100, padding: '4px 8px', borderRadius: 6, border: '1.5px solid var(--border)', fontSize: 13 }} />
                            : fmt(e.amount)
                          }
                        </td>
                        <td className="no-print">
                          {editingExp === e.id ? (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-primary btn-sm" style={{ padding: '4px 8px', fontSize: 12 }} onClick={saveEditExp}>✓</button>
                              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setEditingExp(null)}>✕</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => startEditExp(e)}>✏️</button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  if (e.installment_group) {
                                    const choice = window.confirm(
                                      e.installment_total > 1
                                        ? `Excluir só esta parcela ou TODAS as ${e.installment_total} parcelas?

OK = Excluir TODAS
Cancelar = Só esta`
                                        : 'Excluir este gasto?'
                                    );
                                    if (e.installment_total > 1) {
                                      onDelete(e.id, choice);
                                    } else if (choice) {
                                      onDelete(e.id, false);
                                    }
                                  } else {
                                    if (window.confirm('Excluir este gasto?')) onDelete(e.id, false);
                                  }
                                }}
                              >
                                🗑
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function Ganhos({ incomes, members, byPerson, onAdd, onDelete, onEdit }) {
  const total = incomes.reduce((s, i) => s + i.amount, 0);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (i) => {
    setEditing(i.id);
    setEditForm({ description: i.description, amount: i.amount, date: i.date, person_id: i.person_id });
  };
  const saveEdit = async () => {
    await onEdit(editing, { ...editForm, amount: parseFloat(editForm.amount) });
    setEditing(null);
  };
  return (
    <>
      <div
        className="summary-row"
        style={{ gridTemplateColumns: 'repeat(3,1fr)' }}
      >
        <div className="card card-accent-green">
          <div className="card-label">Renda Total</div>
          <div className="card-value card-positive">{fmtShort(total)}</div>
          <div className="card-sub">Combinada do casal</div>
        </div>
        {byPerson.map((p) => (
          <div key={p.id} className="card card-accent-gold">
            <div className="card-label">{p.name}</div>
            <div className="card-value" style={{ color: 'var(--gold)' }}>
              {fmtShort(p.income)}
            </div>
            <div className="card-sub">
              {total > 0 ? Math.round((p.income / total) * 100) : 0}% da renda
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">Lançamentos de Ganhos</div>
          </div>
          <button className="btn btn-primary no-print" onClick={onAdd}>
            ＋ Ganho
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Pessoa</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {incomes.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: 'center',
                      padding: 32,
                      color: 'var(--text-soft)',
                    }}
                  >
                    Nenhum ganho registrado
                  </td>
                </tr>
              ) : (
                incomes.map((i) => {
                  const m = members.find((x) => x.id === i.person_id);
                  const isEditing = editing === i.id;
                  return (
                    <tr key={i.id} style={{ background: isEditing ? 'var(--green-pale)' : undefined }}>
                      <td style={{ color: 'var(--text-soft)', fontSize: 13 }}>
                        {isEditing
                          ? <input type="date" value={editForm.date} onChange={e => setEditForm(p=>({...p, date: e.target.value}))} style={{ width: 130, padding: '4px 8px', borderRadius: 6, border: '1.5px solid var(--border)', fontSize: 12 }} />
                          : new Date(i.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                        }
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {isEditing
                          ? <input type="text" value={editForm.description} onChange={e => setEditForm(p=>({...p, description: e.target.value}))} style={{ width: '100%', padding: '4px 8px', borderRadius: 6, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} />
                          : i.description
                        }
                      </td>
                      <td>
                        {isEditing
                          ? <select value={editForm.person_id} onChange={e => setEditForm(p=>({...p, person_id: e.target.value}))} style={{ padding: '4px 8px', borderRadius: 6, border: '1.5px solid var(--border)', fontSize: 13 }}>
                              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                          : <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 22, height: 22, borderRadius: '50%', background: m?.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--green)' }}>{m?.avatar}</span>
                              {m?.name}
                            </span>
                        }
                      </td>
                      <td className="amount-pos">
                        {isEditing
                          ? <input type="number" value={editForm.amount} onChange={e => setEditForm(p=>({...p, amount: e.target.value}))} style={{ width: 110, padding: '4px 8px', borderRadius: 6, border: '1.5px solid var(--border)', fontSize: 13 }} />
                          : fmt(i.amount)
                        }
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {isEditing ? (
                            <>
                              <button className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: 12 }} onClick={saveEdit}>✓</button>
                              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setEditing(null)}>✕</button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-secondary btn-sm no-print" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => startEdit(i)}>✏️</button>
                              <button className="btn btn-danger btn-sm no-print" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => { if (window.confirm('Excluir este ganho?')) onDelete(i.id); }}>🗑</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Metas({ goals, onAdd, onDeposit, onDelete, onEdit }) {
  const [editingGoal, setEditingGoal] = useState(null);
  const [editGoalForm, setEditGoalForm] = useState({});
  const GOAL_EMOJIS = ['🎯','✈️','🏠','🚗','💍','🎓','🛋️','🏦','🌴','🎵','💻','🐾','🏋️','🎨','🌱','📱','🍕','⛱️','🏕️','💰'];

  const startEditGoal = (g) => {
    setEditingGoal(g.id);
    setEditGoalForm({ name: g.name, emoji: g.emoji, target: g.target, saved: g.saved, deadline: g.deadline || '', split: g.split || '50/50' });
  };
  const saveEditGoal = async () => {
    await onEdit(editingGoal, { ...editGoalForm, target: parseFloat(editGoalForm.target), saved: parseFloat(editGoalForm.saved) });
    setEditingGoal(null);
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div
          className="section-title"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20,
            color: 'var(--green)',
          }}
        >
          Objetivos do Casal
        </div>
        <button className="btn btn-primary no-print" onClick={onAdd}>
          ＋ Nova Meta
        </button>
      </div>
      {goals.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎯</span>
          <p>Nenhuma meta cadastrada ainda</p>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
            const falta = Math.max(0, g.target - g.saved);
            const now = new Date();
            const deadline = g.deadline ? new Date(g.deadline + '-01') : null;
            const mos = deadline
              ? Math.max(
                  1,
                  (deadline.getFullYear() - now.getFullYear()) * 12 +
                    (deadline.getMonth() - now.getMonth())
                )
              : null;
            const monthly = mos ? Math.round(falta / mos) : null;
            const color =
              pct >= 100
                ? 'var(--green-light)'
                : pct > 70
                ? 'var(--gold)'
                : pct > 40
                ? '#6B8FBF'
                : 'var(--terra)';
            return (
              <div key={g.id} className="goal-card">
                <span className="goal-emoji">{g.emoji}</span>
                <div className="goal-name">{g.name}</div>
                {g.deadline && (
                  <div className="goal-deadline">
                    📅 Prazo: {monthLabel(g.deadline)}
                  </div>
                )}
                <div className="goal-amounts">
                  <span>Guardado: {fmtShort(g.saved)}</span>
                  <span>Meta: {fmtShort(g.target)}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <div className="goal-pct">{pct}%</div>
                {monthly && pct < 100 && (
                  <div className="goal-monthly">
                    📆 {fmtShort(monthly / 2)}/mês cada
                  </div>
                )}
                {pct < 100 && (
                  <button
                    className="btn btn-secondary btn-sm no-print"
                    style={{ marginTop: 12, width: '100%' }}
                    onClick={() => onDeposit(g)}
                  >
                    + Depositar
                  </button>
                )}
                {pct >= 100 && (
                  <div className="badge badge-green" style={{ marginTop: 12 }}>
                    ✓ Meta atingida!
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm no-print"
                    style={{ flex: 1, fontSize: 12 }}
                    onClick={() => startEditGoal(g)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm no-print"
                    style={{ fontSize: 12 }}
                    onClick={() => { if (window.confirm(`Excluir a meta "${g.name}"?`)) onDelete(g.id); }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal editar meta */}
      {editingGoal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setEditingGoal(null)}>
          <div className="modal">
            <h3>✏️ Editar Meta</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {GOAL_EMOJIS.map(em => (
                <button key={em} onClick={() => setEditGoalForm(p=>({...p, emoji: em}))}
                  style={{ padding: '4px 8px', fontSize: 18, background: editGoalForm.emoji === em ? 'var(--green-pale)' : 'var(--white)', border: editGoalForm.emoji === em ? '2px solid var(--green-light)' : '1.5px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}>
                  {em}
                </button>
              ))}
            </div>
            <div className="form-group">
              <label>Nome da meta</label>
              <input type="text" value={editGoalForm.name} onChange={e => setEditGoalForm(p=>({...p, name: e.target.value}))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Valor total (R$)</label>
                <input type="number" value={editGoalForm.target} onChange={e => setEditGoalForm(p=>({...p, target: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Já guardado (R$)</label>
                <input type="number" value={editGoalForm.saved} onChange={e => setEditGoalForm(p=>({...p, saved: e.target.value}))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Prazo (mês/ano)</label>
                <input type="month" value={editGoalForm.deadline} onChange={e => setEditGoalForm(p=>({...p, deadline: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Divisão</label>
                <select value={editGoalForm.split} onChange={e => setEditGoalForm(p=>({...p, split: e.target.value}))}>
                  <option value="50/50">50% / 50%</option>
                  <option value="60/40">60% Camila / 40% Rogério</option>
                  <option value="40/60">40% Camila / 60% Rogério</option>
                  <option value="100/0">100% Camila</option>
                  <option value="0/100">100% Rogério</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setEditingGoal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={saveEditGoal}>Salvar alterações</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Relatorio({
  expenses,
  incomes,
  members,
  byCat,
  totalExpenses,
  totalIncome,
  balance,
  byPerson,
  filterMonth,
}) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <div
            className="section-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              color: 'var(--green)',
            }}
          >
            Relatório — {monthLabel(filterMonth)}
          </div>
          <div
            style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 2 }}
          >
            Camila & Rogério · Casal & Grana
          </div>
        </div>
        <button
          className="btn btn-primary no-print"
          onClick={() => window.print()}
        >
          🖨️ Imprimir
        </button>
      </div>
      <div className="summary-row">
        <div className="card">
          <div className="card-label">Renda Total</div>
          <div className="card-value card-positive">{fmt(totalIncome)}</div>
        </div>
        <div className="card">
          <div className="card-label">Gastos Totais</div>
          <div className="card-value card-negative">{fmt(totalExpenses)}</div>
        </div>
        <div className="card">
          <div className="card-label">Saldo</div>
          <div
            className={`card-value ${
              balance >= 0 ? 'card-positive' : 'card-negative'
            }`}
          >
            {fmt(balance)}
          </div>
        </div>
        <div className="card">
          <div className="card-label">Taxa de Poupança</div>
          <div className="card-value" style={{ color: 'var(--gold)' }}>
            {totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%
          </div>
        </div>
      </div>
      <div className="panel-grid">
        <div className="card">
          <div
            className="section-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              marginBottom: 16,
            }}
          >
            Gastos por Pessoa
          </div>
          {byPerson.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ fontWeight: 500 }}>{p.name}</span>
              <span className="amount-neg">{fmt(p.expenses)}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div
            className="section-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              marginBottom: 16,
            }}
          >
            Gastos por Categoria
          </div>
          {byCat.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span>
                {c.emoji} {c.label}
              </span>
              <span className="amount-neg">{fmt(c.total)}</span>
            </div>
          ))}
          {byCat.length === 0 && (
            <div style={{ color: 'var(--text-soft)', fontSize: 14 }}>
              Sem gastos
            </div>
          )}
        </div>
        <div className="card panel-full">
          <div
            className="section-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              marginBottom: 16,
            }}
          >
            Todos os Gastos
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Pessoa</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {expenses
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((e) => {
                    const cat = catOf(e.category);
                    const m = members.find((x) => x.id === e.person_id);
                    return (
                      <tr key={e.id}>
                        <td>
                          {new Date(e.date + 'T12:00:00').toLocaleDateString(
                            'pt-BR'
                          )}
                        </td>
                        <td>{e.description}</td>
                        <td>
                          {cat.emoji} {cat.label}
                        </td>
                        <td>{m?.name}</td>
                        <td className="amount-neg">{fmt(e.amount)}</td>
                      </tr>
                    );
                  })}
                <tr
                  style={{ fontWeight: 700, background: 'var(--cream-dark)' }}
                >
                  <td colSpan={4}>
                    <strong>Total</strong>
                  </td>
                  <td className="amount-neg">
                    <strong>{fmt(totalExpenses)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="card panel-full">
          <div
            className="section-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              marginBottom: 16,
            }}
          >
            Todos os Ganhos
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Pessoa</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((i) => {
                  const m = members.find((x) => x.id === i.person_id);
                  return (
                    <tr key={i.id}>
                      <td>
                        {new Date(i.date + 'T12:00:00').toLocaleDateString(
                          'pt-BR'
                        )}
                      </td>
                      <td>{i.description}</td>
                      <td>{m?.name}</td>
                      <td className="amount-pos">{fmt(i.amount)}</td>
                    </tr>
                  );
                })}
                <tr
                  style={{ fontWeight: 700, background: 'var(--cream-dark)' }}
                >
                  <td colSpan={3}>
                    <strong>Total</strong>
                  </td>
                  <td className="amount-pos">
                    <strong>{fmt(totalIncome)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function Notificacoes({ notifs, unread, onMarkAll, onMarkOne }) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <div
            className="section-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              color: 'var(--green)',
            }}
          >
            Avisos Automáticos
          </div>
          {unread > 0 && (
            <div style={{ fontSize: 13, color: 'var(--terra)', marginTop: 2 }}>
              {unread} não lido{unread > 1 ? 's' : ''}
            </div>
          )}
        </div>
        {unread > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={onMarkAll}>
            Marcar todos como lidos
          </button>
        )}
      </div>
      <div className="card">
        {notifs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔔</span>
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          notifs.map((n) => {
            const rule = NOTIF_RULES[n.type] || {
              icon: '📢',
              bg: 'var(--cream-dark)',
            };
            return (
              <div
                key={n.id}
                className="notif-item"
                style={{ opacity: n.read ? 0.6 : 1 }}
              >
                <div className="notif-icon" style={{ background: rule.bg }}>
                  {rule.icon}
                </div>
                <div className="notif-body">
                  <div
                    className="notif-title"
                    style={{ fontWeight: n.read ? 400 : 600 }}
                  >
                    {n.title}
                  </div>
                  {n.body && <div className="notif-sub">{n.body}</div>}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 6,
                  }}
                >
                  <span className="notif-time">
                    {new Date(n.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                  {!n.read && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => onMarkOne(n.id)}
                    >
                      Lido
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

function ExpenseModal({ members, categories, onSave, onClose, onAddCategory }) {
  const [form, setForm] = useState({
    person_id: members[0]?.id,
    description: '',
    amount: '',
    category: 'alimentacao',
    date: todayStr(),
    tipo: 'normal', // 'normal' | 'parcelado' | 'fixo'
    parcelas: 2,
    valorTotal: '',
  });
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCat, setNewCat] = useState({ label: '', emoji: '🏷️' });
  const EMOJI_OPTIONS = ['🏷️','🛍️','🎮','🐶','🏥','✈️','🎁','🏋️','🍕','☕','🏠','💡','📱','🎓','💄','🔧','🌿','🐱','🎵','🚀'];

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const valorParcela = form.tipo === 'parcelado' && form.valorTotal && form.parcelas > 0
    ? (parseFloat(form.valorTotal) / form.parcelas).toFixed(2)
    : null;

  const handleSave = async () => {
    if (!form.description) return;
    if (form.tipo === 'parcelado') {
      if (!form.valorTotal || form.parcelas < 2) return;
      const parcVal = parseFloat(form.valorTotal) / form.parcelas;
      const [year, month, day] = form.date.split('-').map(Number);
      const groupId = 'grp_' + Date.now();
      for (let i = 0; i < form.parcelas; i++) {
        const d = new Date(year, month - 1 + i, day);
        const dateStr = d.toISOString().slice(0, 10);
        await onSave({
          person_id: form.person_id,
          description: `${form.description} (${i+1}/${form.parcelas})`,
          amount: parcVal,
          category: form.category,
          date: dateStr,
          tipo: 'parcelado',
          installment_group: groupId,
          installment_total: form.parcelas,
          installment_current: i + 1,
        });
      }
    } else if (form.tipo === 'fixo') {
      if (!form.amount) return;
      await onSave({ ...form, amount: parseFloat(form.amount), tipo: 'fixo' });
    } else {
      if (!form.amount) return;
      await onSave({ ...form, amount: parseFloat(form.amount), tipo: 'normal' });
    }
  };

  const handleAddCategory = () => {
    if (!newCat.label.trim()) return;
    const id = 'cat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const cat = { id, label: newCat.label.trim(), emoji: newCat.emoji, color: '#8A9E94' };
    onAddCategory(cat);
    set('category', id);
    setShowNewCat(false);
    setNewCat({ label: '', emoji: '🏷️' });
  };

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <h3>💳 Novo Gasto</h3>

        {/* Tipo de gasto */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { id: 'normal', label: '💰 Normal', desc: 'Avulso' },
            { id: 'parcelado', label: '📅 Parcelado', desc: 'Em parcelas' },
            { id: 'fixo', label: '🔁 Fixo', desc: 'Todo mês' },
          ].map(t => (
            <button key={t.id} onClick={() => set('tipo', t.id)}
              style={{ flex: 1, padding: '8px 4px', borderRadius: 10, border: form.tipo === t.id ? '2px solid var(--green)' : '1.5px solid var(--border)', background: form.tipo === t.id ? 'var(--green-pale)' : 'var(--white)', cursor: 'pointer', fontSize: 12, fontWeight: form.tipo === t.id ? 600 : 400, color: form.tipo === t.id ? 'var(--green)' : 'var(--text-mid)', fontFamily: "'DM Sans', sans-serif" }}>
              <div>{t.label}</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{t.desc}</div>
            </button>
          ))}
        </div>

        <div className="form-group">
          <label>Pessoa</label>
          <select value={form.person_id} onChange={(e) => set('person_id', e.target.value)}>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <input type="text"
            placeholder={form.tipo === 'fixo' ? 'Ex: Internet, Água, Luz...' : form.tipo === 'parcelado' ? 'Ex: Geladeira, Sofá...' : 'Ex: Supermercado'}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        {/* Campos condicionais por tipo */}
        {form.tipo === 'parcelado' ? (
          <div className="form-row">
            <div className="form-group">
              <label>Valor Total (R$)</label>
              <input type="number" placeholder="0,00" min="0" step="0.01"
                value={form.valorTotal} onChange={(e) => set('valorTotal', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Parcelas</label>
              <input type="number" min="2" max="60" placeholder="Ex: 12"
                value={form.parcelas} onChange={(e) => set('parcelas', parseInt(e.target.value) || 2)} />
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label>Valor (R$)</label>
            <input type="number" placeholder="0,00" min="0" step="0.01"
              value={form.amount} onChange={(e) => set('amount', e.target.value)} />
          </div>
        )}

        {/* Preview parcela */}
        {form.tipo === 'parcelado' && valorParcela && (
          <div style={{ background: 'var(--green-pale)', border: '1px solid var(--green-light)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: 'var(--green)' }}>
            💡 <strong>{form.parcelas}x de R$ {parseFloat(valorParcela).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> — serão criados {form.parcelas} lançamentos automaticamente
          </div>
        )}

        {form.tipo === 'fixo' && (
          <div style={{ background: '#EDE9FE', border: '1px solid #C4B5FD', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#5B21B6' }}>
            🔁 Este gasto aparecerá todo mês automaticamente
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>{form.tipo === 'parcelado' ? 'Mês inicial' : 'Data'}</label>
            <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ margin: 0 }}>Categoria</label>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowNewCat(!showNewCat)}
              style={{ fontSize: 11, padding: '4px 10px' }}
            >
              {showNewCat ? '✕ Cancelar' : '＋ Nova categoria'}
            </button>
          </div>
          {showNewCat ? (
            <div style={{ background: 'var(--cream-dark)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ícone</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {EMOJI_OPTIONS.map((e) => (
                    <button key={e} onClick={() => setNewCat(p => ({ ...p, emoji: e }))}
                      style={{ padding: '4px 6px', fontSize: 16, background: newCat.emoji === e ? 'var(--green-pale)' : 'var(--white)', border: newCat.emoji === e ? '2px solid var(--green-light)' : '1.5px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={newCat.label}
                  onChange={(e) => setNewCat(p => ({ ...p, label: e.target.value }))}
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: 'var(--white)', outline: 'none' }}
                />
                <button className="btn btn-primary btn-sm" onClick={handleAddCategory}>Criar</button>
              </div>
            </div>
          ) : null}
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {form.tipo === 'parcelado' ? `Criar ${form.parcelas} parcelas` : form.tipo === 'fixo' ? 'Salvar Gasto Fixo' : 'Salvar Gasto'}
          </button>
        </div>
      </div>
    </div>
  );
}

function IncomeModal({ members, onSave, onClose }) {
  const [form, setForm] = useState({
    person_id: members[0]?.id,
    description: 'Salário',
    amount: '',
    date: todayStr(),
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.description || !form.amount) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
  };
  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <h3>💰 Novo Ganho</h3>
        <div className="form-group">
          <label>Pessoa</label>
          <select
            value={form.person_id}
            onChange={(e) => set('person_id', e.target.value)}
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <input
            type="text"
            placeholder="Ex: Salário, Freelance..."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              placeholder="0,00"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Salvar Ganho
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    target: '',
    saved: '0',
    deadline: '',
    split: '50/50',
  });
  const [selEmoji, setSelEmoji] = useState('✈️');
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.name || !form.target) return;
    onSave({
      ...form,
      emoji: selEmoji,
      target: parseFloat(form.target),
      saved: parseFloat(form.saved || '0'),
    });
  };
  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <h3>🎯 Nova Meta</h3>
        <div className="form-group">
          <label>Ícone</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 6,
            }}
          >
            {GOAL_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setSelEmoji(e)}
                style={{
                  padding: 8,
                  background:
                    selEmoji === e ? 'var(--green-pale)' : 'var(--cream-dark)',
                  border:
                    selEmoji === e
                      ? '2px solid var(--green-light)'
                      : '1.5px solid var(--border)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Nome da meta</label>
          <input
            type="text"
            placeholder="Ex: Viagem para Europa"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Valor alvo (R$)</label>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={form.target}
              onChange={(e) => set('target', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Já guardado (R$)</label>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={form.saved}
              onChange={(e) => set('saved', e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Prazo</label>
            <input
              type="month"
              value={form.deadline}
              onChange={(e) => set('deadline', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Divisão</label>
            <select
              value={form.split}
              onChange={(e) => set('split', e.target.value)}
            >
              <option value="50/50">50% cada</option>
              <option value="60/40">60% Camila / 40% Rogério</option>
              <option value="40/60">40% Camila / 60% Rogério</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Criar Meta
          </button>
        </div>
      </div>
    </div>
  );
}

function DepositModal({ goal, onSave, onClose }) {
  const [amount, setAmount] = useState('');
  const handleSave = () => {
    const v = parseFloat(amount);
    if (!v || v <= 0) return;
    onSave(v);
  };
  const falta = Math.max(0, goal.target - goal.saved);
  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <h3>{goal.emoji} Depositar na Meta</h3>
        <p
          style={{ fontSize: 14, color: 'var(--text-soft)', marginBottom: 20 }}
        >
          <strong>{goal.name}</strong> · Faltam {fmt(falta)}
        </p>
        <div className="form-group">
          <label>Valor a depositar (R$)</label>
          <input
            type="number"
            placeholder="0,00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 16,
          }}
        >
          {[100, 200, 500, falta].map((v) => (
            <button
              key={v}
              className="btn btn-secondary btn-sm"
              onClick={() => setAmount(String(v))}
            >
              {fmtShort(v)}
            </button>
          ))}
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Depositar
          </button>
        </div>
      </div>
    </div>
  );
}
