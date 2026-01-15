import { Product } from '@/types';

// Export categories and cities for AI services
export const categories = [
  'Fresh Produce',
  'Clothing & Textiles',
  'Electronics',
  'Handcrafts',
  'Food & Beverages',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Outdoors',
  'Books & Media',
  'Automotive',
  'Business Services',
  'Education'
];

export const cities = [
  'Blantyre',
  'Lilongwe',
  'Mzuzu',
  'Zomba',
  'Kasungu',
  'Mangochi',
  'Salima',
  'Dedza',
  'Karonga',
  'Nsanje',
  'Nkhata Bay',
  'Balaka'
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Organic Mangoes",
    description: "Sweet and juicy mangoes harvested from local farms in Salima. Perfect for smoothies and desserts.",
    price: 100,
    category: "Fresh Produce",
    images: [
      {
        id: "img1-1",
        productId: "1",
        image: "/prod/Mango.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-15"
      }
    ],
    businessName: "Salima Fresh Farms",
    businessId: "b1",
    location: { city: "Salima", lat: -13.7833, lng: 34.4583 },
    rating: 4.8,
    reviewCount: 124,
    dateAdded: "2024-01-15",
  },
  {
    id: "2",
    name: "Chitenje Fabric",
    description: "Beautiful traditional Malawian fabric with vibrant patterns. 6 yards per piece.",
    price: 8500,
    category: "Clothing & Textiles",
    images: [
      {
        id: "img2-1",
        productId: "2",
        image: "/prod/Chitenje.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-10"
      }
    ],
    businessName: "Mama Grace Textiles",
    businessId: "b2",
    location: { city: "Blantyre", lat: -15.7861, lng: 35.0058 },
    rating: 4.9,
    reviewCount: 89,
    dateAdded: "2024-01-10",
  },
  {
    id: "3",
    name: "Wooden Carved Giraffe",
    description: "Hand-carved African giraffe sculpture made from local mahogany wood. Perfect home decor.",
    price: 15000,
    category: "Handcrafts",
    images: [
      {
        id: "img3-1",
        productId: "3",
        image: "/prod/gi.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-08"
      }
    ],
    businessName: "Lilongwe Crafts Co.",
    businessId: "b3",
    location: { city: "Lilongwe", lat: -13.9626, lng: 33.7741 },
    rating: 4.7,
    reviewCount: 56,
    dateAdded: "2024-01-08",
  },
  {
    id: "4",
    name: "Chambo Fish (Fresh)",
    description: "Premium quality fresh Chambo fish from Lake Malawi. Traditional delicacy packed with protein.",
    price: 4500,
    category: "Food & Beverages",
    images: [
      {
        id: "img4-1",
        productId: "4",
        image: "/prod/Chambo.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-12"
      }
    ],
    businessName: "Madeco Fisheries",
    businessId: "b4",
    location: { city: "Mangochi", lat: -14.4667, lng: 35.2667 },
    rating: 4.6,
    reviewCount: 203,
    dateAdded: "2024-01-12",
  },
  {
    id: "5",
    name: "Organic Honey (250Ml)",
    description: "Pure natural honey harvested from Zomba Plateau. No additives, raw and unprocessed.",
    price: 6000,
    category: "Food & Beverages",
    images: [
      {
        id: "img5-1",
        productId: "5",
        image: "/prod/hun.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-14"
      }
    ],
    businessName: "Zomba Bee Keepers",
    businessId: "b5",
    location: { city: "Zomba", lat: -15.3833, lng: 35.3167 },
    rating: 4.9,
    reviewCount: 167,
    dateAdded: "2024-01-14",
  },
  {
    id: "6",
    name: "Solar Phone Charger",
    description: "Portable solar charger perfect for rural areas. Charges 2 phones simultaneously.",
    price: 12000,
    category: "Electronics",
    images: [
      {
        id: "img6-1",
        productId: "6",
        image: "/prod/Solar.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-11"
      }
    ],
    businessName: "Green Tech Malawi",
    businessId: "b6",
    location: { city: "Lilongwe", lat: -13.9626, lng: 33.7741 },
    rating: 4.5,
    reviewCount: 78,
    dateAdded: "2024-01-11",
  },
  {
    id: "7",
    name: "Shea Butter Cream",
    description: "Natural shea butter moisturizing cream. Locally made with Malawian shea nuts.",
    price: 3500,
    category: "Health & Beauty",
    images: [
      {
        id: "img7-1",
        productId: "7",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=300&fit=crop",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-09"
      }
    ],
    businessName: "Natural Beauty MW",
    businessId: "b7",
    location: { city: "Blantyre", lat: -15.7861, lng: 35.0058 },
    rating: 4.7,
    reviewCount: 92,
    dateAdded: "2024-01-09",
  },
  {
    id: "8",
    name: "Bamboo Storage Baskets",
    description: "Set of 3 handwoven bamboo baskets. Perfect for kitchen or living room storage.",
    price: 7500,
    category: "Home & Garden",
    images: [
      {
        id: "img8-1",
        productId: "8",
        image: "/prod/Bamboo.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-13"
      }
    ],
    businessName: "Eco Crafts Malawi",
    businessId: "b8",
    location: { city: "Mzuzu", lat: -11.4658, lng: 34.0207 },
    rating: 4.8,
    reviewCount: 45,
    dateAdded: "2024-01-13",
  },
  {
    id: "9",
    name: "Fresh Tomatoes (5kg)",
    description: "Farm-fresh tomatoes from Dedza highlands. Organic and pesticide-free.",
    price: 3000,
    category: "Fresh Produce",
    images: [
      {
        id: "img9-1",
        productId: "9",
        image: "/prod/Tomato.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-16"
      }
    ],
    businessName: "Dedza Fresh",
    businessId: "b9",
    location: { city: "Lilongwe", lat: -13.9626, lng: 33.7741 },
    rating: 4.6,
    reviewCount: 156,
    dateAdded: "2024-01-16",
  },
  {
    id: "10",
    name: "Handmade Leather Sandals",
    description: "Traditional Malawian leather sandals. Comfortable and durable for everyday wear.",
    price: 5500,
    category: "Clothing & Textiles",
    images: [
      {
        id: "img10-1",
        productId: "10",
        image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=300&fit=crop",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-07"
      }
    ],
    businessName: "Blantyre Leather Works",
    businessId: "b10",
    location: { city: "Blantyre", lat: -15.7861, lng: 35.0058 },
    rating: 4.4,
    reviewCount: 67,
    dateAdded: "2024-01-07",
  },
  {
    id: "11",
    name: "Macadamia Nuts (500g)",
    description: "Premium roasted macadamia nuts from Thyolo estates. Lightly salted.",
    price: 8000,
    category: "Food & Beverages",
    images: [
      {
        id: "img11-1",
        productId: "11",
        image: "/prod/Macadamia.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-17"
      }
    ],
    businessName: "Thyolo Nuts Co.",
    businessId: "b11",
    location: { city: "Blantyre", lat: -15.7861, lng: 35.0058 },
    rating: 4.9,
    reviewCount: 234,
    dateAdded: "2024-01-17",
  },
  {
    id: "12",
    name: "Clay Cooking Pot",
    description: "Traditional clay pot for authentic Malawian cooking. Adds unique flavor to nsima.",
    price: 4000,
    category: "Home & Garden",
    images: [
      {
        id: "img12-1",
        productId: "12",
        image: "/prod/Clay.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2024-01-06"
      }
    ],
    businessName: "Dedza Pottery",
    businessId: "b12",
    location: { city: "Lilongwe", lat: -13.9626, lng: 33.7741 },
    rating: 4.8,
    reviewCount: 89,
    dateAdded: "2024-01-06",
  },
  {
    id: "13",
    name: "Mandasi (Fried Dough)",
    description: "Freshly fried mandasi — fluffy and sweet. Perfect for breakfast or snacks.",
    price: 200,
    category: "Food & Beverages",
    images: [
      {
        id: "img13-1",
        productId: "13",
        image: "/prod/Mandasi.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-05"
      }
    ],
    businessName: "Street Bakes",
    businessId: "b13",
    location: { city: "Blantyre", lat: -15.7861, lng: 35.0058 },
    rating: 4.6,
    reviewCount: 34,
    dateAdded: "2026-01-05",
  },
  {
    id: "15",
    name: "Fresh Vegetables (Assorted)",
    description: "Locally grown assorted vegetables — tomatoes, onions, greens. Sold per kg.",
    price: 500,
    category: "Fresh Produce",
    images: [
      {
        id: "img15-1",
        productId: "15",
        image: "/prod/Veg.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-05"
      }
    ],
    businessName: "Green Valley Farm",
    businessId: "b15",
    location: { city: "Salima", lat: -13.7833, lng: 34.4583 },
    rating: 4.7,
    reviewCount: 58,
    dateAdded: "2026-01-05",
  },
  {
    id: "16",
    name: "Phone Cases",
    description: "Durable phone cases for popular smartphone models. Multiple colours available.",
    price: 5000,
    category: "Electronics",
    images: [
      {
        id: "img16-1",
        productId: "16",
        image: "/prod/Case.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-05"
      }
    ],
    businessName: "CaseWorks",
    businessId: "b16",
    location: { city: "Lilongwe", lat: -13.9626, lng: 33.7741 },
    rating: 4.3,
    reviewCount: 22,
    dateAdded: "2026-01-05",
  },
  {
    id: "17",
    name: "Bananas (1 bunch)",
    description: "Fresh ripe bananas from local farms — sweet and ready to eat.",
    price: 600,
    category: "Fresh Produce",
    images: [
      {
        id: "img17-1",
        productId: "17",
        image: "/prod/Banana.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-05"
      }
    ],
    businessName: "Dedza Orchards",
    businessId: "b17",
    location: { city: "Dedza", lat: -14.3500, lng: 34.3000 },
    rating: 4.5,
    reviewCount: 41,
    dateAdded: "2026-01-05",
  },
  {
    id: "18",
    name: "Fresh Chicken (per kg)",
    description: "Locally reared chicken, cleaned and ready for cooking.",
    price: 5500,
    category: "Food & Beverages",
    images: [
      {
        id: "img18-1",
        productId: "18",
        image: "/prod/Chick.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-05"
      }
    ],
    businessName: "Poultry Farm MW",
    businessId: "b18",
    location: { city: "Mangochi", lat: -14.4667, lng: 35.2667 },
    rating: 4.6,
    reviewCount: 77,
    dateAdded: "2026-01-05",
  },
  {
    id: "19",
    name: "Chapati (per piece)",
    description: "Soft chapati made fresh daily — great with stews and sauces.",
    price: 150,
    category: "Food & Beverages",
    images: [
      {
        id: "img19-1",
        productId: "19",
        image: "/prod/Chapati.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-05"
      }
    ],
    businessName: "Home Bakes",
    businessId: "b19",
    location: { city: "Karonga", lat: -9.9333, lng: 33.9333 },
    rating: 4.2,
    reviewCount: 9,
    dateAdded: "2026-01-05",
  },
  {
    id: "20",
    name: "Oranges (1kg)",
    description: "Sweet oranges perfect for juice and snacks.",
    price: 1700,
    category: "Fresh Produce",
    images: [
      {
        id: "img20-1",
        productId: "20",
        image: "/prod/Oranges.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-05"
      }
    ],
    businessName: "Citrus Grove",
    businessId: "b20",
    location: { city: "Kasungu", lat: -13.0167, lng: 33.4833 },
    rating: 4.6,
    reviewCount: 38,
    dateAdded: "2026-01-05",
  },
  {
    id: "21",
    name: "Apples (1kg)",
    description: "Crisp apples sourced from regional growers.",
    price: 2300,
    category: "Fresh Produce",
    images: [
      {
        id: "img21-1",
        productId: "21",
        image: "/prod/Apples.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-05"
      }
    ],
    businessName: "Highland Fruits",
    businessId: "b21",
    location: { city: "Mzuzu", lat: -11.4658, lng: 34.0207 },
    rating: 4.5,
    reviewCount: 26,
    dateAdded: "2026-01-05",
  },
  {
    id: "22",
    name: "Men's Fade Haircut",
    description: "Professional barber services including fade, trim, and styling. Walk-ins welcome.",
    price: 3000,
    category: "Beauty Services",
    images: [
      {
        id: "img22-1",
        productId: "22",
        image: "/prod/barbershop.jpeg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-18"
      }
    ],
    businessName: "Classic Cuts Barber",
    businessId: "b22",
    location: { city: "Lilongwe", lat: -13.9626, lng: 33.7741 },
    rating: 4.8,
    reviewCount: 112,
    dateAdded: "2026-01-18",
  },
  {
    id: "23",
    name: "Nail Installation",
    description: "We make your nails drop dead gorgeous",
    price: 45000,
    category: "Beauty Services",
    images: [
      {
        id: "img23-1",
        productId: "23",
        image: "prod/nails.jpg",
        imageMimeType: "image/jpeg",
        order: 0,
        createdAt: "2026-01-18"
      }
    ],
    businessName: "Mimie's Nail Bar",
    businessId: "b23",
    location: { city: "Blantyre", lat: -15.7861, lng: 35.0058 },
    rating: 4.9,
    reviewCount: 45,
    dateAdded: "2026-01-18",
  },
];

