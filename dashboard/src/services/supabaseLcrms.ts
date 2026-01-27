/**
 * LCRMS Supabase Service Layer
 *
 * This service provides database integration for LCRMS module.
 * Falls back to mock data when Supabase is not configured.
 */

import { supabase } from './supabase';
import { lcrmsApi as mockLcrmsApi } from './mockData/lcrms';

// Re-export input types from mock data
export type {
  CreateContractInput,
  CreateRiskInput,
  CreateCaseInput,
  CreateMeetingInput,
} from './mockData/lcrms';

import type {
  Contract,
  License,
  COIDeclaration,
  EmployeeViolation,
  Risk,
  LitigationCase,
  ExternalCounsel,
  MeetingMinutes,
  Shareholder,
  CircularResolution,
  LegalDocument,
} from '../types';

// Check if Supabase is properly configured
const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key && url.length > 0 && key.length > 0);
};

/**
 * LCRMS API with Supabase integration
 * Falls back to mock data when Supabase is not configured or on error
 */
export const lcrmsApi = {
  // ==================== CONTRACTS ====================
  contracts: {
    getAll: async (): Promise<Contract[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.contracts.getAll();

      try {
        const { data, error } = await supabase
          .from('lcrms_contracts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data?.length) {
          console.log('LCRMS Contracts: Using mock data');
          return mockLcrmsApi.contracts.getAll();
        }
        return data.map(c => ({ ...c, obligations: c.obligations ?? [], versions: c.versions ?? [] }));
      } catch {
        return mockLcrmsApi.contracts.getAll();
      }
    },

    getById: async (id: string) => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.contracts.getById(id);

      try {
        const { data, error } = await supabase
          .from('lcrms_contracts')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) return mockLcrmsApi.contracts.getById(id);
        return data as Contract;
      } catch {
        return mockLcrmsApi.contracts.getById(id);
      }
    },

    getExpiring: async (days: number = 90) => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.contracts.getExpiring(days);

      try {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const { data, error } = await supabase
          .from('lcrms_contracts')
          .select('*')
          .eq('status', 'active')
          .lte('end_date', futureDate.toISOString().split('T')[0])
          .order('end_date');

        if (error || !data?.length) return mockLcrmsApi.contracts.getExpiring(days);
        return data as Contract[];
      } catch {
        return mockLcrmsApi.contracts.getExpiring(days);
      }
    },

    getObligations: mockLcrmsApi.contracts.getObligations,
    getAlerts: mockLcrmsApi.contracts.getAlerts,

    create: async (contract: Parameters<typeof mockLcrmsApi.contracts.create>[0]) => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.contracts.create(contract);

      try {
        const { data, error } = await supabase
          .from('lcrms_contracts')
          .insert(contract)
          .select()
          .single();

        if (error) throw error;
        return data as Contract;
      } catch {
        return mockLcrmsApi.contracts.create(contract);
      }
    },

    update: async (id: string, updates: Partial<Contract>) => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.contracts.update(id, updates);

      try {
        const { data, error } = await supabase
          .from('lcrms_contracts')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as Contract;
      } catch {
        return mockLcrmsApi.contracts.update(id, updates);
      }
    },

    getSummary: mockLcrmsApi.contracts.getSummary,
  },

  // ==================== COMPLIANCE ====================
  compliance: {
    getLicenses: async (): Promise<License[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.compliance.getLicenses();

      try {
        const { data, error } = await supabase
          .from('lcrms_licenses')
          .select('*')
          .order('expiry_date');

        if (error || !data?.length) return mockLcrmsApi.compliance.getLicenses();
        return data;
      } catch {
        return mockLcrmsApi.compliance.getLicenses();
      }
    },

    getCOIDeclarations: async (): Promise<COIDeclaration[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.compliance.getCOIDeclarations();

      try {
        const { data, error } = await supabase
          .from('lcrms_coi_declarations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data?.length) return mockLcrmsApi.compliance.getCOIDeclarations();
        return data;
      } catch {
        return mockLcrmsApi.compliance.getCOIDeclarations();
      }
    },

    getViolations: async (): Promise<EmployeeViolation[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.compliance.getViolations();

      try {
        const { data, error } = await supabase
          .from('lcrms_employee_violations')
          .select('*')
          .order('incident_date', { ascending: false });

        if (error || !data?.length) return mockLcrmsApi.compliance.getViolations();
        return data;
      } catch {
        return mockLcrmsApi.compliance.getViolations();
      }
    },

    submitCOI: mockLcrmsApi.compliance.submitCOI,
    approveCOI: mockLcrmsApi.compliance.approveCOI,
    getSummary: mockLcrmsApi.compliance.getSummary,
  },

  // ==================== RISK MANAGEMENT ====================
  risks: {
    getAll: async (): Promise<Risk[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.risks.getAll();

      try {
        const { data, error } = await supabase
          .from('lcrms_risks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data?.length) return mockLcrmsApi.risks.getAll();
        return data;
      } catch {
        return mockLcrmsApi.risks.getAll();
      }
    },

    getById: mockLcrmsApi.risks.getById,
    getHeatmap: mockLcrmsApi.risks.getHeatmap,
    getTop10: mockLcrmsApi.risks.getTop10,
    create: mockLcrmsApi.risks.create,
    update: mockLcrmsApi.risks.update,
    getSummary: mockLcrmsApi.risks.getSummary,
  },

  // ==================== LITIGATION ====================
  litigation: {
    getCases: async (): Promise<LitigationCase[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.litigation.getCases();

      try {
        const { data, error } = await supabase
          .from('lcrms_litigation_cases')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data?.length) return mockLcrmsApi.litigation.getCases();
        return data;
      } catch {
        return mockLcrmsApi.litigation.getCases();
      }
    },

    getCaseById: mockLcrmsApi.litigation.getCaseById,

    getCounsels: async (): Promise<ExternalCounsel[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.litigation.getCounsels();

      try {
        const { data, error } = await supabase
          .from('lcrms_external_counsels')
          .select('*')
          .eq('status', 'active')
          .order('rating', { ascending: false });

        if (error || !data?.length) return mockLcrmsApi.litigation.getCounsels();
        return data;
      } catch {
        return mockLcrmsApi.litigation.getCounsels();
      }
    },

    createCase: mockLcrmsApi.litigation.createCase,
    updateCase: mockLcrmsApi.litigation.updateCase,
    getSummary: mockLcrmsApi.litigation.getSummary,
  },

  // ==================== SECRETARIAL ====================
  secretarial: {
    getMeetings: async (): Promise<MeetingMinutes[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.secretarial.getMeetings();

      try {
        const { data, error } = await supabase
          .from('lcrms_meetings')
          .select('*')
          .order('meeting_date', { ascending: false });

        if (error || !data?.length) return mockLcrmsApi.secretarial.getMeetings();
        return data;
      } catch {
        return mockLcrmsApi.secretarial.getMeetings();
      }
    },

    getMeetingById: mockLcrmsApi.secretarial.getMeetingById,

    getShareholders: async (): Promise<Shareholder[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.secretarial.getShareholders();

      try {
        const { data, error } = await supabase
          .from('lcrms_shareholders')
          .select('*')
          .eq('status', 'active')
          .order('percentage', { ascending: false });

        if (error || !data?.length) return mockLcrmsApi.secretarial.getShareholders();
        return data;
      } catch {
        return mockLcrmsApi.secretarial.getShareholders();
      }
    },

    getResolutions: async (): Promise<CircularResolution[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.secretarial.getResolutions();

      try {
        const { data, error } = await supabase
          .from('lcrms_circular_resolutions')
          .select('*')
          .order('proposed_date', { ascending: false });

        if (error || !data?.length) return mockLcrmsApi.secretarial.getResolutions();
        return data;
      } catch {
        return mockLcrmsApi.secretarial.getResolutions();
      }
    },

    createMeeting: mockLcrmsApi.secretarial.createMeeting,
    approveResolution: mockLcrmsApi.secretarial.approveResolution,
  },

  // ==================== KNOWLEDGE BASE ====================
  knowledge: {
    getDocuments: async (): Promise<LegalDocument[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.knowledge.getDocuments();

      try {
        const { data, error } = await supabase
          .from('lcrms_legal_documents')
          .select('*')
          .eq('status', 'active')
          .order('issue_date', { ascending: false });

        if (error || !data?.length) return mockLcrmsApi.knowledge.getDocuments();
        return data;
      } catch {
        return mockLcrmsApi.knowledge.getDocuments();
      }
    },

    search: async (query: string): Promise<LegalDocument[]> => {
      if (!isSupabaseConfigured()) return mockLcrmsApi.knowledge.search(query);

      try {
        const { data, error } = await supabase
          .from('lcrms_legal_documents')
          .select('*')
          .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
          .eq('status', 'active');

        if (error || !data?.length) return mockLcrmsApi.knowledge.search(query);
        return data;
      } catch {
        return mockLcrmsApi.knowledge.search(query);
      }
    },

    // AI Q&A - always use mock (would need AI service integration)
    askQuestion: mockLcrmsApi.knowledge.askQuestion,
  },

  // ==================== DASHBOARD ====================
  dashboard: {
    getSummary: mockLcrmsApi.dashboard.getSummary,
    getComplianceScore: mockLcrmsApi.dashboard.getComplianceScore,
    getAlerts: mockLcrmsApi.dashboard.getAlerts,
  },
};
