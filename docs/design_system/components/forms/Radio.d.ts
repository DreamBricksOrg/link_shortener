import { ChangeEventHandler } from 'react';

export interface RadioProps {
  label?: string;
  checked?: boolean;
  name?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export function Radio(props: RadioProps): JSX.Element;
