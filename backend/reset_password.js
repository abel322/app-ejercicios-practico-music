
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'utreraabel91@gmail.com';
  const newPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log(`✅ Contraseña reseteada para ${email}`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Nueva Contraseña: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
