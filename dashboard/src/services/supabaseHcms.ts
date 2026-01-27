/**
 * HCMS Supabase Service Layer
 *
 * This service provides database integration for HCMS module.
 * Falls back to mock data when Supabase is not configured.
 */

import { supabase } from './supabase';
import { hcmsApi as mockHcmsApi } from './mockData/hcms';

// Re-export input types from mock data
export type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  TerminateEmployeeInput,
  CreateLeaveInput,
  ApproveLeaveInput,
  RejectLeaveInput,
  ManualCheckInput,
  UpdateAttendanceInput,
  MarkAbsentInput,
  InitiatePayrollInput,
  ApprovePayrollInput,
  ProcessPayrollInput,
  AdjustSalaryInput,
  CreateRequisitionInput,
  MoveCandidateStageInput,
  CreateTrainingInput,
  EnrollEmployeeInput,
  CreateReviewInput,
  SubmitReviewInput,
  LogCaseInput,
  UpdateCaseStatusInput,
} from './mockData/hcms';

import type {
  Employee,
  Attendance,
  LeaveRequest,
  PayrollRecord,
  Recruitment,
  Candidate,
  PerformanceReview,
  KPI,
  Training,
  TrainingEnrollment,
  ComplianceAlert,
  DisciplinaryCase,
  HCMSDashboard,
} from '../types';

// Check if Supabase is properly configured
const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key && url.length > 0 && key.length > 0);
};

/**
 * HCMS API with Supabase integration
 * Falls back to mock data when Supabase is not configured or on error
 */
