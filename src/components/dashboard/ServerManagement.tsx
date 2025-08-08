import React, { useState } from 'react';
import { Plus, Mail, Phone, MoreVertical, TrendingUp } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ServerProfile } from './ServerProfile';
import { servers, shifts, shiftSessions } from '../../data/dummyData';
import { Server } from '../../types';

interface ServerManagementProps {
  onStartLiveTracking?: (serverId: string) => void;
}

export const ServerManagement: React.FC<ServerManagementProps> = ({ onStartLiveTracking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newServer, setNewServer] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleAddServer = () => {
    // In a real app, this would make an API call
    console.log('Adding server:', newServer);
    setNewServer({ name: '', email: '', phone: '', password: '' });
    setIsAddModalOpen(false);
  };

  const getServerShifts = (serverId: string) => {
    return shifts.filter(shift => shift.serverId === serverId);
  };

  const getServerStats = (serverId: string) => {
    const serverShifts = getServerShifts(serverId);
    const sessions = shiftSessions.filter(session => 
      serverShifts.some(shift => shift.id === session.shiftId)
    );
    
    return {
      totalSessions: sessions.length,
      avgPunctuality: sessions.reduce((acc, s) => acc + s.punctuality, 0) / sessions.length || 0,
      avgDuration: sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length || 0
    };
  };

  const handleServerClick = (server: Server) => {
    setSelectedServer(server);
    setShowProfile(true);
  };

  const handleBackToList = () => {
    setShowProfile(false);
    setSelectedServer(null);
  };

  const handleStartLiveTracking = (serverId: string) => {
    if (onStartLiveTracking) {
      onStartLiveTracking(serverId);
    }
  };

  if (showProfile && selectedServer) {
    return (
      <ServerProfile 
        server={selectedServer} 
        onBack={handleBackToList}
        onStartLiveTracking={handleStartLiveTracking}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Server Management</h2>
          <p className="text-gray-600 mt-1">Manage your customer service team</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#006A71] hover:bg-[#004a51] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Server
        </button>
      </div>

      {/* Servers Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Server
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {servers.map((server) => (
              <tr key={server.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-[#9ACBD0] flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {server.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{server.name}</div>
                      <div className="text-sm text-gray-500">{server.totalShifts} total shifts</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {server.email}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    {server.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    server.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {server.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-[#48A6A7]" />
                    <span className="text-sm font-medium text-gray-900">
                      {server.avgEmotionScore.toFixed(1)}/10
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleServerClick(server)}
                    className="text-[#006A71] hover:text-[#004a51] mr-3"
                  >
                    View Profile
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Server Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Server"
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddServer(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={newServer.name}
              onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newServer.email}
              onChange={(e) => setNewServer({ ...newServer, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={newServer.phone}
              onChange={(e) => setNewServer({ ...newServer, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <input
              type="password"
              value={newServer.password}
              onChange={(e) => setNewServer({ ...newServer, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#006A71] hover:bg-[#004a51] rounded-md transition-colors"
            >
              Add Server
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};