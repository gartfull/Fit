import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-[#E2B49A] text-white hover:bg-[#d4a388] shadow-sm",
      outline: "border border-[#E2B49A] bg-transparent text-[#E2B49A] hover:bg-[#F4E7E1]",
      ghost: "hover:bg-[#F4E7E1] text-slate-600 hover:text-slate-900",
      secondary: "bg-[#F4E7E1] text-slate-800 hover:bg-[#e8d5c8]",
    }
    const sizes = {
      default: "h-10 px-6 py-2",
      sm: "h-9 px-4",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    }
    
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
