/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.link.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      links: {
        create: [
          { url: 'https://prisma.io', title: 'Prisma', tags: ['orm', 'typescript'] },
          { url: 'https://nextjs.org', title: 'Next.js', tags: ['react', 'framework'] },
          { url: 'https://react.dev', title: 'React', tags: ['react', 'framework'] },
        ],
      },
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      links: {
        create: [
          { url: 'https://postgresql.org', title: 'PostgreSQL', tags: ['database', 'sql'] },
          { url: 'https://remix.run', title: 'Remix', tags: ['react', 'framework'] },
        ],
      },
    },
  });

  console.log('Seeded users:', { alice, bob });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 