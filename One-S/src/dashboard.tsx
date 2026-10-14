import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Bell, User, Grid, Bookmark, Calendar, FileText, Briefcase, 
  Sparkles, HelpCircle, Layers, ChevronRight, Mic, CheckCircle2, 
  ArrowUpRight, X, Clock, Award, Shield, DollarSign, 
  Coffee, Globe, Cpu, ChevronDown, Check, Info, 
  MessageSquare, Sliders, Laptop, HeartPulse, FileCheck,
  BookOpen, AlertTriangle, Headphones, Send, RefreshCw, Bot, LogOut
} from 'lucide-react';
import { useUserProfile } from './auth/UserProfile';

const ALL_APPS = [
  // My Work (67)
  { id: 'app-1', title: 'Submit Timesheet', category: 'My Work', icon: Clock, favorite: true, badge: 'Required', desc: 'Log weekly project & task hours' },
  { id: 'app-2', title: 'View Timesheet', category: 'My Work', icon: FileText, favorite: true, desc: 'Review past attendance and log approvals' },
  { id: 'app-3', title: 'Work Scheduler', category: 'My Work', icon: Calendar, favorite: true, desc: 'Rosters and team duty allocations' },
  { id: 'app-4', title: 'View Assignments', category: 'My Work', icon: Briefcase, favorite: false, desc: 'Active project allocations and billing codes' },
  { id: 'app-5', title: 'Associate 360', category: 'My Work', icon: User, favorite: true, badge: 'Core', desc: 'Comprehensive employee profile and achievements' },
  { id: 'app-6', title: 'IAspire', category: 'My Work', icon: Award, favorite: true, badge: 'H2 Active', desc: 'Manage deliverables and performance goals' },
  { id: 'app-7', title: 'Project General Info', category: 'My Work', icon: Info, favorite: false, desc: 'Departmental project status & approvers' },
  { id: 'app-8', title: 'Quick Assignment Modification', category: 'My Work', icon: Sliders, favorite: false, desc: 'Request role or project tag updates' },
  { id: 'app-9', title: 'MyTime', category: 'My Work', icon: Clock, favorite: true, desc: 'Real-time swipe logs and work hours tracking' },

  // My Benefits (15) & HR
  { id: 'app-10', title: 'Apply Leave - India', category: 'My Benefits', icon: Mic, favorite: true, badge: 'AI Voice', modal: 'leave', desc: 'Smart leave application with speech-to-text' },
  { id: 'app-11', title: 'Download Payslip', category: 'My Benefits', icon: DollarSign, favorite: true, desc: 'Download monthly salary slips & Form 16' },
  { id: 'app-12', title: 'View Leave Balance', category: 'My Benefits', icon: Calendar, favorite: true, desc: 'Check casual, earned, and medical leave credits' },
  { id: 'app-13', title: 'Medical Insurance', category: 'My Benefits', icon: Shield, favorite: false, desc: 'Group health policy card & claims' },
  { id: 'app-14', title: 'MyRewards', category: 'My Benefits', icon: Award, favorite: false, desc: 'Peer recognition points and gift redemptions' },
  { id: 'app-15', title: 'Employee Assistance Program (EAP)', category: 'My Benefits', icon: HeartPulse, favorite: false, desc: '24/7 mental wellness and counselling support' },

  // My Career (6) & Learning
  { id: 'app-16', title: 'My Learning', category: 'My Career', icon: BookOpen, favorite: true, desc: 'Digital Practice skill pathways & certifications' },
  { id: 'app-17', title: 'e-Letters', category: 'My Career', icon: FileCheck, favorite: false, desc: 'Download bonafide, experience, and promotion letters' },
  { id: 'app-18', title: 'Competency Update', category: 'My Career', icon: Cpu, favorite: false, desc: 'Update tech stacks and digital capabilities' },
  { id: 'app-19', title: 'Role Development Plan', category: 'My Career', icon: Sparkles, favorite: false, desc: 'Career pathing and leadership roadmap' },

  // MyService Portal (64) & Utilities
  { id: 'app-20', title: 'Manage Assets', category: 'MyService Portal', icon: Laptop, favorite: true, desc: 'Track laptop, monitor, and software licenses' },
  { id: 'app-21', title: 'ACure / Remediate Asset Issues', category: 'MyService Portal', icon: Headphones, favorite: true, modal: 'acure', desc: 'Self-resolution for device technical issues' },
  { id: 'app-22', title: 'Report Incidents', category: 'MyService Portal', icon: HelpCircle, favorite: false, desc: 'Raise IT, network, or hardware tickets' },
  { id: 'app-23', title: 'Visitor Management System', category: 'Utilities', icon: User, favorite: false, desc: 'Pre-register guests and VIP delegates' },

  // News, Info & Dashboard (Alphabetical Index entries)
  { id: 'app-24', title: 'AI Builder Hub', category: 'News & Info', icon: Sparkles, favorite: true, badge: 'GenAI', desc: 'SRM enterprise LLM and automation suite' },
  { id: 'app-25', title: 'IdeaX', category: 'News & Info', icon: Globe, favorite: false, desc: 'Innovation submission portal' },
  { id: 'app-26', title: 'On-Boarding', category: 'Directory', icon: User, favorite: false, desc: 'New joiner onboarding checklists' },
  { id: 'app-27', title: 'HCM', category: 'Directory', icon: Layers, favorite: false, desc: 'Core human capital management portal' },
  { id: 'app-28', title: 'PRISM', category: 'Directory', icon: Cpu, favorite: false, desc: 'Project risk and metric tracker' },
  { id: 'app-29', title: 'Outreach', category: 'Directory', icon: HeartPulse, favorite: false, desc: 'CSR and community volunteering' },
  { id: 'app-30', title: 'Visitor Management System', category: 'Directory', icon: User, favorite: false, desc: 'Passes for campus visitors' },
  { id: 'app-31', title: 'TSmart', category: 'Directory', icon: Laptop, favorite: false, desc: 'Time & productivity telemetry' },
];

