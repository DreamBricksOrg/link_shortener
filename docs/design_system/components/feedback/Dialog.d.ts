import { ReactNode } from 'react';

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

export function Dialog(props: DialogProps): JSX.Element | null;
