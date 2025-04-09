# Authentication App with Base64 Encoding

A full-stack authentication application with React frontend and Node.js backend, featuring user registration, login, and profile management.

## Features

- User registration with username/password
- Secure login/logout functionality
- Profile dashboard with photo display
- Protected routes
- Base64 encoding for secure data transmission
- SQLite database for user storage

## Technologies Used

- Frontend:

  - React.js
  - React Router
  - Axios for API calls
  - CSS for styling

- Backend:
  - Node.js
  - Express.js
  - SQLite database
  - Base64 encoding

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd auth-app-base64
```

2. Install dependencies for both frontend and backend:

```bash
cd server && npm install
cd ../client && npm install
```

3. Configure environment variables:
   Create a `.env` file in the server directory with:

```
PORT=5001
JWT_SECRET=your_secret_key_here
```

## Running the Application

1. Start the backend server:

```bash
cd server
npm start
```

2. Start the frontend development server:

```bash
cd client
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Project Structure

```
auth-app-base64/
├── client/               # Frontend React application
│   ├── public/           # Static files
│   ├── src/              # React components
│   └── package.json      # Frontend dependencies
├── server/               # Backend Node.js server
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── package.json      # Backend dependencies
└── README.md             # This file
```

## API Endpoints

- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/verify` - Verify authentication token

## Screenshots

![Login Page](/screenshots/login.png)
![Dashboard](/screenshots/dashboard.png)

## License

MIT License

## Contact

For questions or support, please contact [your-email@example.com]
