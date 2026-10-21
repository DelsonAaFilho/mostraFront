import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import { ProjectDetails } from "@/components/project-details";

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((project) => project.id === id);
  return {
    title: project?.title ?? "Your project",
    description: project?.description,
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!projects.some((project) => project.id === id) && !id.startsWith("demo-"))
    notFound();
  return <ProjectDetails id={id} />;
}
