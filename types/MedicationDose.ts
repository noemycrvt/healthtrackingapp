export interface MedicationDose {
  id: string;
  date: string; // "yyyy-MM-dd"
  time: string; // ISO string — full datetime
  status: "pending" | "taken" | "missed";
  createdAt: string; // ISO string
}