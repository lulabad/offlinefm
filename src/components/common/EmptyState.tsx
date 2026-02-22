import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in-up">
      {icon && <div className="text-secondary mb-4 opacity-40">{icon}</div>}
      <h3 className="text-lg font-semibold text-primary mb-1 font-display">{title}</h3>
      {description && <p className="text-sm text-secondary mb-4 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
