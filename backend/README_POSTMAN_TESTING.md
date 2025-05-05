
# 🧪 Testing FastAPI Auth & Admin Endpoints Using Postman

This guide provides step-by-step instructions to test your authentication and admin API endpoints with **Postman**.

---

## 🔐 Authentication Endpoints

### 1. Signup
- **Method:** POST  
- **URL:** `http://localhost:8000/api/v1/auth/signup`  
- **Body (raw JSON):**
```json
{
  "email": "user@example.com",
  "full_name": "Test User",
  "password": "StrongPassword123"
}
```

---

### 2. Login
- **Method:** POST  
- **URL:** `http://localhost:8000/api/v1/auth/login`  
- **Body (form-data OR raw JSON):**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```
- **Response:** Will return `access_token`. Save this for authenticated routes.

---

### 3. Get Current User
- **Method:** GET  
- **URL:** `http://localhost:8000/api/v1/auth/me`  
- **Authorization:** Bearer Token (paste your `access_token`)

---

### 4. Verify Account
- **Method:** POST  
- **URL:** `http://localhost:8000/api/v1/auth/verify/{verification_code}`

---

### 5. Forgot Password
- **Method:** POST  
- **URL:** `http://localhost:8000/api/v1/auth/forgot-password`  
- **Body (raw JSON):**
```json
{
  "email": "user@example.com"
}
```

---

### 6. Reset Password
- **Method:** POST  
- **URL:** `http://localhost:8000/api/v1/auth/reset-password`  
- **Body (raw JSON):**
```json
{
  "token": "your_reset_token",
  "new_password": "NewStrongPassword123"
}
```

---

### 7. Update Profile
- **Method:** PUT  
- **URL:** `http://localhost:8000/api/v1/auth/update-profile`  
- **Authorization:** Bearer Token  
- **Body (raw JSON):**
```json
{
  "full_name": "Updated Name",
  "email": "updated@example.com",
  "current_password": "StrongPassword123",
  "new_password": "NewStrongPassword456"
}
```

---

### 8. Delete Account
- **Method:** DELETE  
- **URL:** `http://localhost:8000/api/v1/auth/delete-account`  
- **Authorization:** Bearer Token  
- **Body (form-data or raw text):** Just enter the password as the body value.

---

## 🛠️ Admin Endpoints

> First, login as admin to get the admin JWT token.

---

### 1. Create User
- **Method:** POST  
- **URL:** `http://localhost:8000/api/v1/admin/users`  
- **Authorization:** Bearer Token (admin)  
- **Body (raw JSON):**
```json
{
  "email": "newuser@example.com",
  "full_name": "New User",
  "password": "StrongPassword123",
  "is_admin": false,
  "is_active": true,
  "is_verified": true
}
```

---

### 2. Get All Users
- **Method:** GET  
- **URL:** `http://localhost:8000/api/v1/admin/users?skip=0&limit=10&search=test`  
- **Authorization:** Bearer Token (admin)

---

### 3. Get User by ID
- **Method:** GET  
- **URL:** `http://localhost:8000/api/v1/admin/users/{user_id}`  
- **Authorization:** Bearer Token (admin)

---

### 4. Update User
- **Method:** PUT  
- **URL:** `http://localhost:8000/api/v1/admin/users/{user_id}`  
- **Authorization:** Bearer Token (admin)  
- **Body (raw JSON):**
```json
{
  "email": "updateduser@example.com",
  "full_name": "Updated User",
  "password": "NewStrongPassword123",
  "is_admin": false,
  "is_active": true,
  "is_verified": true
}
```

---

### 5. Delete User
- **Method:** DELETE  
- **URL:** `http://localhost:8000/api/v1/admin/users/{user_id}`  
- **Authorization:** Bearer Token (admin)



🤖 AI Model Endpoints
👤 User Endpoints (require user token)
1. Create AI Model

Method: POST
URL: http://localhost:8000/api/v1/models
Authorization: Bearer Token
Body (raw JSON):

{
  "name": "Text Summarizer",
  "description": "Summarizes long articles.",
  "is_public": true,
  "category": "nlp",
  "supported_file_types": ["txt", "pdf"]
}

2. Get All User Models

Method: GET
URL: http://localhost:8000/api/v1/models?skip=0&limit=10
Authorization: Bearer Token

3. Get Model by ID

Method: GET
URL: http://localhost:8000/api/v1/models/{model_id}
Authorization: Bearer Token

4. Update Model

Method: PUT
URL: http://localhost:8000/api/v1/models/{model_id}
Authorization: Bearer Token
Body (raw JSON):

{
  "name": "Updated Text Summarizer",
  "description": "Updated description for summarizing articles.",
  "is_public": false,
  "category": "nlp",
  "supported_file_types": ["txt", "pdf", "docx"]
}

5. Delete Model

Method: DELETE
URL: http://localhost:8000/api/v1/models/{model_id}
Authorization: Bearer Token

6. Upl7oad Model File

Method: POST
URL: http://localhost:8000/api/v1/models/{model_id}/upload-file
Authorization: Bearer Token
Body (form-data):
Key: file
Value: (Select a file to upload, e.g., model.zip)



7. Process File with Model

Method: POST
URL: http://localhost:8000/api/v1/models/{model_id}/process
Authorization: Bearer Token
Body (form-data):
Key: file
Value: (Select a file to process, e.g., input.txt)


Note: Ensure the file type matches the model's supported_file_types.

👑 Admin Endpoints (require admin token)
1. Create AI Model

Method: POST
URL: http://localhost:8000/api/v1/models
Authorization: Bearer Token (admin)
Body (raw JSON):

{
  "name": "Admin Text Summarizer",
  "description": "Admin-created summarization model.",
  "is_public": true,
  "category": "nlp",
  "supported_file_types": ["txt", "pdf"]
}

2. Get All Models

Method: GET
URL: http://localhost:8000/api/v1/models?skip=0&limit=10&owner_id={owner_id}&is_public=true&category=nlp&search=summarizer
Authorization: Bearer Token (admin)
Query Parameters (optional):
skip: Number of records to skip (default: 0)
limit: Number of records to return (default: 100)
owner_id: Filter by owner ID
is_public: Filter by public status (true/false)
category: Filter by category (e.g., nlp)
search: Search in name or description



3. Get Model by ID

Method: GET
URL: http://localhost:8000/api/v1/models/{model_id}
Authorization: Bearer Token (admin)

4. Update Model

Method: PUT
URL: http://localhost:8000/api/v1/models/{model_id}
Authorization: Bearer Token (admin)
Body (raw JSON):

{
  "name": "Updated Admin Summarizer",
  "description": "Updated admin model description.",
  "is_public": false,
  "category": "nlp",
  "supported_file_types": ["txt", "pdf", "docx"]
}

5. Delete Model

Method: DELETE
URL: http://localhost:8000/api/v1/models/{model_id}
Authorization: Bearer Token (admin)


📝 Notes

Replace {model_id} with the actual model ID from the database.
Replace {verification_code} and your_reset_token with actual values received during testing.
Ensure you have a valid Bearer Token for authenticated endpoints.
For file uploads, use the form-data body type in Postman and select the appropriate file.
Admin endpoints require an admin-level token, while user endpoints require a user-level token.

