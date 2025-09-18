
import { PageHeader } from "@/components/shared/page-header"
import SettingsClient from "@/components/settings/settings-client"

export const metadata = {
  title: "Configurações | ContaSimples",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações e preferências da sua conta."
      />
      <SettingsClient />
    </>
  )
}
