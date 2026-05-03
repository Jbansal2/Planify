const variants = {
  primary:
    'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25 hover:shadow-xl',
  secondary:
    'bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 hover:text-white',
  ghost:
    'text-gray-300 hover:text-white hover:bg-white/5',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        transition-all duration-300
        active:scale-95 cursor-pointer
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
