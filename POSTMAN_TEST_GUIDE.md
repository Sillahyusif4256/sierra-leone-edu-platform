# Postman Testing Guide - Sierra Leone Education Platform

## Prerequisites

1. **Install Dependencies** (run in PowerShell as Administrator):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   cd C:\Users\User\CascadeProjects\sierra-leone-edu-platform
   npm install
   ```

2. **Configure Environment Variables** in `backend/.env`:
   - Update `MONGO_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure random string
   - Add your Cloudinary credentials (cloud name, API key, API secret)

3. **Start the Server**:
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5000`

## Postman Collection Setup

### Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. Register User
- **Method**: POST
- **URL**: `/auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }
  ```
- **Response**: Returns user object with JWT token

### 2. Login User
- **Method**: POST
- **URL**: `/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns user object with JWT token

### 3. Get Current User Profile
- **Method**: GET
- **URL**: `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns current user profile

## Resource Endpoints

### 4. Upload Resource
- **Method**: POST
- **URL**: `/resources/upload`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: 
  - Type: `form-data`
  - Keys:
    - `file` (File): Select a file (PDF, image, video, or document)
    - `title` (Text): "Mathematics Textbook"
    - `description` (Text): "Comprehensive math textbook for JSS students"
    - `subject` (Text): "Mathematics"
    - `level` (Text): "JSS"
    - `fileType` (Text): "pdf"
    - `tags` (Text): "math, textbook, jss"
- **Response**: Returns created resource object

### 5. Get All Resources
- **Method**: GET
- **URL**: `/resources`
- **Query Params** (optional):
  - `subject`: "Mathematics"
  - `level`: "JSS"
  - `search`: "textbook"
  - `page`: 1
  - `limit`: 10
- **Response**: Returns paginated list of approved resources

### 6. Get Resource by ID
- **Method**: GET
- **URL**: `/resources/:id`
- **Response**: Returns single resource (increments view count)

### 7. Download Resource
- **Method**: GET
- **URL**: `/resources/download/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns file URL (increments download count)

### 8. Get My Resources
- **Method**: GET
- **URL**: `/resources/my-resources`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns resources uploaded by current user

### 9. Delete Resource
- **Method**: DELETE
- **URL**: `/resources/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

### 10. Approve Resource (Admin Only)
- **Method**: PUT
- **URL**: `/resources/approve/:id`
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response**: Returns approved resource

### 11. Get Pending Resources (Admin Only)
- **Method**: GET
- **URL**: `/resources/pending`
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response**: Returns unapproved resources

## Comment Endpoints

### 12. Add Comment
- **Method**: POST
- **URL**: `/comments/:resourceId`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
  ```json
  {
    "text": "Great resource! Very helpful.",
    "rating": 5
  }
  ```
- **Response**: Returns created comment (updates resource average rating)

### 13. Get Comments for Resource
- **Method**: GET
- **URL**: `/comments/:resourceId`
- **Response**: Returns all comments for the resource

### 14. Delete Comment
- **Method**: DELETE
- **URL**: `/comments/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message (updates resource average rating)

## Test Workflow

### Step 1: Create Test Users
1. Register a student user
2. Register a teacher user
3. Register an admin user (manually set role in database or update via MongoDB)

### Step 2: Login as Teacher
1. Login as teacher
2. Copy the JWT token

### Step 3: Upload Resources
1. Upload a few resources with different subjects and levels
2. Note the resource IDs

### Step 4: Login as Admin
1. Login as admin
2. Approve the uploaded resources

### Step 5: Test Public Access
1. Get all resources (should show approved ones)
2. Get specific resource by ID
3. Get comments for a resource

### Step 6: Test Student Actions
1. Login as student
2. Download a resource
3. Add a comment with rating
4. Try to delete own comment
5. Try to delete resource (should fail - not owner)

### Step 7: Test Admin Actions
1. Login as admin
2. Get pending resources
3. Approve a resource
4. Delete any resource (should succeed)
5. Delete any comment (should succeed)

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running locally or update MONGO_URI with Atlas connection string

### Cloudinary Upload Error
- Verify Cloudinary credentials in .env
- Ensure Cloudinary account is active

### JWT Token Error
- Ensure JWT_SECRET is set in .env
- Token expires after 30 days

### File Upload Error
- Ensure file size is under 50MB
- Check file type is supported (PDF, image, video, document)

## Environment Variables Reference

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sierra-leone-edu
JWT_SECRET=your_secure_random_string_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
