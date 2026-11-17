import { ReactNode } from 'react';

export interface TagProps {
  children: ReactNode;
  onRemove?: () => void;
  color?: string;
}

export function Tag(props: TagProps): JSX.Element;
