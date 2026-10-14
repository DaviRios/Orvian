import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const variants = {
  primary:
    'bg-orvian-primary text-white hover:bg-orvian-orange focus-visible:ring-orvian-primary',
  secondary:
    'border border-orvian-secondary bg-orvian-shadow text-white hover:bg-orvian-secondary focus-visible:ring-orvian-secondary',
  danger:
    'bg-orvian-red text-white hover:bg-orvian-primary focus-visible:ring-orvian-red',
};

export function Button({
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
