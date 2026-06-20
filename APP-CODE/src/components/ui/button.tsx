import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    
    // Base classes
    const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    // Variant classes
    const variants = {
      default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90",
      outline: "border border-[var(--primary)] bg-transparent hover:bg-[var(--secondary)] text-[var(--foreground)]",
      ghost: "hover:bg-[var(--secondary)] hover:text-[var(--foreground)] text-[var(--foreground)]",
      link: "text-[var(--primary)] underline-offset-4 hover:underline",
    }
    
    // Size classes
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8 text-md",
      icon: "h-10 w-10",
    }
    
    const combinedClasses = `${base} ${variants[variant]} ${sizes[size]} ${className}`

    return (
      <button
        className={combinedClasses}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
