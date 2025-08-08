import React from 'react';
import { Users, Clock, Heart, Calendar, Video } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { dashboardStats, shifts } from '../../data/dummyData';

export const Overview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Servers"
          value={dashboardStats.activeServers}
          icon={Users}
          color="primary"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Active Shifts"
          value={dashboardStats.activeShifts}
          icon={Clock}
          color="secondary"
        />
        <StatCard
          title="Avg Emotion Score"
          value={`${dashboardStats.avgEmotionScore}/10`}
          icon={Heart}
          color="accent"
          change={{ value: 5, type: 'increase' }}
        />
        <StatCard
          title="Upcoming Shifts"
          value={dashboardStats.upcomingShifts.length}
          icon={Calendar}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shifts */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Shifts</h3>
          <div className="space-y-3">
            {dashboardStats.upcomingShifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{shift.serverName}</p>
                  <p className="text-sm text-gray-500">{shift.area} • {shift.day}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {shift.startTime} - {shift.endTime}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    shift.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {shift.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Camera Preview */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Live Camera Preview</h3>
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="w-12 h-12 mx-auto mb-2 opacity-75" />
              <p className="text-sm">Camera Feed - Reception</p>
              <p className="text-xs text-gray-400 mt-1">CAM-001 • Live</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-500">Server:</span>
              <span className="ml-1 font-medium">Alice Johnson</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-green-600">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};