import fetch from 'node-fetch';

const NETLIFY_URL = 'https://veo3-mastery-hub.netlify.app';
const EXPECTED_BACKEND_URL = 'https://veo3-mastery-hub-api.onrender.com';

async function checkProductionSetup() {
    console.log('🔍 Checking Production Setup...');
    console.log(`Frontend URL: ${NETLIFY_URL}`);

    try {
        // 1. Check if Frontend is reachable
        const frontendRes = await fetch(NETLIFY_URL);
        if (frontendRes.ok) {
            console.log('✅ Frontend is reachable.');
        } else {
            console.error('❌ Frontend is NOT reachable.');
        }

        // 2. Check Backend Health (if possible)
        console.log(`\nChecking Backend at: ${EXPECTED_BACKEND_URL}`);
        try {
            const backendRes = await fetch(`${EXPECTED_BACKEND_URL}/health`);
            if (backendRes.ok) {
                console.log('✅ Backend is reachable and healthy.');
            } else {
                console.warn('⚠️ Backend reachable but returned non-200 status (might be normal if auth required).');
            }
        } catch (e) {
            console.error('❌ Backend is NOT reachable. Check Render status.');
        }

        console.log('\n--- ACTION REQUIRED ---');
        console.log('You must manually update your Netlify Environment Variables:');
        console.log('1. Go to https://app.netlify.com');
        console.log('2. Select "veo3-mastery-hub"');
        console.log('3. Go to Site Configuration -> Environment Variables');
        console.log('4. Edit VITE_API_BASE_URL');
        console.log(`5. Set it to: ${EXPECTED_BACKEND_URL}`);
        console.log('6. Save and Redeploy.');

    } catch (error) {
        console.error('Error running check:', error);
    }
}

checkProductionSetup();
