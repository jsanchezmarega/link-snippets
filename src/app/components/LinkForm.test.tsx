import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LinkForm from './LinkForm';

describe('LinkForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the form', () => {
    render(<LinkForm onAdd={() => {}} />);
    expect(screen.getByPlaceholderText('URL*')).toBeInTheDocument();
    expect(screen.getByText('Add Link')).toBeInTheDocument();
  });

  it('shows error if URL is missing', async () => {
    render(<LinkForm onAdd={() => {}} />);
    fireEvent.click(screen.getByText('Add Link'));
    expect(await screen.findByText(/url/i)).toBeInTheDocument();
  });

  it('shows error if API returns error', async () => {
    // @ts-expect-error: mockResolvedValueOnce is not typed on global.fetch
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to add link' }),
    });
    render(<LinkForm onAdd={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('URL*'), {
      target: { value: 'https://test.com' },
    });
    fireEvent.click(screen.getByText('Add Link'));
    expect(await screen.findByText('Failed to add link')).toBeInTheDocument();
  });

  it('calls onAdd on successful submit', async () => {
    const onAdd = jest.fn();
    // @ts-expect-error: mockResolvedValueOnce is not typed on global.fetch
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    render(<LinkForm onAdd={onAdd} />);
    fireEvent.change(screen.getByPlaceholderText('URL*'), {
      target: { value: 'https://test.com' },
    });
    fireEvent.click(screen.getByText('Add Link'));
    await waitFor(() => expect(onAdd).toHaveBeenCalled());
  });
});
