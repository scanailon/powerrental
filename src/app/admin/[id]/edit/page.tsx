import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getProject } from "@/lib/projects";
import { pageVars } from "@/lib/theme";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata: Metadata = {
  title: "Editar proyecto · Admin",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0B", ...pageVars }}>
      <AdminHeader />
      <main className="max-w-[860px] mx-auto px-5 md:px-8 pb-24">
        <h1 className="text-[26px] md:text-[32px] font-light text-white tracking-[-0.02em] mb-1">
          Editar proyecto
        </h1>
        <p className="text-[14px] text-white/45 mb-10">{project.title}</p>
        <div
          className="rounded-[1.25rem] border p-6 md:p-10"
          style={{ background: "#0F0F12", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <ProjectForm project={project} />
        </div>
      </main>
    </div>
  );
}
