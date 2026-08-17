# Practice Session App

A full-stack practice-session manager built with **React Native**, **Expo**, **TypeScript**, **Expo Router**, **NativeWind**, **Zustand**, **FastAPI**, **SQLAlchemy**, and **PostgreSQL**.

The mobile application lets users create, view, edit, complete, and delete practice sessions. The deployed backend is available at [`https://vani-practice-app.onrender.com`](https://vani-practice-app.onrender.com), with interactive API documentation at [`/docs`](https://vani-practice-app.onrender.com/docs).

## Features

- View all practice sessions with title, description, duration, difficulty, and status.
- View dynamically calculated statistics for total sessions, completed sessions, and total practice time.
- Create a new practice session.
- Edit an existing practice session.
- Mark a pending practice as completed.
- Delete a practice session.
- Client-side validation for title, description, duration, and difficulty.
- Loading states for fetching, creating, updating, completing, and deleting practices.
- Error states with retry support when loading fails.
- Empty state for a newly initialized database.
- Automatic list updates after every successful mutation without manual refresh.
- Light and dark themes.
- Reusable components and safe-area handling for mobile devices.

## Technology Stack

| Layer              | Technology                      |
| ------------------ | ------------------------------- |
| Mobile application | React Native with Expo          |
| Language           | TypeScript                      |
| Navigation         | Expo Router                     |
| Styling            | NativeWind                      |
| State management   | Zustand                         |
| Backend            | Python FastAPI                  |
| Validation         | Pydantic                        |
| Database access    | SQLAlchemy 2.x                  |
| Database           | PostgreSQL                      |
| Backend hosting    | Render                          |
| Android builds     | Expo Application Services (EAS) |

## Application Structure

```text
app/
├── index.tsx              # Practice list/home screen
└── practice/
    ├── new.tsx            # Add practice screen
    └── [id].tsx           # Practice detail/edit screen

components/
├── PracticeCard.tsx
├── Screen.tsx
├── LoadingState.tsx
├── ErrorState.tsx
└── EmptyState.tsx

services/
└── practiceApi.ts         # Centralized API service

store/
└── practiceStore.ts       # Zustand practice state
```

The backend follows a layered structure consisting of routes, Pydantic schemas, services, SQLAlchemy models, database configuration, and health checks.

## Requirements

Install the following before running the project locally:

- Node.js and npm, Yarn, or pnpm.
- Python 3.10 or newer for local backend development.
- PostgreSQL for local database development.
- Expo CLI or the Expo toolchain used by the project.
- Android Studio and an Android emulator, or a physical Android device, for Android testing.

## Configuration

### Mobile API URL

Configure the mobile application with the backend base URL. The variable name may differ depending on the environment configuration used by the project; the example below uses Expo’s public environment-variable convention.

```env
EXPO_PUBLIC_API_URL=https://vani-practice-app.onrender.com
```

For local development, use the address of the running FastAPI server. When testing on a physical device, do not use `localhost`; use a LAN-accessible address or the deployed backend URL.

### Backend database URL

The backend reads the PostgreSQL connection string from `DATABASE_URL`.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/practice_db
```

The production backend uses a PostgreSQL database hosted through Render. Keep database credentials in environment variables and do not commit them to the repository.

## Running the Project Locally

### Backend

```bash
cd backend
python -m venv .venv

# macOS/Linux
source .venv/bin/activate

# Windows PowerShell
# .venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn app.main:app --reload
```

The local API is normally available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### Mobile application

From the mobile project directory:

```bash
npm install
npx expo start
```

Use the Expo developer menu to open the application on an emulator, simulator, or physical device.

## Android APK Build

The project is configured for EAS Android builds. To generate the configured preview APK:

```bash
eas build --platform android --profile preview
```

The generated build can be installed as a standalone Android application without requiring Expo Go.

## API Reference

### Base URL

```text
https://vani-practice-app.onrender.com
```

### Endpoints

| Method   | Endpoint                            | Description                   | Success response |
| -------- | ----------------------------------- | ----------------------------- | ---------------- |
| `GET`    | `/practices`                        | Retrieve all practices.       | `200 OK`         |
| `POST`   | `/practices`                        | Create a practice.            | `201 Created`    |
| `PUT`    | `/practices/{practice_id}`          | Update a practice.            | `200 OK`         |
| `PATCH`  | `/practices/{practice_id}/complete` | Mark a practice as completed. | `200 OK`         |
| `DELETE` | `/practices/{practice_id}`          | Delete a practice.            | `204 No Content` |
| `GET`    | `/health`                           | Check application health.     | `200 OK`         |
| `GET`    | `/health/db`                        | Check database connectivity.  | `200 OK`         |

The deployed API uses the path parameter name `practice_id`. For example:

```text
PUT /practices/1
PATCH /practices/1/complete
DELETE /practices/1
```

### Practice fields

| Field         | Type      | Values or constraints                      |
| ------------- | --------- | ------------------------------------------ |
| `id`          | integer   | Unique practice identifier.                |
| `title`       | string    | Required; maximum 200 characters.          |
| `description` | string    | Required and non-empty.                    |
| `duration`    | integer   | Required and greater than `0`.             |
| `difficulty`  | string    | `beginner`, `intermediate`, or `advanced`. |
| `status`      | string    | `pending` or `completed`.                  |
| `created_at`  | date-time | Set by the backend.                        |
| `updated_at`  | date-time | Updated by the backend.                    |

### Create a practice

`POST /practices` requires the following JSON body:

```json
{
  "title": "Daily Introduction Practice",
  "description": "Practice introducing yourself clearly and confidently.",
  "duration": 15,
  "difficulty": "beginner"
}
```

The backend initially assigns the status as `pending`.

Example response:

```json
{
  "id": 1,
  "title": "Daily Introduction Practice",
  "description": "Practice introducing yourself clearly and confidently.",
  "duration": 15,
  "difficulty": "beginner",
  "status": "pending",
  "created_at": "2026-08-17T10:00:00Z",
  "updated_at": "2026-08-17T10:00:00Z"
}
```

### Update a practice

`PUT /practices/{practice_id}` accepts editable practice fields. The current implementation supports updating fields individually.

```json
{
  "title": "Updated Introduction Practice",
  "description": "Practice a structured self-introduction.",
  "duration": 20,
  "difficulty": "intermediate",
  "status": "pending"
}
```

### Complete a practice

`PATCH /practices/{practice_id}/complete` does not require a request body.

```bash
curl -X PATCH \
  https://vani-practice-app.onrender.com/practices/1/complete
```

The response contains the updated practice with:

```json
{
  "status": "completed"
}
```

### Delete a practice

`DELETE /practices/{practice_id}` does not require a request body and returns `204 No Content` when deletion succeeds.

```bash
curl -X DELETE \
  https://vani-practice-app.onrender.com/practices/1
```

### Validation errors

Invalid request data returns a FastAPI validation response, usually with status `422`:

```json
{
  "detail": [
    {
      "loc": ["body", "duration"],
      "msg": "Input should be greater than 0",
      "type": "greater_than"
    }
  ]
}
```

## State and API Integration

All practice data is managed by the Zustand store, which acts as the single source of truth for the list displayed by the application. The store maintains the current practices, loading state, and error state.

Network operations are centralized in `services/practiceApi.ts`. The shared request logic handles URL construction, HTTP methods, JSON bodies, response parsing, HTTP errors, and `204 No Content` responses.

After a successful mutation, the store updates immediately from the API result:

| Operation | API call                         | Store update                  |
| --------- | -------------------------------- | ----------------------------- |
| Create    | `POST /practices`                | Add the returned practice.    |
| Edit      | `PUT /practices/{id}`            | Replace the updated practice. |
| Complete  | `PATCH /practices/{id}/complete` | Update the practice status.   |
| Delete    | `DELETE /practices/{id}`         | Remove the practice locally.  |

This keeps the list synchronized without requiring a manual reload.

## Validation and UI States

The forms validate title, description, duration, and difficulty before making API requests. The Save control is disabled while a create or update request is in progress and displays a saving state to prevent duplicate submissions.

The application provides separate UI states for initial loading, practice-detail loading, mutation progress, API failures, retryable list-loading errors, and an empty practice list.

## Production Services

| Service        | URL                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| Production API | [`https://vani-practice-app.onrender.com`](https://vani-practice-app.onrender.com)                           |
| Swagger UI     | [`https://vani-practice-app.onrender.com/docs`](https://vani-practice-app.onrender.com/docs)                 |
| OpenAPI schema | [`https://vani-practice-app.onrender.com/openapi.json`](https://vani-practice-app.onrender.com/openapi.json) |
