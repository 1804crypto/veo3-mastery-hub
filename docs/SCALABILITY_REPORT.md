# 📊 Scalability Analysis Report

## 🏁 Executive Summary
Based on your current infrastructure (Render Free/Starter Tier + Netlify) and the codebase analysis, here are the estimated limits:

*   **Concurrent Browsing Users:** ~300 - 500 users
    *(Users navigating the site, reading content, logging in)*
*   **Concurrent AI Generators:** ~15 - 60 users per minute
    *(Users actively clicking "Generate Prompt" or "Enhance")*
*   **Crash Point:** ~200 simultaneous *heavy* requests
    *(If 200 people click "Generate" at the exact same second, the server may crash due to memory limits)*

---

## 🔍 Detailed Bottlenecks

### 1. The Primary Bottleneck: Gemini API (AI Features)
Your app relies on Google's Gemini API (`gemini-2.5-flash`).
*   **Limit:** The Free Tier typically allows ~15-60 Requests Per Minute (RPM).
*   **Impact:** If more than ~20 people try to generate a prompt within the same minute, they will hit a "Quota Exceeded" error.
*   **Safety Net:** Your code has a fallback mechanism that returns a "Mocked Response" if the quota is hit (see `server/src/utils/gemini.ts`), so the app won't *crash*, but it will stop generating *real* AI results.

### 2. The Infrastructure: Render Instance
*   **Resources:** Likely 512MB RAM / 0.1 CPU.
*   **Impact:** Node.js is single-threaded. While it handles waiting for APIs well, the memory overhead of handling 200+ simultaneous requests (each buffering JSON data) can cause an "Out of Memory" (OOM) crash.
*   **Cold Starts:** On the free tier, the server "sleeps" after 15 minutes of inactivity, causing the first user to wait ~30-60 seconds.

### 3. Database: Connection Pool
*   **Limit:** Standard managed databases (like Supabase free tier) allow ~60 direct connections.
*   **Impact:** If 60+ users perform an action (login/save prompt) *simultaneously*, some requests will fail or time out.

---

## 🚀 Recommendations for Scaling

1.  **Enable Caching (Immediate Win):**
    *   Cache common database queries (e.g., "Get History") to reduce database load.

2.  **Upgrade Render Plan (Low Cost):**
    *   Moving to a $7/mo "Starter" plan prevents the server from sleeping (fixing cold starts) and provides dedicated uptime.

3.  **Implement a Queue System (Advanced):**
    *   For the AI generation, instead of processing immediately, add requests to a queue (like Redis/BullMQ). This prevents the server from crashing under load by processing jobs one by one suitable for your API limits.

4.  **Production Rate Limiting:**
    *   Add a rate limiter (e.g., `express-rate-limit`) to prevent one user from spamming the "Generate" button and using up the entire API quota.
