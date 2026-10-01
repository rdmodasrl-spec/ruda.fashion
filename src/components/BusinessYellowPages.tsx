import React, { useState } from 'react';
import { BusinessItem, GeoCity } from '../types';
import { Store, ShieldCheck, Phone, MessageSquare, Clock, MapPin, Star, Bot, Send, CheckCircle2, ChevronRight } from 'lucide-react';

interface BusinessYellowPagesProps {
  businesses: BusinessItem[];
  currentCity: GeoCity;
  onAskAi: (prompt: string) => void;
}

export const BusinessYellowPages: React.FC<BusinessYellowPagesProps> = ({
  businesses,
  currentCity,
  onAskAi,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeChatBusiness, setActiveChatBusiness] = useState<BusinessItem | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  const categories = [
    { id: 'all', label: '全部商家' },
    { id: 'accountant', label: '中文会计与税务' },
    { id: 'lawyer', label: '华人律师法务' },
    { id: 'clinic', label: '华人医疗诊所' },
    { id: 'logistics', label: '跨境物流快递' },
  ];

  const filteredBusinesses = businesses.filter((b) => {
    if (selectedCategory !== 'all' && b.subCategory !== selectedCategory) return false;
    return true;
  });

  const handleOpenAiBot = (biz: BusinessItem) => {
    setActiveChatBusiness(biz);
    setChatMessages([
      {
        sender: 'bot',
        text: `您好！我是【${biz.nameZh}】的官方 AI 智能前台接待。关于营业时间、收费标准、所需证件或服务预约，请随时问我！`,
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !activeChatBusiness) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    try {
      const res = await fetch(`/api/business/${activeChatBusiness.id}/ai-reception`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.json();
      
      let botReply = data.answer || '已收到您的咨询，专员将尽快跟进。';
      if (data.isGrounded && data.sourceCitation) {
        botReply += `\n\n📌 [${data.sourceCitation} · 核验于: ${data.lastVerified}]`;
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `关于“${userMsg}”，${activeChatBusiness.aiAssistantKnowledge} 如需确切咨询，请致电 ${activeChatBusiness.phone}。`,
        },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">欧洲华人认证商家与便民黄页</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              已认证资质
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            严选欧洲执业会计师事务所、华人律师楼、医疗门诊及特快专线 · 支持 24h AI 商家专属接待
          </p>
        </div>

        <div className="flex items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBusinesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Cover & Badge */}
              <div className="h-40 w-full relative bg-slate-100 overflow-hidden">
                <img
                  src={biz.coverImage}
                  alt={biz.nameZh}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-white">{biz.nameZh}</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">{biz.nameLocal}</div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 text-white px-2 py-0.5 rounded-md text-xs font-bold border border-slate-700">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>{biz.rating}</span>
                    <span className="text-[10px] font-normal text-slate-300">({biz.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{biz.address}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{biz.openingHours}</span>
                </div>

                {/* Services list */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">核心服务范围:</div>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {biz.services.slice(0, 3).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Offer */}
                {biz.featuredOffer && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium">
                    {biz.featuredOffer}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${biz.phone}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">致电</span>
                </a>
                {biz.whatsapp && (
                  <a
                    href={`https://wa.me/${biz.whatsapp.replace(/\+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                  >
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              {/* AI Business Assistant trigger */}
              <button
                onClick={() => handleOpenAiBot(biz)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-white" />
                <span>AI 客服 24h 智能接待</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive AI Business Bot Drawer/Modal */}
      {activeChatBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{activeChatBusiness.nameZh} · AI 商家助手</h4>
                  <div className="text-[10px] text-slate-400">自主服务中 · 掌握本所营业时间、价格与预约流程</div>
                </div>
              </div>
              <button onClick={() => setActiveChatBusiness(null)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => { setChatInput('你们今天几点开门？'); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap"
              >
                🕒 几点开门？
              </button>
              <button
                onClick={() => { setChatInput('做账收费标准是多少？'); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap"
              >
                💰 收费标准？
              </button>
              <button
                onClick={() => { setChatInput('办理需要带哪些证件？'); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap"
              >
                📋 需带哪些证件？
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="直接向商家 AI 发送提问..."
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
