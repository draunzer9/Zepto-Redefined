# Zepto Smart Grocery Basket – Lovable Feature Prompt

## Feature Request: AI/Algorithm-Generated Smart Grocery Basket

I already have a Zepto-style grocery delivery website built in Lovable with the existing shopping, product browsing, cart, checkout, search, categories, etc.

**Do NOT redesign or remove any existing features. Do NOT rebuild the existing website from scratch.**

Add one new major feature:

# SMART GROCERY BASKET

The purpose of this feature is to analyze each customer's previous ordering behavior and intelligently predict which grocery items they may have forgotten to order in their current shopping session.

The feature should feel like an intelligent personal grocery assistant.

---

## 1. CORE USER EXPERIENCE

Every time a customer is shopping and is about to complete an order, show a **Smart Grocery Basket** recommendation.

The feature should appear as a prominent but non-intrusive card/modal/drawer above the cart or before checkout.

Title:

**🛒 Your Smart Grocery Basket**

Subtitle:

**"Don't forget your essentials"**

The system should analyze the customer's historical orders and generate personalized recommendations.

The recommendations MUST be based on the customer's actual previous ordering patterns, not generic recommendations.

---

## 2. HOW THE PREDICTION SHOULD WORK

Create an algorithm that analyzes:

- Product purchased
- Number of times purchased
- Quantity purchased
- Date of purchase
- Day of week
- Time between purchases
- Purchase frequency
- Recent purchase history
- Whether the product is currently present in the cart
- Whether the product was recently purchased

The algorithm should identify recurring purchasing patterns.

### Example: Every 4–5 Days

If a customer purchased eggs on:

- Jan 1
- Jan 5
- Jan 10
- Jan 15
- Jan 20

The system should recognize that eggs are purchased approximately every 4–5 days.

When the customer shops around Jan 24–25, recommend eggs.

The UI should only show:

**🥚 Eggs**  
₹120  
**[ + Add ]**

Do not display the prediction interval or explanation to the customer.

---

## 3. DAY-OF-WEEK PATTERN

The algorithm should detect weekly patterns.

Example:

Customer's history:

- Saturday: Chips, Coke, Ice Cream
- Saturday: Chips, Coke, Ice Cream
- Saturday: Chips, Coke
- Saturday: Chips, Coke, Ice Cream

If the customer is shopping on a Saturday, the Smart Grocery Basket should detect this pattern.

Show:

### Your Smart Grocery Basket

🥔 Chips  
🥤 Coke  
🍦 Ice Cream

Each product should have:

**[ + Add ]**

Do not explain that these are Saturday purchases.

---

## 4. MONTHLY PATTERN

The system should identify monthly purchases.

Example:

Customer orders garbage bags around:

- June 1
- July 3
- August 2
- September 4

The system should identify approximately a 30–35 day purchasing cycle.

When the user reaches the predicted replenishment window, show:

**🗑️ Garbage Bags**  
₹99  
**[ + Add ]**

Do not display the 30–35 day pattern to the customer.

---

## 5. MULTIPLE FREQUENCY PATTERNS

The algorithm must support different purchasing frequencies:

- Every few days
- Every 4–5 days
- Weekly
- Weekend/day-of-week pattern
- Biweekly
- Monthly
- Other recurring intervals

Examples:

- Milk → every 3 days
- Eggs → every 4–5 days
- Bread → every 7 days
- Chips → usually Saturday
- Coke → usually Saturday
- Cleaning products → every 14 days
- Garbage bags → every 30–35 days

If there is no reliable pattern, do NOT recommend the product.

---

## 6. DO NOT RECOMMEND ITEMS INCORRECTLY

Do NOT simply recommend products because they are popular.

Do NOT recommend products that the user has purchased only once.

Only recommend an item when there is enough historical evidence to identify a meaningful pattern.

Example:

- If user bought Coke only once → DO NOT recommend Coke.
- If user bought Coke 8 Saturdays out of the last 10 Saturdays → recommend Coke on Saturday.
- If user purchased garbage bags 4 times with approximately 30–35 day intervals → recommend garbage bags around the predicted date.

---

## 7. CURRENT CART AWARENESS

The Smart Grocery Basket must check the customer's current cart.

If the user has already added an item, DO NOT recommend it again.

Example:

If the user already has Eggs in the cart, Eggs should not appear in Smart Grocery Basket.

---

## 8. SIMPLIFIED SMART BASKET UI

The Smart Grocery Basket should look like a simple personalized shopping section.

### 🛒 Smart Grocery Basket

**"Don't forget your essentials"**

Display recommended products as clean product cards.

Each card should contain ONLY:

- Product image
- Product name
- Price
- Add button

Example:

**🥚 Eggs**  
₹120  
**[ + Add ]**

**🥤 Coke**  
₹45  
**[ + Add ]**

