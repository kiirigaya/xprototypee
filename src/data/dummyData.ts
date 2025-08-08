import { Server, Shift, ShiftSession, EmotionData, DashboardStats } from '../types';

export const servers: Server[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@emotioncare.com',
    phone: '+1-555-0101',
    status: 'active',
    totalShifts: 24,
    avgEmotionScore: 8.2
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@emotioncare.com',
    phone: '+1-555-0102',
    status: 'active',
    totalShifts: 18,
    avgEmotionScore: 7.9
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@emotioncare.com',
    phone: '+1-555-0103',
    status: 'inactive',
    totalShifts: 31,
    avgEmotionScore: 8.7
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@emotioncare.com',
    phone: '+1-555-0104',
    status: 'active',
    totalShifts: 22,
    avgEmotionScore: 8.1
  }
];

export const shifts: Shift[] = [
  {
    id: '1',
    serverId: '1',
    serverName: 'Alice Johnson',
    area: 'Reception',
    camera: 'CAM-001',
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    status: 'active'
  },
  {
    id: '2',
    serverId: '2',
    serverName: 'Bob Smith',
    area: 'Customer Service',
    camera: 'CAM-002',
    day: 'Monday',
    startTime: '10:00',
    endTime: '18:00',
    status: 'scheduled'
  },
  {
    id: '3',
    serverId: '4',
    serverName: 'David Wilson',
    area: 'Support Desk',
    camera: 'CAM-003',
    day: 'Tuesday',
    startTime: '08:00',
    endTime: '16:00',
    status: 'scheduled'
  },
  {
    id: '4',
    serverId: '1',
    serverName: 'Alice Johnson',
    area: 'VIP Lounge',
    camera: 'CAM-004',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '22:00',
    status: 'scheduled'
  }
];

export const shiftSessions: ShiftSession[] = [
  {
    id: '1',
    shiftId: '1',
    date: '2025-01-19',
    startTime: '09:05',
    endTime: '17:02',
    serverEmotionScore: 8.1,
    clientEmotionScore: 7.8,
    punctuality: 5,
    duration: 477
  },
  {
    id: '2',
    shiftId: '1',
    date: '2025-01-18',
    startTime: '09:00',
    endTime: '17:00',
    serverEmotionScore: 8.3,
    clientEmotionScore: 8.2,
    punctuality: 0,
    duration: 480
  },
  {
    id: '3',
    shiftId: '2',
    date: '2025-01-17',
    startTime: '10:15',
    endTime: '18:10',
    serverEmotionScore: 7.6,
    clientEmotionScore: 7.4,
    punctuality: 15,
    duration: 475
  }
];

export const liveEmotionData: EmotionData[] = [
  { timestamp: '14:32:01', serverEmotion: 'Happy', clientEmotion: 'Neutral', confidence: 0.89 },
  { timestamp: '14:32:15', serverEmotion: 'Confident', clientEmotion: 'Satisfied', confidence: 0.92 },
  { timestamp: '14:32:30', serverEmotion: 'Professional', clientEmotion: 'Pleased', confidence: 0.87 },
  { timestamp: '14:32:45', serverEmotion: 'Attentive', clientEmotion: 'Neutral', confidence: 0.91 }
];

export const liveTranscription = [
  { speaker: 'Server', text: 'Good afternoon! How can I assist you today?', timestamp: '14:32:01' },
  { speaker: 'Client', text: 'Hi, I need help with my account setup.', timestamp: '14:32:05' },
  { speaker: 'Server', text: 'I\'d be happy to help you with that. Let me pull up your information.', timestamp: '14:32:10' },
  { speaker: 'Client', text: 'Thank you, I appreciate your help.', timestamp: '14:32:15' }
];

export const dashboardStats: DashboardStats = {
  activeServers: 3,
  activeShifts: 1,
  avgEmotionScore: 8.1,
  upcomingShifts: shifts.filter(s => s.status === 'scheduled').slice(0, 3)
};