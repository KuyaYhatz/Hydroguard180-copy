import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Plus, Trash2, Settings as SettingsIcon, Bell, Activity, Download, Users, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import { getSettings, updateSettings, addSensor, exportToCSV, getAuditLogs, getWaterMonitoring, getUsers, getResidents } from '../../utils/database';
import { format } from 'date-fns';

export function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [sensors, setSensors] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const s = getSettings();
    const logs = getAuditLogs();
    setSettings(s);
    setSensors(s.sensors || []);
    setAuditLogs(
      [...logs]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15)
    );
    setLoading(false);
  };

  const handleToggleAlerts = (checked: boolean) => {
    updateSettings({ alertsEnabled: checked });
    setSettings({ ...settings, alertsEnabled: checked });
    toast.success(checked ? 'Alerts enabled' : 'Alerts disabled');
  };

  const handleUpdateCalibration = (field: string, value: number) => {
    const newCalibration = { ...settings.calibration, [field]: value };
    updateSettings({ calibration: newCalibration });
    setSettings({ ...settings, calibration: newCalibration });
    toast.success('Calibration updated');
  };

  const handleAddSensor = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newSensor = {
      id: `S-${Date.now()}`,
      name: formData.get('name'),
      location: formData.get('location'),
      status: 'Active',
      lastCalibration: new Date().toISOString().split('T')[0],
    };
    addSensor(newSensor);
    setSensors([...sensors, newSensor]);
    form.reset();
    toast.success('Sensor registered successfully');
  };

  const handleBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      settings: getSettings(),
      users: getUsers(),
      residents: getResidents(),
      waterMonitoring: getWaterMonitoring(),
      auditLogs: getAuditLogs(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydroguard_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Backup downloaded successfully');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full min-h-0 gap-4 lg:overflow-hidden overflow-y-auto custom-scrollbar">
      

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col min-h-0">
          <div className="flex items-center gap-2.5 mb-4 flex-shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <SettingsIcon className="text-gray-600" size={18} />
            </div>
            <h2 className="text-sm font-bold text-[#1F2937]">System Settings</h2>
          </div>

          <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2.5">
                <Bell className="text-gray-500" size={16} />
                <div>
                  <p className="font-medium text-[#1F2937] text-sm">System Alerts</p>
                  <p className="text-[11px] text-gray-500">Enable/disable automated warnings</p>
                </div>
              </div>
              <Switch checked={settings?.alertsEnabled} onCheckedChange={handleToggleAlerts} />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="text-gray-500" size={16} />
                <p className="font-medium text-[#1F2937] text-sm">Device Calibration</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500">Zero Point Offset</label>
                  <Input
                    type="number"
                    className="h-8 text-sm"
                    value={settings?.calibration?.zeroPointOffset || 0}
                    onChange={(e) => handleUpdateCalibration('zeroPointOffset', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">Scale Factor</label>
                  <Input
                    type="number"
                    className="h-8 text-sm"
                    value={settings?.calibration?.scaleFactor || 1}
                    onChange={(e) => handleUpdateCalibration('scaleFactor', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <Button onClick={handleBackup} variant="outline" size="sm" className="w-full flex items-center gap-2">
                <Download size={14} />
                Backup System Data
              </Button>
            </div>
          </div>
        </div>

        {/* Sensor Registration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col min-h-0">
          <div className="flex items-center gap-2.5 mb-4 flex-shrink-0">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Activity className="text-green-600" size={18} />
            </div>
            <h2 className="text-sm font-bold text-[#1F2937]">Sensors</h2>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 mb-3 pr-1 custom-scrollbar">
            {sensors.map((sensor) => (
              <div
                key={sensor.id}
                className="flex justify-between items-center p-2.5 border border-gray-100 rounded-lg bg-gray-50/50"
              >
                <div>
                  <p className="font-medium text-xs text-[#1F2937]">{sensor.name}</p>
                  <p className="text-[10px] text-gray-500">
                    {sensor.location} • {sensor.id}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    sensor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {sensor.status}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddSensor} className="space-y-2 pt-3 border-t border-gray-100 flex-shrink-0">
            <p className="text-xs font-medium text-gray-700">Register New Sensor</p>
            <Input name="name" placeholder="Sensor Name" required className="h-8 text-sm" />
            <Input name="location" placeholder="Location" required className="h-8 text-sm" />
            <Button type="submit" size="sm" className="w-full bg-[#26343A] hover:bg-[#1f2b30]">
              <Plus size={14} className="mr-1.5" /> Register
            </Button>
          </form>
        </div>
      </div>

      {/* Audit Log — compact, scrollable within fixed area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-shrink-0 lg:max-h-[200px] flex flex-col overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
            <Shield className="text-purple-600" size={14} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1F2937]">Audit Log</h2>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Time</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">User</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Action</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                      {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                    </td>
                    <td className="py-2 px-3 font-medium text-[#1F2937]">{log.userName}</td>
                    <td className="py-2 px-3 text-gray-700">{log.action}</td>
                    <td className="py-2 px-3 text-gray-500 max-w-[200px] truncate">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No audit logs available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-gray-50">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div key={log.id} className="px-4 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#1F2937]">{log.userName}</span>
                  <span className="text-[10px] text-gray-400">{format(new Date(log.timestamp), 'MMM d, h:mm a')}</span>
                </div>
                <p className="text-xs text-gray-700">{log.action}</p>
                <p className="text-[11px] text-gray-400 truncate">{log.details}</p>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-gray-400 text-xs">
              No audit logs available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}