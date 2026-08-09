import type { Product, Order, CartItem, RecommendationScoreDetails, SmartBasketConfig } from '../types';
import { PRODUCTS, DEMO_ORDER_HISTORY } from '../data/demoData';

/**
 * Calculates the median of an array of numbers.
 */
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

/**
 * Calculates days between two date strings (YYYY-MM-DD).
 */
function getDaysBetween(dateString1: string, dateString2: string): number {
  const d1 = new Date(dateString1);
  const d2 = new Date(dateString2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Main Smart Grocery Basket Recommendation Engine.
 */
export class SmartBasketEngine {
  /**
   * Generates recommended products for the current user and cart state.
   */
  public static getRecommendations(
    cart: CartItem[],
    dismissedProductIds: string[],
    config: SmartBasketConfig = {
      simulatedDate: '2026-08-08', // Default Saturday demo date
      simulatedDayOfWeek: 'Saturday',
      confidenceThreshold: 45,
    }
  ): { products: Product[]; detailsMap: Record<string, RecommendationScoreDetails> } {
    const orders: Order[] = DEMO_ORDER_HISTORY;
    const cartProductIds = new Set(cart.map((item) => item.product.id));

    // Step 1 & 2: Group historical order items by productId
    const productPurchases: Record<string, { dates: string[]; daysOfWeek: string[]; quantities: number[] }> = {};

    // Sort orders chronologically
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
    );

    for (const order of sortedOrders) {
      for (const item of order.items) {
        if (!productPurchases[item.productId]) {
          productPurchases[item.productId] = { dates: [], daysOfWeek: [], quantities: [] };
        }
        productPurchases[item.productId].dates.push(order.orderDate);
        productPurchases[item.productId].daysOfWeek.push(order.dayOfWeek);
        productPurchases[item.productId].quantities.push(item.quantity);
      }
    }

    const scoredProducts: { product: Product; details: RecommendationScoreDetails }[] = [];

    // Step 3 to 6: Calculate metrics & score for each product
    for (const product of PRODUCTS) {
      const history = productPurchases[product.id];

      // RULE 6: Do NOT recommend items purchased only once or never purchased
      if (!history || history.dates.length < 2) {
        continue;
      }

      // RULE 7 & DISMISS: Exclude if already in cart or user clicked "Not needed"
      if (cartProductIds.has(product.id) || dismissedProductIds.includes(product.id)) {
        continue;
      }

      const purchaseCount = history.dates.length;
      const lastPurchasedDate = history.dates[history.dates.length - 1];
      const daysSinceLastPurchase = getDaysBetween(lastPurchasedDate, config.simulatedDate);

      // Calculate intervals between consecutive purchases
      const intervals: number[] = [];
      for (let i = 1; i < history.dates.length; i++) {
        const interval = getDaysBetween(history.dates[i - 1], history.dates[i]);
        if (interval > 0) {
          intervals.push(interval);
        }
      }

      // RULE 16: Use median interval instead of average
      const medianInterval = calculateMedian(intervals);

      // Predict next date based on last purchase date + median interval
      const lastDateObj = new Date(lastPurchasedDate);
      lastDateObj.setDate(lastDateObj.getDate() + Math.round(medianInterval));
      const predictedNextDate = lastDateObj.toISOString().split('T')[0];

      // 1. Frequency Score (More repeat purchases = higher baseline score)
      const frequencyScore = Math.min(purchaseCount * 12, 35);

      // 2. Day of Week Match Score
      let dayOfWeekScore = 0;
      let isSaturdayPattern = false;
      const currentDayPurchases = history.daysOfWeek.filter((d) => d === config.simulatedDayOfWeek).length;
      const dayMatchRatio = currentDayPurchases / purchaseCount;

      if (config.simulatedDayOfWeek === 'Saturday' && dayMatchRatio >= 0.5) {
        isSaturdayPattern = true;
        dayOfWeekScore = 35; // Heavy boost for Saturday snack/party habits (Chips, Coke, Ice Cream)
      } else if (dayMatchRatio >= 0.4) {
        dayOfWeekScore = 20;
      }

      // 3. Replenishment Due Score & Prediction Window
      let replenishmentDueScore = 0;

      // Define prediction window around median interval
      const windowMargin = Math.max(1, Math.round(medianInterval * 0.25));
      const minDueDays = medianInterval - windowMargin;
      const maxDueDays = medianInterval + windowMargin + 2;

      if (daysSinceLastPurchase >= minDueDays && daysSinceLastPurchase <= maxDueDays) {
        // Peak window score!
        replenishmentDueScore = 40;
      } else if (daysSinceLastPurchase > maxDueDays && daysSinceLastPurchase <= maxDueDays + 7) {
        // Slightly overdue
        replenishmentDueScore = 25;
      } else if (daysSinceLastPurchase < minDueDays && daysSinceLastPurchase >= minDueDays - 2) {
        // Approaching window
        replenishmentDueScore = 15;
      }

      // 4. Pattern Consistency Score (Low variance in intervals = higher score)
      let patternConsistencyScore = 10;
      if (intervals.length >= 3) {
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);
        if (stdDev <= 2.5) {
          patternConsistencyScore = 20; // Extremely consistent cycle (e.g. Eggs every 4-5 days)
        } else if (stdDev <= 5) {
          patternConsistencyScore = 12;
        }
      }

      // 5. Recency penalty if purchased VERY recently (e.g. yesterday)
      let recencyScore = 10;
      if (daysSinceLastPurchase < 2 && medianInterval > 3) {
        recencyScore = -30; // Customer just bought it yesterday, unlikely to need it today
      }

      // Cart Penalty
      const cartPenalty = cartProductIds.has(product.id) ? 100 : 0;

      // Calculate Total Recommendation Score
      const totalScore =
        frequencyScore +
        recencyScore +
        patternConsistencyScore +
        dayOfWeekScore +
        replenishmentDueScore -
        cartPenalty;

      const scoreDetails: RecommendationScoreDetails = {
        productId: product.id,
        productName: product.name,
        frequencyScore,
        recencyScore,
        patternConsistencyScore,
        dayOfWeekScore,
        replenishmentDueScore,
        cartPenalty,
        totalScore,
        medianIntervalDays: medianInterval,
        purchaseCount,
        lastPurchasedDate,
        predictedNextDate,
        isSaturdayPattern,
      };

      if (totalScore >= config.confidenceThreshold) {
        scoredProducts.push({ product, details: scoreDetails });
      }
    }

    // Sort recommendations by highest score first
    scoredProducts.sort((a, b) => b.details.totalScore - a.details.totalScore);

    const products = scoredProducts.map((item) => item.product);
    const detailsMap: Record<string, RecommendationScoreDetails> = {};
    scoredProducts.forEach((item) => {
      detailsMap[item.product.id] = item.details;
    });

    return { products, detailsMap };
  }
}
