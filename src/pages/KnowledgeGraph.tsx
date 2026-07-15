import { useState, useEffect } from 'react';
import { Search, User, Truck, FileText, MapPin, Network, Maximize2, RefreshCw, Star, Map as MapIcon, Clock, ShieldAlert, BarChart3, PieChart as PieChartIcon, Download, Printer, ArrowRightLeft, FileSearch, CheckCircle2, Sparkles, BrainCircuit, Activity, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, Polyline, CircleMarker, Circle, Popup, Marker, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function KnowledgeGraph() {
  const [activeTab, setActiveTab] = useState<'person' | 'vehicle' | 'violation'>('person');
  const [tourAction, setTourAction] = useState<string>('');

  useEffect(() => {
    const handleAction = (e: any) => {
      const action = e.detail;
      setTourAction(action);
      if (action === 'graph-person') {
        setActiveTab('person');
      } else if (action === 'graph-vehicle') {
        setActiveTab('vehicle');
      } else if (action === 'graph-violation') {
        setActiveTab('violation');
      }
    };
    window.addEventListener('tour-action', handleAction);
    return () => window.removeEventListener('tour-action', handleAction);
  }, []);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* 模块导航 */}
      <div className="glass-card p-3 shrink-0 flex items-center gap-2">
        <button onClick={() => setActiveTab('person')} className={cn("px-4 py-2 font-bold text-sm rounded transition-colors", activeTab === 'person' ? "bg-[#004098] text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100")}>
          <User className="w-4 h-4 inline mr-2" />
          涉案人员全维度检索
        </button>
        <button onClick={() => setActiveTab('vehicle')} className={cn("px-4 py-2 font-bold text-sm rounded transition-colors", activeTab === 'vehicle' ? "bg-[#004098] text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100")}>
          <Truck className="w-4 h-4 inline mr-2" />
          涉案车辆智能溯源
        </button>
        <button onClick={() => setActiveTab('violation')} className={cn("px-4 py-2 font-bold text-sm rounded transition-colors", activeTab === 'violation' ? "bg-[#004098] text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100")}>
          <BrainCircuit className="w-4 h-4 inline mr-2" />
          违规信息智能整合 (AI)
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'person' && <PersonSearch tourAction={tourAction} />}
        {activeTab === 'vehicle' && <VehicleSearch tourAction={tourAction} />}
        {activeTab === 'violation' && <ViolationSearch tourAction={tourAction} />}
      </div>
    </div>
  );
}

