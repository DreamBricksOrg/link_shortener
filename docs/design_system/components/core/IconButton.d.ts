import { ReactNode, MouseEventHandler } from 'react';

export interface IconButtonProps {
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'primary' | 'secondary';
  label: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function IconButton(props: IconButtonProps): JSX.Element;
