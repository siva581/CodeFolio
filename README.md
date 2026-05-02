# CodeFolio - Portfolio Builder for Developers

A full-stack MERN application that enables developers to quickly create stunning, customizable portfolio websites in minutes—without writing code.

## 🎯 Problem Statement

Many developers spend weeks procrastinating on building their personal sites from scratch, struggling with CSS frameworks and deployment, instead of focusing on coding actual projects. **CodeFolio** solves this by providing a "Linktree on steroids" specifically for engineers.

## ✨ Key Features

### Phase 1: Builder Dashboard (CMS)
- ✅ Flexible data model (Profile, Projects, Skills)
- ✅ Rich form interface with React Hook Form
- ✅ Live preview as you type
- ✅ Authentication & authorization

### Phase 2: Template Engine
- ✅ 10 pre-designed templates (Minimalist, Cyberpunk, Corporate, etc.)
- ✅ Dynamic template rendering
- ✅ Real-time template switching

### Phase 3: Public Access & SEO
- ✅ Vanity URLs: `codefolio.com/username`
- ✅ React Helmet for SEO optimization
- ✅ Dynamic meta tags and page titles
- ✅ Custom domain support (Pro)

### Phase 4: Premium Features
- ✅ Contact form with email forwarding
- ✅ Stripe payment integration
- ✅ Pro badge and premium templates
- ✅ Custom domain mapping

### Bonus Features
- ✅ Dark/Light theme toggle
- ✅ Security headers & rate limiting
- ✅ Input validation & sanitization
- ✅ Docker containerization
- ✅ CI/CD workflows
- ✅ Comprehensive documentation

## 🏗️ Tech Stack

### Frontend
- **React 19** with Vite
- **React Router v7** for navigation
- **React Hook Form** for form management
- **React Helmet** for SEO
- **Vanilla CSS** (light & dark mode support)

### Backend
- **Node.js + Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer / SendGrid** for emails
- **Stripe** for payments
- **Helmet.js** for security headers
- **Express Rate Limit** for throttling

### DevOps
- **Docker & Docker Compose** for containerization
- **GitHub Actions** for CI/CD
- **Deployment ready** for Vercel, Netlify, Heroku, Azure, etc.

## 📁 Project Structure

```
├── frontend/                      # React SPA
│   ├── src/
│   │   ├── pages/                 # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── PublicPortfolioPage.jsx
│   │   │   └── PremiumPage.jsx
│   │   ├── components/            # Reusable components
│   │   ├── templates/             # 10 portfolio templates
│   │   ├── context/               # Auth & Theme contexts
│   │   ├── lib/                   # API helpers
│   │   └── styles.css             # Global styles
│   ├── vite.config.js
│   └── package.json
│
├── backend/                       # Express API
│   ├── src/
│   │   ├── routes/               # API route handlers
│   │   ├── controllers/          # Business logic
│   │   ├── models/               # MongoDB schemas
│   │   ├── middleware/           # Auth, security, etc.
│   │   ├── services/             # Email, Stripe, etc.
│   │   ├── utils/                # Validation, helpers
│   │   ├── config/               # Database config
│   │   └── server.js             # Entry point
│   ├── scripts/
│   │   └── seedDemoProfiles.js   # Demo data seeding
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml            # Full-stack local deployment
├── Dockerfile.backend            # Backend container
├── Dockerfile.frontend           # Frontend container
├── .github/workflows/            # CI/CD pipelines
├── DEPLOYMENT.md                 # Deployment guide
├── SYSTEM_DESIGN.md             # Architecture docs
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 7+
- npm or yarn

### Local Development

```bash
# 1. Clone repository
git clone <your-repo>
cd Intern_web

# 2. Install dependencies
npm install --workspaces

# 3. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Update backend/.env with your credentials
# MONGODB_URI, JWT_SECRET, email service details, etc.

# 5. Start MongoDB (if local)
mongod

# 6. Run development servers
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

### Seed Demo Data

```bash
npm run seed --prefix backend

# Creates demo1 and demo2 profiles
# Login: demo1@example.com / password123
# Login: demo2@example.com / password123

# View portfolios:
# http://localhost:5173/u/demo1
# http://localhost:5173/u/demo2
```

## 🐳 Docker Deployment

```bash
# Using Docker Compose (recommended)
docker-compose up --build

# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# MongoDB: localhost:27017

# Seed demo data in Docker
docker exec codefolio-backend node backend/scripts/seedDemoProfiles.js
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register       - Create account
POST   /api/auth/login          - Get JWT token
GET    /api/auth/me             - Get current user
```

### Portfolio Management (CMS)
```
GET    /api/portfolio/me                       - Get my portfolio
GET    /api/portfolio/u/:username              - Get user portfolio
GET    /api/portfolio/domain/:hostname         - Get portfolio by custom domain
PUT    /api/portfolio/me/profile               - Update profile
POST   /api/portfolio/me/projects              - Create project
PUT    /api/portfolio/me/projects/:projectId   - Update project
DELETE /api/portfolio/me/projects/:projectId   - Delete project
POST   /api/portfolio/me/skills                - Create skill
DELETE /api/portfolio/me/skills/:skillId       - Delete skill
```

### Contact Form
```
POST   /api/contact                            - Submit contact message
```

### Payment (Premium)
```
GET    /api/payment/plans                      - Get pricing plans
POST   /api/payment/create-payment-intent      - Create Stripe payment
POST   /api/payment/confirm-payment            - Confirm payment
POST   /api/payment/webhook                    - Stripe webhook
```

## 🎨 Available Templates

