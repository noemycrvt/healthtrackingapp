export interface MedicationDose {
  id: string;
  date: string; // "yyyy-MM-dd"
  time: string; // ISO string — full datetime
  status: "pending" | "missed" | "taken" | "skipped";
  createdAt: string; // ISO string
}