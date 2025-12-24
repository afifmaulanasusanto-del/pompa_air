
export interface SensorData {
  distance: number;       // Ultrasonic (cm)
  waterValue: number;    // Analog water sensor (0-4095)
  potValue: number;      // Threshold selector (0-4095)
  threshold: number;     // Mapped threshold
  relayState: boolean;   // Pump status
  buzzerState: boolean;  // Alarm status
  ledRed: boolean;       // Critical status
  ledGreen: boolean;     // Safe status
  timestamp: number;
}

export interface AIInsight {
  status: 'optimal' | 'warning' | 'critical';
  message: string;
  recommendations: string[];
}