**🗑️ Garbage Bags**  
₹99  
**[ + Add ]**

At the bottom:

**[ Add All ]**

---

## 9. NO PERSONALIZED EXPLANATIONS

Completely remove personalized explanations from the customer-facing UI.

Do NOT show:

- "You usually buy this every 4–5 days"
- "You usually buy this on Saturdays"
- "You usually buy this every 30–35 days"
- "Purchased weekly"
- "Based on your previous orders"
- Prediction dates
- Confidence percentages
- "Why we recommend this"

The prediction logic should happen completely behind the scenes.

The customer should only see:

**Product → Price → Add button**

The intelligence should remain invisible.

---

## 10. KEEP THE INTELLIGENCE INVISIBLE

The recommendation engine should still:

- Analyze historical orders
- Identify frequently purchased products
- Identify weekly patterns
- Identify Saturday/Sunday patterns
- Identify 4–5 day purchase cycles
- Identify 30–35 day purchase cycles
- Calculate predicted replenishment dates
- Calculate recommendation confidence
- Check whether an item is already in the cart
- Exclude products without sufficient purchase history
- Learn from Add/Dismiss behavior

None of this reasoning should be displayed to the customer.

The experience should simply feel like:

> "Zepto already knows what I might need."

---

## 11. WHEN SHOULD IT APPEAR?

### Primary Trigger

When the user opens the cart or proceeds toward checkout.

Example:

User clicks:

**View Cart**

Then show:

**"Don't forget your essentials"**

Open Smart Grocery Basket.

The user can:

- Add recommended items
- Skip
- Continue to checkout

### Secondary Trigger

Show a smaller Smart Grocery Basket entry point while browsing.

Example:

**🛒 Smart Basket · 3 items**

Clicking it opens the full recommendation panel.

---

## 12. PRODUCT CARD INTERACTION

Each product must have:

- Product image
- Product name
- Price
- **+ Add** button

When the user clicks **+ Add**:

- Add the product to the cart
- Change the button to **✓ Added**
- Update cart count
- Update cart total
- Do not show the product as an available Add action again

If the product is already in the cart, do not show it in Smart Grocery Basket.

---

## 13. ADD ALL

Include an **Add All** button at the bottom.

When clicked:

- Add every recommended product to the cart
- Update cart count
- Update cart total
- Change individual buttons to **✓ Added**
- Do not add duplicate products

Example:

### 🛒 Smart Grocery Basket

🥚 Eggs — ₹120 — **[+ Add]**

🥤 Coke — ₹45 — **[+ Add]**

🗑️ Garbage Bags — ₹99 — **[+ Add]**

**[ Add All ]**

---

## 14. DISMISS / NOT NEEDED

Every recommendation should have a small dismiss option such as:

**Not needed**

If selected:

- Remove the item from the current recommendation list.
- Record the action so the algorithm can learn that the user does not always want that recommendation.

---

## 15. SMART RECOMMENDATION SCORE

Create a recommendation scoring system.

Each product should receive a score based on:

1. Purchase frequency
2. Recency
3. Replenishment interval
4. Day-of-week consistency
5. Number of historical purchases
6. How close the current date is to predicted purchase date
7. Whether it is already in the cart

Conceptually:

Recommendation Score =
Frequency Score
+ Recency Score
+ Pattern Consistency Score
+ Day-of-Week Score
+ Replenishment Due Score
- Already-in-Cart Penalty

Only display products above a reasonable confidence threshold.

Display the highest-confidence recommendations first.

---

## 16. USE MEDIAN INTERVAL

Do not rely only on the average purchase interval.

Use the **median interval** wherever possible because one unusual purchase can distort the average.

Example:

Purchase intervals:

4 days  
5 days  
4 days  
5 days  
20 days

Average is misleading.

Median is 5 days.

Therefore, the system should predict approximately 4–5 days.

---

## 17. PREDICTION WINDOW

Do not wait for the exact predicted date.

Create a replenishment window.

For example:

- Predicted interval = 5 days → show recommendation approximately 4–6 days after previous purchase.
- Predicted interval = 32 days → show recommendation approximately 29–35 days after previous purchase.

This makes the system more realistic.

---

## 18. LEARNING LOOP

The recommendation engine should improve based on user actions.

Track:

- Added recommendation
- Ignored recommendation
- Dismissed recommendation
- Repeatedly purchased recommendation
- Skipped recommendation
- Subscription enabled

If a user repeatedly ignores a recommendation, reduce its confidence.

If the user repeatedly accepts a recommendation, increase its confidence.

---

## 19. DEMO USER DATA

Because this is a prototype, create realistic historical order data for at least one demo user.

Create a demo customer with approximately 2–3 months of order history.

Example historical behavior:

### Weekly/Saturday

- Chips → most Saturdays
- Coke → most Saturdays
- Ice cream → some Saturdays

