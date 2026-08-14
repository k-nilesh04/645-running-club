# Payment System Setup Guide

## What's Been Implemented:

### Backend (Node.js/Express)
1. **Payment Controller** (`paymentController.js`)
   - Initiate Payment: Create payment record and pending membership
   - Verify Payment: Confirm payment and activate membership
   - Get Membership Status: Check if user has active membership
   - Cancel Membership: Allow users to cancel subscriptions

2. **Payment Routes** (`payment.route.js`)
   - `POST /api/payment/initiate` - Start payment process
   - `POST /api/payment/verify` - Verify and activate
   - `GET /api/payment/status` - Check membership status
   - `POST /api/payment/cancel` - Cancel membership

3. **MongoDB Models** (Already exist)
   - `Membership` - Tracks user memberships and plans
   - `Payment` - Records all transactions

### Frontend (React)
1. **SubscriptionCard Component** (Updated)
   - Shows login prompt if user not authenticated
   - Displays current membership if user is premium
   - Shows subscription form for non-members
   - Integrates with Razorpay for payment processing

2. **API Endpoints** (Updated `api.js`)
   - `initiatePayment(payload)` - Start payment
   - `verifyPayment(payload)` - Verify transaction
   - `getMembershipStatus()` - Check membership
   - `cancelMembership()` - Cancel subscription

## Setup Steps:

### 1. Install Razorpay (Frontend)
```bash
# Already loaded from CDN in SubscriptionCard component
# No installation needed
```

### 2. Add Razorpay Key to Frontend `.env`
Create or update `frontend/.env`:
```
VITE_RAZORPAY_KEY=rzp_test_1234567890  # Get from Razorpay dashboard
```

### 3. Database Flow:
When user subscribes:
1. User clicks "Subscribe Now"
2. Payment initiated → Create Membership (status: pending) + Payment (status: pending)
3. Razorpay modal opens
4. User completes payment
5. On success → Verify endpoint called
6. Membership activated (status: active, set endDate)
7. Payment marked success (status: success)

### 4. Membership Plans:
- **Monthly**: ₹99/month (endDate = startDate + 1 month)
- **Quarterly**: ₹249/month (endDate = startDate + 3 months)
- **Yearly**: ₹999/year (endDate = startDate + 1 year)
- **Lifetime**: One-time (endDate = null)

### 5. User States:
1. **Not Logged In** → Shows "Login to Subscribe" button
2. **Logged In + No Membership** → Shows subscription form
3. **Logged In + Active Membership** → Shows membership details and benefits

## Database Queries to Monitor Memberships:

### Find all active members:
```mongodb
db.memberships.find({ status: "active" })
```

### Find members expiring soon:
```mongodb
db.memberships.find({
  status: "active",
  endDate: { $lt: new Date(Date.now() + 7*24*60*60*1000) }
})
```

### Find all paid transactions:
```mongodb
db.payments.find({ status: "success" })
```

### Find failed payments:
```mongodb
db.payments.find({ status: "failed" })
```

## Next Steps:

1. Get Razorpay API keys from: https://dashboard.razorpay.com
2. Update `VITE_RAZORPAY_KEY` in frontend `.env`
3. Test payment flow with test card: 4111 1111 1111 1111
4. Deploy payment routes to production
5. Update CORS to include Razorpay if needed
