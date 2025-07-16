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