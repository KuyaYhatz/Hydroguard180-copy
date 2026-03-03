import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, BookUser, Droplets, AlertTriangle, TrendingUp, Activity, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getUsers, getResidents, getWaterMonitoring, getCurrentAlertLevel, getLatestWaterReading, getAuditLogs } from '../../utils/database';
import { format } from 'date-fns';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResidents: 0,
    totalReadings: 0,
    currentAlertLevel: null as any,
    latestReading: null as any,
    chartData: [] as any[],
    recentActivity: [] as any[],
  });

  useEffect(() => {
    const users = getUsers();
    const residents = getResidents();
    const readings = getWaterMonitoring();
    const alertLevel = getCurrentAlertLevel();
    const latest = getLatestWaterReading();
    const auditLogs = getAuditLogs();

    // Prepare chart data (last 10 readings)
    const chartData = readings.slice(-10).map(r => ({
      time: format(new Date(r.timestamp), 'HH:mm'),
      level: r.waterLevel,
      alert: r.alertLevel
    }));

    // Get recent activity (last 5 logs)
    const recentActivity = auditLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    setStats({
      totalUsers: users.length,
      totalResidents: residents.length,
      totalReadings: readings.length,
      currentAlertLevel: alertLevel,
      latestReading: latest,
      chartData,
      recentActivity,
    });
  }, []);

  const statCards = [
    {
      title: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
      color: '#2563EB',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Registered Residents',
      value: stats.totalResidents,
      icon: BookUser,
      color: '#22C55E',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Monitoring Records',
      value: stats.totalReadings,
      icon: Droplets,
      color: '#0EA5E9',
      bgColor: 'bg-sky-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937]">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to Hydro Guard 180 Admin Portal</p>
      </div>

      {/* Current Alert Level Banner */}
      {stats.currentAlertLevel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4"
          style={{ borderLeftColor: stats.currentAlertLevel.color }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${stats.currentAlertLevel.color}20` }}
            >
              <AlertTriangle size={32} style={{ color: stats.currentAlertLevel.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-2xl font-bold text-[#1F2937]">
                  Current Alert Level: {stats.currentAlertLevel.level}
                </h2>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: stats.currentAlertLevel.color }}
                >
                  {stats.currentAlertLevel.name}
                </span>
              </div>
              <p className="text-gray-600">Risk: <span className="font-semibold">{stats.currentAlertLevel.risk}</span></p>
              <p className="text-gray-600 mt-1">{stats.currentAlertLevel.description}</p>
            </div>
            {stats.latestReading && (
              <div className="text-left md:text-right mt-4 md:mt-0 bg-gray-50 p-4 rounded-lg md:bg-transparent md:p-0">
                <p className="text-sm text-gray-500">Latest Reading</p>
                <div className="flex items-baseline gap-1 md:justify-end">
                  <p className="text-4xl font-bold text-[#1F2937]">{stats.latestReading.waterLevel}</p>
                  <p className="text-lg text-gray-500">{stats.latestReading.waterLevelUnit}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Updated: {format(new Date(stats.latestReading.timestamp), 'MMM d, h:mm a')}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-[#1F2937]">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} style={{ color: card.color }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Level Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <TrendingUp size={20} className="text-[#FF6A00]" />
              Water Level Trends
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Last 10 Readings</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  unit=" cm"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#1F2937' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="level" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLevel)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* System Status & Recent Activity */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Activity className="text-[#FF6A00]" size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">System Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Monitoring Device</span>
                <span className="inline-flex items-center gap-2 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Last Update</span>
                <span className="text-sm font-medium text-[#1F2937]">
                  {stats.latestReading ? format(new Date(stats.latestReading.timestamp), 'h:mm a') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">System Health</span>
                <span className="text-sm font-medium text-green-600">98% Excellent</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 flex-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="text-gray-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((log) => (
                  <div key={log.id} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1F2937]">{log.action}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{log.details}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {format(new Date(log.timestamp), 'MMM d, h:mm a')} • {log.userName}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-bold text-[#1F2937] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/dashboard/monitoring"
            className="p-4 border border-gray-200 rounded-xl hover:border-[#FF6A00] hover:bg-orange-50/50 transition-all duration-200 text-center group"
          >
            <div className="w-10 h-10 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplets className="text-[#FF6A00]" size={20} />
            </div>
            <p className="font-semibold text-sm text-[#1F2937]">View Monitoring</p>
          </a>
          <a
            href="/dashboard/residents"
            className="p-4 border border-gray-200 rounded-xl hover:border-[#22C55E] hover:bg-green-50/50 transition-all duration-200 text-center group"
          >
            <div className="w-10 h-10 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookUser className="text-[#22C55E]" size={20} />
            </div>
            <p className="font-semibold text-sm text-[#1F2937]">Manage Residents</p>
          </a>
          <a
            href="/dashboard/alerts"
            className="p-4 border border-gray-200 rounded-xl hover:border-[#EF4444] hover:bg-red-50/50 transition-all duration-200 text-center group"
          >
            <div className="w-10 h-10 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="text-[#EF4444]" size={20} />
            </div>
            <p className="font-semibold text-sm text-[#1F2937]">Alert Levels</p>
          </a>
          <a
            href="/dashboard/analytics"
            className="p-4 border border-gray-200 rounded-xl hover:border-[#2563EB] hover:bg-blue-50/50 transition-all duration-200 text-center group"
          >
            <div className="w-10 h-10 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="text-[#2563EB]" size={20} />
            </div>
            <p className="font-semibold text-sm text-[#1F2937]">View Analytics</p>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
