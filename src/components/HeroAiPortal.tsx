import React, { useState, useRef } from 'react';
import { Sparkles, Mic, Camera, FileText, ArrowRight, CornerDownLeft, Loader2, Volume2 } from 'lucide-react';
import { GeoCity } from '../types';

interface HeroAiPortalProps {
  currentCity: GeoCity;
  onSubmitQuery: (query: string, mediaType?: 'voice' | 'image' | 'doc') => void;
  isLoading: boolean;
}

export const HeroAiPortal: React.FC<HeroAiPortalProps> = ({
  currentCity,
  onSubmitQuery,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    { text: `帮我在${currentCity.nameZh}找一个会中文的会计师，做2025年税务`, tag: '💼 会计财税' },
    { text: `我想在${currentCity.nameZh}找房，两室一厅预算1400欧，可登居留`, tag: '🏠 租房找房' },
    { text: `这是什么信？（解读意大利/法国官方税单与警察局通知）`, tag: '📄 文件OCR', type: 'doc' },
    { text: `我的工作居留快过期了，最新续签材料清单和时间`, tag: '🏛️ 居留政务' },
    { text: `我想在${currentCity.nameZh}找一份餐馆或企业工作，月薪2000+`, tag: '👨‍🍳 招聘求职' },
    { text: `帮我把这句中文翻译成正式地道的意大利公文回复`, tag: '🌐 场景翻译' },
    { text: `帮我估价并卖掉这个二手手机/家电`, tag: '📦 二手跳蚤' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSubmitQuery(inputText);
  };

  const handleVoiceInput = () => {
    // Check Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      
      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } else {
      // Fallback simulated voice prompt
      setIsRecording(true);
      setTimeout(() => {
        setInputText(`我在${currentCity.nameZh}，想找一个靠谱会中文的会计师帮我做公司税`);
        setIsRecording(false);
      }, 1200);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSubmitQuery(`【已上传文件】${file.name} - 请帮我分析这是一封什么公函或合同，提取截止日期与注意事项。`, 'doc');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200 py-10 sm:py-14">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>欧洲华人生活全新形态 · 告诉 AI 你想做什么</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          欧洲生活中的任何事情，<br className="hidden sm:inline" />
          <span className="text-blue-600">
            一句话，AI 帮您全流程完成
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          无需在繁琐的分类版块中翻找。搜索、筛选、对比、核查、翻译、联系与预约，由全智能华人 AI 管家为您执行。
        </p>

        {/* Master AI Input Box */}
        <div className="mt-8 relative max-w-3xl mx-auto text-left">
          <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-900/5 border-2 border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all p-3 sm:p-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder={`你好！请告诉我你想做什么？例如：“帮我找${currentCity.nameZh}中文会计”、“我想在${currentCity.nameZh}找房预算1400欧”...`}
              className="w-full resize-none border-0 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:ring-0"
            />

            {/* Input Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Voice Input */}
                <button
                  onClick={handleVoiceInput}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isRecording 
                      ? 'bg-slate-900 text-white animate-pulse' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                  title="语音输入需求"
                >
                  <Mic className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">{isRecording ? '正在聆听...' : '语音录入'}</span>
                </button>

                {/* Photo / Camera */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 text-xs font-medium transition-all"
                  title="拍照识别二手商品或房源"
                >
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">拍图识物</span>
                </button>

                {/* File OCR */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 text-xs font-medium transition-all"
                  title="上传居留信、税务罚单、租房合同"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">文件解读</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-md transition-all ${
                  isLoading || !inputText.trim()
                    ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI 思考中...</span>
                  </>
                ) : (
                  <>
                    <span>立即执行</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-5 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            常见需求示例:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(p.text);
                onSubmitQuery(p.text, p.type as any);
              }}
              className="text-xs bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 px-3 py-1.5 rounded-full transition-all shadow-xs hover:shadow text-left"
            >
              <span className="text-slate-400 mr-1 text-[11px]">{p.tag}</span>
              <span>{p.text.length > 22 ? p.text.slice(0, 22) + '...' : p.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
