import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { alertLevelsAPI } from '../../utils/api';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [levels, current] = await Promise.all([
        alertLevelsAPI.getAll(),
        alertLevelsAPI.getCurrent(),
      ]);
      setAlertLevels(levels);
      setCurrentAlert(current);
      const thresholds: Record<number, { min: number; max: number }> = {};
      levels.forEach((l: any) => {
        thresholds[l.level] = { min: l.minWaterLevel, max: l.maxWaterLevel };
      });
      setEditingThresholds(thresholds);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load alert levels');
    } finally {
      setLoading(false);
    }
  };

  const getAffectedLevels = (level: number): string[] => {
    const affected: string[] = [];
    const current = editingThresholds[level];
    const original = alertLevels.find(l => l.level === level);
    
    if (!original) return affected;

    // Check if max changed and affects next level
    if (level < 4 && current.max !== original.maxWaterLevel) {
      const expectedNextMin = current.max + 1;
      const nextLevel = editingThresholds[level + 1];
      if (nextLevel.min !== expectedNextMin) {
        affected.push(`Level ${level + 1} min → ${expectedNextMin} cm`);
      }
    }

    // Check if min changed and affects previous level
    if (level > 1 && current.min !== original.minWaterLevel) {
      const expectedPrevMax = current.min - 1;
      const prevLevel = editingThresholds[level - 1];
      if (prevLevel.max !== expectedPrevMax) {
        affected.push(`Level ${level - 1} max → ${expectedPrevMax} cm`);
      }
    }

    return affected;
  };

  const validateThresholds = (level: number): { valid: boolean; message?: string } => {
    const t = editingThresholds[level];
    
    // Check if min >= max
    if (t.min >= t.max && t.max !== 999) {
      return { valid: false, message: 'Min level must be less than max level' };
    }

    // Level 1 (Safe - farthest distance) max must always be 999 (infinity)
    if (level === 1 && t.max !== 999) {
      return { valid: false, message: 'Level 1 (Safe) must extend to infinity (999)' };
    }

    // Level 4 (Danger - closest distance) min must always be 0
    if (level === 4 && t.min !== 0) {
      return { valid: false, message: 'Level 4 (Danger) must start at 0' };
    }

    return { valid: true };
  };

  const handleThresholdChange = (level: number, field: 'min' | 'max', value: number) => {
    const newThresholds = { ...editingThresholds };
    newThresholds[level] = { ...newThresholds[level], [field]: value };

    // Auto-adjust adjacent levels to maintain continuity
    if (field === 'max' && level < 4) {
      // When max changes, adjust next level's min
      newThresholds[level + 1] = {
        ...newThresholds[level + 1],
        min: value + 1
      };
    }

    if (field === 'min' && level > 1) {
      // When min changes, adjust previous level's max
      newThresholds[level - 1] = {
        ...newThresholds[level - 1],
        max: value - 1
      };
    }

    setEditingThresholds(newThresholds);
  };

  const handleSaveThreshold = async (level: number) => {
    const validation = validateThresholds(level);
    if (!validation.valid) {
      toast.error(validation.message || 'Invalid threshold values');
      return;
    }

    try {
      setLoading(true);
      
      // Collect all levels that need to be updated
      const levelsToUpdate: Array<{ level: number; data: any }> = [];
      
      // Add the current level
      const t = editingThresholds[level];
      levelsToUpdate.push({
        level,
        data: { minWaterLevel: t.min, maxWaterLevel: t.max }
      });

      // Check and add affected previous level
      if (level > 1) {
        const original = alertLevels.find(l => l.level === level);
        if (original && t.min !== original.minWaterLevel) {
          const prevT = editingThresholds[level - 1];
          levelsToUpdate.push({
            level: level - 1,
            data: { minWaterLevel: prevT.min, maxWaterLevel: prevT.max }
          });
        }
      }

      // Check and add affected next level
      if (level < 4) {
        const original = alertLevels.find(l => l.level === level);
        if (original && t.max !== original.maxWaterLevel) {
          const nextT = editingThresholds[level + 1];
          levelsToUpdate.push({
            level: level + 1,
            data: { minWaterLevel: nextT.min, maxWaterLevel: nextT.max }
          });
        }
      }

      // Update all affected levels
      await Promise.all(
        levelsToUpdate.map(({ level: lvl, data }) => 
          alertLevelsAPI.update(lvl, data)
        )
      );

      const message = levelsToUpdate.length > 1 
        ? `Updated ${levelsToUpdate.length} alert levels and recalculated all water monitoring records`
        : `Level ${level} thresholds updated and all water monitoring records recalculated`;
      
      toast.success(message);
      setEditingLevelId(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update threshold');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRecalculate = async () => {
    try {
      setLoading(true);
      await alertLevelsAPI.recalculate();
      toast.success('All water monitoring records recalculated successfully');
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to recalculate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* Header with recalculate button */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Alert Levels</h1>
          <p className="text-sm text-gray-600">Manage flood alert thresholds</p>
        </div>
        <Button 
          onClick={handleManualRecalculate} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <AlertTriangle className="mr-2" size={16} />
          Recalculate All Records
        </Button>
      </div>

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
            const isBeingEdited = editingLevelId === alert.level;
            const willBeAffected = editingLevelId && getAffectedLevels(editingLevelId).some(msg => 
              msg.includes(`Level ${alert.level}`)
            );

            return (
              <div
                key={alert.level}
                className={`bg-white rounded-xl shadow-sm overflow-hidden border transition-all flex flex-col ${
                  isActive ? 'ring-2 shadow-md' : 
                  isBeingEdited ? 'ring-2 ring-blue-300 shadow-md' :
                  willBeAffected ? 'ring-2 ring-amber-300 shadow-md' :
                  'hover:shadow-md'
                }`}
                style={{
                  borderColor: isActive ? alert.color : 
                              isBeingEdited ? '#93c5fd' :
                              willBeAffected ? '#fcd34d' :
                              '#e5e7eb',
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
                    {isBeingEdited && (
                      <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                        Editing
                      </span>
                    )}
                    {willBeAffected && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                        Will adjust
                      </span>
                    )}
                  </div>

                  {/* Water range */}
                  <div className="flex items-center gap-1.5 text-xs bg-gray-50 rounded-lg px-2.5 py-1.5 mb-2">
                    <Droplets size={12} className="text-blue-400" />
                    <span className="text-gray-600">
                      {willBeAffected ? (
                        <>
                          <span className="line-through opacity-50">
                            {alert.minWaterLevel} – {alert.maxWaterLevel === 999 ? '∞' : alert.maxWaterLevel}
                          </span>
                          {' → '}
                          <span className="font-semibold text-amber-700">
                            {editingThresholds[alert.level]?.min} – {editingThresholds[alert.level]?.max === 999 ? '∞' : editingThresholds[alert.level]?.max}
                          </span>
                        </>
                      ) : isBeingEdited ? (
                        <span className="font-semibold text-blue-700">
                          {editingThresholds[alert.level]?.min} – {editingThresholds[alert.level]?.max === 999 ? '∞' : editingThresholds[alert.level]?.max}
                        </span>
                      ) : (
                        <>
                          {alert.minWaterLevel} – {alert.maxWaterLevel === 999 ? '∞' : alert.maxWaterLevel}
                        </>
                      )} cm
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
          <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-[#FF6A00]" size={14} />
              </div>
              <h2 className="font-bold text-[#1F2937] text-sm">Threshold Config</h2>
            </div>
            <p className="text-[10px] text-gray-500 ml-9">
              ⚡ Ultrasonic sensor: Lower distance = water closer (danger), Higher distance = water farther (safe)
            </p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
            {alertLevels.map((level) => {
              const isEditing = editingLevelId === level.level;
              const validation = isEditing ? validateThresholds(level.level) : { valid: true };
              const affectedByEditing = editingLevelId ? getAffectedLevels(editingLevelId) : [];
              const isAffected = affectedByEditing.some(msg => msg.includes(`Level ${level.level}`));
              const affectedLevels = isEditing ? getAffectedLevels(level.level) : [];
              
              return (
                <div key={level.level} className="px-4 py-3 space-y-2">
                  {/* Level header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isEditing ? 'animate-pulse' : ''
                        }`}
                        style={{ backgroundColor: level.color }}
                      />
                      <span className="text-xs font-medium text-[#1F2937]">
                        Level {level.level}: {level.name}
                      </span>
                      {isAffected && !isEditing && (
                        <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                          Will update
                        </span>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleSaveThreshold(level.level)}
                          size="sm"
                          disabled={!validation.valid || loading}
                          className="h-6 text-[10px] px-2 bg-[#FF6A00] hover:bg-[#E55F00] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save size={10} className="mr-0.5" />
                          {loading ? 'Saving...' : 'Save'}
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
                          disabled={loading}
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
                        disabled={loading}
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
                          min="0"
                          className={`h-7 text-xs ${
                            !validation.valid ? 'border-red-300 focus:ring-red-500' : ''
                          }`}
                          value={editingThresholds[level.level]?.min ?? level.minWaterLevel}
                          onChange={(e) => {
                            const newMin = parseInt(e.target.value) || 0;
                            handleThresholdChange(level.level, 'min', newMin);
                          }}
                          disabled={level.level === 4}
                          placeholder={level.level === 4 ? '0 (fixed)' : ''}
                        />
                      ) : (
                        <span className="h-7 flex items-center text-xs text-[#1F2937] px-2 bg-gray-50 rounded border border-gray-100 flex-1">
                          {editingThresholds[level.level]?.min ?? level.minWaterLevel}
                          {isAffected && editingThresholds[level.level]?.min !== level.minWaterLevel && (
                            <span className="ml-1.5 text-[9px] text-amber-600">(auto-adjusted)</span>
                          )}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-300 text-xs">–</span>
                    <div className="flex items-center gap-1.5 flex-1">
                      <label className="text-[10px] text-gray-400">Max</label>
                      {isEditing ? (
                        level.level === 1 ? (
                          <span className="h-7 flex items-center text-xs text-[#1F2937] px-2 bg-gray-50 rounded border border-gray-100 flex-1">
                            ∞
                          </span>
                        ) : (
                          <Input
                            type="number"
                            min="1"
                            className={`h-7 text-xs ${
                              !validation.valid ? 'border-red-300 focus:ring-red-500' : ''
                            }`}
                            value={editingThresholds[level.level]?.max ?? level.maxWaterLevel}
                            onChange={(e) => {
                              const newMax = parseInt(e.target.value) || 0;
                              handleThresholdChange(level.level, 'max', newMax);
                            }}
                          />
                        )
                      ) : (
                        <span className="h-7 flex items-center text-xs text-[#1F2937] px-2 bg-gray-50 rounded border border-gray-100 flex-1">
                          {editingThresholds[level.level]?.max === 999 ? '∞' : (editingThresholds[level.level]?.max ?? level.maxWaterLevel)}
                          {isAffected && editingThresholds[level.level]?.max !== level.maxWaterLevel && (
                            <span className="ml-1.5 text-[9px] text-amber-600">(auto-adjusted)</span>
                          )}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">cm</span>
                  </div>

                  {/* Helper text when editing */}
                  {isEditing && (
                    <>
                      {!validation.valid ? (
                        <div className="bg-red-50 border border-red-200 rounded-md px-2 py-1.5 mt-1">
                          <p className="text-[10px] text-red-700">
                            {validation.message}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border border-blue-100 rounded-md px-2 py-1.5 mt-1">
                          <p className="text-[10px] text-blue-700">
                            {level.level === 1 && "Level 1 (Safe) always extends to infinity (far distance). Changing min will auto-adjust Level 2 max."}
                            {level.level === 4 && "Level 4 (Danger) always starts at 0 (close distance). Changing max will auto-adjust Level 3 min."}
                            {level.level > 1 && level.level < 4 && (
                              "Changes will auto-adjust adjacent levels to maintain continuity (no gaps/overlaps)."
                            )}
                          </p>
                        </div>
                      )}
                      
                      {affectedLevels.length > 0 && validation.valid && (
                        <div className="bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5 mt-1">
                          <p className="text-[10px] text-amber-800 font-medium mb-0.5">
                            📝 Adjacent levels will be adjusted:
                          </p>
                          <ul className="text-[10px] text-amber-700 space-y-0.5 ml-3">
                            {affectedLevels.map((msg, idx) => (
                              <li key={idx}>• {msg}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
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