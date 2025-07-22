import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SortControls from './SortControls';

describe('SortControls', () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
  });

  it('renders sort options', () => {
    render(<SortControls orderBy="createdAt" order="desc" onSortChange={mockOnSortChange} />);

    expect(screen.getByText('Sort by:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Date Added')).toBeInTheDocument();
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('calls onSortChange when sort field changes', () => {
    render(<SortControls orderBy="createdAt" order="desc" onSortChange={mockOnSortChange} />);

    const select = screen.getByDisplayValue('Date Added');
    fireEvent.change(select, { target: { value: 'title' } });

    expect(mockOnSortChange).toHaveBeenCalledWith('title', 'desc');
  });

  it('calls onSortChange when sort direction button is clicked', () => {
    render(<SortControls orderBy="createdAt" order="desc" onSortChange={mockOnSortChange} />);

    const directionButton = screen.getByText('↓');
    fireEvent.click(directionButton);

    expect(mockOnSortChange).toHaveBeenCalledWith('createdAt', 'asc');
  });

  it('shows ascending arrow when order is asc', () => {
    render(<SortControls orderBy="createdAt" order="asc" onSortChange={mockOnSortChange} />);

    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('shows descending arrow when order is desc', () => {
    render(<SortControls orderBy="createdAt" order="desc" onSortChange={mockOnSortChange} />);

    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('has correct sort options', () => {
    render(<SortControls orderBy="createdAt" order="desc" onSortChange={mockOnSortChange} />);

    const select = screen.getByDisplayValue('Date Added');
    const options = Array.from(select.querySelectorAll('option'));

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Date Added');
    expect(options[1]).toHaveTextContent('Title');
    expect(options[2]).toHaveTextContent('URL');
  });
});
