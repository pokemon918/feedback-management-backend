# Backend Service: Sentiment Analysis API

## Description

This is the backend service for a sentiment analysis application that processes and stores customer feedback. The service provides REST APIs for submitting feedback text and retrieving analyzed sentiments.

## Technical Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT-based auth

## API Endpoints

### Feedback Management
- `POST /api/feedback` - Submit new feedback text (max 1000 characters)
- `GET /api/feedback` - Retrieve all feedback entries (requires ADMIN role)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Database Schema

```sql
-- Feedback table structure
CREATE TABLE feedback (
id SERIAL PRIMARY KEY,
text VARCHAR(1000) NOT NULL,
sentiment VARCHAR(20) NOT NULL,
user_id INTEGER REFERENCES users(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sentiment_db
   DB_USER=your_user
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```

4. Start the server:
   ```bash
   npm run dev    # development
   npm start      # production
   ```

## Testing

Run the test suite:

```bash
npm test
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth & validation middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── utils/         # Helper functions
├── tests/             # Test files
└── README.md
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 500: Internal Server Error

## Security Considerations

- JWT-based authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- SQL injection protection
