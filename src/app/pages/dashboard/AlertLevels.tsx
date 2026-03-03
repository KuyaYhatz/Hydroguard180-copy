import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getAlertLevels, getCurrentAlertLevel, updateAlertLevel } from '../../utils/database';
import { AlertTriangle, ChevronDown, ChevronUp, Droplets, Save, Shield, Pencil, X, Eye } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export function AlertLevels() {
  const [alertLevels, setAlertLevels] = useState<any[]>([]);
  const [currentAlert, setCurrentAlert] = useState<any>(null);
  const [editingThresholds, setEditingThresholds] = useState<Record<number, { min: number; max: number }>>({});
  const [editingLevelId, setEditingLevelId] = useState<number | null>(null);
  const [viewingProtocol, setViewingProtocol] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const levels = getAlertLevels();
    setAlertLevels(levels);
    setCurrentAlert(getCurrentAlertLevel());
    const thresholds: Record<number, { min: number; max: number }> = {};
    levels.forEach((l: any) => {
      thresholds[l.level] = { min: l.minWaterLevel, max: l.maxWaterLevel };
    });
    setEditingThresholds(thresholds);
  };

  const handleSaveThreshold = (level: number) => {
    const t = editingThresholds[level];
    if (t.min >= t.max) {
      toast.error('Min level must be less than max level');
      return;
    }
    updateAlertLevel(level, { minWaterLevel: t.min, maxWaterLevel: t.max });
    toast.success(`Level ${level} thresholds updated`);
    setEditingLevelId(null);
    loadData();
  };

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* Current Status Banner - compact */}
      {currentAlert && (
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between flex-shrink-0"
          style={{ backgroundColor: `${currentAlert.color}10`, border: `1px solid ${currentAlert.color}30` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${currentAlert.color}20` }}
            >
              <Shield size={18} style={{ color: currentAlert.color }} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500">Current Status</p>
              <p className="font-bold text-[#1F2937] text-sm">
                Level {currentAlert.level} — {currentAlert.name}
              </p>
            </div>
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: currentAlert.color }}
          >
            {currentAlert.risk} Risk
          </div>
        </div>
      )}

      {/* Main content: Cards + Threshold side by side */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Alert Level Cards - 2x2 grid on left */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-3 auto-rows-min lg:auto-rows-fr">
          {alertLevels.map((alert, i) => {
            const isActive = currentAlert?.level === alert.level;

            return (
              <div
                key={alert.level}
                className={`bg-white rounded-xl shadow-sm overflow-hidden border transition-shadow flex flex-col ${
                  isActive ? 'ring-2 shadow-md' : 'hover:shadow-md'
                }`}
                style={{
                  borderColor: isActive ? alert.color : '#e5e7eb',
                  ringColor: isActive ? alert.color : undefined,
                }}
              >
                {/* Color top bar */}
                <div className="h-1" style={{ backgroundColor: alert.color }} />

                <div className="p-3 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: alert.color }}
                      >
                        {alert.level}
                      </div>
                      <div>
                        <p className="font-bold text-[#1F2937] text-xs">{alert.name}</p>
                        <p className="text-[10px] text-gray-400">{alert.risk}</p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span
                          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          style={{ backgroundColor: alert.color }}
                        />
                        <span
                          className="relative inline-flex rounded-full h-2.5 w-2.5"
                          style={{ backgroundColor: alert.color }}
                        />
                      </span>
                    )}
                  </div>

                  {/* Water range */}
                  <div className="flex items-center gap-1.5 text-xs bg-gray-50 rounded-lg px-2.5 py-1.5 mb-2">
                    <Droplets size={12} className="text-blue-400" />
                    <span className="text-gray-600">
                      {alert.minWaterLevel} – {alert.maxWaterLevel === 999 ? '∞' : alert.maxWaterLevel} cm
                    </span>
                  </div>

                  {/* Action */}
                  <p className="text-[11px] text-gray-600 flex-1 line-clamp-2">{alert.action}</p>

                  {/* View Protocols button */}
                  <button
                    onClick={() => setViewingProtocol(alert)}
                    className="flex items-center gap-1 text-[11px] font-medium justify-center py-1.5 rounded-lg hover:bg-gray-50 transition-colors mt-2"
                    style={{ color: alert.color }}
                  >
                    <Eye size={12} />
                    Protocols ({alert.protocols.length})
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Threshold Configuration - right side */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-[#FF6A00]" size={14} />
            </div>
            <h2 className="font-bold text-[#1F2937] text-sm">Threshold Config</h2>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
            {alertLevels.map((level) => {
              const isEditing = editingLevelId === level.level;
              return (
                <div key={level.level} className="px-4 py-3 space-y-2">
                  {/* Level header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: level.color }}
                      />
                      <span className="text-xs font-medium text-[#1F2937]">
                        Level {level.level}: {level.name}
                      </span>
                    </div>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleSaveThreshold(level.level)}
                          size="sm"
                          className="h-6 text-[10px] px-2 bg-[#FF6A00] hover:bg-[#E55F00] text-white"
                        >
                          <Save size={10} className="mr-0.5" />
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingLevelId(null);
                            setEditingThresholds((prev) => ({
                              ...prev,
                              [level.level]: { min: level.minWaterLevel, max: level.maxWaterLevel },
                            }));
                          }}
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] px-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setEditingLevelId(level.level)}
                        size="sm"
                        variant="outline"
                        className="h-6 text-[10px] px-2"
                      >
                        <Pencil size={10} className="mr-0.5" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {/* Values */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      <label className="text-[10px] text-gray-400">Min</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          className="h-7 text-xs"
                          value={editingThresholds[level.level]?.min ?? level.minWaterLevel}
                          onChange={(e) =>
                            setEditingThresholds({
                              ...editingThresholds,
                              [level.level]: { ...editingThresholds[level.level], min: parseInt(e.target.value) || 0 },
                            })
                          }
                        />
                      ) : (
                        <span className="h-7 flex items-center text-xs text-[#1F2937] px-2 bg-gray-50 rounded border border-gray-100 flex-1">
                          {editingThresholds[level.level]?.min ?? level.minWaterLevel}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-300 text-xs">–</span>
                    <div className="flex items-center gap-1.5 flex-1">
                      <label className="text-[10px] text-gray-400">Max</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          className="h-7 text-xs"
                          value={editingThresholds[level.level]?.max ?? level.maxWaterLevel}
                          onChange={(e) =>
                            setEditingThresholds({
                              ...editingThresholds,
                              [level.level]: { ...editingThresholds[level.level], max: parseInt(e.target.value) || 0 },
                            })
                          }
                        />
                      ) : (
                        <span className="h-7 flex items-center text-xs text-[#1F2937] px-2 bg-gray-50 rounded border border-gray-100 flex-1">
                          {editingThresholds[level.level]?.max === 999 ? '∞' : (editingThresholds[level.level]?.max ?? level.maxWaterLevel)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">cm</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Protocols Modal */}
      <AnimatePresence>
        {viewingProtocol && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setViewingProtocol(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                  onClick={() => setViewingProtocol(null)}
                  className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-100 text-gray-400"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: viewingProtocol.color }}
                  >
                    {viewingProtocol.level}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F2937]">{viewingProtocol.name} Protocols</h3>
                    <p className="text-xs text-gray-500">{viewingProtocol.risk} Risk • {viewingProtocol.action}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {viewingProtocol.protocols.map((protocol: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: viewingProtocol.color }}
                      />
                      {protocol}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}