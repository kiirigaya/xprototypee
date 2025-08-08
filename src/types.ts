export interface Server {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  totalShifts: number;
  avgEmotionScore: number;
}

export interface Shift {
  id: string;
  serverId: string;
  serverName: string;
  area: string;
  camera: string;
  day: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'completed';
}

export interface ShiftSession {
  id: string;
  shiftId: string;
  date: string;
  startTime: string;
  endTime: string;
  serverEmotionScore: number;
  clientEmotionScore: number;
  punctuality: number; // minutes delay
  duration: number; // minutes
}

export interface EmotionData {
  timestamp: string;
  serverEmotion: string;
  clientEmotion: string;
  confidence: number;
}

export interface DashboardStats {
  activeServers: number;
  activeShifts: number;
  avgEmotionScore: number;
  upcomingShifts: Shift[];
}