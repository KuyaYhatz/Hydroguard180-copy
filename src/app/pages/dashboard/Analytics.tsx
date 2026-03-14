import { useState, useEffect, useCallback } from 'react';
import { waterMonitoringAPI, alertLevelsAPI } from '../../utils/api';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { BarChart3, TrendingUp, Droplets, AlertTriangle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useWaterMonitoringSSE } from '../../hooks/useWaterMonitoringSSE';

export function Analytics() {
  const [readings, setReadings] = useState<any[]>([]);
  const [allReadings, setAllReadings] = useState<any[]>([]);
  const [alertLevels, setAlertLevels] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  const [stats, setStats] = useState({
    totalRecords: 0,
    averageWaterLevel: 0,
    highestLevel: 0,
    mostFrequentAlert: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level4Count: 0,
  });
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Real-time SSE updates
  const handleWaterMonitoringUpdate = useCallback((newRecord: any) => {
    console.log('🌊 Analytics real-time update:', newRecord);
    
    setAllReadings(prev => {
      const updated = [newRecord, ...prev];
      // If no date filter is applied, update readings too
      if (!dateRange.start && !dateRange.end) {
        setReadings(updated);
        calculateStats(updated);
      }
      return updated;
    });
  }, [dateRange]);

  const { isConnected } = useWaterMonitoringSSE(handleWaterMonitoringUpdate);

  const loadData = async () => {
    try {
      const [readingsResponse, levelsData] = await Promise.all([
        waterMonitoringAPI.getAll({ limit: 10000 }),
        alertLevelsAPI.getAll(),
      ]);
      const readingsData = readingsResponse.data || [];
      setAllReadings(readingsData);
      setReadings(readingsData);
      setAlertLevels(levelsData);
      calculateStats(readingsData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const calculateStats = (data: any[]) => {
    if (data.length === 0) {
      setStats({
        totalRecords: 0,
        averageWaterLevel: 0,
        highestLevel: 0,
        mostFrequentAlert: 1,
        level1Count: 0,
        level2Count: 0,
        level3Count: 0,
        level4Count: 0,
      });
      return;
    }

    const totalRecords = data.length;
    const averageWaterLevel = data.reduce((sum, r) => sum + r.waterLevel, 0) / data.length;
    const highestLevel = Math.max(...data.map(r => r.waterLevel));

    const alertCounts = {
      1: data.filter(r => r.alertLevel === 1).length,
      2: data.filter(r => r.alertLevel === 2).length,
      3: data.filter(r => r.alertLevel === 3).length,
      4: data.filter(r => r.alertLevel === 4).length,
    };

    const mostFrequentAlert = Object.entries(alertCounts).reduce((a, b) => 
      alertCounts[a[0]] > alertCounts[b[0]] ? a : b
    )[0];

    setStats({
      totalRecords,
      averageWaterLevel: parseFloat(averageWaterLevel.toFixed(2)),
      highestLevel,
      mostFrequentAlert: parseInt(mostFrequentAlert),
      level1Count: alertCounts[1],
      level2Count: alertCounts[2],
      level3Count: alertCounts[3],
      level4Count: alertCounts[4],
    });
  };

  const handleFilterByDateRange = () => {
    if (!dateRange.start || !dateRange.end) {
      setReadings(allReadings);
      calculateStats(allReadings);
      return;
    }

    const filtered = allReadings.filter(r => {
      const timestamp = new Date(r.timestamp);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return timestamp >= start && timestamp <= end;
    });

    setReadings(filtered);
    calculateStats(filtered);
  };

  const mostFrequentAlertInfo = alertLevels.find(a => a.level === stats.mostFrequentAlert);

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* Date Range Filter - compact row */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <label className="text-xs text-gray-500 flex-shrink-0">From</label>
            <Input
              type="date"
              className="h-8 text-sm"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <label className="text-xs text-gray-500 flex-shrink-0">To</label>
            <Input
              type="date"
              className="h-8 text-sm"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleFilterByDateRange} size="sm" className="h-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs">
              Apply
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => {
              setDateRange({ start: '', end: '' });
              setReadings(allReadings);
              calculateStats(allReadings);
            }}>
              Reset
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowInsights(true)}>
              <Info size={14} className="mr-1" />
              Insights
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="text-blue-600" size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500">Total Records</p>
              <p className="text-xl font-bold text-[#1F2937]">{stats.totalRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Droplets className="text-sky-600" size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500">Avg Level</p>
              <p className="text-xl font-bold text-[#1F2937]">{stats.averageWaterLevel}<span className="text-xs text-gray-400 ml-0.5">cm</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-red-600" size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500">Highest</p>
              <p className="text-xl font-bold text-[#1F2937]">{stats.highestLevel}<span className="text-xs text-gray-400 ml-0.5">cm</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="text-orange-600" size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500">Most Frequent</p>
              <p className="text-xl font-bold text-[#1F2937]">Lv {stats.mostFrequentAlert}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Level Distribution + Recommended Actions — side by side, fills remaining space */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Distribution */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col min-h-0">
          <h3 className="text-sm font-bold text-[#1F2937] mb-3 flex-shrink-0">Alert Level Distribution</h3>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {alertLevels.map((alertInfo: any) => {
              const countKey = `level${alertInfo.level}Count` as keyof typeof stats;
              const count = stats[countKey] as number;
              const pct = ((count / stats.totalRecords) * 100 || 0);
              return (
                <div key={alertInfo.level}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-gray-700">Level {alertInfo.level} — {alertInfo.name}</span>
                    <span className="text-xs font-semibold text-gray-900">{count} <span className="text-gray-400 font-normal">({pct.toFixed(1)}%)</span></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{ backgroundColor: alertInfo.color, width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col min-h-0">
          <h3 className="text-sm font-bold text-[#1F2937] mb-3 flex-shrink-0">Recommendations</h3>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            <div className="border-l-3 border-[#22C55E] pl-3">
              <h4 className="text-xs font-semibold text-[#1F2937] mb-1">Current Trend</h4>
              <p className="text-xs text-gray-600">
                {stats.mostFrequentAlert === 1 
                  ? 'Water levels are predominantly normal. Continue regular monitoring.'
                  : stats.mostFrequentAlert === 2
                  ? 'Water levels show advisory status. Maintain increased vigilance.'
                  : stats.mostFrequentAlert === 3
                  ? 'Warning levels detected frequently. Prepare for potential evacuation.'
                  : 'Critical levels recorded. Immediate action required.'}
              </p>
            </div>
            <div className="border-l-3 border-[#FF6A00] pl-3">
              <h4 className="text-xs font-semibold text-[#1F2937] mb-1">Peak Monitoring</h4>
              <p className="text-xs text-gray-600">
                Highest recorded: {stats.highestLevel} cm. 
                {stats.highestLevel > 100 
                  ? ' Exceeded critical threshold — review emergency response.'
                  : stats.highestLevel > 80
                  ? ' Reached warning level — ensure preparedness protocols.'
                  : ' Levels remain manageable with current protocols.'}
              </p>
            </div>
            <div className="border-l-3 border-[#2563EB] pl-3">
              <h4 className="text-xs font-semibold text-[#1F2937] mb-1">Summary</h4>
              <p className="text-xs text-gray-600">
                Normal conditions {((stats.level1Count / stats.totalRecords) * 100 || 0).toFixed(1)}% of the time across {stats.totalRecords} records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Modal */}
      <AnimatePresence>
        {showInsights && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowInsights(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
                <button
                  onClick={() => setShowInsights(false)}
                  className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-100 text-gray-400"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Info className="text-blue-600" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937]">Data Insights</h3>
                </div>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    Analysis based on {stats.totalRecords} monitoring records
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                    Average water level: {stats.averageWaterLevel} cm
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    Peak reading: {stats.highestLevel} cm
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    Most frequent alert level: Level {stats.mostFrequentAlert} ({mostFrequentAlertInfo?.name})
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    Normal conditions: {((stats.level1Count / stats.totalRecords) * 100 || 0).toFixed(1)}% of the time
                  </li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
