export interface MedicationDose {
    id: string;
    name: string;
    details: string;
    time: string; // formatted "HH:mm"
    repeatDays: number[]; // 0 = Sunday ... 6 = Saturday
  }