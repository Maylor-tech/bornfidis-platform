// Quick script to test database connection
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    if (error.message.includes('invalid domain character')) {
      console.error('\n💡 Tip: If your password contains special characters, URL-encode them:');
      console.error('   @ → %40, # → %23, % → %25, etc.');
    }
  }
}

testConnection();


