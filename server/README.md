# Hydro Guard 180 - Backend Server

Backend REST API server for Hydro Guard 180 flood monitoring system.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seeding script
├── src/
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── routes/           # API routes
│   ├── db.js             # Prisma client
│   └── server.js         # Main server file
├── .env                  # Environment variables
├── .gitignore
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file with your database credentials:

```env
DATABASE_URL="mysql://username:password@localhost:3306/hydroguard180"
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 3. Setup Database

Make sure MySQL is running and create a database:

```sql
CREATE DATABASE hydroguard180;
```

### 4. Run Prisma Migrations

Generate Prisma client and create database tables:

```bash
npm run prisma:generate
npm run prisma:migrate
```

When prompted for a migration name, enter something like: `init`

### 5. Seed Database

Populate the database with initial data from JSON files:

```bash
npm run prisma:seed
```

This will create:
- 4 Alert levels
- 3 Users (Super Admin, Admin, Staff)
- Sample residents
- Sample water monitoring data
- System settings
- Audit logs

### 6. Start Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001`

## Default Credentials

After seeding, you can login with:

**Super Admin:**
- Username: `superadmin`
- Password: `Admin@123`

**Admin:**
- Username: `admin`
- Password: `Admin@123`

**Staff:**
- Username: `staff`
- Password: `Staff@123`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with username/email and password
- `GET /api/auth/me` - Get current user info (requires auth)
- `POST /api/auth/logout` - Logout (requires auth)

### Users

- `GET /api/users` - Get all users (requires auth)
- `GET /api/users/:id` - Get user by ID (requires auth)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Super Admin only)

### Residents

- `GET /api/residents` - Get all residents (requires auth)
- `GET /api/residents/:id` - Get resident by ID (requires auth)
- `POST /api/residents` - Create resident (requires auth)
- `PUT /api/residents/:id` - Update resident (requires auth)
- `DELETE /api/residents/:id` - Delete resident (requires auth)

### Alert Levels

- `GET /api/alert-levels` - Get all alert levels (public)
- `GET /api/alert-levels/current` - Get current alert level based on latest water reading (public)
- `GET /api/alert-levels/:level` - Get alert level by level number (public)
- `PUT /api/alert-levels/:level` - Update alert level (Admin only)

### Water Monitoring

- `GET /api/water-monitoring/latest` - Get latest water reading (public)
- `GET /api/water-monitoring/stats` - Get statistics (public)
- `GET /api/water-monitoring` - Get all readings with pagination (requires auth)
- `GET /api/water-monitoring/:id` - Get reading by ID (requires auth)
- `POST /api/water-monitoring` - Create new reading (requires auth)
- `PUT /api/water-monitoring/:id` - Update reading (requires auth)
- `DELETE /api/water-monitoring/:id` - Delete reading (requires auth)

### Settings

- `GET /api/settings` - Get system settings (public)
- `PUT /api/settings` - Update settings (Admin only)

### Audit Logs

- `GET /api/audit-logs` - Get all audit logs with filters (requires auth)
- `GET /api/audit-logs/:id` - Get audit log by ID (requires auth)
- `POST /api/audit-logs` - Create audit log entry (requires auth)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To get a token, login via `/api/auth/login`:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "superadmin", "password": "Admin@123"}'
```

## CORS

CORS is configured to allow all origins (as requested).

## Database Management

### View Database in Prisma Studio

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` to view and edit database records.

### Reset Database

```bash
npm run prisma:migrate reset
```

This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run the seed script

## Development

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Create route in `src/routes/`
3. Register route in `src/server.js`

### Database Changes

1. Modify `prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create migration
3. Update seed script if needed

## Error Handling

All errors are handled by the global error handler middleware. Errors return JSON:

```json
{
  "error": "Error message"
}
```

## Logging

Request logging is enabled via custom middleware. All requests are logged with:
- HTTP method
- Route
- Status code
- Response time

## License

ISC
