// src/app/page.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from './page'; // Adjust path if your page is elsewhere

// Mock next/navigation
// jest.mock('next/navigation', () => ({
//   useRouter: jest.fn(),
//   usePathname: jest.fn().mockReturnValue('/'),
//   useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
//   // Add any other specific hooks you might need from next/navigation
// }));
// No, for App router, useTransition is from 'react', not 'next/navigation' for this component.
// The component is simple enough that it might not need extensive mocking of navigation.

describe('ResearchPage', () => {
  it('renders the main heading', () => {
    render(<Page />);
    const heading = screen.getByRole('heading', { name: /Deep Research Agent/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the input field and button', () => {
    render(<Page />);
    const inputElement = screen.getByPlaceholderText(/Enter your research topic.../i);
    expect(inputElement).toBeInTheDocument();

    const buttonElement = screen.getByRole('button', { name: /Research/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('updates query state on input change', () => {
    render(<Page />);
    const inputElement = screen.getByPlaceholderText(/Enter your research topic.../i) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'test query' } });
    expect(inputElement.value).toBe('test query');
  });

  it('button is initially enabled when query is empty but becomes enabled once query is typed', () => {
    render(<Page />);
    const buttonElement = screen.getByRole('button', { name: /Research/i });
    // The button's disabled state depends on the query and isPending.
    // Initially query is empty, so button should be disabled.
    expect(buttonElement).toBeDisabled(); 

    const inputElement = screen.getByPlaceholderText(/Enter your research topic.../i);
    fireEvent.change(inputElement, { target: { value: 'test' } });
    expect(buttonElement).not.toBeDisabled();
  });

  // More tests can be added for API call simulation, loading, and error states.
  // For this step, basic rendering and interaction tests are sufficient.
});
