import { ChangeEventHandler } from 'react';

export interface SwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export function Switch(props: SwitchProps): JSX.Element;
