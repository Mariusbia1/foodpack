import { Link } from 'react-router-dom'

export default function Button({ to, variant = 'dark', className = '', children, ...props }) {
  const classes = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variant === 'outline' ? 'border border-black bg-transparent text-black hover:bg-black hover:text-white' : 'bg-black text-white hover:bg-neutral-800 shadow-sm'} ${className}`
  return to ? <Link className={classes} to={to}>{children}</Link> : <button className={classes} {...props}>{children}</button>
}
