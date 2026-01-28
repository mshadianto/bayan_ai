#!/usr/bin/env python3
"""
Extract knowledge base from Docling JSON files for Kamus Syarikah AI assistant.
Generates dashboard/src/services/mockData/knowledgeBase.ts
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Any

# Document mapping with metadata
DOC_MAP = {
    '001 2025': {'number': 'PS-001/2025', 'title': 'Hierarki Peraturan Perusahaan', 'type': 'peraturan_syarikah'},
    '002 2025': {'number': 'PS-002/2025', 'title': 'Tata Kelola SDM (Versi Awal)', 'type': 'peraturan_syarikah'},
    '003 2025': {'number': 'PS-003/2025', 'title': 'Tata Kelola BPKH Limited dengan Induk Usaha', 'type': 'peraturan_syarikah'},
    '004 2025': {'number': 'PS-004/2025', 'title': 'Board Manual (Pedoman Kerja Dewan Mudir)', 'type': 'peraturan_syarikah'},
    '005 2025': {'number': 'PS-005/2025', 'title': 'Tata Kelola Kepatuhan (Compliance)', 'type': 'peraturan_syarikah'},
    '006 2025': {'number': 'PS-006/2025', 'title': 'Tata Kelola Sumber Daya Manusia', 'type': 'peraturan_syarikah'},
    '007 2024': {'number': 'PM-007/2024', 'title': 'RPBP 2024-2028 dan RBTP 2024', 'type': 'peraturan_mudir'},
    '007 2025': {'number': 'PS-007/2025', 'title': 'Pedoman Investasi dan Bisnis', 'type': 'peraturan_syarikah'},
    '008 2024': {'number': 'PM-008/2024', 'title': 'RBTP 2025', 'type': 'peraturan_mudir'},
    '008 2025': {'number': 'PS-008/2025', 'title': 'Tata Cara Perjalanan Dinas', 'type': 'peraturan_syarikah'},
}

# Files to skip (duplicates)
SKIP_FILES = ['[008 2025]', '009 2025']

def get_doc_key(filename: str) -> str:
    """Extract document key from filename."""
    # Match patterns like "001 2025", "007 2024", etc.
    match = re.match(r'(\d{3}\s+\d{4})', filename)
    if match:
        return match.group(1)
    return None

def clean_text(text: str) -> str:
    """Clean OCR artifacts and normalize whitespace."""
    if not text:
        return ''
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove excessive punctuation
    text = re.sub(r'\.{3,}', '...', text)
    return text.strip()

def extract_keywords(text: str) -> List[str]:
    """Extract potential keywords from text."""
    keywords = []
    # Common domain terms to look for
    domain_terms = [
        'mudir', 'direksi', 'perusahaan', 'peraturan', 'syarikah', 'bpkh', 'limited',
        'sdm', 'karyawan', 'pegawai', 'rekrutmen', 'cuti', 'gaji', 'remunerasi',
        'investasi', 'portofolio', 'bisnis', 'anggaran', 'rpbp', 'rbtp',
        'compliance', 'kepatuhan', 'risiko', 'audit',
        'perjalanan', 'dinas', 'transportasi', 'akomodasi',
        'governance', 'gcg', 'tata kelola',
        'hierarki', 'penomoran', 'dokumen',
        'induk usaha', 'shareholder', 'pemegang saham',
    ]
    lower_text = text.lower()
    for term in domain_terms:
        if term in lower_text:
            keywords.append(term)
    return list(set(keywords))[:5]  # Max 5 keywords per chunk

def parse_docling_json(filepath: str, doc_info: Dict) -> List[Dict[str, Any]]:
    """Parse a Docling JSON and extract text chunks."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    texts = data.get('texts', [])
    chunks = []

    current_bab = ''
    current_pasal = ''
    current_section = ''
    buffer_texts = []

    for i, item in enumerate(texts):
        label = item.get('label', '')
        text = clean_text(item.get('text', ''))

        if not text or len(text) < 10:
            continue

        # Skip furniture-like headers
        if 'DENGAN RAHMAT' in text or 'MUDIR BPKH LIMITED' in text:
            continue
        if text.startswith('PERATURAN SYARIKAH BPKH LIMITED NOMOR'):
            continue

        # Track section headers
        if label == 'section_header':
            # Flush buffer before changing section
            if buffer_texts and current_section:
                combined = ' '.join(buffer_texts)
                if len(combined) > 30:
                    chunks.append({
                        'docNumber': doc_info['number'],
                        'docTitle': doc_info['title'],
                        'section': current_section,
                        'text': combined,
                        'keywords': extract_keywords(combined),
                    })
                buffer_texts = []

            # Update section context
            if text.upper().startswith('BAB '):
                current_bab = text
                current_pasal = ''
                current_section = current_bab
            elif text.lower().startswith('pasal '):
                current_pasal = text
                current_section = f"{current_bab} - {current_pasal}" if current_bab else current_pasal
            elif text in ['Menimbang:', 'Mengingat:', 'MEMUTUSKAN:', 'Menetapkan:']:
                current_section = text.replace(':', '')
            else:
                # Other section headers - use as-is
                current_section = text[:50]

        elif label in ['text', 'list_item']:
            buffer_texts.append(text)

            # Flush if buffer gets long enough
            combined = ' '.join(buffer_texts)
            if len(combined) > 400:
                chunks.append({
                    'docNumber': doc_info['number'],
                    'docTitle': doc_info['title'],
                    'section': current_section or 'Umum',
                    'text': combined,
                    'keywords': extract_keywords(combined),
                })
                buffer_texts = []

    # Final flush
    if buffer_texts:
        combined = ' '.join(buffer_texts)
        if len(combined) > 30:
            chunks.append({
                'docNumber': doc_info['number'],
                'docTitle': doc_info['title'],
                'section': current_section or 'Umum',
                'text': combined,
                'keywords': extract_keywords(combined),
            })

    return chunks

