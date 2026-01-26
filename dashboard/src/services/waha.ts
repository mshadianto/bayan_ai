import axios from 'axios';

const wahaUrl = import.meta.env.VITE_WAHA_URL;
const wahaApiKey = import.meta.env.VITE_WAHA_API_KEY;
const wahaSession = import.meta.env.VITE_WAHA_SESSION || 'default';

const wahaApi = axios.create({
  baseURL: wahaUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': wahaApiKey,
  },
});

export interface WAHASession {
  name: string;
  status: 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'STOPPED';
}

export interface WAHAMessage {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  body: string;
  fromMe: boolean;
}

export async function getSessionStatus(): Promise<WAHASession | null> {
  try {
    const response = await wahaApi.get<WAHASession>(`/api/sessions/${wahaSession}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function sendTextMessage(chatId: string, text: string): Promise<boolean> {
  try {
    await wahaApi.post('/api/sendText', {
      chatId,
      text,
      session: wahaSession,
    });
    return true;
  } catch {
    return false;
  }
}

export async function getChats(): Promise<{ id: string; name: string }[]> {
  try {
    const response = await wahaApi.get(`/api/${wahaSession}/chats`);
    return response.data || [];
  } catch {
    return [];
  }
}

export async function getChatMessages(chatId: string, limit = 50): Promise<WAHAMessage[]> {
  try {
    const response = await wahaApi.get(`/api/${wahaSession}/chats/${chatId}/messages`, {
      params: { limit },
    });
    return response.data || [];
  } catch {
    return [];
  }
}
