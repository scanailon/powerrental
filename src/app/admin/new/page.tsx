import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { pageVars } from "@/lib/theme";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata: Metadata = {
  title: "Nuevo proyecto · Admin",
  robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0B", ...pageVars }}>
      <AdminHeader />
      <main className="max-w-[860px] mx-auto px-5 md:px-8 pb-24">
        <h1 className="text-[26px] md:text-[32px] font-light text-white tracking-[-0.02em] mb-1">
          Nuevo proyecto
        </h1>
        <p className="text-[14px] text-white/45 mb-10">
          Completa los datos. La imagen es opcional (queda como pendiente si no la subes).
        </p>
        <div
          className="rounded-[1.25rem] border p-6 md:p-10"
          style={{ background: "#0F0F12", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <ProjectForm />
        </div>
      </main>
    </div>
  );
}