const CATEGORIES = [
  { name: 'My Work', count: 67 },
  { name: 'My Benefits', count: 15 },
  { name: 'My Career', count: 6 },
  { name: 'MyService Portal', count: 64 },
  { name: 'Utilities', count: 24 },
  { name: 'News & Info', count: 12 },
  { name: 'About Me', count: 7 },
  { name: 'Dashboard', count: 34 },
];

const ALPHABET = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

const SrmTechLogo = () => (
  <div className="flex items-center space-x-2">
    {/* OneSRM SRM Tech Typography */}
    <div className="flex flex-col leading-none">
      <div className="flex items-center font-bold tracking-tight text-xl">
        <span className="bg-blue-600 text-white font-black px-1.5 py-0.5 rounded text-xs mr-1.5 shadow-sm border border-blue-400/50 inline-flex items-center justify-center leading-none">OneSRM</span>
        <span className="text-white font-extrabold">SRM</span>
        <span className="text-cyan-400 font-bold ml-0.5">Tech</span>
      </div>
      <div className="flex items-center space-x-1 text-[7.5px] font-semibold text-slate-300 tracking-wider mt-0.5">
        <span className="h-[1px] w-2 bg-slate-500 inline-block"></span>
        <span className="lowercase font-mono text-slate-300">ideas@work</span>
        <span className="h-[1px] w-2 bg-slate-500 inline-block"></span>
      </div>
    </div>
  </div>
);

// ===================== oneSRM ASSISTANT (CHATBOT) =====================
type PortalApp = typeof ALL_APPS[number];

type ChatAction = { label: string; app?: PortalApp; modal?: string };

type ChatMessage = {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: string;
  actions?: ChatAction[];
};

const CHAT_SUGGESTIONS = ['Apply leave', 'Download payslip', 'Submit timesheet', 'Laptop issue', 'Leave balance'];

const findApp = (id: string) => ALL_APPS.find(a => a.id === id)!;

const chatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Rule-based replies for the prototype; swap for a real assistant API later.
const getBotReply = (input: string): Pick<ChatMessage, 'text' | 'actions'> => {
  const q = input.toLowerCase();

  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(q)) {
    return { text: 'Hello! I can help you find apps, apply for leave, fix device issues and more. What do you need?' };
  }
  if (/leave balance|balance/.test(q)) {
    return {
      text: 'You have 8 Earned, 4 Casual and 6 Medical leave days available for 2026.',
      actions: [{ label: 'View Leave Balance', app: findApp('app-12') }, { label: 'Apply Leave', modal: 'leave' }],
    };
  }
  if (/leave|vacation|time off|holiday/.test(q)) {
    return {
      text: 'I can open the Voice AI Leave Assistant — just speak or type your dates and reason.',
      actions: [{ label: 'Apply Leave with Voice AI', modal: 'leave' }, { label: 'Check Leave Balance', app: findApp('app-12') }],
    };
  }
  if (/payslip|salary|form ?16|pay/.test(q)) {
    return {
      text: 'Your September 2026 payslip is ready. You can also download Form 16 from the same page.',
      actions: [{ label: 'Download Payslip', app: findApp('app-11') }],
    };
  }
  if (/timesheet|hours|log time/.test(q)) {
    return {
      text: 'Your timesheet for this week is due Friday. Want to submit it now?',
      actions: [{ label: 'Submit Timesheet', app: findApp('app-1') }, { label: 'View Timesheet', app: findApp('app-2') }],
    };
  }
  if (/laptop|device|asset|slow|wifi|vpn|issue|not working/.test(q)) {
    return {
      text: 'ACure can diagnose and auto-fix most device issues in under 2 minutes. Shall I start a scan?',
      actions: [{ label: 'Run ACure Diagnostics', modal: 'acure' }, { label: 'Report Incident', app: findApp('app-22') }],
    };
  }
  if (/profile|360|my details/.test(q)) {
    return { text: 'Here is your Associate 360 profile.', actions: [{ label: 'Open Associate 360', modal: 'profile' }] };
  }

  const words = q.split(/\s+/).filter(w => w.length > 2);
  const matches = ALL_APPS.filter(a =>
    words.some(w => a.title.toLowerCase().includes(w) || a.desc.toLowerCase().includes(w))
  ).slice(0, 3);
  if (matches.length) {
    return {
      text: `I found ${matches.length} app${matches.length > 1 ? 's' : ''} that might help:`,
      actions: matches.map(app => ({ label: app.title, app })),
    };
  }
  return { text: "Sorry, I couldn't find that. Try one of these, or rephrase your question." };
};

