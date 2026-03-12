
export interface Criminal {
  id: string;
  name: string;
  photoUrl: string;
  description: string;
  lastSeen?: string;
}

export interface DetectionResult {
  isCriminal: boolean;
  confidence: number;
  matchedId?: string;
  matchedName?: string;
  timestamp: number;
  screenshot?: string;
}

export interface AppState {
  isMonitoring: boolean;
  criminals: Criminal[];
  logs: DetectionResult[];
  activeAlert: DetectionResult | null;
}
