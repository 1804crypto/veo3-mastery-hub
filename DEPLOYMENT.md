# VEO3 Mastery Hub - Production Deployment Guide

This document provides a complete, step-by-step recipe for deploying the VEO3 Mastery Hub application to a scalable, secure production environment.

## Architecture Overview

The production architecture consists of three main components:
- **Frontend**: A React single-page application hosted on **Vercel** for optimal performance and global CDN distribution.
- **Backend**: A Node.js/Express API server hosted on **Render** as a Web Service.
- **Database**: A managed PostgreSQL database hosted on **Render** for reliability and ease of use.

---

## Prerequisites

Before you begin, ensure you have the following:
1.  A **GitHub**, **GitLab**, or **Bitbucket** account with this project's code pushed to a repository.
2.  A **Vercel** account.
3.  A **Render** account.
4.  A **Stripe** account with API keys (publishable and secret) and a configured product/price for your subscription.

---

## Part 1: Database Deployment (Render PostgreSQL)

First, we'll set up the database, which the backend will connect to.

1.  **Create a New PostgreSQL Instance:**
    - In the Render Dashboard, click **New +** > **PostgreSQL**.
    - Give your database a unique name (e.g., `veo3-mastery-db`).
    - Select a region closest to your expected user base.
    - Click **Create Database**.

2.  **Obtain the Database URL:**
    - Once the database is created, navigate to its page.
    - In the **Info** section, find the **Internal Connection String**. It will look like `postgres://...`.
    - **Copy this string.** This is your `DATABASE_URL`. We use the *internal* string because both the database and backend will be on Render's internal network, which is more secure and has lower latency.

---

## Part 2: Backend Deployment (Render Node.js Service)

Next, we deploy the server application.

1.  **Create a New Web Service:**
    - In the Render Dashboard, click **New +** > **Web Service**.
    - Connect the Git repository containing your project.
    - In the settings:
        - **Name**: `veo3-mastery-server` (or your preference).
        - **Root Directory**: `server` (since the backend code is in a subdirectory).
        - **Runtime**: `Node`.
        - **Build Command**: `npm install && npx prisma generate && npm run build`
        - **Start Command**: `npm start`
        - **Instance Type**: `Starter` is fine for development, but consider `Standard` or higher for production.

2.  **Configure Environment Variables:**
    - Go to the **Environment** tab of your new service.
    - Under **Secret Files**, click **Add Secret File**.
    - **Filename**: `.env`
    - **Contents**: Paste the following, replacing placeholders with your actual secrets.

    ```env
    # Database Connection (from Part 1)
    DATABASE_URL=postgres://user:password@host/database

    # Security - Use strong, randomly generated strings
    JWT_SECRET=your_super_secret_jwt_string_of_at_least_32_chars

    # Gemini API Key
    GEMINI_API_KEY=your_google_ai_studio_api_key

    # Stripe Keys (use your LIVE keys for production)
    STRIPE_SECRET_KEY=sk_live_...
    STRIPE_WEBHOOK_SECRET=whsec_... # We will get this in the next part

    # Client URLs (replace with your Vercel frontend URL after it's deployed in Part 4)
    CLIENT_ORIGIN=https://your-frontend-app.vercel.app
    CLIENT_SUCCESS_URL=https://your-frontend-app.vercel.app?payment=success
    CLIENT_CANCEL_URL=https://your-frontend-app.vercel.app?payment=cancelled

    # Server Configuration
    PORT=8080
    NODE_ENV=production
    ```
    - **Important**: Save the changes. Render will trigger an initial deployment. It may fail because the database schema isn't set up yet. This is expected.

3.  **Run Database Migrations:**
    - Go to your newly created web service's page in Render.
    - Open the **Shell** tab.
    - Run the migration command: `npx prisma migrate deploy`
    - This will apply the schema from `prisma/schema.prisma` to your live database.
    - After the migrations complete, go to the **Events** tab and trigger a manual deploy to restart the server with the correct schema.

4.  **Note the Backend URL:**
    - Once deployed successfully, your backend will have a public URL like `https://veo3-mastery-server.onrender.com`.
    - **Copy this URL.** You will need it for the frontend and Stripe.

---

## Part 3: Stripe Webhook Configuration

This step ensures that Stripe can notify your backend about subscription events.

1.  **Create a Webhook Endpoint in Stripe:**
    - Go to your Stripe Dashboard > **Developers** > **Webhooks**.
    - Click **+ Add endpoint**.
    - **Endpoint URL**: Paste your Render backend URL and append the webhook path: `https://veo3-mastery-server.onrender.com/api/payments/stripe-webhook`.
    - **Listen to**: Click "Select events" and add the following:
        - `checkout.session.completed`
        - `invoice.payment_succeeded`
        - `customer.subscription.deleted`
        - `invoice.payment_failed`
    - Click **Add endpoint**.

