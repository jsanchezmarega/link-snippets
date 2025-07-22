import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination controls when total pages > 1', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not render when total pages <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('calls onPageChange when page button is clicked', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />);

    fireEvent.click(screen.getByText('2'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('disables Previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination currentPage={3} totalPages={3} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('highlights current page', () => {
    render(<Pagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />);

    const currentPageButton = screen.getByText('2');
    expect(currentPageButton).toHaveClass('bg-blue-600', 'text-white');
  });
});
