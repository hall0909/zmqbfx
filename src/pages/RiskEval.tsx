import { useState, useEffect } from 'react';
import { 
  Users, MapPin, Store, MessageSquareText, TrendingUp, Search, RefreshCw, 
  Download, Maximize2, ShieldAlert, BarChart3, PieChart as PieChartIcon, 
  Activity, Star, Layers, Map as MapIcon, Target, BrainCircuit, Sparkles, 
  Flame, ChevronRight, Settings, Send, Bot, FileText, CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, LineChart, Line, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function RiskEval() {
  const [activeTab, setActiveTab] = useState<'person' | 'area' | 'retailer' | 'metrics' | 'trend'>('person');
  const [tourAction, setTourAction] = useState<string>('');

  useEffect(() => {
    const handleAction = (e: any) => {
      setTourAction(e.detail);
      if (e.detail === 'risk-person') setActiveTab('person');
      else if (e.detail === 'risk-area') setActiveTab('area');
      else if (e.detail === 'risk-retailer') setActiveTab('retailer');
      else if (e.detail === 'risk-metrics') setActiveTab('metrics');
      else if (e.detail === 'risk-trend') setActiveTab('trend');
    };
    window.addEventListener('tour-action', handleAction);
    return () => window.removeEventListener('tour-action', handleAction);
  }, []);

  const TABS = [
    { id: 'person', label: '涉案人员分析', icon: Users },
    { id: 'area', label: '区域风险分析', icon: MapPin },
    { id: 'retailer', label: '零售户风险评估', icon: Store },
    { id: 'metrics', label: '指标解析与问答', icon: MessageSquareText },
    { id: 'trend', label: '违法趋势预测', icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col h-full gap-3">
      {/* 模块主导航 */}
      <div className="glass-card p-3 shrink-0 flex items-center justify-between border-b-4 border-[#004098]">
        <div className="flex items-center gap-2">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={cn(
                "px-4 py-2 font-bold text-sm rounded transition-colors flex items-center", 
                activeTab === tab.id ? "bg-[#004098] text-white shadow-md" : "bg-blue-50 text-[#004098] hover:bg-blue-100"
              )}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center text-purple-700 bg-purple-50 px-3 py-1.5 rounded border border-purple-200">
           <BrainCircuit className="w-4 h-4 mr-1.5 ai-pulse" />
           <span className="text-xs font-bold tracking-wide">AI大模型全栈护航 | 风控引擎运行中</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'person' && <PersonAnalysis tourAction={tourAction} />}
        {activeTab === 'area' && <AreaRiskAnalysis tourAction={tourAction} />}
        {activeTab === 'retailer' && <RetailerRisk tourAction={tourAction} />}
        {activeTab === 'metrics' && <MetricsQA tourAction={tourAction} />}
        {activeTab === 'trend' && <TrendPrediction tourAction={tourAction} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3.2.1 涉案人员维度智能统计分析
// ----------------------------------------------------
function PersonAnalysis({ tourAction }: { tourAction?: string }) {
  const barData = [{ name: '李某某', freq: 12 }, { name: '张某', freq: 9 }, { name: '王某某', freq: 7 }, { name: '刘某', freq: 5 }];
  const radarData = [
    { subject: '跨区域流动性', A: 120, fullMark: 150 },
    { subject: '组织策划能力', A: 98, fullMark: 150 },
    { subject: '作案频发度', A: 86, fullMark: 150 },
    { subject: '反侦察意识', A: 130, fullMark: 150 },
    { subject: '资金调配力', A: 85, fullMark: 150 },
  ];

  return (
    <div className="flex flex-col h-full gap-3 animate-in fade-in zoom-in-95 duration-300">
      <div className="glass-card p-3 shrink-0 flex items-end gap-3 bg-gray-50/80">
        <div className="grid grid-cols-4 gap-3 flex-1">
          <div><label className="text-[11px] font-bold text-gray-500 mb-1 block">时间范围</label><select className="w-full border p-1.5 rounded text-xs bg-white"><option>近6个月</option><option>近1年</option></select></div>
          <div><label className="text-[11px] font-bold text-gray-500 mb-1 block">涉案类型</label><select className="w-full border p-1.5 rounded text-xs bg-white"><option>走私卷烟 (多选)</option><option>售卖假烟</option></select></div>
          <div><label className="text-[11px] font-bold text-gray-500 mb-1 block">区域筛选</label><select className="w-full border p-1.5 rounded text-xs bg-white"><option>全部辖区</option><option>重点网格</option></select></div>
        </div>
        <div className="flex gap-2">
           <button className="bg-[#004098] text-white px-4 py-1.5 rounded text-xs font-bold">确认筛选</button>
           <button className="bg-white border text-gray-600 px-4 py-1.5 rounded text-xs font-bold">重置</button>
           <button className="bg-green-50 border border-green-200 text-green-700 px-4 py-1.5 rounded text-xs font-bold flex items-center"><Download className="w-3 h-3 mr-1" /> 数据导出</button>
        </div>
      </div>

      {/* 上栏: 图表区 40% */}
      <div className="h-[40%] flex gap-3 shrink-0">
         <div className="flex-1 glass-card p-3 flex flex-col relative">
           <div className="flex justify-between items-center mb-2"><h3 className="text-sm font-bold text-gray-700">户籍地分布热力图</h3><div className="text-gray-400"><Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-[#004098]"/></div></div>
           <div className="flex-1 bg-[#e0e5ec] rounded relative overflow-hidden flex items-center justify-center border border-gray-200">
               <MapIcon className="absolute w-full h-full opacity-10 text-gray-500"/>
               <div className="absolute w-6 h-6 bg-red-500 rounded-full blur-[10px] opacity-80" style={{top:'30%', left:'40%'}}></div>
               <div className="absolute w-10 h-10 bg-orange-500 rounded-full blur-[15px] opacity-70" style={{top:'50%', left:'60%'}}></div>
               <span className="relative z-10 text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded shadow">广东潮汕地区 (高度聚集)</span>
           </div>
         </div>
         <div className="flex-1 glass-card p-3 flex flex-col">
           <div className="flex justify-between items-center mb-2"><h3 className="text-sm font-bold text-gray-700">人员违法频次排行</h3></div>
           <ResponsiveContainer width="100%" height="100%"><BarChart data={barData} layout="vertical" margin={{top:0,right:20,left:0,bottom:0}}><XAxis type="number" hide/><YAxis dataKey="name" type="category" width={50} tick={{fontSize:11, fontWeight:'bold'}}/><Tooltip/><Bar dataKey="freq" fill="#004098" radius={[0,4,4,0]} barSize={16}/></BarChart></ResponsiveContainer>
         </div>
         <div className="flex-[1.2] glass-card p-3 flex flex-col relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/30 to-transparent z-0 pointer-events-none"></div>
           <div className="flex justify-between items-center mb-2 relative z-10"><h3 className="text-sm font-bold text-gray-700 flex items-center">涉烟团伙成员画像雷达 <Sparkles className="w-3.5 h-3.5 ml-1 text-purple-500" /></h3></div>
           <ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}><PolarGrid stroke="#e2e8f0"/><PolarAngleAxis dataKey="subject" tick={{fontSize:10, fill:'#475569'}}/><PolarRadiusAxis angle={30} domain={[0, 150]} tick={false}/><Radar name="属性" dataKey="A" stroke="#004098" fill="#004098" fillOpacity={0.4} /></RadarChart></ResponsiveContainer>
         </div>
      </div>

      {/* 下栏: 详情列表 60% */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col">
         <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <button className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 text-xs font-bold rounded">加入重点关注</button>
               <button className="bg-white border px-3 py-1 text-xs text-gray-600 rounded">批量对比</button>
            </div>
            <div className="flex gap-2 items-center">
               <input type="text" placeholder="搜姓名/身份证号..." className="border text-xs px-2 py-1 rounded w-48"/>
               <select className="border text-xs px-2 py-1 rounded"><option>按违规频次倒序</option></select>
               <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-bold ml-2 flex items-center transition-colors shadow-sm"><BrainCircuit className="w-3 h-3 mr-1" />趋势预测分析</button>
            </div>
         </div>
         <div className="flex-1 overflow-auto">
           <table className="w-full text-left text-sm whitespace-nowrap">
             <thead className="bg-gray-100 sticky top-0"><tr className="text-gray-600">
               <th className="p-3 w-10 text-center"><input type="checkbox"/></th>
               <th className="p-3 font-bold">姓名</th><th className="p-3 font-bold">身份证号</th><th className="p-3 font-bold">频次/类型</th><th className="p-3 font-bold">户籍/职业</th><th className="p-3 font-bold">时效状态</th>
             </tr></thead>
             <tbody>
               {[1,2,3,4,5].map(i =>(
                 <tr key={i} className="border-b hover:bg-blue-50 cursor-pointer">
                   <td className="p-3 text-center"><input type="checkbox"/></td>
                   <td className="p-3 font-bold text-[#004098] hover:underline">李某某 {i}</td>
                   <td className="p-3 font-mono text-gray-500">440304******{i}123</td>
                   <td className="p-3"><div className="font-bold text-red-600">{10-i}次 <span className="bg-red-100 text-red-700 text-[10px] px-1 ml-1 rounded">售假</span></div></td>
                   <td className="p-3"><div className="text-xs">湖北武汉</div><div className="text-[10px] text-gray-500">无业/物流司助</div></td>
                   <td className="p-3"><div className="text-xs text-gray-700">首次: 2022-01</div><div className="text-xs text-red-500 font-bold">末次: 2026-03 (活跃)</div></td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3.2.2 涉案区域活力与风险智能分析
// ----------------------------------------------------
function AreaRiskAnalysis({ tourAction }: { tourAction?: string }) {
  const [showDemoPopup, setShowDemoPopup] = useState(false);
  const [highlightDetails, setHighlightDetails] = useState(false);

  useEffect(() => {
    if (tourAction === 'risk-area') {
      setShowDemoPopup(false);
      setHighlightDetails(false);
      const t1 = setTimeout(() => {
        setShowDemoPopup(true);
      }, 3500); // "我们可以看到地图上高危聚集的商圈节点"
      const t2 = setTimeout(() => {
        setHighlightDetails(true);
      }, 6500); // "提示这里物流末端极其异常"
      const t3 = setTimeout(() => {
        setShowDemoPopup(false);
        setHighlightDetails(false);
      }, 12000); // 结束清理
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [tourAction]);

  return (
    <div className="flex flex-col h-full gap-3 animate-in fade-in zoom-in-95 duration-300">
      <div className="glass-card p-3 shrink-0 flex items-center justify-between border-l-4 border-[#004098]">
         <div className="flex items-center gap-4">
           <div className="flex items-center gap-2"><span className="text-sm font-bold text-gray-700">区域划分:</span><select className="border text-xs px-2 py-1.5 rounded bg-white"><option>武汉市街道级划分</option><option>辖区级</option></select></div>
           <div className="flex items-center gap-2"><span className="text-sm font-bold text-gray-700">风险维度:</span><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">发案率</span><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">物流异常量</span></div>
         </div>
         <div className="flex gap-2">
            <button className="bg-white border text-[#004098] px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-50">区域对比</button>
            <button className="bg-white border text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-50"><Settings className="w-3.5 h-3.5 inline mr-1" />等级阈值设置</button>
            <button className="bg-[#004098] text-white px-4 py-1.5 rounded text-xs font-bold shadow-sm">AI一键重新评估</button>
         </div>
      </div>

      <div className="flex-1 flex gap-3 overflow-hidden">
         {/* 左侧 地图 70% */}
         <div className="flex-[7] glass-card relative overflow-hidden w-full h-full border border-gray-300 shadow-inner bg-[#f0f4f8]">
            {showDemoPopup && (
              <div className="absolute z-40 top-1/2 left-[45%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-xl border-2 border-red-400 animate-in zoom-in-75 fade-in duration-300 pointer-events-none">
                 <div className="flex flex-col font-bold">
                    <span className="text-red-700 text-sm border-b border-red-200 pb-1 mb-1">江汉区核心商圈</span>
                    <div className="text-xs text-gray-600 mt-2">发案率: <span className="text-red-600">8.5% (异常偏高)</span></div>
                    <div className="text-xs text-gray-600 mt-1">关联风险: <span className="text-red-600">物流末端存在极其异常的包裹聚集</span></div>
                 </div>
              </div>
            )}
            <div className="absolute top-4 right-4 z-30 flex gap-2">
              <button className="bg-white p-2 shadow rounded hover:text-blue-600"><MapIcon className="w-4 h-4"/></button>
              <button className="bg-white p-2 shadow rounded hover:text-blue-600"><Maximize2 className="w-4 h-4"/></button>
            </div>
            
            {/* 真实地图背景 - 采用 Leaflet */}
            <div className="absolute inset-0 w-full h-full z-0">
               <MapContainer center={[30.58, 114.28]} zoom={11} className="w-full h-full" zoomControl={false} dragging={true}>
                  {/* 底图: Google Maps (中文注记) */}
                  <TileLayer
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=zh-CN"
                    attribution='&copy; Google Maps'
                  />
                  
                  {/* 热力图斑层与区域标识 */}
                  
                  {/* 江汉区核心商圈 (高危) */}
                  <CircleMarker center={[30.60, 114.28]} radius={80} pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.3 }}>
                     <Popup className="custom-popup" maxWidth={200}>
                        <div className="flex flex-col font-bold">
                           <span className="text-red-700 text-sm border-b border-red-100 pb-1 mb-1">江汉区核心商圈</span>
                           <div className="text-xs text-gray-600 mt-1">发案率: <span className="text-red-600">8.5%</span></div>
                           <div className="text-xs text-gray-600">风险评分: <span className="text-red-600">92分</span></div>
                        </div>
                     </Popup>
                  </CircleMarker>

                  {/* 东西湖物流片区 (中危) */}
                  <CircleMarker center={[30.63, 114.15]} radius={100} pathOptions={{ color: 'transparent', fillColor: '#f97316', fillOpacity: 0.2 }}>
                     <Popup className="custom-popup" maxWidth={200}>
                        <div className="flex flex-col font-bold">
                           <span className="text-orange-700 text-sm border-b border-orange-100 pb-1 mb-1">东西湖物流片区</span>
                           <div className="text-xs text-gray-600 mt-1">异常量: <span className="text-orange-600">3,420单</span></div>
                           <div className="text-xs text-gray-600">风险评分: <span className="text-orange-600">75分</span></div>
                        </div>
                     </Popup>
                  </CircleMarker>

                  {/* 武昌火车站网格 (中危) */}
                  <CircleMarker center={[30.53, 114.33]} radius={90} pathOptions={{ color: 'transparent', fillColor: '#f97316', fillOpacity: 0.2 }}>
                     <Popup className="custom-popup" maxWidth={200}>
                        <div className="flex flex-col font-bold">
                           <span className="text-orange-700 text-sm border-b border-orange-100 pb-1 mb-1">武昌火车站网格</span>
                           <div className="text-xs text-gray-600 mt-1">发案率: <span className="text-orange-600">4.8%</span></div>
                           <div className="text-xs text-gray-600">风险评分: <span className="text-orange-600">68分</span></div>
                        </div>
                     </Popup>
                  </CircleMarker>

                  {/* 汉阳生态示范区 (低危) */}
                  <CircleMarker center={[30.55, 114.23]} radius={120} pathOptions={{ color: 'transparent', fillColor: '#22c55e', fillOpacity: 0.15 }}>
                     <Popup className="custom-popup" maxWidth={200}>
                        <div className="flex flex-col font-bold">
                           <span className="text-green-700 text-sm border-b border-green-100 pb-1 mb-1">汉阳生态示范区</span>
                           <div className="text-xs text-gray-600 mt-1">发案率: <span className="text-green-600">1.1%</span></div>
                           <div className="text-xs text-gray-600">风险评分: <span className="text-green-600">20分</span></div>
                        </div>
                     </Popup>
                  </CircleMarker>

               </MapContainer>
            </div>
         </div>

         {/* 右侧 侧边栏 30% */}
         <div className={cn("flex-[3] glass-card flex flex-col bg-white transition-all duration-500", highlightDetails ? "ring-4 ring-orange-500 shadow-2xl scale-[1.02] z-30" : "")}>
            <div className="p-4 bg-gray-50 border-b border-gray-200 shrink-0">
               <h3 className="font-bold text-[#004098] flex items-center mb-3"><Flame className="w-4 h-4 mr-1.5" /> 智能评估区域排行榜 (TOP 3)</h3>
               <div className="space-y-2">
                 {[ {n:'江汉区核心商圈',s:92,c:'red'}, {n:'东西湖物流片区',s:75,c:'orange'}, {n:'武昌火车站网格',s:68,c:'orange'} ].map((a,i) => (
                   <div key={i} className="flex justify-between items-center text-xs p-1.5 border border-gray-100 rounded bg-white">
                      <div className="flex items-center"><span className={cn("w-4 h-4 rounded text-[10px] text-white flex items-center justify-center font-bold mr-2", i===0?'bg-red-500':i===1?'bg-orange-500':'bg-yellow-500')}>{i+1}</span> <span className="font-bold text-gray-700">{a.n}</span></div>
                      <span className={cn("font-bold font-mono", a.c==='red'?'text-red-600':'text-orange-600')}>{a.s}分</span>
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="flex border-b border-gray-200 text-xs font-bold text-gray-500 shrink-0">
              <button className="flex-1 py-2.5 border-b-2 border-[#004098] text-[#004098] bg-blue-50/50">核心指标</button>
              <button className="flex-1 py-2.5 border-b-2 border-transparent hover:bg-gray-50">风险分析</button>
              <button className="flex-1 py-2.5 border-b-2 border-transparent hover:bg-gray-50">AI监管建议</button>
            </div>
            
            <div className="p-4 flex-1 overflow-auto bg-blue-50/30">
               <div className="bg-red-100 border border-red-200 p-2 rounded text-center text-red-800 text-xs font-bold mb-4 shadow-sm">当前聚焦: 江汉区核心商圈 (高风险)</div>
               
               <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-gray-600">区域发案率</span><span className="text-red-600">8.5% (预警)</span></div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full"><div className="bg-red-500 h-1.5 rounded-full" style={{width:'85%'}}></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-gray-600">违规零售户占比</span><span className="text-orange-600">12%</span></div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full"><div className="bg-orange-500 h-1.5 rounded-full" style={{width:'40%'}}></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-gray-600">物流异常件数</span><span className="text-red-600">3,420单/月</span></div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full"><div className="bg-red-500 h-1.5 rounded-full" style={{width:'90%'}}></div></div>
                 </div>
                 
                 <div className="mt-6 pt-4 border-t border-gray-200 relative">
                   <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center"><BrainCircuit className="w-4 h-4 mr-1 text-[#004098]"/> 风险点深度剖析</h4>
                   <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 border border-gray-200 rounded shadow-sm">该区域为老牌商圈集散地，近期物流发件量中“电子烟、无标包裹”特征显著增加。周边城中村提供隐蔽仓储环境，疑似存在大型跨区域卷烟集散网络节点。</p>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}



// ----------------------------------------------------
// 3.2.3 零售户市场风险智能评估
// ----------------------------------------------------
function RetailerRisk({ tourAction }: { tourAction?: string }) {
  const pieData = [{ name: '合规经营 (低)', value: 890 }, { name: '日常关注 (中)', value: 89 }, { name: '严重预警 (高)', value: 21 }];
  const COLORS = ['#22c55e', '#f97316', '#ef4444'];

  return (
    <div className="flex flex-col h-full gap-3 animate-in fade-in zoom-in-95 duration-300">
      <div className="glass-card p-4 shrink-0 flex items-center justify-between border-t-4 border-[#004098]">
         <div className="flex gap-4 items-center flex-1">
           <input type="text" placeholder="零售户名称/许可证号..." className="border border-gray-300 px-3 py-1.5 rounded text-sm w-64"/>
           <select className="border border-gray-300 px-3 py-1.5 rounded text-sm bg-white"><option>全部风险状态</option><option>高风险预警</option></select>
           <button className="bg-[#004098] text-white px-6 py-1.5 rounded text-sm font-bold shadow-sm">智能筛选</button>
         </div>
         <button className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-1.5 rounded text-sm font-bold flex items-center hover:bg-purple-100"><TrendingUp className="w-4 h-4 mr-1.5"/> AI 风险趋势预测 (3个月)</button>
      </div>

      <div className="flex-1 flex gap-3 overflow-hidden">
        {/* 左侧主体列表区 */}
        <div className="flex-[7] flex flex-col gap-3 overflow-hidden">
           <div className="glass-card p-3 shrink-0 flex items-center justify-between">
              <div className="flex items-center">
                 <div className="w-16 h-16 mr-4"><ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" innerRadius="60%" outerRadius="100%">{pieData.map((e,i)=><Cell key={i} fill={COLORS[i]}/>)}</Pie></PieChart></ResponsiveContainer></div>
                 <div>
                   <h3 className="font-bold text-gray-800 text-sm">市场零售户大盘风控状态</h3>
                   <div className="flex gap-4 text-xs mt-1 font-mono">
                     <span className="text-green-600 font-bold">● 测试库基准: 890户</span>
                     <span className="text-orange-600 font-bold">● 中度预警: 89户</span>
                     <span className="text-red-600 font-bold">● 高度监管: 21户</span>
                   </div>
                 </div>
              </div>
           </div>

           <div className="glass-card flex-1 overflow-auto border border-gray-200">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-100 sticky top-0 shadow-sm z-10"><tr className="text-gray-600 border-b border-gray-200">
                  <th className="p-3 font-bold w-10"><input type="checkbox"/></th>
                  <th className="p-3 font-bold">主体编码 / 名称</th>
                  <th className="p-3 font-bold">AI风险评分</th>
                  <th className="p-3 font-bold">动态风控标签</th>
                  <th className="p-3 font-bold">预警状态</th>
                  <th className="p-3 font-bold text-right">管理操作</th>
                </tr></thead>
                <tbody>
                  {[
                    { id: '3601001001', name: '老张烟酒城', score: 95, tags: ['高危售假', '多次处罚'], alert: '紧急', c: 'red' },
                    { id: '3601002234', name: '万家便利网点', score: 82, tags: ['超量订货', '跨区疑点'], alert: '一般', c: 'orange' },
                    { id: '3601008891', name: '便民副食小休店', score: 25, tags: ['合规经营'], alert: "无", c: 'green' },
                  ].map((r,i)=>(
                    <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer">
                      <td className="p-3"><input type="checkbox"/></td>
                      <td className="p-3"><div className="font-bold text-[#004098]">{r.name}</div><div className="text-xs font-mono text-gray-500 mt-0.5">{r.id}</div></td>
                      <td className="p-3"><div className={cn("text-xl font-bold font-mono", r.c==='red'?'text-red-600':r.c==='orange'?'text-orange-600':'text-green-600')}>{r.score}</div></td>
                      <td className="p-3 flex gap-1 items-center h-full pt-4">{r.tags.map(t=><span key={t} className="bg-gray-100 border border-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded">{t}</span>)}</td>
                      <td className="p-3"><div className={cn("px-2 py-1 rounded text-xs font-bold inline-block border", r.c==='red'?'bg-red-50 text-red-600 border-red-200':r.c==='orange'?'bg-orange-50 text-orange-600 border-orange-200':'bg-gray-50 text-gray-400 border-gray-200')}>{r.alert}预警</div></td>
                      <td className="p-3 text-right"><button className="text-[#004098] font-bold text-xs hover:underline bg-white border border-[#004098] px-3 py-1 rounded">详情及建档</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* 右侧预警推送 */}
        <div className="flex-[3] glass-card flex flex-col overflow-hidden bg-red-50/20 border border-red-100">
           <div className="p-3 bg-red-600 text-white font-bold text-sm flex items-center justify-between shrink-0 shadow-md">
             <div className="flex items-center"><ShieldAlert className="w-4 h-4 mr-1.5" /> 高优先级处理队列</div>
             <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">待处理 12 项</span>
           </div>
           <div className="flex-1 overflow-auto p-4 space-y-3">
              {[1,2,3].map(i=>(
                 <div key={i} className="bg-white border border-red-200 rounded p-3 shadow-sm hover:shadow-md cursor-pointer group transition-all">
                    <div className="flex justify-between items-start mb-2">
                       <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">Model 推送</span>
                       <span className="text-gray-400 text-[10px]">10分钟前</span>
                    </div>
                    <div className="font-bold text-sm text-gray-800 mb-1">系统预警：异常销量激增</div>
                    <div className="text-xs text-gray-600 mb-3 line-clamp-2">“老王茶酒超市” 近3日中华烟销量超历史均值400%，且物流终端数据显示多批异地包裹集中入库。</div>
                    <div className="flex gap-2">
                       <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] py-1 rounded font-bold hover:bg-blue-100">派发核查工单</button>
                       <button className="flex-1 bg-gray-50 text-gray-500 border border-gray-200 text-[10px] py-1 rounded hover:bg-gray-100">标记已阅</button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3.2.4 涉烟指标智能解析与自然语言问答
// ----------------------------------------------------
function MetricsQA({ tourAction }: { tourAction?: string }) {
  const [qaHistory, setQaHistory] = useState([
     { q: '上个月江汉区无证运输案件占比多少？', a: '经过模型检索底层数据：上月江汉区共发生无证运输案件45起，占全区涉烟案件总数（120起）的 37.5%。', type: 'text' },
     { q: '画出该区各类案件的分布图', a: '', type: 'chart' }
  ]);

  return (
    <div className="flex h-full gap-3 animate-in fade-in zoom-in-95 duration-300">
       {/* 左侧指标库 30% */}
       <div className="w-[30%] glass-card flex flex-col overflow-hidden bg-white">
          <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-[#004098] flex justify-between items-center text-sm">
             核心业务指标词典 <button className="bg-white border text-xs px-2 py-0.5 rounded text-gray-600">+ 自定义</button>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-4">
             <div>
                <h4 className="text-xs font-bold text-gray-500 mb-2 border-b pb-1 uppercase tracking-wider">案件类指标</h4>
                <div className="space-y-1.5">
                   <div className="border border-[#004098] bg-blue-50 text-[#004098] font-bold text-xs p-2 rounded cursor-pointer shadow-sm flex items-center justify-between">案件办结率 <ChevronRight className="w-3.5 h-3.5"/></div>
                   <div className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs p-2 rounded cursor-pointer flex items-center justify-between">案值总额评估 <ChevronRight className="w-3.5 h-3.5 opacity-30"/></div>
                </div>
             </div>
             <div>
                <h4 className="text-xs font-bold text-gray-500 mb-2 border-b pb-1 uppercase tracking-wider">市场零售户类指标</h4>
                <div className="space-y-1.5">
                   <div className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs p-2 rounded cursor-pointer">整体合规率</div>
                   <div className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs p-2 rounded cursor-pointer">异常订货频次</div>
                </div>
             </div>
          </div>
       </div>

       {/* 右侧解析与问答 70% */}
       <div className="flex-1 flex flex-col gap-3">
          {/* 问答区 */}
          <div className="h-[45%] glass-card flex flex-col overflow-hidden bg-[#f4f7fb] border border-blue-100">
             <div className="p-3 border-b border-blue-200 bg-white shadow-sm flex items-center text-[#004098] font-bold text-sm shrink-0">
               <Bot className="w-5 h-5 mr-2 text-[#004098]" /> 涉烟业务大模型智能分析助手
             </div>
             
             <div className="flex-1 overflow-auto p-4 space-y-4">
                {qaHistory.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                     <div className="flex justify-end">
                       <div className="bg-[#004098] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm shadow inline-max-w-[70%] leading-relaxed">{item.q}</div>
                     </div>
                     <div className="flex justify-start items-start gap-2">
                       <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 mt-1"><BrainCircuit className="w-4 h-4 text-[#004098]"/></div>
                       <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-gray-700 shadow-sm inline-max-w-[80%] leading-relaxed">
                          {item.type === 'text' ? item.a : (
                             <div className="w-[300px] h-[180px]">
                                <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:'无证运输',value:45},{name:'其他',value:75}]} cx="50%" cy="50%" innerRadius={30} outerRadius={60} fill="#f97316" dataKey="value"><Cell fill="#ef4444"/><Cell fill="#cbd5e1"/></Pie><Tooltip/></PieChart></ResponsiveContainer>
                             </div>
                          )}
                       </div>
                     </div>
                  </div>
                ))}
             </div>
             
             <div className="p-3 bg-white border-t border-gray-200 shrink-0">
                <div className="flex gap-2 relative">
                   <input type="text" placeholder="使用自然语言提问（支持上下文追问，如：“生成该数据的趋势图”）..." className="w-full bg-gray-50 border border-gray-300 rounded-full px-5 py-2.5 text-sm focus:border-[#004098] focus:ring-1 focus:ring-[#004098] outline-none" />
                   <button className="absolute right-1 top-1 bottom-1 bg-[#004098] text-white px-4 rounded-full font-bold hover:bg-blue-900 transition-colors shadow-sm"><Send className="w-4 h-4" /></button>
                </div>
             </div>
          </div>

          {/* 指标深度解析面板 */}
          <div className="flex-1 glass-card flex flex-col overflow-hidden bg-white p-4">
             <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
               <h3 className="font-bold text-[#004098] text-lg flex items-center"><FileText className="w-5 h-5 mr-2" /> 案件办结率 - 智能深度解析报告</h3>
               <button className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-xs font-bold border border-blue-200 hover:bg-blue-100 flex items-center"><Download className="w-3.5 h-3.5 mr-1" /> 导出Word</button>
             </div>
             
             <div className="flex gap-4 flex-1">
               <div className="flex-1 flex flex-col gap-3">
                 <div className="bg-gray-50 p-3 rounded border border-gray-200 text-xs">
                   <div className="font-bold text-gray-800 mb-1">指标概况 (计算口径)</div>
                   <p className="text-gray-600 font-mono">案件办结率 = (统计周期内已结案数量 / 同期总立案数量) * 100%</p>
                 </div>
                 <div className="bg-gray-50 p-3 rounded border border-gray-200 text-xs flex-1 flex flex-col">
                   <div className="font-bold text-gray-800 mb-2">近6个月趋势演变大盘</div>
                   <div className="flex-1"><ResponsiveContainer width="100%" height="100%"><LineChart data={[{name:'1月',rate:60},{name:'2月',rate:65},{name:'3月',rate:72},{name:'4月',rate:85}]}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Line type="monotone" dataKey="rate" stroke="#004098" strokeWidth={3} dot={{r:4, fill:'#004098'}}/></LineChart></ResponsiveContainer></div>
                 </div>
               </div>
               
               <div className="flex-1 bg-blue-50/50 p-4 rounded border border-blue-100 flex flex-col">
                  <div className="font-bold text-gray-800 mb-3 text-sm flex items-center"><Activity className="w-4 h-4 mr-1 text-[#004098]"/> AI 核心数据研判结论</div>
                  <div className="space-y-3 flex-1 overflow-auto">
                    <div className="bg-white p-3 rounded shadow-sm text-xs leading-relaxed border border-gray-200">
                      <span className="font-bold text-green-600">办理效能呈上升趋势:</span> 本月整体办结率达到 <span className="font-bold text-xl">85%</span>，环比大幅上升18%，表明整体稽查结案流程得到显著优化。
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm text-xs leading-relaxed border border-gray-200">
                      <span className="font-bold text-orange-600">结构性延迟预警:</span> 虽然总办结率较高，但深度分析发现**跨省走私类大案**的平均结案周期被拉长了14天，拉远了该单一维度的办结率。建议专项督办此类积压案件。
                    </div>
                  </div>
               </div>
             </div>
          </div>
       </div>
    </div>
  );
}

// ----------------------------------------------------
// 3.2.5 涉烟违法趋势智能预测
// ----------------------------------------------------
function TrendPrediction({ tourAction }: { tourAction?: string }) {
  const lineData = [
    { month: '4月', 无证运输: 120, 假烟: 80, 走私: 30 },
    { month: '6月', 无证运输: 140, 假烟: 75, 走私: 35 },
    { month: '8月', 无证运输: 180, 假烟: 60, 走私: 50 },
    { month: '10月', 无证运输: 210, 假烟: 55, 走私: 80 },
    { month: '12月', 无证运输: 250, 假烟: 40, 走私: 110 }
  ];

  return (
    <div className="flex flex-col h-full gap-3 animate-in fade-in zoom-in-95 duration-300">
      <div className="glass-card p-4 shrink-0 flex items-end gap-4 border-l-4 border-purple-600">
        <div className="flex-1 grid grid-cols-3 gap-4">
          <div><label className="text-[11px] font-bold text-gray-600 mb-1 flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1 text-purple-600"/>长效时间轴预测</label><select className="w-full border p-2 rounded text-sm bg-white font-bold text-purple-800"><option>未来 12 个月 (推演模式)</option></select></div>
          <div><label className="text-[11px] font-bold text-gray-600 mb-1 block">焦点聚类维度 (多选)</label><select className="w-full border p-2 rounded text-sm bg-white"><option>高频案件类型、高危发案区域</option></select></div>
          <div><label className="text-[11px] font-bold text-gray-600 mb-1 block">引入宏观影响因子调整</label><select className="w-full border p-2 rounded text-sm bg-white"><option>引入: 节假日周期规律 / 专项行动政策</option></select></div>
        </div>
        <div className="flex gap-2">
           <button className="bg-purple-700 text-white px-6 py-2 rounded text-sm font-bold shadow-md hover:bg-purple-800 flex items-center"><BrainCircuit className="w-4 h-4 mr-2"/> 重新生成预测推演</button>
        </div>
      </div>

      <div className="flex-1 flex gap-3 overflow-hidden">
        {/* 左侧 图表矩阵 55% */}
        <div className="flex-[5.5] glass-card flex flex-col p-4 bg-gray-50 border border-gray-200">
           <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="font-bold text-gray-800 text-sm flex items-center"><BarChart3 className="w-4 h-4 mr-2 text-purple-600"/> 大模型衍生图表矩阵库</h3>
              <div className="flex gap-2 text-gray-500"><Maximize2 className="w-4 h-4 hover:text-purple-600 cursor-pointer text-gray-400"/><Download className="w-4 h-4 hover:text-purple-600 cursor-pointer text-gray-400"/></div>
           </div>
           
           <div className="flex-1 grid grid-rows-2 gap-4">
              <div className="bg-white p-3 rounded shadow-sm border border-gray-200 flex flex-col">
                 <div className="text-xs font-bold text-gray-600 mb-2">多类违法案件未来爆发趋势 (推演线)</div>
                 <ResponsiveContainer width="100%" height="100%"><LineChart data={lineData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Line type="monotone" dataKey="无证运输" stroke="#ef4444" strokeWidth={3}/><Line type="monotone" dataKey="走私" stroke="#004098" strokeWidth={2}/><Line type="monotone" dataKey="假烟" stroke="#22c55e" strokeWidth={2}/></LineChart></ResponsiveContainer>
              </div>
              <div className="flex gap-4">
                 <div className="flex-1 bg-white p-3 rounded shadow-sm border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-2 left-2 text-xs font-bold text-gray-600 z-10">区域危情散布预测</div>
                    {/* Mock Heatmap image concept */}
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/40 via-orange-300/20 to-gray-100 flex items-center justify-center">
                       <MapIcon className="w-16 h-16 text-gray-300 opacity-50"/>
                       <div className="absolute bg-white/90 text-red-700 font-bold px-2 py-0.5 rounded text-[10px] shadow border border-red-200">沿海码头区极高危</div>
                    </div>
                 </div>
                 <div className="flex-1 bg-white p-3 rounded shadow-sm border border-gray-200 flex flex-col">
                    <div className="text-xs font-bold text-gray-600 mb-2">预估涉案体量 (按万支段)</div>
                    <ResponsiveContainer width="100%" height="100%"><BarChart data={lineData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><Tooltip/><Bar dataKey="无证运输" stackId="a" fill="#004098" /><Bar dataKey="走私" stackId="a" fill="#f97316" /></BarChart></ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>

        {/* 右侧 判决建议 45% */}
        <div className="flex-[4.5] glass-card flex flex-col overflow-hidden border border-purple-200 bg-white">
           <div className="bg-purple-700 text-white p-4 shrink-0 flex justify-between items-center shadow-md">
             <h3 className="font-bold text-sm tracking-wide flex items-center"><Target className="w-5 h-5 mr-2 text-purple-200"/> AI 战略战术输出评估报告</h3>
             <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-xs font-bold transition-colors">导出PDF简报</button>
           </div>
           
           <div className="flex bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-500 shrink-0">
             <button className="flex-1 py-3 border-b-2 border-purple-700 text-purple-800 bg-purple-50">预测结论定调</button>
             <button className="flex-1 py-3 border-b-2 border-transparent">网格打击方向规划</button>
             <button className="flex-1 py-3 border-b-2 border-transparent">执法资源配给推演</button>
           </div>

           <div className="flex-1 p-5 overflow-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
              <div className="absolute inset-0 bg-white/90"></div>
              
              <div className="relative z-10 space-y-5">
                <div className="border-l-4 border-red-500 pl-3">
                  <h4 className="text-sm font-bold text-gray-800 mb-1">大盘核心走向预测</h4>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify">结合历年案件高峰模型与宏观政策因素，模型推演得出：未来 **12 个月内**，传统低端假烟案发量将出现 **15% 以上的阶梯式下降**。与之相对照，通过沿海城市陆路辐射内陆的“品牌走私”“大规模无证跨城运输”将会在下半年（尤其8月至年末）迎来极具破坏力的高峰期。</p>
                </div>

                <div className="border-l-4 border-orange-500 pl-3 bg-orange-50/50 p-3 rounded-r-lg border border-l-0 border-orange-100">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">区域阵地沦陷高危预警</h4>
                  <ul className="text-sm text-gray-700 space-y-2 font-mono">
                    <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> 临海保税物流园区辐射带</li>
                    <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> 国道干线交汇区域的隐藏仓</li>
                  </ul>
                </div>

                <div className="border border-purple-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white shadow-sm mt-4">
                  <h4 className="font-bold text-purple-800 text-sm mb-3 flex items-center"><Layers className="w-4 h-4 mr-2"/> 第1与第2战局阶段核心战略建议</h4>
                  <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
                    <p><span className="bg-purple-100 text-purple-800 px-2 rounded font-bold mr-1">前3个月</span> 针对传统假烟残余市场开展最后清扫，重点检查城乡接合部零售终端。</p>
                    <p><span className="bg-purple-100 text-purple-800 px-2 rounded font-bold mr-1">第4-6个月</span> 必须完成监管重心转移，战略预备队应向高速交通枢纽、大型物流骨干分拨中心倾斜，建立 24 小时货车识别预警岗。</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
