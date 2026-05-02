# CodeFolio - System Design Document

CodeFolio is a full-stack portfolio builder that lets a developer create, customize, publish, and share a portfolio site without writing the site from scratch. The application is organized as a React frontend, an Express backend, and a MongoDB persistence layer, with Stripe and email services supporting premium and contact workflows.

## 1. Goals And Scope

The product solves a simple problem: developers need a professional portfolio quickly, with enough structure to present work clearly and enough flexibility to make it personal. The system is designed to support three major user journeys:

1. Build and maintain a portfolio from a dashboard.
2. Publish a public portfolio under a vanity path or custom domain.
3. Upgrade to premium capabilities such as custom domains and payment-backed features.

This document describes the current architecture, major data flows, APIs, data models, security boundaries, and operational considerations.

## 2. High-Level Architecture

CodeFolio uses a classic split between a single-page frontend and a REST API backend.

```text
Browser
  -> React SPA (Vite)
  -> Express API
  -> MongoDB
  -> External services: Stripe, SMTP/SendGrid
```

### Core runtime components

- Frontend: React 19, Vite, React Router, React Hook Form, React Helmet Async.
- Backend: Node.js, Express, MongoDB, Mongoose, JWT auth.
- Integrations: Stripe for payments, Nodemailer/SendGrid for email delivery.
- Deployment: local dev with separate frontend/backend servers, production build served from the backend static dist folder.

### Entry points

- Frontend entry: [frontend/src/main.jsx](frontend/src/main.jsx)
- Frontend app shell: [frontend/src/App.jsx](frontend/src/App.jsx)
- Backend entry: [backend/src/server.js](backend/src/server.js)

## 3. Request Routing Model

### Frontend routes

The React app resolves these primary routes:

- `/` -> landing page on localhost, public portfolio on custom hostnames.
- `/auth` -> authentication page.
- `/profiles` -> public profile directory.
- `/u/:username` -> public portfolio by vanity username.
- `/:username` -> alternate public portfolio route.
- `/premium` -> pricing and upgrade page.
- `/dashboard` -> protected CMS dashboard.

Route behavior is controlled in [frontend/src/App.jsx](frontend/src/App.jsx). The landing route checks the browser hostname and serves the homepage locally, but resolves to the public portfolio viewer on custom domains.

### Backend routes

The Express app exposes these route groups:

- `/api/auth` -> authentication.
- `/api/portfolio` -> profile, project, and skill management.
- `/api/contact` -> contact form and message handling.
- `/api/payment` -> payment and premium upgrade flows.
- `/api/health` -> health check.

The backend also serves the built frontend from `frontend/dist` and supports hostname-based portfolio lookup through vanity routes.

## 4. Frontend Architecture

### 4.1 Application shell

The frontend is a single-page app with a shared header and a main content container. The app shell is defined in [frontend/src/App.jsx](frontend/src/App.jsx) and uses `react-router-dom` for route switching.

### 4.2 Pages

- [HomePage](frontend/src/pages/HomePage.jsx): marketing and product intro.
- [AuthPage](frontend/src/pages/AuthPage.jsx): login and registration.
- [DashboardPage](frontend/src/pages/DashboardPage.jsx): profile editor, project editor, skill editor, and live preview.
- [PublicPortfolioPage](frontend/src/pages/PublicPortfolioPage.jsx): public profile rendering by username or domain.
- [ProfilesPage](frontend/src/pages/ProfilesPage.jsx): profile directory.
- [PremiumPage](frontend/src/pages/PremiumPage.jsx): pricing and upgrade screen.

### 4.3 Dashboard editing model

The dashboard manages three data groups:

- Profile: username, full name, title, bio, location, links, resume, custom domain, template.
- Projects: title, description, tech stack, repository URL, live URL, screenshot.
- Skills: name and category.

Form state is driven by React Hook Form and persisted through API requests to the backend.

### 4.4 Live preview

[frontend/src/components/LivePortfolioPreview.jsx](frontend/src/components/LivePortfolioPreview.jsx) mirrors the current dashboard state and renders the selected template in preview mode. This lets users see changes before saving or publishing.

### 4.5 Template system

The portfolio renderer uses a template map inside [frontend/src/components/PortfolioLayout.jsx](frontend/src/components/PortfolioLayout.jsx). The selected template is driven by `profile.template_id` or the owning user’s template preference.

Available templates:

- Minimalist
- Corporate
- Creative
- Dark
- Designer
- Startup
- Professional
- Artistic
- Cyberpunk
- Material

Each template receives the same normalized `data` object:

```js
{
  user: { ... },
  profile: { ... },
  projects: [ ... ],
  skills: [ ... ]
}
```

### 4.6 Public profile detail rendering

The public profile templates render profile metadata inside the portfolio itself, not as a separate section. The shared details block is implemented in [frontend/src/components/ProfileDetailsSection.jsx](frontend/src/components/ProfileDetailsSection.jsx) and is embedded inside each template.

This ensures the following fields appear in the profile area when present:

- Location
- Public Email
- Resume URL
- GitHub URL
- LinkedIn URL
- Twitter URL
- Website URL
- Custom Domain

## 5. Backend Architecture

### 5.1 Server bootstrap

The backend entry point is [backend/src/server.js](backend/src/server.js). It:

1. Loads environment variables.
2. Applies CORS for the frontend origin.
3. Enables JSON request parsing.
4. Mounts API route groups.
5. Serves the frontend production build.
6. Falls back to vanity routing and SPA fallback behavior.

### 5.2 Database connection

MongoDB connection is handled from [backend/src/config/db.js](backend/src/config/db.js). The backend starts only after a successful database connection.

### 5.3 Controllers

The main controller modules are:

- [authController.js](backend/src/controllers/authController.js)
- [portfolioController.js](backend/src/controllers/portfolioController.js)
- [contactController.js](backend/src/controllers/contactController.js)
- [paymentController.js](backend/src/controllers/paymentController.js)
- [razorpayController.js](backend/src/controllers/razorpayController.js)

### 5.4 Middleware

The backend uses a layered middleware model:

- Authentication: JWT-based route protection.
- Security headers: hardening via Helmet-style headers.
- Rate limiting: general, auth-specific, and contact-specific throttles.
- Error handling: centralized `notFound` and `errorHandler` middleware.

Relevant files:

- [backend/src/middleware/auth.js](backend/src/middleware/auth.js)
- [backend/src/middleware/securityHeaders.js](backend/src/middleware/securityHeaders.js)
- [backend/src/middleware/rateLimiter.js](backend/src/middleware/rateLimiter.js)
- [backend/src/middleware/errorHandler.js](backend/src/middleware/errorHandler.js)

### 5.5 Services

- [backend/src/services/emailService.js](backend/src/services/emailService.js)
- [backend/src/services/stripeService.js](backend/src/services/stripeService.js)

These services isolate third-party integration details from route handlers.

## 6. Data Model Design

All persistent data is stored in MongoDB via Mongoose models.

### 6.1 User

Represents the account owner.

Key fields:

- `name`
- `email`
- `password`
- `templateId`

### 6.2 Profile

Represents the public portfolio identity.

Key fields in [backend/src/models/Profile.js](backend/src/models/Profile.js):

- `userId`
- `username`
- `full_name`
- `title`
- `bio`
- `avatar_url`
- `resume_url`
- `location`
- `email_public`
- `github_url`
- `linkedin_url`
- `twitter_url`
- `website_url`
- `custom_domain`
- `custom_domain_verified`
- `domain_verification_token`
- `template_id`
- `is_pro`

The profile model is the primary source of truth for public-facing portfolio content.

### 6.3 Project

Represents a work showcase item.

Key fields:

- `userId`
- `title`
- `description`
- `tech_stack`
- `repo_url`
- `live_url`
- `screenshot_url`
- `position`

### 6.4 Skill

Represents a tagged capability.

Key fields:

- `userId`
- `category`
- `name`
- `position`

### 6.5 ContactMessage

Represents a message submitted through a public portfolio contact form.

Key fields:

- `recipientId`
- `sender_name`
- `sender_email`
- `message`
- `read`

## 7. Portfolio Data Flow

### 7.1 Dashboard load flow

1. Authenticated user opens `/dashboard`.
2. Frontend fetches `/api/portfolio/me`.
3. Backend returns the current user, profile, projects, and skills.
4. Dashboard hydrates form state and preview state.

### 7.2 Public portfolio flow by username

1. Visitor opens `/u/demo1` or `/:username`.
2. `PublicPortfolioPage` requests `/api/portfolio/u/:username`.
3. Backend resolves the profile by username.
4. Backend fetches related projects and skills.
5. Frontend renders the selected template.

### 7.3 Public portfolio flow by custom domain

1. Visitor opens a custom domain.
2. The host header is captured and routed to the portfolio lookup path.
3. Backend finds the profile by `custom_domain`.
4. The same portfolio payload is returned.

### 7.4 Profile editing flow

1. User updates fields in the dashboard form.
2. Frontend sends `PUT /api/portfolio/me/profile`.
3. Backend validates and persists changed fields.
4. Frontend resets the form and updates preview state.

## 8. API Design

### 8.1 Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### 8.2 Portfolio

- `GET /api/portfolio/me`
- `PUT /api/portfolio/me/profile`
- `DELETE /api/portfolio/me/profile`
- `POST /api/portfolio/me/projects`
- `PUT /api/portfolio/me/projects/:projectId`
- `DELETE /api/portfolio/me/projects/:projectId`
- `POST /api/portfolio/me/skills`
- `DELETE /api/portfolio/me/skills/:skillId`
- `GET /api/portfolio/u/:username`
- `GET /api/portfolio/:username`
- `GET /api/portfolio/domain/:hostname`
- `GET /api/portfolio/all`
- `GET /api/portfolio/verify-domain`

### 8.3 Contact

- `POST /api/contact`

### 8.4 Payment