| Template | Style | Description |
|----------|-------|-------------|
| **Minimalist** | Clean | Focus on content |
| **Corporate** | Professional | Business-oriented |
| **Creative** | Artistic | Portfolio-heavy |
| **Cyberpunk** | Modern | Neon colors, animations |
| **Dark** | Elegant | Dark theme |
| **Professional** | Formal | Clean typography |
| **Designer** | Visual | Image-focused |
| **Startup** | Trendy | Modern layout |
| **Artistic** | Expressive | Unique design |
| **Material** | Material UI | Google Material Design |

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Rate limiting (auth, contact, general)
- ✅ Security headers (Helmet.js)
- ✅ Input validation & sanitization
- ✅ XSS protection
- ✅ SQL injection prevention (MongoDB)
- ✅ HTTPS ready

## 💳 Premium Features

### Pro Plan ($9.99/month)
- Custom domain support
- Advanced analytics
- Priority support
- Premium templates
- Unlimited projects

### Business Plan ($29.99/month)
- Everything in Pro
- Team collaboration
- API access
- Advanced customization
- Dedicated support

## 📧 Email Configuration

### Option 1: Gmail (Nodemailer)
```bash
# Enable 2FA and create app password
# https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
```

### Option 2: SendGrid API
```bash
# Create SendGrid account and get API key
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

## 🚢 Production Deployment

### Option 1: Docker + VPS
```bash
docker-compose up -d
# See DEPLOYMENT.md for detailed instructions
```

### Option 2: Vercel + Render
- **Frontend**: Vercel (free, unlimited)
- **Backend**: Render/Railway ($7/month)
- **Database**: MongoDB Atlas (free tier available)

### Option 3: Netlify + Heroku
- **Frontend**: Netlify (free)
- **Backend**: Heroku ($7/month)

### Option 4: Azure / AWS
- Full managed services
- Auto-scaling & CDN
- See DEPLOYMENT.md

**→ [Complete Deployment Guide →](./DEPLOYMENT.md)**

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions for all platforms
- **[SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)** - Architecture, data models, routing

## 📊 How It Works

### User Journey

```
1. Sign up → Create account
   ↓
2. Dashboard → Fill in profile, projects, skills
   ↓
3. Live Preview → See changes in real-time
   ↓
4. Choose Template → Select from 10 designs
   ↓
5. Publish → Portfolio goes live at codefolio.com/username
   ↓
6. Share → Send link to recruiters
   ↓
7. Optional: Upgrade → Custom domain + premium features
```

### Routing Explanation

**Frontend Routing** (React Router):
- User visits `/u/demo1`
- React Router captures `:username` parameter
- Component fetches data from `/api/portfolio/u/demo1`
- Backend queries MongoDB for that username
- Template engine maps `template_id` to component
- Portfolio renders with user's data

**Backend Routing** (Express):
- API endpoint `/api/portfolio/u/:username`
- Controller queries `Profile.findOne({ username })`
- Joins with `Project` and `Skill` collections
- Returns combined JSON to frontend

**Custom Domain**:
- User sets CNAME: `john.com → codefolio.com`
- Backend receives Host header: `john.com`
- API lookup: `Portfolio.findOne({ custom_domain: "john.com" })`
- Returns that user's portfolio

## 🧪 Demo Profiles

After seeding, visit:
- **Demo 1** (Minimalist): http://localhost:5173/u/demo1
- **Demo 2** (Corporate): http://localhost:5173/u/demo2

Login with:
- Email: `demo1@example.com`
- Password: `password123`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Project Phases

### ✅ Phase 1: Builder Dashboard
- Data modeling
- User authentication
- CMS forms
- Database integration

### ✅ Phase 2: Template Engine
- Design 10+ templates
- Dynamic rendering
- Template switching

### ✅ Phase 3: Public Access & SEO
- Vanity URL routing
- React Helmet
- Meta tags
- Custom domains

### ✅ Phase 4: Premium Features
- Contact form
- Stripe integration
- Pro subscriptions
- Premium templates

### ✅ Phase 5: Deployment & Polish
- Docker containerization
- CI/CD pipelines
- Comprehensive docs
- Production deployment

## 📋 Checklist for Completeness

- ✅ Authentication (register, login, JWT)
- ✅ User profile management
- ✅ Project CRUD operations
- ✅ Skill management
- ✅ 10 different templates
- ✅ Dynamic template rendering
- ✅ Vanity URLs (`/:username`)
- ✅ Custom domain support
- ✅ Live preview in dashboard
- ✅ React Helmet SEO
- ✅ Contact form
- ✅ Email service (Nodemailer + SendGrid)
- ✅ Stripe payment integration
- ✅ Pro badge logic
- ✅ Rate limiting & security
- ✅ Input validation
- ✅ Error handling
- ✅ Docker setup
- ✅ GitHub Actions CI/CD
- ✅ Deployment documentation
- ✅ Demo profiles (demo1, demo2)
- ✅ Light/Dark theme
- ✅ Responsive design

## 🐛 Troubleshooting

### Backend won't start
```bash
npm run dev --prefix backend
# Check MongoDB connection
# Check port 5000 is available
```

### Email not sending
- Verify SMTP credentials
- Check Gmail app password
- Verify SendGrid API key
- Check firewall/port access

### Frontend build errors
```bash
rm -rf frontend/node_modules frontend/dist
npm install --workspaces
npm run build --prefix frontend
```

### Docker issues
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose build --no-cache
```

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
2. Check [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) for architecture details
3. Create a GitHub issue with detailed information

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- MERN stack community
- React ecosystem
- MongoDB documentation
- Stripe API docs
- All open-source contributors

---

**Ready to showcase your portfolio? [Get started now →](./DEPLOYMENT.md)**
