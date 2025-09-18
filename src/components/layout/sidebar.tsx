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
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Wallet },
  { href: '/budgets', label: 'Budgets', icon: BookText },
  { href: '/reports', label: 'Reports', icon: LineChart },
  { href: '/savings', label: 'Savings Goals', icon: PiggyBank },
  { href: '/subscriptions', label: 'Subscriptions', icon: Repeat },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="items-center justify-center text-primary">
        <Gem className="w-7 h-7" />
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
              <SidebarMenuButton asChild tooltip="Settings">
                <span>
                  <Settings />
                  <span>Settings</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/help" passHref>
              <SidebarMenuButton asChild tooltip="Help">
                <span>
                  <HelpCircle />
                  <span>Help</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
