# Blogspace

Blogspace is a full-stack blogging application built with the **MERN stack** (MongoDB, Express, React, Node.js). Users can register, log in, publish blog posts, and comment on posts from other users through a responsive web interface.

The project demonstrates core full-stack concepts — RESTful API design, JWT-based authentication, client–server communication, MongoDB data modelling, and state management in React — while keeping a clean structure suitable for learning modern web development.

## Features

- **User accounts** — registration and login with hashed passwords (bcrypt) and JWT session tokens.
- **Blog posts** — create, view, and delete posts. Each post has a title, content, optional image, rating, and comment count.
- **Comments** — authenticated users can comment on any post; comments are public to read.
- **User profiles** — view and update the current user's profile via a dedicated `/profile` page.
- **Role support** — users have a `user` or `admin` role, with admins able to bypass the frontend-only request guard on user routes.
- **Email 2FA (scaffolded)** — two-factor auth via Nodemailer is wired into the backend but currently **disabled** by default.

## Tech stack

**Frontend**
- React 19 with Create React App (`react-scripts`)
- React Router 7 for client-side routing

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose 8
- `jsonwebtoken` for JWT auth, `bcryptjs` for password hashing
- `nodemailer` for email (2FA), `validator`, `cors`, `dotenv`

## Project structure

```
Blogspace/
├── backend/
│   ├── config/database.js        # MongoDB connection
│   ├── controllers/              # blog, comment, user controllers
│   ├── middleware/               # auth (JWT), encrypt, 2fa
│   ├── models/                   # Users, Blogs, Comments schemas
│   ├── routes/                   # auth, blog, comment, user routes
│   └── server.js                 # Express entry point
└── frontend/
    └── src/
        ├── components/
        │   ├── auth/             # LoginPopup, Profile, ProfileSidebar
        │   ├── blogs/            # BlogDetail, CreateBlog
        │   └── forum/            # HomePage, BlogsForum, Navbar
        └── App.js                # Routes
```

## Getting started

### Prerequisites
- Node.js (18+ recommended)
- A MongoDB database (local instance or MongoDB Atlas connection string)

### 1. Clone the repository
```bash
git clone https://github.com/Viqer/Blogspace.git
cd Blogspace
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
APP_HOST=localhost
APP_PORT=3000

# Only needed if you re-enable email 2FA
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

Start the server:
```bash
npm run dev     # with nodemon (auto-reload)
# or
npm start       # plain node
```
The API runs at `http://localhost:3000`.

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
REACT_APP_BASE_URL=http://localhost:3000
PORT=3001
```
> The backend's CORS policy expects the frontend on port **3001**, so `PORT=3001` avoids a clash with the backend on 3000.

Start the app:
```bash
npm start
```
The app runs at `http://localhost:3001`.

## API reference

Base URL: `http://localhost:3000`

### Auth — `/auth`
| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/auth/register` | — | Register with `username`, `email`, `password` |
| POST | `/auth/login` | — | Log in with `username`, `password`; returns a JWT |
| POST | `/auth/verify-2fa` | — | 2FA verification (currently disabled) |

### Blogs — `/blogs`
| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/blogs` | — | List all blog posts |
| GET | `/blogs/:id` | — | Get a single post |
| POST | `/blogs` | yes | Create a post |
| DELETE | `/blogs/:id` | yes | Delete a post |

### Comments — `/comments`
| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/comments/:blogId` | — | List comments for a post |
| POST | `/comments` | yes | Add a comment |
| DELETE | `/comments/:id` | yes | Delete a comment |

### Users — `/users`
| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/users` | — | Create a user |
| GET | `/users` | yes | List users |
| GET | `/users/me` | yes | Get the current user's profile |
| PUT | `/users/me` | yes | Update the current user's profile |
| GET | `/users/:id` | yes | Get a user by id |
| PUT | `/users/:id` | yes | Update a user |
| DELETE | `/users/:id` | yes | Delete a user |

> Authenticated routes expect an `Authorization: Bearer <token>` header. Most `/users` routes also require an `X-Requested-By: frontend` header (admins are exempt).

## Author

Rishit Gupta and Udit Tatu

The Shenanigans are unreal
