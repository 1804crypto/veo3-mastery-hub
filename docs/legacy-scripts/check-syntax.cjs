const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index-standalone.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// Extract the main script block (the one with waitForReactAndInit)
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/g);

if (!scriptMatch) {
    console.error('No script tags found');
    process.exit(1);
}

// Find the script containing waitForReactAndInit
const mainScript = scriptMatch.find(s => s.includes('waitForReactAndInit'));

if (!mainScript) {
    console.error('Main script not found');
    process.exit(1);
}

// Remove <script> tags
const jsContent = mainScript.replace(/<script>|<\/script>/g, '');

// Write to a temp file
const tempJsPath = path.join(__dirname, 'temp-check.js');
fs.writeFileSync(tempJsPath, jsContent);

console.log('Extracted JS to temp-check.js. Running syntax check...');

try {
    require('child_process').execSync(`node -c "${tempJsPath}"`, { stdio: 'inherit' });
    console.log('✅ Syntax check passed!');
} catch (error) {
    console.error('❌ Syntax check failed!');
    // The error output is already printed by inherit
}
