# 🔑 How to Get Price IDs from Your Products

## ⚠️ You Have Product IDs, But We Need Price IDs!

**Product ID**: `prod_...` (the product itself)
**Price ID**: `price_...` (the specific pricing for that product) ← We need this!

## 📝 How to Get Price IDs:

### Step 1: Go to Stripe Dashboard
1. Go to https://dashboard.stripe.com
2. Click **Products** (left menu)

### Step 2: Find Your Products

#### For Monthly Product (`prod_TLqQtpvekqR57a`):
1. Click on the product named "Pro Plan" or your monthly subscription product
2. Look for a **Pricing** section or **Prices** tab
3. You should see a price like:
   - **$4.00 / month**
   - Under it, you'll see a **Price ID** that starts with `price_`
   - Example: `price_1ABC123...`
   - **COPY THIS PRICE ID**

#### For Lifetime Product (`prod_TLqSe4WbrHrw8c`):
1. Click on the product named "Lifetime Access" or your one-time payment product
2. Look for a **Pricing** section or **Prices** tab
3. You should see a price like:
   - **$49.99** (one-time)
   - Under it, you'll see a **Price ID** that starts with `price_`
   - Example: `price_1XYZ789...`
   - **COPY THIS PRICE ID**

## 🎯 What It Looks Like:

In Stripe Dashboard → Products → [Your Product]:

```
Product: Pro Plan
├── Pricing
    └── Price: $4.00 / month
        Price ID: price_1ABC123... ← COPY THIS!
```

## 🔄 Alternative: Check Prices Tab

1. In Stripe Dashboard → **Products**
2. Click on **Prices** tab (top menu)
3. You'll see all your prices listed
4. Find the prices for your two products
5. Copy the Price IDs (they start with `price_`)

## ✅ Once You Have Price IDs:

Once you have both Price IDs (starting with `price_`), I'll update the `server/config/plans.json` file for you!

Just tell me:
- "My monthly price ID is: price_..."
- "My lifetime price ID is: price_..."

Or if you want to do it yourself, open `server/config/plans.json` and replace:
```json
{
  "pro_monthly": {
    "priceId": "price_YOUR_MONTHLY_PRICE_ID_HERE"
  },
  "lifetime": {
    "priceId": "price_YOUR_LIFETIME_PRICE_ID_HERE"
  }
}
```

