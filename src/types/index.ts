export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: ProductImage[];
  businessName: string;
  businessId: string;
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  dateAdded: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  image: string; // URL or base64 string
  imageMimeType: string;
  order: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'business';
  businessName?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tag: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface FilterState {
  search: string;
  category: string;
  city: string;
  priceRange: [number | null, number | null];
  sortBy: string;
  maxDistance: number | null;
}
