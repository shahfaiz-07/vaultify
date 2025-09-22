# 🔐 Vaultify

A secure, full-stack file storage and management system built with modern web technologies. Vaultify provides user authentication, file upload/download capabilities, public file sharing, and comprehensive admin management tools.

## 🌐 Live Demo

**Frontend**: [https://vaultify-kohl.vercel.app/](https://vaultify-kohl.vercel.app/) - Deployed on Vercel  
**Backend**: Deployed on Render for reliable API services

Try out Vaultify with the live demo to explore all features including file uploads, user authentication, and admin dashboard capabilities.

## ✨ Features

### 🔑 Authentication & Authorization
- **JWT-based Authentication**: Secure login/logout with HTTP-only cookies
- **Role-based Access Control**: User and Admin roles with different permissions
- **Password Encryption**: bcrypt hashing for secure password storage
- **Protected Routes**: Client-side route protection based on authentication status

### 📁 File Management
- **Multi-format Support**: Images (JPEG, PNG, GIF, WebP), Videos (MP4, MOV, WebM), PDFs, and Text files
- **Cloud Storage**: Powered by Cloudinary for reliable file hosting
- **File Deduplication**: Intelligent storage to prevent duplicate uploads
- **Public/Private Files**: Toggle file visibility and sharing permissions
- **Download Tracking**: Monitor file download statistics
- **File Metadata**: Update filenames and privacy settings
- **File Preview**: Built-in preview for various file types

### 📊 Analytics & Admin Features
- **User Management**: Complete admin dashboard for user oversight
- **Storage Analytics**: Comprehensive storage statistics and insights
- **File Statistics**: Track uploads, downloads, and storage usage
- **Most Duplicated Files**: Identify frequently uploaded content
- **Top Uploaders**: Monitor user activity and engagement

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Customization**: 29 beautiful DaisyUI themes with Zustand-powered theme management
- **Interactive Dashboard**: Comprehensive file and user management
- **Real-time Notifications**: Toast notifications for user feedback
- **Advanced Filtering**: Search, sort, and filter files by various criteria

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **TanStack Query** - Server state management and caching
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Zustand** - Lightweight state management
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type-safe server development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Cloudinary** - Cloud-based file storage
- **Multer** - File upload middleware
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shahfaiz-07/vaultify.git
   cd vaultify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the `server` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/vaultify
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRATION=86400000
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start the application**
   ```bash
   # Development mode (runs both client and server)
   npm run dev
   
   # Or run separately
   npm run dev:client  # Frontend on http://localhost:5173
   npm run dev:server  # Backend on http://localhost:5000
   ```

## 📁 Project Structure

```
vaultify/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Auth/         # Authentication components
│   │   │   ├── Dashboard/    # Dashboard components
│   │   │   ├── Admin/        # Admin panel components
│   │   │   └── common/       # Shared components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # API client and utilities
│   │   ├── pages/            # Page components
│   │   ├── store/            # State management
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json
│
├── server/                    # Backend Express application
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── middlewares/      # Express middlewares
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── types/            # TypeScript definitions
│   │   ├── utils/            # Utility functions
│   │   └── lib/              # External service integrations
│   └── package.json
│
└── package.json              # Root package configuration
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/me` - Get current user

### File Management
- `GET /api/files/user-files` - Get user's files
- `POST /api/files/upload` - Upload new file
- `DELETE /api/files/delete/:fileId` - Delete file
- `PATCH /api/files/update/:fileId` - Update file metadata
- `GET /api/files/f/:fileId` - Get file details
- `GET /api/files/f/:fileId/download` - Download file
- `GET /api/files/stats` - Get file statistics
- `GET /api/files/public` - Get public files

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/files` - Get all files
- `GET /api/admin/files/:userId` - Get files by user
- `GET /api/admin/stats` - Get storage statistics
- `GET /api/admin/stats/:userId` - Get user statistics

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **HTTP-Only Cookies**: Secure cookie storage for tokens
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **File Type Validation**: Restricted file upload types
- **Size Limits**: Maximum file size enforcement (5MB)
- **Role-based Access**: Admin and user permission levels

## 📱 Responsive Design

Vaultify is built with a mobile-first approach:
- **Mobile** (< 640px): Optimized for touch interactions
- **Tablet** (640px - 1024px): Balanced layout with collapsible elements
- **Desktop** (> 1024px): Full-featured interface with all options visible

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Available Scripts

### Root Directory
- `npm run dev` - Start both client and server in development
- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend
- `npm run install` - Install dependencies for both client and server

### Client Directory
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server Directory
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## 🐛 Known Issues & Limitations

- File size limited to 5MB per upload
- Supported file types are restricted for security
- MongoDB connection required for all operations
- Cloudinary account needed for file storage

## ‍💻 Author

Built with ❤️ by S Faizaan Hussain

## 🔗 Links

- [Live Demo](https://vaultify-kohl.vercel.app/) - Try Vaultify now!
- [GitHub Repository](https://github.com/shahfaiz-07/vaultify)
- [Report Bug](https://github.com/shahfaiz-07/vaultify/issues)
- [Request Feature](https://github.com/shahfaiz-07/vaultify/issues)

---

⭐ If you found this project helpful, please give it a star on GitHub!