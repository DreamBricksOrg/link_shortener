export interface ToastProps {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  message?: string;
  onClose?: () => void;
}

export function Toast(props: ToastProps): JSX.Element;
