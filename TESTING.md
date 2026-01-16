# API Testing Guide

Complete guide for testing the Blog Platform API.

## 🧪 Testing Methods

### 1. Using Postman

Import the provided collection: `Blog-Platform-API.postman_collection.json`

#### Setup
1. Open Postman
2. Import → Upload Files → Select `Blog-Platform-API.postman_collection.json`
3. Create environment with variable: `baseUrl = http://localhost:3000/api`

#### Test Flow
1. **Register** → Saves token automatically
2. **Login** → Saves token automatically  
3. **Get Profile** → Verifies authentication
4. **Create Blog** → Creates a test blog
5. **Get All Blogs** → Views published blogs
6. **Get My Blogs** → Views your blogs
7. **Update Blog** → Edits the blog
8. **Delete Blog** → Removes the blog

### 2. Using cURL

#### Authentication Tests

**Register User:**
```bash
# verified ok
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Login:**
```bash
# verified ok

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from response: `export TOKEN="your_token_here"`

<!-- **Get Profile:** 
```bash 
curl -X GET http://localhost:3000/api/auth/profile \ 
  -H "Authorization: Bearer $TOKEN"
``` -->

#### Blog Tests

**Create Blog:**
```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog",
    "content": "This is my blog content with detailed information.",
    "summary": "A brief summary",
    "status": "published",
    "tags": ["nodejs", "express", "postgresql"]
  }'
```

**Get All Blogs:**
```bash
curl -X GET "http://localhost:3000/api/blogs?page=1&limit=10&status=published"
```

**Get Blog by ID:**
```bash
curl -X GET http://localhost:3000/api/blogs/1
```

**Update Blog:**
```bash
curl -X PUT http://localhost:3000/api/blogs/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content",
    "status": "published"
  }'
```

**Delete Blog:**
```bash
curl -X DELETE http://localhost:3000/api/blogs/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Get My Blogs:**
```bash
curl -X GET "http://localhost:3000/api/blogs/user/my-blogs?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Search Blogs:**
```bash
curl -X GET "http://localhost:3000/api/blogs?search=nodejs&page=1&limit=10"
```

### 3. Using Browser/Frontend

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm start`
3. Open: http://localhost:4200

#### Test Scenarios

**Scenario 1: New User Registration**
1. Click "Register"
2. Fill in the form
3. Submit
4. Verify redirect to home page
5. Check navbar shows username

**Scenario 2: Login**
1. Click "Login"
2. Enter credentials
3. Submit
4. Verify redirect and authentication

**Scenario 3: Create Blog**
1. Login
2. Click "Create Blog"
3. Fill in blog details
4. Select status (draft/published)
5. Add tags
6. Submit
7. Verify redirect to "My Blogs"

**Scenario 4: View Blogs**
1. Go to home page
2. Verify published blogs are displayed
3. Click "Read More" on any blog
4. Verify blog details are shown

**Scenario 5: Edit Blog**
1. Go to "My Blogs"
2. Click "Edit" on any blog
3. Modify content
4. Submit
5. Verify changes are saved

**Scenario 6: Delete Blog**
1. Go to "My Blogs"
2. Click "Delete" on any blog
3. Confirm deletion
4. Verify blog is removed

**Scenario 7: Search**
1. Go to home page
2. Enter search term
3. Press Enter or click Search
4. Verify filtered results

**Scenario 8: Logout**
1. Click "Logout"
2. Verify redirect to login
3. Verify protected routes redirect to login

## 🔍 Test Cases

### Authentication API

| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Register with valid data | POST | /auth/register | 201 | Creates new user |
| Register with duplicate email | POST | /auth/register | 400 | Returns error |
| Login with valid credentials | POST | /auth/login | 200 | Returns token |
| Login with invalid credentials | POST | /auth/login | 401 | Returns error |
| Get profile without token | GET | /auth/profile | 401 | Access denied |
| Get profile with valid token | GET | /auth/profile | 200 | Returns user data |
| Get profile with expired token | GET | /auth/profile | 401 | Token expired |

### Blog API

| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Get all published blogs | GET | /blogs | 200 | Returns blog list |
| Get blog by valid ID | GET | /blogs/:id | 200 | Returns blog |
| Get blog by invalid ID | GET | /blogs/:id | 404 | Blog not found |
| Create blog without auth | POST | /blogs | 401 | Access denied |
| Create blog with auth | POST | /blogs | 201 | Blog created |
| Create blog without title | POST | /blogs | 400 | Validation error |
| Update own blog | PUT | /blogs/:id | 200 | Blog updated |
| Update others blog | PUT | /blogs/:id | 403 | Forbidden |
| Delete own blog | DELETE | /blogs/:id | 200 | Blog deleted |
| Delete others blog | DELETE | /blogs/:id | 403 | Forbidden |
| Get my blogs | GET | /blogs/user/my-blogs | 200 | Returns user's blogs |
| Search blogs | GET | /blogs?search=term | 200 | Returns filtered blogs |

## 🎯 Expected Responses

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // ... response data
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev mode only)"
}
```

