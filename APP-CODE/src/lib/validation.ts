export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) return "Email or username is required"
  if (email.includes("@")) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format"
  }
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required"
  if (password.length < 8) return "Password must be at least 8 characters"
  return null
}

export function validatePhone(phone: string): string | null {
  if (!phone) return null
  if (!/^\+?[\d\s-]{7,15}$/.test(phone)) return "Invalid phone number format"
  return null
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) return `${fieldName} is required`
  return null
}

export function validateUrl(url: string): string | null {
  if (!url) return null
  try {
    new URL(url)
    return null
  } catch {
    return "Invalid URL format"
  }
}

export function validateMinLength(value: string, min: number, fieldName: string): string | null {
  if (value && value.length < min) return `${fieldName} must be at least ${min} characters`
  return null
}

export function validateNumber(value: string, fieldName: string): string | null {
  if (value && isNaN(Number(value))) return `${fieldName} must be a number`
  return null
}

export function validateForm(values: Record<string, string>, rules: Record<string, (value: string) => string | null>): ValidationResult {
  const errors: Record<string, string> = {}
  for (const [field, rule] of Object.entries(rules)) {
    const error = rule(values[field] || "")
    if (error) errors[field] = error
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  return validateForm(
    { email, password },
    {
      email: (v) => validateEmail(v),
      password: (v) => validateRequired(v, "Password"),
    },
  )
}

export function validateUserForm(name: string, email: string, password?: string): ValidationResult {
  const rules: Record<string, (value: string) => string | null> = {
    name: (v) => validateRequired(v, "Name"),
    email: (v) => validateEmail(v),
  }
  if (password !== undefined) {
    rules.password = (v) => validatePassword(v)
  }
  return validateForm({ name, email, ...(password !== undefined ? { password } : {}) }, rules)
}
