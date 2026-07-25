import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@techgodwin.com';
  const password = 'TechGodwin@2024!';

  const hashed = await bcrypt.hash(password, 12);

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`✓ Admin user already exists: ${email}`);
    return;
  }

  await prisma.adminUser.create({
    data: {
      email,
      name: 'TechGodwin Admin',
      password: hashed,
      role: 'admin',
      active: true,
    },
  });

  console.log('✅ Admin user created!');
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
  console.log('   ⚠️  Change this password after first login!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
