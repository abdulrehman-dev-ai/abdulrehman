import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
const input = createInterface({ input: process.stdin, output: process.stdout });
if (!process.stdin.isTTY) throw new Error('Run from an interactive terminal. Never pass passwords as command arguments.');
// Hide terminal echo while reading the password.
process.stdout.write('New admin password (16+ characters): ');
input._writeToOutput = () => {};
const password = await input.question('');
input.close();
process.stdout.write('\n');
if (password.length < 16) throw new Error('Use at least 16 characters.');
const salt = randomBytes(16).toString('hex');
console.log('ADMIN_PASSWORD_SALT:', salt);
console.log('ADMIN_PASSWORD_HASH:', pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex'));
console.log('SESSION_SECRET:', randomBytes(32).toString('hex'));
