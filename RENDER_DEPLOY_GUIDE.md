# Deployment Guide for Render.com

This guide helps you deploy **Type Shift** (Frontend & Backend) to **Render.com** using the Blueprint feature.

## Steps to Deploy

1.  **Push your code to GitHub**:
    *   Create a new repository on GitHub.
    *   Push all files in this directory (including `render.yaml`) to that repository.

2.  **Connect to Render**:
    *   Go to [Render.com](https://dashboard.render.com/) and log in.
    *   Click **"New +"** and select **"Blueprint"**.
    *   Connect your GitHub repository.

3.  **Deploy**:
    *   Render will automatically detect the `render.yaml` file.
    *   It will show you two services: `typeshift-backend` and `typeshift-frontend`.
    *   Click **"Apply"**.

## Post-Deployment Configuration (CORS)

Once the backend is live, note its URL (e.g., `https://typeshift-backend.onrender.com`).

1.  Open `backend/main.py`.
2.  Update the `allow_origins` in the CORS middleware to include your frontend URL.
    ```python
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://typeshift-frontend.onrender.com"], # Add your frontend URL here
        ...
    )
    ```
3. Push the change to GitHub, and Render will redeploy automatically.
