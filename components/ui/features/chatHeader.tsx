'use client';

import type { ElementType, ComponentPropsWithoutRef } from 'react';

type HeaderProps<T extends ElementType> = {
  icon?: React.ReactNode;
  title: string;
  as?: T;
  children?: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'title'>;

export function ChatHeader<T extends ElementType = 'header'>({
  icon,
  title,
  as,
  className,
  children,
  ...props
}: HeaderProps<T>) {
  const Component = as || 'header';
  return (
    <Component
      className={`sticky top-0 z-30 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between ${className}`}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-blue-600">{icon}</span>}
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h1>
      </div>
      {children && <div className="flex items-center">{children}</div>}
    </Component>
  );
}
