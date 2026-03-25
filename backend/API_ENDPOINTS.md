# API Endpoints - Music Practice PWA Backend

## Base URL
- Development: `http://localhost:3000`
- Production: TBD

## Authentication
Most endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## 🔐 Authentication (`/api/auth`)

### POST `/api/auth/register`
Register a new user
- **Body**: `{ name, email, password, instruments[] }`
- **Response**: `{ user, token }`

### POST `/api/auth/login`
Login user
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`
- **Rate limit**: 5 attempts/minute

### POST `/api/auth/forgot-password`
Request password reset
- **Body**: `{ email }`
- **Response**: `{ message }`

### POST `/api/auth/reset-password`
Reset password with token
- **Body**: `{ token, newPassword }`
- **Response**: `{ message }`

---

## 👤 Users (`/api/users`)
*All routes require authentication*

### GET `/api/users/profile`
Get current user profile
- **Response**: `{ user }`

### PUT `/api/users/profile`
Update user profile
- **Body**: `{ name?, instruments[]? }`
- **Response**: `{ user }`

### PUT `/api/users/password`
Change password
- **Body**: `{ currentPassword, newPassword }`
- **Response**: `{ message }`

### GET `/api/users/stats`
Get user statistics
- **Response**: `{ totalMinutes, sessionCount, currentLevel, streak }`

---

## 📚 Books (`/api/books`)
*All routes require authentication*

### GET `/api/books`
List all books
- **Query**: `?search=<text>&instrument=<PIANO|BASS|DRUMS|GUITAR>`
- **Response**: `{ books[] }`

### POST `/api/books`
Upload new book (multipart/form-data)
- **Body**: `{ name, instrument, description?, file }`
- **Response**: `{ book }`
- **Max file size**: 50MB (PDF only)

### GET `/api/books/:id`
Get book details
- **Response**: `{ book }`

### PUT `/api/books/:id`
Update book
- **Body**: `{ name?, instrument?, description? }`
- **Response**: `{ book }`

### DELETE `/api/books/:id`
Delete book and file
- **Response**: `{ message }`

---

## 🎵 Exercises (`/api/exercises`)
*All routes require authentication*

### GET `/api/exercises`
List exercises
- **Query**: `?search=<text>&bookId=<id>&difficulty=<BASIC|INTERMEDIATE|ADVANCED>`
- **Response**: `{ exercises[] }`

### POST `/api/exercises`
Create exercise
- **Body**: `{ name, description?, bookId, pages, difficulty, notes? }`
- **Response**: `{ exercise }`

### GET `/api/exercises/:id`
Get exercise details
- **Response**: `{ exercise }`

### PUT `/api/exercises/:id`
Update exercise
- **Body**: `{ name?, description?, pages?, difficulty?, notes? }`
- **Response**: `{ exercise }`

### DELETE `/api/exercises/:id`
Delete exercise
- **Response**: `{ message }`
- **Note**: Cannot delete if used in sessions (onDelete: Restrict)

---

## ⏱️ Sessions (`/api/sessions`)
*All routes require authentication*

### GET `/api/sessions`
List sessions with pagination
- **Query**: `?page=1&limit=20&startDate=<ISO>&endDate=<ISO>`
- **Response**: `{ sessions[], total, page, limit }`

### POST `/api/sessions`
Create session
- **Body**: `{ date, durationMinutes, exercises[{ exerciseId, durationMinutes }], notes? }`
- **Response**: `{ session, levelChanged, newLevel?, goalsCompleted[] }`

### GET `/api/sessions/:id`
Get session details
- **Response**: `{ session }`

### PUT `/api/sessions/:id`
Update session (only within 24h)
- **Body**: `{ date?, durationMinutes?, exercises[]?, notes? }`
- **Response**: `{ session }`

### DELETE `/api/sessions/:id`
Delete session
- **Response**: `{ message }`

---

## 📊 Levels (`/api/levels`)
*All routes require authentication*

### GET `/api/levels/current`
Get current level and progress
- **Response**: `{ level, progress: { totalHours, consistency, exerciseVariety, nextLevel, requirements } }`

### GET `/api/levels/history`
Get level history
- **Response**: `{ history[] }`

---

## 📈 Dashboard (`/api/dashboard`)
*All routes require authentication*

### GET `/api/dashboard/stats`
Get general statistics
- **Query**: `?startDate=<ISO>&endDate=<ISO>`
- **Response**: `{ totalMinutes, averageDaily, averageWeekly, streak, sessionCount }`

### GET `/api/dashboard/practice-chart`
Get practice chart data
- **Query**: `?days=30`
- **Response**: `{ data: [{ date, minutes }] }`

### GET `/api/dashboard/instrument-distribution`
Get instrument distribution
- **Query**: `?startDate=<ISO>&endDate=<ISO>`
- **Response**: `{ data: [{ instrument, minutes, percentage }] }`

### GET `/api/dashboard/top-exercises`
Get top exercises
- **Query**: `?limit=5`
- **Response**: `{ exercises: [{ exercise, totalMinutes, sessionCount }] }`

---

## 🎯 Goals (`/api/goals`)
*All routes require authentication*

### GET `/api/goals`
List goals
- **Query**: `?active=true|false`
- **Response**: `{ goals[] }`

### POST `/api/goals`
Create goal
- **Body**: `{ type: 'DAILY'|'WEEKLY', targetMinutes, startDate }`
- **Response**: `{ goal }`

### GET `/api/goals/:id`
Get goal with progress
- **Response**: `{ goal, progress: { currentMinutes, percentage, completed } }`

### PUT `/api/goals/:id`
Update goal
- **Body**: `{ targetMinutes?, active? }`
- **Response**: `{ goal }`

### DELETE `/api/goals/:id`
Delete goal
- **Response**: `{ message }`

---

## 💡 Recommendations (`/api/recommendations`)
*All routes require authentication*

### GET `/api/recommendations`
Get personalized recommendations
- **Response**: `{ recommendations: [{ type, message, priority }] }`
- **Max**: 5 recommendations

---

## 🔮 Predictions (`/api/predictions`)
*All routes require authentication*

### GET `/api/predictions/next-level`
Predict next level achievement
- **Response**: `{ currentLevel, nextLevel, estimatedDate, scenarios[], currentMetrics, requiredMetrics }` or `null`
- **Note**: Returns null if <7 days of data or already at max level

---

## 📥 Export (`/api/export`)
*All routes require authentication*

### GET `/api/export/data`
Export all user data as JSON
- **Response**: JSON file download
- **Filename**: `data-export-YYYY-MM-DD.json`

### GET `/api/export/stats?format=csv`
Export statistics as CSV
- **Response**: CSV file download
- **Filename**: `practice-stats-YYYY-MM-DD.csv`

---

## 🏥 Health Check

### GET `/health`
Check server status
- **Response**: `{ status: 'ok', timestamp }`
- **No authentication required**

---

## Error Responses

All endpoints return errors in the format:
```json
{
  "error": "Error message",
  "details": [] // Optional, for validation errors
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Rate Limits
- Login endpoint: 5 attempts per minute
- All other API endpoints: 100 requests per 15 minutes

---

## Notes
- All dates should be in ISO 8601 format
- File uploads use multipart/form-data
- JWT tokens expire after configured time (check JWT_EXPIRES_IN env var)
- Sessions can only be edited within 24 hours of creation
