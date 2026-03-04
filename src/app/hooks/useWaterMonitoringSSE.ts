import { useEffect, useRef, useState } from 'react';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface WaterMonitoringRecord {
  id: string;
  waterLevel: number;
  waterLevelUnit: string;
  alertLevel: number;
  rainfallIndicator: string;
  deviceStatus: string;
  notes: string;
  timestamp: string;
}

interface SSEMessage {
  type: 'connected' | 'update';
  message?: string;
  data?: WaterMonitoringRecord;
}

export function useWaterMonitoringSSE(onUpdate: (record: WaterMonitoringRecord) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Create EventSource connection
    const eventSource = new EventSource(`${API_BASE_URL.replace('/api', '')}/api/sse/water-monitoring`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE Connected');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const message: SSEMessage = JSON.parse(event.data);
        
        if (message.type === 'connected') {
          console.log('SSE:', message.message);
        } else if (message.type === 'update' && message.data) {
          console.log('New water monitoring record:', message.data);
          onUpdate(message.data);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setIsConnected(false);
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
      }
    };
  }, [onUpdate]);

  return { isConnected };
}
