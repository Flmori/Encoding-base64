# Auth App with Profile Picture Upload

A complete authentication system with profile picture upload functionality.

## Features

- User registration and login
- JWT authentication
- Profile picture upload
- Database persistence
- File storage management

## System Requirements

- Node.js 16+
- npm 8+
- SQLite3

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
cd server && npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

4. Start the development servers:

```bash
# Backend
cd server && npm start

# Frontend
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Profile Picture

- `POST /api/auth/upload` - Upload profile picture
  - Requires: multipart/form-data with 'profileImage' file
  - Parameters: userId

## Configuration

Environment variables in `.env`:

```
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=5MB
```

## File Storage

- Uploaded files stored in `public/uploads/`
- Filename format: `profile-{userId}-{timestamp}.ext`
- Automatic cleanup of temporary files

## Error Handling

Standard error response format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {
    // Additional debug info in development
  }
}
```

## Testing

Test the upload endpoint with curl:

```bash
curl -X POST http://localhost:5001/api/auth/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "profileImage=@test.jpg" \
  -F "userId=1"
```

## License

MIT
