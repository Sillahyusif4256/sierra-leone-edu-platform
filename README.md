# Sierra Leone Education Platform

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![SDG 4](https://img.shields.io/badge/SDG-4%20Quality%20Education-blue.svg)
![SDG 10](https://img.shields.io/badge/SDG-10%20Reduced%20Inequalities-purple.svg)
![SDG 17](https://img.shields.io/badge/SDG-17%20Partnerships-orange.svg)

A full-stack educational content sharing platform designed for Sierra Leone students and teachers. This platform enables the sharing, discovery, and management of educational resources to support quality education and bridge educational gaps in Sierra Leone.

## 🎯 SDG Alignment

This project aligns with the United Nations Sustainable Development Goals:

- **SDG 4: Quality Education** - Providing inclusive and equitable quality education for all
- **SDG 10: Reduced Inequalities** - Empowering underserved communities with educational resources
- **SDG 17: Partnerships for the Goals** - Collaborative platform for knowledge sharing

## 🚀 Features

### For Students
- Browse and search educational resources by subject, level, and file type
- Download resources for offline learning
- Rate and review resources
- Filter by subject (Mathematics, Science, English, ICT, etc.)
- Filter by education level (Primary, JSS, SSS, University)

### For Teachers
- Upload educational resources (PDF, images, videos, documents)
- Track download statistics on uploaded content
- Manage their resource library
- Receive feedback through ratings and comments

### For Administrators
- Approve or reject uploaded resources
- Manage user accounts and roles
- View platform statistics and analytics
- Export data as JSON for interoperability
- Monitor pending approvals

### Platform Features
- **Multi-language Support**: English and Krio language toggle
- **PWA Support**: Installable as a progressive web app
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Role-based Access Control**: Student, Teacher, and Admin roles
- **Content Moderation**: Admin approval workflow for uploaded resources
- **Comments & Ratings**: Community feedback system
- **Search & Filters**: Advanced resource discovery
- **Privacy & Terms**: Comprehensive legal framework

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Cloud file storage
- **Multer** - File upload handling

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **React Dropzone** - File upload
- **Recharts** - Data visualization

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for file storage)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sierra-leone-edu
JWT_SECRET=your_secure_random_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
sierra-leone-edu-platform/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resourceController.js
│   │   ├── commentController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Resource.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resourceRoutes.js
│   │   ├── commentRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   │   ├── manifest.json
│   │   └── sw.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Browse.jsx
│   │   │   ├── ResourceDetail.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Privacy.jsx
│   │   │   └── Terms.jsx
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── resourceStore.js
│   │   │   ├── commentStore.js
│   │   │   └── languageStore.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── LICENSE
└── README.md
```

## 🎨 Screenshots

*(Screenshots section - add actual screenshots when available)*

### Home Page
- Hero section with call-to-action buttons
- Statistics dashboard
- Featured resources
- Subject categories

### Browse Page
- Search functionality
- Advanced filters (subject, level, file type)
- Resource grid with pagination

### Resource Detail Page
- File preview
- Resource information
- Ratings and reviews
- Related resources

### Admin Panel
- Overview statistics
- Pending resource approvals
- User management
- Data export

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Resources
- `GET /api/resources/stats` - Get platform statistics
- `GET /api/resources/export` - Export all resources (JSON) [Admin]
- `POST /api/resources/upload` - Upload resource [Protected]
- `GET /api/resources` - Get all resources (with filters)
- `GET /api/resources/:id` - Get resource by ID
- `GET /api/resources/download/:id` - Download resource [Protected]
- `DELETE /api/resources/:id` - Delete resource [Protected]
- `PUT /api/resources/approve/:id` - Approve resource [Admin]
- `GET /api/resources/pending` - Get pending resources [Admin]
- `GET /api/resources/my-resources` - Get user's resources [Protected]

### Comments
- `POST /api/comments/:resourceId` - Add comment [Protected]
- `GET /api/comments/:resourceId` - Get comments
- `DELETE /api/comments/:id` - Delete comment [Protected]

### Admin
- `GET /api/admin/users` - Get all users [Admin]
- `PUT /api/admin/users/:id/role` - Update user role [Admin]
- `DELETE /api/admin/users/:id` - Delete user [Admin]

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected routes for sensitive operations
- Input validation and sanitization with express-validator
- File upload restrictions (type, size, MIME type validation)
- Rate limiting on authentication routes
- HTTP security headers with Helmet.js
- Global error boundary for React
- Admin-only endpoints

## 🌐 Language Support

The platform supports two languages:
- **English** - Primary language
- **Krio** - Sierra Leone Creole

Language preference is stored in localStorage and persists across sessions.

## 📱 PWA Features

- Installable as a progressive web app
- Offline support for static assets
- Custom app icons
- Sierra Leone green theme color (#1EB53A)
- Responsive design for all devices

## 🚀 Deployment

### Backend Deployment (Render.com)

1. Push your code to GitHub
2. Create a new web service on Render.com
3. Connect your GitHub repository
4. Set the following environment variables in Render dashboard:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://your-atlas-connection-string
   JWT_SECRET=your_secure_random_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=your_frontend_url
   ```
5. Set the start command to: `node server.js`
6. Deploy - Render will auto-deploy on push to main branch

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import your project in Vercel
3. Set the following environment variable:
   ```
   VITE_API_URL=your_backend_url
   ```
4. Deploy - Vercel will auto-deploy on push to main branch

### Environment Variables

See `backend/.env.example` for all required environment variables.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Contributors

- **Cognition AI** - Initial development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Live Demo

*(Add live demo link when deployed)*

## 📧 Contact

For questions or support:
- Email: info@sl-edu.sl
- Location: Freetown, Sierra Leone

## 🙏 Acknowledgments

- Sierra Leone Ministry of Education
- All educators contributing resources
- The open-source community

---

Built with ❤️ for Sierra Leone's educational future
