import { ReactNode, ChangeEventHandler } from 'react';

export interface InputProps {
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export function Input(props: InputProps): JSX.Element;
