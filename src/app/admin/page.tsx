import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { getProjects } from "@/lib/projects";
import { getEvents } from "@/lib/events";
import { pageVars } from "@/lib/theme";
import AdminHeader from "@/components/admin/AdminHeader";
import Dashboard from "@/components/admin/Dashboard";
import EventsManager from "@/components/admin/EventsManager";

export const metadata: Metadata = {
  title: "Admin · Power Rental",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await requireAdmin();
  const [projects, events] = await Promise.all([getProjects(), getEvents()]);

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0B", ...pageVars }}>
      <AdminHeader backTo="/" />
      <main className="max-w-[1100px] mx-auto px-5 md:px-8 pb-24">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-[28px] md:text-[36px] font-light text-white tracking-[-0.02em]">
            Panel de administración
          </h1>
          <p className="text-[14px] text-white/50">
            {projects.length} proyecto{projects.length === 1 ? "" : "s"} en total.
          </p>
        </div>
        <div className="flex flex-col gap-10">
          <Dashboard projects={projects} />
          <EventsManager events={events} />
        </div>
      </main>
    </div>
  );
}
