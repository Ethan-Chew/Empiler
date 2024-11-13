import bcrypt from 'bcryptjs';
import readline from 'readline';

// Setup readline interface to take input from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to hash the password
const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Number of salt rounds for bcrypt (you can adjust this)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`\nHashed Password: ${hashedPassword}`);
  } catch (error) {
    console.error('Error hashing password:', error);
  } finally {
    rl.close();
  }
};

// Prompt user for a password
rl.question('Enter your password to hash: ', (password) => {
  hashPassword(password);
});