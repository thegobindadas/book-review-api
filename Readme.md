# Book Review API

This is the backend API for a **Book Review** application built using **Node.js**, **Express**, and **MongoDB**. It provides a RESTful interface for managing books, user reviews, authentication, and more.


---
## 🛠️ Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB ODM
- **JWT** – Authentication
- **Bcrypt** – Password hashing
- **dotenv** – Environment variable manager
- **CORS** – Cross-Origin Resource Sharing
- **cookie-parser** – Cookie handling
- **mongoose-aggregate-paginate-v2** – Pagination for aggregation queries
---



## ⚙️ Project Setup Instructions

Follow these steps to set up the project locally:

1. Clone the repository:
```bash
git clone https://github.com/thegobindadas/book-review-api.git
```
2. Navigate to the project directory:
```bash
cd  book-review-api
```
3. Create `.env` file in the root folder and and add the following credentials:
```bash
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster0.nyvnywq.mongodb.net
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_jwt_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_jwt_secret_key
REFRESH_TOKEN_EXPIRY=10d
```



##  🚀 How to Run Locally

Follow these steps to tun the project locally:

1. Ensure you have followed the Project Setup Instructions and created the .env file.

2. Start the development server:
```bash
npm run dev
```

3. Verify that the server is running by opening a browser or API client and navigating to:
```bash
http://localhost:8000
````
4. API Base URL:
```bash
http://localhost:8000/api/v1
````


##  📬 Example API Requests with Postman

1. Base URL : `http://localhost:8000/api/v1`



---

### 🧾 Authentication - signup

**POST** `/users/signup`

**Request Body:**
```json
{
   "username": "your_username",
   "email": "user@example.com",
   "password": "yourPassword123"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "_id": "your_id",
        "username": "your_username",
        "email": "user@example.com",
        "createdAt": "time"
    },
    "message": "User registered successfully.",
    "success": true
}
```



### 🧾 Authentication - login

**POST** `/users/login`

**Request Body:**
```json
{
   "username": "your_username",
   "email": "user@example.com",
   "password": "yourPassword123"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "_id": "your_id",
        "username": "your_username",
        "email": "user@example.com",
        "createdAt": "time"
    },
    "message": "User login successfully.",
    "success": true
}
```







## 📘 Schema Design

This API uses MongoDB with Mongoose to model its data. Below are the main schemas used:

---

### 🔹 User Schema

| Field         | Type     | Description                    |
|---------------|----------|--------------------------------|
| `username`    | String   | Unique, lowercased, indexed    |
| `email`       | String   | Unique, lowercased, trimmed    |
| `password`    | String   | Hashed password                |
| `refreshToken`| String   | Used for refresh token auth    |
| `timestamps`  | Object   | CreatedAt and UpdatedAt        |

---

### 🔹 Book Schema

| Field           | Type       | Description                         |
|------------------|------------|-------------------------------------|
| `title`          | String     | Required, trimmed, indexed          |
| `author`         | String     | Required, trimmed, indexed          |
| `genre`          | String     | Required, trimmed, indexed          |
| `description`    | String     | Optional                            |
| `publishedDate`  | Date       | Optional publication date           |
| `createdBy`      | ObjectId   | Reference to User who created book  |
| `timestamps`     | Object     | CreatedAt and UpdatedAt             |

---

### 🔹 Review Schema

| Field     | Type     | Description                       |
|-----------|----------|-----------------------------------|
| `book`    | ObjectId | Reference to the reviewed book     |
| `user`    | ObjectId | Reference to the user who reviewed |
| `rating`  | Number   | Required rating from 1 to 5        |
| `comment` | String   | Optional comment text              |
| `timestamps` | Object| CreatedAt and UpdatedAt            |

---

### 🔄 Relationships

- A **User** can:
  - Create multiple **Books**
  - Write multiple **Reviews**
- A **Book** can:
  - Receive multiple **Reviews**
- A **Review** is:
  - Linked to a single **User** and a single **Book**