### Every 4–5 days

- Eggs → approximately every 4–5 days
- Milk → approximately every 3–4 days

### Weekly

- Bread → approximately every 7 days

### Every 2 weeks

- Detergent → approximately every 14 days

### Monthly

- Garbage bags → approximately every 30–35 days
- Dishwashing liquid → approximately every 30 days

Use this data to demonstrate that the recommendation engine is actually working.

---

## 20. DEMO SCENARIO

Create a demo scenario where today's date is a Saturday.

The user opens Zepto and starts shopping.

They add:

- Vegetables
- Rice
- Paneer

When they open the cart, Smart Grocery Basket appears.

It identifies:

- Chips
- Coke
- Eggs
- Garbage Bags

The UI should simply display the products with their prices and Add buttons.

The user can click:

**Add All Recommended**

All recommended products are added to the cart.

---

## 21. USER PROFILE / ORDER HISTORY

Add a simple underlying data structure.

### User

- userId
- name
- location

### Order

- orderId
- userId
- orderDate
- orderItems
- totalAmount

### Order Item

- productId
- productName
- quantity
- price

The recommendation engine should use this order history.

---

## 22. ALGORITHM LOGIC

Implement the recommendation logic using this approach:

### Step 1
Fetch the user's historical orders.

### Step 2
Group orders by product.

### Step 3
For each product, calculate:

- Number of purchases
- Average days between purchases
- Median days between purchases
- Consistency of intervals
- Most common purchase day
- Recent purchase date
- Predicted next purchase date

### Step 4
Determine whether the product has a meaningful pattern.

### Step 5
Compare today's date with the predicted next purchase date.

### Step 6
Calculate recommendation confidence.

### Step 7
Check whether the product is already in the current cart.

### Step 8
Return the highest-confidence recommendations.

---

## 23. DO NOT OVERENGINEER THE AI

For this prototype, an explainable algorithm is more important than a fake AI chatbot.

Use a deterministic recommendation engine based on historical purchase patterns.

The UI can call this:

**AI-Powered Smart Grocery Basket**

But the underlying logic should actually calculate the purchasing patterns.

---

## 24. EXISTING WEBSITE MUST REMAIN INTACT

Critical requirement:

**Do not remove or break any existing Zepto-style functionality.**

Keep:

- Homepage
- Search
- Categories
- Product pages
- Product cards
- Add to cart
- Cart
- Checkout
- Existing navigation
- Existing styling
- Existing authentication/user flow
- Existing product data

Only add the Smart Grocery Basket functionality.

The feature should feel like a native part of the existing product.

---

## 25. RESPONSIVE DESIGN

Make the feature work properly on:

- Desktop
- Tablet
- Mobile

On mobile, Smart Grocery Basket should appear as a bottom sheet or full-screen drawer.

On desktop, use a right-side drawer or modal.

---

## 26. FINAL UX FLOW

**User shops normally**

↓

**Adds products to cart**

↓

**Clicks View Cart**

↓

**Smart Grocery Basket analyzes order history**

↓

**AI identifies recurring patterns**

↓

**Recommendations appear**

↓

**User reviews recommendations**

↓

**User clicks Add / Add All / Not Needed**

↓

**Products are added to cart**

↓

**User proceeds to checkout**

---

## 27. ACCEPTANCE CRITERIA

The feature is complete only if:

✅ It analyzes historical customer orders  
✅ It detects recurring products  
✅ It detects weekly patterns  
✅ It detects day-of-week patterns  
✅ It detects 4–5 day replenishment patterns  
✅ It detects monthly patterns  
✅ It calculates predicted next purchase dates  
✅ It uses a prediction window  
✅ It does NOT display recommendation explanations  
✅ It does NOT display prediction intervals  
✅ It does NOT display confidence percentages  
✅ It does NOT display "why we recommend this"  
✅ Users can Add individual items  
✅ Users can Add All  
✅ Users can dismiss recommendations  
✅ Cart totals update immediately  
✅ Recommendation confidence is calculated in the background  
✅ Recommendations are personalized per customer  
✅ The system does not recommend products purchased only once  
✅ Existing website functionality remains unchanged  

---

# PRODUCT VISION

### "Never forget your everyday essentials."

The Smart Grocery Basket should transform grocery shopping from a memory-based activity into a predictive, personalized experience.

Instead of asking:

> "What do I need to buy?"

Zepto should help the user answer:

> **"What am I likely to need next?"**

The final experience should feel extremely simple:

### 🛒 Smart Grocery Basket

🥚 Eggs — ₹120 — **[+ Add]**

🥤 Coke — ₹45 — **[+ Add]**

🗑️ Garbage Bags — ₹99 — **[+ Add]**

**[ Add All ]**

The algorithm should be complex behind the scenes, but the customer-facing UI should be simple, clean and effortless.