const ChatAssistant = ({ firstName, onAction }: { firstName: string; onAction: (action: ChatAction) => void }) => {
  const welcome = (): ChatMessage => ({
    id: 0,
    from: 'bot',
    text: `Hi ${firstName}! 👋 I'm your oneSRM Assistant. Ask me about leave, payslips, timesheets, IT issues or any portal app.`,
    time: chatTime(),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [welcome()]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    setMessages(m => [...m, { id: nextId.current++, from: 'user', text: trimmed, time: chatTime() }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { id: nextId.current++, from: 'bot', time: chatTime(), ...getBotReply(trimmed) }]);
      setIsTyping(false);
    }, 700 + Math.random() * 500);
  };

  const reset = () => {
    setMessages([welcome()]);
    setIsTyping(false);
  };

  const showSuggestions = !isTyping && messages[messages.length - 1]?.from === 'bot' && !messages[messages.length - 1]?.actions;

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="oneSRM Assistant"
          className="fixed z-[45] bottom-24 right-3 left-3 sm:left-auto sm:right-6 sm:w-[380px] h-[min(560px,calc(100vh-8rem))] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0b1329] via-blue-950 to-indigo-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-blue-400/40 shadow">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0b1329] rounded-full"></span>
              </div>
              <div className="leading-tight">
                <p className="font-bold text-sm">oneSRM Assistant</p>
                <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI powered • Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button onClick={reset} title="New conversation" className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} title="Minimize" className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[78%] flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${msg.from === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' : 'bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-md'}`}>
                    {msg.text}
                  </div>
                  {msg.actions && (
                    <div className="mt-2 flex flex-col gap-1.5 w-full">
                      {msg.actions.map(action => {
                        const Icon = action.app?.icon ?? (action.modal === 'leave' ? Mic : action.modal === 'acure' ? Laptop : User);
                        return (
                          <button
                            key={action.label}
                            onClick={() => onAction(action)}
                            className="flex items-center gap-2 text-left text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-400 px-3 py-2 rounded-xl transition group"
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="flex-1">{action.label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5 pl-9">
                {CHAT_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-700 px-2.5 py-1 rounded-full transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={e => { e.preventDefault(); send(input); }}
            className="border-t border-slate-200 bg-white p-3 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about oneSRM..."
              className="flex-1 text-sm bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              title="Send"
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 pb-2 bg-white">AI responses may be inaccurate. Verify important details.</p>
        </div>
      )}

      {/* Launcher button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close assistant' : 'Open oneSRM Assistant'}
        className="fixed z-[45] bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group border border-blue-400/40"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && hasUnread && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>
        )}
        {!isOpen && (
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
            Need help? Ask oneSRM Assistant
          </span>
        )}
      </button>
    </>
  );
};

export default function App() {
  const { profile: USER_PROFILE, signOut } = useUserProfile();
  const [activeTab, setActiveTab] = useState('news'); // 'news' | 'actions' | 'corner' | 'apps'
  const [subTab, setSubTab] = useState('activities'); // 'activities' | 'agents'
  const [selectedCategory, setSelectedCategory] = useState('My Work');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  
  // Modals & Drawers state
  const [activeModal, setActiveModal] = useState<string|null>(null); // 'leave' | 'acure' | 'profile' | null
  const [isRecording, setIsRecording] = useState(false);
  const [leaveVoiceText, setLeaveVoiceText] = useState('');
  const [leaveDates, setLeaveDates] = useState({ start: '2026-10-12', end: '2026-10-14' });
  const [toastMessage, setToastMessage] = useState<string|null>(null);

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return ALL_APPS.filter(app => {
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeTab !== 'apps' || selectedCategory === 'All' || app.category === selectedCategory || selectedLetter !== 'All';
      const matchesLetter = selectedLetter === 'All' || app.title.toUpperCase().startsWith(selectedLetter);
      const matchesFav = !favoritesOnly || app.favorite;
      return matchesSearch && matchesCategory && matchesLetter && matchesFav;
    });
  }, [searchQuery, selectedCategory, selectedLetter, favoritesOnly, activeTab]);

  const triggerToast = (msg:any) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVoiceTrigger = (text:string) => {
    setIsRecording(true);
    setLeaveVoiceText('Listening and parsing request...');
    setTimeout(() => {
      setIsRecording(false);
      setLeaveVoiceText(text);
      triggerToast('AI speech recognition matched: ' + text);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col selection:bg-blue-600 selection:text-white relative">
      
      {/* Header */}
      <header className="bg-[#0b1329] text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Brand Logo - SRM Tech */}
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('news')}>
              <SrmTechLogo />
            </div>

            {/* Main Tabs Navigation */}
            <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium">
              <button 
                onClick={() => setActiveTab('news')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'news' ? 'bg-blue-600/30 text-blue-300 font-semibold border-b-2 border-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
              >
                News & Info
              </button>
              <button 
                onClick={() => setActiveTab('actions')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'actions' ? 'bg-blue-600/30 text-blue-300 font-semibold border-b-2 border-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
              >
                My actions
              </button>
              <button 
                onClick={() => setActiveTab('corner')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'corner' ? 'bg-blue-600/30 text-blue-300 font-semibold border-b-2 border-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
              >
                My corner
              </button>
              <button 
                onClick={() => setActiveTab('apps')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'apps' ? 'bg-blue-600/30 text-blue-300 font-semibold border-b-2 border-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
              >
                Apps & activities
              </button>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => triggerToast('You have 2 pending approval actions.')}
                className="relative p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                  2
                </span>
              </button>

              <button 
                onClick={() => triggerToast('Feedback module open.')}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition hidden sm:block"
                title="Feedback"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <div 
                onClick={() => setActiveModal('profile')}
                className="flex items-center space-x-2 pl-2 border-l border-slate-700 cursor-pointer hover:opacity-90 transition"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${USER_PROFILE.avatarBg} text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-400/50`}>
                  {USER_PROFILE.initials}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-100 leading-tight">{USER_PROFILE.name}</p>
                  <p className="text-[10px] text-blue-300 leading-none">{[USER_PROFILE.empId, USER_PROFILE.department].filter(Boolean).join(' • ')}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </div>
            </div>

          </div>
        </div>
      </header>

      {}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ===================== TAB 1: NEWS & INFO ===================== */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Hero Banner with Search Bar & Quick Tags */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Welcome {USER_PROFILE.name.split(' ')[0]}!
                  </h1>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-md flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Safety & Security
                  </span>
                </div>
                <p className="text-blue-100 text-sm mb-6">
                  Access your enterprise tools, learning pathways, and Group news.
                </p>

                {/* Big Search Input */}
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type and press Enter to search (e.g., Timesheet, Leave, Payslip)..."
                    className="w-full bg-white text-slate-900 rounded-xl pl-11 pr-24 py-3.5 text-sm font-medium shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-slate-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <button 
                      onClick={() => setActiveModal('leave')}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                      title="Voice Search"
                    >
                      <Mic className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* Quick Shortcuts Chips */}
                <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold">
                  <button onClick={() => setActiveModal('leave')} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg border border-white/20 transition flex items-center gap-1">
                    MyHR <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button onClick={() => triggerToast('Opening AI Builder Hub...')} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg border border-white/20 transition flex items-center gap-1">
                    AI Builder Hub <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button onClick={() => setActiveTab('apps')} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg border border-white/20 transition flex items-center gap-1">
                    View Assignments <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button onClick={() => setActiveModal('acure')} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg border border-white/20 transition flex items-center gap-1">
                    Manage Assets <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button onClick={() => triggerToast('IdeaX innovation hub opened.')} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg border border-white/20 transition flex items-center gap-1">
                    IdeaX<ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>

            {/* News Cards & Video Grid (Matching Image 5) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" /> Featured Communications & Leadership Updates
                </h2>
                <button onClick={() => triggerToast('Loading older archives...')} className="text-xs text-blue-600 hover:underline font-semibold">
                  View all news
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* News Card 1 */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-36 bg-slate-900 relative flex items-center justify-center p-4">
                    <div className="text-center text-white">
                      <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest">SRM Group</p>
                      <p className="text-sm font-bold mt-1">Career and Leadership Development Week</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">Career and Leadership Development Week: Build your skills, lead the future</h3>
                    <p className="text-xs text-slate-500 mt-2">Special sessions for Digital Practice employees starting October 2026.</p>
                    <button onClick={() => triggerToast('Opening article details...')} className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      Read more <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* News Card 2 */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-36 bg-gradient-to-br from-slate-800 to-indigo-900 relative flex items-center justify-center p-4">
                    <div className="text-center text-white">
                      <Shield className="w-8 h-8 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs font-bold">Cybersecurity Awareness Month</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">Cybersecurity Awareness Month — Use AI without putting data at risk</h3>
                    <p className="text-xs text-slate-500 mt-2">Generative AI boosts productivity safely within SRM enterprise guardrails.</p>
                    <button onClick={() => triggerToast('Opening Security Guidelines...')} className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      Read more <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* News Card 3 */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-36 bg-gradient-to-br from-blue-900 to-slate-900 relative flex items-center justify-center p-4">
                    <div className="text-center text-white">
                      <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                      <p className="text-xs font-bold">Let's Talk AI Builder</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">Let's talk AI Builder: Your move towards enterprise productivity</h3>
                    <p className="text-xs text-slate-500 mt-2">Discover how Digital Practice builds automated workflows with zero coding.</p>
                    <button onClick={() => triggerToast('Opening AI Builder tutorial...')} className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      Read more <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* News Card 4 */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-36 bg-slate-900 relative flex items-center justify-center p-4">
                    <div className="text-center text-white">
                      <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Leadership Speak</p>
                      <p className="text-sm font-bold mt-1">The Threat is Scaling: Cyber Resilience</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">The threat is scaling. So are we — Cybersecurity insights for 2026</h3>
                    <p className="text-xs text-slate-500 mt-2">Key notes from Chief Security Officer on AI threats.</p>
                    <button onClick={() => triggerToast('Opening Video Keynote...')} className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      Read more <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Resources Section (Matching Image 6 bottom bar) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Quick Resources & Utilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> Get Help & Emergency
                  </p>
                  <p className="text-slate-500 mt-1">Emergency SOS (India): <strong className="text-slate-800">1800-425-776</strong></p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <Calendar className="w-4 h-4 text-blue-600" /> Upcoming Holidays
                  </p>
                  <p className="text-slate-600 font-semibold mt-1">Diwali / Balipadyami</p>
                  <p className="text-slate-400">Regional • Nov 10, Tue</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <Globe className="w-4 h-4 text-indigo-600" /> Important Links
                  </p>
                  <p className="text-blue-600 hover:underline cursor-pointer mt-1 font-medium" onClick={() => triggerToast('Opening Work Location map...')}>
                    Work Location & Campus Shuttle
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <Clock className="w-4 h-4 text-emerald-600" /> Global Clock
                  </p>
                  <div className="flex items-center justify-between mt-1 text-slate-600">
                    <span>IST (Coimbatore)</span>
                    <strong className="text-slate-900">3:57 PM</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ===================== TAB 2: MY ACTIONS ===================== */}
        {activeTab === 'actions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">My Actions & Approvals</h2>
                  <p className="text-xs text-slate-500">Action items requiring attention for Marisamy Pandarasamy (Emp ID: A3688)</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  2 Pending
                </span>
              </div>

              <div className="space-y-3">
                
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-500 text-white rounded-lg mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Weekly Timesheet Submission (Week 41)</h4>
                      <p className="text-xs text-slate-600">Digital Practice • Project Code: PRJ-9012 (Enterprise Cloud Modernization)</p>
                      <p className="text-[11px] text-amber-700 font-semibold mt-1">Due by Friday, 5:00 PM</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerToast('Timesheet submitted successfully!')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shrink-0"
                  >
                    Submit Timesheet
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg mt-0.5">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">IAspire Deliverable Sign-off (H2)</h4>
                      <p className="text-xs text-slate-600">Review deliverables notes for Digital Practice capability milestones.</p>
                      <p className="text-[11px] text-slate-500 mt-1">Assigned by Reporting Manager</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerToast('Opening IAspire deliverable notes...')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition shrink-0"
                  >
                    Review Deliverables
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: MY CORNER ===================== */}
        {activeTab === 'corner' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">My Corner</h2>
                <p className="text-xs text-slate-500">Personal information, benefits, performance, and taxation overview</p>
              </div>
              <button 
                onClick={() => setActiveModal('profile')}
                className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Update My Info
              </button>
            </div>

            {/* 3-Column Layout Matching Screenshots 3 & 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1: Benefits & Wellbeing */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="bg-[#0b1329] text-white px-4 py-3 font-bold text-sm">
                    Benefits and Wellbeing
                  </div>
                  <div className="p-4 space-y-3">
                    
                    <div onClick={() => triggerToast('Opening MyRewards...')} className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-800">MyRewards</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    <div onClick={() => triggerToast('Opening Medical Insurance portal...')} className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800">Medical Insurance</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    <div onClick={() => triggerToast('Opening EAP counselling...')} className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <HeartPulse className="w-5 h-5 text-rose-500" />
                        <span className="text-xs font-bold text-slate-800">Employee Assistance Program (EAP)</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    <div onClick={() => triggerToast('Opening Health Program...')} className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Coffee className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800">SRM Health Program</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/80">
                  <button onClick={() => triggerToast('Important Links Accordion Opened')} className="w-full text-xs font-semibold text-slate-600 flex items-center justify-between">
                    <span>Important links/Resources</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Column 2: My Info */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="bg-[#0b1329] text-white px-4 py-3 font-bold text-sm">
                    My Info
                  </div>
                  <div className="p-4 space-y-3">
                    
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center space-x-2 text-slate-500 mb-1">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-800">Personal Information Summary</span>
                      </div>
                      <p className="text-slate-600">Name: <strong className="text-slate-900">{USER_PROFILE.name}</strong></p>
                      <p className="text-slate-600">Emp ID: <strong className="text-slate-900">{USER_PROFILE.empId || '—'}</strong></p>
                      <p className="text-slate-600">Department: <strong className="text-slate-900">{USER_PROFILE.department || '—'}</strong></p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center space-x-2 text-slate-500 mb-1">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-slate-800">Birth Details</span>
                      </div>
                      <p className="text-slate-600">Registered in Enterprise HRMS</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center space-x-2 text-slate-500 mb-1">
                        <HeartPulse className="w-4 h-4 text-red-500" />
                        <span className="font-bold text-slate-800">Blood Group Information</span>
                      </div>
                      <p className="text-slate-600">Blood Group: <strong className="text-slate-900">O +ve (Verified)</strong></p>
                    </div>

                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-2">
                  <button onClick={() => setActiveModal('profile')} className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition">
                    Update My Info
                  </button>
                </div>
              </div>

              {/* Column 3: Remediate Asset Issues & IAspire */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="bg-[#0b1329] text-white px-4 py-3 font-bold text-sm">
                    Remediate Asset Issues
                  </div>
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-200">
                      <Laptop className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800">Self-resolution for device technical issues</h4>
                    <p className="text-xs text-slate-500 mt-2">Diagnose Wi-Fi, VPN, OS compliance, and hardware health automatically.</p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/80">
                  <button onClick={() => setActiveModal('acure')} className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition">
                    ACure Diagnostic Tool
                  </button>
                </div>
              </div>

            </div>

            {/* Row 2: IAspire, Learning & Taxation (Matching Screenshot 4) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* IAspire Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="bg-[#0b1329] text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-block mb-3">
                  IAspire
                </div>
                <div className="text-center py-4">
                  <Award className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Manage and add notes to H2 deliverables</p>
                </div>
                <button onClick={() => triggerToast('IAspire loaded.')} className="w-full mt-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition">
                  IAspire Portal
                </button>
              </div>

              {/* Learning Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="bg-[#0b1329] text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-block mb-3">
                  Learning
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-slate-700">External Certifications</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-slate-700">Role Development Plan</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-slate-700">Acquire New Skills</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button onClick={() => triggerToast('My Career opened')} className="py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition">
                    My Career
                  </button>
                  <button onClick={() => triggerToast('My Learning opened')} className="py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition">
                    My Learning
                  </button>
                </div>
              </div>

              {/* Taxation Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="bg-[#0b1329] text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-block mb-3">
                  Taxation
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Download Form 16</h5>
                    <p className="text-[10px] text-slate-500">Financial Year 2025-26 Statement</p>
                  </div>
                </div>
                <button onClick={() => triggerToast('Downloading Form 16 PDF...')} className="w-full py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition">
                  Explore Finances & Taxes
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ===================== TAB 4: APPS & ACTIVITIES ===================== */}
        {activeTab === 'apps' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Sub-tabs & Switcher (Exact replica of Cognizant UI in Photo 1 & 2) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSubTab('activities')}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition ${subTab === 'activities' ? 'bg-[#0b1329] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Activities
                  </button>
                  <button 
                    onClick={() => setSubTab('agents')}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${subTab === 'agents' ? 'bg-[#0b1329] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Agents & GenAI
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setFavoritesOnly(!favoritesOnly)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${favoritesOnly ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
                    Starred Apps
                  </button>
                </div>
              </div>

              {/* Category Pills (My Work 67, My Benefits 15, My Career 6...) */}
              {subTab === 'activities' && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => { setSelectedCategory(cat.name); setSelectedLetter('All'); }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${selectedCategory === cat.name && selectedLetter === 'All' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Application Cards Grid (Primary Activities) */}
            {subTab === 'activities' && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-semibold px-1">
                  <span>Category: <strong>{selectedCategory}</strong> • Showing {filteredApps.length} applications</span>
                  {selectedLetter !== 'All' && <span>Filter: Letter "{selectedLetter}"</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredApps.map((app) => {
                    const Icon = app.icon;
                    return (
                      <div 
                        key={app.id}
                        className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between group bg-white hover:shadow-lg ${app.badge === 'AI Voice' ? 'border-teal-300 bg-teal-50/20 hover:border-teal-500' : 'border-slate-200 hover:border-blue-400'}`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${app.badge === 'AI Voice' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            {app.badge && (
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${app.badge === 'AI Voice' ? 'bg-teal-100 text-teal-800 border border-teal-300' : 'bg-indigo-100 text-indigo-800'}`}>
                                {app.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">{app.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{app.desc}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-400">{app.category}</span>
                          <button 
                            onClick={() => {
                              if (app.modal) setActiveModal(app.modal);
                              else triggerToast(`Launching ${app.title}...`);
                            }}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            Launch <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* More Applications Index (454) Alphabet Index (Exact replica of Image 2 & 3) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">More Applications (454)</h3>
                {selectedLetter !== 'All' && (
                  <button onClick={() => setSelectedLetter('All')} className="text-xs text-blue-600 font-bold hover:underline">
                    Clear Alphabet Filter
                  </button>
                )}
              </div>

              {/* Alphabet Buttons Row */}
              <div className="flex flex-wrap gap-1.5">
                {ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition border ${selectedLetter === letter ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Alphabet Application Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                {[
                  'On-Boarding', 'HCM', 'ESA', 'Insight Compass OAC', 'Visitor Management System',
                  'DB Read Access Tool', 'Clearance Automation', 'Enterprise Communication Framework', 'Global Business Card', 'LEARN',
                  'Enterprise System Inventory', 'Client Visit Experience', 'Outreach', 'PRISM', 'Quick SO',
                  'ID Card App', 'My I-94', 'TSmart', 'Green Card Status App', 'Safety Permit',
                  'My Workspace', 'Visa Maxout', 'H1B Nomination App', 'HR e-Storage', 'Customer Holidays'
                ].filter(name => selectedLetter === 'All' || name.toUpperCase().startsWith(selectedLetter)).map((appName, idx) => (
                  <div 
                    key={idx}
                    onClick={() => triggerToast(`Launching ${appName}...`)}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition flex items-center space-x-2.5"
                  >
                    <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      <Grid className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{appName}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ===================== FLOATING DOCK (RIGHT SIDE PANEL - EXACT REPLICA) ===================== */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-3 bg-[#0b1329]/90 p-2 rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/50">
        <button 
          onClick={() => setActiveModal('profile')} 
          className="p-2.5 text-white hover:bg-blue-600 rounded-xl transition relative group"
          title="Associate 360"
        >
          <User className="w-5 h-5" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
            Associate 360
          </span>
        </button>

        <button 
          onClick={() => setActiveModal('acure')} 
          className="p-2.5 text-white hover:bg-blue-600 rounded-xl transition relative group"
          title="ACure Asset Diagnostics"
        >
          <Laptop className="w-5 h-5" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
            ACure Diagnostics
          </span>
        </button>

        <button 
          onClick={() => setActiveModal('leave')} 
          className="p-2.5 text-white hover:bg-teal-600 rounded-xl transition relative group"
          title="Voice AI Leave Assistant"
        >
          <Mic className="w-5 h-5 text-teal-300" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
            Voice Leave Agent
          </span>
        </button>
      </div>

      {activeModal === 'leave' && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150">
            
            {/* Header Bar */}
            <div className="bg-[#0b1329] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base">Apply Leave — India (oneSRM AI Assistant)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Speech Center Box */}
            <div className="p-6 text-center bg-slate-50 border-b border-slate-200">
              <button 
                onClick={() => handleVoiceTrigger("Apply earned leave for next week Monday to Friday")}
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all transform active:scale-95 shadow-xl ${isRecording ? 'bg-red-600 animate-ping' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/30'}`}
              >
                <Mic className="w-9 h-9" />
              </button>
              <p className="font-bold text-slate-800 text-sm mt-3">Tap to speak</p>
              <p className="text-xs text-slate-500 mt-1">Try saying these leave suggestions below:</p>

              {/* Natural Language Voice Pill Suggestions */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button 
                  onClick={() => handleVoiceTrigger("Apply sick leave for yesterday")}
                  className="bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition"
                >
                  "Apply sick leave for yesterday"
                </button>
                <button 
                  onClick={() => handleVoiceTrigger("Apply earned leave for next week Monday to Friday")}
                  className="bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition"
                >
                  "Apply earned leave for next week Monday to Friday"
                </button>
                <button 
                  onClick={() => handleVoiceTrigger("Submit sick leave today for medical appointment")}
                  className="bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition"
                >
                  "Submit sick leave today for medical appointment"
                </button>
                <button 
                  onClick={() => handleVoiceTrigger("Request casual leave for family emergency today")}
                  className="bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition"
                >
                  "Request casual leave for family emergency today"
                </button>
              </div>

              {leaveVoiceText && (
                <div className="mt-4 p-3 bg-teal-50 border border-teal-300 rounded-xl text-xs text-teal-900 font-medium">
                  <strong>Transcribed AI Input:</strong> "{leaveVoiceText}"
                </div>
              )}
            </div>

            {/* Quick Policy Links */}
            <div className="px-6 py-3 bg-slate-100 flex items-center justify-around text-xs font-bold text-teal-700 border-b border-slate-200">
              <a href="#policy" onClick={(e) => { e.preventDefault(); triggerToast('Opening Leave Policy PDF'); }} className="hover:underline flex items-center gap-1">
                🔗 Leave Policy
              </a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); triggerToast('Opening Leave FAQ'); }} className="hover:underline flex items-center gap-1">
                🔗 FAQ
              </a>
              <a href="#holidays" onClick={(e) => { e.preventDefault(); triggerToast('2026 Holiday Schedule'); }} className="hover:underline flex items-center gap-1">
                🔗 Holiday Schedule
              </a>
            </div>

            {/* Form Fields */}
            <div className="p-6 grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Start Date *</label>
                <input 
                  type="date" 
                  value={leaveDates.start}
                  onChange={(e) => setLeaveDates({ ...leaveDates, start: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">End Date *</label>
                <input 
                  type="date" 
                  value={leaveDates.end}
                  onChange={(e) => setLeaveDates({ ...leaveDates, end: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  triggerToast('Leave application submitted for approval!');
                }}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-md transition"
              >
                Submit Request
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Profile Details Modal */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-300">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${USER_PROFILE.avatarBg} text-white text-xl font-bold flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                {USER_PROFILE.initials}
              </div>
              <h3 className="font-bold text-lg text-slate-900">{USER_PROFILE.name}</h3>
              {USER_PROFILE.empId && <p className="text-xs text-blue-600 font-bold mt-0.5">Emp ID: {USER_PROFILE.empId}</p>}
              <p className="text-xs text-slate-500">{USER_PROFILE.role}</p>

              <div className="mt-5 text-left text-xs space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-slate-800 text-right">{USER_PROFILE.department || '—'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-slate-800 text-right break-all">{USER_PROFILE.email}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-800 text-right">{USER_PROFILE.location || '—'}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                >
                  Close Profile
                </button>
                <button
                  onClick={signOut}
                  className="flex-1 py-2.5 bg-white text-red-600 border border-red-200 text-xs font-bold rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACure Diagnostics Modal */}
      {activeModal === 'acure' && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-300">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">ACure Automated Diagnostics</h3>
                <p className="text-xs text-slate-500">Self-resolution for workstation & network issues</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-200">
                <span>Wi-Fi & VPN Encryption Check</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Passed</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-200">
                <span>Antivirus & Patch Compliance</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Up to Date</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-200">
                <span>Outlook & Teams Certificate</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Valid</span>
              </div>
            </div>

            <button 
              onClick={() => { setActiveModal(null); triggerToast('Diagnostic scan complete. All systems healthy.'); }}
              className="w-full mt-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition"
            >
              Run Full Scan Now
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* oneSRM Assistant chatbot (bottom-right) */}
      <ChatAssistant
        firstName={USER_PROFILE.name.split(' ')[0]}
        onAction={(action) => {
          if (action.modal) setActiveModal(action.modal);
          else if (action.app?.modal) setActiveModal(action.app.modal);
          else if (action.app) triggerToast(`Launching ${action.app.title}...`);
        }}
      />

      {/* Footer */}
      <footer className="bg-[#0b1329] text-slate-400 text-[11px] py-4 text-center border-t border-slate-800">
        <p>© 2026 SRM Group • oneSRM Enterprise Employee Portal Prototype • Digital Practice</p>
      </footer>

    </div>
  );
}