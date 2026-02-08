# Google Cloud Deployment Guide for Type Shift

This guide helps you deploy **Type Shift** (Frontend & Backend) to **Google Cloud Run**.

## Prerequisites
1. [Google Cloud Account](https://console.cloud.google.com/)
2. [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install) installed.
3. Billing enabled for your project.

---

## 1. Deploy the Backend (FastAPI)

Run these commands from the `backend/` directory:

```bash
# 1. Enable necessary APIs
gcloud services enable run.googleapis.com containerregistry.googleapis.com

# 2. Build and push the container
gcloud builds submit --tag gcr.io/[PROJECT_ID]/typeshift-backend

# 3. Deploy to Cloud Run
gcloud run deploy typeshift-backend \
    --image gcr.io/[PROJECT_ID]/typeshift-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```
*Take note of the Service URL provided after deployment.*

---

## 2. Deploy the Frontend (React)

Update your `.env.production` (if you have one) or the API URL in your code to point to the Backend URL from Step 1. Then run from the root directory:

```bash
# 1. Build and push the container
gcloud builds submit --tag gcr.io/[PROJECT_ID]/typeshift-frontend

# 2. Deploy to Cloud Run
gcloud run deploy typeshift-frontend \
    --image gcr.io/[PROJECT_ID]/typeshift-frontend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

---

## Important Notes
- Replace `[PROJECT_ID]` with your actual Google Cloud Project ID.
- Cloud Run by default uses Port 8080, which is configured in the Dockerfiles provided.
- Ensure CORS in `main.py` allows your frontend's production URL.
