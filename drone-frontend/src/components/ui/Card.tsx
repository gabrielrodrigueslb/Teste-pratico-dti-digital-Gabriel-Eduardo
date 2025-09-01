import { type JSX, type ReactNode } from 'react';

type CardProps = {
  title?: string;
  icon?: JSX.Element;
  value?: number;
  clockTime?: string;
  description?: string;
  infoCard: boolean;
  children?: ReactNode;
  style?: string;
};

export default function Card({
  title,
  icon,
  value,
  clockTime,
  description,
  infoCard,
  children, style
}: CardProps) {
  return (
    <aside className={`card p-7 bg-(--color-foreground) flex flex-col flex-1 rounded-2xl text-(--color-text) ${style}`}>
      {infoCard ? (
        <>
          <span className="flex justify-between items-center pb-6">
            <p className="text-base font-semibold opacity-90">{title}</p>
            <span className="opacity-55">{icon}</span>
          </span>
          <span className="text-3xl font-bold opacity-90">{value || clockTime || 0}</span>
          <p className="text-sm opacity-55">{description}</p>
        </>
      ) : (
        children
      )}
    </aside>
  );
}
