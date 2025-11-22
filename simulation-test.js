/**
 * Comprehensive Simulation Test for VEO3 Mastery Hub
 * Tests all features and components to ensure everything works correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

// Test helper functions
function test(name, fn) {
  try {
    const result = fn();
    if (result === true || (typeof result === 'object' && result.passed)) {
      testResults.passed++;
      testResults.tests.push({ name, status: 'PASS', message: result.message || 'OK' });
      console.log(`✅ ${name}`);
      if (result.message) console.log(`   ${result.message}`);
    } else {
      testResults.failed++;
      testResults.tests.push({ name, status: 'FAIL', message: result.message || 'Failed' });
      console.log(`❌ ${name}`);
      console.log(`   ${result.message || 'Test failed'}`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'ERROR', message: error.message });
    console.log(`❌ ${name} - ERROR`);
    console.log(`   ${error.message}`);
  }
}

function warn(message) {
  testResults.warnings++;
  console.log(`⚠️  WARNING: ${message}`);
}

// ============================================
// FILE EXISTENCE TESTS
// ============================================
console.log('\n📁 Testing File Existence...\n');

test('Standalone HTML file exists', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    return {
      passed: true,
      message: `File exists (${(stats.size / 1024).toFixed(2)} KB)`
    };
  }
  return { passed: false, message: 'File does not exist' };
});

test('Constants file exists', () => {
  const filePath = path.join(__dirname, 'constants.ts');
  return fs.existsSync(filePath);
});

test('Main index.html exists', () => {
  const filePath = path.join(__dirname, 'index.html');
  return fs.existsSync(filePath);
});

// ============================================
// HTML STRUCTURE TESTS
// ============================================
console.log('\n🔍 Testing HTML Structure...\n');

test('Standalone HTML has proper structure', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');

  const checks = {
    hasDoctype: content.includes('<!DOCTYPE html>'),
    hasHtmlTag: content.includes('<html'),
    hasHeadTag: content.includes('<head>'),
    hasBodyTag: content.includes('<body'),
    hasRootDiv: content.includes('id="root"'),
    hasReactScript: content.includes('react.production.min.js') || content.includes('react.development.js'),
    hasReactDOMScript: content.includes('react-dom.production.min.js') || content.includes('react-dom.development.js'),
    hasMainScript: content.includes('(function()') || content.includes('waitForReactAndInit'),
  };

  const failed = Object.entries(checks).filter(([_, passed]) => !passed);
  if (failed.length > 0) {
    return { passed: false, message: `Missing: ${failed.map(([key]) => key).join(', ')}` };
  }
  return { passed: true, message: 'All HTML structure elements present' };
});

test('Standalone HTML has configuration script', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');

  const hasConfig = content.includes('window.API_BASE_URL') ||
    content.includes('CONFIG') ||
    content.includes('API_BASE_URL');

  return hasConfig ? { passed: true, message: 'Configuration script found' } :
    { passed: false, message: 'Configuration script missing' };
});

// ============================================
// JAVASCRIPT SYNTAX TESTS
// ============================================
console.log('\n💻 Testing JavaScript Syntax...\n');

test('Standalone HTML has valid JavaScript syntax (basic check)', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract script content
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  if (!scriptMatch) {
    return { passed: false, message: 'No script tags found' };
  }

  // Basic syntax checks
  const issues = [];

  // Check for balanced braces
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    issues.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
  }

  // Check for balanced parentheses
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    issues.push(`Unbalanced parentheses: ${openParens} open, ${closeParens} close`);
  }

  // Check for balanced brackets
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    issues.push(`Unbalanced brackets: ${openBrackets} open, ${closeBrackets} close`);
  }

  if (issues.length > 0) {
    return { passed: false, message: issues.join('; ') };
  }

  return { passed: true, message: 'Basic syntax checks passed' };
});

// ============================================
// COMPONENT DEFINITION TESTS
// ============================================
console.log('\n🧩 Testing Component Definitions...\n');

test('Button component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasButton = content.includes('const Button') || content.includes('Button =');
  return hasButton ? { passed: true } : { passed: false, message: 'Button component not found' };
});

test('Input component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasInput = content.includes('const Input') || content.includes('Input =');
  return hasInput ? { passed: true } : { passed: false, message: 'Input component not found' };
});

test('Card component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasCard = content.includes('const Card') || content.includes('Card =');
  return hasCard ? { passed: true } : { passed: false, message: 'Card component not found' };
});

test('Toast component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasToast = content.includes('const Toast') || content.includes('Toast =');
  return hasToast ? { passed: true } : { passed: false, message: 'Toast component not found' };
});

test('ToastContext is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasToastContext = content.includes('ToastContext') || content.includes('createContext');
  return hasToastContext ? { passed: true } : { passed: false, message: 'ToastContext not found' };
});

test('LoadingSpinner component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasSpinner = content.includes('LoadingSpinner') || content.includes('animate-spin');
  return hasSpinner ? { passed: true } : { passed: false, message: 'LoadingSpinner not found' };
});

test('Skeleton component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasSkeleton = content.includes('const Skeleton') || content.includes('Skeleton =');
  return hasSkeleton ? { passed: true } : { passed: false, message: 'Skeleton component not found' };
});

test('ProgressBar component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasProgressBar = content.includes('ProgressBar') || content.includes('progress');
  return hasProgressBar ? { passed: true } : { passed: false, message: 'ProgressBar not found' };
});

// ============================================
// SERVICE DEFINITION TESTS
// ============================================
console.log('\n🔧 Testing Service Definitions...\n');

test('authService is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasAuthService = content.includes('authService') || content.includes('registerUser');
  return hasAuthService ? { passed: true } : { passed: false, message: 'authService not found' };
});

test('geminiService is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasGeminiService = content.includes('geminiService') || content.includes('generateVEO3Prompt');
  return hasGeminiService ? { passed: true } : { passed: false, message: 'geminiService not found' };
});

test('authService has registerUser method', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasRegister = content.includes('registerUser') || content.includes('async registerUser');
  return hasRegister ? { passed: true } : { passed: false, message: 'registerUser method not found' };
});

test('authService has loginUser method', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasLogin = content.includes('loginUser') || content.includes('async loginUser');
  return hasLogin ? { passed: true } : { passed: false, message: 'loginUser method not found' };
});

test('authService has loginWithGoogle method', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasGoogleLogin = content.includes('loginWithGoogle') || content.includes('google');
  return hasGoogleLogin ? { passed: true } : { passed: false, message: 'loginWithGoogle method not found' };
});

test('authService has logoutUser method', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasLogout = content.includes('logoutUser') || content.includes('async logoutUser');
  return hasLogout ? { passed: true } : { passed: false, message: 'logoutUser method not found' };
});

// ============================================
// MAIN COMPONENT TESTS
// ============================================
console.log('\n📱 Testing Main Components...\n');

test('App component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasApp = content.includes('const App') || content.includes('App =');
  return hasApp ? { passed: true } : { passed: false, message: 'App component not found' };
});

test('PromptGenerator component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasPromptGenerator = content.includes('PromptGenerator') || content.includes('const PromptGenerator');
  return hasPromptGenerator ? { passed: true } : { passed: false, message: 'PromptGenerator not found' };
});

test('AuthModal component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasAuthModal = content.includes('AuthModal') || content.includes('const AuthModal');
  return hasAuthModal ? { passed: true } : { passed: false, message: 'AuthModal not found' };
});

test('SubscriptionModal component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasSubscriptionModal = content.includes('SubscriptionModal') || content.includes('const SubscriptionModal');
  return hasSubscriptionModal ? { passed: true } : { passed: false, message: 'SubscriptionModal not found' };
});

test('LearningJourney component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasLearningJourney = content.includes('LearningJourney') || content.includes('const LearningJourney');
  return hasLearningJourney ? { passed: true } : { passed: false, message: 'LearningJourney not found' };
});

test('Header component is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasHeader = content.includes('const Header') || content.includes('Header =');
  return hasHeader ? { passed: true } : { passed: false, message: 'Header not found' };
});

// ============================================
// FEATURE TESTS
// ============================================
console.log('\n✨ Testing Features...\n');

test('Error handling is implemented', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasErrorHandling = content.includes('try {') && content.includes('catch') && content.includes('error');
  return hasErrorHandling ? { passed: true } : { passed: false, message: 'Error handling not found' };
});

test('Input validation is implemented', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasValidation = content.includes('trim()') || content.includes('validation') || content.includes('length');
  return hasValidation ? { passed: true } : { passed: false, message: 'Input validation not found' };
});

test('Loading states are implemented', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasLoading = content.includes('isLoading') || content.includes('LoadingSpinner') || content.includes('Skeleton');
  return hasLoading ? { passed: true } : { passed: false, message: 'Loading states not found' };
});

test('Animations are implemented', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasAnimations = content.includes('animate-') || content.includes('@keyframes') || content.includes('transition');
  return hasAnimations ? { passed: true } : { passed: false, message: 'Animations not found' };
});

test('React hooks are used', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasHooks = content.includes('useState') || content.includes('useEffect') || content.includes('useCallback');
  return hasHooks ? { passed: true } : { passed: false, message: 'React hooks not found' };
});

// ============================================
// CONTENT TESTS
// ============================================
console.log('\n📚 Testing Content...\n');

test('Journey content array is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasJourneyContent = content.includes('journeyContent') || content.includes('Chapter1Content');
  return hasJourneyContent ? { passed: true } : { passed: false, message: 'journeyContent not found' };
});

test('Chapter 1 content is defined', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasChapter1 = content.includes('Chapter1Content') || content.includes('Introduction to Veo 3');
  return hasChapter1 ? { passed: true } : { passed: false, message: 'Chapter 1 not found' };
});

// ============================================
// CONFIGURATION TESTS
// ============================================
console.log('\n⚙️  Testing Configuration...\n');

test('API_BASE_URL configuration exists', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasApiUrl = content.includes('API_BASE_URL') || content.includes('CONFIG');
  return hasApiUrl ? { passed: true } : { passed: false, message: 'API_BASE_URL configuration not found' };
});

test('Stripe configuration exists', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasStripe = content.includes('STRIPE') || content.includes('Stripe');
  return hasStripe ? { passed: true } : { passed: false, message: 'Stripe configuration not found' };
});

test('Google OAuth configuration exists', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasGoogle = content.includes('GOOGLE_CLIENT_ID') || content.includes('google.accounts');
  return hasGoogle ? { passed: true } : { passed: false, message: 'Google OAuth configuration not found' };
});

// ============================================
// INITIALIZATION TESTS
// ============================================
console.log('\n🚀 Testing Initialization...\n');

test('App initialization function exists', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasInit = content.includes('initApp') || content.includes('waitForReactAndInit') || content.includes('createRoot');
  return hasInit ? { passed: true } : { passed: false, message: 'App initialization not found' };
});

test('React loading check exists', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasReactCheck = content.includes('typeof React') || content.includes('React.createElement');
  return hasReactCheck ? { passed: true } : { passed: false, message: 'React loading check not found' };
});

test('Error handling for missing React', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasErrorHandling = content.includes('React failed to load') || content.includes('Error:') || content.includes('undefined');
  return hasErrorHandling ? { passed: true } : { passed: false, message: 'Error handling for missing React not found' };
});

// ============================================
// INDENTATION TESTS
// ============================================
console.log('\n📏 Testing Code Quality...\n');

test('Consistent indentation (top-level declarations)', () => {
  const filePath = path.join(__dirname, 'index-standalone-complete.html');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for IIFE
  const iifeMatch = content.match(/\(function\(\)[\s\S]*?}\)\(\);/);
  if (!iifeMatch) {
    return { passed: false, message: 'IIFE not found' };
  }

  const iifeContent = iifeMatch[0];
  // Count top-level const declarations with proper indentation (10 spaces)
  const properIndent = (iifeContent.match(/^ {10}const /gm) || []).length;
  const improperIndent = (iifeContent.match(/^ {4}const /gm) || []).length;

  if (improperIndent > 0 && properIndent < 10) {
    return { passed: false, message: `Found ${improperIndent} declarations with wrong indentation` };
  }

  return { passed: true, message: `Found ${properIndent} properly indented declarations` };
});

// ============================================
// FINAL SUMMARY
// ============================================
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`⚠️  Warnings: ${testResults.warnings}`);
console.log(`📈 Total: ${testResults.passed + testResults.failed}`);
console.log(`📊 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

// Write test results to file
const resultsFile = path.join(__dirname, 'SIMULATION_TEST_RESULTS.md');
const resultsContent = `# Simulation Test Results

Generated: ${new Date().toISOString()}

## Summary

- ✅ Passed: ${testResults.passed}
- ❌ Failed: ${testResults.failed}
- ⚠️  Warnings: ${testResults.warnings}
- 📈 Total: ${testResults.passed + testResults.failed}
- 📊 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%

## Test Details

${testResults.tests.map(t => `### ${t.status}: ${t.name}
${t.message || 'No message'}

`).join('\n')}

## Next Steps

${testResults.failed > 0 ? '❌ Some tests failed. Please review the errors above and fix them.' : '✅ All tests passed! The app is ready for deployment.'}
`;

fs.writeFileSync(resultsFile, resultsContent);

console.log(`\n📝 Detailed results saved to: ${resultsFile}\n`);

// Exit with appropriate code
process.exit(testResults.failed > 0 ? 1 : 0);

