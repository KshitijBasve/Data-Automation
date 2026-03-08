# Automated Data Entry Web Application

A production-style full-stack application that automates company data entry workflows.

## What it does

- Uploads raw files (CSV, Excel, PDF, JSON, TXT)
- Extracts and normalizes structured rows
- Validates required fields, removes duplicates, and logs errors
- Automatically inserts clean rows into MongoDB
- Exports processed data to CSV, Excel, and JSON
- Provides an admin dashboard to monitor status and delete datasets
- Supports queue-based processing for scalable large-file workflows

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Axios

### Backend
- Node.js + Express
- REST API
- Multer, csv-parser, xlsx, pdf-parse
- Service-layer architecture

### Database
- MongoDB + Mongoose

### Queue
- In-memory worker queue (extensible to Redis/BullMQ)

---

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    queue/
    routes/
    services/
    utils/
    app.js
    server.js
frontend/
  src/
    components/
    pages/
    services/
    App.jsx
```

---

## Local Setup

### 1) Prerequisites

- Node.js 18+
- MongoDB running locally or remotely

### 2) Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` values as needed:

- `MONGODB_URI` (required)
- `PORT` (default: 5000)

Run backend:

```bash
npm run dev
```

### 3) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

If your backend is elsewhere, set:

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## API Endpoints

- `POST /api/datasets/upload` → upload + process file
- `GET /api/datasets` → list all datasets
- `GET /api/datasets/:id` → dataset details + preview records
- `DELETE /api/datasets/:id` → delete dataset and records
- `GET /api/datasets/:id/export/:format` → download export (`csv`, `excel`, `json`)

---

## Processing Flow

1. File is uploaded through dashboard
2. Backend creates dataset record (`queued`)
3. Queue worker parses file
4. Validation engine checks required fields + duplicate rows
5. Valid rows are batch inserted into MongoDB
6. Clean data is exported to CSV/Excel/JSON
7. Dashboard displays stats and errors

---

## Notes for Production

- Add authentication/authorization for admin endpoints
- Add rate limiting and WAF rules
- Persist upload/export artifacts in object storage (S3, GCS)
- Add observability (structured logs, tracing, metrics)
- Add CI with tests and linting

