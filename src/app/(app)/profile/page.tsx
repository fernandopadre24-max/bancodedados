import { PageHeader } from "@/components/shared/page-header"

export const metadata = {
  title: "Perfil | ContaSimples",
};

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Perfil"
        description="Gerencie as informações do seu perfil."
      />
      <div>
        {/* O conteúdo da página de perfil virá aqui */}
      </div>
    </>
  )
}
