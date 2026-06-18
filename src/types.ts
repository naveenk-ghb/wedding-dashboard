export interface RsvpSubmission {
  id: string;
  name: string;
  email: string;
  attendance: 'yes' | 'no';
  eventsSelected: string[]; // e.g. ['sangeet', 'wedding', 'reception']
  guestsCount: number;
  dietaryPreference: string; // 'veg' | 'non-veg' | 'jain' | 'other'
  shuttleRequest: boolean;
  shuttleDetails?: string;
  notes?: string;
  submittedAt: string;
}

export interface GuestWish {
  id: string;
  name: string;
  relationship: string; // e.g. 'Friend', 'Family', 'Colleague'
  message: string;
  createdAt: string;
  likesCount: number;
  tags?: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  iconName: string; // 'music' | 'rings' | 'glass' | 'sparkles'
  dressCode: string;
  mapEmbedUrl: string;
}