def main():
    src_dir = Path(__file__).parent.parent / 'Peraturan Syarikah'
    out_file = Path(__file__).parent.parent / 'dashboard' / 'src' / 'services' / 'mockData' / 'knowledgeBase.ts'

    all_chunks = []
    processed = 0

    for filename in sorted(os.listdir(src_dir)):
        if not filename.endswith('.json'):
            continue

        # Skip duplicates
        skip = False
        for skip_prefix in SKIP_FILES:
            if filename.startswith(skip_prefix):
                print(f"Skipping duplicate: {filename}")
                skip = True
                break
        if skip:
            continue

        doc_key = get_doc_key(filename)
        if not doc_key or doc_key not in DOC_MAP:
            print(f"Unknown doc key for: {filename}")
            continue

        doc_info = DOC_MAP[doc_key]
        filepath = src_dir / filename

        print(f"Processing: {doc_info['number']} - {doc_info['title']}")
        chunks = parse_docling_json(str(filepath), doc_info)
        all_chunks.extend(chunks)
        processed += 1
        print(f"  Extracted {len(chunks)} chunks")

    print(f"\nTotal: {len(all_chunks)} chunks from {processed} documents")

    # Generate TypeScript
    ts_content = '''// Auto-generated by scripts/extract_knowledge_base.py
// Do not edit manually

export interface KBChunk {
  docNumber: string;
  docTitle: string;
  section: string;
  text: string;
  keywords: string[];
}

export const knowledgeChunks: KBChunk[] = '''

    # Convert to JSON with proper escaping
    chunks_json = json.dumps(all_chunks, ensure_ascii=False, indent=2)
    ts_content += chunks_json + ';\n'

    # Write output
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"\nOutput written to: {out_file}")
    print(f"File size: {out_file.stat().st_size / 1024:.1f} KB")

if __name__ == '__main__':
    main()
