
const API_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';

async function runTest(name, fn) {
    try {
        process.stdout.write(`Testing ${name}... `);
        await fn();
        console.log('✅ PASS');
        return true;
    } catch (error) {
        console.log('❌ FAIL');
        console.error(`   Error: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting Full System Simulation Test...\n');

    const timestamp = Date.now();
    const testUser = {
        email: `test_sim_${timestamp}@example.com`,
        password: 'password123'
    };

    // 1. Authentication Tests
    await runTest('User Registration', async () => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        if (!data.userId) throw new Error('No userId returned');
        userId = data.userId;
    });

    await runTest('User Login', async () => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        // Extract cookie if possible, or just rely on the fact that login worked
        // In a real node script without a cookie jar, subsequent requests might fail if they need auth
        // We'll need to handle cookies manually if the API relies solely on httpOnly cookies

        // NOTE: Since the API uses httpOnly cookies, we can't easily get the token in this script 
        // without a cookie jar library. However, for this simulation, we can verify the *endpoints* work.
        // To make this script work for protected routes, we'd need to parse the 'set-cookie' header.

        const cookieHeader = res.headers.get('set-cookie');
        if (cookieHeader) {
            authToken = cookieHeader.split(';')[0]; // Simple extraction
            console.log('   Cookie extracted:', authToken);
        } else {
            console.log('   WARNING: No cookie returned');
        }
    });

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Cookie': authToken
    });

    await runTest('Get User Profile', async () => {
        const res = await fetch(`${API_URL}/me`, { headers: getHeaders() });
        if (res.status === 401) throw new Error('Unauthorized - Cookie handling needed');
        if (!res.ok) throw new Error(`Failed to get profile: ${res.statusText}`);
        const data = await res.json();
        if (data.user.email !== testUser.email) throw new Error('Email mismatch');
    });

    // 2. Prompt History Tests
    let promptId = '';
    await runTest('Create Prompt History Item', async () => {
        const promptData = {
            prompt: 'A cinematic shot of a futuristic city',
            type: 'image',
            style: 'Cinematic',
            aspectRatio: '16:9'
        };

        const res = await fetch(`${API_URL}/prompts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(promptData)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Failed to create prompt');
        }
        const data = await res.json();
        promptId = data.id;
    });

    await runTest('Get Prompt History', async () => {
        const res = await fetch(`${API_URL}/prompts`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to get history');
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('History is not an array');
        if (data.length === 0) throw new Error('History is empty');
        if (data[0].id !== promptId) throw new Error('Latest prompt not found');
    });

    await runTest('Delete Prompt History Item', async () => {
        const res = await fetch(`${API_URL}/prompts/${promptId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete prompt');
    });

    // 3. Community Tests
    let postId = '';
    await runTest('Create Community Post', async () => {
        const postData = {
            title: 'My Amazing Prompt',
            content: 'Check out this cool prompt I made',
            prompt: 'A robot painting a canvas',
            tags: ['ai', 'art']
        };

        const res = await fetch(`${API_URL}/community/posts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(postData)
        });

        if (!res.ok) {
            // Community might not be fully implemented or protected differently
            // Let's check the status
            if (res.status === 404) throw new Error('Community API not found');
            const err = await res.json();
            throw new Error(err.message || 'Failed to create post');
        }
        const data = await res.json();
        postId = data.id;
    });

    if (postId) {
        await runTest('Get Community Posts', async () => {
            const res = await fetch(`${API_URL}/community/posts`, { headers: getHeaders() });
            if (!res.ok) throw new Error('Failed to get posts');
            const data = await res.json();
            if (!Array.isArray(data)) throw new Error('Posts is not an array');
        });

        await runTest('Like Post', async () => {
            const res = await fetch(`${API_URL}/community/posts/${postId}/like`, {
                method: 'POST',
                headers: getHeaders()
            });
            if (!res.ok) throw new Error('Failed to like post');
        });
    }

    // 4. Payment Tests
    await runTest('Create Checkout Session', async () => {
        const res = await fetch(`${API_URL}/payments/create-checkout-session`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ planId: 'price_123' }) // Dummy ID, just checking if endpoint responds
        });

        // We expect either a success (URL) or a specific error, but not a 500
        if (res.status === 500) throw new Error('Payment endpoint crashed');

        // It might fail with "Invalid price" which is fine, means endpoint is reachable
        const data = await res.json();
        if (!data.url && !data.error && !data.message) throw new Error('Invalid response from payment endpoint');
    });

    console.log('\n✨ Simulation Complete!');
}

main().catch(console.error);
