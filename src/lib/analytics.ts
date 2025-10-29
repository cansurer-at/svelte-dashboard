// src/lib/analytics.ts
import { writable } from 'svelte/store';

export interface Connection {
  id: number;
  from: string;
  to: string;
  traffic: string;
  risk: 'low' | 'medium' | 'high';
}

export interface Anomaly {
  id: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  time: string;
}

export const connections = writable<Connection[]>([
  { id: 1, from: 'web-server-01:nginx', to: 'laptop-john:chrome', traffic: '2.1 MB', risk: 'low' },
  { id: 2, from: 'laptop-john:ssh', to: 'db-prod-01:port22', traffic: '150 KB', risk: 'medium' },
  { id: 3, from: 'camera-hallway:udp', to: 'external:api.com', traffic: '500 KB', risk: 'high' },
  { id: 4, from: 'db-prod-01:mysql', to: 'backup-server', traffic: '1.8 GB', risk: 'low' },
  { id: 5, from: 'laptop-john:rdp', to: 'admin-pc', traffic: '320 KB', risk: 'high' },
]);

export const anomalies = writable<Anomaly[]>([
  { id: 1, type: 'Lateral Movement', severity: 'high', message: 'Suspicious traffic from camera to external API', time: '2 mins ago' },
  { id: 2, type: 'Policy Violation', severity: 'medium', message: 'Unauthorized access attempt', time: '1 hour ago' },
]);

export function addRandomAnomaly() {
  const types = ['Port Scan', 'Data Exfiltration', 'Lateral Movement', 'Brute Force'];
  const severity: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  anomalies.update(a => [...a, {
    id: Date.now(),
    type: types[Math.floor(Math.random() * types.length)],
    severity: severity[Math.floor(Math.random() * severity.length)],
    message: `Detected: ${types[Math.floor(Math.random() * types.length)]}`,
    time: 'Just now'
  }]);
}