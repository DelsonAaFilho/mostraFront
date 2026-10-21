import Link from "next/link";
import { ArrowLeft, Telescope } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="page-container missing-project">
      <Telescope size={44} strokeWidth={1.3} />
      <span className="section-kicker">A LITTLE OFF THE MAP</span>
      <h1>There’s more to discover.</h1>
      <p>This page isn’t in the lab. Let’s get you back to the projects.</p>
      <Link href="/" className="primary-link">
        <ArrowLeft size={16} />
        Back to projects
      </Link>
    </main>
  );
}
