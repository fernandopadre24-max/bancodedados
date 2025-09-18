'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Wallet,
  BookText,
  LineChart,
  PiggyBank,
  Repeat,
  Gem,
  Settings,
  HelpCircle,
  User,
  Receipt,
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const menuItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: Wallet },
  { href: '/bills', label: 'Contas', icon: Receipt },
  { href: '/budgets', label: 'Orçamentos', icon: BookText },
  { href: '/reports', label: 'Relatórios', icon: LineChart },
  { href: '/savings', label: 'Metas de Poupança', icon: PiggyBank },
  { href: '/subscriptions', label: 'Assinaturas', icon: Repeat },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { appTitle } = useAppContext();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="items-center justify-center text-primary">
        <Gem className="w-6 h-6" />
        <span className="text-xl font-semibold font-headline">{appTitle}</span>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/profile" passHref legacyBehavior>
                    <SidebarMenuButton
                    as="a"
                    isActive={pathname === '/profile'}
                    tooltip="Perfil"
                    >
                    <User />
                    <span>Perfil</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/settings" passHref legacyBehavior>
              <SidebarMenuButton
                as="a"
                isActive={pathname === '/settings'}
                tooltip="Configurações"
              >
                <Settings />
                <span>Configurações</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/help" passHref legacyBehavior>
              <SidebarMenuButton as="a" tooltip="Ajuda">
                <HelpCircle />
                <span>Ajuda</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
