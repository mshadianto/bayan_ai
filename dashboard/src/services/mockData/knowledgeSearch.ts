/**
 * Knowledge Search Engine for Kamus Syarikah AI Assistant
 * Uses TF-IDF-like scoring with Indonesian language support
 */

import { knowledgeChunks, KBChunk } from './knowledgeBase';

// Indonesian stopwords - common words to exclude from search
const STOPWORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'ini', 'itu', 'adalah',
  'pada', 'atau', 'dalam', 'oleh', 'sebagai', 'tidak', 'juga', 'akan', 'dapat',
  'telah', 'tersebut', 'sesuai', 'serta', 'atas', 'bahwa', 'antara', 'melalui',
  'secara', 'kepada', 'terhadap', 'setiap', 'berdasarkan', 'tentang', 'maupun',
  'harus', 'wajib', 'meliputi', 'mencakup', 'melakukan', 'dilakukan', 'memiliki',
  'apabila', 'jika', 'ketika', 'saat', 'agar', 'supaya', 'namun', 'tetapi',
  'the', 'a', 'an', 'of', 'to', 'in', 'for', 'and', 'or', 'is', 'are', 'be',
]);

// Synonym map for Indonesian/English equivalents and domain terms
const SYNONYMS: Record<string, string[]> = {
  // HR/SDM terms
  'karyawan': ['pegawai', 'pekerja', 'sdm', 'tenaga kerja', 'employee', 'staff'],
  'pegawai': ['karyawan', 'pekerja', 'sdm', 'tenaga kerja', 'employee'],
  'sdm': ['karyawan', 'pegawai', 'sumber daya manusia', 'hr', 'human resource'],
  'rekrutmen': ['recruitment', 'penerimaan', 'seleksi', 'hiring'],
  'gaji': ['remunerasi', 'salary', 'upah', 'tunjangan', 'compensation', 'pendapatan'],
  'remunerasi': ['gaji', 'salary', 'upah', 'tunjangan', 'compensation'],
  'cuti': ['leave', 'izin', 'libur'],
  'kinerja': ['performance', 'prestasi', 'performa'],

  // Investment/Business terms
  'investasi': ['investment', 'penanaman modal', 'portofolio', 'penempatan dana'],
  'portofolio': ['portfolio', 'investasi', 'aset'],
  'bisnis': ['business', 'usaha', 'kegiatan usaha'],
  'anggaran': ['budget', 'dana', 'alokasi'],
  'rpbp': ['rencana bisnis', 'business plan', 'rencana jangka panjang'],
  'rbtp': ['rencana tahunan', 'annual plan', 'target tahunan'],

  // Governance terms
  'mudir': ['direksi', 'direktur', 'board', 'director', 'dewan mudir'],
  'direksi': ['mudir', 'direktur', 'board', 'director'],
  'governance': ['tata kelola', 'gcg', 'pengelolaan'],
  'gcg': ['governance', 'tata kelola', 'good corporate governance'],

  // Compliance terms
  'compliance': ['kepatuhan', 'patuh', 'ketaatan'],
  'kepatuhan': ['compliance', 'patuh', 'ketaatan'],
  'risiko': ['risk', 'resiko'],
  'audit': ['pemeriksaan', 'pengawasan'],

  // Travel terms
  'perjalanan dinas': ['business travel', 'perdin', 'travel'],
  'perdin': ['perjalanan dinas', 'business travel'],
  'transportasi': ['transport', 'kendaraan', 'angkutan'],
  'akomodasi': ['hotel', 'penginapan', 'lodging', 'accommodation'],

  // Document terms
  'peraturan': ['regulation', 'aturan', 'kebijakan', 'policy'],
  'syarikah': ['perusahaan', 'company', 'korporasi'],
  'hierarki': ['hierarchy', 'tingkatan', 'urutan'],

  // Other business terms
  'shareholder': ['pemegang saham', 'investor'],
  'induk usaha': ['parent company', 'bpkh', 'holding'],
};

// Inverted index cache
let invertedIndex: Map<string, Set<number>> | null = null;
let chunkTokensCache: string[][] | null = null;

/**
 * Tokenize text: lowercase, remove punctuation, split, remove stopwords
 */
function tokenize(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized
    .split(' ')
    .filter(word => word.length > 2 && !STOPWORDS.has(word));
}

/**
 * Expand query with synonyms
 */
function expandWithSynonyms(tokens: string[]): string[] {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    // Direct synonym lookup
    if (SYNONYMS[token]) {
      SYNONYMS[token].forEach(syn => expanded.add(syn));
    }

    // Reverse lookup: find if this token is a synonym of something
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (syns.includes(token)) {
        expanded.add(key);
        syns.forEach(s => expanded.add(s));
      }
    }
  }

  return Array.from(expanded);
}

/**
 * Build inverted index for fast lookup
 */
