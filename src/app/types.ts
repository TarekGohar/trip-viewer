export type ActivityType = string;

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  tags: string[];
  imageUrl?: string;
  userId: string;
  dailyActivities: DailyActivity[];
  generalDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyActivity {
  id: string;
  date: string;
  title: string;
  description: string;
  location: string;
  time?: string;
  notes?: string;
  tags: string[];
  tripId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  time?: string;
  notes?: string;
  tags: string[];
  date: string;
} 