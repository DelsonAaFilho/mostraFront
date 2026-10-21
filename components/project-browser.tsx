"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  SlidersHorizontal,
  Shapes,
  Plus,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/components/project-card";
import { useSite } from "@/components/site-provider";
import { courseAreas } from "@/lib/types";

const primaryAreas = ["Technology", "Engineering", "Health", "Education"];
const moreAreas: readonly string[] = courseAreas.filter(
  (area) => !primaryAreas.includes(area),
);

export function ProjectBrowser() {
  const { projects, openCreate } = useSite();
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("All projects");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !target.closest("input, textarea, [contenteditable], [role=dialog]")
      ) {
        event.preventDefault();
        searchInput.current?.focus();
      }
    }
    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);
  const query = search.trim().toLowerCase();
  const filtered = projects
    .filter(
      (project) =>
        (area === "All projects" || project.area === area) &&
        (!query ||
          [
            project.title,
            project.area,
            project.professor.name,
            ...project.members.flatMap((member) => [
              member.name,
              member.course,
            ]),
          ].some((value) => value.toLowerCase().includes(query))),
    )
    .sort((a, b) =>
      sort === "az"
        ? a.title.localeCompare(b.title)
        : b.createdAt.localeCompare(a.createdAt),
    );
  const totalPages = Math.ceil(filtered.length / 6);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const visible = filtered.slice((currentPage - 1) * 6, currentPage * 6);
  function selectArea(value: string) {
    setArea(value);
    setPage(1);
  }
  function clearFilters() {
    setSearch("");
    setArea("All projects");
    setPage(1);
  }
  return (
    <section
      id="projects"
      className="projects-section page-container"
      aria-labelledby="projects-title"
    >
      <div className="section-heading">
        <div>
          <div className="section-kicker">
            <span /> MADE ON CAMPUS. MEANT FOR THE WORLD.
          </div>
          <h2 id="projects-title">
            Featured projects
            <span className="count-badge">{projects.length}</span>
          </h2>
          <p>
            Fresh perspectives. Real-world possibilities. Find your next
            inspiration.
          </p>
        </div>
        <div className="search-wrap">
          <Search size={18} />
          <label htmlFor="project-search" className="sr-only">
            Search projects, authors, professors, or course areas
          </label>
          <Input
            ref={searchInput}
            id="project-search"
            placeholder="Search projects, people, or ideas..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          {search ? (
            <button
              aria-label="Clear search"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
            >
              <X size={16} />
            </button>
          ) : (
            <kbd>/</kbd>
          )}
        </div>
      </div>
      <div className="project-toolbar">
        <div className="category-filters" aria-label="Filter by course area">
          <Button
            variant="ghost"
            className={
              area === "All projects"
                ? "category-button selected"
                : "category-button"
            }
            aria-pressed={area === "All projects"}
            onClick={() => selectArea("All projects")}
          >
            <Shapes size={15} />
            All projects
          </Button>
          {primaryAreas.map((item) => (
            <Button
              key={item}
              variant="ghost"
              className={
                area === item ? "category-button selected" : "category-button"
              }
              aria-pressed={area === item}
              onClick={() => selectArea(item)}
            >
              {item}
            </Button>
          ))}
          <Select
            value={moreAreas.includes(area) ? area : null}
            onValueChange={(value) => {
              if (value) selectArea(value);
            }}
            items={moreAreas.map((value) => ({ value, label: value }))}
          >
            <SelectTrigger
              className={`more-filter ${moreAreas.includes(area) ? "selected" : ""}`}
              aria-label="More course areas"
            >
              <SelectValue placeholder="More areas" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="min-w-56">
              {moreAreas.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sort-wrap">
          <SlidersHorizontal size={14} />
          <span>Sort by:</span>
          <Select
            value={sort}
            onValueChange={(value) => {
              if (value) {
                setSort(value);
                setPage(1);
              }
            }}
            items={[
              { value: "recent", label: "Most recent" },
              { value: "az", label: "Title A–Z" },
            ]}
          >
            <SelectTrigger aria-label="Sort projects">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value="recent">Most recent</SelectItem>
              <SelectItem value="az">Title A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="sr-only" role="status">
        {filtered.length} projects found. Page {currentPage} of{" "}
        {Math.max(1, totalPages)}.
      </p>
      {visible.length ? (
        <div className="project-grid">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={30} />
          <h3>No projects found</h3>
          <p>Try another title, author, professor, or course area.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear search and filters
          </Button>
        </div>
      )}
      {totalPages > 0 ? (
        <div className="pagination-row">
          <p>
            Showing{" "}
            <strong>
              {(currentPage - 1) * 6 + 1}–
              {Math.min(currentPage * 6, filtered.length)}
            </strong>{" "}
            of <strong>{filtered.length}</strong> projects
          </p>
          <Pagination aria-label="Project pages">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ArrowLeft size={15} />
                  <span className="pagination-word">Previous</span>
                </Button>
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <Button
                    size="icon"
                    variant={currentPage === i + 1 ? "secondary" : "ghost"}
                    className={currentPage === i + 1 ? "active-page" : ""}
                    aria-label={`Page ${i + 1}`}
                    aria-current={currentPage === i + 1 ? "page" : undefined}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                </PaginationItem>
              ))}
              <PaginationItem>
                <Button
                  variant="ghost"
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  onClick={() => setPage(currentPage + 1)}
                >
                  <span className="pagination-word">Next</span>
                  <ArrowRight size={15} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="page-indicator">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      ) : null}
      <div className="create-banner">
        <div className="banner-icon">
          <Sparkles size={25} strokeWidth={1.4} />
        </div>
        <div>
          <h3>Your next big idea belongs here.</h3>
          <p>Share what you’re building. Inspire what comes next.</p>
        </div>
        <Button onClick={openCreate} className="banner-button">
          <Plus size={16} />
          Create a project
          <ArrowUpRight size={16} />
        </Button>
      </div>
    </section>
  );
}
