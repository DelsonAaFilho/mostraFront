"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  GitFork as Github,
  ContactRound as Linkedin,
  Globe,
  Mail,
  GraduationCap,
  Users,
  Play,
  FolderOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PersonAvatar } from "@/components/person-avatar";
import { useSite } from "@/components/site-provider";
import { youtubeEmbed } from "@/lib/validation";

export function ProjectDetails({ id }: { id: string }) {
  const { projects } = useSite();
  const project = projects.find((item) => item.id === id);
  if (!project)
    return (
      <main id="main-content" className="page-container missing-project">
        <FolderOpen size={40} />
        <h1>This project isn’t in the lab yet.</h1>
        <p>
          {id.startsWith("demo-")
            ? "Demo projects are available during the session in which they’re created. Explore the showcase to discover more ideas."
            : "The project you’re looking for may have moved. There are plenty more ideas to discover."}
        </p>
        <Link href="/" className="primary-link">
          <ArrowLeft size={17} />
          Back to projects
        </Link>
      </main>
    );
  const video = project.video ? youtubeEmbed(project.video) : null;
  return (
    <main id="main-content" className="detail-page page-container">
      <Link href="/#projects" className="back-link">
        <ArrowLeft size={16} />
        Back to projects
      </Link>
      <div className="detail-heading">
        <div className="detail-eyebrow">
          <Badge className="detail-area" data-area={project.area}>
            {project.area}
          </Badge>
          <span>
            STUDENT-LED RESEARCH ·{" "}
            {new Date(project.createdAt).getUTCFullYear()}
          </span>
        </div>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
      </div>
      <div className="detail-image">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 1280px) 100vw, 1200px"
          unoptimized={project.image.startsWith("http")}
          priority
        />
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <Card className="detail-card">
            <div className="detail-section-title">
              <FolderOpen size={20} />
              <h2>About the project</h2>
            </div>
            <div className="project-full-description">
              {project.fullDescription.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Card>
          <Card className="detail-card">
            <div className="detail-section-title">
              <Users size={20} />
              <h2>The project team</h2>
              <Badge variant="secondary">
                {project.members.length} members
              </Badge>
            </div>
            <div className="detail-members">
              {project.members.map((member, i) => (
                <div key={`${member.name}-${i}`} className="detail-member">
                  <PersonAvatar name={member.name} className="size-12" />
                  <div className="detail-member-info">
                    <strong>
                      {member.name}
                      {i === 0 ? (
                        <Badge variant="secondary">Main author</Badge>
                      ) : null}
                    </strong>
                    <span>{member.course}</span>
                    {member.email ? (
                      <a href={`mailto:${member.email}`}>{member.email}</a>
                    ) : null}
                  </div>
                  <div className="member-socials">
                    {member.github ? (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} on GitHub (opens in a new tab)`}
                      >
                        <Github size={19} />
                      </a>
                    ) : null}
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} on LinkedIn (opens in a new tab)`}
                      >
                        <Linkedin size={19} />
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {video ? (
            <Card className="detail-card">
              <div className="detail-section-title">
                <Play size={20} />
                <h2>See it in action</h2>
              </div>
              <div className="video-frame">
                <iframe
                  src={video}
                  title={`${project.title} — project video`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <p className="field-hint">
                Demo media provided for illustration.
              </p>
            </Card>
          ) : null}
        </div>
        <aside className="detail-aside">
          <Card className="detail-card">
            <div className="detail-section-title">
              <GraduationCap size={20} />
              <h2>Project advisor</h2>
            </div>
            <div className="advisor-profile">
              <PersonAvatar
                name={project.professor.name}
                image={project.professor.image}
                className="size-16"
              />
              <h3>{project.professor.name}</h3>
              <p>{project.professor.department}</p>
            </div>
            <Separator />
            <a
              className="advisor-email"
              href={`mailto:${project.professor.email}`}
            >
              <Mail size={15} />
              {project.professor.email}
            </a>
          </Card>
          <Card className="detail-card">
            <div className="detail-section-title">
              <ArrowUpRight size={20} />
              <h2>Explore the project</h2>
            </div>
            <a
              className="project-external-link"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={20} />
              <div>
                <strong>GitHub repository</strong>
                <span>Explore the code and contribute</span>
              </div>
              <ArrowUpRight size={17} />
            </a>
            {project.website ? (
              <>
                <Separator />
                <a
                  className="project-external-link"
                  href={project.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe size={20} />
                  <div>
                    <strong>Project website</strong>
                    <span>Visit the live experience</span>
                  </div>
                  <ArrowUpRight size={17} />
                </a>
              </>
            ) : null}
          </Card>
          <div className="detail-note">
            <span className="status-dot" />
            <p>
              Good ideas grow through collaboration.
              <br />
              <strong>Get curious. Get in touch.</strong>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
