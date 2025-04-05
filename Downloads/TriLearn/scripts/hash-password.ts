import { hash } from 'bcryptjs';

async function hashPassword() {
  const password = 'adminpassword123';
  const hashedPassword = await hash(password, 12);
  console.log('Hashed password:', hashedPassword);
}

hashPassword(); 