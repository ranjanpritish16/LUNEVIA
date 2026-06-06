export interface TimelineTask {
  title: string;
  description: string;
  category: "Skincare" | "Haircare" | "Makeup" | "Mehendi" | "Booking";
  isCritical: boolean;
}

export interface TimelinePhase {
  phase: string;
  monthsOut: number; // e.g., 6 for "6 Months Out", 0 for "Wedding Week"
  tasks: TimelineTask[];
}

export interface TimelineResponse {
  phases: TimelinePhase[];
}
