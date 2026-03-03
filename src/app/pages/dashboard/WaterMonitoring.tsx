import { useState, useEffect } from 'react';
import { getWaterMonitoring, getAlertLevelByLevel, getAlertLevels, exportToCSV, addWaterReading } from '../../utils/database';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Droplets, Download, Filter, Plus, Printer } from 'lucide-react';

export function WaterMonitoring() {
  const [readings, setReadings] = useState<any[]>([]);
  const [filteredReadings, setFilteredReadings] = useState<any[]>([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newReading, setNewReading] = useState({
    waterLevel: '',
    rainfallIndicator: 'None',
  });

  useEffect(() => {
    loadReadings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [readings, filterLevel, searchQuery]);

  const loadReadings = () => {
    const data = getWaterMonitoring().sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setReadings(data);
  };

  const applyFilters = () => {
    let filtered = [...readings];

    if (filterLevel !== 'all') {
      filtered = filtered.filter(r => r.alertLevel === parseInt(filterLevel));
    }

    if (searchQuery) {
      filtered = filtered.filter(r => 
        new Date(r.timestamp).toLocaleString().includes(searchQuery)
      );
    }

    setFilteredReadings(filtered);
  };

  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault();
    
    const waterLevel = parseFloat(newReading.waterLevel);
    
    // Dynamically determine alert level from centralized database thresholds
    const levels = getAlertLevels();
    let alertLevel = 1;
    for (const level of levels) {
      if (waterLevel >= level.minWaterLevel && waterLevel <= level.maxWaterLevel) {
        alertLevel = level.level;
        break;
      }
    }
    // If above all defined ranges, use the highest level
    if (waterLevel > Math.max(...levels.map((l: any) => l.maxWaterLevel === 999 ? 0 : l.maxWaterLevel))) {
      alertLevel = Math.max(...levels.map((l: any) => l.level));
    }

    const reading = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      waterLevel,
      waterLevelUnit: 'cm',
      alertLevel,
      rainfallIndicator: newReading.rainfallIndicator,
      deviceStatus: 'Online',
      notes: 'Manual entry',
    };

    addWaterReading(reading);
    loadReadings();
    setShowAddDialog(false);
    setNewReading({ waterLevel: '', rainfallIndicator: 'None' });
    toast.success('Reading added successfully');
  };

  const handleExport = () => {
    exportToCSV(filteredReadings, 'water-monitoring.csv');
    toast.success('Data exported successfully');
  };

  const getAlertBadge = (level: number) => {
    const alertInfo = getAlertLevelByLevel(level);
    if (!alertInfo) return null;
    
    return (
      <Badge style={{ backgroundColor: alertInfo.color, color: 'white' }}>
        Level {level} - {alertInfo.name}
      </Badge>
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="flex flex-col h-full min-h-0 gap-4 lg:overflow-hidden overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
        

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer size={16} className="mr-1.5" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} className="mr-1.5" />
            Export
          </Button>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#FF6A00] hover:bg-[#E55F00]">
                <Plus size={16} className="mr-1.5" />
                Add Reading
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Manual Reading</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddReading} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Water Level (cm) *</label>
                  <Input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={newReading.waterLevel}
                    onChange={(e) => setNewReading({ ...newReading, waterLevel: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rainfall Indicator</label>
                  <Select 
                    value={newReading.rainfallIndicator} 
                    onValueChange={(value) => setNewReading({ ...newReading, rainfallIndicator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-[#FF6A00] hover:bg-[#E55F00]">
                    Add Reading
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters + Stats — compact row */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[10px] text-gray-500 mb-1">
              <Filter size={10} className="inline mr-0.5" />
              Alert Level
            </label>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {getAlertLevels().map((level: any) => (
                  <SelectItem key={level.level} value={String(level.level)}>
                    Level {level.level} - {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[10px] text-gray-500 mb-1">Search</label>
            <Input
              type="text"
              placeholder="Search..."
              className="h-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span><span className="font-semibold text-[#1F2937]">{readings.length}</span> total</span>
            <span><span className="font-semibold text-[#1F2937]">{readings[0]?.waterLevel || 0}</span> cm latest</span>
            <span><span className="font-semibold text-[#1F2937]">{(readings.reduce((sum, r) => sum + r.waterLevel, 0) / readings.length || 0).toFixed(1)}</span> cm avg</span>
            <span><span className="font-semibold text-[#1F2937]">{Math.max(...readings.map(r => r.waterLevel), 0)}</span> cm peak</span>
          </div>
        </div>
      </div>

      {/* Readings Table — desktop only */}
      <div className="hidden lg:flex flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex-col">
        <div className="overflow-auto flex-1 min-h-0 custom-scrollbar">
          <Table className="min-w-[600px]">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Water Level</TableHead>
                <TableHead>Alert Level</TableHead>
                <TableHead>Rainfall</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReadings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No readings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReadings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>{formatDate(reading.timestamp)}</TableCell>
                    <TableCell>{formatTime(reading.timestamp)}</TableCell>
                    <TableCell className="font-semibold">
                      {reading.waterLevel} {reading.waterLevelUnit}
                    </TableCell>
                    <TableCell>{getAlertBadge(reading.alertLevel)}</TableCell>
                    <TableCell>{reading.rainfallIndicator}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Readings Cards — mobile only */}
      <div className="lg:hidden space-y-2 pb-4">
        {filteredReadings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <Droplets className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-sm text-gray-500">No readings found</p>
          </div>
        ) : (
          filteredReadings.map((reading) => {
            const alertInfo = getAlertLevelByLevel(reading.alertLevel);
            return (
              <div
                key={reading.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-3.5"
                style={{ borderLeftWidth: 4, borderLeftColor: alertInfo?.color || '#d1d5db' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(reading.timestamp)} • {formatTime(reading.timestamp)}
                  </span>
                  {getAlertBadge(reading.alertLevel)}
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Water Level</p>
                    <p className="text-lg font-bold text-[#1F2937]">{reading.waterLevel} <span className="text-xs font-normal text-gray-500">{reading.waterLevelUnit}</span></p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Rainfall</p>
                    <p className="text-sm font-medium text-[#1F2937]">{reading.rainfallIndicator}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}