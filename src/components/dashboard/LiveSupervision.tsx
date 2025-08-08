import React, { useState, useEffect } from 'react';
import { Video, Mic, User, Users, Activity, Volume2, Play, Eye } from 'lucide-react';
import { liveEmotionData, liveTranscription } from '../../data/dummyData';
import { servers, shifts } from '../../data/dummyData';

interface LiveSupervisionProps {
  serverId?: string | null;
}

export const LiveSupervision: React.FC<LiveSupervisionProps> = ({ serverId }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(serverId || null);
  const [showServerSelection, setShowServerSelection] = useState(!serverId);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get active servers (those currently working)
  const getActiveServers = () => {
    const activeShifts = shifts.filter(shift => shift.status === 'active');
    return servers.filter(server => 
      server.status === 'active' && 
      activeShifts.some(shift => shift.serverId === server.id)
    ).map(server => {
      const currentShift = activeShifts.find(shift => shift.serverId === server.id);
      return {
        ...server,
        currentShift
      };
    });
  };

  const activeServers = getActiveServers();

  const handleStartSupervision = (serverId: string) => {
    setSelectedServerId(serverId);
    setShowServerSelection(false);
  };

  const handleBackToSelection = () => {
    setSelectedServerId(null);
    setShowServerSelection(true);
  };

  const getCurrentEmotion = () => {
    return liveEmotionData[liveEmotionData.length - 1];
  };

  const currentEmotion = getCurrentEmotion();
  
  // Get server info if serverId is provided
  const getServerInfo = () => {
    if (selectedServerId) {
      // In a real app, you'd fetch server details by ID
      const server = servers.find(s => s.id === selectedServerId);
      const shift = shifts.find(s => s.serverId === selectedServerId && s.status === 'active');
      return { 
        name: server?.name || 'Unknown Server', 
        area: shift?.area || 'Unknown Area',
        camera: shift?.camera || 'Unknown Camera'
      };
    }
    return { name: 'Unknown Server', area: 'Unknown Area', camera: 'Unknown Camera' };
  };
  
  const serverInfo = getServerInfo();

  // Show server selection if no server is selected
  if (showServerSelection || !selectedServerId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Supervision</h2>
          <p className="text-gray-600 mt-1">Select a server to start live monitoring</p>
        </div>

        {activeServers.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12">
            <div className="text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Servers</h3>
              <p className="text-gray-600">
                There are currently no servers working. Live supervision will be available when servers are on duty.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeServers.map((server) => (
              <div key={server.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-[#9ACBD0] flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-700">
                          {server.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{server.name}</h3>
                      <p className="text-sm text-gray-600">{server.currentShift?.area}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Live</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Video className="w-4 h-4 mr-2" />
                      <span>{server.currentShift?.camera}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="w-4 h-4 mr-2" />
                      <span>Emotion Score: {server.avgEmotionScore.toFixed(1)}/10</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span>Shift: {server.currentShift?.startTime} - {server.currentShift?.endTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartSupervision(server.id)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#006A71] hover:bg-[#004a51] transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Start Supervision
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Supervision</h2>
          <p className="text-gray-600 mt-1">
            Real-time monitoring and emotion analysis
            {selectedServerId && <span className="ml-2 text-[#006A71] font-medium">• Tracking {serverInfo.name}</span>}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToSelection}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Back to Selection
          </button>
          <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {isLive ? 'LIVE' : 'OFFLINE'}
          </span>
          <span className="text-sm text-gray-500">
            {currentTime.toLocaleTimeString()}
          </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Camera Feed</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Video className="w-4 h-4" />
                <span>{serverInfo.camera} • {serverInfo.area}</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
              <div className="text-center text-white">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-75" />
                <p className="text-lg font-medium">Live Camera Feed</p>
                <p className="text-sm text-gray-400 mt-1">{serverInfo.name} • {serverInfo.area}</p>
              </div>
              {/* Overlay Info */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded px-2 py-1">
                <span className="text-white text-sm">REC</span>
              </div>
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded px-2 py-1">
                <span className="text-white text-sm">{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded px-2 py-1">
                <span className="text-white text-sm">1080p • 30fps</span>
              </div>
            </div>
          </div>

          {/* Live Transcription */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Live Transcription</h3>
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4 text-green-500" />
                <Volume2 className="w-4 h-4 text-[#006A71]" />
              </div>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {liveTranscription.map((item, index) => (
                <div key={index} className="flex space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    item.speaker === 'Server' ? 'bg-[#006A71]' : 'bg-[#48A6A7]'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        item.speaker === 'Server' ? 'text-[#006A71]' : 'text-[#48A6A7]'
                      }`}>
                        {item.speaker}
                      </span>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emotion Analysis */}
        <div className="space-y-6">
          {/* Current Emotions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Emotions</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <User className="w-5 h-5 text-[#006A71] mr-2" />
                  <span className="text-sm font-medium">Server</span>
                </div>
                <div className="text-2xl font-bold text-[#006A71] mb-1">
                  {currentEmotion?.serverEmotion}
                </div>
                <div className="text-xs text-gray-500">
                  Confidence: {((currentEmotion?.confidence || 0) * 100).toFixed(0)}%
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-[#48A6A7] mr-2" />
                    <span className="text-sm font-medium">Client</span>
                  </div>
                  <div className="text-2xl font-bold text-[#48A6A7] mb-1">
                    {currentEmotion?.clientEmotion}
                  </div>
                  <div className="text-xs text-gray-500">
                    Detected: {currentEmotion?.timestamp}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emotion History */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Emotion Timeline</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...liveEmotionData].reverse().map((emotion, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <span className="font-medium">{emotion.timestamp}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[#006A71]">{emotion.serverEmotion}</div>
                    <div className="text-[#48A6A7]">{emotion.clientEmotion}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Session Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Session Duration</span>
                <span className="font-medium">2h 15m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Interactions</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Confidence</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quality Score</span>
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-green-500 mr-1" />
                  <span className="font-medium text-green-600">8.2/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};