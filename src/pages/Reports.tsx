import { useState } from 'react';
import { FileText, FileBarChart, Clock, CheckCircle2, Loader2, Download } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: string;
  generateTime: string;
  status: 'completed' | 'generating';
}

const mockReports: Report[] = [
  { id: '1', title: '2023年第三季度全市专卖执法情报分析报告', type: '季度报', generateTime: '2023-10-01 08:00', status: 'completed' },
  { id: '2', title: '9月物流寄递环节涉烟违法专项分析报告', type: '专项报', generateTime: '2023-09-30 14:22', status: 'completed' },
  { id: '3', title: '本周高发区域假烟案件趋势预警简报', type: '周报', generateTime: '2023-10-15 09:10', status: 'completed' },
];

export default function Reports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isGenerating, setIsGenerating] = useState(false);

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
      <div className="glass-card p-4 shrink-0">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-700 mb-1 border-l-4 border-blue-800 pl-2">AI 智能分析自动化中心</h2>
            <p className="text-[10px] text-gray-500">基于数据库模板，自动提取案件、市场、督查等数据进行推理描述，一键生成标准化分析报告。</p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-[#004098] text-white px-4 py-2 text-xs rounded border border-[#004098] hover:bg-blue-900 transition-colors flex items-center justify-center disabled:opacity-70 shadow-sm"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <FileBarChart className="w-3.5 h-3.5 mr-1.5" />}
            一键智能生成当期报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <ReportTemplateCard title="标准周报/月报模板" desc="分系统集成：贴合日常汇报指标要求。" />
        <ReportTemplateCard title="假烟专项打击报告" desc="深度分析：专注售假、存储窝点趋势。" />
        <ReportTemplateCard title="物流寄递整治报告" desc="智能抓取：快递网点异常包裹稽查总结。" />
        <ReportTemplateCard title="真烟外流防控报告" desc="异动预警：串码销售与跨区域流通预警。" />
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
                  <td className="px-4 py-3 font-bold text-gray-800 flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                    {report.title}
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
                      <span className="flex items-center text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-max border border-blue-200 text-[10px] text-center font-bold">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" /> AI采编中
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button 
                      disabled={report.status !== 'completed'}
                      className="text-blue-600 hover:underline hover:text-blue-800 font-bold disabled:opacity-30 disabled:hover:no-underline text-[10px]"
                    >
                      在线预览
                    </button>
                    <button 
                      disabled={report.status !== 'completed'}
                      className="text-gray-600 hover:text-gray-800 font-bold items-center justify-end w-full md:w-auto inline-flex disabled:opacity-30 disabled:hover:no-underline text-[10px] px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"
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
    </div>
  );
}

function ReportTemplateCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 border-dashed rounded p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group">
      <div className="flex items-center justify-between mb-1.5">
        <h4 className="font-bold text-xs text-gray-700 group-hover:text-blue-800">{title}</h4>
      </div>
      <p className="text-[10px] text-gray-500 group-hover:text-blue-600/80 leading-relaxed">{desc}</p>
    </div>
  );
}
