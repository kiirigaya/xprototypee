import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Camera, Activity, Video, User, TrendingUp, Play } from 'lucide-react';
import { Server, Shift, ShiftSession } from '../../types';
import { shifts, shiftSessions, liveEmotionData } from '../../data/dummyData';

interface ServerProfileProps {
  server: Server;
  onBack: () => void;
  onStartLiveTracking: (serverId: string) => void;
}

export const ServerProfile: React.FC<ServerProfileProps> = ({ server, onBack, onStartLiveTracking }) => {
  const [activeTab, setActiveTab] = useState<'shifts' | 'sessions' | 'stats'>('shifts');

  const serverShifts = shifts.filter(shift => shift.serverId === server.id);
  const serverSessions = shiftSessions.filter(session => 
    serverShifts.some(shift => shift.id === session.shiftId)
  );

  const isCurrentlyWorking = serverShifts.some(shift => shift.status === 'active');
  const currentShift = serverShifts.find(shift => shift.status === 'active');

  const getShiftsByDay = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => ({
      day,
      shifts: serverShifts.filter(shift => shift.day === day)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getEmotionColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-[#006A71] hover:text-[#004a51] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Servers
          </button>
        </div>
        {isCurrentlyWorking && (
          <button
            onClick={() => onStartLiveTracking(server.id)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Live Tracking
          </button>
        )}
      </div>

      {/* Server Info Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-[#9ACBD0] flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {server.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{server.name}</h1>
            <p className="text-gray-600">{server.email}</p>
            <p className="text-gray-600">{server.phone}</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                server.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {server.status}
              </span>
              {isCurrentlyWorking && (
                <div className="flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Currently Working - {currentShift?.area}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#006A71]">{server.avgEmotionScore.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Avg Emotion Score</div>
            <div className="text-lg font-semibold text-gray-700 mt-2">{server.totalShifts}</div>
            <div className="text-sm text-gray-500">Total Shifts</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'shifts', name: 'Shifts Schedule', icon: Calendar },
              { id: 'sessions', name: 'Session History', icon: Activity },
              { id: 'stats', name: 'Performance Stats', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-[#006A71] text-[#006A71]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Shifts Tab */}
          {activeTab === 'shifts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Weekly Schedule</h3>
              {getShiftsByDay().map(({ day, shifts: dayShifts }) => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {day}
                    <span className="ml-2 text-sm text-gray-500">({dayShifts.length} shifts)</span>
                  </h4>
                  {dayShifts.length > 0 ? (
                    <div className="space-y-2">
                      {dayShifts.map((shift) => (
                        <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {shift.area}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Camera className="w-4 h-4 mr-1" />
                              {shift.camera}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              {shift.startTime} - {shift.endTime}
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shift.status)}`}>
                            {shift.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No shifts scheduled</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Sessions</h3>
              {serverSessions.length > 0 ? (
                <div className="space-y-4">
                  {serverSessions.map((session) => {
                    const shift = serverShifts.find(s => s.id === session.shiftId);
                    return (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {session.startTime} - {session.endTime}
                            </div>
                            {shift && (
                              <div className="text-sm text-gray-600">
                                {shift.area}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDuration(session.duration)}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Server Emotion</div>
                            <div className={`text-lg font-semibold ${getEmotionColor(session.serverEmotionScore)}`}>
                              {session.serverEmotionScore.toFixed(1)}/10
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Client Emotion</div>
                            <div className={`text-lg font-semibold ${getEmotionColor(session.clientEmotionScore)}`}>
                              {session.clientEmotionScore.toFixed(1)}/10
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Punctuality</div>
                            <div className={`text-lg font-semibold ${session.punctuality === 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {session.punctuality === 0 ? 'On Time' : `+${session.punctuality}m`}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Overall</div>
                            <div className={`text-lg font-semibold ${getEmotionColor((session.serverEmotionScore + session.clientEmotionScore) / 2)}`}>
                              {((session.serverEmotionScore + session.clientEmotionScore) / 2).toFixed(1)}/10
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No sessions recorded yet</p>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Performance Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#F2EFE7] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#006A71]">{server.avgEmotionScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Average Emotion Score</div>
                </div>
                <div className="bg-[#F2EFE7] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#48A6A7]">{serverSessions.length}</div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
                <div className="bg-[#F2EFE7] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#9ACBD0]">
                    {serverSessions.length > 0 
                      ? Math.round(serverSessions.reduce((acc, s) => acc + s.duration, 0) / serverSessions.length)
                      : 0}m
                  </div>
                  <div className="text-sm text-gray-600">Avg Session Duration</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Punctuality Record</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">On Time</span>
                      <span className="text-sm font-medium text-green-600">
                        {serverSessions.filter(s => s.punctuality === 0).length} sessions
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Late (1-5 min)</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {serverSessions.filter(s => s.punctuality > 0 && s.punctuality <= 5).length} sessions
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Late (5+ min)</span>
                      <span className="text-sm font-medium text-red-600">
                        {serverSessions.filter(s => s.punctuality > 5).length} sessions
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Areas Worked</h4>
                  <div className="space-y-2">
                    {Array.from(new Set(serverShifts.map(s => s.area))).map(area => (
                      <div key={area} className="flex justify-between">
                        <span className="text-sm text-gray-600">{area}</span>
                        <span className="text-sm font-medium text-[#006A71]">
                          {serverShifts.filter(s => s.area === area).length} shifts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};