### Authentication Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Blog List Response
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "id": 1,
        "title": "Blog Title",
        "content": "Blog content...",
        "summary": "Brief summary",
        "slug": "blog-title",
        "status": "published",
        "tags": ["nodejs", "express"],
        "publishedAt": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "author": {
          "id": 1,
          "username": "testuser",
          "email": "test@example.com",
          "firstName": "Test",
          "lastName": "User"
        }
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

## 🐛 Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution:** 
- Check if token is included in header
- Verify token hasn't expired
- Re-login to get new token

### Issue: 403 Forbidden
**Solution:**
- User trying to modify someone else's blog
- Ensure user is the blog author

### Issue: 404 Not Found
**Solution:**
- Verify blog ID exists
- Check if blog was deleted

### Issue: 400 Bad Request
**Solution:**
- Check request body validation
- Ensure required fields are provided
- Verify data types are correct

### Issue: 500 Internal Server Error
**Solution:**
- Check server logs
- Verify database connection
- Check environment variables

## 📊 Load Testing

### Using Apache Bench
```bash
# Test blog listing endpoint
ab -n 1000 -c 10 http://localhost:3000/api/blogs

# Test with authentication
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" http://localhost:3000/api/blogs/user/my-blogs
```

### Expected Performance
- Blog listing: < 100ms response time
- Blog creation: < 200ms response time
- Authentication: < 150ms response time

## ✅ Testing Checklist

### Backend API
- [ ] User registration works
- [ ] User login works
- [ ] Profile retrieval works
- [ ] Token expiration handled
- [ ] Create blog works
- [ ] Update blog works
- [ ] Delete blog works
- [ ] Get all blogs works
- [ ] Get my blogs works
- [ ] Search functionality works
- [ ] Pagination works
- [ ] Authorization prevents unauthorized access
- [ ] Validation works for all endpoints

### Frontend
- [ ] Registration form validates input
- [ ] Login form validates input
- [ ] Protected routes redirect to login
- [ ] Authenticated routes accessible
- [ ] Blog list displays correctly
- [ ] Blog detail view works
- [ ] Blog create form works
- [ ] Blog edit form works
- [ ] Blog delete confirmation works
- [ ] Search functionality works
- [ ] Pagination works
- [ ] Logout works
- [ ] Token persists on refresh
- [ ] Error messages display correctly
- [ ] Success messages display correctly

### Security
- [ ] Passwords are hashed
- [ ] JWT tokens are secure
- [ ] Authorization middleware works
- [ ] CORS configured correctly
- [ ] SQL injection prevented (Sequelize)
- [ ] XSS prevented (Angular sanitization)

## 📝 Manual Test Script

Run through these steps to verify everything works:

1. ✅ Register new user
2. ✅ Login with credentials
3. ✅ View all published blogs
4. ✅ Create a draft blog
5. ✅ Create a published blog
6. ✅ View my blogs (should see both)
7. ✅ Edit draft blog
8. ✅ Publish draft blog
9. ✅ Search for blog
10. ✅ View blog detail
11. ✅ Edit published blog
12. ✅ Delete blog
13. ✅ Logout
14. ✅ Try accessing protected route (should redirect)
15. ✅ Login again
16. ✅ Verify session persists

## 🎓 Tips for Testing

1. **Use descriptive test data** - Makes debugging easier
2. **Test edge cases** - Empty strings, very long content, special characters
3. **Test error scenarios** - Invalid IDs, unauthorized access, missing fields
4. **Test pagination** - Create enough data to test multiple pages
5. **Test search** - Various search terms, special characters
6. **Clear cache** - Between tests to ensure fresh state
7. **Monitor console** - Check for errors in browser and server logs
8. **Use network tab** - Inspect requests and responses in browser DevTools

## 📞 Need Help?

Check:
- Server logs: `pm2 logs` or console output
- Browser console (F12)
- Network tab in DevTools
- Postman console for API responses

