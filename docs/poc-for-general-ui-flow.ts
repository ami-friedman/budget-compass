import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Tags, 
  PieChart, 
  ArrowLeftRight, 
  Menu, 
  X, 
  Plus, 
  MoreVertical,
  Edit2, 
  Trash2, 
  CreditCard, 
  PiggyBank, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw,
  ArrowRight,
  TrendingUp,
  Zap,
  CheckCircle2
} from 'lucide-react';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 mb-2 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} className="min-w-[20px]" />
    {!collapsed && <span className="ml-3 font-medium whitespace-nowrap">{label}</span>}
  </button>
);

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`bg-slate-900 border border-slate-700 w-full ${maxWidth} rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200`}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const ContextMenu = ({ x, y, onClose, onEdit, onDelete }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 w-40"
      style={{ top: y, left: x }}
    >
      <button 
        onClick={() => { onEdit(); onClose(); }}
        className="w-full flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
      >
        <Edit2 size={14} className="mr-2" /> Edit
      </button>
      <button 
        onClick={() => { onDelete(); onClose(); }}
        className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 transition-colors"
      >
        <Trash2 size={14} className="mr-2" /> Delete
      </button>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('Transactions');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Rent & Utilities', type: 'Monthly' },
    { id: 2, name: 'Emergency Fund', type: 'Saving' },
    { id: 3, name: 'Groceries', type: 'Monthly' },
    { id: 4, name: 'New Car Fund', type: 'Saving' },
    { id: 5, name: 'Dining Out', type: 'Cash' },
  ]);

  const [incomeSources, setIncomeSources] = useState([
    { id: 1, name: 'Main Salary' },
    { id: 2, name: 'Freelance' }
  ]);

  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Main Checking', balance: 4250.00, type: 'Monthly' },
    { id: 2, name: 'High Yield Savings', balance: 12800.50, type: 'Savings' },
    { id: 3, name: 'Credit Card', balance: -450.25, type: 'Monthly' },
  ]);

  const [budgetItems, setBudgetItems] = useState([
    { id: 1, categoryId: 1, amount: 1500 },
    { id: 2, categoryId: 2, amount: 500 },
    { id: 3, categoryId: 3, amount: 400 },
    { id: 4, categoryId: 4, amount: 200 },
    { id: 5, categoryId: 5, amount: 200 },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, categoryId: 1, amount: 1200.00, type: 'Expense', date: new Date().toISOString() },
    { id: 2, categoryId: 3, amount: 85.50, type: 'Expense', date: new Date().toISOString() },
    { id: 3, categoryId: 2, amount: 500.00, type: 'Fund', date: new Date().toISOString(), fromAccountId: 1 },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('category'); 
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    type: 'Monthly', 
    balance: '', 
    categoryId: '', 
    amount: '',
    transType: 'Expense',
    date: new Date().toISOString().split('T')[0],
    fromAccountId: '',
    toAccountId: ''
  });

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkItems, setBulkItems] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setEditingItem(item);
      if (type === 'budget') {
        setFormData({ categoryId: item.categoryId, amount: item.amount });
      } else if (type === 'transaction') {
        setFormData({ 
          categoryId: item.categoryId || '', 
          amount: item.amount, 
          transType: item.type,
          date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
          fromAccountId: item.fromAccountId || '',
          toAccountId: item.toAccountId || ''
        });
      } else if (type === 'income') {
        setFormData({ name: item.name });
      } else {
        setFormData({ 
          name: item.name, 
          type: item.type, 
          balance: item.balance !== undefined ? item.balance : '' 
        });
      }
    } else {
      setEditingItem(null);
      const initialCategoryId = categories.length > 0 ? categories[0].id : '';
      const initialAccountId = accounts.length > 0 ? accounts[0].id : '';
      setFormData({ 
        name: '', 
        type: 'Monthly', 
        balance: '0', 
        categoryId: initialCategoryId, 
        amount: '',
        transType: 'Expense',
        date: new Date().toISOString().split('T')[0],
        fromAccountId: initialAccountId,
        toAccountId: accounts.length > 1 ? accounts[1].id : initialAccountId
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenBulkFunding = () => {
    const items = budgetItems
      .map(bi => {
        const cat = categories.find(c => c.id === bi.categoryId);
        return { ...bi, categoryName: cat?.name, categoryType: cat?.type };
      })
      .filter(item => item.categoryType === 'Saving' || item.categoryType === 'Monthly')
      .map(item => ({
        ...item,
        selected: true,
        fromAccountId: accounts[0]?.id
      }));
    
    setBulkItems(items);
    setIsBulkModalOpen(true);
  };

  const executeBulkFunding = () => {
    const newTransactions = bulkItems
      .filter(item => item.selected)
      .map(item => ({
        id: Date.now() + Math.random(),
        categoryId: item.categoryId,
        amount: item.amount,
        type: 'Fund',
        date: new Date().toISOString(),
        fromAccountId: item.fromAccountId,
        toAccountId: null
      }));
    
    setTransactions([...transactions, ...newTransactions]);
    setIsBulkModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount) || 0;

    if (modalType === 'category') {
      if (editingItem) {
        setCategories(categories.map(c => c.id === editingItem.id ? { ...c, name: formData.name, type: formData.type } : c));
      } else {
        setCategories([...categories, { id: Date.now(), name: formData.name, type: formData.type }]);
      }
    } else if (modalType === 'income') {
      if (editingItem) {
        setIncomeSources(incomeSources.map(i => i.id === editingItem.id ? { ...i, name: formData.name } : i));
      } else {
        setIncomeSources([...incomeSources, { id: Date.now(), name: formData.name }]);
      }
    } else if (modalType === 'account') {
      const balanceNum = parseFloat(formData.balance) || 0;
      if (editingItem) {
        setAccounts(accounts.map(a => a.id === editingItem.id ? { ...a, name: formData.name, type: formData.type, balance: balanceNum } : a));
      } else {
        setAccounts([...accounts, { id: Date.now(), name: formData.name, type: formData.type, balance: balanceNum }]);
      }
    } else if (modalType === 'budget') {
      if (editingItem) {
        setBudgetItems(budgetItems.map(b => b.id === editingItem.id ? { ...b, categoryId: parseInt(formData.categoryId), amount: amountNum } : b));
      } else {
        setBudgetItems([...budgetItems, { id: Date.now(), categoryId: parseInt(formData.categoryId), amount: amountNum }]);
      }
    } else if (modalType === 'transaction') {
      const isTransfer = formData.transType === 'Transfer';
      const isFund = formData.transType === 'Fund';
      const transData = {
        id: editingItem ? editingItem.id : Date.now(),
        categoryId: isTransfer ? null : parseInt(formData.categoryId),
        amount: amountNum,
        type: formData.transType,
        date: isTransfer ? new Date().toISOString() : new Date(formData.date).toISOString(),
        fromAccountId: (isTransfer || isFund) ? parseInt(formData.fromAccountId) : null,
        toAccountId: isTransfer ? parseInt(formData.toAccountId) : null
      };
      if (editingItem) {
        setTransactions(transactions.map(t => t.id === editingItem.id ? transData : t));
      } else {
        setTransactions([...transactions, transData]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, type) => {
    if (type === 'category') {
      setCategories(categories.filter(c => c.id !== id));
    } else if (type === 'income') {
      setIncomeSources(incomeSources.filter(i => i.id !== id));
    } else if (type === 'account') {
      setAccounts(accounts.filter(a => a.id !== id));
    } else if (type === 'budget') {
      setBudgetItems(budgetItems.filter(b => b.id !== id));
    } else if (type === 'transaction') {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item, type });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const changeMonth = (offset) => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(next);
  };

  const enrichedBudgetItems = useMemo(() => budgetItems.map(item => {
    const category = categories.find(c => c.id === item.categoryId);
    return { ...item, categoryName: category?.name || 'Unknown', categoryType: category?.type || 'Other' };
  }), [budgetItems, categories]);

  const totals = useMemo(() => enrichedBudgetItems.reduce((acc, curr) => {
    const type = curr.categoryType;
    acc.total += curr.amount;
    if (type === 'Cash') acc.cash += curr.amount;
    if (type === 'Monthly') acc.monthly += curr.amount;
    if (type === 'Saving') acc.saving += curr.amount;
    return acc;
  }, { cash: 0, monthly: 0, saving: 0, total: 0 }), [enrichedBudgetItems]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transDate = new Date(t.date);
      const isSameMonth = transDate.getMonth() === currentDate.getMonth() && 
                          transDate.getFullYear() === currentDate.getFullYear();
      
      const category = categories.find(c => c.id === t.categoryId);
      const matchesSearch = t.type === 'Transfer' 
        ? "Transfer".toLowerCase().includes(searchQuery.toLowerCase())
        : category?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'All' || t.type === typeFilter;
      
      return isSameMonth && matchesSearch && matchesType;
    }).map(t => ({
      ...t,
      categoryName: t.type === 'Transfer' ? 'Account Transfer' : (categories.find(c => c.id === t.categoryId)?.name || 'N/A')
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, categories, currentDate, searchQuery, typeFilter]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Categories':
        return (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
                <p className="text-slate-400 text-sm">Organize your spending and saving buckets.</p>
              </div>
              <button onClick={() => handleOpenModal('category')} className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg font-medium">
                <Plus size={18} className="mr-2" /> Add Category
              </button>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-12">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
                    <th className="px-6 py-4 font-bold">Name</th>
                    <th className="px-6 py-4 font-bold">Type</th>
                    <th className="px-6 py-4 font-bold w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {categories.map((category) => (
                    <tr key={category.id} onContextMenu={(e) => handleContextMenu(e, category, 'category')} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-200 font-semibold">{category.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          category.type === 'Monthly' ? 'bg-purple-900/40 text-purple-300 border border-purple-800/50' : 
                          category.type === 'Saving' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50' : 
                          'bg-orange-900/40 text-orange-300 border border-orange-800/50'
                        }`}>
                          {category.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={(e) => handleContextMenu(e, category, 'category')} className="text-slate-500 hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp size={20} className="text-emerald-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">Income Sources</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {incomeSources.map(source => (
                  <div key={source.id} onContextMenu={(e) => handleContextMenu(e, source, 'income')} className="group relative bg-slate-900 border border-slate-800 hover:border-emerald-500/50 px-6 py-3 rounded-full flex items-center transition-all cursor-default shadow-sm hover:shadow-emerald-500/10">
                    <span className="text-slate-200 font-medium mr-4">{source.name}</span>
                    <button onClick={() => handleOpenModal('income', source)} className="text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Edit2 size={12} />
                    </button>
                  </div>
                ))}
                <button onClick={() => handleOpenModal('income')} className="bg-slate-800/50 border border-dashed border-slate-700 hover:border-blue-500 px-6 py-3 rounded-full flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-all group">
                  <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Add Source</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'Accounts':
        return (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Accounts</h1>
                <p className="text-slate-400">View and manage your financial accounts.</p>
              </div>
              <button onClick={() => handleOpenModal('account')} className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg">
                <Plus size={18} className="mr-2" /> Add Account
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div key={account.id} onContextMenu={(e) => handleContextMenu(e, account, 'account')} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all group shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${account.type === 'Savings' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {account.type === 'Savings' ? <PiggyBank size={24} /> : <CreditCard size={24} />}
                    </div>
                    <button onClick={(e) => handleContextMenu(e, account, 'account')} className="text-slate-600 hover:text-white p-1"><MoreVertical size={18} /></button>
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">{account.name}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-3xl font-bold ${account.balance < 0 ? 'text-red-400' : 'text-white'}`}>{formatCurrency(account.balance)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Budget':
        return (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">Monthly Budget</h1>
                <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 rounded-lg p-2 w-fit">
                   <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-800 rounded text-slate-400"><ChevronLeft size={20} /></button>
                   <span className="text-slate-200 font-semibold min-w-[140px] text-center">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                   <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-800 rounded text-slate-400"><ChevronRight size={20} /></button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
                </div>
                <button onClick={() => handleOpenModal('budget')} className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg w-full sm:w-auto justify-center"><Plus size={18} className="mr-2" /> Add Budget Item</button>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-300 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold text-right">Budgeted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {enrichedBudgetItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 text-slate-200 font-medium">{item.categoryName}</td>
                      <td className="px-6 py-4 text-right text-white font-bold">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Cash</p>
                <p className="text-xl font-bold text-orange-400">{formatCurrency(totals.cash)}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Monthly</p>
                <p className="text-xl font-bold text-purple-400">{formatCurrency(totals.monthly)}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Savings</p>
                <p className="text-xl font-bold text-emerald-400">{formatCurrency(totals.saving)}</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Total</p>
                <p className="text-2xl font-black text-white">{formatCurrency(totals.total)}</p>
              </div>
            </div>
          </div>
        );

      case 'Transactions':
        return (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">Transactions</h1>
                <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 rounded-lg p-2 w-fit">
                   <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-800 rounded text-slate-400 transition-colors"><ChevronLeft size={20} /></button>
                   <div className="flex items-center space-x-2 text-slate-200 font-semibold min-w-[140px] justify-center">
                     <Calendar size={16} className="text-blue-400" />
                     <span>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                   </div>
                   <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-800 rounded text-slate-400 transition-colors"><ChevronRight size={20} /></button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
                </div>
                
                <button 
                  onClick={handleOpenBulkFunding}
                  className="flex items-center bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg justify-center whitespace-nowrap transition-all"
                  title="Bulk fund savings from your budget"
                >
                  <Zap size={18} className="mr-2 fill-current" /> Auto-Fund
                </button>

                <button onClick={() => handleOpenModal('transaction')} className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg justify-center whitespace-nowrap transition-all"><Plus size={18} className="mr-2" /> New Transaction</button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                <div className="flex items-center space-x-2">
                   <Filter size={14} className="text-slate-500" />
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filter By</span>
                </div>
                <div className="flex space-x-2">
                  {['All', 'Expense', 'Fund', 'Transfer'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter transition-all ${typeFilter === t ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/30 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-800/50">
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold text-right">Amount</th>
                    <th className="px-6 py-4 font-semibold w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((item) => (
                      <tr key={item.id} onContextMenu={(e) => handleContextMenu(e, item, 'transaction')} className="group hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 text-slate-400 text-sm whitespace-nowrap">{new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</td>
                        <td className="px-6 py-4 text-slate-200 font-medium">{item.categoryName}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {item.type === 'Expense' && <ArrowUpRight size={14} className="mr-1.5 text-red-400" />}
                            {item.type === 'Fund' && <ArrowDownLeft size={14} className="mr-1.5 text-emerald-400" />}
                            {item.type === 'Transfer' && <RefreshCcw size={14} className="mr-1.5 text-blue-400" />}
                            <span className="text-slate-400 text-xs font-medium uppercase tracking-tighter">{item.type}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-right font-bold text-lg ${item.type === 'Expense' ? 'text-slate-200' : 'text-emerald-400'}`}>
                          {item.type === 'Expense' ? '-' : '+'}{formatCurrency(item.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal('transaction', item)} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(item.id, 'transaction')} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center text-slate-500 italic">No transactions found for this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
            <div className="bg-slate-900 p-6 rounded-full mb-4"><LayoutDashboard size={48} /></div>
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">{activeTab} Page</h2>
            <p>Component is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-blue-900/40">V</div>
              <span className="text-xl font-bold tracking-tight">Vaultly</span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"><Menu size={20} /></button>
        </div>
        <nav className="flex-1 px-4 mt-4">
          {[{ id: 'Dashboard', icon: LayoutDashboard }, { id: 'Accounts', icon: Wallet }, { id: 'Categories', icon: Tags }, { id: 'Budget', icon: PieChart }, { id: 'Transactions', icon: ArrowLeftRight }].map((item) => (
            <SidebarItem key={item.id} icon={item.icon} label={item.id} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} collapsed={sidebarCollapsed} />
          ))}
        </nav>
      </aside>

      <main className="flex-1 relative overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
        {renderContent()}
      </main>

      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} onEdit={() => handleOpenModal(contextMenu.type, contextMenu.item)} onDelete={() => handleDelete(contextMenu.item.id, contextMenu.type)} />}

      {/* Main Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${editingItem ? 'Edit' : 'New'} ${modalType === 'income' ? 'Income Source' : modalType === 'transaction' ? 'Transaction' : modalType === 'account' ? 'Account' : modalType === 'budget' ? 'Budget' : 'Category'}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalType === 'transaction' && (
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Transaction Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Expense', 'Fund', 'Transfer'].map((type) => (
                      <button key={type} type="button" onClick={() => setFormData({ ...formData, transType: type })} className={`py-2 text-xs font-bold rounded-lg border transition-all ${formData.transType === type ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>{type}</button>
                    ))}
                  </div>
                </div>

                {formData.transType === 'Transfer' ? (
                  <div className="grid grid-cols-1 gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">From Account</label>
                      <select value={formData.fromAccountId} onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white">
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-center -my-2"><div className="bg-slate-700 p-1.5 rounded-full border border-slate-600"><ArrowRight size={14} className="text-slate-400 rotate-90" /></div></div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">To Account</label>
                      <select value={formData.toAccountId} onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white">
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                      <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                    
                    {formData.transType === 'Fund' && (
                      <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Source Account</label>
                        <select value={formData.fromAccountId} onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white">
                          {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                      <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input required type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white" placeholder="0.00" />
                  </div>
                </div>
            </div>
          )}

          {modalType === 'budget' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input required type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white" placeholder="0.00" />
                </div>
              </div>
            </>
          )}

          {(modalType === 'category' || modalType === 'account' || modalType === 'income') && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input autoFocus required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              {modalType === 'account' && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Balance</label>
                  <input required type="number" step="0.01" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
              )}
              {modalType !== 'income' && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                    <option value="Monthly">Monthly</option>
                    <option value="Saving">Saving</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              )}
            </>
          )}

          <div className="flex space-x-3 pt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-700 rounded-lg text-slate-300">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white font-bold">{editingItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Bulk Funding Modal */}
      <Modal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        title="Auto-Fund Budget" 
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4 flex items-start space-x-3">
             <Zap className="text-blue-400 shrink-0 mt-0.5" size={18} />
             <p className="text-sm text-blue-200">This will create funding transactions for your savings categories based on your current budget. Review the amounts and source accounts below.</p>
          </div>

          <div className="space-y-3">
            {bulkItems.map((item, idx) => (
              <div key={item.id} className={`p-4 rounded-xl border transition-all ${item.selected ? 'bg-slate-800/50 border-slate-600' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => {
                        const newItems = [...bulkItems];
                        newItems[idx].selected = !newItems[idx].selected;
                        setBulkItems(newItems);
                      }}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${item.selected ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-500'}`}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <div>
                      <h4 className="text-white font-bold">{item.categoryName}</h4>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{item.categoryType}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-white">{formatCurrency(item.amount)}</span>
                  </div>
                </div>

                {item.selected && (
                  <div className="flex items-center space-x-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Source Account:</label>
                    <select 
                      value={item.fromAccountId}
                      onChange={(e) => {
                        const newItems = [...bulkItems];
                        newItems[idx].fromAccountId = parseInt(e.target.value);
                        setBulkItems(newItems);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-4 border-t border-slate-800">
            <button onClick={() => setIsBulkModalOpen(false)} className="flex-1 px-4 py-3 border border-slate-700 rounded-lg text-slate-300 font-bold">Review Later</button>
            <button 
              onClick={executeBulkFunding}
              disabled={!bulkItems.some(i => i.selected)}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg text-white font-black shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center"
            >
              <Zap size={18} className="mr-2 fill-current" /> Confirm & Execute
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}