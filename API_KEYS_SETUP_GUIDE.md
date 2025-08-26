# 🔑 API Keys & Environment Setup Guide

This guide covers all the API keys and environment variables required for RankMe's complete functionality.

## 📋 Quick Setup Checklist

- [ ] **Database Configuration**
- [ ] **Stripe Payment Processing**
- [ ] **OpenAI AI Coach Integration**
- [ ] **Google OAuth Authentication**
- [ ] **Email Service (SMTP)**
- [ ] **NextAuth Configuration**
- [ ] **Production URLs**

---

## 🔧 Environment Variables Required

### **Required for Basic Functionality**

#### 1. **Database Configuration** 
```env
DATABASE_URL="file:./dev.db"
# For production: DATABASE_URL="postgresql://username:password@localhost:5432/rankme"
```
**Features Enabled:** All database operations, assessments, user data storage

#### 2. **NextAuth Security**
```env
NEXTAUTH_SECRET=your-random-secret-key-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000
# For production: NEXTAUTH_URL=https://yourdomain.com
```
**Features Enabled:** User authentication, session management, security

#### 3. **JWT Token Security**
```env
JWT_SECRET=your-jwt-secret-key-change-in-production-minimum-32-chars
```
**Features Enabled:** Secure token generation, session validation

---

### **Required for Payment Processing**

#### 4. **Stripe Configuration**
```env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

**Features Enabled:**
- Deep Report purchases ($29)
- AI Coach subscription purchases ($9.99/month)
- Secure payment processing
- Webhook handling for payment verification

**Setup Instructions:**
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Stripe Dashboard → Developers → API keys
3. Create webhook endpoint: `your-domain.com/api/webhook/stripe`
4. Configure webhook to send `checkout.session.completed` events
5. Copy webhook secret to environment

---

### **Required for AI Coach Features**

#### 5. **OpenAI Configuration**
```env
OPENAI_API_KEY=sk-YOUR_OPENAI_API_KEY_HERE
```

**Features Enabled:**
- AI Coach conversations and personalized responses
- Intelligent task generation (daily/weekly)
- Proactive insights and coaching recommendations  
- Task difficulty adaptation
- Personalized coaching styles (Supportive, Direct, Motivational, Analytical)

**Setup Instructions:**
1. Create account at [openai.com](https://openai.com)
2. Go to API section and create new API key
3. Add billing information (required for GPT-4 access)
4. Copy API key to environment

**Note:** Without this key, AI Coach will use mock data and basic responses.

---

### **Optional for Enhanced Authentication**

#### 6. **Google OAuth (Optional)**
```env
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Features Enabled:**
- "Sign in with Google" button
- Easier user registration
- OAuth-based authentication

**Setup Instructions:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URIs: `your-domain.com/api/auth/callback/google`

**Note:** Users can still register with email/password without this.

---

### **Optional for Email Features**

#### 7. **SMTP Email Configuration (Optional)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@rankme.app
```

**Features Enabled:**
- Email results sharing
- Assessment report delivery
- Automated notifications

**Setup Instructions (Gmail):**
1. Enable 2-factor authentication on Gmail
2. Generate App Password: Account → Security → App passwords
3. Use the app password (not your regular password)

**Note:** Email sharing will be disabled without these settings.

---

### **Production Configuration**

#### 8. **Production URLs**
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**Features Enabled:**
- Correct URLs in emails
- Proper redirect handling
- Share link generation
- Payment success/cancel URLs

---

## 🎯 Feature Matrix

| Feature | Required Keys | Optional Keys | Fallback Behavior |
|---------|---------------|---------------|------------------|
| **Basic Assessment** | `DATABASE_URL`, `NEXTAUTH_SECRET` | - | ✅ Works fully |
| **User Registration** | `DATABASE_URL`, `NEXTAUTH_SECRET` | `GOOGLE_CLIENT_*` | ✅ Email/password only |
| **Payment Processing** | `STRIPE_*` keys | - | ❌ Payment disabled |
| **AI Coach Chat** | `OPENAI_API_KEY` | - | 🔄 Mock responses |
| **Task Generation** | `OPENAI_API_KEY` | - | 🔄 Mock tasks |
| **Email Sharing** | - | `SMTP_*` keys | ❌ Feature disabled |
| **Social Login** | - | `GOOGLE_CLIENT_*` | ❌ Google login hidden |

---

## 🚀 Setup Instructions

### Development Setup

1. **Copy environment template:**
```bash
cp .env.example .env.local
```

2. **Fill in required keys:**
```env
# Minimum required for development
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-development-secret-at-least-32-characters"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-at-least-32-characters"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Add service keys as needed:**
```env
# For payment testing
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# For AI features
OPENAI_API_KEY="sk-..."

# For Google login
GOOGLE_CLIENT_ID="...googleusercontent.com"
GOOGLE_CLIENT_SECRET="..."

# For email features
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

4. **Initialize database:**
```bash
npx prisma db push
```

5. **Start development server:**
```bash
npm run dev
```

### Production Setup

1. **Use production endpoints:**
```env
DATABASE_URL="postgresql://user:pass@host:5432/rankme"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

2. **Use live Stripe keys:**
```env
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

3. **Generate secure secrets:**
```bash
# Generate secure random secrets
openssl rand -base64 32  # For NEXTAUTH_SECRET
openssl rand -base64 32  # For JWT_SECRET
```

---

## 🔍 Testing Your Setup

### Verify Database Connection
```bash
curl http://localhost:3000/api/test
# Should return: {"success": true, "message": "Database connected successfully"}
```

### Test Stripe Integration
1. Go to any scorecard page
2. Click "Unlock Deep Report"
3. Should redirect to Stripe checkout (test mode)

### Test AI Coach
1. Create an assessment
2. Go to AI Coach section
3. Try chatting - should get intelligent responses (not mock data)

### Test Google Login
1. Go to sign-in page
2. Should see "Sign in with Google" button
3. Should work for registration

### Test Email Sharing
1. Complete an assessment
2. Try "Email Results" button
3. Should successfully send email

---

## ❗ Security Notes

- **Never commit real API keys to version control**
- **Use different keys for development/production**
- **Regenerate secrets regularly**
- **Use environment variables, not hardcoded values**
- **Restrict API key permissions where possible**

---

## 🆘 Troubleshooting

### "Unauthorized" errors
- Check `NEXTAUTH_SECRET` is set and matches across all instances
- Verify `NEXTAUTH_URL` matches your domain

### Stripe payments failing
- Verify webhook endpoint is publicly accessible
- Check webhook secret matches Stripe dashboard
- Ensure using correct API keys (test vs live)

### AI Coach not working
- Verify `OPENAI_API_KEY` is valid and has billing enabled
- Check OpenAI account has sufficient credits
- Ensure API key has GPT-4 access

### Email not sending
- Verify SMTP credentials are correct
- For Gmail, ensure using App Password, not regular password
- Check firewall/hosting provider allows SMTP connections

---

## 📞 Support

If you need help setting up any of these integrations:

1. Check the individual service documentation
2. Verify environment variables are loaded correctly
3. Check browser network tab for API errors
4. Review server logs for detailed error messages

**Most Common Issues:**
- Typos in environment variable names
- Using development keys in production
- Missing required billing setup (OpenAI, Stripe)
- Incorrect webhook configurations