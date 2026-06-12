import type { Metadata } from "next";
import StudioEditor from "@/components/studio/StudioEditor";
import { content } from "@/lib/content";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Studio Portal",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioEditor initialContent={content} initialProjects={projects} />;
}
