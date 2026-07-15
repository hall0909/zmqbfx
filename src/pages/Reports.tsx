import { useState, useEffect } from 'react';
import { FileText, FileBarChart, Clock, CheckCircle2, Loader2, Download, Sparkles, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  title: string;
  type: string;
  generateTime: string;
  status: 'completed' | 'generating';
}

const mockReports: Report[] = [
  { id: '1', title: '2026年第二季度全市专卖执法情报分析报告', type: '季度报', generateTime: '2026-07-01 08:00', status: 'completed' },
  { id: '2', title: '6月物流寄递环节涉烟违法专项分析报告', type: '专项报', generateTime: '2026-06-30 14:22', status: 'completed' },
  { id: '3', title: '本周高发区域假烟案件趋势预警简报', type: '周报', generateTime: '2026-07-12 09:10', status: 'completed' },
];

export default function Reports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  const showToast = (msg: string) => {
    setToast({show: true, msg});
    setTimeout(() => setToast({show: false, msg: ''}), 3000);
  };

  useEffect(() => {
    const handleAction = (e: any) => {
      if (e.detail === 'reports-start') {
        setTimeout(handleGenerate, 4500); // 配合语音："只需在此处点击一键智能生成"
      }
    };
    window.addEventListener('tour-action', handleAction);
    return () => window.removeEventListener('tour-action', handleAction);
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newReport: Report = {
      id: Date.now().toString(),
      title: '最新系统涉烟舆情与市场动态综合报告 (AI生成)',
      type: '自定义报告',
      generateTime: '生成中...',
      status: 'generating'
    };
    
    setReports([newReport, ...reports]);

    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === newReport.id 
          ? { ...r, status: 'completed', generateTime: new Date().toLocaleString() } 
          : r
      ));
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="glass-card p-4 shrink-0 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 pointer-events-none z-0"></div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
          <div>
            <h2 className="text-sm font-bold text-gray-700 mb-1 border-l-4 border-purple-600 pl-2 flex items-center">
               <BrainCircuit className="w-5 h-5 mr-2 text-purple-600" />
               大模型报告智能生成矩阵
            </h2>
            <p className="text-[10px] text-gray-500">连接底层检索图谱、风控态势库，自动推理业务数据，一键生成带有深刻洞察的标准化战术简报。</p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-[#004098] hover:from-purple-700 hover:to-blue-900 text-white px-5 py-2 text-xs rounded border-none transition-all flex items-center justify-center disabled:opacity-70 shadow-md font-bold relative overflow-hidden"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            一键智能提取生成当期简报
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <ReportTemplateCard title="标准周报/月报模板" desc="分系统集成：贴合日常汇报指标要求。" onClick={() => showToast('已选中【标准周报/月报模板】')} />
        <ReportTemplateCard title="假烟专项打击报告" desc="深度分析：专注售假、存储窝点趋势。" onClick={() => showToast('已选中【假烟专项打击报告】模板')} />
        <ReportTemplateCard title="物流寄递整治报告" desc="智能抓取：快递网点异常包裹稽查总结。" onClick={() => showToast('已选中【物流寄递整治报告】模板')} />
        <ReportTemplateCard title="真烟外流防控报告" desc="异动预警：串码销售与跨区域流通预警。" onClick={() => showToast('已选中【真烟外流防控报告】模板')} />
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-gray-50 shrink-0">
          <h3 className="text-xs font-bold text-gray-700">自动化报告文件台账</h3>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-gray-500 sticky top-0 z-10 shadow-sm">
                <th className="px-4 py-2.5 font-bold">报告名称</th>
                <th className="px-4 py-2.5 font-bold w-32">任务类型</th>
                <th className="px-4 py-2.5 font-bold w-40">执行时间</th>
                <th className="px-4 py-2.5 font-bold w-32">任务状态</th>
                <th className="px-4 py-2.5 font-bold text-right w-48">流水线操作</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 last:border-0 hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                    <span className={cn(report.status === 'generating' ? "text-purple-600" : "text-gray-800")}>{report.title}</span>
                    {report.id === reports[0]?.id && report.status === 'completed' && <Sparkles className="w-3 h-3 ml-2 text-purple-500" />}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{report.type}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-[10px] flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {report.generateTime}
                  </td>
                  <td className="px-4 py-3">
                    {report.status === 'completed' ? (
                      <span className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded w-max border border-green-200 text-[10px] text-center font-bold">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> 执行成功
                      </span>
                    ) : (
                      <span className="flex items-center text-purple-700 bg-purple-50 px-2 py-0.5 rounded w-max border border-purple-200 text-[10px] text-center font-bold ai-pulse">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" /> AI采编中
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button 
                      disabled={report.status !== 'completed'}
                      className="text-blue-600 hover:underline hover:text-blue-800 font-bold disabled:opacity-30 disabled:hover:no-underline text-[10px]"
                      onClick={() => showToast(`正在提取并在线预览：${report.title}`)}
                    >
                      在线预览
                    </button>
                    <button 
                      disabled={report.status !== 'completed'}
                      className="text-gray-600 hover:text-gray-800 font-bold items-center justify-end w-full md:w-auto inline-flex disabled:opacity-30 disabled:hover:no-underline text-[10px] px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"
                      onClick={() => showToast(`正在生成 ${report.title} 的 PDF 文件并加入下载队列...`)}
                    >
                      <Download className="w-3 h-3 mr-1" /> 导出PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast.show && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

function ReportTemplateCard({ title, desc, onClick }: { title: string, desc: string, onClick?: () => void }) {
  return (
    <div className="bg-gray-50 border border-gray-200 border-dashed rounded p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group" onClick={onClick}>
      <div className="flex items-center justify-between mb-1.5">
        <h4 className="font-bold text-xs text-gray-700 group-hover:text-blue-800">{title}</h4>
      </div>
      <p className="text-[10px] text-gray-500 group-hover:text-blue-600/80 leading-relaxed">{desc}</p>
    </div>
  );
}
