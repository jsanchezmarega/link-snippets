import { render, screen } from '@testing-library/react';
import LinkList from './LinkList';

describe('LinkList', () => {
  it('renders a list of links with user info', async () => {
    const links = [
      {
        id: 1,
        url: 'https://prisma.io',
        title: 'Prisma',
        tags: ['orm', 'typescript'],
        createdAt: new Date().toISOString(),
        user: { id: 1, name: 'Alice', email: 'alice@example.com' },
      },
      {
        id: 2,
        url: 'https://nextjs.org',
        title: 'Next.js',
        tags: ['react', 'framework'],
        createdAt: new Date().toISOString(),
        user: { id: 2, name: 'Bob', email: 'bob@example.com' },
      },
    ];
    global.fetch = jest.fn().mockResolvedValue({ json: async () => links });
    render(<LinkList filterTag={null} userId={undefined} onRefresh={() => {}} />);
    expect(await screen.findByText('Prisma')).toBeInTheDocument();
    expect(screen.getByText('User: Alice')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('User: Bob')).toBeInTheDocument();
  });

  it('shows empty state when no links', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: async () => [] });
    render(<LinkList filterTag={null} userId={undefined} onRefresh={() => {}} />);
    expect(await screen.findByText('No links yet.')).toBeInTheDocument();
  });
});
