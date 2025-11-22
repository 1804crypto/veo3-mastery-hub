# VEO3 Mastery Hub - Backend Server

This is the Node.js Express backend for the VEO3 Mastery Hub application. It handles user authentication, payment processing via Stripe, and secure API calls to the Gemini API.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A PostgreSQL database
- Docker and Docker Compose (for containerized setup)

---

## Running with Docker (Recommended for Local Development)

This is the easiest way to get the server and its database running locally.

1.  **Set up environment variables:**
    Copy the example environment file.
    ```bash
    cp .env.example .env
    ```
    Open the newly created `.env` file and **replace the placeholder values** with your actual secrets (especially `JWT_SECRET`, `GEMINI_API_KEY`, and Stripe keys). The default `DATABASE_URL` is already configured for the Docker Compose setup.

2.  **Build and Run the Containers:**
    From the `server` directory, run the following command:
    ```bash
    docker-compose up --build -d
    ```
    This command will:
    - Build the server's Docker image based on the `Dockerfile`.
    - Create and start containers for the server and the PostgreSQL database.
    - The `-d` flag runs the containers in detached mode (in the background).

3.  **Check the logs (optional):**
    To see the logs from the running containers:
    ```bash
    docker-compose logs -f
    ```

4.  **Stopping the containers:**
    To stop and remove the containers:
    ```bash
    docker-compose down
    ```

---

## Manual Setup (Without Docker)

1.  **Clone the repository and navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the example environment file and fill in your details.
    ```bash
    cp .env.example .env
    ```
    You will need to provide your PostgreSQL database connection string, a secret for JWT, your frontend application's origin URL, and your API keys for Gemini and Stripe.

## Database Management

### Migrations

To create the database schema for the first time or after making changes to `prisma/schema.prisma`, run the migrate command. This will create and apply the necessary SQL migrations.

```bash
npm run prisma:migrate
```
You will be prompted to enter a name for the migration (e.g., `init-user-schema`).

### Seeding

To populate the database with initial test data (e.g., a test user), run the seed script:

```bash
npm run seed
```

This command executes the script defined in `prisma/seed.ts`.


## Running the Server

### Development

To run the server in development mode with hot-reloading:

```bash
npm run dev
```

The server will be running on `http://localhost:8080` (or the port specified in your `.env` file).

### Production

1.  **Build the TypeScript code:**
    ```bash
    npm run build
    ```
    This will compile the TypeScript code into JavaScript in the `dist/` directory.

2.  **Start the server:**
    ```bash
    npm start
    ```
    This will run the compiled JavaScript code. Make sure your environment variables are set in your production environment.

## Security Best Practices

This server has been configured with several security best practices to protect user data and prevent common web vulnerabilities.

### 1. Secure Authentication with `HttpOnly` Cookies

- **Implementation**: Upon successful login, the server sets a JWT in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
- **Why it's secure**:
    - `HttpOnly`: Prevents the cookie from being accessed by client-side JavaScript, which is the primary defense against token theft via Cross-Site Scripting (XSS) attacks.
    - `Secure`: Ensures the cookie is only sent over HTTPS connections.
    - `SameSite=Strict`: Prevents the browser from sending the cookie with cross-site requests, providing strong protection against Cross-Site Request Forgery (CSRF).
- **Frontend Usage**: The frontend must make authenticated API calls using the `fetch` API with the `credentials: 'include'` option. This tells the browser to automatically include the secure cookie in the request.

### 2. CORS and Helmet

- **CORS**: The server uses a strict Cross-Origin Resource Sharing (CORS) policy, configured to only allow requests from the frontend URL specified in the `CLIENT_ORIGIN` environment variable.
- **Helmet**: We use the `helmet` middleware to set various security-related HTTP headers, protecting against vulnerabilities like clickjacking, MIME-type sniffing, and more.

### 3. CSRF Protection

CSRF attacks are mitigated primarily by the `SameSite=Strict` attribute on the authentication cookie. This is a robust, modern defense. Additionally, all state-changing API endpoints (like `POST /api/generate-prompt`) are protected by the `verifyAuth` middleware, which validates the JWT cookie, ensuring that only authenticated requests from the same site can modify data.

### 4. `localStorage` as a Fallback (Not Recommended)

If `HttpOnly` cookies cannot be used, a fallback is to store the JWT in `localStorage`.
- **Risk**: `localStorage` is accessible to any JavaScript running on the page. A single XSS vulnerability could allow an attacker to steal the token and impersonate the user.
- **Mitigation**: If you must use `localStorage`, you must enforce a very strict Content Security Policy (CSP) to prevent XSS, use short-lived access tokens, and implement a secure token refresh mechanism.

### 5. Prioritized Security Tasks for Production

Before deploying to production, the following security tasks should be completed:
1.  **Enforce Strict Content Security Policy (CSP) via Headers**: Move the CSP from the frontend's `<meta>` tag to a `Content-Security-Policy` HTTP header set by the server. This provides better protection and is more difficult to bypass. Refine the policy to be as restrictive as possible.
2.  **Implement Comprehensive Input Validation**: On the backend, validate all user inputs (request bodies, parameters, queries) against a strict schema (using a library like Zod or Joi) to prevent injection attacks and ensure data integrity.
3.  **Conduct Regular Dependency Audits**: Regularly run `npm audit fix` and use tools like Snyk or Dependabot to identify and patch vulnerabilities in third-party packages, as they are a common attack vector.


## API Endpoints

### Authentication

**Register a new user**
`POST /api/auth/register`
Body: `{ "email": "user@example.com", "password": "Password123!" }`

**Login**
`POST /api/auth/login`
Body: `{ "email": "user@example.com", "password": "Password123!" }`
Sets a secure, `httpOnly` cookie named `token`. The token is NOT returned in the response body.

### Prompt Generation

**Generate a VEO3 Prompt**
`POST /api/generate-prompt`
This endpoint is protected and requires authentication via the `token` cookie.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "idea": "A noir detective in a late-night diner at 3am, exhausted from his shift, confessing his struggles."
}
```

### Payments

**Create a Stripe Checkout Session**
`POST /api/payments/create-checkout-session`
This endpoint is protected and requires authentication. It creates a Stripe Checkout session for a given plan.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "planId": "pro_monthly"
}
```
`planId` must be a key from `server/config/plans.json`.

**Response:**
```json
{
    "ok": true,
    "sessionId": "cs_test_..."
}
```

#### Stripe Webhooks

To keep your application's subscription data in sync with Stripe, this server provides a webhook endpoint. This endpoint listens for events from Stripe (like successful payments or cancellations) and updates user records accordingly.

**Webhook Endpoint:**
`POST /api/payments/stripe-webhook`

**Configuration:**
You must set the `STRIPE_WEBHOOK_SECRET` in your `.env` file. You can get this secret when you create a new webhook endpoint in your Stripe Dashboard.

**Testing Locally with the Stripe CLI:**
The Stripe CLI is the recommended way to test your webhook endpoint locally.

1.  [Install the Stripe CLI](https://stripe.com/docs/stripe-cli) and log in to your Stripe account.

2.  Run the following command while your local server is running. It will forward Stripe events to your local webhook endpoint.

    ```bash
    stripe listen --forward-to localhost:8080/api/payments/stripe-webhook
    ```
    (Replace `8080` if your server runs on a different port.)

3.  The CLI will output a webhook signing secret (e.g., `whsec_...`). Copy this secret and paste it as the value for `STRIPE_WEBHOOK_SECRET` in your `.env` file.

Now, when you go through a test checkout flow, Stripe will send events to the CLI, which forwards them to your server, allowing you to test the full subscription lifecycle.
