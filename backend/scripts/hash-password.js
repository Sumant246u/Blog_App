import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
    console.error('Usage: node scripts/hash-password.js <your-password>');
    process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nAdd this to your backend/.env:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('\nYou can remove ADMIN_PASSWORD after adding the hash.\n');
