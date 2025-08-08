import React from 'react';
import { ArrowLeft, Calendar, Clock, User, Users, Camera, Mic, FileText, TrendingUp, TrendingDown, Activity, MapPin } from 'lucide-react';
import { ShiftSession } from '../../types';
import { shifts } from '../../data/dummyData';

interface SessionDetailsProps {
  session: ShiftSession;
  onBack: () => void;
}

export const SessionDetails: React.FC<SessionDetailsProps> = ({ session, onBack }) => {
  const shift = shifts.find(s => s.id === session.shiftId);

  // Mock detailed emotion data - in a real app, this would come from the API
  const emotionDetails = {
    server: {
      tone: { angry: 15, neutral: 60, happy: 25 },
      camera: { angry: 10, neutral: 55, happy: 35 },
      text: { angry: 8, neutral: 65, happy: 27 }
    },
    client: {
      camera: { angry: 12, neutral: 58, happy: 30 }
    }
  };

  // Mock timing details
  const timingDetails = {
    scheduledStart: shift?.startTime || '09:00',
    scheduledEnd: shift?.endTime || '17:00',
    actualStart: session.startTime,
    actualEnd: session.endTime,
    breakDuration: 45, // minutes
    activeWorkTime: session.duration - 45
  };

  // Mock performance stats
  const performanceStats = {
    customerInteractions: 23,
    avgInteractionTime: 8.5, // minutes
    resolutionRate: 91,
    customerSatisfactionScore: 4.2,
    responseTime: 1.8 // minutes
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

  const getOverallScore = () => {
    const serverAvg = (session.serverEmotionScore);
    const clientAvg = (session.clientEmotionScore);
    const punctualityScore = session.punctuality === 0 ? 10 : Math.max(0, 10 - (session.punctuality / 5));
    const performanceScore = (performanceStats.resolutionRate / 10);
    
    return ((serverAvg + clientAvg + punctualityScore + performanceScore) / 4).toFixed(1);
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
            Back to Sessions
          </button>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Session ID</div>
          <div className="text-lg font-medium text-gray-900">{session.id}</div>
        </div>
      </div>

      {/* Session Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Session Details</h1>
            <p className="text-gray-600 mt-1">
              {new Date(session.date).toLocaleDateString()} • {shift?.serverName} • {shift?.area}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#006A71]">{getOverallScore()}</div>
            <div className="text-sm text-gray-500">Overall Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-[#F2EFE7] rounded-lg">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-[#006A71]" />
            <div className="text-lg font-semibold text-gray-900">{new Date(session.date).toLocaleDateString()}</div>
            <div className="text-sm text-gray-600">Date</div>
          </div>
          <div className="text-center p-4 bg-[#F2EFE7] rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-2 text-[#48A6A7]" />
            <div className="text-lg font-semibold text-gray-900">{formatDuration(session.duration)}</div>
            <div className="text-sm text-gray-600">Duration</div>
          </div>
          <div className="text-center p-4 bg-[#F2EFE7] rounded-lg">
            <MapPin className="w-6 h-6 mx-auto mb-2 text-[#9ACBD0]" />
            <div className="text-lg font-semibold text-gray-900">{shift?.area}</div>
            <div className="text-sm text-gray-600">Area</div>
          </div>
          <div className="text-center p-4 bg-[#F2EFE7] rounded-lg">
            <Activity className="w-6 h-6 mx-auto mb-2 text-[#006A71]" />
            <div className="text-lg font-semibold text-gray-900">{performanceStats.customerInteractions}</div>
            <div className="text-sm text-gray-600">Interactions</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Emotion Analysis */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-[#006A71] mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Server Emotion Analysis</h3>
          </div>
          
          <div className="space-y-6">
            {/* By Tone */}
            <div>
              <div className="flex items-center mb-3">
                <Mic className="w-4 h-4 text-[#48A6A7] mr-2" />
                <span className="text-sm font-medium text-gray-700">Voice Tone Analysis</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">Angry</span>
                  <span className="text-sm font-medium">{emotionDetails.server.tone.angry}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${emotionDetails.server.tone.angry}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Neutral</span>
                  <span className="text-sm font-medium">{emotionDetails.server.tone.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${emotionDetails.server.tone.neutral}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Happy</span>
                  <span className="text-sm font-medium">{emotionDetails.server.tone.happy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${emotionDetails.server.tone.happy}%` }}></div>
                </div>
              </div>
            </div>

            {/* By Camera */}
            <div>
              <div className="flex items-center mb-3">
                <Camera className="w-4 h-4 text-[#48A6A7] mr-2" />
                <span className="text-sm font-medium text-gray-700">Facial Expression Analysis</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">Angry</span>
                  <span className="text-sm font-medium">{emotionDetails.server.camera.angry}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${emotionDetails.server.camera.angry}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Neutral</span>
                  <span className="text-sm font-medium">{emotionDetails.server.camera.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${emotionDetails.server.camera.neutral}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Happy</span>
                  <span className="text-sm font-medium">{emotionDetails.server.camera.happy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${emotionDetails.server.camera.happy}%` }}></div>
                </div>
              </div>
            </div>

            {/* By Text */}
            <div>
              <div className="flex items-center mb-3">
                <FileText className="w-4 h-4 text-[#48A6A7] mr-2" />
                <span className="text-sm font-medium text-gray-700">Text Sentiment Analysis</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">Angry</span>
                  <span className="text-sm font-medium">{emotionDetails.server.text.angry}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${emotionDetails.server.text.angry}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Neutral</span>
                  <span className="text-sm font-medium">{emotionDetails.server.text.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${emotionDetails.server.text.neutral}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Happy</span>
                  <span className="text-sm font-medium">{emotionDetails.server.text.happy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${emotionDetails.server.text.happy}%` }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getEmotionColor(session.serverEmotionScore)}`}>
                  {session.serverEmotionScore.toFixed(1)}/10
                </div>
                <div className="text-sm text-gray-500">Overall Server Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Emotion Analysis */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-[#48A6A7] mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Client Emotion Analysis</h3>
          </div>
          
          <div className="space-y-6">
            {/* By Camera Only */}
            <div>
              <div className="flex items-center mb-3">
                <Camera className="w-4 h-4 text-[#48A6A7] mr-2" />
                <span className="text-sm font-medium text-gray-700">Facial Expression Analysis</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">Angry</span>
                  <span className="text-sm font-medium">{emotionDetails.client.camera.angry}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${emotionDetails.client.camera.angry}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Neutral</span>
                  <span className="text-sm font-medium">{emotionDetails.client.camera.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${emotionDetails.client.camera.neutral}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Happy</span>
                  <span className="text-sm font-medium">{emotionDetails.client.camera.happy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${emotionDetails.client.camera.happy}%` }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getEmotionColor(session.clientEmotionScore)}`}>
                  {session.clientEmotionScore.toFixed(1)}/10
                </div>
                <div className="text-sm text-gray-500">Overall Client Score</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm text-yellow-800">
                <strong>Note:</strong> Client emotion analysis is currently available through camera-based facial recognition only. Voice and text analysis for clients will be available in future updates.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timing Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Timing & Schedule Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Scheduled vs Actual</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Scheduled Start:</span>
                <span className="font-medium">{timingDetails.scheduledStart}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Actual Start:</span>
                <span className={`font-medium ${session.punctuality > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {timingDetails.actualStart}
                  {session.punctuality > 0 && ` (+${session.punctuality}m late)`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Scheduled End:</span>
                <span className="font-medium">{timingDetails.scheduledEnd}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Actual End:</span>
                <span className="font-medium">{timingDetails.actualEnd}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Work Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Session:</span>
                <span className="font-medium">{formatDuration(session.duration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Break Time:</span>
                <span className="font-medium">{formatDuration(timingDetails.breakDuration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Work:</span>
                <span className="font-medium text-[#006A71]">{formatDuration(timingDetails.activeWorkTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Punctuality:</span>
                <span className={`font-medium ${session.punctuality === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {session.punctuality === 0 ? 'On Time' : `${session.punctuality}m Late`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Statistics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-[#F2EFE7] rounded-lg">
            <div className="text-2xl font-bold text-[#006A71]">{performanceStats.customerInteractions}</div>
            <div className="text-sm text-gray-600">Customer Interactions</div>
          </div>
          <div className="text-center p-4 bg-[#F2EFE7] rounded-lg">
            <div className="text-2xl font-bold text-[#48A6A7]">{performanceStats.avgInteractionTime}m</div>
            <div className="text-sm text-gray-600">Avg Interaction Time</div>
          </div>
          <div className="text-center p-4 bg-[#F2EFE7] rounded-lg">
            <div className="text-2xl font-bold text-[#9ACBD0]">{performanceStats.resolutionRate}%</div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </div>
          <div className="text-center p-4 bg-[#F2EFE7] rounded-lg">
            <div className="text-2xl font-bold text-[#006A71]">{performanceStats.customerSatisfactionScore}/5</div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Response Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time:</span>
                  <span className="font-medium">{performanceStats.responseTime}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">First Contact Resolution:</span>
                  <span className="font-medium text-green-600">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Escalation Rate:</span>
                  <span className="font-medium text-yellow-600">8%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Quality Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Professional Behavior:</span>
                  <span className="font-medium text-green-600">9.2/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Communication Clarity:</span>
                  <span className="font-medium text-green-600">8.8/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Problem Solving:</span>
                  <span className="font-medium text-green-600">8.5/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};