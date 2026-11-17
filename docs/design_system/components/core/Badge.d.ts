import { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  dot?: boolean;
}

export function Badge(props: BadgeProps): JSX.Element;
