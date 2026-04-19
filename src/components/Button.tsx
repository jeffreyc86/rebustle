import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'green' | 'orange' | 'red' | 'stone';

const VARIANT_STYLES: Record<Variant, { base: string; hover: string; text: string }> = {
  green:  { base: '#00A878', hover: '#009969', text: 'white' },
  orange: { base: '#FF6B2B', hover: '#e55a1f', text: 'white' },
  red:    { base: '#ef4444', hover: '#dc2626', text: 'white' },
  stone:  { base: '#e7e5e4', hover: '#d6d3d1', text: '#57534e' },
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = 'stone', className = '', children, onMouseEnter, onMouseLeave, ...props }: ButtonProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <button
      {...props}
      style={{ background: styles.base, color: styles.text }}
      className={`cursor-pointer active:scale-95 transition-all font-bold rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
      onMouseEnter={(e) => {
        if (!props.disabled) e.currentTarget.style.background = styles.hover;
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = styles.base;
        onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}
