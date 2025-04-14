export interface MedicationGroup {
    id: string;
    name: string;
    details: string;
    startDate: string; // format: "yyyy-MM-dd"
    endDate: string | null;   // format: "yyyy-MM-dd"
    times: string[];   // format: ["08:00", "22:00"]
    createdAt: string; // ISO string
    repeatDays: number[]; // e.g. [1, 3, 5] for Mon, Wed, Fri
  }