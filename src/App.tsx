import { useState, useRef, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import KnowledgeGraph from './pages/KnowledgeGraph';
import RiskEval from './pages/RiskEval';
import AIQA from './pages/AIQA';
import Reports from './pages/Reports';
import { LayoutDashboard, Network, ShieldAlert, Bot, FileText, Bell, UserCircle, LogOut, Mic, Sparkles, BrainCircuit } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPlayingTour, setIsPlayingTour] = useState(false);
  const playActiveRef = useRef(false);
  const synth = window.speechSynthesis;

  useEffect(() => {
    return () => {
      synth.cancel();
      playActiveRef.current = false;
    };
  }, []);

  const TOUR_SCRIPT = [
    {
      tab: 'dashboard',
      action: 'dashboard-start',
      text: '各位领导、各位同仁，大家好。欢迎体验专卖涉烟情报分析系统的 V1.0 原型版本。目前我们所在的这一大屏是综合数据大盘。作为平台的数据中枢，可一屏实时汇总辖区涉烟案件指标、核心情报线索及执法力量分布情况。指挥人员可以直观掌握市场宏观动态及打击成效。'
    },
    {
      tab: 'graph',
      action: 'graph-person',
      text: '接下来，进入核心模块知识图谱检索。在案件侦办中，面对单一线索，系统可实现深度挖掘。例如，当我们输入特定嫌疑人信息进行搜索，系统不仅能快速调取基本信息，还能在中央图谱区域自动生成包含同案人员、涉案车辆及资金往来的可视化关联网络。'
    },
    {
      tab: 'graph',
      action: 'graph-vehicle',
      text: '同时，我们还可以切换至涉案车辆智能溯源。系统能够将车辆的历史轨迹和近期活动，直接投射到真实地理空间中。配合地图高亮显示，清晰暴露犯罪分子的运输路线与疑似仓储窝点，实现一键深挖与案件研判。'
    },
    {
      tab: 'graph',
      action: 'graph-violation',
      text: '除此之外，系统的违规信息智能整合机制还能针对单点线索进行全系关联分析。当输入核心要素下发研判指令后，大模型会全速比对海量历史特征，迅速生成区域异常热度与高发违法类型聚类，并当场出具辅助决策与法规依据。'
    },
    {
      tab: 'risk',
      action: 'risk-person',
      text: '接下来，进入市场风控评估大模块。首先展示涉案人员分析部分，系统为重点活动人员建立了包含区域流动、作案频发度等多维雷达画像，能够精准识别高危人员并纳入系统重点关注。'
    },
    {
      tab: 'risk',
      action: 'risk-area',
      text: '在区域风险分析页面，依托底层的地理定位与业务数据，系统动态生成了辖区查处风险热力图。我们可以看到地图上高危聚集的商圈节点，系统能够自动弹出预警，提示物流末端极其异常。这帮助我们将主动权前置。'
    },
    {
      tab: 'risk',
      action: 'risk-retailer',
      text: '再看零售户风险评估，智能引擎实现了对全辖区商户的动态打分预警。对于红色高危状态的商户，系统会自动生成核查工单推送，大大减少了以往盲目巡查、存在盲区的工作痛点。'
    },
    {
      tab: 'risk',
      action: 'risk-metrics',
      text: '针对各种宏观数据，系统特设了指标解析与数据问答界面。指挥人员无需翻开厚重的报表，只要自然地向智能助手提问，比如办结率情况，大语言模型就会当场出具核心研判图表，并提炼结构化的效能结论。'
    },
    {
      tab: 'risk',
      action: 'risk-trend',
      text: '最后是违法趋势预测。系统结合历史案件的潮汐规律，自动推进行全网格推演，输出未来数月内各类型案件的爆发曲线，从战略层面直接给出网络打击的建议方向，充分辅助上层长官进行指挥作战。'
    },
    {
      tab: 'aiqa',
      action: 'aiqa-start',
      text: '关于智能法规问答功能。系统内置法律专家大模型，执法人员可通过自然语言输入案件疑问。系统能横跨海量数据库，精准提供法条与裁量建议，保障后续程序的严谨透明。'
    },
    {
      tab: 'reports',
      action: 'reports-start',
      text: '最后是全自动AI分析报告模块。面对堆积的庞杂线索，只需点击一键智能生成，大模型将在几秒内梳理完所有违法时间脉络，提炼人、案、物的核心要素，输出符合侦查与汇报标准的纯文本深度研判报告。以上为核心功能演示，感谢体验。'
    }
  ];

  const toggleAudioTour = async () => {
    if (isPlayingTour) {
      synth.cancel();
      setIsPlayingTour(false);
      playActiveRef.current = false;
      return;
    }

    setIsPlayingTour(true);
    playActiveRef.current = true;

    let voices = synth.getVoices();
    if (voices.length === 0) {
      await new Promise(resolve => {
        const id = setInterval(() => {
          voices = synth.getVoices();
          if (voices.length > 0) {
            clearInterval(id);
            resolve(true);
          }
        }, 100);
        setTimeout(() => { clearInterval(id); resolve(false); }, 1500);
      });
    }

    // Attempt to pick a good Chinese voice (female preferred)
    const voice = voices.find(v => v.lang.includes('zh') && (v.name.includes('Xiaoxiao') || v.name.includes('Tingting'))) 
               || voices.find(v => v.lang.includes('zh')) 
               || voices[0];

    const speakPart = (index: number) => {
      if (!playActiveRef.current || index >= TOUR_SCRIPT.length) {
        setIsPlayingTour(false);
        playActiveRef.current = false;
        return;
      }

      const part = TOUR_SCRIPT[index];
      setActiveTab(part.tab);
      
      // Delay dispatching the custom event to allow React to mount the new tab's components
      // This solves the race condition where child components miss the tour-action event.
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('tour-action', { detail: part.action }));
      }, 300);

      const utterance = new SpeechSynthesisUtterance(part.text);
      utterance.lang = 'zh-CN';
      utterance.rate = 1.75; // 更快、更专业
      utterance.pitch = 1.15; 
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        setTimeout(() => {
          speakPart(index + 1);
        }, 800);
      };

      utterance.onerror = () => {
        setIsPlayingTour(false);
        playActiveRef.current = false;
      };

      synth.speak(utterance);
    };

    speakPart(0);
  };

  const navigation = [
    { id: 'dashboard', name: '综合数据大盘', icon: <LayoutDashboard className="w-4 h-4 mr-2" />, isHot: true },
    { id: 'graph', name: '知识图谱检索', icon: <Network className="w-4 h-4 mr-2" />, isAi: true },
    { id: 'risk', name: '市场风控评估', icon: <ShieldAlert className="w-4 h-4 mr-2" />, isAi: true },
    { id: 'aiqa', name: '智能法规问答', icon: <Bot className="w-4 h-4 mr-2" />, isAi: true },
    { id: 'reports', name: 'AI分析报告', icon: <FileText className="w-4 h-4 mr-2" />, isAi: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'graph': return <KnowledgeGraph />;
      case 'risk': return <RiskEval />;
      case 'aiqa': return <AIQA />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col font-sans overflow-hidden bg-[#f0f2f5]">
      {/* Top Header */}
      <header className="soe-bg-blue h-14 flex items-center justify-between px-6 shrink-0 text-white shadow-lg z-50">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center relative overflow-hidden group">
            <div className="w-5 h-5 bg-blue-900 rotate-45 transform group-hover:rotate-90 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-blue-400 opacity-20 ai-pulse mix-blend-overlay"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">专卖涉烟情报分析系统</span>
              <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded border border-purple-400 shadow-inner tracking-wider flex items-center font-bold">
                <BrainCircuit className="w-3 h-3 mr-1" /> AI 大模型赋能版 V2.0
              </span>
            </div>
            <span className="text-[10px] opacity-70 uppercase tracking-widest mt-0.5">Intelligent Analysis Platform (AI Driven)</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={toggleAudioTour}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
              isPlayingTour 
                ? "bg-red-500/20 border-red-400 text-red-100 hover:bg-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                : "bg-blue-800 border-blue-600 text-blue-100 hover:bg-blue-700 hover:shadow-lg"
            )}
          >
            <Mic className={cn("w-4 h-4", isPlayingTour && "animate-pulse")} />
            <span className="font-medium text-xs">{isPlayingTour ? '停止讲解...' : '智能语音演示'}</span>
          </button>
          
          <div className="flex items-center gap-2 bg-blue-800 px-3 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="font-medium">AI算法服务：运行中</span>
          </div>
          <div className="relative mx-3">
            <Bell className="w-5 h-5 text-white hover:text-blue-200 cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </div>
          <div className="flex flex-col text-right ml-2 text-white">
            <span className="font-bold">管理员 (Admin-001)</span>
            <span className="opacity-80 text-xs mt-0.5">最后登录: 2024-05-24 09:20</span>
          </div>
          <button className="text-white opacity-80 hover:opacity-100 transition-colors ml-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden p-3 gap-3">
        {/* Sidebar */}
        <aside className="w-64 flex flex-col gap-3 shrink-0">
          <div className="glass-card p-4 flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 mb-4 border-l-4 border-blue-800 pl-2">功能导航</h3>
            <ul className="space-y-2 flex-1">
              {navigation.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "p-3 text-base rounded cursor-pointer flex items-center justify-between transition-colors",
                    activeTab === item.id 
                      ? "bg-blue-50 text-blue-800 font-bold border border-blue-100 shadow-sm" 
                      : "text-gray-600 hover:bg-gray-100 font-medium"
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {item.name}
                  </div>
                  <div className="flex items-center gap-1">
                    {item.isHot && <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 font-bold rounded">HOT</span>}
                    {item.isAi && <span className="text-[10px] bg-purple-100 text-purple-700 border border-purple-200 px-1.5 py-0.5 font-bold rounded flex items-center shadow-sm"><Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI</span>}
                  </div>
                </li>
              ))}
            </ul>
            
            {/* System Status in Sidebar */}
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs">
              <div className="text-gray-400 mb-2 uppercase font-bold">系统状态监控</div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                <span className="flex items-center text-gray-700 font-medium"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>安全引擎</span>
                <span className="text-green-600 font-mono font-bold">在线</span>
              </div>
            </div>
          </div>
          
          {/* AI Assistant Mini Card */}
          <div className="ai-gradient p-5 rounded text-white shadow-md">
            <h4 className="text-base font-bold flex items-center gap-2"><span>✨</span> AI 智能预警</h4>
            <p className="text-sm mt-3 leading-relaxed opacity-90">检测到北环物流园区域今日包裹异常量环比增长15%，建议启动专项排查。</p>
            <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-sm font-bold py-2 rounded transition-colors" onClick={() => setActiveTab('reports')}>查看分析报告</button>
          </div>
        </aside>

        {/* Main Content Section */}
        <section className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 pb-1">
          {renderContent()}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="h-10 bg-[#e1e4e8] border-t border-gray-300 flex items-center px-6 justify-between text-xs text-gray-600 font-medium shrink-0">
        <div>© 2026 专卖指挥中心 - AI 情报大数据平台</div>
        <div className="flex gap-4">
          <span>系统环境: 内网生产环境 V2.0</span>
          <span>部署节点: 中心机房-A区</span>
        </div>
      </footer>
    </div>
  );
}
