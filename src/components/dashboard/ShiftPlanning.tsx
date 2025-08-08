import  { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Camera } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { shifts, servers, shiftSessions } from '../../data/dummyData';

interface ShiftPlanningProps {
  onViewSessions?: (shiftId: string) => void;
}

export const ShiftPlanning: React.FC<ShiftPlanningProps> = ({ onViewSessions }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [newShift, setNewShift] = useState({
    serverId: '',
    area: '',
    camera: '',
    day: '',
    startTime: '',
    endTime: ''
  });

  const areas = ['Reception', 'Customer Service', 'Support Desk', 'VIP Lounge', 'Sales Floor'];
  const cameras = ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-004', 'CAM-005'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const allDays = ['All', ...days];

  const handleAddShift = () => {
    console.log('Adding shift:', newShift);
    setNewShift({
      serverId: '',
      area: '',
      camera: '',
      day: '',
      startTime: '',
      endTime: ''
    });
    setIsAddModalOpen(false);
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

  const getShiftsByDay = () => {
    if (selectedDay === 'All') {
      return days.map(day => ({
        day,
        shifts: shifts.filter(shift => shift.day === day)
      }));
    } else {
      return [{
        day: selectedDay,
        shifts: shifts.filter(shift => shift.day === selectedDay)
      }];
    }
  };

  const getShiftSessionCount = (shiftId: string) => {
    return shiftSessions.filter(session => session.shiftId === shiftId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shift Planning</h2>
          <p className="text-gray-600 mt-1">Schedule and manage work shifts</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#006A71] hover:bg-[#004a51] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Shift
        </button>
      </div>

      {/* Day Filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by day:</span>
          {allDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedDay === day
                  ? 'bg-[#006A71] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Shifts by Day */}
      <div className="space-y-6">
        {getShiftsByDay().map(({ day, shifts: dayShifts }) => (
          <div key={day} className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#006A71]" />
                {day}
                <span className="ml-2 text-sm text-gray-500">({dayShifts.length} shifts)</span>
              </h3>
            </div>
            {dayShifts.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Server
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area & Camera
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dayShifts.map((shift) => (
                      <tr key={shift.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-[#9ACBD0] flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-700">
                                  {shift.serverName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{shift.serverName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 mb-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {shift.area}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Camera className="w-4 h-4 mr-1" />
                            {shift.camera}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="w-4 h-4 mr-1" />
                            {shift.startTime} - {shift.endTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shift.status)}`}>
                            {shift.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#006A71] hover:text-[#004a51] mr-3">
                            Edit
                          </button>
                          <button 
                            onClick={() => onViewSessions && onViewSessions(shift.id)}
                            className="text-[#48A6A7] hover:text-[#006A71]"
                          >
                            View Sessions ({getShiftSessionCount(shift.id)})
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No shifts scheduled for {day}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Shift Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Shift"
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddShift(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Server</label>
            <select
              value={newShift.serverId}
              onChange={(e) => setNewShift({ ...newShift, serverId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              required
            >
              <option value="">Select a server</option>
              {servers.map((server) => (
                <option key={server.id} value={server.id}>{server.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <select
              value={newShift.area}
              onChange={(e) => setNewShift({ ...newShift, area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              required
            >
              <option value="">Select an area</option>
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Camera</label>
            <select
              value={newShift.camera}
              onChange={(e) => setNewShift({ ...newShift, camera: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              required
            >
              <option value="">Select a camera</option>
              {cameras.map((camera) => (
                <option key={camera} value={camera}>{camera}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <select
              value={newShift.day}
              onChange={(e) => setNewShift({ ...newShift, day: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              required
            >
              <option value="">Select a day</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={newShift.startTime}
                onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={newShift.endTime}
                onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
                required
              />
            </div>
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
              Add Shift
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};