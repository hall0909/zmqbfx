import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  type?: 'text' | 'chart';
  chartData?: any;
}

const mockChartData = [
  { name: '烟酒行', 案件数: 120 },
  { name: '便利店', 案件数: 85 },
  { name: '超市', 案件数: 40 },
  { name: '其他', 案件数: 15 },
];

export default function AIQA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '您好，我是涉烟情报分析AI助手。您可以向我询问各类专卖法规条款、处罚标准，或者让我分析本月的涉烟数据指标（例如：“本月无证运输案件占比多少？”、“高风险零售户主要集中在哪些业态？”）。',
    }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response based on keywords
    setTimeout(() => {
      if (userMsg.text.includes('无证运输') && userMsg.text.includes('处罚')) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: '根据《中华人民共和国烟草专卖法实施条例》第五十二条 规定：无准运证或者超过准运证规定的数量托运或者自运烟草专卖品的，处以违法运输的烟草专卖品价值20%以上50%以下的罚款，可以按照国家规定的价格收购违法运输的烟草专卖品。\n\n**建议执法流程：**\n1. 现场固定货物清单及无证证据。\n2. 对涉案人员进行笔录调查。\n3. 按标准立案审批。'
        }]);
      } else if (userMsg.text.includes('高风险') && userMsg.text.includes('业态')) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: '当前系统数据显示，本市高风险零售户主要集中在“烟酒行”和“便利店”。具体分布情况如下：',
          type: 'chart',
          chartData: mockChartData
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: '已接收您的指令。目前环境已预置部分回答模型，如需更精准的自然语言查询关联，建议切换到高级模型模式。'
        }]);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full glass-card overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
        <h2 className="font-bold text-xs text-gray-700 flex items-center">
          <Bot className="w-4 h-4 text-[#004098] mr-2" />
          智能法规研判与数据解析引擎 (AI Assistant)
        </h2>
        <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">运行时：核心推演模型 v2.1</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex", msg.sender === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[85%]", msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm",
                msg.sender === 'user' ? "bg-blue-600 text-white ml-3" : "bg-[#004098] text-white mr-3 ai-pulse"
              )}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-3 rounded border text-xs leading-relaxed max-w-full overflow-hidden shadow-sm",
                msg.sender === 'user' 
                  ? "bg-blue-600 text-white border-blue-700" 
                  : "bg-white border-gray-200 text-gray-700 whitespace-pre-wrap"
              )}>
                {msg.text}
                
                {msg.type === 'chart' && msg.chartData && (
                  <div className="mt-3 h-48 w-full min-w-[280px] bg-gray-50/50 rounded border border-gray-200 p-2">
                    <div className="flex items-center text-gray-500 text-[10px] font-bold mb-2 uppercase">
                      <BarChart2 className="w-3 h-3 mr-1" />
                      高风险业态分布 (实时聚类)
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={msg.chartData}>
                        <XAxis dataKey="name" tick={{fontSize: 10}} tickLine={false} />
                        <YAxis tick={{fontSize: 10}} tickLine={false} />
                        <Tooltip contentStyle={{fontSize: '10px'}} />
                        <Bar dataKey="案件数" fill="#004098" radius={[2, 2, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-gray-200 bg-white shrink-0">
        <form onSubmit={handleSend} className="flex relative">
          <input 
            type="text" 
            placeholder="输入自然语言指令（如：检索涉案人员、查询处罚标准）..." 
            className="flex-1 border border-gray-300 rounded-l-sm pl-4 pr-12 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-gray-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="bg-[#004098] hover:bg-blue-900 border border-[#004098] text-white px-4 py-2 rounded-r-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-xs font-bold"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            发送指令
          </button>
        </form>
        <div className="mt-2 text-[10px] text-gray-400 block flex gap-2 items-center">
          <span className="font-bold">快捷提示：</span>
          <button onClick={() => setInput('无证运输卷烟如何处罚？')} className="text-blue-600 hover:underline">无证运输卷烟如何处罚？</button>
          <span className="text-gray-300">|</span>
          <button onClick={() => setInput('高风险零售户主要集中在哪些业态？')} className="text-blue-600 hover:underline">高风险零售户分布统计</button>
        </div>
      </div>
    </div>
  );
}
