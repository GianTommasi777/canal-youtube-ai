import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { IdeaWorkspace } from "@/components/idea-workspace";
import { StatusSelect } from "@/components/status-select";
import { getIdea } from "@/lib/api";

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idea = await getIdea(id);
  if (!idea) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${idea.niche} / idea ${idea.id.toString().padStart(3, "0")}`}
        title={idea.title}
        description={idea.concept}
        action={<div className="w-56"><StatusSelect ideaId={idea.id} initialStatus={idea.status} /></div>}
      />

      <IdeaWorkspace initialIdea={idea} />
    </div>
  );
}
