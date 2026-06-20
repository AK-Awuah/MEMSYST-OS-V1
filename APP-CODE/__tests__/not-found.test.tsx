import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from '../src/app/not-found'

test('NotFound page renders heading', () => {
  render(<NotFound />)
  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
})
