// src/lib/types/index.ts (zaten varsa, ekle)
export type Device = {
  id: number;
  name: string;
  ip: string;
  os: string;
  status: 'online' | 'offline' | 'warning';
  risk: 'low' | 'medium' | 'high';
  cpu: number;
  memory: number;
  lastSeen: number;
};