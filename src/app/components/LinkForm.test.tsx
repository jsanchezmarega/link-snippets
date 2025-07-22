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
    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('Add Link')).toBeInTheDocument();
    // User options
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows error if URL is missing', async () => {
    render(<LinkForm onAdd={() => {}} />);
    await screen.findByText('Alice');

    // Fill in user but not URL
    fireEvent.change(screen.getByDisplayValue('Select user'), { target: { value: '1' } });

    // Try to submit - button should be disabled
    const submitButton = screen.getByText('Add Link');
    expect(submitButton).toBeDisabled();
  });

  it('shows error if user is missing', async () => {
    render(<LinkForm onAdd={() => {}} />);

    // Fill in URL but not user
    fireEvent.change(screen.getByPlaceholderText('https://example.com'), {
      target: { value: 'https://test.com' },
    });

    // Try to submit - button should be disabled
    const submitButton = screen.getByText('Add Link');
    expect(submitButton).toBeDisabled();
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

    // Fill in all required fields
    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'https://test.com');
    fireEvent.change(screen.getByDisplayValue('Select user'), { target: { value: '1' } });

    // Now button should be enabled
    const submitButton = screen.getByText('Add Link');
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(/failed to add link/i)).toBeInTheDocument());
  });

  it('calls onAdd on successful submit', async () => {
    const onAdd = jest.fn();
    render(<LinkForm onAdd={onAdd} />);
    await screen.findByText('Alice');

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('https://example.com'), {
        target: { value: 'https://test.com' },
      });
      fireEvent.change(screen.getByDisplayValue('Select user'), { target: { value: '1' } });
    });

    expect(screen.getByPlaceholderText('https://example.com')).toHaveValue('https://test.com');
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();

    const submitButton = screen.getByText('Add Link');
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);
    await waitFor(() => expect(onAdd).toHaveBeenCalled());
  });

  it('shows success message when link is added successfully', async () => {
    const onAdd = jest.fn();
    render(<LinkForm onAdd={onAdd} />);
    await screen.findByText('Alice');

    // Fill in all required fields
    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'https://test.com');
    fireEvent.change(screen.getByDisplayValue('Select user'), { target: { value: '1' } });

    // Submit the form
    const submitButton = screen.getByText('Add Link');
    expect(submitButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check for success message - it should appear and stay visible
    await waitFor(
      () => {
        expect(screen.getByText('Link added successfully!')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    // Verify onAdd was called
    expect(onAdd).toHaveBeenCalled();

    // Verify success message is visible
    expect(
      screen.getByText('Your link has been saved and is now available in the list below.'),
    ).toBeInTheDocument();
  });

  it('clears form when Escape key is pressed', async () => {
    render(<LinkForm onAdd={() => {}} />);
    await screen.findByText('Alice');

    // Fill in some form fields
    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'https://test.com');
    fireEvent.change(screen.getByDisplayValue('Select user'), { target: { value: '1' } });
    await userEvent.type(screen.getByPlaceholderText('Page title (optional)'), 'Test Title');

    // Verify fields are filled
    expect(screen.getByPlaceholderText('https://example.com')).toHaveValue('https://test.com');
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Page title (optional)')).toHaveValue('Test Title');

    // Press Escape key
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    // Verify form is cleared
    expect(screen.getByPlaceholderText('https://example.com')).toHaveValue('');
    expect(screen.getByDisplayValue('Select user')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Page title (optional)')).toHaveValue('');
  });

  it('submits form when Ctrl+Enter is pressed', async () => {
    const onAdd = jest.fn();
    render(<LinkForm onAdd={onAdd} />);
    await screen.findByText('Alice');

    // Fill in required fields
    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'https://test.com');
    fireEvent.change(screen.getByDisplayValue('Select user'), { target: { value: '1' } });

    // Press Ctrl+Enter
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Enter', ctrlKey: true });
    });

    // Verify onAdd was called
    await waitFor(() => expect(onAdd).toHaveBeenCalled());
  });
});
