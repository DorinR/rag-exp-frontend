import React from 'react';
import { cn } from '../../../lib/utils';

export type ButtonVariant = 'primary' | 'neutral' | 'danger' | 'soft';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', children, ...props }, ref) => {
        const baseStyles =
            'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

        const variantStyles = {
            primary:
                'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            neutral:
                'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
            soft: 'bg-transparent text-gray-500 hover:bg-gray-100 focus:ring-0 dark:text-gray-300 dark:hover:bg-gray-800',
        };

        return (
            <button
                className={cn(baseStyles, variantStyles[variant], className)}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
