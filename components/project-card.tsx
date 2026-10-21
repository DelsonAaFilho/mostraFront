import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/person-avatar";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="project-link"
      aria-label={`View ${project.title}, a ${project.area} project by ${project.members[0].name}`}
    >
      <Card className="project-card">
        <div className="project-image">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            unoptimized={project.image.startsWith("http")}
          />
          <Badge className="area-badge" data-area={project.area}>
            {project.area}
          </Badge>
          <span className="image-open">
            <ArrowUpRight size={17} />
          </span>
        </div>
        <div className="project-card-body">
          <div className="project-title-row">
            <h3>{project.title}</h3>
            <ArrowUpRight size={19} />
          </div>
          <p className="project-description">{project.description}</p>
          <p className="project-professor">
            <GraduationCap size={15} />
            {project.professor.name}
          </p>
          <div className="project-author">
            <PersonAvatar name={project.members[0].name} />
            <div>
              <strong>{project.members[0].name}</strong>
              <span>{project.members[0].course}</span>
            </div>
            <span className="project-discover">
              View project <ArrowUpRight size={13} />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