// ==========================================
// 3.1.1 涉案人员全维度检索
// ==========================================
function PersonSearch({ tourAction }: { tourAction?: string }) {
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [activeNode, setActiveNode] = useState<any>(null);
  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  const showToast = (msg: string) => {
    setToast({show: true, msg});
    setTimeout(() => setToast({show: false, msg: ''}), 3000);
  };

  const nodeDetails = {
    case1: { title: '假烟案 (AJ-20261011)', type: '案件', desc: '涉案金额20万元，在白云区某仓库查获假冒伪劣卷烟共计1200条。目前已立案并逮捕3名主要嫌疑人。', date: '2026-10-11' },
    person1: { title: '张三', type: '同案人员', desc: '骨干人员，负责跨省运输。曾有2次非法经营前科。', id: '4401*****123' },
    person2: { title: '王麻子', type: '同案人员', desc: '分销下线，负责将假烟销往多家便利店。', id: '4401*****456' },
    vehicle: { title: '粤A·88***', type: '涉案车辆', desc: '长期活跃于物流园，用于跨市运输。轨迹高频出现于凌晨。', owner: '李四老婆' }
  };

  useEffect(() => {
    if (tourAction === 'graph-person') {
      setHasSearched(false);
      const t1 = setTimeout(() => {
        setHasSearched(true);
      }, 2500); // 配合语音："当我们输入特定嫌疑人信息进行搜索"
      const t2 = setTimeout(() => {
        setActiveNode(nodeDetails.vehicle);
      }, 6000); // 配合语音："涉案车辆"
      const t3 = setTimeout(() => {
        setActiveNode(nodeDetails.case1);
      }, 10000); // 配合语音："资金往来的可视化关联网络"
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [tourAction]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setSelectedEntity(null);
    setActiveNode(null);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* 检索入口 */}
      <div className="glass-card p-4 shrink-0">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">身份证号</label>
              <input type="text" placeholder="输入18位身份证号..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#004098] focus:ring-1 focus:ring-[#004098] outline-none bg-gray-50/50" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">姓名</label>
              <input type="text" placeholder="输入嫌疑人姓名 (如: 李某某)..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#004098] focus:ring-1 focus:ring-[#004098] outline-none bg-gray-50/50" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">手机号</label>
              <input type="text" placeholder="输入手机号..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#004098] focus:ring-1 focus:ring-[#004098] outline-none bg-gray-50/50" />
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
             <button type="submit" className="bg-[#004098] hover:bg-blue-900 text-white px-6 py-2 rounded text-sm font-bold flex items-center transition-colors">
               <Search className="w-4 h-4 mr-1.5" /> 智能检索
             </button>
             <button type="button" onClick={() => { setHasSearched(false); setSelectedEntity(null); setActiveNode(null); }} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm font-bold transition-colors">重置</button>
          </div>
        </form>
      </div>

      {hasSearched ? (
        <div className="flex-1 flex gap-3 overflow-hidden">
          {/* 左栏 30% */}
          <div className="w-[30%] flex flex-col gap-3">
             <div className="glass-card p-4 shrink-0 relative overflow-hidden group border-t-4 border-[#004098]">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-yellow-500 transition-colors" title="收藏" onClick={() => showToast('已添加至重点人员关注库')}>
                   <Star className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-2xl shrink-0"><User className="w-8 h-8"/></div>
                   <div>
                      <h3 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">李某某 <Sparkles className="w-4 h-4 text-purple-600" /></h3>
                      <p className="text-sm text-gray-500 font-mono mt-0.5">440304******1234</p>
                   </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700 border-t border-gray-100 pt-3">
                   <p><span className="text-gray-500 w-20 inline-block font-bold text-xs uppercase">户籍地</span> 湖北省武汉市武昌区</p>
                   <p><span className="text-gray-500 w-20 inline-block font-bold text-xs uppercase">活动区域</span> 东西湖物流园、汉口站</p>
                   <p><span className="text-gray-500 w-20 inline-block font-bold text-xs uppercase">职业标签</span> <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs border border-red-200">无业/涉案前科</span></p>
                </div>
             </div>
             
             <div className="glass-card flex-1 p-4 grid grid-cols-2 gap-3 content-start relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 to-transparent pointer-events-none z-0"></div>
               <div className="col-span-2 text-[10px] text-purple-600 font-bold mb-1 flex items-center bg-purple-50 p-1.5 rounded border border-purple-100 shadow-sm relative z-10"><BrainCircuit className="w-3 h-3 mr-1"/> AI 深度挖掘关联节点</div>
               <div className="bg-blue-50/50 border border-blue-100 p-3 rounded text-center cursor-pointer hover:bg-blue-100 transition-all shadow-sm relative z-10" onClick={() => setSelectedEntity('cases')}>
                 <div className="text-gray-500 text-xs font-bold mb-1 flex items-center justify-center"><FileSearch className="w-3 h-3 mr-1"/> 案件参与</div>
                 <div className="text-2xl font-bold text-[#004098] underline decoration-blue-300">3</div>
               </div>
               <div className="bg-orange-50/50 border border-orange-100 p-3 rounded text-center cursor-pointer hover:bg-orange-100 transition-all shadow-sm" onClick={() => setSelectedEntity('vehicles')}>
                 <div className="text-gray-500 text-xs font-bold mb-1 flex items-center justify-center"><Truck className="w-3 h-3 mr-1"/> 关联车辆</div>
                 <div className="text-2xl font-bold text-orange-600 underline decoration-orange-300">2</div>
               </div>
               <div className="bg-red-50/50 border border-red-100 p-3 rounded text-center cursor-pointer hover:bg-red-100 transition-all shadow-sm" onClick={() => setSelectedEntity('violations')}>
                 <div className="text-gray-500 text-xs font-bold mb-1 flex items-center justify-center"><ShieldAlert className="w-3 h-3 mr-1"/> 违规处罚</div>
                 <div className="text-2xl font-bold text-red-600 underline decoration-red-300">5</div>
               </div>
               <div className="bg-purple-50/50 border border-purple-100 p-3 rounded text-center cursor-pointer hover:bg-purple-100 transition-all shadow-sm" onClick={() => setSelectedEntity('persons')}>
                 <div className="text-gray-500 text-xs font-bold mb-1 flex items-center justify-center"><Network className="w-3 h-3 mr-1"/> 紧密同案人</div>
                 <div className="text-2xl font-bold text-purple-600 underline decoration-purple-300">4</div>
               </div>
             </div>
          </div>

          {/* 右栏 70% */}
          <div className="w-[70%] glass-card flex flex-col relative overflow-hidden bg-[#f8fafc]">
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button className="bg-white p-2 rounded shadow-sm border border-gray-200 hover:text-[#004098] transition-colors" title="图谱缩放" onClick={() => showToast('图谱缩放模式已开启')}><Maximize2 className="w-4 h-4" /></button>
              <button className="bg-white p-2 rounded shadow-sm border border-gray-200 hover:text-[#004098] transition-colors" title="图谱导出" onClick={() => showToast('已成功导出高清知识图谱 PNG 文件')}><Download className="w-4 h-4" /></button>
              <button className="bg-white p-2 rounded shadow-sm border border-gray-200 hover:text-[#004098] transition-colors" title="详情打印" onClick={() => showToast('打印机配置已调用，正在准备打印')}><Printer className="w-4 h-4" /></button>
            </div>
            
            {selectedEntity === 'cases' ? (
              <div className="absolute inset-0 bg-white z-30 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-sm text-gray-700 flex items-center"><FileText className="w-4 h-4 mr-2" /> 关联案件清单 (3起)</h3>
                    <button className="text-xs text-white bg-[#004098] px-3 py-1.5 rounded font-bold hover:bg-blue-900" onClick={() => setSelectedEntity(null)}>返回全景图谱</button>
                 </div>
                 <div className="flex-1 overflow-auto p-4">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600">
                          <th className="p-3 font-bold border-b border-gray-200">案件编号</th>
                          <th className="p-3 font-bold border-b border-gray-200">涉案时间</th>
                          <th className="p-3 font-bold border-b border-gray-200">案件类型</th>
                          <th className="p-3 font-bold border-b border-gray-200">处理状态</th>
                          <th className="p-3 font-bold border-b border-gray-200 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1,2,3].map(i => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                            <td className="p-3 text-gray-800 font-mono font-bold">AJ-2026101{i}</td>
                            <td className="p-3 text-gray-600">2026-10-1{i} 14:00</td>
                            <td className="p-3 text-gray-600">无证运输 / 涉假</td>
                            <td className="p-3"><span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-200 font-bold">已结案</span></td>
                            <td className="p-3 text-right text-[#004098] cursor-pointer font-bold hover:underline" onClick={() => showToast(`正在提取案件 [AJ-2026101${i}] 的完整数字化卷宗...`)}>查看卷宗</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </div>
            ) : selectedEntity === 'vehicles' ? (
              <div className="absolute inset-0 bg-white z-30 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-sm text-gray-700 flex items-center"><Truck className="w-4 h-4 mr-2" /> 关联车辆清单 (2辆)</h3>
                    <button className="text-xs text-white bg-[#004098] px-3 py-1.5 rounded font-bold hover:bg-blue-900" onClick={() => setSelectedEntity(null)}>返回全景图谱</button>
                 </div>
                 <div className="flex-1 overflow-auto p-4">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600">
                          <th className="p-3 font-bold border-b border-gray-200">车牌号码</th>
                          <th className="p-3 font-bold border-b border-gray-200">车型</th>
                          <th className="p-3 font-bold border-b border-gray-200">关系</th>
                          <th className="p-3 font-bold border-b border-gray-200">风险等级</th>
                          <th className="p-3 font-bold border-b border-gray-200 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                          <td className="p-3 text-gray-800 font-mono font-bold">鄂A·88***</td>
                          <td className="p-3 text-gray-600">轻型厢式货车</td>
                          <td className="p-3 text-gray-600">本人名下</td>
                          <td className="p-3"><span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-200 font-bold">高风险</span></td>
                          <td className="p-3 text-right text-[#004098] cursor-pointer font-bold hover:underline" onClick={() => showToast('正在跳转该车辆轨迹追踪分析...')}>追踪轨迹</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                          <td className="p-3 text-gray-800 font-mono font-bold">鄂A·99***</td>
                          <td className="p-3 text-gray-600">小型面包车</td>
                          <td className="p-3 text-gray-600">亲属名下</td>
                          <td className="p-3"><span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs border border-orange-200 font-bold">中风险</span></td>
                          <td className="p-3 text-right text-[#004098] cursor-pointer font-bold hover:underline" onClick={() => showToast('正在跳转该车辆轨迹追踪分析...')}>追踪轨迹</td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
              </div>
            ) : selectedEntity === 'violations' ? (
              <div className="absolute inset-0 bg-white z-30 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-sm text-gray-700 flex items-center"><ShieldAlert className="w-4 h-4 mr-2" /> 违规处罚台账 (5条)</h3>
                    <button className="text-xs text-white bg-[#004098] px-3 py-1.5 rounded font-bold hover:bg-blue-900" onClick={() => setSelectedEntity(null)}>返回全景图谱</button>
                 </div>
                 <div className="flex-1 overflow-auto p-4">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600">
                          <th className="p-3 font-bold border-b border-gray-200">决定书文号</th>
                          <th className="p-3 font-bold border-b border-gray-200">处罚日期</th>
                          <th className="p-3 font-bold border-b border-gray-200">处罚事由</th>
                          <th className="p-3 font-bold border-b border-gray-200">处罚结果</th>
                          <th className="p-3 font-bold border-b border-gray-200 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1,2,3,4,5].map(i => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                            <td className="p-3 text-gray-800 font-mono font-bold">罚决字[2026]第00{i}号</td>
                            <td className="p-3 text-gray-600">2026-0{i}-15</td>
                            <td className="p-3 text-gray-600">无证运输烟草专卖品</td>
                            <td className="p-3 text-red-600 font-bold">罚款 5,000 元</td>
                            <td className="p-3 text-right text-[#004098] cursor-pointer font-bold hover:underline" onClick={() => showToast(`正在提取文书 [罚决字[2026]第00${i}号] 原件扫描件...`)}>查看文书</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </div>
            ) : selectedEntity === 'persons' ? (
              <div className="absolute inset-0 bg-white z-30 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-sm text-gray-700 flex items-center"><Network className="w-4 h-4 mr-2" /> 紧密同案人清单 (4人)</h3>
                    <button className="text-xs text-white bg-[#004098] px-3 py-1.5 rounded font-bold hover:bg-blue-900" onClick={() => setSelectedEntity(null)}>返回全景图谱</button>
                 </div>
                 <div className="flex-1 overflow-auto p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {['张三 (同案司机)', '王麻子 (分销下线)', '李四 (资金往来)', '赵某某 (频繁接触)'].map((person, idx) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded flex gap-4 items-center hover:border-[#004098] transition-colors cursor-pointer" onClick={() => showToast(`正在切换中心节点至: ${person}`)}>
                          <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center shrink-0"><User className="w-6 h-6"/></div>
                          <div>
                            <div className="font-bold text-sm text-gray-800">{person}</div>
                            <div className="text-xs text-gray-500 mt-1">关联置信度: <span className="text-green-600 font-bold">98%</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            ) : (
              <div className="flex-1 relative flex items-center justify-center">
                 {/* 知识图谱连线 */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <line x1="50%" y1="50%" x2="30%" y2="20%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    <line x1="50%" y1="50%" x2="70%" y2="25%" stroke="#ef4444" strokeWidth="3" />
                    <line x1="50%" y1="50%" x2="25%" y2="70%" stroke="#8b5cf6" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="40%" y2="80%" stroke="#8b5cf6" strokeWidth="3" />
                    <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#94a3b8" strokeWidth="2" />
                 </svg>
                 
                 {/* 中心节点 */}
                 <div className="absolute z-10 pb-6 group cursor-pointer" onClick={() => setActiveNode(null)}>
                    <div className="w-20 h-20 bg-[#004098] rounded-full flex items-center justify-center shadow-lg border-4 border-white ai-pulse relative z-10">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow border border-gray-200 text-sm font-bold whitespace-nowrap text-[#004098]">李某某 (核心)</div>
                 </div>

                 {/* 外围节点 */}
                 <GraphNode top="20%" left="30%" icon={<Truck/>} text="鄂A·88***" sub="涉案车辆" color="orange" onClick={() => setActiveNode(nodeDetails.vehicle)} active={activeNode === nodeDetails.vehicle} />
                 <GraphNode top="25%" left="70%" icon={<FileSearch/>} text="AJ-20261011" sub="重大假烟案" color="red" size="lg" onClick={() => setActiveNode(nodeDetails.case1)} active={activeNode === nodeDetails.case1} />
                 <GraphNode top="70%" left="25%" icon={<User/>} text="张三" sub="同案人员" color="purple" onClick={() => setActiveNode(nodeDetails.person1)} active={activeNode === nodeDetails.person1} />
                 <GraphNode top="80%" left="40%" icon={<User/>} text="王麻子" sub="同案分销" color="purple" onClick={() => setActiveNode(nodeDetails.person2)} active={activeNode === nodeDetails.person2} />
                 <GraphNode top="75%" left="75%" icon={<FileText/>} text="罚决字22号" sub="违规历史" color="gray" onClick={() => setActiveNode({ title: '处罚决定书22号', type: '处罚', desc: '因无证经营违规售卖卷烟被罚款5000元。'})} />

                 {/* 节点详情悬浮卡片 */}
                 {activeNode && (
                   <div className="absolute right-4 bottom-4 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-30 animate-in slide-in-from-right-4">
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-[#004098] text-sm">{activeNode.title}</h4>
                       <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded border border-gray-200">{activeNode.type}</span>
                     </div>
                     <p className="text-xs text-gray-600 leading-relaxed mb-3">{activeNode.desc}</p>
                     {(activeNode.date || activeNode.id || activeNode.owner) && (
                       <div className="bg-gray-50 p-2 rounded text-[11px] text-gray-500 font-mono space-y-1">
                         {activeNode.date && <div>发生时间: {activeNode.date}</div>}
                         {activeNode.id && <div>证件号: {activeNode.id}</div>}
                         {activeNode.owner && <div>所有人: {activeNode.owner}</div>}
                       </div>
                     )}
                     <button className="mt-3 w-full bg-[#004098] text-white text-xs py-1.5 rounded font-bold hover:bg-blue-900 transition-colors" onClick={() => showToast(`AI 档案抽取中：正在打开【${activeNode.title}】的详情档案册...`)}>查看完整档案</button>
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 glass-card flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-60 z-0"></div>
           <div className="relative z-10 flex flex-col items-center">
             <BrainCircuit className="w-24 h-24 mb-4 text-[#004098] opacity-20 ai-pulse" />
             <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-500 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-purple-400" /> 等待 AI 大模型指令输入</p>
             <p className="text-sm mt-3 text-gray-500 font-medium">请在上方输入准确或模糊条件，引擎将自动生成涉案人员【跨域多维画像核心图谱】</p>
           </div>
        </div>
      )}

      {/* Local Toast */}
      {toast.show && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3.1.2 涉案车辆智能溯源
// ==========================================
function VehicleSearch({ tourAction }: { tourAction?: string }) {
  const [hasSearched, setHasSearched] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('cases');
  const [activeCaseDetails, setActiveCaseDetails] = useState<any>(null);
  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  const showToast = (msg: string) => {
    setToast({show: true, msg});
    setTimeout(() => setToast({show: false, msg: ''}), 3000);
  };

  useEffect(() => {
    if (tourAction === 'graph-vehicle') {
      setHasSearched(false);
      setActiveCaseDetails(null);
      setActiveSubTab('cases');
      const t1 = setTimeout(() => {
        setHasSearched(true);
      }, 1500); // "直接投射到真实地理空间中"
      const t2 = setTimeout(() => {
        setActiveCaseDetails({ id: 'AJ-WH20261120', date: '2026-11-20', type: '无证运输' });
      }, 7000); // "实现一键深挖与案件研判"
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [tourAction]);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* 检索入口 */}
      <div className="glass-card p-4 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); setHasSearched(true); }} className="flex gap-4 items-end">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">车牌号码</label>
              <input type="text" placeholder="如：鄂A·88888..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#004098] outline-none bg-gray-50 font-mono text-lg uppercase" defaultValue="鄂A·88888" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">车架号 (VIN)</label>
              <input type="text" placeholder="输入17位车架号..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#004098] outline-none bg-gray-50 uppercase" />
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
             <button type="submit" className="bg-[#004098] hover:bg-blue-900 text-white px-6 py-2 rounded text-sm font-bold flex items-center transition-colors"><Search className="w-4 h-4 mr-1.5" /> 智能溯源</button>
             <button type="button" onClick={() => { setHasSearched(false); setActiveCaseDetails(null); }} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm font-bold flex items-center transition-colors"><ArrowRightLeft className="w-4 h-4 mr-1.5" /> 换查人员</button>
          </div>
        </form>
      </div>

      {hasSearched && (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          {/* 上方基础信息 20% */}
          <div className="glass-card p-4 flex justify-between items-center shrink-0 border-l-4 border-[#004098]">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 rounded-lg flex items-center justify-center border border-orange-300 shadow-sm"><Truck className="w-7 h-7"/></div>
                   <div>
                     <h2 className="text-2xl font-bold font-mono text-gray-800 tracking-wider">鄂A·88888</h2>
                     <span className="bg-blue-100 text-[#004098] text-xs px-2 py-0.5 rounded border border-blue-200 mt-1 inline-block font-bold">轻型厢式货车 (蓝色牌照)</span>
                   </div>
                </div>
                <div className="border-l-2 border-gray-100 py-1 pl-6">
                   <div className="text-sm text-gray-500 mb-1 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1"/> 登记地: <span className="text-gray-800 font-bold ml-1">湖北省武汉市</span></div>
                   <div className="text-xs text-gray-500 mt-1">所有人: <span className="text-gray-800 font-bold">王某 (420102********11)</span> | 车架号: <span className="font-mono text-gray-800">LGFXXXXXX987</span></div>
                </div>
             </div>
             <div className="flex gap-2 flex-col items-end">
                <button className="bg-white text-blue-700 px-4 py-2 rounded text-sm border border-blue-200 hover:bg-blue-50 font-bold flex items-center shadow-sm" onClick={() => showToast('正在调用多轨分析引擎...')}>
                   <Layers className="w-4 h-4 mr-1.5" /> 时空多轨碰撞分析
                </button>
             </div>
          </div>

          <div className="flex-1 flex gap-3 overflow-hidden">
             {/* 左栏 轨迹展示 40% */}
             <div className="w-[45%] glass-card relative overflow-hidden bg-white border border-gray-200 rounded-lg shadow-inner flex flex-col">
                <div className="absolute top-0 inset-x-0 bg-white/90 backdrop-blur-sm p-3 border-b border-gray-200 text-sm font-bold text-[#004098] z-20 flex justify-between items-center shadow-sm">
                   <div className="flex items-center"><MapIcon className="w-4 h-4 mr-2" /> 武汉市近30天行驶轨迹溯源</div>
                </div>
                
                {/* 真实地图背景 - 采用 Leaflet */}
                <div className="relative flex-1 w-full bg-[#f0f4f8] overflow-hidden z-0">
                   <MapContainer center={[30.5828, 114.2855]} zoom={12} className="w-full h-full" zoomControl={false} dragging={true}>
                      {/* 底图: Google Maps (中文注记) */}
                      <TileLayer
                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=zh-CN"
                        attribution='&copy; Google Maps'
                      />
                      
                      {/* 热力图斑层 (表示经常活动区域) */}
                      <CircleMarker center={[30.60, 114.28]} radius={60} pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.2 }} />
                      <CircleMarker center={[30.61, 114.13]} radius={80} pathOptions={{ color: 'transparent', fillColor: '#f97316', fillOpacity: 0.15 }} />
                      <CircleMarker center={[30.55, 114.33]} radius={70} pathOptions={{ color: 'transparent', fillColor: '#eab308', fillOpacity: 0.15 }} />

                      {/* 轨迹线 */}
                      <Polyline positions={[[30.48, 114.05], [30.53, 114.20], [30.61, 114.13]]} pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '8, 8', opacity: 0.8 }} />
                      <Polyline positions={[[30.61, 114.13], [30.60, 114.28], [30.55, 114.33]]} pathOptions={{ color: '#ef4444', weight: 5, opacity: 0.9 }} />
                      <Polyline positions={[[30.55, 114.33], [30.52, 114.36]]} pathOptions={{ color: '#ef4444', weight: 5, dashArray: '5, 5', opacity: 0.6 }} />

                      {/* 节点 */}
                      <CircleMarker center={[30.48, 114.05]} radius={6} pathOptions={{ color: '#fff', weight: 2, fillColor: '#3b82f6', fillOpacity: 1 }} />
                      <CircleMarker center={[30.53, 114.20]} radius={6} pathOptions={{ color: '#fff', weight: 2, fillColor: '#3b82f6', fillOpacity: 1 }} />
                      
                      <CircleMarker center={[30.61, 114.13]} radius={8} pathOptions={{ color: '#fff', weight: 2, fillColor: '#ef4444', fillOpacity: 1, className: 'animate-pulse' }}>
                        <Popup className="custom-popup" maxWidth={250}>
                           <div className="font-bold text-red-600 border-b border-red-100 pb-1 mb-1 text-xs">涉案高亮卡口 (东西湖物流园)</div>
                           <div className="text-gray-600 font-mono text-[10px]">时间: 2026-04-20 02:15:33</div>
                           <div className="text-gray-700 text-[10px] mt-1.5 bg-red-50 p-1.5 rounded border border-red-100">AI监测异常: 凌晨高频进出该物流园区，停留时间长达4小时，疑似进行无证卷烟中转装卸。</div>
                        </Popup>
                      </CircleMarker>

                      <CircleMarker center={[30.60, 114.28]} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: '#ef4444', fillOpacity: 1 }} />
                      <CircleMarker center={[30.55, 114.33]} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: '#f97316', fillOpacity: 0.8 }} />
                   </MapContainer>
                </div>
                
                <div className="absolute bottom-3 left-3 bg-white p-2 rounded shadow text-[10px] z-20 flex gap-4 px-3 border border-gray-200">
                  <div className="flex items-center"><span className="w-3 h-1 bg-blue-500 inline-block mr-1"></span> 远期轨迹</div>
                  <div className="flex items-center"><span className="w-3 h-1 bg-red-500 inline-block mr-1"></span> 近期高频轨迹</div>
                </div>
             </div>

             {/* 右栏 关联信息 55% */}
             <div className="w-[55%] glass-card flex flex-col overflow-hidden">
                <div className="flex bg-gray-50 shrink-0">
                   {['cases', 'persons', 'logistics'].map(tab => (
                     <button 
                       key={tab} 
                       onClick={() => setActiveSubTab(tab)} 
                       className={cn("flex-1 py-3 text-sm font-bold border-b-2 transition-colors relative", 
                         activeSubTab === tab ? "border-[#004098] text-[#004098] bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                       )}
                     >
                        {tab === 'cases' && <><FileText className="w-4 h-4 inline mr-1 -mt-0.5"/> 历史关联案件 <span className="bg-red-100 text-red-600 text-[10px] px-1.5 rounded-full ml-1 absolute top-2 right-2">2</span></>}
                        {tab === 'persons' && <><User className="w-4 h-4 inline mr-1 -mt-0.5"/> 关联人员图谱 <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 rounded-full ml-1 absolute top-2 right-2">5</span></>}
                        {tab === 'logistics' && <><Truck className="w-4 h-4 inline mr-1 -mt-0.5"/> 物流运单匹配</>}
                     </button>
                   ))}
                </div>
                
                <div className="flex-1 overflow-auto bg-white relative">
                   {activeSubTab === 'cases' && (
                     <div className="p-4 flex gap-4 h-full">
                       {/* 案件列表 */}
                       <div className="flex-1 border border-gray-200 rounded overflow-hidden flex flex-col">
                         <table className="w-full text-left text-sm border-collapse">
                           <thead><tr className="bg-gray-100 text-gray-700 text-xs"><th className="p-3 font-bold border-b">案件编号</th><th className="p-3 font-bold border-b">立案时间</th><th className="p-3 font-bold border-b">性质</th></tr></thead>
                           <tbody>
                             {[
                               { id: 'AJ-WH20261120', date: '2026-11-20', type: '无证运输', active: activeCaseDetails?.id === 'AJ-WH20261120' },
                               { id: 'AJ-WH20260401', date: '2026-04-01', type: '走私/假冒', active: activeCaseDetails?.id === 'AJ-WH20260401' }
                             ].map(item => (
                               <tr key={item.id} className={cn("border-b border-gray-100 cursor-pointer transition-colors", item.active ? "bg-blue-50 border-l-4 border-l-[#004098]" : "hover:bg-gray-50 border-l-4 border-l-transparent")} onClick={() => setActiveCaseDetails(item)}>
                                 <td className="p-3 font-mono font-bold text-gray-800">{item.id}</td>
                                 <td className="p-3 text-gray-600 text-xs">{item.date}</td>
                                 <td className="p-3"><span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 border border-red-200 rounded">{item.type}</span></td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                       
                       {/* 案件明细 (点击列表后展示) */}
                       {activeCaseDetails ? (
                         <div className="w-[300px] border border-gray-200 rounded bg-gray-50 p-4 flex flex-col shrink-0 animate-in slide-in-from-right-4 relative">
                            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setActiveCaseDetails(null)}><X className="w-4 h-4"/></button>
                            <h4 className="font-bold text-[#004098] text-sm mb-3 border-b border-gray-200 pb-2">案件摘要明细</h4>
                            <div className="space-y-3 text-xs text-gray-700">
                               <div><span className="font-bold text-gray-500 mr-2">案件编号:</span><span className="font-mono">{activeCaseDetails.id}</span></div>
                               <div><span className="font-bold text-gray-500 mr-2">案发地点:</span>武汉市东西湖区某国道</div>
                               <div><span className="font-bold text-gray-500 mr-2">涉案财物:</span>查获“黄鹤楼”等品牌伪劣卷烟合共2500条，案值约60余万元。</div>
                               <div><span className="font-bold text-gray-500 mr-2">当前状态:</span><span className="text-red-600 font-bold">已移交公安</span></div>
                               <div><span className="font-bold text-gray-500 mr-2">车辆作用:</span>作为主要运输工具，由张某驾驶被当场拦截。</div>
                            </div>
                            <button className="mt-auto bg-white border border-[#004098] text-[#004098] py-2 rounded text-xs font-bold hover:bg-blue-50 transition-colors" onClick={() => showToast(`正在打开案件 [${activeCaseDetails.id}] 的详细卷宗...`)}>查看全宗卷</button>
                         </div>
                       ) : (
                         <div className="w-[300px] border border-dashed border-gray-300 rounded bg-gray-50/50 flex items-center justify-center text-gray-400 text-xs p-4 text-center shrink-0">
                           <div className="flex flex-col items-center">
                             <FileSearch className="w-8 h-8 mb-2 opacity-50"/>
                             点击左侧列表查看案件详细信息
                           </div>
                         </div>
                       )}
                     </div>
                   )}
                   {activeSubTab === 'persons' && (
                     <div className="p-4 space-y-3">
                        <div className="p-3 border border-gray-200 rounded flex gap-4 items-center bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer group" onClick={() => showToast('跳转到 王某 的人员详细图谱')}>
                           <div className="w-10 h-10 bg-[#004098] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm"><User className="w-5 h-5"/></div>
                           <div className="flex-1">
                             <div className="flex justify-between items-center">
                               <div className="font-bold text-sm text-gray-800">王某 <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 ml-2">车辆所有人</span></div>
                               <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#004098] transition-colors" />
                             </div>
                             <div className="text-xs text-gray-500 mt-1 font-mono">420102********11</div>
                           </div>
                        </div>
                        <div className="p-3 border border-gray-200 rounded flex gap-4 items-center hover:border-blue-300 transition-colors cursor-pointer group" onClick={() => showToast('跳转到 张某某 的人员详细图谱')}>
                           <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center shrink-0"><User className="w-5 h-5"/></div>
                           <div className="flex-1">
                             <div className="flex justify-between items-center">
                               <div className="font-bold text-sm text-gray-800">张某某 <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200 ml-2">涉案驾驶员</span></div>
                               <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#004098] transition-colors" />
                             </div>
                             <div className="text-xs text-gray-500 mt-1 font-mono">420104********22</div>
                           </div>
                        </div>
                     </div>
                   )}
                   {activeSubTab === 'logistics' && (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                         <div className="bg-gray-100 p-4 rounded-full mb-3"><Truck className="w-8 h-8"/></div>
                         <p className="text-sm font-bold text-gray-500 mb-1">未匹配到全国物流平台公开运单数据</p>
                         <p className="text-xs">该车辆近期可能未通过正规三方物流平台接单抛单，不排除私下交易运输可能，请结合卡口轨迹进一步研判。</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Layers(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>; }


// ==========================================
// 3.1.3 违规信息智能整合 (AI)
// ==========================================
function ViolationSearch({ tourAction }: { tourAction?: string }) {
  const [hasSearched, setHasSearched] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  const showToast = (msg: string) => {
    setToast({show: true, msg});
    setTimeout(() => setToast({show: false, msg: ''}), 3000);
  };

  useEffect(() => {
    if (tourAction === 'graph-violation') {
      setHasSearched(false);
      setIsGenerating(false);
      const t1 = setTimeout(() => {
        setIsGenerating(true);
      }, 2500); // "当输入核心要素下发研判指令后"
      const t2 = setTimeout(() => {
        setIsGenerating(false);
        setHasSearched(true);
      }, 7500); // "迅速生成区域异常热度与高发违法类型聚类"
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [tourAction]);
  
  const pieData = [{ name: '跨区窜货', value: 450 }, { name: '售假/走私', value: 300 }, { name: '无证经营', value: 250 }];
  const barData = [{ name: '江汉区', 次数: 85 }, { name: '武昌区', 次数: 72 }, { name: '洪山区', 次数: 60 }, { name: '江岸区', 次数: 40 }];

  const handleSearch = () => {
    setIsGenerating(true);
    setHasSearched(false);
    setTimeout(() => {
      setIsGenerating(false);
      setHasSearched(true);
    }, 1500); // Simulate AI generation
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* 检索条件与AI特征提示 */}
      <div className="glass-card p-4 shrink-0 border-t-4 border-[#004098] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit className="w-24 h-24" /></div>
        <div className="flex gap-4 items-end relative z-10">
          <div className="grid grid-cols-2 gap-4 flex-1">
             <div>
               <label className="text-xs font-bold text-gray-600 mb-1 flex items-center"><BrainCircuit className="w-3.5 h-3.5 mr-1 text-[#004098]"/> 检索主体模型选择</label>
               <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-1 focus:ring-[#004098] outline-none shadow-sm"><option value="retailer">持证零售户风险模型</option><option>重点嫌疑人员识别模型</option><option>异常车辆研判模型</option></select>
             </div>
             <div>
               <label className="text-xs font-bold text-gray-600 mb-1 block">特征输入 (许可证号/身份证号)</label>
               <input type="text" placeholder="输入核心凭证进行 AI 全系关联分析..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#004098] focus:ring-1 focus:ring-[#004098] outline-none shadow-sm bg-white" />
             </div>
          </div>
          <button onClick={handleSearch} disabled={isGenerating} className="bg-[#004098] hover:bg-blue-900 text-white px-6 py-2 rounded text-sm font-bold flex items-center transition-all disabled:opacity-50">
            {isGenerating ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> AI深度计算中...</> : <><Sparkles className="w-4 h-4 inline mr-1.5" /> AI研判并生成情报</>}
          </button>
        </div>
      </div>

      {isGenerating && (
         <div className="flex-1 glass-card flex flex-col items-center justify-center">
            <div className="relative">
              <BrainCircuit className="w-16 h-16 text-[#004098] animate-pulse" />
              <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse rounded-full"></div>
            </div>
            <p className="text-[#004098] font-bold mt-4 animate-pulse">正在利用大语言模型提取数万条历史卷宗特征...</p>
            <div className="w-64 h-1 bg-gray-200 mt-4 rounded-full overflow-hidden">
               <div className="h-full bg-[#004098] rounded-full animate-[progress_1.5s_ease-in-out]"></div>
            </div>
         </div>
      )}

      {hasSearched && !isGenerating && (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* 上栏 统计图表 30% */}
          <div className="glass-card p-4 h-[240px] shrink-0 flex gap-6 relative bg-gradient-to-r from-blue-50/50 to-white">
             {/* Decorative AI label */}
             <div className="absolute top-0 left-0 bg-[#004098] text-white text-[10px] font-bold px-2 py-1 rounded-br flex items-center"><Sparkles className="w-3 h-3 mr-1"/> AI 多维数据聚类</div>
             
             <div className="absolute top-3 right-3 flex gap-2 z-10">
               <select className="border border-blue-200 bg-white text-[#004098] rounded text-xs px-3 py-1.5 font-bold shadow-sm focus:outline-none"><option>AI 数据切片: 近1年</option><option>AI 数据切片: 近3月</option></select>
             </div>
             <div className="flex-1 flex flex-col pt-4 relative">
               <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center justify-center">识别高频违法类型聚类</h4>
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                       <Cell fill="#004098"/><Cell fill="#ef4444"/><Cell fill="#f97316"/>
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 </PieChart>
               </ResponsiveContainer>
               {/* Center text in pie */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                  <div className="text-xs text-gray-500">模型命中</div>
                  <div className="text-xl font-bold text-[#004098]">1,000+</div>
               </div>
             </div>
             
             <div className="w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent"></div>
             
             <div className="flex-[1.5] flex flex-col pt-4">
               <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">时空特征提取 - 区域异常频次热度</h4>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                   <XAxis dataKey="name" tick={{fontSize:12, fill:'#64748b'}} axisLine={false} tickLine={false} />
                   <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                   <Bar dataKey="次数" fill="#004098" radius={[4,4,0,0]} barSize={30} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* 下栏 详情列表与建议 70% */}
          <div className="flex-1 flex gap-3 overflow-hidden">
             {/* 列表区 */}
             <div className="flex-[2] glass-card flex flex-col overflow-hidden bg-white border border-gray-200 shadow-sm rounded-lg">
               <div className="p-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
                  <h3 className="font-bold text-sm text-gray-800 flex items-center"><FileText className="w-4 h-4 mr-1.5 text-gray-500"/> 结构化违规证据链</h3>
                  <div className="flex gap-2">
                     <button className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors" onClick={() => showToast('正在批量导出当前筛选条件下的研判记录表...')}>批量导出研判表</button>
                  </div>
               </div>
               <div className="flex-1 overflow-auto p-4 bg-gray-50/50">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:border-[#004098] cursor-pointer transition-colors relative group">
                     <div className="absolute top-0 right-0 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg border-l border-b border-red-100">高置信度 (98%)</div>
                     <div className="flex items-center gap-3 mb-3">
                        <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded font-bold shadow-sm">售假类</span>
                        <span className="text-base font-bold text-gray-900">2026年3月特大售假关联事件</span>
                     </div>
                     <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
                        <div><span className="text-gray-400 mr-2">违规主体:</span>武汉市江汉区某卷烟专卖店</div>
                        <div><span className="text-gray-400 mr-2">违规时间:</span>2026-03-15 09:30</div>
                        <div className="col-span-2 flex items-center"><span className="text-gray-400 mr-2">AI 状态研判:</span><span className="text-green-600 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 已立案处理完结 (执行罚款及吊销处理)</span></div>
                     </div>
                     <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex justify-end">
                       <button className="text-[#004098] font-bold text-xs hover:underline flex items-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => showToast('已提取案件要素，即将进入【2026年3月特大售假关联事件】全景视图')}>提取案件全景要素 <ChevronRight className="w-3 h-3" /></button>
                     </div>
                  </div>
               </div>
             </div>
             
             {/* AI 右侧边栏 */}
             <div className="flex-1 glass-card flex flex-col shrink-0 bg-gradient-to-b from-[#004098] to-blue-900 rounded-lg overflow-hidden relative shadow-lg">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full pointer-events-none"></div>
               <div className="p-4 border-b border-white/10 flex justify-between items-center relative z-10">
                  <h3 className="font-bold text-base text-white flex items-center tracking-wide"><BrainCircuit className="w-5 h-5 mr-2 text-blue-300"/> 智能辅助决策报告</h3>
               </div>
               
               <div className="p-5 flex-1 overflow-y-auto relative z-10 scrollbar-hide">
                 <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center border border-white/20 mb-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur"></div>
                    <div className="text-blue-100 text-xs mb-1 relative z-10">系统综合评定预警等级</div>
                    <div className="text-2xl font-bold text-white relative z-10 flex justify-center items-center"><ShieldAlert className="w-5 h-5 mr-2 text-red-400"/> 重度违规 (Level 4)</div>
                 </div>
                 
                 <div className="space-y-5">
                    {/* 监管建议配置 */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="bg-gray-50 p-2.5 border-b border-gray-200 font-bold text-sm text-gray-800 flex items-center"><Activity className="w-4 h-4 mr-2 text-red-500"/> AI 自动化处理动作建议</div>
                      <div className="p-4 text-sm text-gray-700 space-y-3">
                         <div className="flex gap-2">
                           <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-xs h-fit shrink-0 border border-red-200">优先级 1</span>
                           <span className="leading-relaxed font-bold">立即启动立案调查程序，建议触发公安、市监跨部门协同执法机制。</span>
                         </div>
                         <div className="flex gap-2">
                           <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded text-xs h-fit shrink-0 border border-orange-200">优先级 2</span>
                           <span className="text-gray-600">联动“黑名单”库，对其名下关联的其它执照法人关联实体实施<span className="text-red-500 font-bold">业务限拨停供</span>。</span>
                         </div>
                      </div>
                    </div>
                    
                    {/* 法则匹配 */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="bg-gray-50 p-2.5 border-b border-gray-200 font-bold text-sm text-gray-800 flex items-center"><FileSearch className="w-4 h-4 mr-2 text-blue-600"/> 大模型法规智能匹配检索匹配</div>
                      <div className="p-4 text-xs text-gray-700 space-y-3 font-mono leading-relaxed bg-blue-50/30">
                         <div className="relative pl-3 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-[#004098] before:rounded-full">
                           依据 <span className="font-bold text-[#004098]">《中华人民共和国烟草专卖法》第三十二条</span>，生产、销售没有商标的卷烟、雪茄烟、有包装的烟丝的...
                         </div>
                         <div className="relative pl-3 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-[#004098] before:rounded-full">
                           依据 <span className="font-bold text-[#004098]">《烟草专卖法实施条例》第五十二条</span>...构成犯罪的，依法追究刑事责任。
                         </div>
                      </div>
                    </div>
                 </div>
               </div>
               
               <div className="p-4 border-t border-white/10 bg-black/10 shrink-0">
                 <button className="w-full bg-white hover:bg-gray-50 text-[#004098] py-3 rounded text-sm font-bold transition-transform active:scale-95 shadow-lg flex justify-center items-center" onClick={() => showToast('正在调用文档生成微服务，情报包 Word 格式生成中...')}>
                   <Download className="w-4 h-4 mr-2" />
                   一键生成情报包 (Word格式)
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Local Toast */}
      {toast.show && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

function GraphNode({ top, left, icon, text, sub, color, size = 'md', onClick, active }: any) {
  const colorMap = {
    orange: 'bg-orange-50 text-orange-600 border-orange-300',
    red: 'bg-red-50 text-red-600 border-red-300',
    blue: 'bg-blue-50 text-blue-600 border-blue-300',
    purple: 'bg-purple-50 text-purple-600 border-purple-300',
    gray: 'bg-gray-50 text-gray-600 border-gray-300',
  };
  
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }
  
  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer" style={{ top, left }} onClick={onClick}>
      <div className={cn(sizeMap[size as keyof typeof sizeMap], "rounded-full flex items-center justify-center shadow-md relative border-2 bg-white transition-all duration-300", 
        colorMap[color as keyof typeof colorMap], 
        active ? 'scale-125 ring-4 ring-blue-200 shadow-xl z-20' : 'group-hover:scale-110'
      )}>
        {icon}
      </div>
      <div className={cn("mt-1.5 text-center bg-white/95 backdrop-blur px-2.5 py-1 rounded-md shadow-sm border transition-colors", active ? "border-[#004098] shadow-md" : "border-gray-200")}>
        <div className={cn("font-bold text-xs tracking-wide", active ? "text-[#004098]" : "text-gray-800")}>{text}</div>
        <div className="text-[10px] text-gray-500 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