export const hcmsApi = {
  // ==================== EMPLOYEES ====================
  employees: {
    getAll: async (): Promise<Employee[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.employees.getAll();

      try {
        const { data, error } = await supabase
          .from('hcms_employees')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data?.length) {
          console.log('HCMS Employees: Using mock data');
          return mockHcmsApi.employees.getAll();
        }
        return data;
      } catch {
        return mockHcmsApi.employees.getAll();
      }
    },

    getById: async (id: string) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.employees.getById(id);

      try {
        const { data, error } = await supabase
          .from('hcms_employees')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) return mockHcmsApi.employees.getById(id);
        return data as Employee;
      } catch {
        return mockHcmsApi.employees.getById(id);
      }
    },

    create: async (input: Parameters<typeof mockHcmsApi.employees.create>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.employees.create(input);

      try {
        // Generate employee_id
        const { count } = await supabase
          .from('hcms_employees')
          .select('*', { count: 'exact', head: true });

        const employeeId = `BPKH${String((count || 0) + 1).padStart(3, '0')}`;

        const { data, error } = await supabase
          .from('hcms_employees')
          .insert({
            employee_id: employeeId,
            ...input,
            employment_status: 'probation',
          })
          .select()
          .single();

        if (error) throw error;
        return data as Employee;
      } catch {
        return mockHcmsApi.employees.create(input);
      }
    },

    update: async (input: Parameters<typeof mockHcmsApi.employees.update>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.employees.update(input);

      try {
        const { id, ...updates } = input;
        const { data, error } = await supabase
          .from('hcms_employees')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as Employee;
      } catch {
        return mockHcmsApi.employees.update(input);
      }
    },

    terminate: async (input: Parameters<typeof mockHcmsApi.employees.terminate>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.employees.terminate(input);

      try {
        const { data, error } = await supabase
          .from('hcms_employees')
          .update({
            employment_status: 'resigned',
            end_date: input.effective_date,
          })
          .eq('id', input.id)
          .select()
          .single();

        if (error) throw error;
        return data as Employee;
      } catch {
        return mockHcmsApi.employees.terminate(input);
      }
    },

    getSummary: async () => {
      if (!isSupabaseConfigured()) return mockHcmsApi.employees.getSummary();

      try {
        const { data, error } = await supabase
          .from('hcms_employees')
          .select('employment_status');

        if (error || !data?.length) return mockHcmsApi.employees.getSummary();

        return {
          total: data.length,
          active: data.filter(e => e.employment_status === 'active').length,
          probation: data.filter(e => e.employment_status === 'probation').length,
          resigned: data.filter(e => e.employment_status === 'resigned').length,
        };
      } catch {
        return mockHcmsApi.employees.getSummary();
      }
    },
  },

  // ==================== ATTENDANCE ====================
  attendance: {
    getAll: async (): Promise<Attendance[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.attendance.getAll();

      try {
        const { data, error } = await supabase
          .from('hcms_attendance')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .order('date', { ascending: false })
          .limit(100);

        if (error || !data?.length) {
          console.log('HCMS Attendance: Using mock data');
          return mockHcmsApi.attendance.getAll();
        }

        // Map to include employee_name
        return data.map(record => ({
          ...record,
          employee_name: record.employee
            ? `${record.employee.first_name} ${record.employee.last_name}`
            : 'Unknown',
        }));
      } catch {
        return mockHcmsApi.attendance.getAll();
      }
    },

    getByDate: async (date: string) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.attendance.getByDate(date);

      try {
        const { data, error } = await supabase
          .from('hcms_attendance')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .eq('date', date);

        if (error || !data?.length) return mockHcmsApi.attendance.getByDate(date);

        return data.map(record => ({
          ...record,
          employee_name: record.employee
            ? `${record.employee.first_name} ${record.employee.last_name}`
            : 'Unknown',
        }));
      } catch {
        return mockHcmsApi.attendance.getByDate(date);
      }
    },

    getById: async (id: string) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.attendance.getById(id);

      try {
        const { data, error } = await supabase
          .from('hcms_attendance')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .eq('id', id)
          .single();

        if (error || !data) return mockHcmsApi.attendance.getById(id);
        return {
          ...data,
          employee_name: data.employee
            ? `${data.employee.first_name} ${data.employee.last_name}`
            : 'Unknown',
        } as Attendance;
      } catch {
        return mockHcmsApi.attendance.getById(id);
      }
    },

    manualCheck: async (input: Parameters<typeof mockHcmsApi.attendance.manualCheck>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.attendance.manualCheck(input);

      try {
        // Calculate work hours
        let work_hours: number | undefined;
        let late_minutes: number | undefined;

        if (input.check_in && input.check_out) {
          const checkIn = new Date(`2024-01-01T${input.check_in}`);
          const checkOut = new Date(`2024-01-01T${input.check_out}`);
          work_hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        }

        if (input.check_in && input.status === 'late') {
          const checkIn = new Date(`2024-01-01T${input.check_in}`);
          const expectedStart = new Date(`2024-01-01T08:00`);
          late_minutes = Math.round((checkIn.getTime() - expectedStart.getTime()) / (1000 * 60));
        }

        const { data, error } = await supabase
          .from('hcms_attendance')
          .insert({
            employee_id: input.employee_id,
            date: input.date,
            check_in: input.check_in,
            check_out: input.check_out,
            status: input.status,
            work_hours,
            late_minutes,
            notes: input.notes,
            location: input.location,
          })
          .select()
          .single();

        if (error) throw error;
        return { ...data, employee_name: input.employee_name } as Attendance;
      } catch {
        return mockHcmsApi.attendance.manualCheck(input);
      }
    },

    update: async (input: Parameters<typeof mockHcmsApi.attendance.update>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.attendance.update(input);

      try {
        const { id, ...updates } = input;
        const { data, error } = await supabase
          .from('hcms_attendance')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as Attendance;
      } catch {
        return mockHcmsApi.attendance.update(input);
      }
    },

    markAbsent: async (input: Parameters<typeof mockHcmsApi.attendance.markAbsent>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.attendance.markAbsent(input);

      try {
        const { data, error } = await supabase
          .from('hcms_attendance')
          .upsert({
            employee_id: input.employee_id,
            date: input.date,
            status: 'absent',
            notes: input.reason,
          })
          .select()
          .single();

        if (error) throw error;
        return { ...data, employee_name: input.employee_name } as Attendance;
      } catch {
        return mockHcmsApi.attendance.markAbsent(input);
      }
    },

    getSummary: async (date: string) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.attendance.getSummary(date);

      try {
        const { data, error } = await supabase
          .from('hcms_attendance')
          .select('status')
          .eq('date', date);

        if (error || !data) return mockHcmsApi.attendance.getSummary(date);

        return {
          present: data.filter(r => r.status === 'present').length,
          late: data.filter(r => r.status === 'late').length,
          absent: data.filter(r => r.status === 'absent').length,
          leave: data.filter(r => r.status === 'leave').length,
          total: data.length,
        };
      } catch {
        return mockHcmsApi.attendance.getSummary(date);
      }
    },
  },

  // ==================== LEAVE ====================
  leave: {
    getAll: async (): Promise<LeaveRequest[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.leave.getAll();

      try {
        const { data, error } = await supabase
          .from('hcms_leave_requests')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .order('created_at', { ascending: false });

        if (error || !data?.length) {
          console.log('HCMS Leave: Using mock data');
          return mockHcmsApi.leave.getAll();
        }

        return data.map(record => ({
          ...record,
          employee_name: record.employee
            ? `${record.employee.first_name} ${record.employee.last_name}`
            : 'Unknown',
        }));
      } catch {
        return mockHcmsApi.leave.getAll();
      }
    },

    getPending: async () => {
      if (!isSupabaseConfigured()) return mockHcmsApi.leave.getPending();

      try {
        const { data, error } = await supabase
          .from('hcms_leave_requests')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error || !data?.length) return mockHcmsApi.leave.getPending();

        return data.map(record => ({
          ...record,
          employee_name: record.employee
            ? `${record.employee.first_name} ${record.employee.last_name}`
            : 'Unknown',
        }));
      } catch {
        return mockHcmsApi.leave.getPending();
      }
    },

    create: async (input: Parameters<typeof mockHcmsApi.leave.create>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.leave.create(input);

      try {
        const startDate = new Date(input.start_date);
        const endDate = new Date(input.end_date);
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const { data, error } = await supabase
          .from('hcms_leave_requests')
          .insert({
            employee_id: input.employee_id,
            leave_type: input.leave_type,
            start_date: input.start_date,
            end_date: input.end_date,
            days,
            reason: input.reason,
            status: 'pending',
          })
          .select()
          .single();

        if (error) throw error;
        return { ...data, employee_name: input.employee_name } as LeaveRequest;
      } catch {
        return mockHcmsApi.leave.create(input);
      }
    },

    approve: async (input: Parameters<typeof mockHcmsApi.leave.approve>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.leave.approve(input);

      try {
        const { data, error } = await supabase
          .from('hcms_leave_requests')
          .update({
            status: 'approved',
            approved_by: input.approved_by,
            approved_at: new Date().toISOString(),
          })
          .eq('id', input.id)
          .select()
          .single();

        if (error) throw error;
        return data as LeaveRequest;
      } catch {
        return mockHcmsApi.leave.approve(input);
      }
    },

    reject: async (input: Parameters<typeof mockHcmsApi.leave.reject>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.leave.reject(input);

      try {
        const { data, error } = await supabase
          .from('hcms_leave_requests')
          .update({ status: 'rejected' })
          .eq('id', input.id)
          .select()
          .single();

        if (error) throw error;
        return data as LeaveRequest;
      } catch {
        return mockHcmsApi.leave.reject(input);
      }
    },

    cancel: async (id: string) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.leave.cancel(id);

      try {
        const { data, error } = await supabase
          .from('hcms_leave_requests')
          .update({ status: 'rejected' })
          .eq('id', id)
          .eq('status', 'pending')
          .select()
          .single();

        if (error) throw error;
        return data as LeaveRequest;
      } catch {
        return mockHcmsApi.leave.cancel(id);
      }
    },

    getSummary: async () => {
      if (!isSupabaseConfigured()) return mockHcmsApi.leave.getSummary();

      try {
        const { data, error } = await supabase
          .from('hcms_leave_requests')
          .select('status');

        if (error || !data) return mockHcmsApi.leave.getSummary();

        return {
          total: data.length,
          pending: data.filter(l => l.status === 'pending').length,
          approved: data.filter(l => l.status === 'approved').length,
          rejected: data.filter(l => l.status === 'rejected').length,
        };
      } catch {
        return mockHcmsApi.leave.getSummary();
      }
    },
  },

  // ==================== PAYROLL ====================
  payroll: {
    getAll: async (): Promise<PayrollRecord[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.payroll.getAll();

      try {
        const { data, error } = await supabase
          .from('hcms_payroll_records')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .order('created_at', { ascending: false });

        if (error || !data?.length) {
          console.log('HCMS Payroll: Using mock data');
          return mockHcmsApi.payroll.getAll();
        }

        return data.map(record => ({
          ...record,
          employee_name: record.employee
            ? `${record.employee.first_name} ${record.employee.last_name}`
            : 'Unknown',
        }));
      } catch {
        return mockHcmsApi.payroll.getAll();
      }
    },

    getByPeriod: async (period: string) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.payroll.getByPeriod(period);

      try {
        const { data, error } = await supabase
          .from('hcms_payroll_records')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .eq('period_id', period);

        if (error || !data?.length) return mockHcmsApi.payroll.getByPeriod(period);

        return data.map(record => ({
          ...record,
          employee_name: record.employee
            ? `${record.employee.first_name} ${record.employee.last_name}`
            : 'Unknown',
        }));
      } catch {
        return mockHcmsApi.payroll.getByPeriod(period);
      }
    },

    getById: async (id: string) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.payroll.getById(id);

      try {
        const { data, error } = await supabase
          .from('hcms_payroll_records')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .eq('id', id)
          .single();

        if (error || !data) return mockHcmsApi.payroll.getById(id);
        return {
          ...data,
          employee_name: data.employee
            ? `${data.employee.first_name} ${data.employee.last_name}`
            : 'Unknown',
        } as PayrollRecord;
      } catch {
        return mockHcmsApi.payroll.getById(id);
      }
    },

    initiate: mockHcmsApi.payroll.initiate,
    approve: mockHcmsApi.payroll.approve,
    process: mockHcmsApi.payroll.process,
    adjustSalary: mockHcmsApi.payroll.adjustSalary,
    getSummary: mockHcmsApi.payroll.getSummary,
  },

  // ==================== RECRUITMENT ====================
  recruitment: {
    getAll: async (): Promise<Recruitment[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.recruitment.getAll();

      try {
        const { data, error } = await supabase
          .from('hcms_job_postings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data?.length) {
          console.log('HCMS Recruitment: Using mock data');
          return mockHcmsApi.recruitment.getAll();
        }
        return data.map(job => ({
          id: job.id,
          position: job.title,
          department: job.department,
          status: job.status,
          applicants: 0,
          shortlisted: 0,
          posted_date: job.posted_date,
          closing_date: job.closing_date,
          hiring_manager: job.hiring_manager,
        }));
      } catch {
        return mockHcmsApi.recruitment.getAll();
      }
    },

    getCandidates: async (recruitmentId?: string): Promise<Candidate[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.recruitment.getCandidates(recruitmentId);

      try {
        let query = supabase
          .from('hcms_candidates')
          .select('*')
          .order('created_at', { ascending: false });

        if (recruitmentId) {
          query = query.eq('job_posting_id', recruitmentId);
        }

        const { data, error } = await query;

        if (error || !data?.length) return mockHcmsApi.recruitment.getCandidates(recruitmentId);

        return data.map(c => ({
          id: c.id,
          recruitment_id: c.job_posting_id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          status: c.status,
          score: c.rating,
          applied_at: c.created_at,
        }));
      } catch {
        return mockHcmsApi.recruitment.getCandidates(recruitmentId);
      }
    },

    createRequisition: async (input: Parameters<typeof mockHcmsApi.recruitment.createRequisition>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.recruitment.createRequisition(input);

      try {
        const { data, error } = await supabase
          .from('hcms_job_postings')
          .insert({
            title: input.position,
            department: input.department,
            status: 'open',
            posted_date: new Date().toISOString().split('T')[0],
            closing_date: input.closing_date,
            hiring_manager: input.hiring_manager,
            description: input.description,
          })
          .select()
          .single();

        if (error) throw error;
        return {
          id: data.id,
          position: data.title,
          department: data.department,
          status: data.status,
          applicants: 0,
          shortlisted: 0,
          posted_date: data.posted_date,
          closing_date: data.closing_date,
          hiring_manager: data.hiring_manager,
        } as Recruitment;
      } catch {
        return mockHcmsApi.recruitment.createRequisition(input);
      }
    },

    moveCandidate: mockHcmsApi.recruitment.moveCandidate,
  },

  // ==================== PERFORMANCE ====================
  performance: {
    getReviews: async (): Promise<PerformanceReview[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.performance.getReviews();

      try {
        const { data, error } = await supabase
          .from('hcms_performance_reviews')
          .select(`
            *,
            employee:hcms_employees!hcms_performance_reviews_employee_id_fkey(first_name, last_name),
            reviewer:hcms_employees!hcms_performance_reviews_reviewer_id_fkey(first_name, last_name)
          `)
          .order('created_at', { ascending: false });

        if (error || !data?.length) {
          console.log('HCMS Performance: Using mock data');
          return mockHcmsApi.performance.getReviews();
        }

        return data.map(review => ({
          ...review,
          employee_name: review.employee
            ? `${review.employee.first_name} ${review.employee.last_name}`
            : 'Unknown',
          reviewer_name: review.reviewer
            ? `${review.reviewer.first_name} ${review.reviewer.last_name}`
            : 'Unknown',
        }));
      } catch {
        return mockHcmsApi.performance.getReviews();
      }
    },

    getKPIs: async (employeeId?: string): Promise<KPI[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.performance.getKPIs(employeeId);

      try {
        let query = supabase
          .from('hcms_kpis')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .order('created_at', { ascending: false });

        if (employeeId) {
          query = query.eq('employee_id', employeeId);
        }

        const { data, error } = await query;

        if (error || !data?.length) return mockHcmsApi.performance.getKPIs(employeeId);

        return data.map(kpi => ({
          ...kpi,
          employee_name: kpi.employee
            ? `${kpi.employee.first_name} ${kpi.employee.last_name}`
            : 'Unknown',
        }));
      } catch {
        return mockHcmsApi.performance.getKPIs(employeeId);
      }
    },

    createReview: mockHcmsApi.performance.createReview,
    submitReview: mockHcmsApi.performance.submitReview,
  },

  // ==================== TRAINING ====================
  training: {
    getAll: async (): Promise<Training[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.training.getAll();

      try {
        const { data, error } = await supabase
          .from('hcms_training_courses')
          .select('*')
          .order('start_date', { ascending: false });

        if (error || !data?.length) {
          console.log('HCMS Training: Using mock data');
          return mockHcmsApi.training.getAll();
        }
        return data;
      } catch {
        return mockHcmsApi.training.getAll();
      }
    },

    getEnrollments: async (trainingId?: string): Promise<TrainingEnrollment[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.training.getEnrollments(trainingId);

      try {
        let query = supabase
          .from('hcms_training_enrollments')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .order('enrolled_at', { ascending: false });

        if (trainingId) {
          query = query.eq('course_id', trainingId);
        }

        const { data, error } = await query;

        if (error || !data?.length) return mockHcmsApi.training.getEnrollments(trainingId);

        return data.map(e => ({
          id: e.id,
          training_id: e.course_id,
          employee_id: e.employee_id,
          employee_name: e.employee
            ? `${e.employee.first_name} ${e.employee.last_name}`
            : 'Unknown',
          status: e.status,
          score: e.score,
          certificate_url: e.certificate_url,
        }));
      } catch {
        return mockHcmsApi.training.getEnrollments(trainingId);
      }
    },

    createProgram: async (input: Parameters<typeof mockHcmsApi.training.createProgram>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.training.createProgram(input);

      try {
        const { data, error } = await supabase
          .from('hcms_training_courses')
          .insert({
            title: input.title,
            type: input.type,
            category: input.category,
            start_date: input.start_date,
            end_date: input.end_date,
            duration_hours: input.duration_hours,
            max_participants: input.max_participants,
            enrolled: 0,
            status: 'upcoming',
            provider: input.provider,
          })
          .select()
          .single();

        if (error) throw error;
        return data as Training;
      } catch {
        return mockHcmsApi.training.createProgram(input);
      }
    },

    enrollEmployee: mockHcmsApi.training.enrollEmployee,
  },

  // ==================== COMPLIANCE ====================
  compliance: {
    getAlerts: async (): Promise<ComplianceAlert[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.compliance.getAlerts();

      try {
        const { data, error } = await supabase
          .from('hcms_compliance_alerts')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .eq('status', 'active')
          .order('expiry_date');

        if (error || !data?.length) {
          console.log('HCMS Compliance Alerts: Using mock data');
          return mockHcmsApi.compliance.getAlerts();
        }

        return data.map(alert => ({
          ...alert,
          employee_name: alert.employee
            ? `${alert.employee.first_name} ${alert.employee.last_name}`
            : 'Unknown',
        }));
      } catch {
        return mockHcmsApi.compliance.getAlerts();
      }
    },

    getCases: async (): Promise<DisciplinaryCase[]> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.compliance.getCases();

      try {
        const { data, error } = await supabase
          .from('hcms_disciplinary_actions')
          .select(`
            *,
            employee:hcms_employees(first_name, last_name)
          `)
          .order('created_at', { ascending: false });

        if (error || !data?.length) {
          console.log('HCMS Disciplinary Cases: Using mock data');
          return mockHcmsApi.compliance.getCases();
        }

        return data.map(caseItem => ({
          id: caseItem.id,
          employee_id: caseItem.employee_id,
          employee_name: caseItem.employee
            ? `${caseItem.employee.first_name} ${caseItem.employee.last_name}`
            : 'Unknown',
          case_type: caseItem.action_type,
          severity: caseItem.severity,
          description: caseItem.description,
          action_taken: caseItem.action_taken || 'Pending',
          status: caseItem.status,
          created_at: caseItem.created_at,
          resolved_at: caseItem.resolved_at,
        }));
      } catch {
        return mockHcmsApi.compliance.getCases();
      }
    },

    logCase: async (input: Parameters<typeof mockHcmsApi.compliance.logCase>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.compliance.logCase(input);

      try {
        const { data, error } = await supabase
          .from('hcms_disciplinary_actions')
          .insert({
            employee_id: input.employee_id,
            action_type: input.case_type,
            severity: input.severity,
            description: input.description,
            action_taken: 'Pending investigation',
            status: 'open',
          })
          .select()
          .single();

        if (error) throw error;
        return {
          id: data.id,
          employee_id: data.employee_id,
          employee_name: input.employee_name,
          case_type: data.action_type,
          severity: data.severity,
          description: data.description,
          action_taken: data.action_taken,
          status: data.status,
          created_at: data.created_at,
        } as DisciplinaryCase;
      } catch {
        return mockHcmsApi.compliance.logCase(input);
      }
    },

    updateCaseStatus: async (input: Parameters<typeof mockHcmsApi.compliance.updateCaseStatus>[0]) => {
      if (!isSupabaseConfigured()) return mockHcmsApi.compliance.updateCaseStatus(input);

      try {
        const updates: Record<string, unknown> = { status: input.status };
        if (input.action_taken) updates.action_taken = input.action_taken;
        if (input.status === 'resolved') updates.resolved_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('hcms_disciplinary_actions')
          .update(updates)
          .eq('id', input.id)
          .select()
          .single();

        if (error) throw error;
        return data as DisciplinaryCase;
      } catch {
        return mockHcmsApi.compliance.updateCaseStatus(input);
      }
    },
  },

  // ==================== DASHBOARD ====================
  dashboard: {
    getSummary: async (): Promise<HCMSDashboard> => {
      if (!isSupabaseConfigured()) return mockHcmsApi.dashboard.getSummary();

      try {
        // Fetch employees
        const { data: employees } = await supabase
          .from('hcms_employees')
          .select('employment_status, department');

        // Fetch attendance today
        const today = new Date().toISOString().split('T')[0];
        const { data: attendance } = await supabase
          .from('hcms_attendance')
          .select('status')
          .eq('date', today);

        // Fetch pending leaves
        const { count: pendingLeaves } = await supabase
          .from('hcms_leave_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Fetch compliance alerts
        const { count: complianceAlerts } = await supabase
          .from('hcms_compliance_alerts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Fetch upcoming trainings
        const { count: upcomingTrainings } = await supabase
          .from('hcms_training_courses')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'upcoming');

        if (!employees?.length) return mockHcmsApi.dashboard.getSummary();

        // Calculate department distribution
        const deptCounts: Record<string, number> = {};
        employees.forEach(e => {
          deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
        });

        const departments = Object.entries(deptCounts).map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / employees.length) * 100),
        }));

        // Calculate attendance today
        const attendanceToday = attendance ? {
          present: attendance.filter(a => a.status === 'present').length,
          absent: attendance.filter(a => a.status === 'absent').length,
          late: attendance.filter(a => a.status === 'late').length,
          leave: attendance.filter(a => a.status === 'leave').length,
        } : { present: 0, absent: 0, late: 0, leave: 0 };

        return {
          total_employees: employees.length,
          active_employees: employees.filter(e => e.employment_status === 'active').length,
          departments,
          attendance_today: attendanceToday,
          pending_leaves: pendingLeaves || 0,
          upcoming_trainings: upcomingTrainings || 0,
          compliance_alerts: complianceAlerts || 0,
          headcount_trend: [], // Would need historical data
        };
      } catch {
        return mockHcmsApi.dashboard.getSummary();
      }
    },
  },
};
