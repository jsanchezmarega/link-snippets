/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.link.deleteMany();
  await prisma.user.deleteMany();

  // Create multiple users with different names and emails
  const users = [
    { email: 'alice@example.com', name: 'Alice Johnson' },
    { email: 'bob@example.com', name: 'Bob Smith' },
    { email: 'carol@example.com', name: 'Carol Davis' },
    { email: 'dave@example.com', name: 'Dave Wilson' },
    { email: 'eve@example.com', name: 'Eve Brown' },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.create({ data: userData });
    createdUsers.push(user);
  }

  // Create a variety of links with different tags and dates
  const linksData = [
    // Alice's links
    { url: 'https://prisma.io', title: 'Prisma - Next-generation ORM', tags: ['orm', 'typescript', 'database'], userId: createdUsers[0].id },
    { url: 'https://nextjs.org', title: 'Next.js - React Framework', tags: ['react', 'framework', 'typescript'], userId: createdUsers[0].id },
    { url: 'https://react.dev', title: 'React - JavaScript Library', tags: ['react', 'javascript', 'frontend'], userId: createdUsers[0].id },
    { url: 'https://tailwindcss.com', title: 'Tailwind CSS - Utility-first CSS', tags: ['css', 'frontend', 'design'], userId: createdUsers[0].id },
    { url: 'https://typescriptlang.org', title: 'TypeScript - JavaScript with syntax', tags: ['typescript', 'javascript', 'programming'], userId: createdUsers[0].id },
    
    // Bob's links
    { url: 'https://postgresql.org', title: 'PostgreSQL - Advanced Database', tags: ['database', 'sql', 'backend'], userId: createdUsers[1].id },
    { url: 'https://remix.run', title: 'Remix - Full Stack Web Framework', tags: ['react', 'framework', 'fullstack'], userId: createdUsers[1].id },
    { url: 'https://docker.com', title: 'Docker - Container Platform', tags: ['devops', 'containers', 'deployment'], userId: createdUsers[1].id },
    { url: 'https://kubernetes.io', title: 'Kubernetes - Container Orchestration', tags: ['devops', 'containers', 'orchestration'], userId: createdUsers[1].id },
    { url: 'https://jestjs.io', title: 'Jest - JavaScript Testing Framework', tags: ['testing', 'javascript', 'tdd'], userId: createdUsers[1].id },
    
    // Carol's links
    { url: 'https://graphql.org', title: 'GraphQL - Query Language', tags: ['api', 'graphql', 'backend'], userId: createdUsers[2].id },
    { url: 'https://apollo.dev', title: 'Apollo GraphQL Platform', tags: ['graphql', 'api', 'tools'], userId: createdUsers[2].id },
    { url: 'https://redis.io', title: 'Redis - In-Memory Data Store', tags: ['database', 'cache', 'performance'], userId: createdUsers[2].id },
    { url: 'https://elastic.co', title: 'Elasticsearch - Search Engine', tags: ['search', 'database', 'analytics'], userId: createdUsers[2].id },
    { url: 'https://mongodb.com', title: 'MongoDB - NoSQL Database', tags: ['database', 'nosql', 'document'], userId: createdUsers[2].id },
    
    // Dave's links
    { url: 'https://aws.amazon.com', title: 'AWS - Cloud Computing Platform', tags: ['cloud', 'aws', 'infrastructure'], userId: createdUsers[3].id },
    { url: 'https://vercel.com', title: 'Vercel - Frontend Deployment', tags: ['deployment', 'frontend', 'serverless'], userId: createdUsers[3].id },
    { url: 'https://netlify.com', title: 'Netlify - Web Development Platform', tags: ['deployment', 'frontend', 'cms'], userId: createdUsers[3].id },
    { url: 'https://github.com', title: 'GitHub - Code Hosting Platform', tags: ['git', 'version-control', 'collaboration'], userId: createdUsers[3].id },
    { url: 'https://gitlab.com', title: 'GitLab - DevOps Platform', tags: ['git', 'devops', 'ci-cd'], userId: createdUsers[3].id },
    
    // Eve's links
    { url: 'https://storybook.js.org', title: 'Storybook - UI Component Library', tags: ['ui', 'components', 'development'], userId: createdUsers[4].id },
    { url: 'https://figma.com', title: 'Figma - Design Tool', tags: ['design', 'ui', 'collaboration'], userId: createdUsers[4].id },
    { url: 'https://framer.com', title: 'Framer - Interactive Design Tool', tags: ['design', 'prototyping', 'ui'], userId: createdUsers[4].id },
    { url: 'https://sass-lang.com', title: 'Sass - CSS Preprocessor', tags: ['css', 'preprocessor', 'styling'], userId: createdUsers[4].id },
    { url: 'https://styled-components.com', title: 'Styled Components - CSS-in-JS', tags: ['css', 'react', 'styling'], userId: createdUsers[4].id },
  ];

  // Create links with staggered creation dates to make sorting meaningful
  for (let i = 0; i < linksData.length; i++) {
    const linkData = linksData[i];
    const daysAgo = Math.floor(Math.random() * 30); // Random date within last 30 days
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    
    await prisma.link.create({
      data: {
        ...linkData,
        createdAt,
      },
    });
  }

  console.log('Seeded users:', createdUsers.map(u => ({ id: u.id, name: u.name, email: u.email })));
  console.log(`Created ${linksData.length} links with varied dates and tags`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 