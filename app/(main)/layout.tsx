'use client';
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/features/sidebar';
/**
 * Provides the main layout structure for the application, including a sidebar and a trigger for its toggling.
 *
 * @component
 * @param {{ children: React.ReactNode }} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to be rendered within the main area of the layout.
 * @returns {JSX.Element} - Renders a `SidebarProvider` wrapping the `AppSidebar`, `SidebarTrigger`, and the main content area.
 *
 * @remarks
 * - Uses the `SidebarProvider` to manage the state and context for the sidebar functionality.
 * - Includes the `AppSidebar` component, which renders the actual navigation sidebar.
 * - The `SidebarTrigger` component likely renders a button or element that toggles the sidebar's visibility.
 * - The `children` prop is rendered within the main content area, which occupies the full height and width.
 *
 * @example
 * ```tsx
 * <MainLayout>
 * <HomePageContent />
 * </MainLayout>
 * ```
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="h-full w-full">{children}</main>
    </SidebarProvider>
  );
}
