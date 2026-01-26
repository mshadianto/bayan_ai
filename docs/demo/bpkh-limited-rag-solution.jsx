import React, { useState, useEffect } from 'react';

const BPKHLimitedSolution = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [activeTab, setActiveTab] = useState('architecture');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const modules = [
    { id: 'overview', name: 'Executive Overview', icon: '📊', color: '#0D9488' },
    { id: 'customer', name: 'Bilingual Customer Service', icon: '🎧', color: '#6366F1' },
    { id: 'planning', name: 'Corporate Planning', icon: '📈', color: '#F59E0B' },
    { id: 'performance', name: 'Performance Monitoring', icon: '🎯', color: '#EF4444' },
    { id: 'document', name: 'Document Intelligence', icon: '📄', color: '#10B981' },
    { id: 'implementation', name: 'Implementation Roadmap', icon: '🚀', color: '#8B5CF6' }
  ];

  const portfolioServices = [
    { name: 'Akomodasi Haji & Umrah', icon: '🏨', desc: 'Hotel di Mekkah & Madinah' },
    { name: 'Transportasi Bus', icon: '🚌', desc: 'Mobilitas jamaah antar lokasi' },
    { name: 'Tiket Kereta Cepat', icon: '🚄', desc: 'Haramain High Speed Railway' },
    { name: 'Dapur & Restoran', icon: '🍽️', desc: 'Katering halal berkualitas' }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Executive Summary Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-3xl shadow-lg">
            🏛️
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">BPKH Limited RAG Agentic AI Platform</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Solusi terintegrasi berbasis <span className="text-teal-400 font-semibold">Retrieval-Augmented Generation</span> dengan 
              arsitektur <span className="text-amber-400 font-semibold">Multi-Agent</span> untuk transformasi digital layanan 
              jamaah haji/umrah di Arab Saudi.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Integration */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">🎯</span>
          Integrasi Portofolio Layanan
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolioServices.map((service, idx) => (
            <div 
              key={idx}
              className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-105"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="text-3xl mb-3">{service.icon}</div>
              <h4 className="font-semibold text-white text-sm mb-1">{service.name}</h4>
              <p className="text-slate-400 text-xs">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 rounded-xl p-6 border border-indigo-700/50">
          <div className="text-4xl font-bold text-indigo-400 mb-2">85%</div>
          <div className="text-white font-medium">Efisiensi Layanan</div>
          <div className="text-slate-400 text-sm mt-1">Otomasi respons bilingual 24/7</div>
        </div>
        <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-xl p-6 border border-amber-700/50">
          <div className="text-4xl font-bold text-amber-400 mb-2">Real-time</div>
          <div className="text-white font-medium">Dashboard IDR-SAR</div>
          <div className="text-slate-400 text-sm mt-1">Konversi & realisasi otomatis</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-6 border border-emerald-700/50">
          <div className="text-4xl font-bold text-emerald-400 mb-2">Zero</div>
          <div className="text-white font-medium">Paper Process</div>
          <div className="text-slate-400 text-sm mt-1">Full digitalisasi Arab-Indonesia</div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">⚙️</span>
          High-Level Architecture
        </h3>
        <div className="relative">
          {/* Architecture SVG */}
          <svg viewBox="0 0 800 400" className="w-full h-auto">
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.5"/>
              </pattern>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#059669" stopOpacity="0.8"/>
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.8"/>
              </linearGradient>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.8"/>
              </linearGradient>
            </defs>
            <rect width="800" height="400" fill="url(#grid)"/>
            
            {/* Data Sources Layer */}
            <g transform="translate(30, 30)">
              <rect x="0" y="0" width="140" height="340" rx="8" fill="#1E293B" stroke="#475569"/>
              <text x="70" y="25" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="bold">DATA SOURCES</text>
              
              <rect x="10" y="40" width="120" height="45" rx="6" fill="#0F172A" stroke="#334155"/>
              <text x="70" y="60" textAnchor="middle" fill="#F59E0B" fontSize="11">📊 ERP/SAP</text>
              <text x="70" y="75" textAnchor="middle" fill="#64748B" fontSize="9">Financial Data</text>
              
              <rect x="10" y="95" width="120" height="45" rx="6" fill="#0F172A" stroke="#334155"/>
              <text x="70" y="115" textAnchor="middle" fill="#10B981" fontSize="11">📄 Documents</text>
              <text x="70" y="130" textAnchor="middle" fill="#64748B" fontSize="9">AR/ID Contracts</text>
              
              <rect x="10" y="150" width="120" height="45" rx="6" fill="#0F172A" stroke="#334155"/>
              <text x="70" y="170" textAnchor="middle" fill="#6366F1" fontSize="11">🎧 CRM</text>
              <text x="70" y="185" textAnchor="middle" fill="#64748B" fontSize="9">Jamaah/Mitra</text>
              
              <rect x="10" y="205" width="120" height="45" rx="6" fill="#0F172A" stroke="#334155"/>
              <text x="70" y="225" textAnchor="middle" fill="#EF4444" fontSize="11">👥 HRIS</text>
              <text x="70" y="240" textAnchor="middle" fill="#64748B" fontSize="9">Employee Data</text>
              
              <rect x="10" y="260" width="120" height="45" rx="6" fill="#0F172A" stroke="#334155"/>
              <text x="70" y="280" textAnchor="middle" fill="#8B5CF6" fontSize="11">🌐 External APIs</text>
              <text x="70" y="295" textAnchor="middle" fill="#64748B" fontSize="9">FX Rate, Weather</text>
            </g>

            {/* RAG Core Layer */}
            <g transform="translate(200, 30)">
              <rect x="0" y="0" width="180" height="340" rx="8" fill="url(#grad1)" fillOpacity="0.1" stroke="#0D9488"/>
              <text x="90" y="25" textAnchor="middle" fill="#0D9488" fontSize="12" fontWeight="bold">RAG CORE ENGINE</text>
              
              <rect x="10" y="45" width="160" height="60" rx="6" fill="#0F172A" stroke="#0D9488"/>
              <text x="90" y="65" textAnchor="middle" fill="#5EEAD4" fontSize="11" fontWeight="bold">Vector Store</text>
              <text x="90" y="82" textAnchor="middle" fill="#64748B" fontSize="9">Pinecone / Qdrant</text>
              <text x="90" y="95" textAnchor="middle" fill="#64748B" fontSize="9">Multi-lingual Embeddings</text>
              
              <rect x="10" y="115" width="160" height="60" rx="6" fill="#0F172A" stroke="#0D9488"/>
              <text x="90" y="135" textAnchor="middle" fill="#5EEAD4" fontSize="11" fontWeight="bold">Document Processor</text>
              <text x="90" y="152" textAnchor="middle" fill="#64748B" fontSize="9">Chunking + Indexing</text>
              <text x="90" y="165" textAnchor="middle" fill="#64748B" fontSize="9">Arabic-Indonesian OCR</text>
              
              <rect x="10" y="185" width="160" height="60" rx="6" fill="#0F172A" stroke="#0D9488"/>
              <text x="90" y="205" textAnchor="middle" fill="#5EEAD4" fontSize="11" fontWeight="bold">Retrieval Engine</text>
              <text x="90" y="222" textAnchor="middle" fill="#64748B" fontSize="9">Hybrid Search</text>
              <text x="90" y="235" textAnchor="middle" fill="#64748B" fontSize="9">Semantic + BM25</text>
              
              <rect x="10" y="255" width="160" height="60" rx="6" fill="#0F172A" stroke="#0D9488"/>
              <text x="90" y="275" textAnchor="middle" fill="#5EEAD4" fontSize="11" fontWeight="bold">Re-ranking</text>
              <text x="90" y="292" textAnchor="middle" fill="#64748B" fontSize="9">Cross-Encoder</text>
              <text x="90" y="305" textAnchor="middle" fill="#64748B" fontSize="9">Context Relevance</text>
            </g>

            {/* Agentic Layer */}
            <g transform="translate(410, 30)">
              <rect x="0" y="0" width="180" height="340" rx="8" fill="url(#grad2)" fillOpacity="0.1" stroke="#6366F1"/>
              <text x="90" y="25" textAnchor="middle" fill="#6366F1" fontSize="12" fontWeight="bold">AGENTIC AI LAYER</text>
              
              <rect x="10" y="45" width="160" height="50" rx="6" fill="#0F172A" stroke="#6366F1"/>
              <text x="90" y="65" textAnchor="middle" fill="#A5B4FC" fontSize="11" fontWeight="bold">🤖 Orchestrator Agent</text>
              <text x="90" y="82" textAnchor="middle" fill="#64748B" fontSize="9">Task Planning & Routing</text>
              
              <rect x="10" y="105" width="75" height="45" rx="6" fill="#0F172A" stroke="#818CF8"/>
              <text x="47" y="125" textAnchor="middle" fill="#C7D2FE" fontSize="9">Customer</text>
              <text x="47" y="140" textAnchor="middle" fill="#C7D2FE" fontSize="9">Agent</text>
              
              <rect x="95" y="105" width="75" height="45" rx="6" fill="#0F172A" stroke="#818CF8"/>
              <text x="132" y="125" textAnchor="middle" fill="#C7D2FE" fontSize="9">Planning</text>
              <text x="132" y="140" textAnchor="middle" fill="#C7D2FE" fontSize="9">Agent</text>
              
              <rect x="10" y="160" width="75" height="45" rx="6" fill="#0F172A" stroke="#818CF8"/>
              <text x="47" y="180" textAnchor="middle" fill="#C7D2FE" fontSize="9">Performance</text>
              <text x="47" y="195" textAnchor="middle" fill="#C7D2FE" fontSize="9">Agent</text>
              
              <rect x="95" y="160" width="75" height="45" rx="6" fill="#0F172A" stroke="#818CF8"/>
              <text x="132" y="180" textAnchor="middle" fill="#C7D2FE" fontSize="9">Document</text>
              <text x="132" y="195" textAnchor="middle" fill="#C7D2FE" fontSize="9">Agent</text>
              
              <rect x="10" y="215" width="160" height="50" rx="6" fill="#0F172A" stroke="#6366F1"/>
              <text x="90" y="235" textAnchor="middle" fill="#A5B4FC" fontSize="11" fontWeight="bold">🔧 Tool Registry</text>
              <text x="90" y="252" textAnchor="middle" fill="#64748B" fontSize="9">API Connectors + Functions</text>
              
              <rect x="10" y="275" width="160" height="50" rx="6" fill="#0F172A" stroke="#6366F1"/>
              <text x="90" y="295" textAnchor="middle" fill="#A5B4FC" fontSize="11" fontWeight="bold">💾 Memory Store</text>
              <text x="90" y="312" textAnchor="middle" fill="#64748B" fontSize="9">Conversation + Context</text>
            </g>

            {/* Output Layer */}
            <g transform="translate(620, 30)">
              <rect x="0" y="0" width="150" height="340" rx="8" fill="url(#grad3)" fillOpacity="0.1" stroke="#F59E0B"/>
              <text x="75" y="25" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="bold">INTERFACES</text>
              
              <rect x="10" y="45" width="130" height="55" rx="6" fill="#0F172A" stroke="#F59E0B"/>
              <text x="75" y="65" textAnchor="middle" fill="#FCD34D" fontSize="11">💬 WhatsApp Bot</text>
              <text x="75" y="82" textAnchor="middle" fill="#64748B" fontSize="9">Jamaah & Mitra</text>
              <text x="75" y="95" textAnchor="middle" fill="#64748B" fontSize="8">AR + ID Support</text>
              
              <rect x="10" y="110" width="130" height="55" rx="6" fill="#0F172A" stroke="#F59E0B"/>
              <text x="75" y="130" textAnchor="middle" fill="#FCD34D" fontSize="11">📊 Dashboard</text>
              <text x="75" y="147" textAnchor="middle" fill="#64748B" fontSize="9">Management View</text>
              <text x="75" y="160" textAnchor="middle" fill="#64748B" fontSize="8">Real-time Analytics</text>
              
              <rect x="10" y="175" width="130" height="55" rx="6" fill="#0F172A" stroke="#F59E0B"/>
              <text x="75" y="195" textAnchor="middle" fill="#FCD34D" fontSize="11">🌐 Web Portal</text>
              <text x="75" y="212" textAnchor="middle" fill="#64748B" fontSize="9">Self-Service</text>
              <text x="75" y="225" textAnchor="middle" fill="#64748B" fontSize="8">Order & Tracking</text>
              
              <rect x="10" y="240" width="130" height="55" rx="6" fill="#0F172A" stroke="#F59E0B"/>
              <text x="75" y="260" textAnchor="middle" fill="#FCD34D" fontSize="11">📱 Mobile App</text>
              <text x="75" y="277" textAnchor="middle" fill="#64748B" fontSize="9">Field Operations</text>
              <text x="75" y="290" textAnchor="middle" fill="#64748B" fontSize="8">Offline Support</text>
              
              <rect x="10" y="305" width="130" height="30" rx="6" fill="#0F172A" stroke="#F59E0B"/>
              <text x="75" y="325" textAnchor="middle" fill="#FCD34D" fontSize="11">🔗 API Gateway</text>
            </g>

            {/* Connection Lines */}
            <g stroke="#475569" strokeWidth="1.5" fill="none" strokeDasharray="5,3">
              <path d="M 170 200 L 200 200"/>
              <path d="M 380 200 L 410 200"/>
              <path d="M 590 200 L 620 200"/>
            </g>
            
            {/* Arrows */}
            <g fill="#0D9488">
              <polygon points="200,195 200,205 210,200"/>
              <polygon points="410,195 410,205 420,200"/>
              <polygon points="620,195 620,205 630,200"/>
            </g>
          </svg>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">🛠️</span>
          Technology Stack (Zero/Low Cost Optimized)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">LLM Provider</div>
            <div className="text-white font-medium">Groq API (Free)</div>
            <div className="text-xs text-teal-400">Llama 3.3 70B</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Vector DB</div>
            <div className="text-white font-medium">Supabase pgvector</div>
            <div className="text-xs text-teal-400">500MB Free Tier</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Compute</div>
            <div className="text-white font-medium">Cloudflare Workers</div>
            <div className="text-xs text-teal-400">100K req/day Free</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Orchestration</div>
            <div className="text-white font-medium">n8n Self-hosted</div>
            <div className="text-xs text-teal-400">Unlimited Workflows</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerService = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 rounded-2xl p-6 border border-indigo-700/50">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-indigo-500 flex items-center justify-center text-2xl shadow-lg">🎧</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Automated Bilingual Customer Service</h2>
            <p className="text-indigo-300">Transformasi layanan jamaah/mitra di KSA dengan AI bilingual AR-ID</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-indigo-400">📋</span> Use Cases
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Reservasi Akomodasi', desc: 'Booking hotel Mekkah/Madinah via WhatsApp', icon: '🏨' },
                { title: 'Pemesanan Transportasi', desc: 'Bus shuttle & tiket Haramain', icon: '🚌' },
                { title: 'Layanan Katering', desc: 'Menu harian & pesanan khusus', icon: '🍽️' },
                { title: 'Komplain & Feedback', desc: 'Handling keluhan real-time', icon: '📞' },
                { title: 'Info Jadwal Haji', desc: 'Manasik & itinerary jamaah', icon: '📅' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-white font-medium">{item.title}</div>
                    <div className="text-slate-400 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Architecture */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-indigo-400">🤖</span> Multi-Agent Architecture
            </h3>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-indigo-600/30">
              <div className="space-y-3">
                <div className="bg-indigo-900/30 rounded-lg p-3">
                  <div className="text-indigo-300 font-semibold text-sm">Language Router Agent</div>
                  <div className="text-slate-400 text-xs mt-1">Deteksi bahasa input → Arabic/Indonesian/English</div>
                </div>
                <div className="bg-indigo-900/30 rounded-lg p-3">
                  <div className="text-indigo-300 font-semibold text-sm">Intent Classifier Agent</div>
                  <div className="text-slate-400 text-xs mt-1">Kategorisasi: Booking | Info | Complaint | General</div>
                </div>
                <div className="bg-indigo-900/30 rounded-lg p-3">
                  <div className="text-indigo-300 font-semibold text-sm">Knowledge Retrieval Agent</div>
                  <div className="text-slate-400 text-xs mt-1">RAG dari KB: SOP, FAQ, Tarif, Jadwal</div>
                </div>
                <div className="bg-indigo-900/30 rounded-lg p-3">
                  <div className="text-indigo-300 font-semibold text-sm">Action Executor Agent</div>
                  <div className="text-slate-400 text-xs mt-1">API calls: Create booking, Update status, Escalate</div>
                </div>
                <div className="bg-indigo-900/30 rounded-lg p-3">
                  <div className="text-indigo-300 font-semibold text-sm">Response Generator Agent</div>
                  <div className="text-slate-400 text-xs mt-1">Natural response dalam bahasa user + formatting</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Conversation Flow */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-indigo-400">💬</span> Sample Conversation Flow
          </h3>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="space-y-3 font-mono text-sm">
              <div className="flex gap-3">
                <span className="text-green-400 shrink-0">👤 User:</span>
                <span className="text-slate-300">أريد حجز غرفة في فندق قريب من الحرم</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 shrink-0">🤖 Bot:</span>
                <span className="text-slate-300">
                  مرحباً بك! يسعدني مساعدتك في حجز غرفة قريبة من الحرم المكي. 
                  <br/>لدينا الخيارات التالية المتاحة:
                  <br/>🏨 فندق دار التوحيد - 200م من الحرم - 850 ريال/ليلة
                  <br/>🏨 فندق الصفوة - 500م من الحرم - 650 ريال/ليلة
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 shrink-0">👤 User:</span>
                <span className="text-slate-300">Saya mau yang lebih murah</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 shrink-0">🤖 Bot:</span>
                <span className="text-slate-300">
                  Baik Pak/Bu, untuk pilihan yang lebih ekonomis kami rekomendasikan:
                  <br/>🏨 Hotel Al-Safwa - jarak 500m dari Masjidil Haram
                  <br/>💰 Harga: 650 SAR/malam (setara Rp 2.730.000)
                  <br/>✅ Termasuk: Sarapan, WiFi, Shuttle ke Haram
                  <br/><br/>Apakah Bapak/Ibu ingin saya proses reservasinya?
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Technical Implementation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-indigo-400 font-medium mb-2">Knowledge Base</div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• SOP layanan (AR + ID versions)</li>
              <li>• Katalog hotel & tarif terkini</li>
              <li>• FAQ jamaah/mitra (500+ entries)</li>
              <li>• Jadwal Haramain & bus routes</li>
              <li>• Menu katering & spesifikasi</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-indigo-400 font-medium mb-2">Integration Points</div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• WhatsApp Business API (Twilio/WABA)</li>
              <li>• Booking system API</li>
              <li>• CRM for customer data</li>
              <li>• Payment gateway (optional)</li>
              <li>• Escalation to human agent</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCorporatePlanning = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-900/50 to-slate-900 rounded-2xl p-6 border border-amber-700/50">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center text-2xl shadow-lg">📈</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Intelligent Corporate Planning</h2>
            <p className="text-amber-300">Dashboard realisasi otomatis dengan konversi IDR-SAR real-time</p>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Total Budget (SAR)</div>
              <div className="text-2xl font-bold text-emerald-400">125.8M</div>
              <div className="text-emerald-300 text-xs">≈ Rp 528.36 Miliar</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Realisasi YTD</div>
              <div className="text-2xl font-bold text-blue-400">87.2M</div>
              <div className="text-blue-300 text-xs">69.3% dari budget</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">FX Rate (SAR/IDR)</div>
              <div className="text-2xl font-bold text-purple-400">4,200</div>
              <div className="text-purple-300 text-xs">Updated: Real-time</div>
            </div>
            <div className="bg-gradient-to-br from-rose-900/50 to-rose-800/30 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Variance</div>
              <div className="text-2xl font-bold text-rose-400">-5.2%</div>
              <div className="text-rose-300 text-xs">Under budget</div>
            </div>
          </div>

          {/* Mini Chart Representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-white font-medium mb-3">Realisasi per Lini Bisnis</div>
              <div className="space-y-3">
                {[
                  { name: 'Akomodasi', budget: 45, actual: 42, color: 'bg-emerald-500' },
                  { name: 'Transportasi', budget: 30, actual: 28, color: 'bg-blue-500' },
                  { name: 'Katering', budget: 35, actual: 25, color: 'bg-amber-500' },
                  { name: 'Tiket Kereta', budget: 15.8, actual: 12.2, color: 'bg-purple-500' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{item.name}</span>
                      <span className="text-slate-400">{item.actual}M / {item.budget}M SAR</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${(item.actual / item.budget) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-white font-medium mb-3">AI-Generated Insights</div>
              <div className="space-y-2 text-sm">
                <div className="bg-amber-900/30 rounded-lg p-3 border-l-4 border-amber-500">
                  <div className="text-amber-300 font-medium">⚠️ Alert: Katering</div>
                  <div className="text-slate-400">Realisasi 71.4% - proyeksi tidak tercapai Q4</div>
                </div>
                <div className="bg-emerald-900/30 rounded-lg p-3 border-l-4 border-emerald-500">
                  <div className="text-emerald-300 font-medium">✅ On Track: Akomodasi</div>
                  <div className="text-slate-400">93.3% realisasi, sesuai proyeksi musim haji</div>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-3 border-l-4 border-blue-500">
                  <div className="text-blue-300 font-medium">📊 Rekomendasi</div>
                  <div className="text-slate-400">Realokasi Rp 2.1M dari Akomodasi ke Katering</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <div className="text-amber-400 text-2xl mb-3">🔄</div>
            <div className="text-white font-semibold mb-2">Auto Data Sync</div>
            <div className="text-slate-400 text-sm">Sinkronisasi otomatis dari SAP/ERP setiap 15 menit dengan validasi data integrity</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <div className="text-amber-400 text-2xl mb-3">💱</div>
            <div className="text-white font-semibold mb-2">FX Intelligence</div>
            <div className="text-slate-400 text-sm">Real-time IDR-SAR dari JISDOR BI dengan alert threshold dan hedging recommendation</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <div className="text-amber-400 text-2xl mb-3">🎯</div>
            <div className="text-white font-semibold mb-2">Predictive Analytics</div>
            <div className="text-slate-400 text-sm">Forecast realisasi Q+1 dengan ML model berdasarkan historical trend</div>
          </div>
        </div>
      </div>

      {/* Natural Language Query */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-amber-400">💬</span> Natural Language Query Interface
        </h3>
        <div className="bg-slate-900/50 rounded-xl p-4 font-mono text-sm">
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-green-400 shrink-0">👤 User:</span>
              <span className="text-slate-300">"Berapa realisasi transportasi Q3 dalam rupiah dan variance-nya?"</span>
            </div>
            <div className="flex gap-3">
              <span className="text-amber-400 shrink-0">🤖 AI:</span>
              <span className="text-slate-300">
                Realisasi Transportasi Q3 2025:
                <br/>• SAR: 9.2 juta (Rp 38.64 miliar @ rate 4,200)
                <br/>• Budget: 10.5 juta SAR
                <br/>• Variance: -12.4% (under budget Rp 5.46 miliar)
                <br/>• Penyebab: Delay operasional bus rute Jeddah
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-900/50 to-slate-900 rounded-2xl p-6 border border-red-700/50">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center text-2xl shadow-lg">🎯</div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI-Based Performance Monitoring</h2>
            <p className="text-red-300">Pemantauan kinerja individu yang objektif & data-driven</p>
          </div>
        </div>

        {/* KPI Framework */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-400">📊</span> Multi-Dimensional KPI Framework
            </h3>
            <div className="space-y-3">
              {[
                { category: 'Operasional', kpis: ['SLA Achievement', 'Response Time', 'Error Rate'], weight: 40 },
                { category: 'Finansial', kpis: ['Cost Efficiency', 'Revenue Target', 'Budget Adherence'], weight: 30 },
                { category: 'Customer', kpis: ['CSAT Score', 'Complaint Resolution', 'Repeat Business'], weight: 20 },
                { category: 'Development', kpis: ['Training Completion', 'Skill Assessment', 'Innovation'], weight: 10 }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{item.category}</span>
                    <span className="text-slate-400 text-sm">{item.weight}% weight</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.kpis.map((kpi, i) => (
                      <span key={i} className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded">{kpi}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Individual Dashboard */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-400">👤</span> Individual Performance Card
            </h3>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white font-bold">AM</div>
                <div>
                  <div className="text-white font-medium">Ahmad Muhammad</div>
                  <div className="text-slate-400 text-sm">Operations Manager - Akomodasi</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-3xl font-bold text-emerald-400">87</div>
                  <div className="text-slate-400 text-xs">Overall Score</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {[
                  { name: 'Operasional', score: 92, color: 'bg-emerald-500' },
                  { name: 'Finansial', score: 85, color: 'bg-blue-500' },
                  { name: 'Customer', score: 88, color: 'bg-amber-500' },
                  { name: 'Development', score: 75, color: 'bg-purple-500' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm w-24">{item.name}</span>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }}/>
                    </div>
                    <span className="text-white text-sm w-8">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <div className="text-red-400 text-2xl mb-3">🔍</div>
            <div className="text-white font-semibold mb-2">Bias Detection</div>
            <div className="text-slate-400 text-sm">AI menganalisis pattern assessment untuk mendeteksi potential bias dalam penilaian supervisor</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <div className="text-red-400 text-2xl mb-3">📈</div>
            <div className="text-white font-semibold mb-2">Trend Analysis</div>
            <div className="text-slate-400 text-sm">Historical performance tracking dengan early warning system untuk declining trends</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <div className="text-red-400 text-2xl mb-3">🎓</div>
            <div className="text-white font-semibold mb-2">Development Path</div>
            <div className="text-slate-400 text-sm">AI-generated personalized learning path berdasarkan gap analysis dan career goals</div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Automated Data Collection Sources</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { source: 'CRM System', data: 'Customer interactions, complaints, resolution', icon: '💼' },
            { source: 'Booking System', data: 'Transaction volume, SLA compliance', icon: '📅' },
            { source: 'Time & Attendance', data: 'Punctuality, overtime, leave pattern', icon: '⏰' },
            { source: 'Financial System', data: 'Cost center efficiency, budget usage', icon: '💰' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-white font-medium text-sm">{item.source}</div>
              <div className="text-slate-400 text-xs mt-1">{item.data}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocumentIntelligence = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900 rounded-2xl p-6 border border-emerald-700/50">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center text-2xl shadow-lg">📄</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Bilingual Document Intelligence</h2>
            <p className="text-emerald-300">Digitalisasi & otomasi surat-menyurat Arab-Indonesia</p>
          </div>
        </div>

        {/* Document Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-emerald-400">📁</span> Supported Document Types
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'Kontrak Kerjasama', format: 'AR + ID', icon: '📝' },
                { type: 'Invoice & Tagihan', format: 'AR', icon: '💵' },
                { type: 'Surat Perjanjian', format: 'AR + ID', icon: '🤝' },
                { type: 'Dokumen Perizinan', format: 'AR', icon: '📋' },
                { type: 'Laporan Operasional', format: 'AR + ID', icon: '📊' },
                { type: 'Korespondensi Resmi', format: 'AR + ID', icon: '✉️' },
                { type: 'SOP & Manual', format: 'AR + ID', icon: '📖' },
                { type: 'Memo Internal', format: 'ID', icon: '📌' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{item.type}</div>
                    <div className="text-emerald-400 text-xs">{item.format}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Pipeline */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-emerald-400">⚙️</span> Processing Pipeline
            </h3>
            <div className="space-y-3">
              {[
                { step: 1, name: 'Document Ingestion', desc: 'Upload via API/Email/Portal', icon: '📥' },
                { step: 2, name: 'OCR + Language Detection', desc: 'Arabic/Indonesian text extraction', icon: '👁️' },
                { step: 3, name: 'Entity Extraction', desc: 'NER: Nama, Tanggal, Nominal, Pihak', icon: '🏷️' },
                { step: 4, name: 'Classification & Routing', desc: 'Auto-kategorisasi & assign PIC', icon: '🔀' },
                { step: 5, name: 'Translation (Optional)', desc: 'AR↔ID dengan context preservation', icon: '🌐' },
                { step: 6, name: 'Storage & Indexing', desc: 'Vector DB + metadata cataloging', icon: '💾' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{item.name}</div>
                    <div className="text-slate-400 text-xs">{item.desc}</div>
                  </div>
                  <span className="text-xl">{item.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Query Interface */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-emerald-400">🔍</span> Intelligent Document Query
          </h3>
          <div className="bg-slate-900/50 rounded-xl p-4 font-mono text-sm">
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-green-400 shrink-0">👤 User:</span>
                <span className="text-slate-300">"Tampilkan semua kontrak hotel yang expire dalam 3 bulan"</span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400 shrink-0">🤖 AI:</span>
                <span className="text-slate-300">
                  Ditemukan 4 kontrak yang akan expire:
                  <br/><br/>
                  1. 📄 Kontrak Hotel Dar Al-Tawhid
                  <br/>   • Expire: 15 Maret 2026 (87 hari)
                  <br/>   • Nilai: 2.5M SAR/tahun
                  <br/>   • [Lihat Detail] [Generate Reminder]
                  <br/><br/>
                  2. 📄 Kontrak Apartemen Aziziyah
                  <br/>   • Expire: 28 Februari 2026 (72 hari)
                  <br/>   • Nilai: 800K SAR/tahun
                  <br/>   • [Lihat Detail] [Generate Reminder]
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 shrink-0">👤 User:</span>
                <span className="text-slate-300">"Buatkan draft surat perpanjangan untuk Dar Al-Tawhid dalam bahasa Arab"</span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400 shrink-0">🤖 AI:</span>
                <span className="text-slate-300 text-right" dir="rtl">
                  بسم الله الرحمن الرحيم
                  <br/>
                  السادة إدارة فندق دار التوحيد المحترمين
                  <br/>
                  الموضوع: طلب تجديد عقد الإيجار
                  <br/>
                  تحية طيبة وبعد،
                  <br/>
                  نود إعلامكم برغبتنا في تجديد عقد الإيجار...
                  <br/><br/>
                  <span className="text-emerald-400">[📥 Download PDF] [✏️ Edit] [🌐 Translate to ID]</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OCR Capabilities */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Arabic-Indonesian OCR Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-700/30">
            <div className="text-emerald-400 font-medium mb-2">Arabic Script</div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Modern Standard Arabic</li>
              <li>• Saudi formal documents</li>
              <li>• Handwritten recognition</li>
              <li>• 98.5% accuracy rate</li>
            </ul>
          </div>
          <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-700/30">
            <div className="text-emerald-400 font-medium mb-2">Indonesian</div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Formal Indonesian</li>
              <li>• Legal terminology</li>
              <li>• Mixed AR-ID documents</li>
              <li>• 99.2% accuracy rate</li>
            </ul>
          </div>
          <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-700/30">
            <div className="text-emerald-400 font-medium mb-2">Special Features</div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Table extraction</li>
              <li>• Signature detection</li>
              <li>• Stamp/seal recognition</li>
              <li>• Layout preservation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderImplementation = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-900/50 to-slate-900 rounded-2xl p-6 border border-purple-700/50">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center text-2xl shadow-lg">🚀</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Implementation Roadmap</h2>
            <p className="text-purple-300">Phased rollout dengan quick wins untuk stakeholder buy-in</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-amber-500 to-emerald-500"/>
          
          <div className="space-y-6">
            {/* Phase 1 */}
            <div className="relative pl-20">
              <div className="absolute left-6 w-5 h-5 rounded-full bg-purple-500 border-4 border-slate-900"/>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded font-bold">PHASE 1</span>
                  <span className="text-white font-semibold">Foundation (Month 1-2)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-purple-300 text-sm font-medium mb-2">Deliverables</div>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>✓ Infrastructure setup (Cloudflare + Supabase)</li>
                      <li>✓ Knowledge base seeding (FAQ, SOP)</li>
                      <li>✓ Basic WhatsApp bot (ID only)</li>
                      <li>✓ Document OCR pipeline (ID)</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-purple-300 text-sm font-medium mb-2">Quick Wins</div>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>🎯 50% reduction in FAQ calls</li>
                      <li>🎯 Document search in &lt;5 seconds</li>
                      <li>🎯 24/7 automated responses</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-20">
              <div className="absolute left-6 w-5 h-5 rounded-full bg-amber-500 border-4 border-slate-900"/>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-amber-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded font-bold">PHASE 2</span>
                  <span className="text-white font-semibold">Enhancement (Month 3-4)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-amber-300 text-sm font-medium mb-2">Deliverables</div>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>✓ Arabic language support</li>
                      <li>✓ Corporate planning dashboard</li>
                      <li>✓ IDR-SAR real-time conversion</li>
                      <li>✓ Booking system integration</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-amber-300 text-sm font-medium mb-2">Value Add</div>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>🎯 Arabic customer support live</li>
                      <li>🎯 Real-time budget monitoring</li>
                      <li>🎯 Automated variance alerts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative pl-20">
              <div className="absolute left-6 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-900"/>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-emerald-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded font-bold">PHASE 3</span>
                  <span className="text-white font-semibold">Full Platform (Month 5-6)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-emerald-300 text-sm font-medium mb-2">Deliverables</div>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>✓ Performance monitoring system</li>
                      <li>✓ Full document intelligence (AR-ID)</li>
                      <li>✓ Multi-agent orchestration</li>
                      <li>✓ Mobile app deployment</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-emerald-300 text-sm font-medium mb-2">Full Value</div>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>🎯 85% automation rate</li>
                      <li>🎯 Objective performance reviews</li>
                      <li>🎯 Zero paper document process</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Estimation */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-emerald-400">💰</span> Zero/Low Cost Architecture Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Component</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Provider</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Tier</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                { component: 'LLM API', provider: 'Groq', tier: 'Free (14,400 req/day)', cost: '$0' },
                { component: 'Vector Database', provider: 'Supabase pgvector', tier: 'Free (500MB)', cost: '$0' },
                { component: 'Compute (Serverless)', provider: 'Cloudflare Workers', tier: 'Free (100K req/day)', cost: '$0' },
                { component: 'Workflow Automation', provider: 'n8n Self-hosted', tier: 'Open Source', cost: '$0' },
                { component: 'WhatsApp API', provider: 'Meta WABA', tier: 'Conversation-based', cost: '~$50' },
                { component: 'OCR Service', provider: 'Tesseract + Arabic', tier: 'Open Source', cost: '$0' },
                { component: 'Hosting (n8n)', provider: 'Railway/Render', tier: 'Starter', cost: '~$5' },
                { component: 'Domain & SSL', provider: 'Cloudflare', tier: 'Free', cost: '$0' }
              ].map((item, idx) => (
                <tr key={idx} className="border-b border-slate-800">
                  <td className="py-3 px-4 text-white">{item.component}</td>
                  <td className="py-3 px-4 text-slate-300">{item.provider}</td>
                  <td className="py-3 px-4 text-emerald-400">{item.tier}</td>
                  <td className="py-3 px-4 text-right text-white font-medium">{item.cost}</td>
                </tr>
              ))}
              <tr className="bg-emerald-900/20">
                <td colSpan="3" className="py-3 px-4 text-white font-bold">Total Estimated Monthly</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-bold text-lg">~$55</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Requirements */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-purple-400">👥</span> Team Requirements (Minimal)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
            <div className="text-purple-400 font-medium mb-2">AI/ML Lead</div>
            <div className="text-slate-300 text-sm">RAG pipeline, prompt engineering, agent design</div>
            <div className="text-slate-500 text-xs mt-2">1 person (can be outsourced)</div>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
            <div className="text-purple-400 font-medium mb-2">Full-stack Developer</div>
            <div className="text-slate-300 text-sm">Dashboard, integrations, API development</div>
            <div className="text-slate-500 text-xs mt-2">1-2 persons</div>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
            <div className="text-purple-400 font-medium mb-2">Domain Expert</div>
            <div className="text-slate-300 text-sm">KB curation, testing, Arabic content</div>
            <div className="text-slate-500 text-xs mt-2">1 person (internal)</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeModule) {
      case 'overview': return renderOverview();
      case 'customer': return renderCustomerService();
      case 'planning': return renderCorporatePlanning();
      case 'performance': return renderPerformanceMonitoring();
      case 'document': return renderDocumentIntelligence();
      case 'implementation': return renderImplementation();
      default: return renderOverview();
    }
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-white transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-xl font-bold shadow-lg">
                🏛️
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BPKH Limited</h1>
                <p className="text-sm text-slate-400">RAG Agentic AI Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
              <span className="text-xs text-slate-400">Powered by</span>
              <span className="text-xs text-teal-400 font-medium">McKinsey AI Practice</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800/50 border-b border-slate-700 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeModule === module.id
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{module.icon}</span>
                <span className="hidden sm:inline">{module.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-400 text-sm">
              © 2025 BPKH Limited - RAG Agentic AI Solution Blueprint
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-500">Prepared by:</span>
              <span className="text-teal-400">Senior Expert Consultant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BPKHLimitedSolution;
