import { useState, useEffect, useRef } from 'react';
import { lcrmsApi } from '../../services/supabaseLcrms';
import { Modal } from '../../components/common';
import type { LegalDocument } from '../../types';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'documents'>('chatbot');
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LegalDocument[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      type: 'assistant',
      content: 'Assalamu\'alaikum! Saya adalah Kamus Syarikah, asisten AI untuk membantu Anda menemukan informasi tentang peraturan dan kebijakan perusahaan. Silakan ajukan pertanyaan Anda.',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Document detail modal
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await lcrmsApi.knowledge.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const results = await lcrmsApi.knowledge.search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setSearching(false);
  };

  const handleAskQuestion = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await lcrmsApi.knowledge.askQuestion(inputValue);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get answer:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date(),
      }]);
    }
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const suggestedQuestions = [
    'Bagaimana hierarki peraturan perusahaan?',
    'Apa ketentuan perjalanan dinas?',
    'Bagaimana pedoman investasi dan bisnis?',
  ];

  const getDocTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      peraturan_syarikah: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      peraturan_mudir: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
      sk_direksi: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      surat_edaran: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      peraturan_perusahaan: 'bg-green-100 text-green-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      uu: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
      other: 'bg-hover text-content-tertiary',
    };
    return colors[type] || colors.other;
  };

  const getDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      peraturan_syarikah: 'Peraturan Syarikah',
      peraturan_mudir: 'Peraturan Mudir',
      sk_direksi: 'SK Direksi',
      surat_edaran: 'Surat Edaran',
      peraturan_perusahaan: 'Peraturan Perusahaan',
      uu: 'Undang-Undang',
      other: 'Lainnya',
    };
    return labels[type] || type;
  };

  const displayedDocuments = searchResults !== null ? searchResults : documents;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content">Legal Knowledge Base</h1>
        <p className="text-content-secondary">Kamus Syarikah - AI-Assisted Legal Information System</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('chatbot')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'chatbot'
              ? 'bg-amber-600 text-white'
              : 'bg-hover text-content-tertiary hover:bg-hover'
          }`}
        >
          Kamus Syarikah (AI Chat)
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'documents'
              ? 'bg-amber-600 text-white'
              : 'bg-hover text-content-tertiary hover:bg-hover'
          }`}
        >
          Document Library ({documents.length})
        </button>
      </div>

      {/* Chatbot Tab */}
      {activeTab === 'chatbot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2 bg-card rounded-lg shadow-sm border border-border flex flex-col h-[600px]">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.type === 'user'
                        ? 'bg-amber-600 text-white'
                        : 'bg-hover text-content'
                    }`}
                  >
                    {msg.type === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🤖</span>
                        <span className="font-medium text-amber-700 dark:text-amber-400">Kamus Syarikah</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-content-muted mb-1">Sumber:</p>
                        <ul className="text-xs space-y-1">
                          {msg.sources.map((source, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span>📄</span>
                              <span className="text-amber-700 dark:text-amber-400">{source}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-amber-200' : 'text-content-muted'}`}>
                      {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-hover rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤖</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-content-muted rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-content-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="w-2 h-2 bg-content-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tanyakan tentang peraturan atau kebijakan..."
                  className="flex-1 rounded-lg border border-border-subtle bg-input text-content px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={isTyping || !inputValue.trim()}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-hover disabled:text-content-muted disabled:cursor-not-allowed transition-colors"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Suggested Questions */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-4">
              <h3 className="font-semibold text-content mb-3">Pertanyaan Populer</h3>
              <div className="space-y-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(q)}
                    className="w-full text-left px-3 py-2 text-sm bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 rounded-lg text-amber-800 dark:text-amber-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white">
              <h3 className="font-semibold mb-2">Tentang Kamus Syarikah</h3>
              <p className="text-sm text-amber-100">
                Kamus Syarikah adalah asisten AI yang menggunakan teknologi RAG (Retrieval-Augmented Generation)
                untuk menjawab pertanyaan berdasarkan peraturan dan kebijakan perusahaan yang tersimpan dalam database.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-4">
              <h3 className="font-semibold text-content mb-3">Database Dokumen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-content-secondary">Total Dokumen</span>
                  <span className="font-medium">{documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary">Peraturan Syarikah</span>
                  <span className="font-medium">{documents.filter(d => d.document_type === 'peraturan_syarikah').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary">Peraturan Mudir</span>
                  <span className="font-medium">{documents.filter(d => d.document_type === 'peraturan_mudir').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary">Berlaku (Active)</span>
                  <span className="font-medium">{documents.filter(d => d.status === 'active').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Cari dokumen berdasarkan judul, ringkasan, atau kata kunci..."
                className="flex-1 rounded-lg border border-border-subtle bg-input text-content px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-hover transition-colors"
              >
                {searching ? 'Mencari...' : 'Cari'}
              </button>
              {searchResults !== null && (
                <button
                  onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                  className="px-4 py-2 bg-hover text-content-tertiary rounded-lg hover:bg-hover transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
            {searchResults !== null && (
              <p className="text-sm text-content-secondary mt-2">
                Ditemukan {searchResults.length} dokumen untuk "{searchQuery}"
              </p>
            )}
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocument(doc)}
                className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">📄</div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${getDocTypeColor(doc.document_type)}`}>
                      {getDocTypeLabel(doc.document_type)}
                    </span>
                    <h3 className="font-medium text-content truncate">{doc.title}</h3>
                    <p className="text-sm text-content-muted">{doc.document_number}</p>
                    {doc.summary && (
                      <p className="text-sm text-content-secondary mt-2 line-clamp-2">{doc.summary}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.keywords.slice(0, 3).map((kw, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-hover text-content-secondary rounded text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-content-muted mt-2">
                      Berlaku: {new Date(doc.effective_date || doc.issue_date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayedDocuments.length === 0 && (
            <div className="text-center py-12 text-content-muted">
              <span className="text-4xl mb-4 block">📭</span>
              <p>Tidak ada dokumen ditemukan</p>
            </div>
          )}
        </div>
      )}

      {/* Document Detail Modal */}
      <Modal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        title={selectedDocument?.title || ''}
        size="xl"
        footer={selectedDocument?.document_url ? (
          <button className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
            <span>📥</span>
            <span>Download Dokumen</span>
          </button>
        ) : undefined}
      >
        {selectedDocument && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getDocTypeColor(selectedDocument.document_type)}`}>
                {getDocTypeLabel(selectedDocument.document_type)}
              </span>
              <span className="text-content-secondary text-sm">{selectedDocument.document_number}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-content-secondary">Penerbit</p>
                <p className="font-medium text-content">{selectedDocument.issuer}</p>
              </div>
              <div>
                <p className="text-sm text-content-secondary">Kategori</p>
                <p className="font-medium text-content">{selectedDocument.category}</p>
              </div>
              <div>
                <p className="text-sm text-content-secondary">Tanggal Terbit</p>
                <p className="font-medium text-content">{new Date(selectedDocument.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-sm text-content-secondary">Tanggal Berlaku</p>
                <p className="font-medium text-content">{new Date(selectedDocument.effective_date || selectedDocument.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {selectedDocument.summary && (
              <div>
                <p className="text-sm text-content-secondary mb-1">Ringkasan</p>
                <p className="text-content-tertiary bg-card rounded-lg p-3">{selectedDocument.summary}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-content-secondary mb-2">Kata Kunci</p>
              <div className="flex flex-wrap gap-2">
                {(selectedDocument.keywords ?? []).map((kw, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 rounded-full text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-content-secondary mb-2">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedDocument.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                selectedDocument.status === 'amended' ? 'bg-yellow-100 text-yellow-700 dark:bg-amber-900/50 dark:text-amber-300' :
                'bg-hover text-content-tertiary'
              }`}>
                {selectedDocument.status === 'active' ? 'Berlaku' :
                 selectedDocument.status === 'amended' ? 'Diamendemen' : 'Dicabut'}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
