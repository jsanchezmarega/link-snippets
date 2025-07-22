import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkList from './LinkList';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('LinkList', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders a list of links with user info', async () => {
    const mockLinks = [
      {
        id: 1,
        url: 'https://example.com',
        title: 'Example Link',
        tags: ['test', 'example'],
        createdAt: '2023-01-01T00:00:00.000Z',
        user: { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
      },
      {
        id: 2,
        url: 'https://test.com',
        title: 'Test Link',
        tags: ['test'],
        createdAt: '2023-01-02T00:00:00.000Z',
        user: { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        links: mockLinks,
        pagination: {
          page: 1,
          limit: 5,
          totalCount: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }),
    });

    render(<LinkList filterTag={null} onRefresh={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Example Link')).toBeInTheDocument();
      expect(screen.getByText('Test Link')).toBeInTheDocument();
      expect(screen.getByText('User: Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('User: Bob Smith')).toBeInTheDocument();
    });
  });

  it('renders empty state when no links', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        links: [],
        pagination: {
          page: 1,
          limit: 5,
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }),
    });

    render(<LinkList filterTag={null} onRefresh={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('No links found.')).toBeInTheDocument();
    });
  });
});