2.  **Get the Webhook Secret:**
    - After creating the endpoint, the page will show a **Signing secret**. Click to reveal it.
    - **Copy this secret** (it starts with `whsec_...`).

3.  **Add Secret to Render:**
    - Go back to your backend service's **Environment** tab on Render.
    - Edit your `.env` secret file.
    - Paste the copied value for the `STRIPE_WEBHOOK_SECRET` variable.
    - Save the changes. Render will automatically redeploy your service with the new secret.

---

## Part 4: Frontend Deployment (Vercel)

Finally, let's deploy the user-facing application.

1.  **Create a New Project on Vercel:**
    - In your Vercel dashboard, click **Add New...** > **Project**.
    - Select the Git repository for your project.
    - Vercel should automatically detect it as a Vite-based project (which it resembles).

2.  **Configure the Project:**
    - **Framework Preset**: Should be `Vite` or similar. If not, select it.
    - **Build and Output Settings**: Vercel's defaults are usually correct (`npm run build`, output directory `dist`). You shouldn't need to change anything here.
    - **Environment Variables**: This is the most important step.
        - Add the following environment variables:
        - **Name**: `VITE_API_BASE_URL` (or `REACT_APP_API_BASE_URL` for backwards compatibility)
        - **Value**: Paste the public URL of your Render backend service (from Part 2, step 4).
        - **Name**: `VITE_STRIPE_PUBLISHABLE_KEY`
        - **Value**: Your Stripe publishable key (starts with `pk_test_` for test mode or `pk_live_` for production).
        - **Name**: `VITE_GEMINI_API_KEY` (optional, for client-side features)
        - **Value**: Your Google AI Studio API key (if using client-side Gemini features).
    - Click **Deploy**.

3.  **Update Backend `CLIENT_ORIGIN`:**
    - Once Vercel provides you with the final production URL (e.g., `https://veo3-mastery-hub.vercel.app`), go back to your Render backend service.
    - Update the `CLIENT_ORIGIN`, `CLIENT_SUCCESS_URL`, and `CLIENT_CANCEL_URL` variables in your `.env` secret file to use this new URL.
    - Save the changes to redeploy the backend with the correct CORS policy.

---

## Part 5: Production Recommendations

- **Health Checks & Restarts (Render)**: Render automatically uses a TCP health check. For more robust checks, you can configure it under **Settings** > **Health Check Path** to use your `/health` endpoint. Render will automatically restart unhealthy services.
- **Auto-Deploys**: Both Vercel and Render are configured by default to automatically deploy new changes when you push to your main branch.
- **Scaling (Render)**: For higher traffic, go to the **Scaling** tab on your Render web service to increase the number of instances. Render will handle load balancing automatically.
- **HTTPS**: Vercel and Render automatically provision and renew SSL certificates for you, ensuring your traffic is always encrypted.
- **Logging & Monitoring**: Both platforms provide real-time logging. For advanced monitoring and alerting, consider integrating with a third-party service like Datadog, Sentry, or New Relic.
- **Secret Management**: By using the environment variable UIs on Vercel and Render, you keep your secrets out of your Git repository, which is a critical security best practice. Never commit secrets to your code.

---

## Part 6: Deployment Verification Checklist

After deploying all services, follow these steps to ensure everything is working:

1.  ✅ **Visit Frontend**: Open your Vercel app's URL. The site should load correctly.
2.  ✅ **Check Backend Health**: Navigate directly to your backend's health check URL: `https://<your-render-app>.onrender.com/health`. You should see `{"ok":true,"message":"Server is healthy"}`.
3.  ✅ **User Registration**: Create a new account and log in via the frontend UI.
4.  ✅ **Test Payment (Stripe Test Mode)**:
    - Ensure your Stripe keys in Render are in **test mode**.
    - On the frontend, initiate a subscription. You will be redirected to a Stripe checkout page.
    - Use one of Stripe's [test card numbers](https://stripe.com/docs/testing) to complete the purchase.
    - You should be redirected back to the success URL (`?payment=success`).
5.  ✅ **Verify Webhook:**
    - Check your backend logs on Render. You should see a log indicating that the webhook was received and the user's subscription status was updated (e.g., `Updated user ... to status: pro`).
    - In the Stripe Dashboard under **Developers** > **Webhooks**, check that the event shows a `200 OK` response.
6.  ✅ **Confirm Pro Access**: In the frontend's "Account Settings" page, verify that your subscription status has changed to "Pro Plan".
7.  ✅ **Test API Call**: Use the Prompt Generator to ensure the frontend can successfully communicate with the backend API.
