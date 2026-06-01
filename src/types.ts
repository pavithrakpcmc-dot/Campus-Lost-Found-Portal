export interface User {
  id: string;
  email: string;
  name: string;
  contact: string;
  department: string;
  role: 'student' | 'admin';
  joinedAt: string;
}

export type ItemStatus = 'open' | 'claimed' | 'resolved';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  lostOrFound: 'lost' | 'found';
  imageUrl?: string;
  postedBy: string; // User ID
  postedByName: string;
  postedByEmail: string;
  contactInfo: string;
  status: ItemStatus;
  dateString: string;
  createdAt: string;
}

export interface ClaimRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage?: string;
  itemLostOrFound: 'lost' | 'found';
  ownerId: string;
  claimantId: string;
  claimantName: string;
  claimantContact: string;
  claimantDept: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const CATEGORIES = [
  'Electronics & Gadgets',
  'Keys',
  'Wallets, Cards & Cush',
  'Books & Stationery',
  'Clothing & Accessories',
  'Water Bottles & Flasks',
  'ID Cards & Documents',
  'Bags & Backpacks',
  'Other'
];

export const LOCATIONS = [
  'Main Library',
  'Central Cafeteria',
  'Engineering Block A',
  'Science Lab Building',
  'Campus Sports Complex',
  'Student Activity Center',
  'Auditorium',
  'Hostel Block 1',
  'Hostel Block 2',
  'North Lawn & Courtyard',
  'Other Campus Location'
];
