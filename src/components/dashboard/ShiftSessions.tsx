import React from 'react';
import React, { useState } from 'react';
import { Calendar, Clock, TrendingUp, TrendingDown, User, Users } from 'lucide-react';
import { shiftSessions, shifts } from '../../data/dummyData';

export const ShiftSessions: React.FC = () => {
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');

  const getShiftInfo = (shiftId: string) => {
    return shifts.find(shift => shift.id === shiftId);
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

  const getPunctualityColor = (delay: number) => {
    if (delay === 0) return 'text-green-600';
    if (delay <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFilteredSessions = () => {
    let filtered = shiftSessions;
    
    if (selectedShift !== 'all') {
      filtered = filtered.filter(session => session.shiftId === selectedShift);
    }
    
    if (selectedArea !== 'all') {
      const shiftInfo = getShiftInfo(session.shiftId);
      filtered = filtered.filter(session => {
        const shiftInfo = getShiftInfo(session.shiftId);
        return shiftInfo?.area === selectedArea;
      });
    }
    
    return filtered;
  };

  const getUniqueAreas = () => {
    const areas = new Set<string>();
    shiftSessions.forEach(session => {
      const shift = getShiftInfo(session.shiftId);
      if (shift?.area) areas.add(shift.area);
    });
    return Array.from(areas);
  };

  const filteredSessions = getFilteredSessions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Shift Session Details</h2>
        <p className="text-gray-600 mt-1">Historical performance data for completed shifts</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Shift</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
            >
              <option value="all">All Shifts</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.serverName} - {shift.area} ({shift.day} {shift.startTime}-{shift.endTime})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
            >
              <option value="all">All Areas</option>
              {getUniqueAreas().map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredSessions.length} of {shiftSessions.length} sessions
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => {
          const shift = getShiftInfo(session.shiftId);
          return (
            <div key={session.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {session.startTime} - {session.endTime}
                  </div>
                  {shift && (
                    <>
                      <div className="text-sm text-gray-600">
                        {shift.serverName} • {shift.area}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Duration: {formatDuration(session.duration)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Server Emotion */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <User className="w-5 h-5 text-[#006A71] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Server Emotion</span>
                  </div>
                  <div className={`text-2xl font-bold ${getEmotionColor(session.serverEmotionScore)}`}>
                    {session.serverEmotionScore.toFixed(1)}/10
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {session.serverEmotionScore >= 7 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Client Emotion */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-[#48A6A7] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Client Emotion</span>
                  </div>
                  <div className={`text-2xl font-bold ${getEmotionColor(session.clientEmotionScore)}`}>
                    {session.clientEmotionScore.toFixed(1)}/10
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {session.clientEmotionScore >= 7 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Punctuality */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-[#9ACBD0] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Punctuality</span>
                  </div>
                  <div className={`text-2xl font-bold ${getPunctualityColor(session.punctuality)}`}>
                    {session.punctuality === 0 ? 'On Time' : `+${session.punctuality}m`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {session.punctuality === 0 ? 'Perfect' : 'Delayed'}
                  </div>
                </div>

                {/* Overall Score */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-[#006A71] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Overall Score</span>
                  </div>
                  <div className={`text-2xl font-bold ${getEmotionColor((session.serverEmotionScore + session.clientEmotionScore) / 2)}`}>
                    {((session.serverEmotionScore + session.clientEmotionScore) / 2).toFixed(1)}/10
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Combined Average
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Area:</span>
                    <span className="ml-2 font-medium">{shift?.area}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Camera:</span>
                    <span className="ml-2 font-medium">{shift?.camera}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Session ID:</span>
                    <span className="ml-2 font-medium text-xs text-gray-400">{session.id}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#006A71]">
              {filteredSessions.length}
            </div>
            <div className="text-sm text-gray-500">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#48A6A7]">
              {filteredSessions.length > 0 
                ? (filteredSessions.reduce((acc, s) => acc + s.serverEmotionScore, 0) / filteredSessions.length).toFixed(1)
                : '0.0'
              }
            </div>
            <div className="text-sm text-gray-500">Avg Server Emotion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#9ACBD0]">
              {filteredSessions.length > 0 
                ? (filteredSessions.reduce((acc, s) => acc + s.clientEmotionScore, 0) / filteredSessions.length).toFixed(1)
                : '0.0'
              }
            </div>
            <div className="text-sm text-gray-500">Avg Client Emotion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {filteredSessions.length > 0 
                ? Math.round(filteredSessions.reduce((acc, s) => acc + s.duration, 0) / filteredSessions.length)
                : 0
              }m
            </div>
            <div className="text-sm text-gray-500">Avg Duration</div>
          </div>
        </div>
      </div>
    </div>
  );
};