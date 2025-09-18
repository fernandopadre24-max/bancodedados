'use client';

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
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: Wallet },
  { href: '/budgets', label: 'Orçamentos', icon: BookText },
  { href: '/reports', label: 'Relatórios', icon: LineChart },
  { href: '/savings', label: 'Metas de Poupança', icon: PiggyBank },
  { href: '/subscriptions', label: 'Assinaturas', icon: Repeat },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="items-center justify-center text-primary">
        <Gem className="w-6 h-6" />
        <span className="text-xl font-semibold font-headline">ContaSimples</span>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <span>
                    <item.icon />
                    <span>{item.label}</span>
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" passHref>
              <SidebarMenuButton asChild tooltip="Configurações">
                <span>
                  <Settings />
                  <span>Configurações</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/help" passHref>
              <SidebarMenuButton asChild tooltip="Ajuda">
                <span>
                  <HelpCircle />
                  <span>Ajuda</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
