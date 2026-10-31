import type { Project } from "@/lib/projects";
import HeroKinetic from "./hero/HeroKinetic";

export default function Hero({
  featuredProject = null,
  projectCount = 0,
}: {
  featuredProject?: Project | null;
  projectCount?: number;
}) {
  return <HeroKinetic featuredProject={featuredProject} projectCount={projectCount} />;
}
