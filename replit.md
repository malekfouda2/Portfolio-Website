# Personal Portfolio Website

## Overview

This is a modern, full-stack personal portfolio website built with React, TypeScript, and Express.js. The application features a sleek, cyberpunk-inspired design with a Matrix-style animated background, showcasing a developer's skills, projects, and contact information. The site includes a functional contact form with backend storage capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### July 16, 2025
- Fixed comprehensive mobile responsiveness across all sections
- Added smooth slide-down animation to mobile navigation menu
- Enhanced tech stack with PHP, MySQL, Laravel, .NET, and MySQL Server
- Added dedicated Shopify Partner section with logo and credentials
- Added WordPress Expert section highlighting custom development capabilities
- Improved mobile typography and spacing throughout the site
- Updated skills grid with additional technologies including Shopify and WordPress
- Enhanced contact form and info sections for better mobile display
- Applied consistent responsive design patterns across all components
- **LATEST**: Replaced emoji icons with actual technology logos using react-icons library
- Implemented proper brand colors for each technology icon (React blue, Node.js green, etc.)
- Added professional authentication system for dashboard management
- Created comprehensive CMS with login credentials (username: malekfouda, password: Malekfouda1882000)
- Built complete CRUD functionality for hero content, projects, and contact submissions
- Added JWT-like authentication with localStorage and automatic redirect to login
- **LATEST**: Removed dashboard link from website header navigation
- **LATEST**: Implemented image upload functionality in dashboard replacing URL inputs with actual file upload
- Added multer middleware for secure file uploads with validation
- Created ImageUpload component with drag-and-drop functionality
- Set up uploads directory with proper static file serving
- **LATEST**: Made entire website fully dynamic with dashboard data integration
- Connected Hero, About, Projects, Skills, Partnerships, and Contact components to backend APIs
- Added public API endpoints for all website content (hero, about, projects, skills, partnerships, contact-info)
- **LATEST**: Implemented comprehensive SEO optimization features
- Created SEO component with dynamic meta tags, Open Graph, and Twitter Card support
- Added structured data (JSON-LD) for better search engine understanding
- Implemented proper meta descriptions, keywords, and canonical URLs
- Added SEO-friendly page titles and descriptions that update dynamically from dashboard content
- **LATEST**: Added professional favicon with developer branding
- Created custom SVG favicon with "M" initial, code brackets, and gradient colors
- Added fallback ICO favicon and proper Apple touch icon support
- Implemented comprehensive favicon meta tags for all devices and browsers
- **LATEST**: Implemented Google Analytics integration with measurement ID G-F6RY709B09
- Added comprehensive user interaction tracking (project clicks, form submissions, navigation)
- Created analytics utility functions for page view and event tracking
- **LATEST**: Enhanced SEO strategy for better Google search visibility
- Added robots.txt, sitemap.xml, and security.txt files for search engines
- Implemented comprehensive structured data (JSON-LD) for better search understanding
- Enhanced meta tags with proper Open Graph and Twitter Card support
- Created detailed SEO strategy document with actionable improvement plan
- **LATEST**: Fixed favicon display issues across all browsers and Google search
- Created proper ICO favicon file with multi-size support (16x16, 32x32)
- Added SVG favicon for modern browsers with clean "M" logo design
- Implemented proper caching headers for Google indexing (max-age=86400)
- Added favicon to sitemap.xml and created browserconfig.xml for Microsoft browsers
- Fixed cross-browser compatibility with comprehensive HTML meta tags
- **LATEST**: Implemented comprehensive security protection system
- Added multi-layered security with input validation, sanitization, and rate limiting
- Protected contact form with spam detection, XSS prevention, and SQL injection protection
- Implemented authentication security with password validation and login attempt limiting
- Added file upload security with type validation and path traversal prevention
- Created IP blocking system with suspicious activity monitoring
- Applied security headers (CSP, HSTS, XSS protection) and CORS protection
- Secured static file serving with extension validation and directory traversal protection
- **LATEST**: Enhanced mobile UI/UX responsiveness across all website sections
- Created custom "M" logo component with gradient design replacing text in navigation
- Added professional mobile navigation with backdrop blur and rounded styling
- Improved mobile typography and spacing throughout Hero, About, Projects, Skills, Contact, and Partnerships sections
- Implemented responsive padding, font sizes, and grid layouts optimized for mobile devices
- Enhanced button sizes and interactive elements for better mobile touch experience
- Added mobile-specific optimizations for better readability and user experience

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk/Matrix theme
- **UI Components**: Radix UI components via shadcn/ui
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Neon Database (serverless PostgreSQL)
- **Session Management**: Memory-based storage with fallback to database
- **API**: RESTful endpoints for contact form submission

### Database Schema
The application uses PostgreSQL with two main tables:
- **users**: Basic user authentication (id, username, password)
- **contacts**: Contact form submissions (id, name, email, message, createdAt)

## Key Components

### Frontend Components
- **MatrixBackground**: Animated background with falling characters and particles
- **Navigation**: Sticky navigation with smooth scrolling and progress indicator
- **Hero**: Animated hero section with typewriter effect
- **About**: Developer information in a terminal-style display
- **Projects**: Interactive project showcase with modal details
- **Skills**: Technology stack display with categorized skills
- **Contact**: Functional contact form with validation
- **Footer**: Site footer with navigation links

### Backend Components
- **Routes**: API endpoints for contact form and data retrieval
- **Storage**: Abstracted storage layer with memory and database implementations
- **Vite Integration**: Development server setup with hot module replacement

## Data Flow

1. **Contact Form Submission**:
   - User fills out contact form on frontend
   - Form data is validated using Zod schema
   - React Query sends POST request to `/api/contact`
   - Backend validates data and stores in database
   - Success/error response returned to frontend

2. **Project Display**:
   - Static project data defined in components
   - Modal system for detailed project views
   - Image carousel for project screenshots

3. **Navigation**:
   - Smooth scrolling between sections
   - Progress indicator tracks scroll position
   - Mobile-responsive hamburger menu

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives via shadcn/ui
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: CSS animations and transitions
- **Icons**: Lucide React icons

### Backend Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Validation**: Zod for schema validation
- **Session Storage**: connect-pg-simple for PostgreSQL sessions

### Development Dependencies
- **Build Tools**: Vite, esbuild
- **TypeScript**: Full TypeScript support
- **Development**: tsx for TypeScript execution
- **Replit Integration**: Cartographer and runtime error overlay

## Deployment Strategy

The application is configured for deployment with:

1. **Build Process**:
   - Frontend: Vite builds static assets to `dist/public`
   - Backend: esbuild bundles server code to `dist/index.js`
   - Database: Drizzle migrations in `migrations/` directory

2. **Environment Configuration**:
   - `DATABASE_URL` required for PostgreSQL connection
   - Development vs production environment detection
   - Static file serving in production

3. **Scripts**:
   - `dev`: Development server with hot reload
   - `build`: Production build for both frontend and backend
   - `start`: Production server
   - `db:push`: Database schema deployment

The architecture supports both development and production environments with appropriate optimizations for each. The memory storage layer allows for development without a database, while the production system uses PostgreSQL for persistence.