function buildIndex(): void {
  if (invertedIndex !== null) return;

  invertedIndex = new Map();
  chunkTokensCache = [];

  for (let i = 0; i < knowledgeChunks.length; i++) {
    const chunk = knowledgeChunks[i];
    const tokens = tokenize(chunk.text + ' ' + chunk.section + ' ' + chunk.keywords.join(' '));
    chunkTokensCache.push(tokens);

    for (const token of tokens) {
      if (!invertedIndex.has(token)) {
        invertedIndex.set(token, new Set());
      }
      invertedIndex.get(token)!.add(i);
    }
  }
}

/**
 * Calculate TF-IDF-like score for a chunk given query tokens
 */
function scoreChunk(chunkIdx: number, queryTokens: string[]): number {
  if (!chunkTokensCache) return 0;

  const chunkTokens = chunkTokensCache[chunkIdx];
  const chunk = knowledgeChunks[chunkIdx];
  let score = 0;

  const chunkText = chunk.text.toLowerCase();
  const chunkSection = chunk.section.toLowerCase();

  for (const qToken of queryTokens) {
    // Term frequency in chunk
    const tf = chunkTokens.filter(t => t === qToken || t.includes(qToken)).length;
    if (tf === 0) continue;

    // Inverse document frequency (rarer = higher score)
    const docCount = invertedIndex?.get(qToken)?.size || 1;
    const idf = Math.log(knowledgeChunks.length / docCount);

    score += tf * idf;

    // Bonus for exact match in section header
    if (chunkSection.includes(qToken)) {
      score += 2;
    }

    // Bonus for keyword match
    if (chunk.keywords.some(k => k.includes(qToken))) {
      score += 1.5;
    }
  }

  // Bonus for phrase match (consecutive tokens)
  const queryPhrase = queryTokens.slice(0, 3).join(' ');
  if (queryPhrase.length > 5 && chunkText.includes(queryPhrase)) {
    score += 5;
  }

  return score;
}

/**
 * Search knowledge base and return formatted answer
 */
export function searchKnowledge(question: string): { answer: string; sources: string[] } {
  // Build index on first call
  buildIndex();

  // Tokenize and expand query
  const queryTokens = tokenize(question);
  if (queryTokens.length === 0) {
    return {
      answer: 'Silakan ajukan pertanyaan yang lebih spesifik tentang peraturan perusahaan.',
      sources: [],
    };
  }

  const expandedTokens = expandWithSynonyms(queryTokens);

  // Find candidate chunks via inverted index
  const candidates = new Set<number>();
  for (const token of expandedTokens) {
    const matches = invertedIndex?.get(token);
    if (matches) {
      matches.forEach(idx => candidates.add(idx));
    }
    // Also try partial matches
    invertedIndex?.forEach((indices, key) => {
      if (key.includes(token) || token.includes(key)) {
        indices.forEach(idx => candidates.add(idx));
      }
    });
  }

  if (candidates.size === 0) {
    return {
      answer: 'Maaf, saya tidak menemukan informasi spesifik terkait pertanyaan Anda dalam database Peraturan Syarikah BPKH Limited. Silakan coba kata kunci lain seperti: hierarki peraturan, SDM/kepegawaian, tata kelola, compliance, investasi, perjalanan dinas, atau rencana bisnis.',
      sources: [],
    };
  }

  // Score all candidates
  const scored: Array<{ idx: number; score: number }> = [];
  candidates.forEach(idx => {
    const score = scoreChunk(idx, expandedTokens);
    if (score > 0) {
      scored.push({ idx, score });
    }
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top results
  const topResults = scored.slice(0, 5);

  if (topResults.length === 0 || topResults[0].score < 1) {
    return {
      answer: 'Maaf, saya tidak menemukan informasi yang cukup relevan. Coba gunakan kata kunci yang lebih spesifik seperti: hierarki, SDM, karyawan, investasi, compliance, perjalanan dinas, mudir, atau tata kelola.',
      sources: [],
    };
  }

  // Group by document
  const byDoc = new Map<string, KBChunk[]>();
  for (const result of topResults) {
    const chunk = knowledgeChunks[result.idx];
    const key = chunk.docNumber;
    if (!byDoc.has(key)) {
      byDoc.set(key, []);
    }
    byDoc.get(key)!.push(chunk);
  }

  // Format answer
  const answerParts: string[] = [];
  const sources: string[] = [];

  byDoc.forEach((chunks, docNumber) => {
    const doc = chunks[0];
    const sections = [...new Set(chunks.map(c => c.section))].slice(0, 2);

    // Take best excerpt (first chunk's text, truncated if needed)
    let excerpt = chunks[0].text;
    if (excerpt.length > 400) {
      excerpt = excerpt.substring(0, 400) + '...';
    }

    const sectionRef = sections.join(', ');
    answerParts.push(
      `Berdasarkan ${docNumber} tentang ${doc.docTitle}${sectionRef ? ` (${sectionRef})` : ''}:\n\n"${excerpt}"`
    );

    sources.push(`${docNumber} - ${doc.docTitle}${sectionRef ? ` (${sectionRef})` : ''}`);
  });

  return {
    answer: answerParts.join('\n\n---\n\n'),
    sources,
  };
}
