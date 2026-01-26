import { createClient } from '@supabase/supabase-js';
import type { Investment, Invoice, TreasuryHistory } from '../types';
import { mockInvestments, mockInvoices, mockTreasuryHistory } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured - using demo data');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getInvestments(): Promise<Investment[]> {
  try {
    const { data, error } = await supabase
      .from('investment_analysis')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) {
      console.log('Using demo investments data');
      return mockInvestments;
    }
    return data;
  } catch {
    console.log('Using demo investments data');
    return mockInvestments;
  }
}

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
      console.log('Using demo invoices data');
      return mockInvoices;
    }
    return data;
  } catch {
    console.log('Using demo invoices data');
    return mockInvoices;
  }
}

export async function getTreasuryHistory(): Promise<TreasuryHistory[]> {
  try {
    const { data, error } = await supabase
      .from('treasury_analysis')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error || !data || data.length === 0) {
      console.log('Using demo treasury data');
      return mockTreasuryHistory;
    }
    return data;
  } catch {
    console.log('Using demo treasury data');
    return mockTreasuryHistory;
  }
}

export async function updateInvestmentStatus(
  id: string,
  status: 'approved' | 'rejected',
  approvedBy: string,
  reason?: string
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status,
    [`${status === 'approved' ? 'approved' : 'rejected'}_by`]: approvedBy,
    [`${status === 'approved' ? 'approved' : 'rejected'}_at`]: new Date().toISOString(),
  };

  if (status === 'rejected' && reason) {
    updateData.rejection_reason = reason;
  }

  const { error } = await supabase
    .from('investment_analysis')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function updateInvoiceStatus(
  id: string,
  status: 'approved' | 'rejected',
  approvedBy: string,
  reason?: string
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status,
    [`${status === 'approved' ? 'approved' : 'rejected'}_by`]: approvedBy,
    [`${status === 'approved' ? 'approved' : 'rejected'}_at`]: new Date().toISOString(),
  };

  if (status === 'rejected' && reason) {
    updateData.rejection_reason = reason;
  }

  const { error } = await supabase
    .from('journal_entries')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}
