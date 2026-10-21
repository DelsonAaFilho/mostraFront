import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/site-header";

export async function SiteFooter() {
  "use cache";
  return (
    <footer className="site-footer page-container">
      <div className="footer-brand">
        <Logo />
        <p>Good ideas deserve to be discovered.</p>
      </div>
      <div className="footer-right">
        <span>Made for curious minds.</span>
        <Link href="/register">
          Join the community <ArrowUpRight size={14} />
        </Link>
        <span className="copyright">
          © {new Date().getFullYear()} projeto.lab
        </span>
      </div>
    </footer>
  );
}
