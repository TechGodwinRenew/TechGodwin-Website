# TechGodwin - Professional IT Knowledge & Training Platform

A modern, full-stack platform for sharing IT infrastructure knowledge, offering live training classes, and building a community of DevOps and cloud professionals.

## Features

✅ **Blog System** - Write, publish, and share technical articles
✅ **Live Training Classes** - Schedule and manage upcoming courses  
✅ **Course Registration** - Students can register for classes
✅ **Newsletter** - Email subscription management
✅ **Payment Infrastructure** - Ready for Stripe/PayPal (inactive by default)
✅ **Admin Dashboard** - Manage content and classes

## Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Deployment**: Render.com

## Project Structure

```
techgodwin/
├── app/
│   ├── api/               # API routes
│   │   ├── blog/         # Blog CRUD endpoints
│   │   ├── classes/      # Classes & registration
│   │   ├── newsletter/   # Newsletter subscription
│   │   └── payments/     # Payment infrastructure
│   ├── blog/             # Blog pages
│   ├── classes/          # Classes pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── prisma/
│   └── schema.prisma     # Database schema
├── lib/                  # Utilities and helpers
├── components/           # Reusable components
├── public/              # Static assets
└── .env.local           # Environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- npm or yarn

### Installation

1. Clone the repository
```bash
cd techgodwin
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the example env file and update with your values
cp .env.local.example .env.local
```

4. Configure Supabase connection in `.env.local`:
```bash
DATABASE_URL="postgresql://user:password@db.supabase.co:5432/postgres?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

5. Push the database schema
```bash
npm run db:push
```

6. Seed sample data (optional)
```bash
npm run seed
```

7. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## API Documentation

### Blog API

**GET** `/api/blog` - List blog posts
- Query params: `category`, `featured`, `page`, `limit`

**POST** `/api/blog` - Create blog post (requires auth)

**GET** `/api/blog/[slug]` - Get specific post

**PUT** `/api/blog/[slug]` - Update post (requires auth)

**DELETE** `/api/blog/[slug]` - Delete post (requires auth)

### Classes API

**GET** `/api/classes` - List classes
- Query params: `upcoming`, `page`, `limit`

**POST** `/api/classes` - Create class (requires auth)

**POST** `/api/classes/[id]/register` - Register for class

### Newsletter API

**POST** `/api/newsletter` - Subscribe to newsletter

**DELETE** `/api/newsletter?email=user@example.com` - Unsubscribe

### Payments API

**POST** `/api/payments` - Initiate payment (infrastructure ready)

**GET** `/api/payments?transactionId=xxx` - Check payment status

## Database Schema

### BlogPost
- `slug` (unique)
- `title`, `excerpt`, `content`
- `category`, `difficulty`, `author`, `tags`
- `featured`, `published`
- `readingTime`, `thumbnail`
- Timestamps: `createdAt`, `updatedAt`, `publishedAt`

### UpcomingClass
- `title`, `description`, `category`
- `startDate`, `endDate`, `duration`
- `instructor`, `location`, `capacity`
- `price`, `isPaid`
- Relations: `registrations`

### CourseRegistration
- `classId` (references UpcomingClass)
- `firstName`, `lastName`, `email`, `phone`
- `status` (pending/confirmed/cancelled/completed)
- `paymentStatus` (unpaid/paid/refunded)

### NewsletterSubscriber
- `email` (unique)
- `name`
- `subscribedAt`, `unsubscribedAt`

### Payment (Future Use)
- `registrationId`
- `amount`, `currency`
- `status` (pending/completed/failed/refunded)
- `paymentMethod`, `transactionId`

### PaymentMethod
- `provider` (stripe/paypal)
- `isActive` (boolean)
- `config` (JSON)

## Environment Variables

```bash
# Database
DATABASE_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Payments (Optional - for future use)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=TechGodwin
```

## Enabling Payments

The payment infrastructure is built but disabled by default. To enable payments:

1. **Stripe Setup**:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
   STRIPE_SECRET_KEY=sk_...
   ```

2. **PayPal Setup**:
   ```bash
   PAYPAL_CLIENT_ID=...
   PAYPAL_CLIENT_SECRET=...
   ```

3. Update `/app/api/payments/route.ts` to implement payment processing logic

4. Create PaymentMethod records in the database via admin panel

## Deployment

### Render.com

1. Push your code to GitHub
2. Connect your repository to Render
3. Set environment variables in Render dashboard
4. Deploy: `npm run build && npm start`

### Environment Setup

```bash
# In Render Dashboard:
DATABASE_URL=postgresql://...  # Your Supabase connection
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Development Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run db:push   # Sync Prisma schema with database
npm run db:studio # Open Prisma Studio
```

## Security Considerations

- [ ] Enable authentication for admin routes
- [ ] Add rate limiting to API endpoints
- [ ] Implement CSRF protection
- [ ] Add input validation and sanitization
- [ ] Enable HTTPS in production
- [ ] Use environment variables for secrets
- [ ] Implement database backups

## Future Enhancements

- [ ] User authentication & profiles
- [ ] Admin dashboard for content management
- [ ] Email notifications
- [ ] Certificate generation after course completion
- [ ] Discussion forums
- [ ] Video hosting integration
- [ ] Advanced search & filtering
- [ ] Mobile app

## Support

For issues or questions, please open a GitHub issue.

## License

MIT License - see LICENSE file for details
