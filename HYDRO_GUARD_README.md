# Hydro Guard 180

A comprehensive flood monitoring and emergency response web application for Barangay 180, Caloocan City.

## Features

### Public Website
- **Homepage**: Hero section with current alert level display and call-to-action buttons
- **About Page**: Barangay profile, demographics, and population statistics
- **FAQ Page**: Searchable accordion-style frequently asked questions
- **Training Page**: Emergency preparedness education, evacuation procedures, and safety protocols
- **Contact Page**: Contact form, emergency hotlines, and barangay information
- **Login Page**: Secure authentication with password validation

### Admin Dashboard
- **Dashboard Overview**: System status, current alert level, and quick stats
- **User Management**: Create, edit, archive, and manage system users (Admin/Super Admin only)
- **Resident Directory**: Maintain emergency contact database with export functionality
- **Water Monitoring**: View real-time and historical water level data with filtering
- **Alert Levels**: View current alert status and safety protocols for all 4 levels
- **Analytics**: Statistical analysis and data insights (no graphs, text-based)

## Alert Level System

- **Level 1 - Normal** (0-60cm): Minimal risk, no flooding expected
- **Level 2 - Advisory** (61-80cm): Low to moderate risk, water rising
- **Level 3 - Warning** (81-100cm): High risk, minor flooding possible
- **Level 4 - Critical** (>100cm): Severe risk, immediate evacuation required

## Technology Stack

- **Frontend**: React with TypeScript
- **Routing**: React Router (Data Mode)
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **UI Components**: Radix UI / shadcn/ui
- **Data Storage**: JSON files (simulated database)

## Demo Credentials

### Super Admin
- Username: `superadmin`
- Password: `Admin@123`

### Admin
- Username: `admin`
- Password: `Admin@123`

### Staff
- Username: `staff`
- Password: `Staff@123`

## Database Structure

All data is stored in `/src/database/` as JSON files:

- `users.json` - System user accounts
- `residents.json` - Resident emergency contact directory
- `water-monitoring.json` - Water level readings from IoT device
- `alert-levels.json` - Alert level configuration and protocols
- `audit-logs.json` - System audit trail

## Key Pages & Routes

### Public Routes
- `/` - Homepage
- `/about` - About Barangay 180
- `/faq` - Frequently Asked Questions
- `/training` - Emergency Training
- `/contact` - Contact Information
- `/login` - User Login

### Protected Routes (Requires Authentication)
- `/dashboard` - Dashboard Overview
- `/dashboard/users` - User Management (Admin only)
- `/dashboard/residents` - Resident Directory
- `/dashboard/monitoring` - Water Monitoring
- `/dashboard/alerts` - Alert Levels & Protocols
- `/dashboard/analytics` - Analytics & Statistics

## Features Implementation

### Authentication
- Local storage-based session management
- Role-based access control (Super Admin, Admin, Staff)
- Password requirements: minimum 8 characters, 1 number, 1 special character
- Protected routes with automatic redirect to login

### Data Management
- Full CRUD operations for users and residents
- Soft delete (archive) before permanent deletion
- Audit logging for all critical actions
- Export to CSV functionality

### Water Monitoring
- Real-time display of latest readings
- Historical data with filtering by date and alert level
- Manual reading entry capability
- Automatic alert level classification based on water level

### User Permissions
- **Super Admin**: Full access, can permanently delete records
- **Admin**: Can manage users (except Super Admin role assignment) and all data
- **Staff**: Can view and manage residents and monitoring data

## Color Palette

- Primary Accent: `#FF6A00`
- Dark Neutral: `#26343A`
- Action Blue: `#2563EB`
- Background: `#F3F4F6`
- Text: `#1F2937`
- Alert Colors:
  - Green (Normal): `#22C55E`
  - Yellow (Advisory): `#FACC15`
  - Orange (Warning): `#FB923C`
  - Red (Critical): `#EF4444`

## Design Principles

- Continuous layout flow with minimal visual gaps
- Subtle dividers instead of heavy card separation
- Unified background containers
- Clean and structured interface
- Responsive design for mobile and desktop
- Smooth animations and transitions

## Notes

- This is a demonstration application using local JSON files as a database
- In production, this would be connected to a real backend (Node.js/Express) with MySQL
- IoT device integration would use WebSocket (Socket.io) for real-time updates
- Export functionality currently generates CSV files
- All data persists only in browser memory during the session

## Future Enhancements (Production)

- Real database integration (MySQL)
- WebSocket connection for live IoT device data
- SMS/Email notification system
- Map integration for evacuation routes
- PDF export for reports
- Multi-language support
- Mobile app version
- Historical trend analysis with charts