export const mockMessages = [
  {
    id: "m1",
    senderId: "b1",
    senderName: "Salima Fresh Farms",
    senderAvatar: "S",
    lastMessage: "Yes, the mangoes are still available!",
    timestamp: "2024-01-18T10:30:00",
    unread: 2,
  },
  {
    id: "m2",
    senderId: "b3",
    senderName: "Lilongwe Crafts Co.",
    senderAvatar: "L",
    lastMessage: "We can deliver to Area 47 tomorrow.",
    timestamp: "2024-01-18T09:15:00",
    unread: 0,
  },
  {
    id: "m3",
    senderId: "b5",
    senderName: "Zomba Bee Keepers",
    senderAvatar: "Z",
    lastMessage: "Thank you for your order!",
    timestamp: "2024-01-17T16:45:00",
    unread: 1,
  },
];

export const mockPosts = [
  {
    id: "c1",
    authorId: "b1",
    authorName: "Salima Fresh Farms",
    authorAvatar: "S",
    content: "Just harvested a fresh batch of mangoes! Who's interested in wholesale orders? We have Grade A quality at competitive prices. DM for bulk pricing 🥭",
    timestamp: "2026-01-04T08:00:00",
    likes: 24,
    comments: 8,
    tag: "Wholesale"
  },
  {
    id: "c2",
    authorId: "b3",
    authorName: "Lilongwe Crafts Co.",
    authorAvatar: "L",
    content: "Looking for suppliers of quality mahogany wood. We're expanding our furniture line and need reliable partners. DM if you have contacts!",
    timestamp: "2026-01-03T14:30:00",
    likes: 15,
    comments: 12,
    tag: "Suppliers"
  },
  {
    id: "c3",
    authorId: "b6",
    authorName: "Green Tech Malawi",
    authorAvatar: "G",
    content: "Great news! We're now offering bulk discounts on solar chargers for resellers. Perfect for rural markets. Up to 30% off on orders over 50 units.",
    timestamp: "2026-01-03T11:00:00",
    likes: 42,
    comments: 18,
    tag: "Opportunity"
  },
  {
    id: "c4",
    authorId: "b4",
    authorName: "Blantyre Textiles",
    authorAvatar: "B",
    content: "Question for fellow business owners: What delivery service do you use for cross-district shipping? Looking for reliable and affordable options.",
    timestamp: "2026-01-02T16:45:00",
    likes: 31,
    comments: 22,
    tag: "Question"
  },
  {
    id: "c5",
    authorId: "b5",
    authorName: "Mzuzu Honey Co.",
    authorAvatar: "M",
    content: "🎉 Milestone reached! We just completed our 500th order on MalawiMarket. Thank you to this amazing community for the support. Quality products + great platform = success!",
    timestamp: "2026-01-02T09:15:00",
    likes: 89,
    comments: 34,
    tag: "Success"
  },
  {
    id: "c6",
    authorId: "b7",
    authorName: "Zomba Coffee Roasters",
    authorAvatar: "Z",
    content: "Pro tip: Good product photos can increase your sales by 40%! I invested in a simple ring light and white background - game changer for my listings.",
    timestamp: "2026-01-01T12:00:00",
    likes: 56,
    comments: 15,
    tag: "Tips"
  },
];
