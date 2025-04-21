'use client';

import type { ElementType, ComponentPropsWithoutRef } from 'react';

type HeaderProps<T extends ElementType> = {
  icon?: React.ReactNode;
  title: string;
  as?: T;
  children?: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'title'>;
/**
 * A header component typically used at the top of a chat window, displaying a title and optional icon and children.
 *
 * @component
 * @template T - The HTML element to render as. Defaults to 'header'.
 * @param {React.ReactNode} [icon] - An optional icon to display to the left of the title.
 * @param {string} title - The main title text to display in the header.
 * @param {T} [as='header'] - The HTML element or component to render as. Defaults to 'header'.
 * @param {string} [className] - Optional CSS class names to apply to the header element.
 * @param {React.ReactNode} [children] - Optional content to display on the right side of the header.
 * @returns {JSX.Element} - Renders a header element (or the element specified by the `as` prop) containing the icon, title, and optional children.
 *
 * @remarks
 * - The header is styled to be sticky at the top of its container with a white background, a bottom border, and a subtle shadow.
 * - The `as` prop allows rendering the header as a different HTML element or a custom component, providing flexibility in the component's structure.
 * - The component uses Tailwind CSS classes for styling.
 *
 * @example
 * ```tsx
 * <ChatHeader title="Conversation with John Doe" icon={<UserIcon className="h-5 w-5" />} />
 *
 * <ChatHeader title="Group Chat" as="div" className="bg-gray-100">
 * <Button size="sm">Add User</Button>
 * </ChatHeader>
 * ```
 */
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
