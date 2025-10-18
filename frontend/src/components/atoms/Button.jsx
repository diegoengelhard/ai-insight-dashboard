import Icon from './Icon';

/**
 * A reusable button component with consistent styling.
 * @param {{
 * children: React.ReactNode,
 * onClick: () => void,
 * variant?: 'primary' | 'secondary',
 * className?: string,
 * iconName?: string,
 * iconSize?: number
 * }} props
 */
const Button = ({ children, onClick, variant = 'primary', className = '', iconName, iconSize = 16, ...props }) => {
  // Define base styles for all buttons.
  const baseStyles = 'px-4 py-2 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2';

  // Define styles for different variants.
  const variantStyles = {
    primary: 'bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-hover))]',
    secondary: 'bg-[rgb(var(--surface))] text-[rgb(var(--text-default))] border border-[rgb(var(--separator))] hover:bg-gray-50',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Render icon if provided. */}
      {iconName && <Icon name={iconName} size={iconSize} />}
      {children}
    </button>
  );
};

export default Button;
