// place files you want to import through the `$lib` alias in this folder.
// src/lib/types/index.ts
export type RiskLevel = 'low' | 'medium' | 'high';

export type ProcessNode = {
  id: number;
  name: string;
  pid: number;
  x: number;
  y: number;
  risk: RiskLevel;
  isActive: boolean;
};

export type Connection = {
  from: number;
  to: number;
  threat: boolean;
};

export type TimeSeriesData = {
  timestamp: number;
  value: number;
};

export type MenuItem = {
  name: string;
  path: string;
  icon: string;
};