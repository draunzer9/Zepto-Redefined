export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  weight: string;
  image: string;
  unit?: string;
  isVegetarian?: boolean;
  rating?: number;
  discountPercentage?: number;
  deliveryTimeMins?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  userId: string;
  orderDate: string; // ISO date string YYYY-MM-DD
  items: OrderItem[];
  totalAmount: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

export interface User {
  userId: string;
  name: string;
  address: string;
  locationLabel: string;
}

export interface RecommendationScoreDetails {
  productId: string;
  productName: string;
  frequencyScore: number;
  recencyScore: number;
  patternConsistencyScore: number;
  dayOfWeekScore: number;
  replenishmentDueScore: number;
  cartPenalty: number;
  totalScore: number;
  medianIntervalDays: number;
  purchaseCount: number;
  lastPurchasedDate: string;
  predictedNextDate: string;
  isSaturdayPattern?: boolean;
}

export interface SmartBasketConfig {
  simulatedDate: string; // YYYY-MM-DD
  simulatedDayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  confidenceThreshold: number;
}
