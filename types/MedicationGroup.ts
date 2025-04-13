export interface MedicationGroup {
    id: string;
    name: string;
    details: string;
    startDate: string; // format: "yyyy-MM-dd"
    endDate: string;   // format: "yyyy-MM-dd"
    times: string[];   // format: ["08:00", "22:00"]
    scheduleType?: "daily" | "custom"; // Optional for future flexibility
    createdAt: string; // ISO string
  }