import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Activity, Database, Users } from 'lucide-react';
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
        <StatCard title="累计涉案人员库" value="12,458" desc="↑ 12% 环比增长" descColor="text-red-500" />
        <StatCard title="AI 关联涉嫌案件" value="3,210" desc="包含 450 起高风险" descColor="text-blue-500" />
        <StatCard title="本月智能预警次数" value="186" desc="需指派处置 120 起" descColor="text-orange-500" />
        <StatCard title="AI 解析准确率" value="98.5%" desc="保持极佳水平" descColor="text-green-600" />
      </div>

      <div className="flex-1 flex gap-3 min-h-[300px]">
        <div className="glass-card p-5 flex-1 flex flex-col relative overflow-hidden">
          <h3 className="text-base font-bold text-gray-700 mb-4 border-l-4 border-blue-800 pl-2">未来12个月涉烟案件趋势预测</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e4e8" />
                <XAxis dataKey="month" tick={{fontSize: 12}} tickLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{fontSize: '14px', borderRadius: '4px', border: '1px solid #e1e4e8'}} />
                <Legend iconSize={12} wrapperStyle={{fontSize: '14px', paddingTop: '10px'}} />
                <Line type="monotone" dataKey="实际发案" stroke="#004098" activeDot={{ r: 6 }} strokeWidth={2} />
                <Line type="monotone" dataKey="AI预测" stroke="#00d2ff" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5 w-[380px] flex flex-col shrink-0">
          <h3 className="text-base font-bold text-gray-700 mb-4 border-l-4 border-blue-800 pl-2">区域风险分布</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="40%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{fontSize: '14px', borderRadius: '4px', border: '1px solid #e1e4e8'}} />
                <Legend iconSize={12} wrapperStyle={{fontSize: '14px'}} layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 h-[280px] shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-4 border-l-4 border-blue-800 pl-2">
          <h3 className="text-base font-bold text-gray-700">实时涉烟线索 AI 预警 (System Logs)</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-bold">全部处理记录 &rarr;</button>
        </div>
        <div className="flex-1 overflow-auto space-y-3 pr-2">
          {recentWarnings.map(warning => (
            <div key={warning.id} className="flex items-start bg-gray-50/50 p-3 rounded border border-gray-100 hover:bg-white transition-colors cursor-pointer shadow-sm">
              <div className={cn(
                "w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center mr-3",
                warning.level === '严重' ? "bg-red-100 text-red-600" :
                warning.level === '警告' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
              )}>
                <span className="font-bold text-sm">{warning.level === '严重' ? '!' : warning.level === '警告' ? '?' : 'i'}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{warning.type}</span>
                  <span className="text-xs text-gray-400 font-mono">[{warning.time}]</span>
                </div>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{warning.description}</p>
              </div>
              <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded ml-2 border border-blue-100 hover:bg-blue-100 transition-colors">
                分配
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, descColor }: { title: string, value: string, desc: string, descColor: string }) {
  return (
    <div className="glass-card p-4 flex flex-col relative overflow-hidden group">
      <span className="text-gray-500 text-sm font-bold">{title}</span>
      <span className="text-3xl font-bold soe-blue mt-2">{value}</span>
      <div className={cn("text-sm font-bold mt-3", descColor)}>{desc}</div>
      <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
         <Activity className="w-16 h-16 transform translate-x-4 translate-y-4" />
      </div>
    </div>
  );
}
