import { User, Item, ClaimRequest } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    email: 'admin@campus.edu',
    name: 'Professor Vance (Admin)',
    contact: '+1 (555) 019-2831',
    department: 'Campus Security Office',
    role: 'admin',
    joinedAt: '2025-09-12T10:00:00Z'
  },
  {
    id: 'u-sarah',
    email: 'sarah@campus.edu',
    name: 'Sarah Jenkins',
    contact: '+1 (555) 014-9923',
    department: 'Mechanical Engineering',
    role: 'student',
    joinedAt: '2026-01-15T08:30:00Z'
  },
  {
    id: 'u-david',
    email: 'david@campus.edu',
    name: 'David Kim',
    contact: '+1 (555) 017-4821',
    department: 'Computer Science',
    role: 'student',
    joinedAt: '2026-02-10T14:15:00Z'
  },
  {
    id: 'u-emma',
    email: 'emma@campus.edu',
    name: 'Emma Watson',
    contact: '+1 (555) 011-3094',
    department: 'Business Administration',
    role: 'student',
    joinedAt: '2026-03-05T11:45:00Z'
  }
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-1',
    title: 'iPhone 15 Pro Max (Natural Titanium)',
    description: 'Found a silver/titanium colored iPhone 15 Pro with a translucent MagSafe case near the quiet study cubicles on the 2nd floor. It was running out of battery, so I charged it and left it with the library front counter. Please claim if yours!',
    category: 'Electronics & Gadgets',
    location: 'Main Library',
    lostOrFound: 'found',
    postedBy: 'u-sarah',
    postedByName: 'Sarah Jenkins',
    postedByEmail: 'sarah@campus.edu',
    contactInfo: '+1 (555) 014-9923 (or visit Library Desk)',
    status: 'open',
    dateString: '2026-05-28',
    createdAt: '2026-05-28T09:15:00Z'
  },
  {
    id: 'item-2',
    title: 'Brass Dorm Key with Nike Keychain',
    description: 'Lost my room key. It is on a blue Nike lanyard with a small barcode and a brass key tag marked "Room 304". Lost it somewhere between Hostel Block 1 and the Central Cafeteria around noon.',
    category: 'Keys',
    location: 'Hostel Block 1',
    lostOrFound: 'lost',
    postedBy: 'u-david',
    postedByName: 'David Kim',
    postedByEmail: 'david@campus.edu',
    contactInfo: 'david@campus.edu / text my number',
    status: 'open',
    dateString: '2026-05-29',
    createdAt: '2026-05-29T12:00:00Z'
  },
  {
    id: 'item-3',
    title: 'Brown Leather Fossil Wallet',
    description: 'I lost my Fossil bi-fold wallet. It contains my student ID card (David Kim), driver license, and a coffee stamp card. Highly valuable to me, please return if spotted!',
    category: 'Wallets, Cards & Cush',
    location: 'Central Cafeteria',
    lostOrFound: 'lost',
    postedBy: 'u-david',
    postedByName: 'David Kim',
    postedByEmail: 'david@campus.edu',
    contactInfo: '+1 (555) 017-4821',
    status: 'open',
    dateString: '2026-05-27',
    createdAt: '2026-05-27T15:30:00Z'
  },
  {
    id: 'item-4',
    title: 'Mechanics of Materials Textbook (9th Ed)',
    description: 'Found a pristine hardcover copy of Beer & Johnston Mechanics of Materials textbook left on the workbench of Room 204. It has some highlighted equations on Chapter 4. Please request a claim if it is yours!',
    category: 'Books & Stationery',
    location: 'Engineering Block A',
    lostOrFound: 'found',
    postedBy: 'u-sarah',
    postedByName: 'Sarah Jenkins',
    postedByEmail: 'sarah@campus.edu',
    contactInfo: 'sarah@campus.edu / Contact Mechanical Dept Office',
    status: 'open',
    dateString: '2026-05-26',
    createdAt: '2026-05-26T16:45:00Z'
  },
  {
    id: 'item-5',
    title: 'Hydro Flask Teal Water Bottle',
    description: 'Found a 32oz teal-colored Hydro Flask water bottle with several stickers (including a GitHub vinyl sticker and a National Parks badge) at the bleachers of the outdoor running track.',
    category: 'Water Bottles & Flasks',
    location: 'Campus Sports Complex',
    lostOrFound: 'found',
    postedBy: 'u-emma',
    postedByName: 'Emma Watson',
    postedByEmail: 'emma@campus.edu',
    contactInfo: 'emma@campus.edu',
    status: 'open',
    dateString: '2026-05-28',
    createdAt: '2026-05-28T10:00:00Z'
  }
];

export const INITIAL_CLAIMS: ClaimRequest[] = [
  {
    id: 'claim-1',
    itemId: 'item-1',
    itemTitle: 'iPhone 15 Pro Max (Natural Titanium)',
    itemLostOrFound: 'found',
    ownerId: 'u-sarah',
    claimantId: 'u-david',
    claimantName: 'David Kim',
    claimantContact: '+1 (555) 017-4821',
    claimantDept: 'Computer Science',
    message: 'Hello Sarah, I lost my natural titanium iPhone 15 Pro Max in the library quiet area yesterday around 3 PM. It has a tiny scratch on the top-left bezel and a ring fingerprint scanner on the case. Could you verify if it matches? Thank you so much!',
    status: 'pending',
    createdAt: '2026-05-29T10:30:00Z'
  }
];
