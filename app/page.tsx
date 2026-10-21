import { Hero } from "@/components/hero";
import { ProjectBrowser } from "@/components/project-browser";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <ProjectBrowser />
    </main>
  );
}
