# Anarchy Codex - Backend API

A decentralized, privacy-focused backend API for the Anarchy Codex web portal built with NestJS and MongoDB.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (guest, user, moderator, admin)
  - Pseudonym-based user identity (no real names)
  - Optional Google OAuth2 integration

- **News System**
  - CRUD operations for news articles
  - Tag-based categorization
  - Author attribution with pseudonyms
  - View count tracking

- **Events Management**
  - Events linked to news articles
  - Public/private event visibility
  - Attendee management (join/leave)
  - Date and location tracking

- **Library System**
  - File upload and metadata management
  - Search functionality
  - Download tracking
  - Tag-based organization

- **Forum System**
  - Thread and message management
  - Nested replies
  - Like/unlike functionality
  - Moderation tools (pin, lock, delete)

- **Privacy & Security**
  - No IP logging
  - Pseudonym-based identities
  - Role-based permissions
  - Rate limiting

## 🛠 Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with JWT strategy
- **File Upload**: Multer (local storage, ready for GridFS/S3)
- **Validation**: class-validator, class-transformer
- **Rate Limiting**: @nestjs/throttler

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anarchy-codex/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/anarchy-codex

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d

   # OAuth Configuration (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

   # Application
   PORT=3001
   FRONTEND_URL=http://localhost:3000

   # Email Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # File Upload
   UPLOAD_DEST=./uploads
   MAX_FILE_SIZE=10485760
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or install MongoDB locally
   ```

5. **Run the application**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (moderator+)
- `GET /api/users/profile` - Get own profile
- `GET /api/users/:id` - Get user by ID (moderator+)
- `PATCH /api/users/profile` - Update own profile
- `PATCH /api/users/:id` - Update user (moderator+)
- `DELETE /api/users/:id` - Delete user (admin)

### News
- `POST /api/news` - Create news article (user+)
- `GET /api/news` - Get all published news
- `GET /api/news/tag/:tag` - Get news by tag
- `GET /api/news/:id` - Get news by ID
- `PATCH /api/news/:id` - Update news (author/moderator+)
- `DELETE /api/news/:id` - Delete news (author/moderator+)

### Events
- `POST /api/events` - Create event (user+)
- `GET /api/events` - Get all public events
- `GET /api/events/news/:newsId` - Get events by news article
- `GET /api/events/:id` - Get event by ID
- `PATCH /api/events/:id` - Update event (organizer/moderator+)
- `DELETE /api/events/:id` - Delete event (organizer/moderator+)
- `POST /api/events/:id/join` - Join event
- `POST /api/events/:id/leave` - Leave event

### Library
- `POST /api/library` - Upload file (user+)
- `GET /api/library` - Get all public files
- `GET /api/library/search` - Search files
- `GET /api/library/tag/:tag` - Get files by tag
- `GET /api/library/author/:authorId` - Get files by author
- `GET /api/library/:id` - Get file metadata
- `GET /api/library/:id/download` - Download file
- `PATCH /api/library/:id` - Update file metadata (author/moderator+)
- `DELETE /api/library/:id` - Delete file (author/moderator+)

### Forum
- `POST /api/forum/threads` - Create thread (user+)
- `GET /api/forum/threads` - Get all threads
- `GET /api/forum/threads/:id` - Get thread by ID
- `PATCH /api/forum/threads/:id` - Update thread (author/moderator+)
- `DELETE /api/forum/threads/:id` - Delete thread (author/moderator+)
- `POST /api/forum/threads/:threadId/messages` - Create message (user+)
- `GET /api/forum/threads/:threadId/messages` - Get messages by thread
- `GET /api/forum/messages/:id` - Get message by ID
- `PATCH /api/forum/messages/:id` - Update message (author/moderator+)
- `DELETE /api/forum/messages/:id` - Delete message (author/moderator+)
- `POST /api/forum/messages/:id/like` - Like/unlike message

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **Guest**: Read-only access to public content
- **User**: Can create content, manage own posts
- **Moderator**: Can moderate content, manage users
- **Admin**: Full system access

## 🏗 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # User management
├── news/                # News articles
├── events/              # Events linked to news
├── library/             # File management
├── forum/               # Forum system
├── common/              # Shared utilities
│   ├── enums/          # Enumerations
│   ├── guards/         # Authentication guards
│   └── decorators/     # Custom decorators
└── config/              # Configuration files
```

## 🚀 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run tests
npm run test

# Build for production
npm run build

# Run in production
npm run start:prod
```

## 🔧 Configuration

The application uses environment variables for configuration. See the `.env.example` section above for all available options.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Issues

Please report bugs and feature requests through the GitHub issues page.
