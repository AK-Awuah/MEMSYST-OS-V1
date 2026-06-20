import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorPage from '../src/app/error'

test('Error page renders', () => {
  const reset = () => {}
  render(<ErrorPage error={new Error('test')} reset={reset} />)
  expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument()
})
