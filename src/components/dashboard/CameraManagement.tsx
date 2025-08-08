import React, { useState, useRef, useCallback } from 'react';
import { Plus, Camera, Monitor, Grid, Save, RotateCcw, Trash2, Settings, Move } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface CameraDevice {
  id: string;
  name: string;
  area: string;
  status: 'online' | 'offline' | 'maintenance';
  resolution: string;
  assigned: boolean;
}

interface CameraSlot {
  id: string;
  camera: CameraDevice | null;
  position: { row: number; col: number };
}

export const CameraManagement: React.FC = () => {
  const [cameras, setCameras] = useState<CameraDevice[]>([
    {
      id: 'cam-001',
      name: 'Reception Main',
      area: 'Reception',
      status: 'online',
      resolution: '1080p',
      assigned: true
    },
    {
      id: 'cam-002',
      name: 'Customer Service Desk',
      area: 'Customer Service',
      status: 'online',
      resolution: '1080p',
      assigned: true
    },
    {
      id: 'cam-003',
      name: 'Support Area',
      area: 'Support Desk',
      status: 'offline',
      resolution: '720p',
      assigned: false
    },
    {
      id: 'cam-004',
      name: 'VIP Lounge',
      area: 'VIP Lounge',
      status: 'online',
      resolution: '4K',
      assigned: true
    },
    {
      id: 'cam-005',
      name: 'Waiting Area',
      area: 'Waiting Area',
      status: 'maintenance',
      resolution: '1080p',
      assigned: false
    },
    {
      id: 'cam-006',
      name: 'Sales Floor',
      area: 'Sales Floor',
      status: 'online',
      resolution: '1080p',
      assigned: false
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [draggedCamera, setDraggedCamera] = useState<CameraDevice | null>(null);
  const [cameraSlots, setCameraSlots] = useState<CameraSlot[]>([]);
  const [newCamera, setNewCamera] = useState({
    name: '',
    area: '',
    resolution: '1080p'
  });

  const areas = ['Reception', 'Customer Service', 'Support Desk', 'VIP Lounge', 'Sales Floor', 'Waiting Area'];
  const resolutions = ['720p', '1080p', '4K'];

  // Calculate grid dimensions based on number of cameras
  const getGridDimensions = () => {
    const totalCameras = cameras.length;
    if (totalCameras <= 1) return { rows: 1, cols: 1 };
    if (totalCameras <= 4) return { rows: 2, cols: 2 };
    if (totalCameras <= 6) return { rows: 2, cols: 3 };
    if (totalCameras <= 9) return { rows: 3, cols: 3 };
    if (totalCameras <= 12) return { rows: 3, cols: 4 };
    if (totalCameras <= 16) return { rows: 4, cols: 4 };
    return { rows: 4, cols: 5 };
  };

  const { rows, cols } = getGridDimensions();

  // Initialize camera slots
  React.useEffect(() => {
    const slots: CameraSlot[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        slots.push({
          id: `slot-${row}-${col}`,
          camera: null,
          position: { row, col }
        });
      }
    }
    
    // Assign cameras that are already assigned
    const assignedCameras = cameras.filter(cam => cam.assigned);
    assignedCameras.forEach((camera, index) => {
      if (index < slots.length) {
        slots[index].camera = camera;
      }
    });
    
    setCameraSlots(slots);
  }, [cameras, rows, cols]);

  const handleAddCamera = () => {
    const newCam: CameraDevice = {
      id: `cam-${Date.now()}`,
      name: newCamera.name,
      area: newCamera.area,
      status: 'online',
      resolution: newCamera.resolution,
      assigned: false
    };
    
    setCameras([...cameras, newCam]);
    setNewCamera({ name: '', area: '', resolution: '1080p' });
    setIsAddModalOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, camera: CameraDevice) => {
    setDraggedCamera(camera);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    if (!draggedCamera) return;

    const slotIndex = cameraSlots.findIndex(slot => slot.id === slotId);
    if (slotIndex === -1) return;

    // Update camera slots
    const newSlots = [...cameraSlots];
    
    // Remove camera from its current slot if it was already assigned
    const currentSlotIndex = newSlots.findIndex(slot => slot.camera?.id === draggedCamera.id);
    if (currentSlotIndex !== -1) {
      newSlots[currentSlotIndex].camera = null;
    }
    
    // If target slot has a camera, swap them
    const targetSlot = newSlots[slotIndex];
    if (targetSlot.camera) {
      // Move the existing camera back to unassigned
      setCameras(cameras.map(cam => 
        cam.id === targetSlot.camera?.id 
          ? { ...cam, assigned: false }
          : cam.id === draggedCamera.id
          ? { ...cam, assigned: true }
          : cam
      ));
    } else {
      // Just assign the dragged camera
      setCameras(cameras.map(cam => 
        cam.id === draggedCamera.id 
          ? { ...cam, assigned: true }
          : cam
      ));
    }
    
    // Assign the dragged camera to the target slot
    newSlots[slotIndex].camera = draggedCamera;
    
    setCameraSlots(newSlots);
    setDraggedCamera(null);
  };

  const handleRemoveFromSlot = (slotId: string) => {
    const slotIndex = cameraSlots.findIndex(slot => slot.id === slotId);
    if (slotIndex === -1) return;

    const slot = cameraSlots[slotIndex];
    if (!slot.camera) return;

    // Update camera to unassigned
    setCameras(cameras.map(cam => 
      cam.id === slot.camera?.id 
        ? { ...cam, assigned: false }
        : cam
    ));

    // Clear the slot
    const newSlots = [...cameraSlots];
    newSlots[slotIndex].camera = null;
    setCameraSlots(newSlots);
  };

  const handleDeleteCamera = (cameraId: string) => {
    setCameras(cameras.filter(cam => cam.id !== cameraId));
    
    // Remove from slots if assigned
    setCameraSlots(cameraSlots.map(slot => 
      slot.camera?.id === cameraId 
        ? { ...slot, camera: null }
        : slot
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const unassignedCameras = cameras.filter(cam => !cam.assigned);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Camera Management</h2>
          <p className="text-gray-600 mt-1">Configure and arrange your camera layout</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#006A71] hover:bg-[#004a51] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Camera
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Available Cameras */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Cameras</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {unassignedCameras.map((camera) => (
                <div
                  key={camera.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, camera)}
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-move hover:border-[#006A71] hover:bg-[#F2EFE7] transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`}></div>
                      <Camera className="w-4 h-4 text-gray-600" />
                    </div>
                    <button
                      onClick={() => handleDeleteCamera(camera.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{camera.name}</div>
                  <div className="text-xs text-gray-600 mb-2">{camera.area}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{camera.resolution}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(camera.status)}`}>
                      {camera.status}
                    </span>
                  </div>
                </div>
              ))}
              {unassignedCameras.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All cameras are assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Camera Grid Layout */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Camera Layout ({rows}x{cols})</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Online
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Offline
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Maintenance
                </div>
              </div>
            </div>
            
            <div 
              className="grid gap-4 p-4 bg-gray-50 rounded-lg min-h-96"
              style={{ 
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`
              }}
            >
              {cameraSlots.map((slot) => (
                <div
                  key={slot.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot.id)}
                  className={`relative border-2 border-dashed rounded-lg aspect-video flex items-center justify-center transition-all ${
                    slot.camera 
                      ? 'border-[#006A71] bg-white shadow-md' 
                      : 'border-gray-300 bg-gray-100 hover:border-[#48A6A7] hover:bg-[#F2EFE7]'
                  }`}
                >
                  {slot.camera ? (
                    <div className="w-full h-full">
                      {/* Camera Header */}
                      <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(slot.camera.status)}`}></div>
                          <Camera className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium text-gray-700 truncate">{slot.camera.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFromSlot(slot.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {/* Camera Feed Area */}
                      <div className="flex-1 bg-gray-900 flex items-center justify-center rounded-b-lg" style={{ height: 'calc(100% - 32px)' }}>
                        <div className="text-center text-white">
                          <Monitor className="w-6 h-6 mx-auto mb-1 opacity-75" />
                          <p className="text-xs">{slot.camera.resolution}</p>
                          <p className="text-xs text-gray-400">{slot.camera.area}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Drop camera here</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Camera List Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Cameras</h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Camera
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cameras.map((camera) => (
                <tr key={camera.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Camera className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{camera.name}</div>
                        <div className="text-sm text-gray-500">{camera.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {camera.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(camera.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusColor(camera.status)}`}></div>
                      {camera.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {camera.resolution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      camera.assigned 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {camera.assigned ? 'Assigned' : 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#006A71] hover:text-[#004a51] mr-3">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCamera(camera.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Camera Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Camera"
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddCamera(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Camera Name</label>
            <input
              type="text"
              value={newCamera.name}
              onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              placeholder="e.g., Reception Main Camera"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <select
              value={newCamera.area}
              onChange={(e) => setNewCamera({ ...newCamera, area: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
            <select
              value={newCamera.resolution}
              onChange={(e) => setNewCamera({ ...newCamera, resolution: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:border-transparent"
              required
            >
              {resolutions.map((resolution) => (
                <option key={resolution} value={resolution}>{resolution}</option>
              ))}
            </select>
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
              Add Camera
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};