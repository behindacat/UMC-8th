import { PrismaClient } from '@prisma/client';
console.log(PrismaClient);

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: '12345678',
      name: '테스트 유저',
    },
  });

  console.log('Seed 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
