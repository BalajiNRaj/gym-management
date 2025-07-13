# Gym Management System

A comprehensive Gym Management System built with Next.js and Radix UI. This system helps gym owners and administrators manage memberships, packages, subscriptions, attendance, branches, and more.

## Features

- Member Management
- Package and Service Management
- Subscription Tracking
- Attendance Monitoring
- Billing Cycles
- Branch Management
- System Activities Logging

## Tech Stack

- **Frontend**: Next.js, Radix UI
- **Backend**: Next.js API Routes
- **Data**: TypeScript interfaces with mock data
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18.x or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gym-management.git
cd gym-management
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add the following:

```
NEXTAUTH_SECRET=yoursecretkey
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` - Next.js app router pages and layouts
- `src/app/api/` - API routes
- `src/components/` - React components
- `src/lib/` - Utility functions
- `src/models/` - TypeScript interfaces and mock data

## Authentication System

This application uses **NextAuth.js** with **MongoDB** for secure authentication and session management.

### Required Dependencies

The following packages are **essential** for the authentication system:

1. **`bcryptjs`** - Password hashing and verification
   - Required for secure password storage
   - Industry standard for password encryption
   - Provides salt rounds for enhanced security

2. **`next-auth`** - Complete authentication solution for Next.js
   - Handles login/logout flows
   - Session management with JWT tokens
   - Secure credential validation
   - Built-in CSRF protection

3. **`mongodb`** - Official MongoDB Node.js driver
   - Direct database connection and operations
   - User storage and retrieval
   - Better performance than ODM solutions like Mongoose

4. **`@next-auth/mongodb-adapter`** (Optional)
   - Only needed if you want to store sessions in MongoDB
   - Not required for JWT-based sessions (our current setup)
   - Can be added later if database session storage is preferred

### Authentication Features

- **Secure Login/Registration**: Email and password based authentication
- **Password Hashing**: Bcrypt with salt rounds for security
- **JWT Sessions**: Stateless session management
- **Role-Based Access**: Admin and regular user roles
- **Protected Routes**: Middleware protection for dashboard routes
- **Auto-Generated Account Numbers**: Sequential account numbering system

### Default Admin Account

After running the database setup, you can log in with:
- **Email**: admin@gym.com
- **Password**: admin123
- **Role**: Admin
- **Account Number**: 000000000001

### Setup Instructions

1. **Configure Environment Variables** (.env.local):
   ```bash
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   MONGODB_URI=your-mongodb-connection-string
   ```

2. **Run Database Setup**:
   ```bash
   npm run setup-db
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   - Landing page: http://localhost:3000
   - Click "Get Started" or "Sign In" to access authentication
   - Use the admin credentials to log in
   - Access dashboard at: http://localhost:3000/dashboard

### Authentication Flow

1. **Registration**: New users can create accounts with automatic account number generation
2. **Login**: Credential verification against MongoDB stored users
3. **Session Management**: JWT tokens store user information
4. **Route Protection**: Middleware protects /dashboard/* routes
5. **Logout**: Secure session termination and redirect

### Security Features

- Password strength validation (minimum 6 characters)
- Email format validation
- Duplicate email prevention
- Secure password hashing with bcrypt
- CSRF protection via NextAuth.js
- Secure JWT token handling
- Protected API routes

### API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints (login, logout, session)
- `GET /api/auth/[...nextauth]` - NextAuth.js session verification

## License

MIT
