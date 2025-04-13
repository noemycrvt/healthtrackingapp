export interface RecurringMedication {
    id: string;
    name: string;
    dosage: string;
    time: string; // e.g. "08:00"
    repeatDays: number[]; // 0=Sunday ... 6=Saturday
    instructions?: string;
  }
  