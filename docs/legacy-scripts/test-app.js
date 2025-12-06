#!/usr/bin/env node

/**
 * App Simulation Test
 * Tests that the app is configured correctly and ready to run
 */

import fs from 'fs';
import path from 'path';

console.log('🧪 Running App Simulation Test...\n');

let errors = [];
let warnings = [];

// Test 1: Check environment files
console.log('1. Checking environment files...');
if (fs.existsSync('.env.local')) {
  console.log('   ✅ Frontend .env.local exists');
  const frontendEnv = fs.readFileSync('.env.local', 'utf8');
  if (frontendEnv.includes('VITE_API_BASE_URL')) {
    console.log('   ✅ VITE_API_BASE_URL found');
  } else {
    errors.push('VITE_API_BASE_URL missing in .env.local');
  }
  if (frontendEnv.includes('VITE_STRIPE_PUBLISHABLE_KEY') && !frontendEnv.includes('YOUR_KEY')) {
    console.log('   ✅ Stripe publishable key configured');
  } else {
    warnings.push('Stripe publishable key may not be set correctly');
  }
  if (frontendEnv.includes('VITE_GEMINI_API_KEY') && !frontendEnv.includes('your_gemini')) {
    console.log('   ✅ Gemini API key configured');
  } else {
    warnings.push('Gemini API key may not be set correctly');
  }
} else {
  errors.push('.env.local file missing');
}

if (fs.existsSync('server/.env')) {
  console.log('   ✅ Backend .env exists');
  const backendEnv = fs.readFileSync('server/.env', 'utf8');
  if (backendEnv.includes('JWT_SECRET') && !backendEnv.includes('your_super_secret')) {
    console.log('   ✅ JWT_SECRET configured');
  } else {
    warnings.push('JWT_SECRET may not be set correctly');
  }
  if (backendEnv.includes('GEMINI_API_KEY') && !backendEnv.includes('your_google')) {
    console.log('   ✅ Gemini API key configured');
  } else {
    warnings.push('Gemini API key may not be set correctly');
  }
  if (backendEnv.includes('STRIPE_SECRET_KEY') && !backendEnv.includes('YOUR_KEY')) {
    console.log('   ✅ Stripe secret key configured');
  } else {
    warnings.push('Stripe secret key may not be set correctly');
  }
} else {
  errors.push('server/.env file missing');
}

// Test 2: Check Stripe price IDs
console.log('\n2. Checking Stripe configuration...');
if (fs.existsSync('server/config/plans.json')) {
  const plans = JSON.parse(fs.readFileSync('server/config/plans.json', 'utf8'));
  if (plans.pro_monthly?.priceId && !plans.pro_monthly.priceId.includes('XXXXX')) {
    console.log('   ✅ Monthly plan price ID configured');
  } else {
    errors.push('Monthly plan price ID not configured in server/config/plans.json');
  }
  if (plans.lifetime?.priceId && !plans.lifetime.priceId.includes('YYYYY')) {
    console.log('   ✅ Lifetime plan price ID configured');
  } else {
    errors.push('Lifetime plan price ID not configured in server/config/plans.json');
  }
} else {
  errors.push('server/config/plans.json missing');
}

// Test 3: Check Prisma schema
console.log('\n3. Checking database schema...');
if (fs.existsSync('server/prisma/schema.prisma')) {
  const schema = fs.readFileSync('server/prisma/schema.prisma', 'utf8');
  if (schema.includes('model User')) {
    console.log('   ✅ Prisma schema exists and contains User model');
  } else {
    errors.push('Prisma schema missing User model');
  }
} else {
  errors.push('server/prisma/schema.prisma missing');
}

// Test 4: Check dependencies
console.log('\n4. Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ Frontend dependencies installed');
} else {
  warnings.push('Frontend dependencies not installed (run: npm install)');
}

if (fs.existsSync('server/node_modules')) {
  console.log('   ✅ Backend dependencies installed');
} else {
  warnings.push('Backend dependencies not installed (run: cd server && npm install)');
}

// Test 5: Check Prisma client
console.log('\n5. Checking Prisma client...');
if (fs.existsSync('server/node_modules/@prisma/client')) {
  console.log('   ✅ Prisma client generated');
} else {
  warnings.push('Prisma client not generated (run: cd server && npx prisma generate)');
}

// Test 6: Check key files
console.log('\n6. Checking key application files...');
const keyFiles = [
  'App.tsx',
  'index.tsx',
  'server/src/index.ts',
  'server/src/routes/api.ts',
  'server/src/routes/auth.ts',
  'server/src/routes/payments.ts',
];

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    errors.push(`${file} missing`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Test Summary');
console.log('='.repeat(50));

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All tests passed! App is ready to run.');
  console.log('\n🚀 Next steps:');
  console.log('   1. Set up database (see LOCAL_TESTING.md)');
  console.log('   2. Update DATABASE_URL in server/.env');
  console.log('   3. Run: cd server && npx prisma migrate dev');
  console.log('   4. Start backend: cd server && npm run dev');
  console.log('   5. Start frontend: npm run dev');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} error(s) found:`);
    errors.forEach(err => console.log(`   - ${err}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`);
    warnings.forEach(warn => console.log(`   - ${warn}`));
  }
  console.log('\n🔧 Please fix the errors above before running the app.');
  process.exit(errors.length > 0 ? 1 : 0);
}

