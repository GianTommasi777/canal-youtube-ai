import { CreateIdeaForm } from "@/components/create-idea-form";
import { IdeaKanban } from "@/components/idea-kanban";
import { PageHeader } from "@/components/page-header";
import { getIdeas } from "@/lib/api";

export default async function IdeasPage() {
  const ideas = await getIdeas();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creative backlog"
        title="Ideas"
        description="Captura conceptos, hooks y nichos. El estado cuenta la historia de cada pieza."
        action={<CreateIdeaForm />}
      />

      <IdeaKanban initialIdeas={ideas} />
    </div>
  );
}
