"use client"

// Cambiando a export default en lugar de export named
const Button = ({ children, className = "", variant = "default", size = "default", onClick, ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200",
    outline:
      "border border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
    ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
  }

  const sizes = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export {Button}

