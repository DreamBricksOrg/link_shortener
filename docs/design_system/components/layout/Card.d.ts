import { ReactNode, MouseEventHandler } from 'react';

/**
 * @startingPoint section="Layout" subtitle="Base surface for panels & rows" viewport="700x200"
 */
export interface CardProps {
  children?: ReactNode;
  padding?: string;
  hoverable?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function Card(props: CardProps): JSX.Element;
