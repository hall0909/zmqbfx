import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import KnowledgeGraph from './pages/KnowledgeGraph';
import RiskEval from './pages/RiskEval';
import AIQA from './pages/AIQA';
import Reports from './pages/Reports';
import { LayoutDashboard, Network, ShieldAlert, Bot, FileText, Bell, UserCircle, LogOut } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigation = [
    { id: 'dashboard', name: '综合数据大盘', icon: <LayoutDashboard className="w-4 h-4 mr-2" />, isHot: true },
    { id: 'graph', name: '知识图谱检索', icon: <Network className="w-4 h-4 mr-2" /> },
    { id: 'risk', name: '市场风控评估', icon: <ShieldAlert className="w-4 h-4 mr-2" /> },
    { id: 'aiqa', name: '智能法规问答', icon: <Bot className="w-4 h-4 mr-2" /> },
    { id: 'reports', name: 'AI分析报告', icon: <FileText className="w-4 h-4 mr-2" /> },
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
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <div className="w-5 h-5 bg-blue-900 rotate-45"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">专卖涉烟情报分析系统</span>
              <span className="bg-blue-700 text-white text-[10px] px-1.5 py-0.5 rounded border border-blue-500 shadow-inner tracking-wider">版本 V1.0</span>
            </div>
            <span className="text-[10px] opacity-70 uppercase tracking-widest mt-0.5">Intelligent Analysis Platform (AI Driven)</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
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
                  {item.isHot && <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 font-bold rounded">HOT</span>}
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
