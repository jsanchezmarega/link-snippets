import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LinkForm from './LinkForm';
import userEvent from '@testing-library/user-event';

describe('LinkForm', () => {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];

  beforeEach(() => {
    // @ts-expect-error: mock fetch for test
    global.fetch = jest.fn((url) => {
      if (url === '/api/users') {
        return Promise.resolve({ json: async () => users });
      }
      // fallback for links POST
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the form and user dropdown', async () => {
    render(<LinkForm onAdd={() => {}} />);
    expect(await screen.findByText('Select user')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('URL*')).toBeInTheDocument();
    expect(screen.getByText('Add Link')).toBeInTheDocument();
    // User options
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows error if URL is missing', async () => {
    render(<LinkForm onAdd={() => {}} />);
    fireEvent.click(screen.getByText('Add Link'));
    expect(await screen.findByText(/url/i)).toBeInTheDocument();
  });

  it('shows error if user is missing', async () => {
    render(<LinkForm onAdd={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('URL*'), {
      target: { value: 'https://test.com' },
    });
    fireEvent.click(screen.getByText('Add Link'));
    expect(await screen.findByText(/user is required/i)).toBeInTheDocument();
  });

  it('shows error if API returns error', async () => {
    // @ts-expect-error: mock fetch for test
    global.fetch = jest.fn((url, options) => {
      if (url === '/api/users') {
        return Promise.resolve({ json: async () => users });
      }
      if (url === '/api/links' && options?.method === 'POST') {
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: 'Failed to add link' }),
        });
      }
      return Promise.reject(new Error('Unknown fetch call'));
    });

    render(<LinkForm onAdd={() => {}} />);
    await screen.findByText('Alice');

    await userEvent.type(screen.getByPlaceholderText('URL*'), 'https://test.com');
    await userEvent.selectOptions(screen.getByLabelText('User'), '1');

    fireEvent.click(screen.getByText('Add Link'));

    await waitFor(() => expect(screen.getByText(/failed to add link/i)).toBeInTheDocument());
  });
  it('calls onAdd on successful submit', async () => {
    const onAdd = jest.fn();
    render(<LinkForm onAdd={onAdd} />);
    await screen.findByText('Alice');
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('URL*'), {
        target: { value: 'https://test.com' },
      });
      fireEvent.change(screen.getByLabelText('User'), { target: { value: '1' } });
    });
    expect(screen.getByPlaceholderText('URL*')).toHaveValue('https://test.com');
    expect(screen.getByLabelText('User')).toHaveValue('1');
    fireEvent.click(screen.getByText('Add Link'));
    await waitFor(() => expect(onAdd).toHaveBeenCalled());
  });
});
