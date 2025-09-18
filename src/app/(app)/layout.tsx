
import AppSidebar from '@/components/layout/sidebar';
import AppHeader from '@/components/layout/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppProvider } from '@/context/AppContext';
import { DataProvider } from '@/context/DataContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <DataProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </DataProvider>
    </AppProvider>
  );
}
