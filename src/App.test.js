import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'
import { test, expect } from '@jest/globals'
import { CookiesProvider } from 'react-cookie'
import { Provider } from 'react-redux'
import { store } from './store'

test('renders learn react link', () => { 
  render(
    <Provider store={store}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </Provider>
);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});