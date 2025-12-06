# Testing the Standalone HTML File

## Quick Test

The standalone file `index-standalone-complete.html` is ready to test!

### Option 1: Local HTTP Server (Recommended)
A server is already running on port 8000. Open:
```
http://localhost:8000/index-standalone-complete.html
```

### Option 2: Direct File Open
Open the file directly in your browser:
```
file:///Users/freeemall/Downloads/veo3-mastery-hub (3)/index-standalone-complete.html
```

## What to Test

### ✅ Basic Functionality
1. **Home Page**: Should display the landing page with feature cards
2. **Navigation**: Click through all menu items (Home, Journey, Generator, Video Studio, Community)
3. **Authentication**: Test login/signup modals (will require backend)
4. **UI Components**: Buttons, inputs, cards should render correctly

### ✅ Components to Test
- **Learning Journey**: Should show chapter navigation (Chapter 1 included)
- **Prompt Generator**: Should show input form (requires backend for generation)
- **Account Settings**: Should show account management UI
- **Community Hub**: Should show locked view for non-pro users
- **Video Studio**: Should show video generation interface

### ⚠️ Known Limitations
- **Backend Required**: Full functionality requires backend server at `http://localhost:8080`
- **API Keys**: Stripe, Google OAuth, and Gemini API keys need to be configured
- **Journey Content**: Only Chapter 1 is included (structure ready for all 20 chapters)

## Configuration

Edit the configuration at the top of the file (lines 96-101):
```javascript
window.API_BASE_URL = 'http://localhost:8080';
window.STRIPE_PUBLISHABLE_KEY = 'your-key';
window.GOOGLE_CLIENT_ID = 'your-client-id';
window.GEMINI_API_KEY = 'your-key';
```

## Browser Console

Open browser DevTools (F12) and check for:
- ✅ No React errors
- ✅ No Babel transformation errors
- ✅ API calls (will show CORS errors if backend not running - this is expected)

## Expected Behavior

1. **Without Backend**: 
   - UI should render correctly
   - Navigation should work
   - Modals should open/close
   - Forms should display (but won't submit without backend)

2. **With Backend**:
   - Authentication should work
   - Prompt generation should work
   - All API calls should succeed

## Troubleshooting

### Issue: Page is blank
- Check browser console for errors
- Ensure Babel standalone loaded correctly
- Check that React and ReactDOM loaded

### Issue: CORS errors
- This is expected if backend is not running
- Start backend server: `cd server && npm start`

### Issue: Styles not loading
- Check that Tailwind CSS CDN loaded
- Check browser network tab

## Server Status

To stop the test server:
```bash
kill $(cat /tmp/http-server.pid)
```

To restart:
```bash
cd "/Users/freeemall/Downloads/veo3-mastery-hub (3)"
python3 -m http.server 8000
```

