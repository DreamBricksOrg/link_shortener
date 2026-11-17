import { ReactNode, MouseEventHandler } from 'react';

/**
 * @startingPoint section="Core" subtitle="Primary interactive control" viewport="700x220"
 */
export interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button(props: ButtonProps): JSX.Element;
