import axios from 'axios';
import type { DashboardData, ApiResponse } from '../types';
import { mockDashboardData } from './mockData';

const n8nBaseUrl = import.meta.env.VITE_N8N_BASE_URL;

const api = axios.create({
  baseURL: n8nBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await api.get<DashboardData>('/webhook/dashboard-data');
    // If response is empty or missing data, use mock
    if (!response.data || !response.data.summary) {
      console.log('Using demo data - API returned incomplete data');
      return mockDashboardData;
    }
    return response.data;
  } catch (error) {
    console.log('Using demo data - API unavailable');
    return mockDashboardData;
  }
}

export async function approveInvoice(id: string, approvedBy: string): Promise<ApiResponse<void>> {
  const response = await api.post<ApiResponse<void>>('/webhook/approve-invoice', {
    id,
    approved_by: approvedBy,
  });
  return response.data;
}

export async function rejectInvoice(
  id: string,
  rejectedBy: string,
  reason: string
): Promise<ApiResponse<void>> {
  const response = await api.post<ApiResponse<void>>('/webhook/reject-invoice', {
    id,
    rejected_by: rejectedBy,
    reason,
  });
  return response.data;
}

export async function approveInvestment(id: string, approvedBy: string): Promise<ApiResponse<void>> {
  const response = await api.post<ApiResponse<void>>('/webhook/approve-investment', {
    id,
    approved_by: approvedBy,
  });
  return response.data;
}

export async function rejectInvestment(
  id: string,
  rejectedBy: string,
  reason: string
): Promise<ApiResponse<void>> {
  const response = await api.post<ApiResponse<void>>('/webhook/reject-investment', {
    id,
    rejected_by: rejectedBy,
    reason,
  });
  return response.data;
}

export async function sendWhatsAppMessage(chatId: string, message: string): Promise<ApiResponse<void>> {
  const response = await api.post<ApiResponse<void>>('/webhook/send-whatsapp', {
    chatId,
    message,
  });
  return response.data;
}
