'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { UserRoundCog, Presentation, Layers2, Lightbulb } from 'lucide-react';

const items = [
  {
    title: 'Asistente de Scrum',
    link: '/scrum-assistant',
    icon: UserRoundCog,
  },
  {
    title: 'Asistente de Reuniones',
    link: '/meet-assistant',
    icon: Presentation,
  },
  {
    title: 'Historias de Usuario',
    link: '/user-stories',
    icon: Lightbulb,
  },
  {
    title: 'Buenas Prácticas',
    link: '/good-practices',
    icon: Layers2,
  },
];
/**
 * A sidebar component for the application, providing navigation links to different assistant features.
 *
 * @component
 * @returns {JSX.Element} - Renders a sidebar with a header (logo and title) and a menu of navigation items.
 *
 * @remarks
 * - Uses the `next/link` component for navigation.
 * - Dynamically determines the active link using `next/navigation`.
 * - The navigation items are statically defined within the component.
 * - Utilizes UI components from `@/components/ui/sidebar` for structure and styling.
 *
 * @example
 * ```tsx
 * <AppSidebar />
 * ```
 */
export function AppSidebar() {
  const currentPath = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-start gap-2 px-2">
          <Image src="/icon.png" alt="FinTrack" width={40} height={40} priority />
          <h1 className="text-2xl font-semibold text-gray-800">ScrumMate</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.link}>
                  <Link href={item.link} passHref>
                    <SidebarMenuButton isActive={currentPath === item.link}>
                      <item.icon className="w-6 h-6 mr-2" />
                      {item.title}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