- `GET /api/payment/plans`
- `POST /api/payment/create-payment-intent`
- `POST /api/payment/confirm-payment`
- `POST /api/payment/webhook`

## 9. Security Design

### 9.1 Authentication and authorization

The application uses JWT-based authentication. Protected routes require a valid bearer token and use middleware to attach the user identity to the request context.

### 9.2 Input validation

Validation is performed for usernames, URLs, project data, and contact messages. This reduces malformed writes and helps prevent unsafe content from being stored or rendered.

### 9.3 Rate limiting

The backend applies throttling to protect login, contact, and general routes from abuse.

### 9.4 Security headers and CORS

The server enables CORS for the configured client origin and applies hardened headers to reduce common browser-side attack surfaces.

### 9.5 Password handling

Passwords are hashed before storage and never returned to the client.

## 10. Premium And Payment Design

Premium features are represented by the `is_pro` field on the profile and the user’s ability to unlock custom domain and other paid features.

Stripe is used for payment intent creation and webhook-driven confirmation. The webhook is the source of truth for payment completion, not the frontend confirmation screen.

### Payment lifecycle

1. User selects upgrade.
2. Frontend requests a payment intent.
3. Backend creates the Stripe PaymentIntent.
4. Frontend confirms payment using Stripe.js.
5. Stripe calls the webhook.
6. Backend marks the account as Pro.

## 11. Email Design

The email layer is abstracted behind `emailService` and can use SMTP or SendGrid.

Primary email use cases:

- Contact form forwarding.
- Account notifications.
- Future password reset and onboarding flows.

## 12. Deployment Model

### 12.1 Local development

The repo uses npm workspaces with separate frontend and backend apps. Root scripts coordinate local development.

Relevant root scripts from [package.json](package.json):

- `npm run dev` -> runs backend and frontend in parallel.
- `npm run build` -> builds the frontend.
- `npm install --workspaces` -> installs all workspace dependencies.

### 12.2 Production build

The frontend is built into `frontend/dist`, and the backend serves that static output. This allows a single Node process to host the application in production.

### 12.3 Containerization

The design is suitable for Docker Compose or separate container deployment:

- Frontend build container.
- Backend runtime container.
- MongoDB container or managed MongoDB service.

## 13. Observability And Operations

### 13.1 Health checks

The backend exposes `/api/health` to confirm process availability.

### 13.2 Logging

The backend logs startup failures, port conflicts, and server-level errors. In production, structured logging should be added around request failures, payment callbacks, and email delivery results.

### 13.3 Monitoring targets

- API latency.
- Error rate.
- Database query performance.
- Payment completion rate.
- Email delivery success.

## 14. Performance Considerations

Current performance strengths:

- Vite-based frontend build and dev experience.
- Small, route-based SPA surface.
- Explicit data fetching per page.
- Template rendering with shared portfolio data.

Future optimizations:

- Database indexes for username and custom domain lookups.
- CDN for image-heavy portfolio templates.
- Caching for public portfolio reads.
- Pagination for profile lists and larger datasets.

## 15. Scalability Considerations

The system is currently optimized for a modest number of users and portfolios. Scaling improvements should focus on:

- Read-heavy portfolio caching.
- Queueing email delivery.
- Offloading static assets.
- Managed MongoDB with replicas and backups.
- Webhook retry handling for payment events.

## 16. Failure Handling

### Backend failures

- Invalid route -> `notFound` middleware.
- Unhandled exception -> `errorHandler` middleware.
- Database outage -> server startup failure.
- Duplicate username/domain -> controlled validation response.

### Frontend failures

- API failures show user-facing error text.
- Missing portfolio data falls back to loading/error states.
- Authentication redirect occurs for protected routes.

## 17. Current Functional Coverage

The current codebase supports:

- Account registration and login.
- JWT-authenticated dashboard access.
- Portfolio profile editing.
- Project CRUD.
- Skill CRUD.
- Public portfolio rendering.
- Vanity URLs.
- Custom domain lookup.
- Contact form submission.
- Stripe-based premium flow.
- Light and dark theme support.
- Template-based portfolio presentation.

## 18. Known Implementation Notes

- Public profile metadata is rendered inside each template so it stays part of the portfolio itself.
- Template selection is driven by the profile’s `template_id`.
- The backend returns combined `user`, `profile`, `projects`, and `skills` payloads for portfolio views.
- The root workspace requires workspace install before frontend build or lint.

## 19. Future Enhancements

Likely next-step improvements include:

- Analytics for profile views and link clicks.
- A richer contact inbox in the dashboard.
- Image uploads with cloud storage.
- Password reset and account recovery.
- Social preview image generation.
- Expanded template customization options.
- Automated test coverage across API and UI.

## 20. Conclusion

CodeFolio’s design is intentionally simple: one authenticated editor, one public portfolio renderer, one database, and a small set of integrations. That makes the product easy to extend without turning the codebase into a complex platform.

The current architecture is:

- modular enough to support new templates and features,
- secure enough for public portfolio publishing,
- and straightforward to deploy as a single web application.
