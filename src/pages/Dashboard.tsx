import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Activity, Database, Users, BrainCircuit, Sparkles, Cpu } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import { AIWarning } from '@/types';

const trendData = [
  { month: '1月', 实际发案: 45, AI预测: 48 },
  { month: '2月', 实际发案: 52, AI预测: 50 },
  { month: '3月', 实际发案: 38, AI预测: 42 },
  { month: '4月', 实际发案: 65, AI预测: 60 },
  { month: '5月', 实际发案: 48, AI预测: 55 },
  { month: '6月', 实际发案: null, AI预测: 45 },
  { month: '7月', 实际发案: null, AI预测: 58 },
  { month: '8月', 实际发案: null, AI预测: 62 },
];

const riskData = [
  { name: '低风险专卖店', value: 400 },
  { name: '中风险便利店', value: 300 },
  { name: '高风险烟酒行', value: 150 },
  { name: '无证游商', value: 80 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const recentWarnings: AIWarning[] = [
  { id: '1', time: '10分钟前', type: '包裹异常', description: 'YOLOv5识别到物流园区X有疑似涉烟包裹，特征：异常重量、违规标识。', level: '严重' },
  { id: '2', time: '30分钟前', type: '订单异常', description: '零售户「张三副食」出现异常串码销售及高频退换货。', level: '警告' },
  { id: '3', time: '2小时前', type: '涉烟舆情', description: '社交网络检测到本市有疑似走私烟交易暗语。', level: '关注' },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <StatCard title="累计涉案人员库" value="12,458" desc="↑ 12% 环比增长" descColor="text-red-500" icon={<Database className="w-16 h-16 transform translate-x-4 translate-y-4" />} />
        <StatCard title="AI 深度关联案件" value="3,210" desc="包含 450 起高风险" descColor="text-blue-500" isAi={true} icon={<BrainCircuit className="w-16 h-16 transform translate-x-4 translate-y-4 text-purple-200" />} />
        <StatCard title="本月智能预警次数" value="186" desc="需指派处置 120 起" descColor="text-orange-500" isAi={true} icon={<AlertTriangle className="w-16 h-16 transform translate-x-4 translate-y-4 text-yellow-200" />} />
        <StatCard title="AI 解析准确率" value="98.5%" desc="多模态大模型判定" descColor="text-green-600" isAi={true} icon={<Cpu className="w-16 h-16 transform translate-x-4 translate-y-4 text-green-200" />} />
      </div>

      <div className="flex-1 flex gap-3 min-h-0">
        {/* 左侧：趋势预测 + 预警日志 */}
        <div className="w-[40%] flex flex-col gap-3 shrink-0">
          <div className="glass-card p-5 flex-[1.2] flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/10 opacity-50 z-0"></div>
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-purple-700 mb-2 border-l-4 border-purple-600 pl-2 flex items-center relative z-10">
              <BrainCircuit className="w-4 h-4 mr-2 text-purple-600" /> 
              全息模型：涉烟案件趋势预测
            </h3>
            <div className="flex-1 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e4e8" />
                  <XAxis dataKey="month" tick={{fontSize: 10}} tickLine={false} />
                  <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{fontSize: '12px', borderRadius: '4px', border: '1px solid #e1e4e8'}} />
                  <Legend iconSize={10} wrapperStyle={{fontSize: '11px', paddingTop: '5px'}} />
                  <Line type="monotone" dataKey="实际发案" stroke="#004098" activeDot={{ r: 4 }} strokeWidth={2} />
                  <Line type="monotone" dataKey="AI预测" stroke="#00d2ff" strokeDasharray="5 5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-4 flex-1 shrink-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-l-4 border-blue-800 pl-2">
              <h3 className="text-sm font-bold text-gray-700">实时 AI 预警 (System Logs)</h3>
              <button className="text-[10px] text-blue-600 hover:text-blue-800 font-bold">全部记录 &rarr;</button>
            </div>
            <div className="flex-1 overflow-auto space-y-2 pr-1">
              {recentWarnings.map(warning => (
                <div key={warning.id} className="flex items-start bg-gray-50/50 p-2 rounded border border-gray-100 hover:bg-white transition-colors cursor-pointer shadow-sm">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex flex-shrink-0 items-center justify-center mr-2",
                    warning.level === '严重' ? "bg-red-100 text-red-600" :
                    warning.level === '警告' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                  )}>
                    <span className="font-bold text-xs">{warning.level === '严重' ? '!' : warning.level === '警告' ? '?' : 'i'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">{warning.type}</span>
                      <span className="text-[10px] text-gray-400 font-mono">[{warning.time}]</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed truncate-2-lines">{warning.description}</p>
                  </div>
                  <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded ml-1 border border-blue-100 hover:bg-blue-100 transition-colors">
                    分配
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：热力图 */}
        <div className="flex-1 glass-card p-4 flex flex-col z-0 relative group">
          <div className="absolute inset-0 bg-gradient-to-bl from-orange-50/20 to-[#f0f4f8] pointer-events-none z-0"></div>
          <h3 className="text-base font-bold text-gray-700 mb-3 border-l-4 border-orange-500 pl-2 flex items-center relative z-10 w-full justify-between">
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
              AI 聚类热力图 (全视野监测区)
            </div>
            <div className="flex gap-2">
               <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded shadow-sm font-bold border border-red-200">高危区域 3</span>
               <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded shadow-sm font-bold border border-orange-200">预警网格 12</span>
            </div>
          </h3>
          <div className="flex-1 border border-gray-200 rounded overflow-hidden relative z-0 shadow-inner">
             <MapContainer center={[30.59, 114.28]} zoom={11} className="w-full h-full" zoomControl={false} dragging={true}>
               <TileLayer
                 url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=zh-CN"
                 attribution='&copy; Google Maps'
               />
               <CircleMarker center={[30.60, 114.28]} radius={50} pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.5 }}>
                 <Popup className="custom-popup" maxWidth={200}>
                   <div className="font-bold text-red-700 text-xs mb-1 border-b border-red-200 pb-1">江汉区核心商圈</div>
                   <div className="text-[10px] text-gray-600">关联预警：异常包裹流动<br/>动态评估：高危爆发期</div>
                 </Popup>
               </CircleMarker>
               <CircleMarker center={[30.63, 114.15]} radius={65} pathOptions={{ color: 'transparent', fillColor: '#f97316', fillOpacity: 0.4 }}>
                 <Popup className="custom-popup" maxWidth={200}>
                   <div className="font-bold text-orange-700 text-xs mb-1 border-b border-orange-200 pb-1">东西湖物流片区</div>
                   <div className="text-[10px] text-gray-600">关联预警：跨省运烟车次激增<br/>动态评估：中高危</div>
                 </Popup>
               </CircleMarker>
               <CircleMarker center={[30.53, 114.33]} radius={55} pathOptions={{ color: 'transparent', fillColor: '#f97316', fillOpacity: 0.4 }}>
                 <Popup className="custom-popup" maxWidth={200}>
                   <div className="font-bold text-orange-700 text-xs mb-1 border-b border-orange-200 pb-1">武昌火车站网格</div>
                   <div className="text-[10px] text-gray-600">关联预警：同城多次驳载<br/>动态评估：中高危</div>
                 </Popup>
               </CircleMarker>
               <CircleMarker center={[30.62, 114.30]} radius={45} pathOptions={{ color: 'transparent', fillColor: '#eab308', fillOpacity: 0.4 }}>
                 <Popup className="custom-popup" maxWidth={200}>
                   <div className="font-bold text-yellow-700 text-xs mb-1 border-b border-yellow-200 pb-1">江岸区零散点位</div>
                   <div className="text-[10px] text-gray-600">关联预警：零售户集聚异动<br/>动态评估：中危监测中</div>
                 </Popup>
               </CircleMarker>
               <CircleMarker center={[30.50, 114.40]} radius={70} pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.35 }}>
                 <Popup className="custom-popup" maxWidth={200}>
                   <div className="font-bold text-red-700 text-xs mb-1 border-b border-red-200 pb-1">光谷高新仓储区</div>
                   <div className="text-[10px] text-gray-600">关联预警：大型仓储频繁无名进出库<br/>动态评估：高度警告 (AI抓取)</div>
                 </Popup>
               </CircleMarker>
             </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, descColor, isAi = false, icon }: { title: string, value: string, desc: string, descColor: string, isAi?: boolean, icon?: React.ReactNode }) {
  return (
    <div className={cn("glass-card p-4 flex flex-col relative overflow-hidden group hover:shadow-xl transition-all", isAi ? "border-t-2 border-purple-500" : "")}>
      <div className="flex justify-between items-start">
        <span className="text-gray-500 text-sm font-bold flex items-center">
          {title} 
          {isAi && <span className="ml-2 text-[8px] bg-purple-100 text-purple-700 px-1 py-0.5 rounded border border-purple-200 font-bold uppercase flex items-center"><Sparkles className="w-2 h-2 mr-0.5"/> AI 驱动</span>}
        </span>
      </div>
      <span className={cn("text-3xl font-bold mt-2", isAi ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600" : "soe-blue")}>{value}</span>
      <div className={cn("text-sm font-bold mt-3", descColor)}>{desc}</div>
      <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
         {icon || <Activity className="w-16 h-16 transform translate-x-4 translate-y-4" />}
      </div>
    </div>
  );
}
