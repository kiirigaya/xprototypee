import React, { useState, useRef, useCallback } from 'react';
import { Plus, Camera, Monitor, Grid, Save, RotateCcw, Trash2, Settings, Move } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface CameraDevice {
  id: string;
  name: string;
  area: string;
  status: 'online' | 'offline' | 'maintenance';
  resolution: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface CameraLayout {
  id: string;
  name: string;
  cameras: CameraDevice[];
  gridSize: { rows: number; cols: number };
}

export const CameraManagement: React.FC = () => {
  const [cameras, setCameras] = useState<CameraDevice[]>([
    {
      id: 'cam-001',
      name: 'Reception Main',
      area: 'Reception',
      status: 'online',
      resolution: '1080p',
      position: { x: 20, y: 20 },
      size: { width: 200, height: 150 }
    },
    {
      id: 'cam-002',
      name: 'Customer Service Desk',
      area: 'Customer Service',
      status: 'online',
      resolution: '1080p',
      position: { x: 240, y: 20 },
      size: { width: 200, height: 150 }
    },
    {
      id: 'cam-003',
      name: 'Support Area',
      area: 'Support Desk',
      status: 'offline',
      resolution: '720p',
      position: { x: 20, y: 190 },
      size: { width: 200, height: 150 }
    },
    {
      id: 'cam-004',
      name: 'VIP Lounge',
      area: 'VIP Lounge',
      status: 'online',
      resolution: '4K',
      position: { x: 240, y: 190 },
      size: { width: 200, height: 150 }
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newCamera, setNewCamera] = useState({
    name: '',
    area: '',
    resolution: '1080p'
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const areas = ['Reception', 'Customer Service', 'Support Desk', 'VIP Lounge', 'Sales Floor', 'Waiting Area'];
  const resolutions = ['720p', '1080p', '4K'];

  const handleAddCamera = () => {
    const newCam: CameraDevice = {
      id: `cam-${Date.now()}`,
      name: newCamera.name,
      area: newCamera.area,
      status: 'online',
      resolution: newCamera.resolution,
      position: { x: 20, y: 20 },
      size: { width: 200, height: 150 }
    };
    
    setCameras([...cameras, newCam]);
    setNewCamera({ name: '', area: '', resolution: '1080p' });
    setIsAddModalOpen(false);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, camera: CameraDevice) => {
    e.preventDefault();
    setSelectedCamera(camera);
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedCamera || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(
      canvasRect.width - selectedCamera.size.width,
      e.clientX - canvasRect.left - dragOffset.x
    ));
    const newY = Math.max(0, Math.min(
      canvasRect.height - selectedCamera.size.height,
      e.clientY - canvasRect.top - dragOffset.y
    ));

    setCameras(cameras.map(cam => 
      cam.id === selectedCamera.id 
        ? { ...cam, position: { x: newX, y: newY } }
        : cam
    ));
  }, [isDragging, selectedCamera, dragOffset, cameras]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setSelectedCamera(null);
  }, []);

  const handleDeleteCamera = (cameraId: string) => {
    setCameras(cameras.filter(cam => cam.id !== cameraId));
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

  const resetLayout = () => {
    const resetCameras = cameras.map((cam, index) => ({
      ...cam,
      position: {
        x: 20 + (index % 3) * 220,
        y: 20 + Math.floor(index / 3) * 170
      }
    }));
    setCameras(resetCameras);
  };

  const autoArrange = () => {
    const cols = Math.ceil(Math.sqrt(cameras.length));
    const arrangedCameras = cameras.map((cam, index) => ({
      ...cam,
      position: {
        x: 20 + (index % cols) * 220,
        y: 20 + Math.floor(index / cols) * 170
      }
    }));
    setCameras(arrangedCameras);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Camera Management</h2>
          <p className="text-gray-600 mt-1">Configure and arrange your camera layout</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={autoArrange}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Grid className="w-4 h-4 mr-2" />
            Auto Arrange
          </button>
          <button
            onClick={resetLayout}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Layout
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#006A71] hover:bg-[#004a51] transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Camera
          </button>
        </div>
      </div>

      {/* Camera Layout Canvas */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Camera Layout</h3>
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
          ref={canvasRef}
          className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
          style={{ height: '600px', width: '100%' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className={`absolute bg-white border-2 rounded-lg shadow-md cursor-move transition-all duration-200 ${
                selectedCamera?.id === camera.id ? 'border-[#006A71] shadow-lg z-10' : 'border-gray-300 hover:border-[#48A6A7]'
              }`}
              style={{
                left: camera.position.x,
                top: camera.position.y,
                width: camera.size.width,
                height: camera.size.height
              }}
              onMouseDown={(e) => handleMouseDown(e, camera)}
            >
              {/* Camera Header */}
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`}></div>
                  <Camera className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700 truncate">{camera.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCamera(camera.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              
              {/* Camera Feed Area */}
              <div className="flex-1 bg-gray-900 flex items-center justify-center" style={{ height: 'calc(100% - 40px)' }}>
                <div className="text-center text-white">
                  <Monitor className="w-8 h-8 mx-auto mb-1 opacity-75" />
                  <p className="text-xs">{camera.resolution}</p>
                  <p className="text-xs text-gray-400">{camera.area}</p>
                </div>
              </div>
              
              {/* Drag Handle */}
              <div className="absolute top-1 right-6 text-gray-400">
                <Move className="w-3 h-3" />
              </div>
            </div>
          ))}
          
          {cameras.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">No cameras configured</p>
                <p className="text-sm">Add your first camera to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Camera Devices</h3>
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
                  Position
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      camera.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : camera.status === 'offline'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusColor(camera.status)}`}></div>
                      {camera.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {camera.resolution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    x: {Math.round(camera.position.x)}, y: {Math.round(camera.position.y)}
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